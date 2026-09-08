import React, { createContext, useContext, useState, useEffect } from 'react';
import { Customer, ServiceAccount, NotificationItem, NotificationPreferences, UserRole, AdminUser, SupportConcern, RegistrationRequest, SentEmail } from '../types';
import { MOCK_CUSTOMERS, MOCK_NOTIFICATIONS } from '../data/mockBillingData';
import { INITIAL_REGISTRATION_REQUESTS } from '../data/adminMockData';

const MOCK_ADMIN: AdminUser = {
  id: 'ADMIN-CEDC-01',
  name: 'Engr. Roberto Santos',
  email: 'admin@clarkelectric.ph',
  role: 'admin',
  department: 'System Operations & Public Affairs',
  title: 'Senior Utility Grid Communications Lead',
};

const INITIAL_SUPPORT_CONCERNS: SupportConcern[] = [
  {
    id: 'CONCERN-101',
    accountNumber: '0421-8812-90',
    ticketNumber: 'TK-2026-8801',
    category: 'Billing Concern',
    subject: 'High consumption charge inquiry for July',
    description: 'Noticeable jump in kWh compared to previous month. Kindly verify meter accuracy.',
    status: 'In Progress',
    createdAt: '2026-08-02 11:20 AM',
    adminName: 'Engr. Roberto Santos',
    adminResponse: 'Meter dispatch unit scheduled for field verification on Aug 05.',
    adminRespondedAt: '2026-08-03 09:15 AM',
  },
  {
    id: 'CONCERN-102',
    accountNumber: '0421-9943-11',
    ticketNumber: 'TK-2026-9923',
    category: 'Power Outage',
    subject: 'Voltage dip reported at Philexcel Business Park',
    description: 'Brief 3-second voltage sag affected server room UPS equipment.',
    status: 'Submitted',
    createdAt: '2026-08-04 08:10 AM',
  },
];

const INITIAL_SENT_EMAILS: SentEmail[] = [
  {
    id: 'MSG-2026-9081',
    to: 'eleanor.vance@philexcel.ph',
    recipientName: 'Eleanor Vance',
    subject: '[CECAp] Registration Request Approved - Your Portal Credentials',
    sender: 'CECAp Official <noreply@clarkelectric.ph>',
    body: `Dear Eleanor Vance,

Great news! Your online customer portal registration for CECAp (Clark Electric Corporation Application) has been verified and approved by our Customer Relationship Services (CRS) Administrator.

Below are your assigned login credentials to access your billing dashboard and online services:

Customer Account Code: 0421-9012-34
Temporary Password: CedcTemp#7419

For security purposes, you will be prompted to set a new personal password upon your first sign-in.

Thank you for choosing CECAp as your trusted electric utility portal.

Best regards,
CECAp Customer Care Team`,
    sentAt: 'Aug 05, 2026, 03:45 PM',
    type: 'REGISTRATION_APPROVED',
    status: 'DELIVERED',
    data: {
      accountCode: '0421-9012-34',
      tempPassword: 'CedcTemp#7419',
      requestId: 'REG-2026-001',
    },
  },
  {
    id: 'MSG-2026-9080',
    to: 'm.reyes@fontanaclark.ph',
    recipientName: 'Mark Anthony Reyes',
    subject: '[CECAp] Registration Request Received - Verification in Progress',
    sender: 'CECAp Official <noreply@clarkelectric.ph>',
    body: `Dear Mark Anthony Reyes,

We have successfully received your customer portal registration request (ID: REG-2026-002) for service address: Block 5 Lot 18, Fontana Residential Enclave, Clark Freeport Zone.

Our CRS team is currently verifying your records against our central billing database. Once verified, you will receive another email containing your portal temporary password.

Thank you for your patience.

Best regards,
CECAp Customer Care Team`,
    sentAt: 'Aug 05, 2026, 01:20 PM',
    type: 'REGISTRATION_RECEIVED',
    status: 'DELIVERED',
    data: {
      accountCode: '0421-5512-88',
      requestId: 'REG-2026-002',
    },
  },
];

