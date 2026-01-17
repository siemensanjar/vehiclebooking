
import React, { useState, useEffect } from 'react';
import { 
  Truck, Calendar, MapPin, Clock, Plus, Activity, 
  ShieldCheck, AlertTriangle, ArrowRight, User as UserIcon,
  Navigation, CheckCircle2, Info, LogOut, X, Settings2, Shield, Lock, Unlock, Cloud, CloudOff
} from 'lucide-react';
import { 
  Vehicle, VehicleStatus, Booking, BookingStatus, 
  UserRole, User, VehicleType 
} from './types';
import { INITIAL_VEHICLES } from './constants';
import { onSnapshot, query, collection, getDocs } from "firebase/firestore";
import { 
  db, 
  vehiclesRef, 
  bookingsRef, 
  fbUpdateVehicle, 
  fbDeleteVehicle, 
  fbAddBooking, 
  fbAddVehicle 
} from './services/firebaseService';
import VehicleCard from './components/VehicleCard';
import BookingModal from './components/BookingModal';
import AddVehicleModal from './components/AddVehicleModal';
import StatusUpdateModal from './components/StatusUpdateModal';
import AdminAuthModal from './components/AdminAuthModal';

const App: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  const [currentUser] = useState<User>({
    id: 'op-1',
    username: 'admin',
    fullName: 'Admin',
    email: 'admin@transportpro.io',
    role: UserRole.ADMIN,
    isApproved: true
  });

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedVehicleForBooking, setSelectedVehicleForBooking] = useState<Vehicle | null>(null);
  const [selectedVehicleForStatus, setSelectedVehicleForStatus] = useState<Vehicle | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [conflict, setConflict] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time Firebase Subscriptions
  useEffect(() => {
    const qVehicles = query(vehiclesRef);
    const qBookings = query(bookingsRef);

    const unsubVehicles = onSnapshot(qVehicles, (snapshot) => {
      const vehicleData: Vehicle[] = [];
      snapshot.forEach((doc) => vehicleData.push(doc.data() as Vehicle));
      
      // Seed initial data if DB is completely empty
      if (vehicleData.length === 0 && loading) {
        INITIAL_VEHICLES.forEach(v => fbAddVehicle(v));
      } else {
        setVehicles(vehicleData);
      }
      setLoading(false);
    }, (err) => {
      console.error(err);
      setIsOnline(false);
    });

    const unsubBookings = onSnapshot(qBookings, (snapshot) => {
      const bookingData: Booking[] = [];
      snapshot.forEach((doc) => bookingData.push(doc.data() as Booking));
      setBookings(bookingData.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()));
    });

    return () => {
      unsubVehicles();
      unsubBookings();
    };
  }, []);

  // Timer for status calculations and current time
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Note: Status logic for IN_TRANSIT is calculated on-the-fly in this effect based on bookings
      // but in a production app with Firebase, you might trigger these via Cloud Functions.
      // For this implementation, we handle it client-side for immediate feedback.
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleBookingSubmit = async (data: any) => {
    if (!selectedVehicleForBooking) return;
    const nStart = new Date(data.startTime);
    const nEnd = new Date(data.endTime);
    const today = new Date();

    if (nStart.toDateString() !== today.toDateString()) {
      setConflict(`DATE REJECTED: Today only (${today.toLocaleDateString()}).`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setConflict(null), 5000);
      return;
    }

    const startTotalMins = nStart.getHours() * 60 + nStart.getMinutes();
    const endTotalMins = nEnd.getHours() * 60 + nEnd.getMinutes();
    const windowStart = 16 * 60 + 30; 
    const windowEnd = 18 * 60 + 30;   

    if (startTotalMins < windowStart || endTotalMins > windowEnd) {
      setConflict("WINDOW REJECTED: Must be 04:30 PM - 06:30 PM.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setConflict(null), 5000);
      return;
    }

    if (nEnd <= nStart) {
      setConflict("LOGISTICS ERROR: Invalid time sequence.");
      setTimeout(() => setConflict(null), 5000);
      return;
    }

    const overlappingBooking = bookings.find(b => {
      const bStart = new Date(b.startTime);
      const bEnd = new Date(b.endTime);
      return b.vehicleId === selectedVehicleForBooking.id && 
             b.status !== BookingStatus.REJECTED && 
             nStart < bEnd && nEnd > bStart;
    });

    if (overlappingBooking) {
      setConflict(`SCHEDULING CLASH: This vehicle is already busy during those hours.`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setConflict(null), 5000);
      return;
    }

    const newBooking: Booking = { 
      id: `BK-${Math.floor(Math.random() * 9000) + 1000}`, 
      vehicleId: selectedVehicleForBooking.id, 
      userName: data.userName,
      startTime: data.startTime,
      endTime: data.endTime,
      destination: data.destination,
      purpose: data.purpose,
      status: BookingStatus.APPROVED 
    };

    try {
      await fbAddBooking(newBooking);
      setSelectedVehicleForBooking(null);
    } catch (e) {
      setConflict("Firebase Save Error: Check connectivity.");
    }
  };

  const handleAddVehicle = async (newVehicle: Vehicle) => {
    await fbAddVehicle(newVehicle);
    setIsAddModalOpen(false);
  };

  const handleDeleteVehicle = async (id: string) => {
    await fbDeleteVehicle(id);
  };

  const updateVehicleStatus = async (id: string, status: VehicleStatus) => {
    const v = vehicles.find(veh => veh.id === id);
    if (v) {
      await fbUpdateVehicle({ ...v, status });
    }
    setSelectedVehicleForStatus(null);
  };

  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-4">
      {/* FIXED TOP ALERT POPUP */}
      {conflict && (
        <div className="fixed top-4 md:top-8 left-1/2 -translate-x-1/2 z-[300] w-[92%] max-w-xl bg-rose-600 text-white p-4 md:p-6 rounded-3xl md:rounded-[2.5rem] shadow-2xl border border-rose-400 flex items-center justify-between animate-in slide-in-from-top-12 duration-500">
          <div className="flex items-center gap-3 md:gap-5">
            <div className="bg-white/20 p-2 md:p-3 rounded-xl md:rounded-2xl shrink-0">
              <AlertTriangle size={20} className="text-white md:w-6 md:h-6" />
            </div>
            <div>
              <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Conflict Alert</p>
              <p className="font-bold text-xs md:text-sm tracking-tight leading-snug">{conflict}</p>
            </div>
          </div>
          <button onClick={() => setConflict(null)} className="p-2 md:p-3 hover:bg-white/10 rounded-xl transition-colors shrink-0">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Navigation Header */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 px-4 md:px-8 py-3 md:py-5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-2.5 bg-indigo-600 text-white rounded-xl md:rounded-2xl shadow-lg shadow-indigo-100">
              <Truck size={18} className="md:w-5 md:h-5" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg md:text-xl font-black tracking-tight leading-none">Vehicle Booking</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                {isOnline ? <Cloud size={10} className="text-emerald-500" /> : <CloudOff size={10} className="text-rose-500" />}
                <span className={`text-[8px] font-black uppercase tracking-widest ${isOnline ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {isOnline ? 'Real-time Sync' : 'Offline Mode'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            {isAdminMode && (
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="p-2 md:p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm border border-indigo-100 animate-in fade-in zoom-in"
                title="Add Fleet Asset"
              >
                <Plus size={20} strokeWidth={3} />
              </button>
            )}
            
            <button 
              onClick={() => isAdminMode ? setIsAdminMode(false) : setIsAuthModalOpen(true)}
              className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl border transition-all ${isAdminMode ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 border-slate-100 hover:border-slate-300'}`}
            >
              <div className={`w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl flex items-center justify-center font-black text-xs ${isAdminMode ? 'bg-white text-indigo-600' : 'bg-indigo-600 text-white'}`}>
                {currentUser.fullName.charAt(0)}
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <p className={`text-[10px] md:text-sm font-black leading-none tracking-tight ${isAdminMode ? 'text-white' : 'text-slate-900'}`}>{currentUser.fullName}</p>
                {isAdminMode ? <Unlock size={14} className="opacity-70" /> : <Lock size={14} className="opacity-30" />}
              </div>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-12 md:space-y-16">
        {/* Fleet Section */}
        <section className="space-y-6 md:space-y-8 pt-4">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
                <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Vehicle</h2>
                {isAdminMode && <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase tracking-widest rounded-md border border-indigo-100">Editor Active</span>}
             </div>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{vehicles.length} Units</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-100 rounded-[2.5rem] animate-pulse"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              {vehicles.map(v => (
                <VehicleCard 
                  key={v.id} 
                  vehicle={v} 
                  isAdminMode={isAdminMode}
                  onBook={setSelectedVehicleForBooking}
                  onDelete={handleDeleteVehicle}
                  onUpdate={fbUpdateVehicle}
                  allVehicleBookings={bookings.filter(b => b.vehicleId === v.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Booking Details Section */}
        <section className="space-y-6 md:space-y-8 pb-10">
          <div className="flex items-center gap-4 md:gap-6">
            <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight whitespace-nowrap">Booking Details</h2>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>
          
          <div className="bg-white rounded-3xl md:rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden min-h-[300px] md:min-h-[400px]">
            {bookings.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {bookings.map(b => {
                  const v = vehicles.find(veh => veh.id === b.vehicleId);
                  const startTime = new Date(b.startTime);
                  const endTime = new Date(b.endTime);
                  const isNow = startTime <= currentTime && endTime > currentTime;
                  const isFuture = startTime > currentTime;

                  return (
                    <div key={b.id} className={`p-6 md:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-10 transition-all ${isNow ? 'bg-indigo-50/20' : 'hover:bg-slate-50/50'}`}>
                      <div className="flex items-center gap-4 md:gap-8">
                        <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-[1.5rem] flex items-center justify-center font-black text-lg md:text-xl shadow-inner shrink-0 ${isNow ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-slate-100 text-slate-400'}`}>
                          {b.userName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-lg md:text-xl font-black truncate ${isNow ? 'text-indigo-600' : 'text-slate-900'}`}>{b.userName}</p>
                          <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-1 md:mt-2">
                            <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                              <Truck size={12} className="text-indigo-500" /> {v?.name || 'Asset Offline'}
                            </span>
                            <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                              <MapPin size={12} className="text-rose-500" /> {b.destination}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-10 lg:gap-16">
                        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-center gap-6 md:gap-10 bg-white border border-slate-100 px-6 md:px-8 py-4 md:py-5 rounded-2xl md:rounded-[2rem] shadow-sm">
                           <div className="text-center">
                             <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Departure</p>
                             <p className="text-xs md:text-sm font-black text-slate-700 tabular-nums">{formatTime(b.startTime)}</p>
                           </div>
                           <ArrowRight size={14} className="text-slate-200" />
                           <div className="text-center">
                             <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Return</p>
                             <p className="text-xs md:text-sm font-black text-slate-700 tabular-nums">{formatTime(b.endTime)}</p>
                           </div>
                        </div>
                        
                        <div className={`w-full sm:w-auto px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest sm:min-w-[120px] text-center shadow-md ${
                          isNow ? 'bg-indigo-600 text-white animate-pulse shadow-indigo-100' : 
                          isFuture ? 'bg-amber-100 text-amber-700 shadow-none' : 
                          'bg-slate-100 text-slate-400 shadow-none'
                        }`}>
                          {isNow ? 'Active Unit' : isFuture ? 'Pending' : 'Completed'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-24 md:py-40 flex flex-col items-center justify-center text-center opacity-40">
                <Navigation size={48} className="text-slate-200 mb-6" />
                <p className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">No Bookings Found</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Modals */}
      {selectedVehicleForBooking && (
        <BookingModal 
          vehicle={selectedVehicleForBooking} 
          currentUser={currentUser} 
          onClose={() => setSelectedVehicleForBooking(null)} 
          onSubmit={handleBookingSubmit} 
        />
      )}
      
      {isAddModalOpen && (
        <AddVehicleModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onAdd={handleAddVehicle} 
        />
      )}

      {selectedVehicleForStatus && (
        <StatusUpdateModal 
          vehicle={selectedVehicleForStatus} 
          onClose={() => setSelectedVehicleForStatus(null)} 
          onUpdate={updateVehicleStatus} 
        />
      )}

      {isAuthModalOpen && (
        <AdminAuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          onSuccess={() => {
            setIsAdminMode(true);
            setIsAuthModalOpen(false);
          }} 
        />
      )}

      {/* ULTRA COMPACT FOOTER WITH BOLD CREDIT */}
      <footer className="max-w-7xl mx-auto px-4 md:px-8 mt-4">
        <div className="py-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 opacity-50 hover:opacity-100 transition-opacity">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <div className="flex items-center gap-2">
              <Truck size={12} className="text-slate-900" />
              <span className="text-[9px] font-black text-slate-900 tracking-[0.2em] uppercase">Vehicle Booking</span>
            </div>
            <span className="hidden sm:inline text-[8px] font-bold text-slate-400 uppercase tracking-widest">
              • Designed by <span className="font-black text-slate-800">Rehan Raza</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-emerald-600">
              <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[8px] font-black uppercase tracking-widest">Live</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Shield size={9} />
              <span className="text-[8px] font-black uppercase tracking-widest">v3.5 Responsive</span>
            </div>
            <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest opacity-40">© 2025</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
