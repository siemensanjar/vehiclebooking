
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Users, UserPlus, Trash2, Shield, User as UserIcon, Lock, Key, Mail, ChevronRight, RefreshCw, UserCheck } from 'lucide-react';
import ResetPasswordModal from './ResetPasswordModal';

interface UserManagementProps {
  users: User[];
  onAddUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onResetPassword: (userId: string, newPass: string) => void;
  onApproveUser: (userId: string) => void;
  currentUserRole: UserRole;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onAddUser, onDeleteUser, onResetPassword, onApproveUser, currentUserRole }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [resettingUser, setResettingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    role: UserRole.USER
  });

  const isAdmin = currentUserRole === UserRole.ADMIN;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `u${Date.now()}`,
      ...formData,
      isApproved: true, // Manual admin provision is auto-approved
      mustChangePassword: true 
    };
    onAddUser(newUser);
    setFormData({ username: '', fullName: '', email: '', password: '', role: UserRole.USER });
    setIsAdding(false);
  };

  const pendingUsers = users.filter(u => !u.isApproved);
  const activeUsers = users.filter(u => u.isApproved);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500 ease-out">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">User Directory</h1>
          <p className="text-slate-500 font-medium mt-2">Manage access controls and security credentials for the logistics platform.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-3 px-6 py-4 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
        >
          {isAdding ? <Users size={20} /> : <UserPlus size={20} />}
          <span>{isAdding ? 'View All Users' : 'Create New User'}</span>
        </button>
      </header>

      {isAdding ? (
        <div className="max-w-2xl mx-auto bg-white p-10 rounded-[3rem] border border-slate-200 shadow-2xl shadow-slate-200/50 animate-in zoom-in-95 duration-300">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserPlus size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Provision New Identity</h2>
            <p className="text-slate-500 text-sm font-medium mt-1">Set secure credentials for new fleet members.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-2">Full Name</label>
                <div className="relative">
                  <UserIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Michael Chen"
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-semibold text-slate-900 placeholder:text-slate-400"
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-2">Username</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    required
                    placeholder="m_chen_driver"
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-semibold text-slate-900 placeholder:text-slate-400"
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-2">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="email" 
                  required
                  placeholder="m.chen@example.com"
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-semibold text-slate-900 placeholder:text-slate-400"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-2">Temporary Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="password" 
                  required
                  placeholder="Initial security key"
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-semibold text-slate-900 placeholder:text-slate-400"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-2">Permission Level</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, role: UserRole.USER})}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest transition-all ${formData.role === UserRole.USER ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                >
                  <UserIcon size={16} /> User
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, role: UserRole.ADMIN})}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest transition-all ${formData.role === UserRole.ADMIN ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                >
                  <Shield size={16} /> Admin
                </button>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 mt-4"
            >
              Provision Identity <ChevronRight size={18} />
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-12">
          {pendingUsers.length > 0 && isAdmin && (
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                   <UserPlus size={20} className="text-amber-500" />
                   Pending Approvals
                </h2>
                <div className="h-px bg-slate-100 flex-1"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pendingUsers.map(u => (
                  <div key={u.id} className="bg-amber-50/50 p-8 rounded-[2.5rem] border border-amber-100 shadow-sm flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-black text-lg">
                        {u.fullName.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="px-3 py-1 bg-amber-500 text-white rounded-full text-[8px] font-black uppercase tracking-widest">
                        PENDING
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-slate-900">{u.fullName}</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">@{u.username}</p>
                      <div className="mt-4 flex items-center gap-2 text-slate-500 text-xs font-semibold">
                         <Mail size={14} className="text-amber-500" />
                         {u.email}
                      </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-amber-100 flex gap-2">
                      <button 
                        onClick={() => onApproveUser(u.id)}
                        className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-black text-[9px] uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
                      >
                        <UserCheck size={14} /> Approve Account
                      </button>
                      <button 
                        onClick={() => onDeleteUser(u.id)}
                        className="p-3 text-rose-500 bg-rose-50 border border-rose-100 rounded-xl hover:bg-rose-100 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                 <Users size={20} className="text-indigo-600" />
                 Active Directory
              </h2>
              <div className="h-px bg-slate-100 flex-1"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeUsers.map(u => (
                <div key={u.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm group hover:border-indigo-200 transition-all flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-inner ${u.role === UserRole.ADMIN ? 'bg-slate-900 text-white' : u.role === UserRole.DISPATCHER ? 'bg-emerald-600 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                      {u.fullName.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex items-center gap-2">
                      {isAdmin && (
                        <>
                          <button onClick={() => setResettingUser(u)} title="Reset Password" className="p-2.5 text-slate-300 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"><RefreshCw size={18} /></button>
                          <button onClick={() => onDeleteUser(u.id)} title="Delete User" className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-slate-900">{u.fullName}</h3>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">@{u.username}</p>
                    <div className="mt-4 flex items-center gap-2 text-slate-500 text-xs font-semibold">
                       <Mail size={14} className="text-slate-300" />
                       {u.email}
                    </div>
                    {u.mustChangePassword && (
                       <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mt-4 flex items-center gap-1">
                         <Shield size={10} /> Password Change Pending
                       </p>
                    )}
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${u.role === UserRole.ADMIN ? 'bg-slate-900 text-white' : u.role === UserRole.DISPATCHER ? 'bg-emerald-600 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                      {u.role === UserRole.ADMIN ? <Shield size={10} /> : <UserIcon size={10} />}
                      {u.role} Access
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Key size={12} />
                      <span className="text-[10px] font-black tabular-nums">••••••••</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      <ResetPasswordModal 
        user={resettingUser} 
        onClose={() => setResettingUser(null)} 
        onConfirm={(id, pass) => {
          onResetPassword(id, pass);
          setResettingUser(null);
        }}
      />
    </div>
  );
};

export default UserManagement;
