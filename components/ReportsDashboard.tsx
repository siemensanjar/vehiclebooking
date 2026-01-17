
import React from 'react';
import { User, Booking, Vehicle, UserRole } from '../types';
import { Download, Users, MapPin, Truck, ChevronRight, FileSpreadsheet, TrendingUp, Trophy } from 'lucide-react';

interface ReportsDashboardProps {
  users: User[];
  bookings: Booking[];
  vehicles: Vehicle[];
}

const ReportsDashboard: React.FC<ReportsDashboardProps> = ({ users, bookings, vehicles }) => {
  
  // Aggregate data by user
  const userStats = users.map(user => {
    const userBookings = bookings.filter(b => b.userId === user.id);
    const uniqueDestinations = Array.from(new Set(userBookings.map(b => b.destination)));
    const uniqueVehicles = Array.from(new Set(userBookings.map(b => {
      const v = vehicles.find(veh => veh.id === b.vehicleId);
      return v ? v.name : 'Unknown';
    })));

    return {
      userId: user.id,
      fullName: user.fullName,
      username: user.username,
      role: user.role,
      bookingCount: userBookings.length,
      destinations: uniqueDestinations,
      vehicleNames: uniqueVehicles,
      lastMission: userBookings.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())[0]?.startTime
    };
  }).sort((a, b) => b.bookingCount - a.bookingCount);

  const totalBookings = bookings.length;
  const busiestUser = userStats[0];

  const handleExportCSV = () => {
    const headers = ["Booking ID", "Operative", "Role", "Vehicle", "Departure", "Destination", "Purpose", "Status"];
    const rows = bookings.map(b => {
      const user = users.find(u => u.id === b.userId);
      const vehicle = vehicles.find(v => v.id === b.vehicleId);
      return [
        b.id,
        user?.fullName || b.userName,
        user?.role || 'N/A',
        vehicle?.name || 'Unknown',
        new Date(b.startTime).toLocaleString(),
        b.destination.replace(/,/g, ''), // Basic sanitization
        b.purpose.replace(/,/g, ''),
        b.status
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `booking_details_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500 ease-out pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Fleet Insights</h1>
          <p className="text-slate-600 font-bold text-base mt-2">Audit mission frequency, operative performance, and regional reach.</p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="flex items-center gap-3 px-8 py-5 bg-slate-900 text-white font-black text-sm uppercase tracking-[0.2em] rounded-[1.5rem] hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-200 active:scale-95 group"
        >
          <Download size={22} className="group-hover:-translate-y-1 transition-transform" /> Export Booking Details (CSV)
        </button>
      </header>

      {/* Highlights Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-8">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center shadow-inner">
            <FileSpreadsheet size={36} />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Global Missions</p>
            <h4 className="text-4xl font-black text-slate-900 tabular-nums tracking-tighter">{totalBookings}</h4>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-8 group hover:border-indigo-200 transition-all">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
            <Trophy size={36} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Top Operative</p>
            <h4 className="text-xl font-black text-slate-900 truncate tracking-tight">{busiestUser?.fullName || 'N/A'}</h4>
            <p className="text-xs font-black text-emerald-600 uppercase mt-2">{busiestUser?.bookingCount || 0} Missions Completed</p>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-8">
          <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center shadow-inner">
            <TrendingUp size={36} />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Fleet Utilization</p>
            <h4 className="text-4xl font-black text-slate-900 tabular-nums tracking-tighter">
              {vehicles.filter(v => bookings.some(b => b.vehicleId === v.id)).length} / {vehicles.length}
            </h4>
          </div>
        </div>
      </div>

      {/* Main Stats Table */}
      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden">
        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-4 uppercase tracking-[0.2em]">
            <Users size={22} className="text-indigo-600" /> Operative Audit Logs
          </h3>
          <div className="flex items-center gap-3">
             <div className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse"></div>
             <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Real-time Metrics</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-8 text-xs font-black text-slate-400 uppercase tracking-widest">Operative Identity</th>
                <th className="p-8 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Mission Count</th>
                <th className="p-8 text-xs font-black text-slate-400 uppercase tracking-widest">Active Corridors</th>
                <th className="p-8 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Deployment Window</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {userStats.map((stat) => (
                <tr key={stat.userId} className="group hover:bg-slate-50/80 transition-all">
                  <td className="p-8">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-black shadow-md ${stat.role === UserRole.ADMIN ? 'bg-slate-900 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                        {stat.fullName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-base font-black text-slate-900 tracking-tight">{stat.fullName}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Operative Account: @{stat.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-black text-slate-900 tabular-nums">{stat.bookingCount}</span>
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
                        <div 
                          className="h-full bg-indigo-600 rounded-full shadow-[0_0_8px_rgba(79,70,229,0.3)]" 
                          style={{ width: `${Math.min(100, (stat.bookingCount / (totalBookings || 1)) * 500)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex flex-wrap gap-2 max-w-[400px]">
                      {stat.destinations.length > 0 ? stat.destinations.slice(0, 3).map((d, idx) => (
                        <span key={idx} className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 flex items-center gap-2 shadow-sm uppercase tracking-tight">
                          <MapPin size={12} className="text-indigo-400" /> {d}
                        </span>
                      )) : <span className="text-xs text-slate-300 font-bold uppercase tracking-widest italic">Asset Standby</span>}
                      {stat.destinations.length > 3 && (
                        <span className="text-xs font-black text-indigo-600 flex items-center gap-1 ml-2">
                          +{stat.destinations.length - 3} Units
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-8 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-black text-slate-900 tabular-nums uppercase">
                        {stat.lastMission ? new Date(stat.lastMission).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Pending Dispatch'}
                      </span>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
                        {stat.lastMission ? new Date(stat.lastMission).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-10 bg-slate-50 border-t border-slate-100 flex justify-center">
           <p className="text-xs font-black text-slate-400 uppercase tracking-[0.5em] flex items-center gap-6">
             End of Booking Details <ChevronRight size={18} className="text-indigo-600" />
           </p>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;
