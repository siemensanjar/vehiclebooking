
import React, { useState, useEffect } from 'react';
import { Vehicle, User } from '../types';
import { X, Calendar, MapPin, Clock, ShieldCheck, Target, User as UserIcon, AlertCircle } from 'lucide-react';

interface BookingModalProps {
  vehicle: Vehicle | null;
  currentUser: User;
  onClose: () => void;
  onSubmit: (bookingData: any) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ vehicle, currentUser, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    userName: currentUser.fullName,
    startTime: '',
    endTime: '',
    destination: '',
    purpose: ''
  });

  const [validationState, setValidationState] = useState<{
    isValid: boolean;
    reason: string | null;
  }>({ isValid: true, reason: null });

  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      const today = new Date();
      
      const isToday = start.toDateString() === today.toDateString();
      const startMins = start.getHours() * 60 + start.getMinutes();
      const endMins = end.getHours() * 60 + end.getMinutes();
      const winStart = 16 * 60 + 30; // 04:30 PM
      const winEnd = 18 * 60 + 30;   // 06:30 PM

      if (!isToday) {
        setValidationState({ isValid: false, reason: "Today's slots only" });
      } else if (startMins < winStart || endMins > winEnd) {
        setValidationState({ isValid: false, reason: "Outside window (16:30-18:30)" });
      } else if (end <= start) {
        setValidationState({ isValid: false, reason: "Invalid duration" });
      } else {
        setValidationState({ isValid: true, reason: null });
      }
    } else {
      setValidationState({ isValid: true, reason: null });
    }
  }, [formData.startTime, formData.endTime]);

  if (!vehicle) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      vehicleId: vehicle.id,
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-t-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in duration-300 border-x border-t sm:border border-white max-h-[95vh] overflow-y-auto custom-scrollbar">
        {/* Modal Header */}
        <div className="p-6 sm:p-10 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600"></div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Booking Details</h2>
            <div className="flex items-center gap-2 mt-1.5 md:mt-2">
              <span className="text-[8px] md:text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">{vehicle.type}</span>
              <p className="text-[10px] md:text-xs font-semibold text-slate-500">{vehicle.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 sm:p-3 text-slate-300 hover:text-slate-900 bg-slate-50 rounded-xl md:rounded-2xl transition-all">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 sm:px-10 pt-6 space-y-3">
           <div className={`p-4 rounded-2xl flex items-start gap-3 border ${validationState.isValid ? 'bg-indigo-50 border-indigo-100' : 'bg-rose-50 border-rose-100'}`}>
             {validationState.isValid ? <Clock size={18} className="text-indigo-600 shrink-0" /> : <AlertCircle size={18} className="text-rose-600 shrink-0" />}
             <div>
               <p className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest ${validationState.isValid ? 'text-indigo-700' : 'text-rose-700'}`}>
                 Window: Today @ 16:30 — 18:30
               </p>
               {validationState.reason && (
                 <p className="text-[9px] font-bold text-rose-500 mt-0.5 uppercase tracking-wide">{validationState.reason}</p>
               )}
             </div>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-5 md:space-y-6">
          <div className="space-y-1.5 md:space-y-2">
            <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <UserIcon size={12} className="text-indigo-400" /> Operative Name
            </label>
            <input 
              type="text" 
              required
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl focus:border-indigo-600 outline-none text-sm font-semibold text-slate-900"
              value={formData.userName}
              onChange={e => setFormData({...formData, userName: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
            <div className="space-y-1.5 md:space-y-2">
              <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Departure</label>
              <input 
                type="datetime-local" 
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl text-[11px] font-bold outline-none focus:border-indigo-600"
                style={{ colorScheme: 'light' }}
                value={formData.startTime}
                onChange={e => setFormData({...formData, startTime: e.target.value})}
              />
            </div>
            <div className="space-y-1.5 md:space-y-2">
              <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Return</label>
              <input 
                type="datetime-local" 
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl text-[11px] font-bold outline-none focus:border-indigo-600"
                style={{ colorScheme: 'light' }}
                value={formData.endTime}
                onChange={e => setFormData({...formData, endTime: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1.5 md:space-y-2">
            <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Target size={12} className="text-indigo-400" /> Purpose
            </label>
            <input 
              type="text" 
              required
              placeholder="Booking purpose"
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl outline-none focus:border-indigo-600 text-sm font-semibold"
              value={formData.purpose}
              onChange={e => setFormData({...formData, purpose: e.target.value})}
            />
          </div>

          <div className="space-y-1.5 md:space-y-2">
            <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <MapPin size={12} className="text-indigo-400" /> Destination
            </label>
            <input 
              type="text" 
              required
              placeholder="Target Location"
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl outline-none focus:border-indigo-600 text-sm font-semibold"
              value={formData.destination}
              onChange={e => setFormData({...formData, destination: e.target.value})}
            />
          </div>

          <div className="pt-4 md:pt-6">
            <button 
              type="submit"
              disabled={!validationState.isValid}
              className={`w-full py-4.5 md:py-5 rounded-2xl md:rounded-[1.75rem] font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 ${validationState.isValid ? 'bg-slate-900 text-white hover:bg-indigo-600' : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'}`}
            >
              Confirm Booking
            </button>
          </div>
        </form>

        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-50 flex items-center justify-center gap-2">
          <ShieldCheck size={14} className="text-indigo-500" />
          <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            Secured Booking Node
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
