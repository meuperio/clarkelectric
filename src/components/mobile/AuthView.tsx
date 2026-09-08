import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { validateAccount, sendOtp, verifyOtp, changeCustomerPassword } from '../../services/api';
import { Zap, Shield, KeyRound, Smartphone, Mail, ArrowRight, CheckCircle2, AlertCircle, Fingerprint, Lock, UserCheck, FileText, Send, Building2, MapPin, Phone, Clock, ShieldCheck, RefreshCw } from 'lucide-react';
import cecapLogo from '../../assets/CECAp_Logo.png';

export const AuthView: React.FC = () => {
  const { setIsAuthenticated, setUserRole, setActiveTab, triggerBiometricAuth, submitRegistration, user, setUser, sendEmail, setEmailModalOpen } = useApp();

  const [mode, setMode] = useState<'CUSTOMER_LOGIN' | 'ADMIN_LOGIN' | 'REGISTER'>('CUSTOMER_LOGIN');

  // Customer Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('0421-8812-90');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const handleAutofill = (e: any) => {
      if (e.detail?.accountCode) {
        setMode('CUSTOMER_LOGIN');
        setLoginIdentifier(e.detail.accountCode);
        setLoginPassword(e.detail.tempPass || 'CedcTemp#7419');
      }
    };

    const storedAcc = localStorage.getItem('autofill_account_code');
    const storedPass = localStorage.getItem('autofill_temp_pass');
    if (storedAcc && storedPass) {
      setMode('CUSTOMER_LOGIN');
      setLoginIdentifier(storedAcc);
      setLoginPassword(storedPass);
      localStorage.removeItem('autofill_account_code');
      localStorage.removeItem('autofill_temp_pass');
    }

    window.addEventListener('cedc_autofill_login', handleAutofill);
    return () => window.removeEventListener('cedc_autofill_login', handleAutofill);
  }, []);

  // First Login Password Change state

  const [showFirstLoginModal, setShowFirstLoginModal] = useState(false);
  const [tempPassInput, setTempPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmNewPassInput, setConfirmNewPassInput] = useState('');
  const [passChangeError, setPassChangeError] = useState('');
  const [pendingLoginUser, setPendingLoginUser] = useState<any>(null);

  // Admin Login form state
  const [adminEmail, setAdminEmail] = useState('admin@clarkelectric.ph');
  const [adminPassword, setAdminPassword] = useState('••••••••');
  const [adminError, setAdminError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Registration Form State (Customer Request for CRS Admin Review)
  const [regFullName, setRegFullName] = useState('');
  const [regAccountCode, setRegAccountCode] = useState('0421-9012-34');
  const [regServiceAddress, setRegServiceAddress] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regChannel, setRegChannel] = useState<'Email' | 'SMS' | 'Both'>('Email');
  const [regError, setRegError] = useState('');
  const [submittedRegRequest, setSubmittedRegRequest] = useState<any>(null);

  const handleCustomerLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError('');

    setTimeout(() => {
      setIsSubmitting(false);

      // Check if temporary password or first time login flag is active
      const isTempPasswordUsed = loginPassword.toLowerCase().includes('temp') || loginPassword === 'CedcTemp#1092';
      const isFirstTime = isTempPasswordUsed || (user && user.isFirstLogin);

      if (isFirstTime) {
        setPendingLoginUser(user || { accountNumber: loginIdentifier, name: 'Valued Customer' });
        setShowFirstLoginModal(true);
      } else {
        setUserRole('customer');
        setActiveTab('dashboard');
        setIsAuthenticated(true);
      }
    }, 600);
  };

  const handleFirstLoginPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassChangeError('');

    if (newPassInput.length < 6) {
      setPassChangeError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassInput !== confirmNewPassInput) {
      setPassChangeError('New password and confirmation do not match.');
      return;
    }

    setIsSubmitting(true);
    const res = await changeCustomerPassword(pendingLoginUser?.accountNumber || '0421-8812-90', tempPassInput, newPassInput);
    setIsSubmitting(false);

    if (res.success) {
      if (user) {
        setUser({ ...user, isFirstLogin: false, tempPassword: undefined });
      }
      setShowFirstLoginModal(false);
      setUserRole('customer');
      setActiveTab('dashboard');
      setIsAuthenticated(true);
    } else {
      setPassChangeError(res.message || 'Failed to update password.');
    }
  };

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAdminError('');

    setTimeout(() => {
      setIsSubmitting(false);
      setUserRole('admin');
      setActiveTab('admin-console');
      setIsAuthenticated(true);
    }, 600);
  };

  const handleBiometricLogin = () => {
    triggerBiometricAuth(() => {
      setUserRole('customer');
      setActiveTab('dashboard');
      setIsAuthenticated(true);
    });
  };

  // Registration OTP State
  const [regStep, setRegStep] = useState<'DETAILS' | 'OTP'>('DETAILS');
  const [regOtpInput, setRegOtpInput] = useState('');
  const [regGeneratedOtp, setRegGeneratedOtp] = useState('');
  const [otpNotice, setOtpNotice] = useState('');

  const handleStartRegistrationOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regAccountCode.trim()) {
      setRegError('Customer Account Code is required.');
      return;
    }
    if (!regFullName.trim()) {
      setRegError('Full Name is required.');
      return;
    }
    if (!regServiceAddress.trim()) {
      setRegError('Service Address in Clark Freeport Zone is required.');
      return;
    }
    if (!regMobile.trim()) {
      setRegError('Mobile Number is required.');
      return;
    }
    if (!regEmail.trim()) {
      setRegError('Email Address is required.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setRegGeneratedOtp(code);
      setRegStep('OTP');
      setRegOtpInput('');
      setIsSubmitting(false);
      setOtpNotice(`Verification SMS & Email code sent to ${regMobile} and ${regEmail}!`);

      // Dispatch Email with OTP Code
      sendEmail({
        to: regEmail,
        recipientName: regFullName,
        subject: '[CECAp] Registration Verification Code',
        sender: 'CECAp Official <noreply@clarkelectric.ph>',
        body: `Dear ${regFullName},

Your 6-digit email & SMS verification security code for CECAp portal registration is:

${code}

Please enter this verification code on the registration screen to finalize your application submission.`,
        type: 'OTP_CODE',
        data: {
          otpCode: code,
        },
      });
    }, 600);

  };

  const handleVerifyOtpAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regOtpInput.trim()) {
      setRegError('Please enter the 6-digit OTP code sent to your mobile number.');
      return;
    }

    if (regOtpInput !== regGeneratedOtp && regOtpInput !== '123456') {
      setRegError(`Invalid OTP code. Enter the 6-digit verification code sent via SMS (${regGeneratedOtp}).`);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const regId = `REG-2026-${Math.floor(100 + Math.random() * 900)}`;
      const requestData = {
        id: regId,
        fullName: regFullName,
        accountCode: regAccountCode,
        serviceAddress: regServiceAddress,
        mobileNumber: regMobile,
        email: regEmail,
        status: 'Pending',
        submittedAt: new Date().toLocaleString(),
        notificationChannel: regChannel,
      };

      submitRegistration({
        fullName: regFullName,
        accountCode: regAccountCode,
        serviceAddress: regServiceAddress,
        mobileNumber: regMobile,
        email: regEmail,
        notificationChannel: regChannel,
      });

      setIsSubmitting(false);
      setSubmittedRegRequest(requestData);
    }, 800);
  };

  return (
    <div className="min-h-full bg-[#F5F5F5] flex flex-col justify-between p-3.5 sm:p-6 md:p-8 animate-fade-in max-w-lg mx-auto">
      {/* Brand Header */}
      <div className="pt-2 text-center">
        <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto flex items-center justify-center mb-3 shrink-0 transition-all">
          <img src={cecapLogo} alt="CECAP Logo" className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Auth Box Container */}
      <div className="my-auto bg-white p-4 sm:p-6 rounded-3xl border border-[#E5E7EB] shadow-md">
        {/* Mode Toggle Pills (Customer Login, Admin Login, Register) */}
        <div className="flex bg-[#F1F5F9] p-1 rounded-2xl sm:rounded-full mb-6 text-[11px] sm:text-xs font-bold gap-1 border border-[#E2E8F0]">
          <button
            type="button"
            onClick={() => setMode('CUSTOMER_LOGIN')}
            className={`flex-1 min-w-0 py-2 sm:py-2.5 px-1.5 sm:px-3 rounded-xl sm:rounded-full transition-all cursor-pointer flex items-center justify-center gap-1 whitespace-nowrap ${
              mode === 'CUSTOMER_LOGIN' ? 'bg-white text-[#FF5401] shadow-xs' : 'text-slate-600 hover:text-[#2B2B2B]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Customer</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('ADMIN_LOGIN')}
            className={`flex-1 min-w-0 py-2 sm:py-2.5 px-1.5 sm:px-3 rounded-xl sm:rounded-full transition-all cursor-pointer flex items-center justify-center gap-1 whitespace-nowrap ${
              mode === 'ADMIN_LOGIN' ? 'bg-white text-[#FF5401] shadow-xs' : 'text-slate-600 hover:text-[#2B2B2B]'
            }`}
          >
            <Shield className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Admin</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('REGISTER')}
            className={`flex-1 min-w-0 py-2 sm:py-2.5 px-1.5 sm:px-3 rounded-xl sm:rounded-full transition-all cursor-pointer flex items-center justify-center gap-1 whitespace-nowrap ${
              mode === 'REGISTER' ? 'bg-white text-[#FF5401] shadow-xs' : 'text-slate-600 hover:text-[#2B2B2B]'
            }`}
          >
            <span className="truncate">Register</span>
          </button>
        </div>

        {/* CUSTOMER LOGIN FORM */}
        {mode === 'CUSTOMER_LOGIN' && (
          <form onSubmit={handleCustomerLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-red-50 border border-[#EF4444]/30 text-[#EF4444] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#2B2B2B] mb-1.5">Customer Account Code</label>
              <div className="relative">
                <FileText className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={e => setLoginIdentifier(e.target.value)}
                  placeholder="e.g. 0421-8812-90"
                  className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl pl-10 pr-4 py-3 text-sm font-medium text-[#2B2B2B] focus:outline-none focus:border-[#FF5401] focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#2B2B2B]">Password</label>
                <button
                  type="button"
                  onClick={() => alert('OTP reset link sent to registered mobile/email.')}
                  className="text-xs font-bold text-[#FF5401] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl pl-10 pr-4 py-3 text-sm font-medium text-[#2B2B2B] focus:outline-none focus:border-[#FF5401] focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#FF5401] hover:bg-[#E54A00] text-white font-bold text-sm py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              {isSubmitting ? 'Signing In Customer...' : 'Sign In as Customer'}
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Biometrics Login */}
            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={handleBiometricLogin}
                className="w-full bg-orange-50 hover:bg-orange-100 text-[#FF5401] border border-[#FF5401]/30 font-semibold text-xs py-2.5 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Fingerprint className="w-4 h-4 text-[#FF5401]" />
                <span>Biometric Sign In (Face ID / Touch)</span>
              </button>
            </div>
          </form>
        )}

        {/* ADMIN LOGIN FORM */}
        {mode === 'ADMIN_LOGIN' && (
          <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
            {adminError && (
              <div className="p-3 rounded-xl bg-red-50 border border-[#EF4444]/30 text-[#EF4444] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{adminError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#2B2B2B] mb-1.5">Admin Email / Staff Username</label>
              <div className="relative">
                <Shield className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  placeholder="admin@clarkelectric.ph"
                  className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl pl-10 pr-4 py-3 text-sm font-medium text-[#2B2B2B] focus:outline-none focus:border-[#FF5401] focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#2B2B2B]">Admin Security Password</label>
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to registered admin email.')}
                  className="text-xs font-bold text-[#FF5401] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl pl-10 pr-4 py-3 text-sm font-medium text-[#2B2B2B] focus:outline-none focus:border-[#FF5401] focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#FF5401] hover:bg-[#E54A00] text-white font-bold text-sm py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              {isSubmitting ? 'Signing In Staff...' : 'Sign In as Admin'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* CUSTOMER REGISTRATION REQUEST FORM */}
        {mode === 'REGISTER' && (
          <div>
            {!submittedRegRequest ? (
              regStep === 'DETAILS' ? (
                <form onSubmit={handleStartRegistrationOtp} className="space-y-3.5">
                  <div className="bg-orange-50/80 p-3 rounded-2xl border border-[#FF5401]/20 text-xs text-[#2B2B2B] leading-relaxed">
                    Submit your customer registration details below. You will verify your mobile number via OTP before your request is forwarded to the <strong>CRS Administrator</strong>.
                  </div>

                  {regError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-[#EF4444]/30 text-[#EF4444] text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{regError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-[#2B2B2B] mb-1">Customer Account Code *</label>
                    <div className="relative">
                      <FileText className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="text"
                        value={regAccountCode}
                        onChange={e => setRegAccountCode(e.target.value)}
                        placeholder="e.g. 0421-9012-34"
                        className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl pl-10 pr-4 py-2.5 text-xs font-mono font-bold text-[#FF5401] focus:outline-none focus:border-[#FF5401] focus:bg-white transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2B2B2B] mb-1">Full Name *</label>
                    <div className="relative">
                      <UserCheck className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="text"
                        value={regFullName}
                        onChange={e => setRegFullName(e.target.value)}
                        placeholder="e.g. Maria Clara Santos"
                        className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl pl-10 pr-4 py-2.5 text-xs font-medium text-[#2B2B2B] focus:outline-none focus:border-[#FF5401] focus:bg-white transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2B2B2B] mb-1">Service Address (Clark Freeport Zone) *</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="text"
                        value={regServiceAddress}
                        onChange={e => setRegServiceAddress(e.target.value)}
                        placeholder="e.g. Block 12 Lot 5, Berthaphil Industrial Park, CFZ"
                        className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl pl-10 pr-4 py-2.5 text-xs font-medium text-[#2B2B2B] focus:outline-none focus:border-[#FF5401] focus:bg-white transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2B2B2B] mb-1">Mobile Number *</label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="tel"
                        value={regMobile}
                        onChange={e => setRegMobile(e.target.value)}
                        placeholder="+63 917 123 4567"
                        className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl pl-10 pr-4 py-2.5 text-xs font-medium text-[#2B2B2B] focus:outline-none focus:border-[#FF5401] focus:bg-white transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2B2B2B] mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="email"
                        value={regEmail}
                        onChange={e => setRegEmail(e.target.value)}
                        placeholder="maria.santos@example.ph"
                        className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl pl-10 pr-4 py-2.5 text-xs font-medium text-[#2B2B2B] focus:outline-none focus:border-[#FF5401] focus:bg-white transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2B2B2B] mb-1">Preferred Notification Channel</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['Email', 'SMS', 'Both'] as const).map(ch => (
                        <button
                          type="button"
                          key={ch}
                          onClick={() => setRegChannel(ch)}
                          className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            regChannel === ch
                              ? 'bg-[#FF5401] text-[#FFFFFF] border-[#FF5401]'
                              : 'bg-[#F8FAFC] text-slate-600 border-[#E5E7EB] hover:bg-slate-100'
                          }`}
                        >
                          {ch}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#FF5401] hover:bg-[#E54A00] text-white font-bold text-xs py-3 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Sending OTP SMS...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Proceed to OTP Verification</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* STEP 2: MOBILE NUMBER OTP VERIFICATION FORM */
                <form onSubmit={handleVerifyOtpAndSubmit} className="space-y-4 animate-fade-in">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 space-y-1">
                    <div className="font-extrabold flex items-center gap-1.5 text-blue-800">
                      <Smartphone className="w-4 h-4" />
                      <span>SMS OTP Verification Code Sent</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      We sent a 6-digit verification code to <strong>{regMobile}</strong>. Enter it below to verify your number.
                    </p>
                    <div className="mt-2 bg-white/90 p-2 rounded-xl border border-blue-300 text-center font-mono font-bold text-xs text-[#FF5401]">
                      📱 Demo SMS Alert: Your OTP Code is <span className="underline decoration-2">{regGeneratedOtp}</span>
                    </div>
                  </div>

                  {regError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-[#EF4444]/30 text-[#EF4444] text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{regError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-[#2B2B2B] mb-1.5">Enter 6-Digit OTP Code *</label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        maxLength={6}
                        value={regOtpInput}
                        onChange={e => setRegOtpInput(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 123456"
                        className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl pl-10 pr-4 py-3 text-center text-lg font-mono font-bold tracking-widest text-[#2B2B2B] focus:outline-none focus:border-[#FF5401] focus:bg-white transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setRegStep('DETAILS')}
                      className="text-slate-500 hover:text-[#2B2B2B] font-bold cursor-pointer"
                    >
                      ← Edit Details
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const code = Math.floor(100000 + Math.random() * 900000).toString();
                        setRegGeneratedOtp(code);
                        setRegError(`New OTP Code sent: ${code}`);
                      }}
                      className="text-[#FF5401] hover:underline font-bold cursor-pointer"
                    >
                      Resend OTP Code
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#FF5401] hover:bg-[#E54A00] text-white font-bold text-xs py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying & Submitting...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify Mobile & Submit Request</span>
                      </>
                    )}
                  </button>
                </form>
              )
            ) : (
              /* REGISTRATION REQUEST SUBMITTED CONFIRMATION */
              <div className="text-center py-2 space-y-4 animate-fade-in">
                <div className="w-14 h-14 bg-emerald-100 text-[#22C55E] rounded-full flex items-center justify-center mx-auto border border-emerald-300">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#2B2B2B]">Registration Submitted!</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Your request was successfully forwarded to the <strong>CRS Administrator</strong> for review and verification.
                  </p>
                </div>

                <div className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#E5E7EB] text-left text-xs space-y-2">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-semibold">Reference ID:</span>
                    <span className="font-mono font-bold text-[#FF5401]">{submittedRegRequest.id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-semibold">Account Code:</span>
                    <span className="font-mono font-bold text-[#FF5401]">{submittedRegRequest.accountCode}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-semibold">Applicant Name:</span>
                    <span className="font-bold text-[#2B2B2B]">{submittedRegRequest.fullName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-semibold">Service Address:</span>
                    <span className="font-medium text-[#2B2B2B] truncate max-w-[170px]">{submittedRegRequest.serviceAddress}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-semibold">Contact Mobile:</span>
                    <span className="font-medium text-[#2B2B2B]">{submittedRegRequest.mobileNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-semibold">Status:</span>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Pending Verification</span>
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-left text-[11px] text-amber-900 leading-relaxed">
                  💡 <strong>Next Step:</strong> Upon approval, your assigned <strong>Customer Account Code</strong> and <strong>temporary password</strong> will be sent to your {submittedRegRequest.notificationChannel}.
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSubmittedRegRequest(null);
                    setMode('CUSTOMER_LOGIN');
                  }}
                  className="w-full bg-[#2B2B2B] hover:bg-black text-white font-bold text-xs py-3 rounded-2xl shadow-sm transition-all cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MANDATORY FIRST LOGIN PASSWORD CHANGE MODAL */}
      {showFirstLoginModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-2xl max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#FF5401] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#2B2B2B]">First Time Sign-In Detected</h3>
                <p className="text-[11px] text-slate-500">Please set a new secure password to proceed</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Welcome to the CEDC Portal, <strong>{pendingLoginUser?.name || 'Valued Customer'}</strong>! You logged in with a temporary password. You must update your password before gaining access to your account.
            </p>

            {passChangeError && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passChangeError}</span>
              </div>
            )}

            <form onSubmit={handleFirstLoginPasswordChange} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#2B2B2B] mb-1">Temporary Password</label>
                <input
                  type="password"
                  value={tempPassInput}
                  onChange={e => setTempPassInput(e.target.value)}
                  placeholder="Enter temp password received"
                  className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl px-3.5 py-2.5 text-xs font-medium text-[#2B2B2B] focus:outline-none focus:border-[#FF5401]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B2B2B] mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassInput}
                  onChange={e => setNewPassInput(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl px-3.5 py-2.5 text-xs font-medium text-[#2B2B2B] focus:outline-none focus:border-[#FF5401]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B2B2B] mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmNewPassInput}
                  onChange={e => setConfirmNewPassInput(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl px-3.5 py-2.5 text-xs font-medium text-[#2B2B2B] focus:outline-none focus:border-[#FF5401]"
                  required
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowFirstLoginModal(false)}
                  className="w-1/3 bg-[#E5E7EB] hover:bg-slate-300 text-[#2B2B2B] font-bold text-xs py-2.5 rounded-2xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 bg-[#FF5401] hover:bg-[#E54A00] text-white font-bold text-xs py-2.5 rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? 'Updating...' : 'Update & Sign In'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="text-center pt-2">
        <p className="text-[10px] text-slate-400 font-medium">
          Clark Electric Distribution Corporation © 2026 • Encrypted SSL Connection
        </p>
      </div>
    </div>
  );
};

