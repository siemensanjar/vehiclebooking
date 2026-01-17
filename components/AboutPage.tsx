
import React, { useState } from 'react';
import { Award, Code, Globe, Linkedin, Github, Mail, ShieldCheck, Zap, Heart, User, Cpu, Phone } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-right-8 duration-500 ease-out pb-10">
      {/* Hero Section */}
      <header className="text-center space-y-6 pt-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-indigo-100 shadow-sm">
          <Zap size={14} /> Next-Gen Fleet Infrastructure
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-none">
          Vehicle Booking <span className="text-indigo-600">Pro Systems</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
          A cutting-edge logistics ecosystem designed to redefine how fleets are managed, tracked, and optimized in the modern age.
        </p>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Creator Profile */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 relative overflow-hidden group shadow-xl">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-3xl bg-indigo-600 flex items-center justify-center mb-6 border-4 border-slate-800 shadow-xl transform group-hover:scale-105 transition-all">
                <div className="text-white font-bold text-3xl">RR</div>
              </div>
              
              <h2 className="text-2xl font-black text-white tracking-tight">Rehan Raza</h2>
              <p className="text-indigo-400 font-bold text-[10px] uppercase tracking-widest mt-1 mb-6">Senior Software Architect</p>
              
              <div className="w-full h-px bg-slate-800 mb-8"></div>
              
              <p className="text-slate-400 text-sm leading-relaxed font-medium mb-10">
                A visionary engineer focused on building high-performance logistics infrastructures. Specialized in real-time data orchestration and crafting interfaces that turn complex fleet data into intuitive experiences.
              </p>

              <div className="flex gap-4">
                <a href="tel:7861860423" className="p-3.5 bg-slate-800 text-white rounded-xl hover:bg-indigo-600 transition-all shadow-lg">
                  <Phone size={18} />
                </a>
                <a href="mailto:rehanraza.4a@gmail.com" className="p-3.5 bg-slate-800 text-white rounded-xl hover:bg-indigo-600 transition-all shadow-lg">
                  <Mail size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Vision & Tech */}
        <div className="lg:col-span-7 space-y-8">
          <section className="space-y-6">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Award size={14} className="text-indigo-600" /> Platform Infrastructure
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Precision Hubs", icon: Globe, desc: "Regional destination mapping with real-time ETA syncing.", color: "blue" },
                { title: "Logistics AI", icon: Cpu, desc: "Powered by Gemini for advanced scheduling recommendations.", color: "purple" },
                { title: "Secure Registry", icon: User, desc: "Rigorous audit trail logging and identity verification.", color: "indigo" },
                { title: "Active Ops", icon:Zap, desc: "Optimized interface for rapid deployment and dispatch.", color: "amber" }
              ].map((pill, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-indigo-100 transition-all group">
                   <div className={`w-10 h-10 rounded-xl bg-${pill.color}-50 text-${pill.color}-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                     <pill.icon size={20} />
                   </div>
                   <h4 className="text-base font-bold text-slate-900 mb-1">{pill.title}</h4>
                   <p className="text-[11px] font-medium text-slate-500 leading-relaxed">{pill.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-lg shadow-indigo-100">
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="space-y-3 flex-1">
                <h3 className="text-xl font-bold tracking-tight">Built for Scale</h3>
                <p className="text-indigo-100 text-xs font-medium leading-relaxed">
                  Vehicle Booking scales with your business needs, managing everything from local courier bikes to international heavy-duty fleets with the same precision.
                </p>
                <div className="flex items-center gap-6 pt-2">
                  <div className="flex flex-col">
                    <span className="text-xl font-bold tabular-nums">5.0k+</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">Assets</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold tabular-nums">98%</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">Efficiency</span>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-white/10 rounded-3xl backdrop-blur-md border border-white/10 shrink-0">
                <Code size={32} className="text-white" />
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100">
        <Heart size={14} className="text-rose-500 mx-auto mb-2 animate-pulse" />
        <p className="text-slate-500 font-semibold text-[10px] uppercase tracking-widest">
          Crafted by <span className="text-indigo-600 font-black">Rehan Raza</span> for operational excellence.
        </p>
        <div className="mt-2 pt-2 border-t border-slate-100">
           <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">© 2025 Vehicle Booking Systems</span>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
