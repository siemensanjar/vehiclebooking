
import React, { useState } from 'react';
import { Vehicle, VehicleStatus, Booking, BookingStatus, VehicleType } from '../types';
import { Trash2, MapPin, Plus, Truck, Car, Bike, Clock, Edit2, Save, X, ArrowRight, Activity, Calendar } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  onBook: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
  onUpdate: (vehicle: Vehicle) => void;
  isAdminMode: boolean;
  allVehicleBookings?: Booking[]; 
}

const VehicleCard: React.FC<VehicleCardProps> = ({ 
  vehicle, 
  onBook, 
  onDelete, 
  onUpdate,
  isAdminMode,
  allVehicleBookings = []
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editFields, setEditFields] = useState<Vehicle>({ ...vehicle });

  const now = new Date();
  const activeBooking = allVehicleBookings.find(b => 
    b.status === BookingStatus.APPROVED && 
    new Date(b.startTime) <= now && 
    new Date(b.endTime) > now
  );

  const isAvailable = vehicle.status === VehicleStatus.AVAILABLE && !activeBooking;

  const handleSave = () => {
    onUpdate(editFields);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditFields({ ...vehicle });
    setIsEditing(false);
  };

  const getStatusStyles = (status: VehicleStatus) => {
    if (activeBooking) return 'bg-indigo-600 text-white shadow-indigo-100';
    switch (status) {
      case VehicleStatus.AVAILABLE: return 'bg-emerald-500 text-white shadow-emerald-100';
      case VehicleStatus.IN_TRANSIT: return 'bg-indigo-600 text-white shadow-indigo-100';
      case VehicleStatus.MAINTENANCE: return 'bg-amber-500 text-white shadow-amber-100';
      default: return 'bg-slate-500 text-white';
    }
  };

  const getVehicleIcon = (type: VehicleType) => {
    const size = 20; 
    switch (type) {
      case VehicleType.TRUCK: return <Truck size={size} />;
      case VehicleType.VAN: return <Truck size={size} />;
      case VehicleType.MOTORCYCLE: return <Bike size={size} />;
      case VehicleType.BOLERO: return <Car size={size} />;
      default: return <Car size={size} />;
    }
  };

  return (
    <div className={`bg-white rounded-3xl md:rounded-[2.5rem] border overflow-hidden transition-all duration-500 shadow-sm hover:shadow-2xl relative min-h-[340px] flex flex-col group ${isEditing ? 'border-indigo-400 ring-4 ring-indigo-50' : 'border-slate-100 hover:border-indigo-200'}`}>
      
      <div className="p-6 md:p-8 flex flex-col space-y-5 md:space-y-6 flex-1">
        {!isEditing && (
          <div className="flex justify-between items-start">
            <div className={`p-3 md:p-4 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${getStatusStyles(vehicle.status)}`}>
              {getVehicleIcon(vehicle.type)}
            </div>
            <div className={`px-3 py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1.5 md:gap-2 ${getStatusStyles(vehicle.status)}`}>
              {isAvailable && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>}
              {activeBooking ? 'In Use' : vehicle.status}
            </div>
          </div>
        )}

        {isEditing ? (
          <div className="space-y-4 animate-in fade-in duration-300">
            <input 
              type="text" 
              className="w-full text-sm font-bold bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none"
              value={editFields.name}
              onChange={e => setEditFields({...editFields, name: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-3">
              <input 
                type="text" 
                className="w-full text-xs font-bold bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl uppercase"
                value={editFields.licensePlate}
                onChange={e => setEditFields({...editFields, licensePlate: e.target.value})}
              />
              <input 
                type="text" 
                className="w-full text-xs font-bold bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl"
                value={editFields.origin}
                onChange={e => setEditFields({...editFields, origin: e.target.value})}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-black text-[9px] uppercase tracking-widest">Save</button>
              <button onClick={handleCancel} className="px-4 bg-slate-100 text-slate-400 py-3 rounded-xl"><X size={16} /></button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6 flex-1">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors duration-500 truncate">{vehicle.name}</h3>
              <div className="flex items-center gap-3 md:gap-4 mt-2 md:mt-3">
                <span className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest">{vehicle.licensePlate}</span>
                <span className="w-1.5 h-1.5 bg-slate-100 rounded-full"></span>
                <span className="text-[9px] md:text-[11px] font-black text-indigo-400 uppercase tracking-widest">{vehicle.type}</span>
              </div>
            </div>
            
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center gap-3 md:gap-4 text-slate-600 bg-slate-50 py-3 md:py-4 px-4 md:px-5 rounded-2xl border border-slate-100">
                <MapPin size={14} className="text-indigo-500 shrink-0" />
                <span className="text-[9px] md:text-[11px] font-black uppercase truncate tracking-widest">{vehicle.origin} Hub</span>
              </div>
              {activeBooking && (
                <div className="flex items-center gap-3 md:gap-4 text-white bg-slate-900 py-3 md:py-4 px-4 md:px-5 rounded-2xl shadow-xl">
                  <Activity size={14} className="text-indigo-400 animate-pulse shrink-0" />
                  <p className="text-[9px] md:text-[11px] font-black truncate tracking-tight uppercase">{activeBooking.userName}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {!isEditing && (
          <div className="flex gap-2 md:gap-3 mt-auto">
            <button 
              onClick={() => onBook(vehicle)}
              disabled={vehicle.status === VehicleStatus.MAINTENANCE || !!activeBooking}
              className={`flex-[3] py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 md:gap-3 shadow-lg active:scale-95 ${isAvailable ? 'bg-indigo-600 text-white hover:bg-slate-900' : 'bg-slate-50 text-slate-300 cursor-not-allowed shadow-none'}`}
            >
              {activeBooking ? <Clock size={16} /> : <Calendar size={16} />}
              {activeBooking ? 'Slot Taken' : isAvailable ? 'Book Slot' : 'Offline'}
            </button>
            
            {isAdminMode && (
              <div className="flex gap-2 animate-in slide-in-from-right-4 duration-300">
                <button onClick={() => setIsEditing(true)} className="p-4 md:p-5 bg-white text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl md:rounded-2xl border border-slate-100 transition-all">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => onDelete(vehicle.id)} className="p-4 md:p-5 bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl md:rounded-2xl border border-slate-100 transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleCard;
