import React, { useState } from 'react';
import { Search, Filter, BookOpen, AlertCircle, CheckCircle2, Copy, Download, Bookmark, Scale, BrainCircuit, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Precedent {
  id: string;
  title: string;
  citation: string;
  court: string;
  year: number;
  bench: string;
  status: 'Good Law' | 'Overruled' | 'Distinguished';
  ratio: string;
  relevanceScore: number;
}

const MOCK_DB: Record<string, Precedent[]> = {
  default: [
    {
      id: 'p1',
      title: 'Kesavananda Bharati v. State of Kerala',
      citation: 'AIR 1973 SC 1461',
      court: 'Supreme Court of India',
      year: 1973,
      bench: '13 Judges',
      status: 'Good Law',
      ratio: 'Parliament cannot alter the basic structure or framework of the Constitution under Article 368. The power to amend does not include the power to destroy.',
      relevanceScore: 98
    },
    {
      id: 'p2',
      title: 'Maneka Gandhi v. Union of India',
      citation: 'AIR 1978 SC 597',
      court: 'Supreme Court of India',
      year: 1978,
      bench: '7 Judges',
      status: 'Good Law',
      ratio: 'The procedure prescribed by law for depriving a person of life and personal liberty must be right, just, and fair and not arbitrary, fanciful, or oppressive.',
      relevanceScore: 94
    }
  ],
  arbitration: [
    {
      id: 'a1',
      title: 'Bharat Aluminium Co. v. Kaiser Aluminium Technical Services Inc.',
      citation: '(2012) 9 SCC 552',
      court: 'Supreme Court of India',
      year: 2012,
      bench: '5 Judges',
      status: 'Good Law',
      ratio: 'Part I of the Arbitration and Conciliation Act, 1996 applies only to arbitrations seated in India. It does not apply to foreign seated arbitrations.',
      relevanceScore: 99
    },
    {
      id: 'a2',
      title: 'Bhatia International v. Bulk Trading S.A.',
      citation: '(2002) 4 SCC 105',
      court: 'Supreme Court of India',
      year: 2002,
      bench: '3 Judges',
      status: 'Overruled',
      ratio: 'Part I of the Arbitration Act applies even to arbitrations seated outside India unless expressly or impliedly excluded.',
      relevanceScore: 85
    }
  ],
  fraud: [
    {
      id: 'f1',
      title: 'S.P. Chengalvaraya Naidu v. Jagannath',
      citation: 'AIR 1994 SC 853',
      court: 'Supreme Court of India',
      year: 1994,
      bench: '2 Judges',
      status: 'Good Law',
      ratio: 'Fraud avoids all judicial acts, ecclesiastical or temporal. A judgment or decree obtained by playing fraud on the court is a nullity and non est in the eyes of the law.',
      relevanceScore: 97
    }
  ]
};

export const AIPrecedentSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Precedent[] | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setResults(null);
    
    setTimeout(() => {
      const q = query.toLowerCase();
      let found: Precedent[] = [];
      
      if (q.includes('arbitration') || q.includes('balco')) {
        found = MOCK_DB.arbitration;
      } else if (q.includes('fraud') || q.includes('420')) {
        found = MOCK_DB.fraud;
      } else {
        found = MOCK_DB.default;
      }

      setResults(found);
      setIsSearching(false);
    }, 1500);
  };

  const copyCitation = (citation: string) => {
    navigator.clipboard.writeText(citation);
    showToast(`Copied citation: ${citation}`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 border border-slate-800 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/50 border border-purple-700/50 text-[10px] font-bold text-purple-300 uppercase tracking-widest">
              <Search size={12} />
              Module 2.1 — LexResearch
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">AI Precedent Search</h2>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Semantic legal search. Find relevant case laws by describing your legal problem instead of relying on exact keywords. The AI extracts the true Ratio Decidendi.
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar Area */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-zinc-800">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <div className="absolute left-4 text-slate-400">
            <Search size={24} />
          </div>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe your legal issue, e.g. 'Is an arbitration agreement binding on non-signatories?' or 'Fraud vitiates all solemn acts'"
            className="w-full pl-14 pr-[180px] py-4 bg-slate-50 dark:bg-zinc-950 border-none rounded-xl text-base text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600"
          />
          <button 
            type="submit"
            disabled={!query.trim() || isSearching}
            className="absolute right-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-lg transition-colors shadow flex items-center gap-2"
          >
            {isSearching ? <BrainCircuit size={18} className="animate-pulse" /> : <Search size={18} />}
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>
        
        {/* Filters */}
        <div className="flex items-center gap-3 mt-4 px-2 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mr-2">
            <Filter size={14} /> FILTERS
          </div>
          {['All', 'Supreme Court', 'High Courts', 'Last 5 Years', 'Constitutional Bench'].map(filter => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeFilter === filter ? 'bg-slate-800 text-white dark:bg-zinc-100 dark:text-slate-900 shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Results Area */}
      <div className="space-y-4 min-h-[400px]">
        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-indigo-600 dark:text-indigo-400"
            >
              <BrainCircuit size={48} className="animate-pulse mb-4 opacity-50" />
              <p className="font-bold">Analyzing judicial databases...</p>
              <p className="text-xs text-slate-500 mt-2">Extracting relevance and ratio decidendi</p>
            </motion.div>
          ) : results === null ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-zinc-600 text-center"
            >
              <Scale size={64} className="mb-4 opacity-20" />
              <h3 className="text-lg font-bold text-slate-700 dark:text-zinc-300">Ready to Research</h3>
              <p className="text-sm max-w-sm mt-2">Our semantic search understands context. Type a full sentence or legal proposition to find the most relevant precedents.</p>
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-sm font-bold text-slate-600 dark:text-zinc-400">Found {results.length} highly relevant precedents</span>
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500" /> Database updated today</span>
              </div>
              
              {results.map((caseLaw, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                  key={caseLaw.id}
                  className={`bg-white dark:bg-zinc-900 border rounded-2xl p-5 shadow-sm transition-all hover:shadow-md ${caseLaw.status === 'Overruled' ? 'border-rose-200 dark:border-rose-900/50 opacity-80' : 'border-slate-200 dark:border-zinc-800'}`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          caseLaw.status === 'Good Law' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                          caseLaw.status === 'Distinguished' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                          'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                        }`}>
                          {caseLaw.status}
                        </span>
                        <span className="text-[10px] font-bold bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                          {caseLaw.relevanceScore}% Match
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300">
                        {caseLaw.title}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-slate-500 dark:text-zinc-400">
                        <span className="flex items-center gap-1"><BookOpen size={12}/> {caseLaw.citation}</span>
                        <span className="flex items-center gap-1"><Scale size={12}/> {caseLaw.court}</span>
                        <span className="flex items-center gap-1">Bench: {caseLaw.bench}</span>
                        <span className="flex items-center gap-1">Year: {caseLaw.year}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => copyCitation(caseLaw.citation)}
                        className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors tooltip"
                        title="Copy Citation"
                      >
                        <Copy size={18} />
                      </button>
                      <button 
                        className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors tooltip"
                        title="Save to Library"
                      >
                        <Bookmark size={18} />
                      </button>
                      <button 
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 text-xs font-bold transition-colors"
                      >
                        Read Full <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-100 dark:border-zinc-800/50">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Ratio Decidendi / Key Holding</h4>
                    <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed font-serif">
                      "{caseLaw.ratio}"
                    </p>
                  </div>
                  
                  {caseLaw.status === 'Overruled' && (
                    <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 text-xs">
                      <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                      <p><strong>Warning:</strong> This judgment has been expressly overruled and is no longer good law. Proceed with caution.</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
