import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { linkServiceAccount } from '../../services/api';
import cecapLogo from '../../assets/CECAp_Logo.png';
import {
  User,
  Mail,
  Smartphone,
  MapPin,
  Building2,
  Plus,
  CheckCircle2,
  ShieldCheck,
  Edit3,
  X,
  Zap,
  Fingerprint,
  Lock,
  Bell,
  Shield,
  Info,
  LogOut,
  FileText,
  Download,
  CreditCard,
  Hash,
  Activity,
  Calendar,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const AccountInfoView: React.FC = () => {
  const {
    user,
    setUser,
    selectedAccount,
    linkedAccounts,
    refreshAccountData,
    biometricsEnabled,
    setBiometricsEnabled,
    notificationPreferences,
    setNotificationPreferences,
    logout,
  } = useApp();

  // Contact Info Editing State
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [emailInput, setEmailInput] = useState(user?.email || '');
  const [mobileInput, setMobileInput] = useState(user?.mobileNumber || '');
  const [savedSuccessMsg, setSavedSuccessMsg] = useState('');

  // Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMsg, setPassMsg] = useState('');

  // Linking Account Modal State
  const [isLinkingModalOpen, setIsLinkingModalOpen] = useState(false);
  const [newAccNum, setNewAccNum] = useState('');
  const [newMeterNum, setNewMeterNum] = useState('');
  const [newAccNickname, setNewAccNickname] = useState('');
  const [linkMsg, setLinkMsg] = useState('');
  const [isLinkingLoading, setIsLinkingLoading] = useState(false);

  // Info Modals
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // Collapsible Dropdown Accordion States (hidden by default)
  const [isAccountSpecOpen, setIsAccountSpecOpen] = useState(false);
  const [isLinkedAccountsOpen, setIsLinkedAccountsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleSaveContact = () => {
    if (user) {
      setUser({
        ...user,
        email: emailInput,
        mobileNumber: mobileInput,
      });
      setIsEditingContact(false);
      setSavedSuccessMsg('✅ Account contact details updated successfully.');
      setTimeout(() => setSavedSuccessMsg(''), 3500);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 6) {
      setPassMsg('New password must be at least 6 characters.');
      return;
    }
    if (newPass !== confirmPass) {
      setPassMsg('Passwords do not match.');
      return;
    }
    setPassMsg('Password updated successfully!');
    setTimeout(() => {
      setIsPasswordModalOpen(false);
      setPassMsg('');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    }, 1200);
  };

  const handleLinkAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccNum) return;

    setIsLinkingLoading(true);
    setLinkMsg('');

    const res = await linkServiceAccount(newAccNum, newMeterNum, newAccNickname);
    setIsLinkingLoading(false);

    if (res.success) {
      setLinkMsg(res.message || 'Service Account linked successfully!');
      setTimeout(() => {
        setIsLinkingModalOpen(false);
        setLinkMsg('');
        setNewAccNum('');
        setNewMeterNum('');
        setNewAccNickname('');
        refreshAccountData();
      }, 1000);
    } else {
      setLinkMsg(res.message || 'Failed to link account.');
    }
  };

  if (!user || !selectedAccount) return null;

  return (
    <div className="space-y-6 animate-fade-in pb-20 md:pb-12 w-full">
      {/* Toast Banner */}
      {savedSuccessMsg && (
        <div className="bg-[#22C55E] text-white p-3.5 rounded-2xl shadow-lg font-bold text-xs flex items-center justify-between transition-all">
          <span>{savedSuccessMsg}</span>
          <button onClick={() => setSavedSuccessMsg('')} className="text-white hover:text-slate-100">✕</button>
        </div>
      )}

      {/* Account Header Overview Banner */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5E7EB] shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-100 text-[#FF5401] font-extrabold text-2xl rounded-3xl flex items-center justify-center border-4 border-white shadow-md shrink-0">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-[#2B2B2B]">{user.name}</h2>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => setIsLinkingModalOpen(true)}
              className="bg-[#FF5401] hover:bg-[#E54A00] text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Link Account</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: System Account Details & Preferences */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Utility Service Account Information */}
        <div className="lg:col-span-7 space-y-6">
          {/* Master Utility Account Record */}
          <div className="bg-white rounded-3xl p-5 md:p-6 border border-[#E5E7EB] shadow-xs space-y-4">
            <div
              onClick={() => setIsAccountSpecOpen(!isAccountSpecOpen)}
              className={`flex items-center justify-between cursor-pointer select-none transition-all ${
                isAccountSpecOpen ? 'border-b border-[#E5E7EB] pb-3' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 flex items-center justify-center shrink-0">
                  <img src={cecapLogo} alt="CECAP Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#2B2B2B]"> Service Account</h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-[#2B2B2B] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase">
                  {selectedAccount.serviceType}
                </span>
                <button type="button" className="text-slate-400 hover:text-[#FF5401] transition-colors p-1 cursor-pointer">
                  {isAccountSpecOpen ? <ChevronUp className="w-5 h-5 text-[#FF5401]" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {isAccountSpecOpen && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1 animate-fade-in">
                <div className="bg-[#F5F5F5] p-3.5 rounded-2xl border border-[#E5E7EB] space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Account Number</span>
                  <span className="font-mono font-bold text-sm text-[#FF5401]">{selectedAccount.accountNumber}</span>
                </div>

                <div className="bg-[#F5F5F5] p-3.5 rounded-2xl border border-[#E5E7EB] space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Service Type</span>
                  <span className="font-bold text-sm text-[#2B2B2B] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FF5401]"></span>
                    {selectedAccount.serviceType}
                  </span>
                </div>

                <div className="bg-[#F5F5F5] p-3.5 rounded-2xl border border-[#E5E7EB] space-y-1 sm:col-span-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Service Address</span>
                  <div className="font-bold text-[#2B2B2B] flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#FF5401] shrink-0 mt-0.5" />
                    <span>{selectedAccount.serviceAddress}</span>
                  </div>
                </div>

                <div className="bg-[#F5F5F5] p-3.5 rounded-2xl border border-[#E5E7EB] space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Smart Meter Serial</span>
                  <span className="font-mono font-bold text-sm text-[#2B2B2B]">{selectedAccount.meterNumber}</span>
                </div>

                <div className="bg-[#F5F5F5] p-3.5 rounded-2xl border border-[#E5E7EB] space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Rate Schedule Class</span>
                  <span className="font-bold text-[#2B2B2B]">Residential Regular (PhP 10.45/kWh)</span>
                </div>

                <div className="bg-[#F5F5F5] p-3.5 rounded-2xl border border-[#E5E7EB] space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Grid Feeder Line</span>
                  <span className="font-bold text-[#2B2B2B]">Substation 03 - Feeder 4B</span>
                </div>

                <div className="bg-[#F5F5F5] p-3.5 rounded-2xl border border-[#E5E7EB] space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Account Standing</span>
                  <span className="font-bold text-[#22C55E] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Good Standing (Active)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Linked Accounts List */}
          <div className="bg-white rounded-3xl p-5 md:p-6 border border-[#E5E7EB] shadow-xs space-y-4">
            <div
              onClick={() => setIsLinkedAccountsOpen(!isLinkedAccountsOpen)}
              className={`flex items-center justify-between cursor-pointer select-none transition-all ${
                isLinkedAccountsOpen ? 'border-b border-[#E5E7EB] pb-3' : ''
              }`}
            >
              <div>
                <h3 className="text-sm font-extrabold text-[#2B2B2B]">Linked Service Accounts</h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLinkingModalOpen(true);
                  }}
                  className="text-xs font-bold text-[#FF5401] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Meter
                </button>
                <button type="button" className="text-slate-400 hover:text-[#FF5401] transition-colors p-1 cursor-pointer">
                  {isLinkedAccountsOpen ? <ChevronUp className="w-5 h-5 text-[#FF5401]" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {isLinkedAccountsOpen && (
              <div className="space-y-3 pt-1 animate-fade-in">
                {linkedAccounts.map(acc => (
                  <div
                    key={acc.accountNumber}
                    className={`p-4 rounded-2xl border transition-all space-y-2 ${
                      acc.accountNumber === selectedAccount.accountNumber
                        ? 'bg-orange-50/70 border-[#FF5401]/40 shadow-xs'
                        : 'bg-white border-[#E5E7EB] hover:bg-[#F5F5F5]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-xs md:text-sm text-[#2B2B2B]">{acc.nickname || 'Service Account'}</h4>
                        {acc.isPrimary && (
                          <span className="bg-[#FF5401] text-white text-[9px] font-black px-2 py-0.5 rounded uppercase">
                            PRIMARY
                          </span>
                        )}
                      </div>
                      <span className="bg-[#F5F5F5] text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-[#E5E7EB]">
                        {acc.serviceType}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-1 pt-1">
                      <p className="font-mono font-bold text-[#FF5401]">Acc #{acc.accountNumber}</p>
                      <p className="text-[11px] text-slate-500">Meter #{acc.meterNumber}</p>
                    </div>

                    <p className="text-[11px] text-slate-500 flex items-center gap-1 pt-1 border-t border-[#E5E7EB]/60">
                      <MapPin className="w-3 h-3 text-[#FF5401] shrink-0" />
                      <span>{acc.serviceAddress}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Contact Details, Portal Security & Preferences */}
        <div className="lg:col-span-5 space-y-6">
          {/* Contact Information Card */}
          <div className="bg-white rounded-3xl p-5 md:p-6 border border-[#E5E7EB] shadow-xs space-y-4">
            <div
              onClick={() => setIsContactOpen(!isContactOpen)}
              className={`flex justify-between items-center cursor-pointer select-none transition-all ${
                isContactOpen ? 'border-b border-[#E5E7EB] pb-3' : ''
              }`}
            >
              <div>
                <h3 className="text-sm font-extrabold text-[#2B2B2B]">Contact</h3>
              </div>

              <div className="flex items-center gap-3">
                {!isEditingContact ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isContactOpen) setIsContactOpen(true);
                      setIsEditingContact(true);
                    }}
                    className="text-xs font-bold text-[#FF5401] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveContact();
                    }}
                    className="text-xs font-bold text-[#22C55E] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Save Changes
                  </button>
                )}
                <button type="button" className="text-slate-400 hover:text-[#FF5401] transition-colors p-1 cursor-pointer">
                  {isContactOpen ? <ChevronUp className="w-5 h-5 text-[#FF5401]" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {isContactOpen && (
              <div className="space-y-3 text-xs pt-1 animate-fade-in">
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Registered Email Address</label>
                  {isEditingContact ? (
                    <input
                      type="email"
                      value={emailInput}
                      onChange={e => setEmailInput(e.target.value)}
                      className="w-full bg-[#F5F5F5] border border-[#E5E7EB] rounded-2xl p-3 text-xs text-[#2B2B2B] font-semibold focus:outline-none focus:border-[#FF5401]"
                    />
                  ) : (
                    <div className="flex items-center gap-2.5 font-bold text-[#2B2B2B] bg-[#F5F5F5] p-3 rounded-2xl border border-[#E5E7EB]">
                      <Mail className="w-4 h-4 text-[#FF5401]" />
                      <span>{user.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Mobile Number (SMS Notification Target)</label>
                  {isEditingContact ? (
                    <input
                      type="text"
                      value={mobileInput}
                      onChange={e => setMobileInput(e.target.value)}
                      className="w-full bg-[#F5F5F5] border border-[#E5E7EB] rounded-2xl p-3 text-xs text-[#2B2B2B] font-semibold focus:outline-none focus:border-[#FF5401]"
                    />
                  ) : (
                    <div className="flex items-center gap-2.5 font-bold text-[#2B2B2B] bg-[#F5F5F5] p-3 rounded-2xl border border-[#E5E7EB]">
                      <Smartphone className="w-4 h-4 text-[#FF5401]" />
                      <span>{user.mobileNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>



          {/* About & Privacy Links */}
          <div className="bg-white rounded-3xl p-5 border border-[#E5E7EB] shadow-xs space-y-2 text-xs font-semibold text-[#2B2B2B]">
            <button
              onClick={() => setIsAboutModalOpen(true)}
              className="w-full flex items-center justify-between py-2 hover:text-[#FF5401] cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#FF5401]" />
                <span>About</span>
              </div>
              <span>→</span>
            </button>

            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="w-full flex items-center justify-between py-2 border-t border-[#E5E7EB] hover:text-[#FF5401] cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#FF5401]" />
                <span>Policy</span>
              </div>
              <span>→</span>
            </button>

            <button
              onClick={logout}
              className="w-full mt-3 bg-rose-50 hover:bg-rose-100 text-[#EF4444] font-bold py-3.5 rounded-2xl border border-rose-200 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-2xl border border-[#E5E7EB] relative">
            <button onClick={() => setIsPasswordModalOpen(false)} className="absolute top-4 right-4 text-slate-400 p-1 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-bold text-[#2B2B2B] text-base">Change Password</h3>

            {passMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-50 text-[#22C55E] text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                <span>{passMsg}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#2B2B2B] mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPass}
                  onChange={e => setCurrentPass(e.target.value)}
                  className="w-full bg-[#F5F5F5] border border-[#E5E7EB] rounded-xl p-2.5 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#FF5401]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#2B2B2B] mb-1">New Password</label>
                <input
                  type="password"
                  value={newPass}
                  onChange={e => setNewPass(e.target.value)}
                  className="w-full bg-[#F5F5F5] border border-[#E5E7EB] rounded-xl p-2.5 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#FF5401]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#2B2B2B] mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPass}
                  onChange={e => setConfirmPass(e.target.value)}
                  className="w-full bg-[#F5F5F5] border border-[#E5E7EB] rounded-xl p-2.5 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#FF5401]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#FF5401] hover:bg-[#E54A00] text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}

      {/* LINK SERVICE ACCOUNT MODAL */}
      {isLinkingModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-[#E5E7EB] relative">
            <button
              onClick={() => setIsLinkingModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="font-bold text-[#2B2B2B] text-base">Link Service Account</h3>
              <p className="text-xs text-slate-500">Connect another Clark Electric meter to your customer record</p>
            </div>

            {linkMsg && (
              <div className="p-3 rounded-xl bg-orange-50 border border-[#FF5401]/30 text-[#2B2B2B] text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF5401]" />
                <span>{linkMsg}</span>
              </div>
            )}

            <form onSubmit={handleLinkAccountSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#2B2B2B] mb-1">CEDC Service Account Number</label>
                <input
                  type="text"
                  value={newAccNum}
                  onChange={e => setNewAccNum(e.target.value)}
                  placeholder="e.g. 0421-9943-11"
                  className="w-full bg-[#F5F5F5] border border-[#E5E7EB] rounded-xl p-2.5 text-xs text-[#2B2B2B] font-mono font-bold focus:outline-none focus:border-[#FF5401]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B2B2B] mb-1">Meter Serial Number (Verification)</label>
                <input
                  type="text"
                  value={newMeterNum}
                  onChange={e => setNewMeterNum(e.target.value)}
                  placeholder="e.g. MTR-2025-44012"
                  className="w-full bg-[#F5F5F5] border border-[#E5E7EB] rounded-xl p-2.5 text-xs text-[#2B2B2B] font-mono focus:outline-none focus:border-[#FF5401]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B2B2B] mb-1">Account Nickname (Optional)</label>
                <input
                  type="text"
                  value={newAccNickname}
                  onChange={e => setNewAccNickname(e.target.value)}
                  placeholder="e.g. Freeport Office / Warehouse"
                  className="w-full bg-[#F5F5F5] border border-[#E5E7EB] rounded-xl p-2.5 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#FF5401]"
                />
              </div>

              <button
                type="submit"
                disabled={isLinkingLoading}
                className="w-full bg-[#FF5401] hover:bg-[#E54A00] text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all cursor-pointer"
              >
                {isLinkingLoading ? 'Verifying Meter Records...' : 'Verify & Link Account'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ABOUT MODAL */}
      {isAboutModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-2xl border border-slate-100 relative">
            <button onClick={() => setIsAboutModalOpen(false)} className="absolute top-4 right-4 text-slate-400 p-1">
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-bold text-slate-900 text-base">About Clark Electric</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Clark Electric Distribution Corporation (CEDC) is the primary electric distribution utility servicing the Clark Freeport Zone in Pampanga, Philippines. CEDC operates high-reliability underground sub-transmission lines, automated digital substations, and smart grid meters.
            </p>
            <p className="text-[11px] text-slate-400 font-mono">App Version: 2.4.0 • Build 2026.08</p>
          </div>
        </div>
      )}

      {/* PRIVACY MODAL */}
      {isPrivacyModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-2xl border border-slate-100 relative max-h-[80vh] overflow-y-auto">
            <button onClick={() => setIsPrivacyModalOpen(false)} className="absolute top-4 right-4 text-slate-400 p-1">
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-bold text-slate-900 text-base">Privacy Policy & Compliance</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              In accordance with the Philippine Data Privacy Act of 2012 (RA 10173), CEDC protects all personal information, billing records, and payment credentials. Customer passwords are stored using bcrypt hashing and device biometric keys are localized strictly to your smartphone hardware enclave.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
