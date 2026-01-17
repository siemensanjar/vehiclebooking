
import React from 'react';
import { Vehicle, VehicleStatus } from '../types';
import { X, Check, TriangleAlert, Truck, Wrench, CirclePlay } from 'lucide-react';

interface StatusUpdateModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onUpdate: (vehicleId: string, status: VehicleStatus) => void;
}

const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({ vehicle, onClose, onUpdate }) => {
  if (!vehicle) return null;

  const statusOptions = [
    { 
      status: VehicleStatus.AVAILABLE, 
      label: 'Available', 
      icon: CirclePlay, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50',
      description: 'Asset is ready for dispatch.'
    },
    { 
      status: VehicleStatus.IN_TRANSIT, 
      label: 'In Transit', 
      icon: Truck, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50',
      description: 'Asset is currently active in the field.'
    },
    { 
      status: VehicleStatus.MAINTENANCE, 
      label: 'Maintenance', 
      icon: Wrench, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50',
      description: 'Asset is offline for essential servicing.'
    },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-white">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Status Command</h2>
            <p className="text-xs font-semibold text-slate-400 mt-1">{vehicle.name}</p>
          </div>
          <button onClick={onClose} className="p-2.5 text-slate-300 hover:text-slate-900 bg-white rounded-xl transition-all shadow-sm">
            <X size={18} />
          </button>
        </div>

        <div className="p-8 space-y-4">
          {statusOptions.map((option) => (
            <button
              key={option.status}
              onClick={() => onUpdate(vehicle.id, option.status)}
              className={`
                w-full p-5 rounded-3xl border-2 transition-all flex items-start gap-5 text-left group
                ${vehicle.status === option.status 
                  ? 'border-indigo-600 bg-indigo-50/30' 
                  : 'border-slate-50 hover:border-slate-100 hover:bg-slate-50'}
              `}
            >
              <div className={`p-3 rounded-2xl ${option.bg} ${option.color} shadow-sm group-hover:scale-110 transition-transform`}>
                <option.icon size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`font-bold text-xs uppercase tracking-widest ${vehicle.status === option.status ? 'text-indigo-600' : 'text-slate-900'}`}>
                    {option.label}
                  </span>
                  {vehicle.status === option.status && (
                    <div className="p-1 bg-indigo-600 text-white rounded-full">
                      <Check size={10} strokeWidth={4} />
                    </div>
                  )}
                </div>
                <p className="text-[10px] font-medium text-slate-400 mt-1.5 leading-relaxed">
                  {option.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-50">
          <div className="flex items-center gap-3 text-slate-400 p-4 bg-white rounded-2xl border border-slate-100">
            <TriangleAlert size={16} className="text-amber-500 shrink-0" />
            <p className="text-[9px] font-bold leading-tight uppercase tracking-wider text-slate-500">
              Protocol update will propagate to all dispatch nodes instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdateModal;
