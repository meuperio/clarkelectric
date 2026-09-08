import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Search,
  Filter,
  Edit2,
  KeyRound,
  ShieldAlert,
  CheckCircle2,
  Power,
  X,
  Check,
  Lock,
} from 'lucide-react';
import { AdminStaffUser } from '../../../types';
import { ADMIN_STAFF_USERS_LIST } from '../../../data/adminMockData';

interface UserManagementViewProps {
  searchQuery?: string;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({ searchQuery = '' }) => {
  const [users, setUsers] = useState<AdminStaffUser[]>(ADMIN_STAFF_USERS_LIST);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [toastMsg, setToastMsg] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminStaffUser | null>(null);
  const [resetPwdUser, setResetPwdUser] = useState<AdminStaffUser | null>(null);
  const [generatedTempPwd, setGeneratedTempPwd] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('System Operations');
  const [role, setRole] = useState<AdminStaffUser['role']>('Customer Care Agent');
  const [permissions, setPermissions] = useState({
    analytics: true,
    customers: true,
    support: true,
    advisories: true,
    payments: false,
    maintenance: false,
    userManagement: false,
  });

  const query = (localSearch || searchQuery).toLowerCase();

  const filteredUsers = users.filter(u => {
    const matchesQuery =
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.department.toLowerCase().includes(query);

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesQuery && matchesRole;
  });

  const handleToggleStatus = (id: string) => {
    setUsers(
      users.map(u => {
        if (u.id === id) {
          const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
    setToastMsg('✅ User account status updated!');
    setTimeout(() => setToastMsg(''), 2500);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newUser: AdminStaffUser = {
      id: editingUser ? editingUser.id : `ADM-${Date.now()}`,
      name,
      email,
      role,
      department,
      status: 'Active',
      lastLogin: 'Never logged in',
      permissions,
    };

    if (editingUser) {
      setUsers(users.map(u => (u.id === editingUser.id ? newUser : u)));
    } else {
      setUsers([newUser, ...users]);
    }

    setIsModalOpen(false);
    setEditingUser(null);
    setName('');
    setEmail('');
    setToastMsg(`✅ Administrator account ${editingUser ? 'updated' : 'created'} successfully!`);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const openEditModal = (u: AdminStaffUser) => {
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setDepartment(u.department);
    setRole(u.role);
    setPermissions(u.permissions);
    setIsModalOpen(true);
  };

  const handleTriggerResetPwd = (u: AdminStaffUser) => {
    setResetPwdUser(u);
    setGeneratedTempPwd(`Cedc@2026!${Math.floor(100 + Math.random() * 900)}`);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-lg font-bold text-xs flex items-center justify-between">
          <span>{toastMsg}</span>
          <button onClick={() => setToastMsg('')} className="text-white hover:text-slate-200">✕</button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Administrators</span>
          <div className="text-2xl font-black text-[#2B2B2B]">{users.length} Users</div>
          <span className="text-[11px] text-slate-500 font-medium">Enterprise portal access</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Staff Accounts</span>
          <div className="text-2xl font-black text-emerald-600">
            {users.filter(u => u.status === 'Active').length} Active
          </div>
          <span className="text-[11px] text-emerald-600 font-bold">100% Security Verified</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Super Admins</span>
          <div className="text-2xl font-black text-[#FF5401]">
            {users.filter(u => u.role === 'Super Admin').length} Leads
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Full System Permissions</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Security Policy</span>
          <div className="text-2xl font-black text-blue-600">MFA Active</div>
          <span className="text-[11px] text-blue-600 font-bold">2FA Mandatory</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 md:p-5 rounded-2xl border border-[#E5E7EB] shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              placeholder="Search by admin name, email, department..."
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF5401] focus:bg-white rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-[#2B2B2B] focus:outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF5401] focus:bg-white rounded-xl px-3 py-2 text-xs font-bold text-[#2B2B2B] focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Operations Lead">Operations Lead</option>
              <option value="Customer Care Agent">Customer Care Agent</option>
              <option value="Billing Specialist">Billing Specialist</option>
              <option value="Field Tech Lead">Field Tech Lead</option>
            </select>
          </div>

          <div className="md:col-span-3 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setEditingUser(null);
                setName('');
                setEmail('');
                setIsModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#FF5401] hover:bg-[#E54A00] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Admin User</span>
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-500 font-extrabold uppercase text-[10px] tracking-wider border-b border-[#E5E7EB]">
                <th className="py-3.5 px-4">Administrator</th>
                <th className="py-3.5 px-4">Role & Department</th>
                <th className="py-3.5 px-4">Last Login</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-[#2B2B2B]">{u.name}</div>
                    <div className="text-[10px] text-slate-400">{u.email}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block font-extrabold text-[#FF5401] bg-orange-50 px-2 py-0.5 rounded-md text-[10px] uppercase">
                      {u.role}
                    </span>
                    <div className="text-[10px] text-slate-500 font-medium mt-0.5">{u.department}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-bold">{u.lastLogin}</td>
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(u.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold cursor-pointer transition-all ${
                        u.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      <Power className="w-3 h-3" />
                      <span>{u.status}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1">
                    <button
                      onClick={() => openEditModal(u)}
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                      title="Edit User & Permissions"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleTriggerResetPwd(u)}
                      className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 cursor-pointer"
                      title="Reset Password"
                    >
                      <KeyRound className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Admin User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-[#2B2B2B]">
                {editingUser ? 'Edit Administrator Profile' : 'Add New Administrator Account'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Engr. Roberto Santos"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF5401] focus:bg-white rounded-xl p-2.5 text-xs font-bold text-[#2B2B2B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="user@clarkelectric.ph"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF5401] focus:bg-white rounded-xl p-2.5 text-xs font-bold text-[#2B2B2B] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF5401] focus:bg-white rounded-xl p-2.5 text-xs font-bold text-[#2B2B2B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">Assign Role</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as any)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF5401] focus:bg-white rounded-xl p-2.5 text-xs font-bold text-[#2B2B2B] focus:outline-none cursor-pointer"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Operations Lead">Operations Lead</option>
                    <option value="Customer Care Agent">Customer Care Agent</option>
                    <option value="Billing Specialist">Billing Specialist</option>
                    <option value="Field Tech Lead">Field Tech Lead</option>
                  </select>
                </div>
              </div>

              {/* Module Permissions Matrix */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="block text-[10px] font-extrabold uppercase text-[#2B2B2B]">
                  Module Access Permissions
                </label>

                <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700">
                  {Object.keys(permissions).map(key => (
                    <label key={key} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(permissions as any)[key]}
                        onChange={e => setPermissions({ ...permissions, [key]: e.target.checked })}
                        className="rounded text-[#FF5401] focus:ring-0 cursor-pointer"
                      />
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#FF5401] hover:bg-[#E54A00] text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Save Admin User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Dialog */}
      {resetPwdUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-[#FF5401] flex items-center justify-center font-bold">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-[#2B2B2B]">Reset Password</h3>
                <p className="text-xs text-slate-400">Temporary password generated for {resetPwdUser.name}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Temporary Password</span>
              <div className="font-mono text-base font-black text-[#FF5401] select-all">{generatedTempPwd}</div>
              <p className="text-[10px] text-slate-500 font-medium">User will be prompted to change password on next login.</p>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="button"
                onClick={() => setResetPwdUser(null)}
                className="w-full py-2.5 rounded-xl bg-[#FF5401] text-white font-bold text-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
