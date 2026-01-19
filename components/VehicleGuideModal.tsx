
import React from 'react';
import { Vehicle } from '../types';
import { X, BookOpen, Fuel, Gauge, Zap, Calendar, ShieldCheck, Key } from 'lucide-react';

interface VehicleGuideModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
}

const VehicleGuideModal: React.FC<VehicleGuideModalProps> = ({ vehicle, onClose }) => {
  if (!vehicle) return null;

  const defaultSpecs = {
    fuelType: 'Diesel / Electric Hybrid',
    capacity: '2.5 Tons',
    maxRange: '850 km',
    lastService: '12 Oct 2024',
    engineHealth: '98%'
  };

  const specs = vehicle.specs || defaultSpecs;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 md:p-6 bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-white/20">
        <div className="bg-slate-900 p-8 md:p-12 text-white relative">
          <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
            <X size={20} />
          </button>
          <div className="flex items-center gap-6 mb-8">
            <div className="p-5 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-500/20">
              <BookOpen size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight">{vehicle.name}</h2>
              <p className="text-indigo-400 font-bold text-xs uppercase tracking-[0.2em] mt-1">Technical Operations Guide</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <Fuel size={16} className="text-emerald-400 mb-2" />
              <p className="text-[10px] font-bold text-slate-400 uppercase">Fuel Type</p>
              <p className="font-bold text-sm">{specs.fuelType}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <Zap size={16} className="text-amber-400 mb-2" />
              <p className="text-[10px] font-bold text-slate-400 uppercase">Payload</p>
              <p className="font-bold text-sm">{specs.capacity}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <Gauge size={16} className="text-indigo-400 mb-2" />
              <p className="text-[10px] font-bold text-slate-400 uppercase">Max Range</p>
              <p className="font-bold text-sm">{specs.maxRange}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <ShieldCheck size={16} className="text-blue-400 mb-2" />
              <p className="text-[10px] font-bold text-slate-400 uppercase">Health</p>
              <p className="font-bold text-sm">{specs.engineHealth}</p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 space-y-8 max-h-[50vh] overflow-y-auto custom-scrollbar">
          <section>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3 mb-4">
              <Key size={16} className="text-indigo-600" /> Key Operation Protocol
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              {vehicle.guideText || `To initialize the ${vehicle.name}, ensure the smart-key is within range. Engage the electronic parking brake before selecting 'Drive' mode. This unit features adaptive cruise control and advanced lane-keeping. Maintain a minimum fuel level of 15% for optimal pump cooling.`}
            </p>
          </section>

          <section className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Calendar size={20} className="text-slate-400" />
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Service Audit</p>
                <p className="text-sm font-bold text-slate-700">{specs.lastService}</p>
              </div>
            </div>
            <div className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-widest">
              Certified
            </div>
          </section>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TransPort Pro v3.5 Internal Documentation</p>
           <button onClick={onClose} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl active:scale-95">
             Close Guide
           </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleGuideModal;
