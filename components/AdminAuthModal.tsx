
import React, { useState } from 'react';
import { X, Lock, ShieldCheck, ArrowRight, ShieldAlert } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  correctPassword: string;
}

const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose, onSuccess, correctPassword }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      setError(false);
      onSuccess();
      setPassword('');
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-white">
        <div className="p-8 text-center bg-slate-50/50 border-b border-slate-100 relative">
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-900 bg-white rounded-xl transition-all shadow-sm"
          >
            <X size={18} />
          </button>
          <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-100">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Admin Authentication</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Elevated Permissions Required</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-widest text-center rounded-xl animate-shake">
              Invalid Encryption Key
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Lock size={12} className="text-indigo-400" /> Security Key
            </label>
            <input 
              type="password" 
              required
              autoFocus
              placeholder="••••"
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-center text-xl font-black tracking-[0.5em] transition-all"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-95 group"
          >
            Verify <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="p-6 bg-slate-50 border-t border-slate-50 flex items-center justify-center gap-2">
          <ShieldAlert size={14} className="text-amber-500" />
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
            Identity Node #402 Locked
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminAuthModal;
