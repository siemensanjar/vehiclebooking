
import React from 'react';
import { VehicleType, VehicleStatus, Vehicle } from '../types';
import { X, Truck, Hash, Plus, ShieldCheck } from 'lucide-react';

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (vehicle: Vehicle) => void;
}

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    type: VehicleType.TRUCK,
    licensePlate: '',
    origin: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVehicle: Vehicle = {
      id: `v${Date.now()}`,
      ...formData,
      status: VehicleStatus.AVAILABLE
    };
    onAdd(newVehicle);
    setFormData({ name: '', type: VehicleType.TRUCK, licensePlate: '', origin: '' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-white overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header - Cleaner and Brighter */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Add New Vehicle</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Register a new asset to the logistics fleet.</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all shadow-sm"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
              <Truck size={12} className="text-emerald-500" /> Vehicle Name
            </label>
            <input 
              type="text" 
              required
              placeholder="e.g. Volvo FH16 Globetrotter"
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-base font-semibold text-slate-900 placeholder:text-slate-400 transition-all"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] ml-2">Category</label>
              <select 
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-base font-semibold text-slate-900 transition-all appearance-none"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as VehicleType})}
              >
                {Object.values(VehicleType).map(type => (
                  <option key={type} value={type} className="text-slate-900">{type}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                <Hash size={12} className="text-emerald-500" /> License Plate
              </label>
              <input 
                type="text" 
                required
                placeholder="ABC-1234"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-base font-semibold text-slate-900 placeholder:text-slate-400 transition-all uppercase"
                value={formData.licensePlate}
                onChange={e => setFormData({...formData, licensePlate: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
              <Hash size={12} className="text-emerald-500" /> Origin Hub
            </label>
            <input 
              type="text" 
              required
              placeholder="e.g. Central Hub"
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-base font-semibold text-slate-900 placeholder:text-slate-400 transition-all"
              value={formData.origin}
              onChange={e => setFormData({...formData, origin: e.target.value})}
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-95"
            >
              <Plus size={18} strokeWidth={3} /> Complete Registration
            </button>
          </div>
        </form>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
          <ShieldCheck size={18} className="text-emerald-500" />
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            Identity & Asset Management Verified
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddVehicleModal;
