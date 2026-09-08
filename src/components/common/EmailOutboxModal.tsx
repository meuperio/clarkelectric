import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SentEmail } from '../../types';
import {
  Mail,
  Inbox,
  Send,
  CheckCircle2,
  Copy,
  ExternalLink,
  Lock,
  UserCheck,
  KeyRound,
  X,
  Search,
  Check,
  FileText,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import cecapLogo from '../../assets/CECAp_Logo.png';

export const EmailOutboxModal: React.FC = () => {
  const {
    sentEmails,
    emailModalOpen,
    setEmailModalOpen,
    selectedEmail,
    setSelectedEmail,
    setIsAuthenticated,
    setUserRole,
    setActiveTab,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!emailModalOpen) return null;

  const currentEmail = selectedEmail || (sentEmails.length > 0 ? sentEmails[0] : null);

  const filteredEmails = sentEmails.filter(email => {
    const matchesSearch =
      email.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterType === 'ALL') return matchesSearch;
    return matchesSearch && email.type === filterType;
  });

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleAutoFillLogin = (emailObj: SentEmail) => {
    const accountCode = emailObj.data?.accountCode || '0421-9012-34';
    const tempPass = emailObj.data?.tempPassword || 'CedcTemp#1092';

    // Store temporary autofill credentials in localStorage for AuthView pickup
    localStorage.setItem('autofill_account_code', accountCode);
    localStorage.setItem('autofill_temp_pass', tempPass);

    setEmailModalOpen(false);
    setIsAuthenticated(false);
    setUserRole('customer');
    setActiveTab('dashboard');

    // Trigger custom event or timeout for AuthView to read credentials
    window.dispatchEvent(new CustomEvent('cedc_autofill_login', {
      detail: { accountCode, tempPass }
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl h-[90vh] sm:h-[85vh] flex flex-col overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-[#2B2B2B] text-white p-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF5401] flex items-center justify-center text-white shadow-md shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold tracking-wide uppercase">CECAp Official Email Dispatch Center</h3>
                <span className="bg-emerald-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Live SMTP Relay Active
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Outbound system notification emails & user portal credentials
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setEmailModalOpen(false)}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area: Split View */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50">
          
          {/* Left Column: Dispatched Email List */}
          <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 bg-white flex flex-col h-1/2 md:h-full shrink-0">
            {/* Search & Filter Bar */}
            <div className="p-3 border-b border-slate-100 space-y-2 bg-slate-50/50">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search recipient or subject..."
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#FF5401] transition-all"
                />
              </div>

              {/* Filter Pills */}
              <div className="flex gap-1 overflow-x-auto pb-1 text-[10px] font-bold no-scrollbar">
                <button
                  type="button"
                  onClick={() => setFilterType('ALL')}
                  className={`px-2.5 py-1 rounded-lg transition-all shrink-0 cursor-pointer ${
                    filterType === 'ALL' ? 'bg-[#FF5401] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({sentEmails.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('REGISTRATION_APPROVED')}
                  className={`px-2.5 py-1 rounded-lg transition-all shrink-0 cursor-pointer ${
                    filterType === 'REGISTRATION_APPROVED' ? 'bg-[#FF5401] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Approved
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('REGISTRATION_RECEIVED')}
                  className={`px-2.5 py-1 rounded-lg transition-all shrink-0 cursor-pointer ${
                    filterType === 'REGISTRATION_RECEIVED' ? 'bg-[#FF5401] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Received
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('OTP_CODE')}
                  className={`px-2.5 py-1 rounded-lg transition-all shrink-0 cursor-pointer ${
                    filterType === 'OTP_CODE' ? 'bg-[#FF5401] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  OTP / Security
                </button>
              </div>
            </div>

            {/* Email Items List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredEmails.length === 0 ? (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <Inbox className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-bold text-slate-600">No emails found</p>
                  <p className="text-[11px]">System notifications will appear here automatically when sent.</p>
                </div>
              ) : (
                filteredEmails.map(email => {
                  const isSelected = currentEmail?.id === email.id;
                  return (
                    <button
                      key={email.id}
                      type="button"
                      onClick={() => setSelectedEmail(email)}
                      className={`w-full text-left p-3.5 transition-all flex flex-col gap-1 cursor-pointer border-l-4 ${
                        isSelected
                          ? 'bg-orange-50/80 border-l-[#FF5401] shadow-xs'
                          : 'hover:bg-slate-50 border-l-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#2B2B2B] truncate max-w-[170px]">
                          {email.recipientName}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                          {email.sentAt}
                        </span>
                      </div>

                      <p className="text-xs font-extrabold text-[#FF5401] truncate">
                        {email.subject}
                      </p>

                      <p className="text-[11px] text-slate-500 truncate">
                        To: {email.to}
                      </p>

                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" /> DELIVERED
                        </span>
                        {email.type === 'REGISTRATION_APPROVED' && (
                          <span className="bg-orange-100 text-[#FF5401] text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                            Credentials Included
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Full Rendered Email Body */}
          <div className="flex-1 bg-slate-100 p-3 sm:p-5 overflow-y-auto h-1/2 md:h-full flex flex-col">
            {currentEmail ? (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-4 sm:p-6 space-y-5 my-auto max-w-2xl mx-auto w-full">
                
                {/* Meta Header */}
                <div className="border-b border-slate-100 pb-4 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="bg-[#2B2B2B] text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
                      ID: {currentEmail.id}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      Dispatched: {currentEmail.sentAt}
                    </span>
                  </div>

                  <h2 className="text-base sm:text-lg font-black text-[#2B2B2B] leading-snug">
                    {currentEmail.subject}
                  </h2>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                    <div className="flex flex-wrap justify-between">
                      <span className="text-slate-500 font-semibold">From:</span>
                      <span className="font-bold text-[#2B2B2B]">{currentEmail.sender}</span>
                    </div>
                    <div className="flex flex-wrap justify-between">
                      <span className="text-slate-500 font-semibold">To:</span>
                      <span className="font-bold text-[#FF5401]">{currentEmail.recipientName} &lt;{currentEmail.to}&gt;</span>
                    </div>
                  </div>
                </div>

                {/* Email HTML Graphic Card Body */}
                <div className="bg-gradient-to-b from-white to-slate-50 rounded-xl border border-slate-200 p-4 sm:p-6 space-y-4 shadow-2xs">
                  {/* Brand Header inside Email */}
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <img src={cecapLogo} alt="CECAP Logo" className="h-9 object-contain" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Official E-Notice
                    </span>
                  </div>

                  {/* Body Text */}
                  <div className="text-xs sm:text-sm text-[#2B2B2B] leading-relaxed whitespace-pre-line font-normal">
                    {currentEmail.body}
                  </div>

                  {/* Credentials Highlighting Card (If Approved) */}
                  {currentEmail.type === 'REGISTRATION_APPROVED' && currentEmail.data && (
                    <div className="bg-orange-50/90 border-2 border-[#FF5401]/30 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center gap-2 text-[#FF5401] font-black text-xs uppercase tracking-wider">
                        <KeyRound className="w-4 h-4" />
                        <span>Your Assigned Portal Credentials</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="bg-white p-3 rounded-xl border border-orange-200 shadow-2xs">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">Customer Account Code</span>
                          <span className="text-sm font-mono font-black text-[#FF5401]">
                            {currentEmail.data.accountCode || '0421-9012-34'}
                          </span>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-orange-200 shadow-2xs">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">Temporary Password</span>
                          <div className="flex items-center justify-between mt-0.5">
                            <span className="text-sm font-mono font-black text-[#2B2B2B]">
                              {currentEmail.data.tempPassword || 'CedcTemp#7419'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(currentEmail.data?.tempPassword || 'CedcTemp#7419', 'pass')}
                              className="text-[10px] font-bold text-[#FF5401] hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              {copiedField === 'pass' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedField === 'pass' ? 'Copied!' : 'Copy'}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Action Button: Auto-fill & Login */}
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => handleAutoFillLogin(currentEmail)}
                          className="w-full bg-[#FF5401] hover:bg-[#E54A00] text-white font-extrabold text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <UserCheck className="w-4 h-4" />
                          <span>Use These Credentials To Log In Now</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* OTP Code Box (If OTP) */}
                  {currentEmail.type === 'OTP_CODE' && currentEmail.data?.otpCode && (
                    <div className="bg-slate-900 text-white rounded-2xl p-4 text-center space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verification Code</span>
                      <p className="text-2xl font-mono font-black tracking-widest text-[#FF5401]">
                        {currentEmail.data.otpCode}
                      </p>
                      <p className="text-[10px] text-slate-400">Valid for 10 minutes. Do not share with anyone.</p>
                    </div>
                  )}

                  {/* Official Footer Disclaimer */}
                  <div className="pt-3 border-t border-slate-200 text-[10px] text-slate-400 space-y-1">
                    <p className="font-semibold text-slate-600">
                      Clark Electric Customer Application (CECAp)
                    </p>
                    <p>
                      Bldg 2127, E. Quirino St. cor. C.P. Garcia Ave., Clark Freeport Zone, Pampanga, Philippines
                    </p>
                    <p>
                      Need help? Contact Customer Care Hotline: (045) 599-7000 or email support@clarkelectric.ph
                    </p>
                  </div>
                </div>

              </div>
            ) : (
              <div className="my-auto text-center text-slate-400 space-y-2">
                <Mail className="w-12 h-12 mx-auto text-slate-300" />
                <p className="text-sm font-bold text-slate-600">Select an email to view full content</p>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-3 px-6 flex justify-between items-center text-xs shrink-0">
          <span className="text-slate-500 font-semibold">
            Total Messages: <strong className="text-[#2B2B2B]">{sentEmails.length}</strong>
          </span>
          <button
            type="button"
            onClick={() => setEmailModalOpen(false)}
            className="bg-[#2B2B2B] hover:bg-black text-white font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
