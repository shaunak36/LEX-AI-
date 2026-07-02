import React, { useState } from 'react';
import { ShieldCheck, UploadCloud, FileText, AlertTriangle, CheckCircle2, TrendingDown, FileSearch, Download, PieChart, ShieldAlert, FileWarning } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RiskFlag {
  id: number;
  category: string;
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  sourceFile: string;
  recommendation: string;
}

const MOCK_FLAGS: RiskFlag[] = [
  {
    id: 1,
    category: 'Corporate Compliance',
    severity: 'High',
    description: 'Failure to file Annual Returns (MGT-7) and Financial Statements (AOC-4) for the financial year 2024-2025.',
    sourceFile: 'MCA_MasterData_2025.pdf',
    recommendation: 'Immediate filing with MCA along with applicable late fees. Potential risk of directors facing disqualification under Sec 164(2).'
  },
  {
    id: 2,
    category: 'Commercial Contracts',
    severity: 'High',
    description: 'Change of Control clause triggered in Master Service Agreement with Vendor X without prior written consent.',
    sourceFile: 'Vendor_MSA_2023.pdf',
    recommendation: 'Obtain post-facto waiver or consent from Vendor X to prevent termination of the critical supply chain agreement.'
  },
  {
    id: 3,
    category: 'Employment',
    severity: 'Medium',
    description: 'Non-compete clauses in employee contracts exceed the legally permissible geographic and temporal scope under Indian law (Sec 27 Contract Act).',
    sourceFile: 'Standard_Employment_Agreement.docx',
    recommendation: 'Draft an addendum to revise the restrictive covenants to make them legally enforceable.'
  },
  {
    id: 4,
    category: 'Intellectual Property',
    severity: 'Low',
    description: 'Trademark registration for the primary brand logo is due for renewal in 4 months.',
    sourceFile: 'IP_Portfolio_Summary.xlsx',
    recommendation: 'Initiate renewal application (Form TM-R) to maintain statutory protection.'
  }
];

export const DueDiligenceAutomation: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setShowResults(false);
    }
  };

  const handleAnalyze = () => {
    if (files.length === 0) return;
    setIsAnalyzing(true);
    
    // Simulate deep scanning
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
      showToast('Due Diligence scan completed!');
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-emerald-950 border border-slate-800 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/50 border border-emerald-700/50 text-[10px] font-bold text-emerald-300 uppercase tracking-widest">
              <ShieldCheck size={12} />
              Module 2.2 — LexResearch
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Due Diligence Automation</h2>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Upload virtual data rooms (VDRs) or document batches. The AI instantly scans thousands of pages to extract critical red flags, compliance risks, and anomalies.
            </p>
          </div>
          {showResults && (
            <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wider transition-colors shadow-lg active:scale-95">
              <Download size={15} />
              EXPORT REPORT
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div 
            key="upload"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-10 flex flex-col items-center justify-center text-center shadow-sm min-h-[400px]"
          >
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 rounded-full flex items-center justify-center mb-6">
              <UploadCloud size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-zinc-100 mb-2">Upload Data Room Files</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-md mb-8 leading-relaxed">
              Upload multiple contracts, compliance certificates, and corporate records to initiate an automated M&A or general due diligence audit.
            </p>
            
            <input 
              type="file" 
              id="dd-upload" 
              className="hidden" 
              multiple
              accept=".pdf,.docx,.xlsx" 
              onChange={handleUpload} 
            />
            
            {files.length > 0 ? (
              <div className="space-y-6 flex flex-col items-center w-full max-w-md">
                <div className="w-full bg-slate-50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 max-h-40 overflow-y-auto space-y-2">
                  <div className="text-xs font-bold text-slate-500 uppercase mb-2 text-left">{files.length} Files Ready for Audit</div>
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-slate-700 dark:text-zinc-300">
                      <FileText size={14} className="text-emerald-500 flex-shrink-0" />
                      <span className="truncate">{f.name}</span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-70 active:scale-95 w-full justify-center"
                >
                  {isAnalyzing ? <FileSearch size={18} className="animate-pulse" /> : <ShieldCheck size={18} />}
                  {isAnalyzing ? 'Scanning Documents...' : 'Run Diligence Scan'}
                </button>
              </div>
            ) : (
              <label 
                htmlFor="dd-upload"
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900 dark:bg-zinc-100 hover:bg-slate-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-bold transition-all shadow-md cursor-pointer active:scale-95"
              >
                Select Files or Folder
              </label>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-3 text-slate-500 dark:text-zinc-400 mb-2">
                  <FileText size={16} /> <span className="text-xs font-bold uppercase">Files Scanned</span>
                </div>
                <div className="text-3xl font-extrabold text-slate-800 dark:text-zinc-100">{files.length > 0 ? files.length : 142}</div>
              </div>
              <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400 mb-2">
                  <ShieldAlert size={16} /> <span className="text-xs font-bold uppercase">High Risks</span>
                </div>
                <div className="text-3xl font-extrabold text-rose-700 dark:text-rose-400">2</div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 mb-2">
                  <FileWarning size={16} /> <span className="text-xs font-bold uppercase">Medium Risks</span>
                </div>
                <div className="text-3xl font-extrabold text-amber-700 dark:text-amber-400">1</div>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 mb-2">
                  <PieChart size={16} /> <span className="text-xs font-bold uppercase">Compliance Score</span>
                </div>
                <div className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400">78%</div>
              </div>
            </div>

            {/* Findings List */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-200 dark:border-zinc-800 flex justify-between items-center bg-slate-50 dark:bg-zinc-950/30">
                <h3 className="font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-amber-500" /> Executive Summary Findings
                </h3>
                <button onClick={() => { setShowResults(false); setFiles([]); }} className="text-xs font-bold text-slate-400 hover:text-emerald-600">Start New Scan</button>
              </div>
              
              <div className="divide-y divide-slate-100 dark:divide-zinc-800/50">
                {MOCK_FLAGS.map((flag, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                    key={flag.id} 
                    className="p-6 hover:bg-slate-50 dark:hover:bg-zinc-950/50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 ${
                          flag.severity === 'High' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                          flag.severity === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {flag.severity} Risk
                        </span>
                        <h4 className="font-bold text-sm text-slate-800 dark:text-zinc-200">{flag.category}</h4>
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
                          <FileText size={12} />
                          <span className="truncate max-w-[150px]">{flag.sourceFile}</span>
                        </div>
                      </div>
                      
                      <div className="md:w-3/4 space-y-3">
                        <div>
                          <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Issue Identified</h5>
                          <p className="text-sm text-slate-700 dark:text-zinc-300 font-medium leading-relaxed">{flag.description}</p>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-100 dark:border-zinc-800/50">
                          <h5 className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest mb-1">AI Recommendation</h5>
                          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">{flag.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
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
