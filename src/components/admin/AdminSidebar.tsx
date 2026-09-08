import React from 'react';
import {
  BarChart3,
  Users,
  HelpCircle,
  Megaphone,
  CreditCard,
  Settings,
  UserCheck,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import cecapLogo from '../../assets/CECAp_Logo.png';
import { useApp } from '../../context/AppContext';

export type AdminNavigationTab =
  | 'analytics'
  | 'customer'
  | 'support'
  | 'advisories'
  | 'payments'
  | 'maintenance'
  | 'user-management';

export type AdvisoriesSubTab = 'announcements' | 'outages' | 'faqs' | 'guides';
export type MaintenanceSubTab = 'ticket-categories' | 'service-types';

interface AdminSidebarProps {
  activeTab: AdminNavigationTab;
  setActiveTab: (tab: AdminNavigationTab) => void;
  advisoriesSubTab: AdvisoriesSubTab;
  setAdvisoriesSubTab: (sub: AdvisoriesSubTab) => void;
  maintenanceSubTab: MaintenanceSubTab;
  setMaintenanceSubTab: (sub: MaintenanceSubTab) => void;
  openTicketsCount: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  advisoriesSubTab,
  setAdvisoriesSubTab,
  maintenanceSubTab,
  setMaintenanceSubTab,
  openTicketsCount,
}) => {
  const { adminUser, logout } = useApp();

  const handleParentClick = (tab: AdminNavigationTab) => {
    setActiveTab(tab);
  };

  return (
    <aside className="w-64 bg-white border-r border-[#E5E7EB] flex flex-col h-full shrink-0 shadow-xs select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#E5E7EB] flex flex-col items-center justify-center bg-white">
        <img src={cecapLogo} alt="Clark Electric Logo" className="h-12 object-contain" />
        <div className="mt-2.5 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 border border-[#FF5401]/25 text-[#FF5401]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="text-[10px] font-extrabold uppercase tracking-wider">Admin Portal</span>
        </div>
      </div>

      {/* Navigation Menu Links */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar">
        <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Operations Hub
        </div>

        {/* Analytics (Dashboard) */}
        <button
          type="button"
          onClick={() => handleParentClick('analytics')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-[#FF5401] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50 hover:text-[#2B2B2B]'
          }`}
        >
          <div className="flex items-center gap-3">
            <BarChart3 className="w-4 h-4 shrink-0" />
            <span>Analytics</span>
          </div>
        </button>

        {/* Customer Management */}
        <button
          type="button"
          onClick={() => handleParentClick('customer')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'customer'
              ? 'bg-[#FF5401] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50 hover:text-[#2B2B2B]'
          }`}
        >
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 shrink-0" />
            <span>Customer</span>
          </div>
        </button>

        {/* Support Tickets */}
        <button
          type="button"
          onClick={() => handleParentClick('support')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'support'
              ? 'bg-[#FF5401] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50 hover:text-[#2B2B2B]'
          }`}
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span>Support</span>
          </div>
          {openTicketsCount > 0 && (
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                activeTab === 'support' ? 'bg-white text-[#FF5401]' : 'bg-[#FF5401] text-white'
              }`}
            >
              {openTicketsCount}
            </span>
          )}
        </button>

        {/* Advisories */}
        <button
          type="button"
          onClick={() => handleParentClick('advisories')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'advisories'
              ? 'bg-[#FF5401] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50 hover:text-[#2B2B2B]'
          }`}
        >
          <div className="flex items-center gap-3">
            <Megaphone className="w-4 h-4 shrink-0" />
            <span>Advisories</span>
          </div>
        </button>

        {/* Payments Monitoring */}
        <button
          type="button"
          onClick={() => handleParentClick('payments')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'payments'
              ? 'bg-[#FF5401] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50 hover:text-[#2B2B2B]'
          }`}
        >
          <div className="flex items-center gap-3">
            <CreditCard className="w-4 h-4 shrink-0" />
            <span>Payments</span>
          </div>
        </button>

        {/* System Setup Section Divider */}
        <div className="pt-3 pb-1">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 mb-1.5">
            System Config
          </div>
        </div>

        {/* Maintenance */}
        <button
          type="button"
          onClick={() => handleParentClick('maintenance')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'maintenance'
              ? 'bg-[#FF5401] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50 hover:text-[#2B2B2B]'
          }`}
        >
          <div className="flex items-center gap-3">
            <Settings className="w-4 h-4 shrink-0" />
            <span>Maintenance</span>
          </div>
        </button>

        {/* User Management */}
        <button
          type="button"
          onClick={() => handleParentClick('user-management')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'user-management'
              ? 'bg-[#FF5401] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50 hover:text-[#2B2B2B]'
          }`}
        >
          <div className="flex items-center gap-3">
            <UserCheck className="w-4 h-4 shrink-0" />
            <span>User Management</span>
          </div>
        </button>
      </div>

      {/* Footer: User Details & Logout */}
      <div className="p-4 border-t border-[#E5E7EB] bg-white space-y-3">
        <div className="flex items-center gap-3 bg-[#F8FAFC] p-2.5 rounded-2xl border border-[#E5E7EB]">
          <div className="w-8 h-8 rounded-xl bg-[#FF5401] text-white flex items-center justify-center font-extrabold text-xs shrink-0 shadow-2xs">
            {adminUser?.name
              ? adminUser.name
                  .split(' ')
                  .map(n => n[0])
                  .slice(0, 2)
                  .join('')
              : 'RS'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-extrabold text-[#2B2B2B] truncate">
              {adminUser?.name || 'Engr. Roberto Santos'}
            </p>
            <p className="text-[10px] text-slate-500 truncate">
              {adminUser?.email || 'admin@clarkelectric.ph'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="w-full bg-rose-50 hover:bg-rose-100 text-[#EF4444] hover:text-rose-800 p-2.5 rounded-2xl border border-rose-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
        >
          <LogOut className="w-4 h-4 text-[#EF4444]" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};
