
import React, { useState, useEffect } from 'react';
import { 
  Truck, Plus, Activity, AlertTriangle, ArrowRight, 
  Navigation, X, Lock, Unlock, Calendar, MapPin, CheckCircle, Clock
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

  // Synchronize Vehicles from Firebase
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

  // Synchronize Bookings from Firebase
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

  // Timer for current time updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
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
    } catch (err) {
      console.error("Firebase Booking Error:", err);
      setConflict("DATABASE ERROR: Failed to save booking.");
    }
  };

  const handleAddVehicle = async (newVehicle: Vehicle) => {
    try {
      await fbAddVehicle(newVehicle);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error("Firebase Add Vehicle Error:", err);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    try {
      await fbDeleteVehicle(id);
    } catch (err) {
      console.error("Firebase Delete Error:", err);
    }
  };

  const handleUpdateVehicle = async (updatedVehicle: Vehicle) => {
    try {
      await fbUpdateVehicle(updatedVehicle);
    } catch (err) {
      console.error("Firebase Update Error:", err);
    }
  };

  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      {conflict && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[300] w-[90%] max-w-md bg-rose-600 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between animate-in slide-in-from-top-4">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} />
            <p className="text-sm font-bold">{conflict}</p>
          </div>
          <button onClick={() => setConflict(null)}><X size={18} /></button>
        </div>
      )}

      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 text-white rounded-xl">
              <Truck size={20} />
            </div>
            <h1 className="text-xl font-black tracking-tight">Vehicle Booking</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {isAdminMode && (
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
              >
                <Plus size={20} />
              </button>
            )}
            <button 
              onClick={() => isAdminMode ? setIsAdminMode(false) : setIsAuthModalOpen(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${isAdminMode ? 'bg-indigo-600 text-white' : 'bg-white'}`}
            >
              <span className="text-xs font-bold">{isAdminMode ? 'Admin Active' : 'Login'}</span>
              {isAdminMode ? <Unlock size={14} /> : <Lock size={14} />}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 space-y-12">
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900">Vehicles</h2>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{vehicles.length} Units</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-200 rounded-3xl animate-pulse"></div>)}
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
          <h2 className="text-2xl font-black text-slate-900">Active Bookings</h2>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            {bookings.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {bookings.map(b => {
                  const v = vehicles.find(veh => veh.id === b.vehicleId);
                  const startTime = new Date(b.startTime);
                  const endTime = new Date(b.endTime);
                  
                  let statusLabel = 'Pending';
                  let statusClass = 'bg-amber-100 text-amber-700';
                  let Icon = Clock;

                  if (currentTime >= startTime && currentTime < endTime) {
                    statusLabel = 'In Progress';
                    statusClass = 'bg-indigo-600 text-white';
                    Icon = Activity;
                  } else if (currentTime >= endTime) {
                    statusLabel = 'Completed';
                    statusClass = 'bg-emerald-500 text-white';
                    Icon = CheckCircle;
                  }

                  return (
                    <div key={b.id} className={`p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 ${statusLabel === 'In Progress' ? 'bg-indigo-50/30' : ''}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${statusLabel === 'In Progress' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                          {b.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{b.userName}</p>
                          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase">
                            <span>{v?.name || 'Unknown'}</span>
                            <span>•</span>
                            <span>{b.destination}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-600">{formatTime(b.startTime)} - {formatTime(b.endTime)}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(b.startTime).toLocaleDateString()}</p>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${statusClass}`}>
                          <Icon size={12} className={statusLabel === 'In Progress' ? 'animate-pulse' : ''} />
                          {statusLabel}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center opacity-30">
                <Navigation size={40} className="mb-4" />
                <p className="text-sm font-bold uppercase tracking-widest">No Bookings Yet</p>
              </div>
            )}
          </div>
        </section>
      </main>

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
    </div>
  );
};

export default App;
