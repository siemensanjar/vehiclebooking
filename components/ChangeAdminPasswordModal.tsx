
import React, { useState } from 'react';
import { X, Lock, Save, ShieldAlert, CheckCircle } from 'lucide-react';

interface ChangeAdminPasswordModalProps {
  onClose: () => void;
  onUpdate: (newPassword: string) => Promise<void>;
}

const ChangeAdminPasswordModal: React.FC<ChangeAdminPasswordModalProps> = ({ onClose, onUpdate }) => {
  const [newPassword, setNewPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    
    setIsUpdating(true);
    try {
      await onUpdate(newPassword);
      setIsSuccess(true);
      setTimeout(onClose, 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-white">
        <div className="p-8 text-center bg-indigo-50/50 border-b border-slate-100 relative">
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-900 bg-white rounded-xl transition-all shadow-sm"
          >
            <X size={18} />
          </button>
          <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Lock size={32} />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">System Access Key</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Modify Admin Credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {isSuccess ? (
            <div className="py-6 flex flex-col items-center justify-center space-y-3 animate-in fade-in">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircle size={24} />
              </div>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Key Updated Successfully</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <ShieldAlert size={12} className="text-indigo-400" /> New Security Key
                </label>
                <input 
                  type="text" 
                  required
                  autoFocus
                  placeholder="Enter New Pin"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-center text-xl font-black tracking-[0.2em] transition-all"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
              </div>

              <button 
                type="submit"
                disabled={isUpdating || !newPassword}
                className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {isUpdating ? "Processing..." : "Commit Update"} <Save size={18} />
              </button>
            </>
          )}
        </form>

        <div className="p-6 bg-slate-50 border-t border-slate-50 flex items-center justify-center">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
            Encryption Layer v2.4 Active
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChangeAdminPasswordModal;
