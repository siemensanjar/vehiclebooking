import React, { useState, useEffect } from 'react';
import { 
  Truck, Plus, Activity, AlertTriangle, 
  Navigation, X, Lock, Unlock, Calendar, CheckCircle, Clock, MapPin, Target, ChevronLeft, ChevronRight
} from 'lucide-react';
import { 
  Vehicle, VehicleStatus, Booking, BookingStatus, 
  UserRole, User
} from './types';
import VehicleCard from './components/VehicleCard';
import BookingModal from './components/BookingModal';
import AddVehicleModal from './components/AddVehicleModal';
import AdminAuthModal from './components/AdminAuthModal';
import { onSnapshot, query } from "firebase/firestore";
import { 
  vehiclesRef, 
  bookingsRef, 
  fbAddBooking, 
  fbAddVehicle, 
  fbDeleteVehicle, 
  fbUpdateVehicle 
} from './services/firebaseService';

const App: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [conflict, setConflict] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const q = query(vehiclesRef);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const vehicleData: Vehicle[] = [];
      snapshot.forEach((doc) => {
        vehicleData.push({ ...doc.data() } as Vehicle);
      });
      setVehicles(vehicleData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(bookingsRef);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookingData: Booking[] = [];
      snapshot.forEach((doc) => {
        bookingData.push({ ...doc.data() } as Booking);
      });
      setBookings(bookingData.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 5000);
    return () => clearInterval(timer);
  }, []);

  const handleBookingSubmit = async (data: any) => {
    if (!selectedVehicleForBooking) return;
    const nStart = new Date(data.startTime);
    const nEnd = new Date(data.endTime);
    const today = new Date();

    if (nStart.toDateString() !== today.toDateString()) {
      setConflict(`DATE REJECTED: Today only (${today.toLocaleDateString()}).`);
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
      setConflict(`SCHEDULING CLASH: This vehicle is already busy.`);
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
      status: BookingStatus.APPROVED,
      userId: currentUser.id
    };

    try {
      await fbAddBooking(newBooking);
      setSelectedVehicleForBooking(null);
      setCurrentPage(1); // Reset to first page on new booking
    } catch (err) {
      setConflict("DATABASE ERROR: Failed to save booking.");
    }
  };

  const handleAddVehicle = async (newVehicle: Vehicle) => {
    try {
      await fbAddVehicle(newVehicle);
      setIsAddModalOpen(false);
    } catch (err) {}
  };

  const handleDeleteVehicle = async (id: string) => {
    try {
      await fbDeleteVehicle(id);
    } catch (err) {}
  };

  const handleUpdateVehicle = async (updatedVehicle: Vehicle) => {
    try {
      await fbUpdateVehicle(updatedVehicle);
    } catch (err) {}
  };

  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Pagination Logic
  const totalPages = Math.ceil(bookings.length / ITEMS_PER_PAGE);
  const currentBookings = bookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {conflict && (
        <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[300] w-[90%] max-w-md bg-rose-600 text-white p-2 rounded-lg shadow-xl flex items-center justify-between animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} />
            <p className="text-[10px] font-bold uppercase">{conflict}</p>
          </div>
          <button onClick={() => setConflict(null)}><X size={14} /></button>
        </div>
      )}

      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 px-6 py-4 md:py-5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100">
              <Truck size={20} />
            </div>
            <h1 className="text-lg md:text-xl font-black tracking-tight text-slate-900">FleetManager</h1>
          </div>
          <div className="flex items-center gap-3">
            {isAdminMode && (
              <button 
                onClick={() => setIsAddModalOpen(true)} 
                className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
              >
                <Plus size={20} />
              </button>
            )}
            <button 
              onClick={() => isAdminMode ? setIsAdminMode(false) : setIsAuthModalOpen(true)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all shadow-sm font-bold text-xs uppercase tracking-widest ${isAdminMode ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-600 hover:text-indigo-600'}`}
            >
              <span>{isAdminMode ? 'Admin' : 'Login'}</span>
              {isAdminMode ? <Unlock size={14} /> : <Lock size={14} />}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 flex-1 w-full pb-20">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Vehicles</h2>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{vehicles.length} Units</span>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="h-40 bg-slate-200 rounded-xl animate-pulse"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {vehicles.map(v => (
                <VehicleCard 
                  key={v.id} 
                  vehicle={v} 
                  isAdminMode={isAdminMode}
                  onBook={setSelectedVehicleForBooking}
                  onDelete={handleDeleteVehicle}
                  onUpdate={handleUpdateVehicle}
                  allVehicleBookings={bookings.filter(b => b.vehicleId === v.id)}
                />
              ))}
            </div>
          )}
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Bookings Log</h2>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Showing {currentBookings.length} of {bookings.length}</span>
          </div>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-lg overflow-hidden flex flex-col">
            {currentBookings.length > 0 ? (
              <>
                <div className="divide-y divide-slate-50">
                  {currentBookings.map(b => {
                    const v = vehicles.find(veh => veh.id === b.vehicleId);
                    const startTime = new Date(b.startTime);
                    const endTime = new Date(b.endTime);
                    let statusLabel = 'Pending';
                    let statusClass = 'bg-amber-100 text-amber-700';
                    if (currentTime >= startTime && currentTime < endTime) {
                      statusLabel = 'Active';
                      statusClass = 'bg-indigo-600 text-white';
                    } else if (currentTime >= endTime) {
                      statusLabel = 'Closed';
                      statusClass = 'bg-slate-100 text-slate-500';
                    }
                    return (
                      <div key={b.id} className="p-5 md:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:bg-slate-50/80 transition-all group animate-in fade-in duration-500">
                        <div className="flex items-center gap-5">
                          <div className="w-13 h-13 md:w-14 md:h-14 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-900 text-xl shadow-inner group-hover:bg-white transition-all shrink-0">
                            {b.userName.charAt(0)}
                          </div>
                          <div className="space-y-1.5">
                            <p className="font-black text-slate-900 text-lg tracking-tight leading-none group-hover:text-indigo-600 transition-colors">
                              {b.userName}
                            </p>
                            <div className="flex flex-wrap items-center gap-2.5">
                              <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.1em] bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                                {v?.name || 'Asset'}
                              </span>
                              <span className="text-slate-200 hidden md:block">•</span>
                              <div className="flex items-center gap-1 text-slate-400">
                                <MapPin size={12} className="text-slate-300" />
                                <p className="text-[9px] font-bold uppercase tracking-widest">{b.destination}</p>
                              </div>
                            </div>
                            {b.purpose && (
                              <div className="flex items-center gap-1.5 text-slate-400">
                                <Target size={11} className="text-slate-300" />
                                <p className="text-[9px] font-semibold italic text-slate-500 line-clamp-1 max-w-xs">"{b.purpose}"</p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                          <div className="text-left md:text-right space-y-0.5">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Time Window</p>
                            <p className="text-base font-black text-slate-900 tabular-nums">
                              {formatTime(b.startTime)} — {formatTime(b.endTime)}
                            </p>
                          </div>
                          <div className={`px-3.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] ${statusClass}`}>
                            {statusLabel}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="p-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-[9px] font-black uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
                    >
                      <ChevronLeft size={12} /> Prev
                    </button>
                    
                    <div className="flex items-center gap-4">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Page <span className="text-indigo-600">{currentPage}</span> of {totalPages}
                      </p>
                    </div>

                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-[9px] font-black uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
                    >
                      Next <ChevronRight size={12} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-center opacity-30">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-5">
                   <Clock size={28} className="text-slate-400" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em]">Zero Active Transmissions</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-100 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-sans">
            © 2025 FleetManager Operations. All rights reserved.
          </p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-sans">
            Developed By <span className="text-indigo-600">Rehan Raza</span>
          </p>
        </div>
      </footer>

      {selectedVehicleForBooking && (
        <BookingModal vehicle={selectedVehicleForBooking} currentUser={currentUser} onClose={() => setSelectedVehicleForBooking(null)} onSubmit={handleBookingSubmit} />
      )}
      {isAddModalOpen && (
        <AddVehicleModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddVehicle} />
      )}
      {isAuthModalOpen && (
        <AdminAuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={() => { setIsAdminMode(true); setIsAuthModalOpen(false); }} />
      )}
    </div>
  );
};

export default App;
