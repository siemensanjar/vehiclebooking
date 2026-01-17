
import React, { useState, useEffect } from 'react';
import { ShieldAlert, Check, X, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

interface PasswordChangeModalProps {
  onConfirm: (newPassword: string) => void;
  userName: string;
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({ onConfirm, userName }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  
  const policy = {
    length: newPassword.length >= 8,
    upper: /[A-Z]/.test(newPassword),
    lower: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    match: newPassword === confirmPassword && newPassword !== ''
  };

  const isAllValid = Object.values(policy).every(v => v);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAllValid) {
      onConfirm(newPassword);
    }
  };

  const Requirement = ({ met, label }: { met: boolean; label: string }) => (
    <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${met ? 'text-emerald-500' : 'text-slate-400'}`}>
      {met ? <Check size={12} strokeWidth={3} /> : <div className="w-3 h-3 rounded-full border border-slate-200" />}
      {label}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-amber-50 p-10 border-b border-amber-100 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-amber-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-amber-200 mb-6">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 leading-tight">Security Update Required</h2>
          <p className="text-slate-500 text-sm font-medium mt-2 max-w-xs">
            Hi {userName.split(' ')[0]}, an administrator has requested a mandatory password update for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type={showPass ? "text" : "password"} 
                  required
                  placeholder="Create a strong password"
                  className="w-full pl-14 pr-14 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
              <div className="relative">
                <ShieldCheck size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="password" 
                  required
                  placeholder="Repeat new password"
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-3">
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Security Policy Compliance</h3>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              <Requirement met={policy.length} label="8+ Characters" />
              <Requirement met={policy.upper} label="Uppercase" />
              <Requirement met={policy.lower} label="Lowercase" />
              <Requirement met={policy.number} label="Numeric Digit" />
              <Requirement met={policy.special} label="Special Symbol" />
              <Requirement met={policy.match} label="Passwords Match" />
            </div>
          </div>

          <button 
            type="submit"
            disabled={!isAllValid}
            className={`w-full py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3 ${isAllValid ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100' : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'}`}
          >
            Update & Secure Account <Check size={18} strokeWidth={3} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangeModal;
