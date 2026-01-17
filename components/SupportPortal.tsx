
import React, { useState } from 'react';
import { 
  HelpCircle, MessageSquare, Phone, Mail, 
  Search, ChevronDown, Send, CheckCircle2, 
  LifeBuoy, FileText, ShieldAlert, Globe, Edit3, Save, X, Plus, Trash2
} from 'lucide-react';
import { UserRole, SupportConfig } from '../types';

interface SupportPortalProps {
  config: SupportConfig;
  userRole: UserRole;
  onUpdateConfig: (newConfig: SupportConfig) => void;
  onNavigateToChat: () => void;
}

const SupportPortal: React.FC<SupportPortalProps> = ({ config, userRole, onUpdateConfig, onNavigateToChat }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Local state for editing
  const [editData, setEditData] = useState<SupportConfig>(config);

  const handleSave = () => {
    onUpdateConfig(editData);
    setIsEditing(false);
  };

  const addFaq = () => {
    setEditData({
      ...editData,
      faqs: [...editData.faqs, { q: "New Question", a: "New Answer" }]
    });
  };

  const removeFaq = (index: number) => {
    const newFaqs = [...editData.faqs];
    newFaqs.splice(index, 1);
    setEditData({ ...editData, faqs: newFaqs });
  };

  const updateFaq = (index: number, field: 'q' | 'a', value: string) => {
    const newFaqs = [...editData.faqs];
    newFaqs[index][field] = value;
    setEditData({ ...editData, faqs: newFaqs });
  };

  const filteredFaqs = config.faqs.filter(f => 
    f.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500 ease-out pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Support Center</h1>
          <p className="text-slate-500 font-medium mt-2">Find answers, browse documentation, or contact our logistics experts.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search help articles..."
              className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none w-full md:w-80 transition-all shadow-sm font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {userRole === UserRole.ADMIN && (
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`p-4 rounded-2xl border-2 transition-all ${isEditing ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-500 hover:text-indigo-600'}`}
            >
              {isEditing ? <X size={20} /> : <Edit3 size={20} />}
            </button>
          )}
        </div>
      </header>

      {isEditing && userRole === UserRole.ADMIN && (
        <div className="bg-indigo-900 p-10 rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-white">Support Configuration</h2>
            <button 
              onClick={handleSave}
              className="px-6 py-3 bg-white text-indigo-900 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-50 transition-colors"
            >
              <Save size={16} /> Save Changes
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest ml-1">Support Phone</label>
              <input 
                type="text"
                className="w-full px-5 py-3.5 bg-indigo-800/50 border border-indigo-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-white transition-all font-medium"
                value={editData.phone}
                onChange={e => setEditData({...editData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest ml-1">Support Email</label>
              <input 
                type="email"
                className="w-full px-5 py-3.5 bg-indigo-800/50 border border-indigo-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-white transition-all font-medium"
                value={editData.email}
                onChange={e => setEditData({...editData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest ml-1">FAQ Management</label>
              <button onClick={addFaq} className="text-white hover:text-emerald-400 transition-colors">
                <Plus size={20} />
              </button>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {editData.faqs.map((faq, i) => (
                <div key={i} className="p-6 bg-indigo-800/30 border border-indigo-700 rounded-3xl space-y-3 relative group">
                  <button onClick={() => removeFaq(i)} className="absolute top-4 right-4 text-indigo-400 hover:text-rose-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                  <input 
                    type="text" 
                    className="w-full bg-transparent border-b border-indigo-700 text-white font-bold text-sm py-1 outline-none focus:border-white transition-colors"
                    value={faq.q}
                    onChange={e => updateFaq(i, 'q', e.target.value)}
                    placeholder="Question"
                  />
                  <textarea 
                    className="w-full bg-transparent text-indigo-100 text-xs py-1 outline-none resize-none focus:text-white transition-colors"
                    rows={2}
                    value={faq.a}
                    onChange={e => updateFaq(i, 'a', e.target.value)}
                    placeholder="Answer"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Access Cards - ACTIVATED */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Phone, title: "24/7 Hotline", desc: "Emergency roadside & dispatch assistance", action: config.phone, link: `tel:${config.phone.replace(/[^0-9]/g, '')}`, color: "indigo" },
          { icon: MessageSquare, title: "Live Chat", desc: "Talk to our Gemini Logistics AI", action: "Start Session", onClick: onNavigateToChat, color: "emerald" },
          { icon: Mail, title: "Email Support", desc: "For non-urgent inquiries", action: config.email, link: `mailto:${config.email}`, color: "slate" }
        ].map((item, i) => {
          const content = (
            <>
              <div className={`w-14 h-14 rounded-2xl bg-${item.color}-50 text-${item.color}-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm`}>
                <item.icon size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">{item.title}</h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6">{item.desc}</p>
              <div className="w-full py-3 bg-slate-50 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest group-hover:bg-indigo-600 group-hover:text-white transition-all text-center">
                {item.action}
              </div>
            </>
          );

          if (item.onClick) {
            return (
              <button key={i} onClick={item.onClick} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-indigo-200 hover:shadow-xl transition-all group text-left w-full">
                {content}
              </button>
            );
          }

          return (
            <a key={i} href={item.link} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-indigo-200 hover:shadow-xl transition-all group block">
              {content}
            </a>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* FAQ Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 uppercase tracking-wider text-xs">
            <HelpCircle size={16} className="text-indigo-600" />
            Knowledge Base
          </h3>
          <div className="space-y-3">
            {filteredFaqs.length > 0 ? filteredFaqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm transition-all hover:border-indigo-100">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                >
                  <span className="text-sm font-bold text-slate-800">{faq.q}</span>
                  <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === i && (
                  <div className="px-6 pb-6 animate-in slide-in-from-top-2">
                    <p className="text-xs text-slate-500 leading-relaxed font-medium pt-2 border-t border-slate-50">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            )) : (
              <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-[2.5rem]">
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No articles match your search</p>
              </div>
            )}
          </div>
        </div>

        {/* Support Ticket Form */}
        <div className="space-y-6">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 uppercase tracking-wider text-xs">
            <LifeBuoy size={16} className="text-indigo-600" />
            Rapid Response Ticket
          </h3>
          <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
            
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4 animate-in zoom-in-95">
                <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-900/20">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-white">Ticket Queued</h4>
                  <p className="text-slate-400 text-xs font-medium mt-2 px-4">Priority mission ID assigned. Our team will ping your dashboard shortly.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="space-y-5 relative z-10">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Inquiry Category</label>
                  <select className="w-full px-5 py-3.5 bg-slate-800 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-xs font-medium appearance-none cursor-pointer">
                    <option>Fleet Disruption</option>
                    <option>Booking Modification</option>
                    <option>Billing & Claims</option>
                    <option>Technical Anomaly</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Mission Details</label>
                  <textarea 
                    rows={4}
                    required
                    placeholder="Describe the situation clearly..."
                    className="w-full px-5 py-3.5 bg-slate-800 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-xs font-medium"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-900/20"
                >
                  <Send size={14} /> Transmit Request
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer Support Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: FileText, label: "Technical Docs", sub: "Fleet API v2.0" },
          { icon: Globe, label: "System Status", sub: "All Nodes Active" },
          { icon: ShieldAlert, label: "Safety Center", sub: "Protocols" },
          { icon: LifeBuoy, label: "Tutorials", sub: "Visual Guides" }
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group">
            <div className="p-2.5 bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 rounded-xl transition-all">
              <item.icon size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-900 leading-none">{item.label}</p>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-1.5">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportPortal;