interface AppContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  adminUser: AdminUser | null;
  setAdminUser: (admin: AdminUser | null) => void;
  user: Customer | null;
  setUser: React.Dispatch<React.SetStateAction<Customer | null>>;
  selectedAccount: ServiceAccount | null;
  setSelectedAccount: (acc: ServiceAccount) => void;
  linkedAccounts: ServiceAccount[];
  activeTab: 'dashboard' | 'billing' | 'support' | 'notifications' | 'profile' | 'settings' | 'admin-console';
  setActiveTab: (tab: 'dashboard' | 'billing' | 'support' | 'notifications' | 'profile' | 'settings' | 'admin-console') => void;
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  unreadNotifCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notif: NotificationItem) => void;
  createAnnouncement: (notifData: {
    title: string;
    message: string;
    type: NotificationItem['type'];
    targetAudience?: 'ALL' | 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL';
    urgency?: 'NORMAL' | 'HIGH' | 'EMERGENCY';
  }) => void;
  deleteAnnouncement: (id: string) => void;
  editAnnouncement: (id: string, updated: Partial<NotificationItem>) => void;
  supportConcerns: SupportConcern[];
  addSupportConcern: (concern: SupportConcern) => void;
  updateSupportConcernStatus: (id: string, status: SupportConcern['status'], adminNotes?: string) => void;
  biometricsEnabled: boolean;
  setBiometricsEnabled: (val: boolean) => void;
  notificationPreferences: NotificationPreferences;
  setNotificationPreferences: React.Dispatch<React.SetStateAction<NotificationPreferences>>;
  viewMode: 'mobile' | 'architecture';
  setViewMode: (mode: 'mobile' | 'architecture') => void;
  deviceFrame: 'android' | 'ios' | 'frameless';
  setDeviceFrame: (frame: 'android' | 'ios' | 'frameless') => void;
  paymentModalOpen: boolean;
  setPaymentModalOpen: (val: boolean) => void;
  refreshAccountData: () => Promise<void>;
  logout: () => void;
  biometricPromptOpen: boolean;
  setBiometricPromptOpen: (val: boolean) => void;
  biometricSuccessAction: (() => void) | null;
  triggerBiometricAuth: (onSuccess: () => void) => void;
  registrationRequests: RegistrationRequest[];
  submitRegistration: (req: { fullName: string; accountCode?: string; serviceAddress: string; mobileNumber: string; email: string; notificationChannel?: 'Email' | 'SMS' | 'Both' }) => void;
  approveRegistration: (id: string, customAccountCode?: string) => { accountCode: string; tempPassword: string };
  rejectRegistration: (id: string, reason: string) => void;

  // Sent Emails / Dispatch Hub State
  sentEmails: SentEmail[];
  sendEmail: (emailData: Omit<SentEmail, 'id' | 'sentAt' | 'status'>) => SentEmail;
  emailModalOpen: boolean;
  setEmailModalOpen: (val: boolean) => void;
  selectedEmail: SentEmail | null;
  setSelectedEmail: (email: SentEmail | null) => void;
  toastMsg: string | null;
  setToastMsg: (msg: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Logged in by default
  const [userRole, setUserRole] = useState<UserRole>('customer');
  const [adminUser, setAdminUser] = useState<AdminUser | null>(MOCK_ADMIN);
  const [user, setUser] = useState<Customer | null>(MOCK_CUSTOMERS[0]);
  const [selectedAccount, setSelectedAccountState] = useState<ServiceAccount | null>(
    MOCK_CUSTOMERS[0].linkedAccounts[0]
  );
  const [linkedAccounts, setLinkedAccounts] = useState<ServiceAccount[]>(
    MOCK_CUSTOMERS[0].linkedAccounts
  );
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'billing' | 'support' | 'notifications' | 'profile' | 'settings' | 'admin-console'
  >('dashboard');
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [supportConcerns, setSupportConcerns] = useState<SupportConcern[]>(INITIAL_SUPPORT_CONCERNS);
  const [registrationRequests, setRegistrationRequests] = useState<RegistrationRequest[]>(INITIAL_REGISTRATION_REQUESTS);

  // Email Hub State
  const [sentEmails, setSentEmails] = useState<SentEmail[]>(INITIAL_SENT_EMAILS);
  const [emailModalOpen, setEmailModalOpen] = useState<boolean>(false);
  const [selectedEmail, setSelectedEmail] = useState<SentEmail | null>(INITIAL_SENT_EMAILS[0]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [biometricsEnabled, setBiometricsEnabled] = useState<boolean>(true);
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>({
    push: true,
    sms: true,
    email: true,
    dueDateReminders: true,
    outageAlerts: true,
    promotions: false,
  });
  const [viewMode, setViewMode] = useState<'mobile' | 'architecture'>('mobile');
  const [deviceFrame, setDeviceFrame] = useState<'android' | 'ios' | 'frameless'>('ios');
  const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
  const [biometricPromptOpen, setBiometricPromptOpen] = useState<boolean>(false);
  const [biometricSuccessAction, setBiometricSuccessAction] = useState<(() => void) | null>(null);

  const unreadNotifCount = notifications.filter(n => !n.isRead).length;

  const sendEmail = (emailData: Omit<SentEmail, 'id' | 'sentAt' | 'status'>): SentEmail => {
    const newEmail: SentEmail = {
      ...emailData,
      id: `MSG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      sentAt: new Date().toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      status: 'DELIVERED',
    };
    setSentEmails(prev => [newEmail, ...prev]);
    setSelectedEmail(newEmail);
    setToastMsg(`📧 Email dispatched to ${emailData.to}!`);
    setTimeout(() => setToastMsg(null), 5000);
    return newEmail;
  };

  const setSelectedAccount = (acc: ServiceAccount) => {
    setSelectedAccountState(acc);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const addNotification = (notif: NotificationItem) => {
    setNotifications(prev => [notif, ...prev]);
  };

  // Admin announcement functions
  const createAnnouncement = (notifData: {
    title: string;
    message: string;
    type: NotificationItem['type'];
    targetAudience?: 'ALL' | 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL';
    urgency?: 'NORMAL' | 'HIGH' | 'EMERGENCY';
  }) => {
    const newNotif: NotificationItem = {
      id: `ANNC-ADMIN-${Date.now()}`,
      title: notifData.title,
      message: notifData.message,
      type: notifData.type,
      timestamp: new Date().toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      isRead: false,
      targetAudience: notifData.targetAudience || 'ALL',
      urgency: notifData.urgency || 'NORMAL',
      authorName: adminUser?.name || 'CEDC Admin Operations',
      createdByAdmin: true,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const deleteAnnouncement = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const editAnnouncement = (id: string, updated: Partial<NotificationItem>) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, ...updated } : n))
    );
  };

  const addSupportConcern = (concern: SupportConcern) => {
    setSupportConcerns(prev => [concern, ...prev]);
  };

  const updateSupportConcernStatus = (id: string, status: SupportConcern['status'], adminNotes?: string) => {
    setSupportConcerns(prev =>
      prev.map(c =>
        c.id === id
          ? {
              ...c,
              status,
              adminResponse: adminNotes || c.adminResponse,
              adminRespondedAt: new Date().toLocaleString(),
              adminName: adminUser?.name || 'CEDC Operations Admin',
            }
          : c
      )
    );
  };

  const refreshAccountData = async () => {
    if (!selectedAccount) return;
    try {
      const res = await fetch(`/api/billing/account/${encodeURIComponent(selectedAccount.accountNumber)}`);
      const data = await res.json();
      if (data.success && data.account) {
        setSelectedAccountState(data.account);
        setLinkedAccounts(data.linkedAccounts || []);
      }
    } catch (err) {
      console.warn('Refresh account error:', err);
    }
  };

  const triggerBiometricAuth = (onSuccess: () => void) => {
    setBiometricSuccessAction(() => onSuccess);
    setBiometricPromptOpen(true);
  };

  const submitRegistration = (req: { fullName: string; accountCode?: string; serviceAddress: string; mobileNumber: string; email: string; notificationChannel?: 'Email' | 'SMS' | 'Both' }) => {
    const assignedAccountCode = req.accountCode || `0421-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10 + Math.random() * 90)}`;
    const newReq: RegistrationRequest = {
      id: `REG-2026-${Math.floor(100 + Math.random() * 900)}`,
      fullName: req.fullName,
      accountCode: assignedAccountCode,
      serviceAddress: req.serviceAddress,
      mobileNumber: req.mobileNumber,
      email: req.email,
      status: 'Pending',
      submittedAt: new Date().toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      notificationChannel: req.notificationChannel || 'Email',
      matchingBillingRecord: {
        accountNumber: assignedAccountCode,
        customerName: req.fullName,
        serviceAddress: req.serviceAddress,
        mobileNumber: req.mobileNumber,
        email: req.email,
        meterNumber: `MTR-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        serviceType: 'Residential',
        accountStatus: 'Active',
        matchConfidence: 95,
      },
    };
    setRegistrationRequests(prev => [newReq, ...prev]);

    // Send confirmation email
    sendEmail({
      to: req.email,
      recipientName: req.fullName,
      subject: '[CECAp] Registration Request Received - Verification Pending',
      sender: 'CECAp Official <noreply@clarkelectric.ph>',
      body: `Dear ${req.fullName},

We have successfully received your customer portal registration request (ID: ${newReq.id}) for Account Code: ${assignedAccountCode}.

Our CRS Administrator is currently verifying your details against our central billing system database. Once verified, an auto-generated temporary password will be dispatched to your email address.

Service Address: ${req.serviceAddress}
Mobile Number: ${req.mobileNumber}

Thank you for choosing CECAp!`,
      type: 'REGISTRATION_RECEIVED',
      data: {
        accountCode: assignedAccountCode,
        requestId: newReq.id,
      },
    });
  };

  const approveRegistration = (id: string, customAccountCode?: string) => {
    const existingReq = registrationRequests.find(r => r.id === id);
    const accountCode = customAccountCode || existingReq?.accountCode || existingReq?.matchingBillingRecord?.accountNumber || `0421-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10 + Math.random() * 90)}`;
    const tempPassword = `CedcTemp#${Math.floor(1000 + Math.random() * 9000)}`;
    const nowStr = new Date().toLocaleString();

    setRegistrationRequests(prev =>
      prev.map(r => {
        if (r.id === id) {
          return {
            ...r,
            status: 'Approved',
            reviewedAt: nowStr,
            reviewedBy: adminUser?.name || 'CRS Administrator',
            accountCode,
            tempPassword,
          };
        }
        return r;
      })
    );

    // Push in-app notification for customer
    const approvedReq = registrationRequests.find(r => r.id === id);
    if (approvedReq) {
      addNotification({
        id: `NOTIF-REG-APP-${Date.now()}`,
        type: 'PAYMENT_CONFIRMATION',
        title: 'Registration Request Approved!',
        message: `Your CEDC portal registration request was verified & approved by CRS Admin. Account Code: ${accountCode}. Temp Password: ${tempPassword}. Please log in and change your password.`,
        timestamp: 'Just now',
        isRead: false,
      });

      // Dispatch Email with credentials
      sendEmail({
        to: approvedReq.email,
        recipientName: approvedReq.fullName,
        subject: '[CECAp] Registration Approved - Your Portal Login Credentials',
        sender: 'CECAp Official <noreply@clarkelectric.ph>',
        body: `Dear ${approvedReq.fullName},

Great news! Your online customer portal registration for CECAp (Clark Electric Corporation Application) has been verified and approved by our Customer Relationship Services (CRS) Administrator.

Below are your assigned login credentials to access your billing dashboard and online services:

Customer Account Code: ${accountCode}
Temporary Password: ${tempPassword}

For security purposes, you will be prompted to set a new personal password upon your first sign-in.

Thank you for choosing CECAp as your trusted electric utility portal.`,
        type: 'REGISTRATION_APPROVED',
        data: {
          accountCode,
          tempPassword,
          requestId: id,
        },
      });
    }

    return { accountCode, tempPassword };
  };

  const rejectRegistration = (id: string, reason: string) => {
    const nowStr = new Date().toLocaleString();
    const rejectedReq = registrationRequests.find(r => r.id === id);

    setRegistrationRequests(prev =>
      prev.map(r => {
        if (r.id === id) {
          return {
            ...r,
            status: 'Rejected',
            reviewedAt: nowStr,
            reviewedBy: adminUser?.name || 'CRS Administrator',
            rejectionReason: reason,
          };
        }
        return r;
      })
    );

    addNotification({
      id: `NOTIF-REG-REJ-${Date.now()}`,
      type: 'OUTAGE_EMERGENCY',
      title: 'Registration Request Rejected',
      message: `Your CEDC portal registration request was reviewed and rejected. Reason: ${reason}. Please contact customer care or submit updated information.`,
      timestamp: 'Just now',
      isRead: false,
    });

    if (rejectedReq) {
      sendEmail({
        to: rejectedReq.email,
        recipientName: rejectedReq.fullName,
        subject: '[CECAp] Registration Request Status Update',
        sender: 'CECAp Official <noreply@clarkelectric.ph>',
        body: `Dear ${rejectedReq.fullName},

Your customer portal registration request (ID: ${id}) was reviewed by our CRS Administrator and could not be verified at this time.

Reason for Rejection: ${reason}

If you believe this was in error, please re-check your Account Code and service address or contact our Customer Care hotline at (045) 599-7000.`,
        type: 'REGISTRATION_REJECTED',
        data: {
          requestId: id,
          rejectionReason: reason,
        },
      });
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setActiveTab('dashboard');
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        userRole,
        setUserRole,
        adminUser,
        setAdminUser,
        user,
        setUser,
        selectedAccount,
        setSelectedAccount,
        linkedAccounts,
        activeTab,
        setActiveTab,
        notifications,
        setNotifications,
        unreadNotifCount,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        createAnnouncement,
        deleteAnnouncement,
        editAnnouncement,
        supportConcerns,
        addSupportConcern,
        updateSupportConcernStatus,
        biometricsEnabled,
        setBiometricsEnabled,
        notificationPreferences,
        setNotificationPreferences,
        viewMode,
        setViewMode,
        deviceFrame,
        setDeviceFrame,
        paymentModalOpen,
        setPaymentModalOpen,
        refreshAccountData,
        logout,
        biometricPromptOpen,
        setBiometricPromptOpen,
        biometricSuccessAction,
        triggerBiometricAuth,
        registrationRequests,
        submitRegistration,
        approveRegistration,
        rejectRegistration,

        // Email Hub
        sentEmails,
        sendEmail,
        emailModalOpen,
        setEmailModalOpen,
        selectedEmail,
        setSelectedEmail,
        toastMsg,
        setToastMsg,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

