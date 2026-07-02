import React, { useState } from 'react';
import { Map, Clock, CheckCircle2, FileText, User, BellRing, MessageSquare, X, Calendar, Type } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_STAGES = [
  { id: 1, title: 'Drafting & Filing', status: 'completed', date: 'Oct 12, 2025' },
  { id: 2, title: 'Notice / Summons', status: 'completed', date: 'Nov 05, 2025' },
  { id: 3, title: 'Pleadings & Discovery', status: 'current', date: 'Ongoing' },
  { id: 4, title: 'Evidence & Trial', status: 'pending', date: 'TBD' },
  { id: 5, title: 'Final Arguments', status: 'pending', date: 'TBD' },
  { id: 6, title: 'Judgment', status: 'pending', date: 'TBD' },
];

const INITIAL_ACTIVITIES = [
  { id: 1, text: 'Reply filed by Respondent No. 2', user: 'Aditi S.', time: '2 hours ago', type: 'doc', fullDate: 'June 29, 2026, 10:30 AM' },
  { id: 2, text: 'Next hearing date scheduled for 25th Aug', user: 'System', time: '1 day ago', type: 'system', fullDate: 'June 28, 2026, 09:15 AM' },
  { id: 3, text: 'Senior Counsel briefed on the evidence loop', user: 'Rahul V.', time: '3 days ago', type: 'note', fullDate: 'June 26, 2026, 04:45 PM' }
];

