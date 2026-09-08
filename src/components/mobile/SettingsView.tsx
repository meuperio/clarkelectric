import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings as SettingsIcon, Fingerprint, Lock, Bell, Shield, Info, LogOut, CheckCircle2, X } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    biometricsEnabled,
    setBiometricsEnabled,
    notificationPreferences,
    setNotificationPreferences,
    logout,
  } = useApp();

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMsg, setPassMsg] = useState('');

  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

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

  return (
    <div className="space-y-6 animate-fade-in pb-20 md:pb-12 w-full">
      <div>
        <h2 className="text-base md:text-lg font-bold text-[#2B2B2B]">Application Settings</h2>
        <p className="text-xs text-slate-500">Security, biometrics, & notifications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        {/* Security & Authentication Settings */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-[#2B2B2B] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">
            Security & Authentication
          </h3>

          {/* Biometrics Toggle */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF5401] flex items-center justify-center">
                <Fingerprint className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#2B2B2B]">Biometric Sign In</p>
                <p className="text-[10px] text-slate-500">Use Fingerprint or Face ID</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={biometricsEnabled}
              onChange={e => setBiometricsEnabled(e.target.checked)}
              className="w-5 h-5 accent-[#FF5401] cursor-pointer"
            />
          </div>

          {/* Change Password Trigger */}
          <div
            onClick={() => setIsPasswordModalOpen(true)}
            className="flex items-center justify-between py-2 border-t border-[#E5E7EB] cursor-pointer hover:bg-[#F5F5F5] rounded-xl px-1 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF5401] flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#2B2B2B]">Change Password</p>
                <p className="text-[10px] text-slate-500">Update encrypted portal credentials</p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#FF5401]">Update →</span>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-[#2B2B2B] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">
            Notification Preferences
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#2B2B2B]">Push Notifications</span>
              <input
                type="checkbox"
                checked={notificationPreferences.push}
                onChange={e => setNotificationPreferences({ ...notificationPreferences, push: e.target.checked })}
                className="w-4 h-4 accent-[#FF5401] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#2B2B2B]">SMS Alerts (Text Messages)</span>
              <input
                type="checkbox"
                checked={notificationPreferences.sms}
                onChange={e => setNotificationPreferences({ ...notificationPreferences, sms: e.target.checked })}
                className="w-4 h-4 accent-[#FF5401] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#2B2B2B]">Email Notifications</span>
              <input
                type="checkbox"
                checked={notificationPreferences.email}
                onChange={e => setNotificationPreferences({ ...notificationPreferences, email: e.target.checked })}
                className="w-4 h-4 accent-[#FF5401] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB]">
              <span className="font-semibold text-[#2B2B2B]">Power Outage Emergency Alerts</span>
              <input
                type="checkbox"
                checked={notificationPreferences.outageAlerts}
                onChange={e => setNotificationPreferences({ ...notificationPreferences, outageAlerts: e.target.checked })}
                className="w-4 h-4 accent-[#FF5401] cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* About, Privacy & Logout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs space-y-3 text-xs font-semibold text-[#2B2B2B]">
          <button
            onClick={() => setIsAboutModalOpen(true)}
            className="w-full flex items-center justify-between py-1.5 hover:text-[#FF5401] cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[#FF5401]" />
              <span>About Clark Electric Distribution Corp</span>
            </div>
            <span>→</span>
          </button>

          <button
            onClick={() => setIsPrivacyModalOpen(true)}
            className="w-full flex items-center justify-between py-1.5 border-t border-[#E5E7EB] hover:text-[#FF5401] cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#FF5401]" />
              <span>Privacy Policy & Data Security</span>
            </div>
            <span>→</span>
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full bg-rose-50 hover:bg-rose-100 text-[#EF4444] font-bold text-xs py-4 rounded-2xl border border-rose-200 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Change Password Modal */}
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

      {/* About Modal */}
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

      {/* Privacy Modal */}
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
