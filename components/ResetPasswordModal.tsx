
import React, { useState } from 'react';
import { X, Lock, ShieldAlert, Key, Check } from 'lucide-react';
import { User } from '../types';

interface ResetPasswordModalProps {
  user: User | null;
  onClose: () => void;
  onConfirm: (userId: string, newPass: string) => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ user, onClose, onConfirm }) => {
  const [newPassword, setNewPassword] = useState('');

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.trim()) {
      onConfirm(user.id, newPassword);
      setNewPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-white overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-500"></div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Reset Password</h2>
            <p className="text-xs font-medium text-slate-500 mt-1">Set temporary credentials for {user.fullName}.</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all shadow-sm"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
            <ShieldAlert size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[10px] font-bold text-amber-800 leading-relaxed uppercase tracking-wider">
              The user will be required to change this password upon their next successful login.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
              <Key size={12} className="text-amber-500" /> New Temporary Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                required
                placeholder="Enter new password"
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none text-base font-semibold text-slate-900 placeholder:text-slate-400 transition-all"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-amber-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-95"
          >
            Confirm Password Reset <Check size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