export const CaseJourneyTracker: React.FC = () => {
  const [stages, setStages] = useState(INITIAL_STAGES);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Reminder Form State
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSetReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderTitle || !reminderDate) return;
    
    setIsSubmitting(true);
    // Simulate API Call
    setTimeout(() => {
      setActivities(prev => [{
        id: Date.now(),
        text: `Reminder set: ${reminderTitle}`,
        user: 'You',
        time: 'Just now',
        type: 'note',
        fullDate: new Date().toLocaleString()
      }, ...prev]);
      
      setIsSubmitting(false);
      setIsReminderOpen(false);
      setReminderTitle('');
      setReminderDate('');
      showToast('Reminder successfully scheduled');
    }, 800);
  };

  const handleStageClick = (id: number) => {
    setStages(prev => prev.map(stage => {
      if (stage.id === id) {
        // Toggle logic: pending -> current -> completed -> pending
        let nextStatus = 'pending';
        let nextDate = 'TBD';
        if (stage.status === 'pending') {
          nextStatus = 'current';
          nextDate = 'Ongoing';
        } else if (stage.status === 'current') {
          nextStatus = 'completed';
          nextDate = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        }
        return { ...stage, status: nextStatus, date: nextDate };
      }
      return stage;
    }));
    showToast('Stage status updated');
  };

  const calculateProgress = () => {
    // Find the last completed or current stage index
    const lastActiveIndex = stages.map(s => s.status).lastIndexOf('completed');
    const currentIndex = stages.findIndex(s => s.status === 'current');
    
    let activeIndex = Math.max(lastActiveIndex, currentIndex);
    if (activeIndex === -1) return 0;
    
    // If it's current, put the bar halfway to the next node
    const progress = currentIndex > -1 
      ? (currentIndex + 0.5) / (stages.length - 1)
      : activeIndex / (stages.length - 1);
      
    return Math.max(0, Math.min(100, progress * 100));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden p-6 lg:p-8 bg-gradient-to-r from-slate-900 to-indigo-950 border border-slate-800 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-900/50 border border-indigo-700/50 text-[10px] font-bold text-indigo-300 uppercase tracking-widest">
              <Map size={12} />
              Module 4.4 — LexCourt
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Case Journey Tracker</h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
              <span className="bg-slate-800 px-2.5 py-1 rounded-md text-slate-200">Writ Petition (Civil) No. 4022/2025</span>
              <span>•</span>
              <span>High Court of Delhi</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">Active</span>
            </div>
          </div>
          <button 
            onClick={() => setIsReminderOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs tracking-wider transition-all shadow-lg self-start md:self-center"
          >
            <BellRing size={15} /> SET REMINDER
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col - Journey Map */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
                <Map size={16} className="text-indigo-500" /> Lifecycle Map
              </h3>
              <span className="text-xs text-slate-500 dark:text-zinc-400">Click a stage to update its status</span>
            </div>

            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-100 dark:bg-zinc-800">
                <motion.div 
                  className="absolute top-0 left-0 w-full bg-indigo-500 rounded-full" 
                  initial={{ height: 0 }}
                  animate={{ height: `${calculateProgress()}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>

              <div className="space-y-8">
                {stages.map((stage, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={stage.id} 
                    onClick={() => handleStageClick(stage.id)}
                    className="relative pl-12 flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer group"
                  >
                    {/* Node */}
                    <div className={`absolute left-[11px] top-1.5 w-[11px] h-[11px] rounded-full border-2 transition-colors duration-300 ${
                      stage.status === 'completed' ? 'bg-indigo-500 border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' :
                      stage.status === 'current' ? 'bg-white dark:bg-zinc-900 border-indigo-500 ring-4 ring-indigo-500/20' :
                      'bg-white dark:bg-zinc-900 border-slate-300 dark:border-zinc-700 group-hover:border-indigo-400'
                    }`} />
                    
                    <div className="group-hover:translate-x-1 transition-transform duration-200">
                      <h4 className={`text-sm font-bold ${stage.status === 'pending' ? 'text-slate-400 dark:text-zinc-500' : 'text-slate-800 dark:text-zinc-100'}`}>
                        {stage.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-zinc-500 mt-0.5 font-medium">{stage.date}</p>
                    </div>

                    {stage.status === 'current' && (
                      <motion.div 
                        layoutId="currentBadge"
                        className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/30 px-3 py-1.5 rounded-lg flex items-center gap-2"
                      >
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400">In Progress</span>
                      </motion.div>
                    )}
                    {stage.status === 'completed' && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <CheckCircle2 size={18} className="text-emerald-500 hidden sm:block" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col - Activity & Tasks */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col h-[calc(100%-120px)]">
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100 mb-4 flex items-center gap-2">
              <Clock size={16} className="text-indigo-500" /> Recent Activity
            </h3>
            <div className="space-y-4 flex-1 overflow-hidden relative">
              {/* Fade out mask for long lists */}
              <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white dark:from-zinc-900 to-transparent z-10 pointer-events-none" />
              
              <AnimatePresence>
                {activities.slice(0, 4).map((act, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={act.id} 
                    className="flex gap-3"
                  >
                    <div className={`mt-0.5 p-1.5 rounded-lg flex-shrink-0 ${
                      act.type === 'doc' ? 'bg-blue-50 text-blue-500 dark:bg-blue-900/20' :
                      act.type === 'note' ? 'bg-amber-50 text-amber-500 dark:bg-amber-900/20' :
                      'bg-slate-100 text-slate-500 dark:bg-zinc-800'
                    }`}>
                      {act.type === 'doc' ? <FileText size={14} /> : act.type === 'note' ? <MessageSquare size={14} /> : <User size={14} />}
                    </div>
                    <div>
                      <p className="text-xs text-slate-700 dark:text-zinc-300 leading-snug">{act.text}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-semibold text-slate-800 dark:text-zinc-400">{act.user}</span>
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500">• {act.time}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <button 
              onClick={() => setIsActivityOpen(true)}
              className="w-full mt-5 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors active:scale-95"
            >
              View All Activity
            </button>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100 mb-4">Upcoming Deadline</h3>
            <div className="p-4 rounded-xl border border-rose-100 dark:border-rose-900/30 bg-rose-50/50 dark:bg-rose-950/10 text-center relative overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-5 text-rose-500">
                <Calendar size={64} />
              </div>
              <div className="relative z-10">
                <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">12 Days</div>
                <div className="text-xs font-semibold text-rose-800/70 dark:text-rose-300 mt-1">Next Hearing: 25 Aug 2026</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Modals & Toasts */}
      <AnimatePresence>
        {isReminderOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-800 w-full max-w-md overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-zinc-800">
                <h3 className="font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
                  <BellRing size={18} className="text-indigo-500" />
                  Set Reminder
                </h3>
                <button onClick={() => setIsReminderOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSetReminder} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">Reminder Title</label>
                  <div className="relative">
                    <Type size={14} className="absolute left-3 top-3 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. File response to notice"
                      value={reminderTitle}
                      onChange={e => setReminderTitle(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-zinc-200 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">Date & Time</label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3 top-3 text-slate-400" />
                    <input 
                      type="datetime-local" 
                      required
                      value={reminderDate}
                      onChange={e => setReminderDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-zinc-200 transition-all"
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-70 flex justify-center items-center"
                  >
                    {isSubmitting ? (
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Save Reminder'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {isActivityOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-800 w-full max-w-2xl max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-zinc-800">
                <h3 className="font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
                  <Clock size={18} className="text-indigo-500" />
                  Full Activity History
                </h3>
                <button onClick={() => setIsActivityOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors bg-slate-100 dark:bg-zinc-800 p-1.5 rounded-full">
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto space-y-6">
                {activities.map((act, idx) => (
                  <div key={act.id} className="flex gap-4 relative">
                    {/* Line connecting activities */}
                    {idx !== activities.length - 1 && (
                      <div className="absolute left-[17px] top-10 bottom-[-24px] w-0.5 bg-slate-100 dark:bg-zinc-800" />
                    )}
                    <div className={`mt-0.5 p-2 rounded-xl flex-shrink-0 z-10 ${
                      act.type === 'doc' ? 'bg-blue-50 text-blue-500 dark:bg-blue-900/30' :
                      act.type === 'note' ? 'bg-amber-50 text-amber-500 dark:bg-amber-900/30' :
                      'bg-slate-100 text-slate-500 dark:bg-zinc-800'
                    }`}>
                      {act.type === 'doc' ? <FileText size={18} /> : act.type === 'note' ? <MessageSquare size={18} /> : <User size={18} />}
                    </div>
                    <div className="bg-slate-50 dark:bg-zinc-950/50 p-4 rounded-xl border border-slate-100 dark:border-zinc-800/50 flex-1">
                      <p className="text-sm font-medium text-slate-800 dark:text-zinc-200 mb-2">{act.text}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1"><User size={12}/> {act.user}</span>
                        <span className="text-xs text-slate-500 dark:text-zinc-500 flex items-center gap-1"><Calendar size={12}/> {act.fullDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Global Toast */}
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-4 py-3 bg-slate-900 dark:bg-zinc-100 text-white dark:text-slate-900 rounded-xl shadow-2xl font-medium text-sm"
          >
            <CheckCircle2 size={18} className={toast.type === 'success' ? 'text-emerald-400 dark:text-emerald-600' : 'text-rose-400 dark:text-rose-600'} />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
