
import React, { useState } from 'react';
import { UserRole, User, Notification } from '../types';
import { Truck, ShieldCheck, User as UserIcon, ArrowRight, Lock, ChevronLeft, Briefcase, UserPlus, Inbox, X, Bell, Shield } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onRegister: (user: User) => void;
  users: User[];
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onRegister, users, notifications, onMarkAsRead }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(UserRole.USER);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showInbox, setShowInbox] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = users.find(u => u.username === username && u.password === password && u.role === selectedRole);
    if (user) {
      if (!user.isApproved) {
        setError('Account pending approval.');
        return;
      }
      onLogin(user);
    } else {
      setError(`Invalid credentials.`);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (users.some(u => u.username === username)) { setError('Username taken.'); return; }
    if (users.some(u => u.email === email)) { setError('Email registered.'); return; }

    const newUser: User = {
      id: `u-self-${Date.now()}`,
      username, 
      password, 
      fullName, 
      email,
      role: UserRole.USER,
      mustChangePassword: false,
      isApproved: false 
    };
    onRegister(newUser);
    setSuccess('Request sent! Check Mailbox.');
    setMode('login');
    setPassword('');
  };

  const resetSelection = () => {
    setSelectedRole(null);
    setMode('login');
    setUsername(''); setPassword(''); setFullName(''); setEmail('');
    setError(''); setSuccess('');
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-slate-50 overflow-hidden font-sans">
      
      {/* LEFT HALF */}
      <div className="lg:w-1/2 h-[35vh] lg:h-full bg-slate-900 relative flex flex-col p-6 lg:p-16 justify-between overflow-hidden shrink-0">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.3)_0%,transparent_70%)] animate-pulse"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 text-white mb-6 lg:mb-12">
            <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-900/40">
              <Truck size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">Vehicle Booking</span>
          </div>
          
          <div className="space-y-4 max-w-lg">
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
              Modern Fleet <br />
              <span className="text-indigo-500">Logistics Hub.</span>
            </h1>
            <p className="text-slate-400 text-sm lg:text-base font-medium max-w-xs leading-relaxed">
              Precision orchestration and secure scheduling for regional transport operations.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between">
           <div className="px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-full flex items-center gap-3 backdrop-blur-sm">
             <span className="text-[10px] font-bold tracking-widest opacity-40 uppercase">Architect</span>
             <span className="text-[11px] font-black tracking-widest uppercase text-indigo-400">Rehan Raza</span>
           </div>
        </div>
      </div>

      {/* RIGHT HALF */}
      <div className="lg:w-1/2 flex-1 flex flex-col relative overflow-hidden bg-white">
        <header className="p-4 lg:p-10 flex justify-between items-center z-50">
          <button 
            onClick={resetSelection} 
            className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-all ${!selectedRole ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <ChevronLeft size={16} /> Switch Profile
          </button>
          
          <button 
            onClick={() => setShowInbox(true)}
            className="relative p-2.5 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white transition-all flex items-center gap-2.5 group"
          >
            <Inbox size={18} className="text-slate-400 group-hover:text-indigo-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 hidden sm:block">Mailbox</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </header>

        <div className="flex-1 flex items-center justify-center p-6 lg:p-16">
          <div className="w-full max-w-md">
            {!selectedRole ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Identity Access</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Select your operational profile</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {[
                    { role: UserRole.USER, icon: UserIcon, color: "indigo", label: "Fleet Operative", desc: "Request transport and track assets." },
                    { role: UserRole.DISPATCHER, icon: Briefcase, color: "emerald", label: "Operational Lead", desc: "Manage manifest and coordination." },
                    { role: UserRole.ADMIN, icon: ShieldCheck, color: "slate-900", label: "Central Command", desc: "System governance and audit logs." }
                  ].map((item) => (
                    <button 
                      key={item.role}
                      onClick={() => setSelectedRole(item.role)}
                      className="group flex items-center gap-5 bg-slate-50 p-5 rounded-3xl border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all text-left"
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${item.color === 'slate-900' ? 'bg-slate-900 text-white' : `bg-${item.color}-600 text-white`}`}>
                        <item.icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-slate-900 tracking-tight">{item.label}</h3>
                        <p className="text-[11px] font-medium text-slate-400 leading-tight mt-0.5">{item.desc}</p>
                      </div>
                      <ArrowRight size={18} className="text-slate-200 group-hover:text-indigo-600 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in zoom-in-95 duration-500">
                <div className="mb-8 flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${selectedRole === UserRole.ADMIN ? 'bg-slate-900 text-white' : selectedRole === UserRole.DISPATCHER ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white'}`}>
                    {mode === 'signup' ? <UserPlus size={24} /> : (selectedRole === UserRole.ADMIN ? <ShieldCheck size={24} /> : selectedRole === UserRole.DISPATCHER ? <Briefcase size={24} /> : <UserIcon size={24} />)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">{mode === 'login' ? `${selectedRole} Access` : 'Join Network'}</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                       <Shield size={12} className="text-indigo-500" /> Secure Protocol 2.4.0
                    </p>
                  </div>
                </div>

                <form onSubmit={mode === 'login' ? handleLoginSubmit : handleRegisterSubmit} className="space-y-4">
                  {(error || success) && (
                    <div className={`p-4 text-xs font-semibold rounded-2xl border ${error ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                      {error || success}
                    </div>
                  )}
                  
                  {mode === 'signup' ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" required placeholder="Full Name" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-medium transition-all" value={fullName} onChange={e => setFullName(e.target.value)} />
                        <input type="email" required placeholder="Email" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-medium transition-all" value={email} onChange={e => setEmail(e.target.value)} />
                      </div>
                      <input type="text" required placeholder="Username" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-medium transition-all" value={username} onChange={e => setUsername(e.target.value)} />
                      <input type="password" required placeholder="Security Key" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-medium transition-all" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative">
                        <UserIcon size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" required placeholder="Username" className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-medium transition-all" value={username} onChange={e => setUsername(e.target.value)} />
                      </div>
                      <div className="relative">
                        <Lock size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="password" required placeholder="Security Key" className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-medium transition-all" value={password} onChange={e => setPassword(e.target.value)} />
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <button type="submit" className={`w-full py-4 text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95 group ${selectedRole === UserRole.ADMIN ? 'bg-slate-900' : selectedRole === UserRole.DISPATCHER ? 'bg-emerald-600' : 'bg-indigo-600'}`}>
                      {mode === 'login' ? 'Verify Identity' : 'Transmit Request'} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                  {selectedRole === UserRole.USER ? (
                    <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccess(''); }} className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-800">
                      {mode === 'login' ? "Register New Account" : "Back to Login"}
                    </button>
                  ) : <div />}
                  <button onClick={resetSelection} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900">Switch Profile</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inbox */}
      {showInbox && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            <header className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">System Mailbox</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Secured Transmission Feed</p>
              </div>
              <button onClick={() => setShowInbox(false)} className="p-2 text-slate-400 hover:text-slate-900"><X size={20} /></button>
            </header>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
              {notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30">
                  <Inbox size={48} className="text-slate-200" />
                  <p className="text-[10px] font-bold mt-4 uppercase tracking-widest text-slate-400">Feed Empty</p>
                </div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} className={`p-5 rounded-2xl border transition-all cursor-pointer ${n.isRead ? 'bg-white opacity-60' : 'bg-white border-indigo-200 shadow-sm border-l-4 border-l-indigo-600'}`} onClick={() => onMarkAsRead(n.id)}>
                    <div className="flex justify-between items-center mb-3">
                       <Bell size={14} className="text-indigo-600" />
                       <span className="text-[9px] font-bold text-slate-400 tabular-nums">{n.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mb-1">{n.subject}</h4>
                    <p className="text-[10px] font-medium text-slate-500 leading-relaxed">{n.body}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
