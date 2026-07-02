import React, { useState } from 'react';
import { UserCheck, Search, Scale, AlertTriangle, ShieldCheck, CheckCircle2, Copy, FileText, BrainCircuit, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WitnessProfile {
  name: string;
  field: string;
  casesAppeared: number;
  qualified: number;
  disqualified: number; // Daubert/Frye challenges lost
  reliabilityScore: number;
  vulnerabilities: string[];
  recentCases: string[];
}

const MOCK_DB: Record<string, WitnessProfile> = {
  'dr. roberts': {
    name: 'Dr. Alan Roberts',
    field: 'Forensic Pathology',
    casesAppeared: 142,
    qualified: 138,
    disqualified: 4,
    reliabilityScore: 92,
    vulnerabilities: [
      'In a 2021 trial, admitted to relying on an outdated toxicology protocol (State v. Miller).',
      'Tends to become defensive during rapid-fire cross-examination.'
    ],
    recentCases: [
      'State v. Miller (2021) - Admitted as expert',
      'Doe v. General Hospital (2019) - Testimony partially excluded'
    ]
  },
  'default': {
    name: 'Prof. Sarah Jenkins',
    field: 'Financial Forensics & Valuation',
    casesAppeared: 45,
    qualified: 40,
    disqualified: 5,
    reliabilityScore: 78,
    vulnerabilities: [
      'Failed Daubert challenge in SEC v. Titan Corp (2023) for using a speculative DCF model.',
      'Frequently testifies exclusively for defense firms, establishing a potential bias.'
    ],
    recentCases: [
      'SEC v. Titan Corp (2023) - Excluded (Methodology)',
      'In re Startup Bankruptcy (2022) - Admitted'
    ]
  }
};

export const ExpertWitnessAnalyser: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [profile, setProfile] = useState<WitnessProfile | null>(null);
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setProfile(null);
    
    setTimeout(() => {
      const q = query.toLowerCase();
      if (q.includes('robert')) {
        setProfile(MOCK_DB['dr. roberts']);
      } else {
        setProfile(MOCK_DB['default']);
      }
      setIsSearching(false);
      showToast('Witness background generated');
    }, 1500);
  };

  const copyVulnerabilities = () => {
    if (!profile) return;
    navigator.clipboard.writeText(`Impeachment Strategy for ${profile.name}:\n\n` + profile.vulnerabilities.join('\n'));
    showToast('Impeachment vectors copied');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-sky-950 border border-slate-800 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-900/50 border border-sky-700/50 text-[10px] font-bold text-sky-300 uppercase tracking-widest">
              <UserCheck size={12} />
              Module 2.4 — LexResearch
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Expert Witness Analyser</h2>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Run deep background checks on opposing expert witnesses. Analyze their past Daubert/Frye challenges, known methodological flaws, and testimonial history.
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-zinc-800">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <div className="absolute left-4 text-slate-400">
            <Search size={24} />
          </div>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by expert name (e.g., 'Dr. Roberts' or 'Sarah Jenkins')"
            className="w-full pl-14 pr-32 py-4 bg-slate-50 dark:bg-zinc-950 border-none rounded-xl text-base text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600"
          />
          <button 
            type="submit"
            disabled={!query.trim() || isSearching}
            className="absolute right-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold rounded-lg transition-colors shadow flex items-center gap-2"
          >
            {isSearching ? <BrainCircuit size={18} className="animate-pulse" /> : <Search size={18} />}
            {isSearching ? 'Scanning...' : 'Analyze'}
          </button>
        </form>
      </div>

      {/* Results Area */}
      <AnimatePresence mode="wait">
        {isSearching ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 text-sky-600 dark:text-sky-400"
          >
            <Activity size={48} className="animate-pulse mb-4 opacity-50" />
            <p className="font-bold">Compiling Daubert challenge history...</p>
          </motion.div>
        ) : !profile ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 text-slate-400 text-center"
          >
            <UserCheck size={64} className="mb-4 opacity-20" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-zinc-300">Ready to Profile</h3>
            <p className="text-sm max-w-sm mt-2">Search for an expert witness to view their reliability score and impeachment vectors.</p>
          </motion.div>
        ) : (
          <motion.div 
            key="profile"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Left Col: Core Stats */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 dark:text-sky-400 flex-shrink-0">
                    <UserCheck size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-zinc-100">{profile.name}</h3>
                    <p className="text-sm font-semibold text-slate-500">{profile.field}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-100 dark:border-zinc-800/50 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase">Cases Testified</span>
                    <span className="font-extrabold text-slate-800 dark:text-zinc-200">{profile.casesAppeared}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 flex justify-between items-center">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase">Qualified</span>
                    <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{profile.qualified}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 flex justify-between items-center">
                    <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase flex items-center gap-1"><AlertTriangle size={12}/> Disqualified</span>
                    <span className="font-extrabold text-rose-700 dark:text-rose-400">{profile.disqualified}</span>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">AI Reliability Score</span>
                    <span className={`font-extrabold ${profile.reliabilityScore > 80 ? 'text-emerald-500' : 'text-amber-500'}`}>{profile.reliabilityScore}/100</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-2">
                    <div className={`h-2 rounded-full ${profile.reliabilityScore > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${profile.reliabilityScore}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Details */}
            <div className="md:col-span-2 space-y-6">
              {/* Impeachment Vectors */}
              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full max-h-[350px]">
                <div className="p-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/50 flex justify-between items-center">
                  <h3 className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                    <ShieldCheck size={16} /> Impeachment Vulnerabilities
                  </h3>
                  <button 
                    onClick={copyVulnerabilities}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-sky-600 transition-colors"
                  >
                    <Copy size={14} /> Copy Vectors
                  </button>
                </div>
                <div className="p-5 flex-1 overflow-y-auto space-y-3">
                  {profile.vulnerabilities.map((vuln, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 rounded-xl border border-rose-100 dark:border-rose-900/30 bg-rose-50/50 dark:bg-rose-950/10">
                      <AlertTriangle size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm font-medium text-slate-700 dark:text-zinc-300 leading-relaxed">{vuln}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="md:col-span-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2 mb-4">
                <Scale size={16} className="text-indigo-500" /> Recent Case Outcomes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.recentCases.map((rc, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/50 flex items-center gap-3">
                    <FileText size={16} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">{rc}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Global Toast */}
      <AnimatePresence>
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
