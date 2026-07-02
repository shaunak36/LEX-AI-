import React, { useState, useEffect } from 'react';
import { Lightbulb, UploadCloud, FileText, Scale, TrendingUp, AlertCircle, CalendarClock, CheckCircle2, FileSearch, Download, X, CheckSquare, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Ground {
  id: number;
  title: string;
  description: string;
  strength: 'Strong' | 'Moderate' | 'Weak';
  selected: boolean;
}

export const AppealGuidance: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Analysis State
  const [probability, setProbability] = useState(0);
  const [summary, setSummary] = useState('');
  const [orderDate, setOrderDate] = useState<string>('');
  const [deadlineDate, setDeadlineDate] = useState<string>('');
  const [grounds, setGrounds] = useState<Ground[]>([]);
  
  // Modal State
  const [isDraftOpen, setIsDraftOpen] = useState(false);
  const [draftContent, setDraftContent] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setShowResults(false);
    }
  };

  const analyzeDocument = (filename: string) => {
    const name = filename.toLowerCase();
    
    // Default fallback
    let prob = 65;
    let summ = "The order contains a mix of factual and legal findings. The legal findings on limitation appear vulnerable to appeal.";
    let generatedGrounds: Ground[] = [
      { id: 1, title: 'Error in interpreting Sec 14 of Limitation Act', description: 'The lower court failed to exclude the time spent bona fide in prosecuting the matter before the wrong forum, despite clear documentary evidence.', strength: 'Strong', selected: true },
      { id: 2, title: 'Re-appreciation of Evidence', description: 'Appellate courts rarely interfere with factual findings unless they are demonstrably perverse. Raising this requires crossing a high threshold.', strength: 'Weak', selected: false }
    ];

    if (name.includes('dismiss')) {
      prob = 82;
      summ = "The summary dismissal without affording an opportunity to file a rejoinder constitutes a serious procedural lapse, making this highly appealable.";
      generatedGrounds = [
        { id: 1, title: 'Violation of Principles of Natural Justice', description: 'The impugned order was passed at the threshold stage without issuing notice to the respondents, denying the appellant a fair hearing.', strength: 'Strong', selected: true },
        { id: 2, title: 'Non-consideration of material facts', description: 'The court below completely ignored Annexure P-4 which categorically establishes the debt.', strength: 'Strong', selected: true },
        { id: 3, title: 'Premature Dismissal', description: 'Dismissing the suit under Order VII Rule 11 based on disputed questions of fact is impermissible in law.', strength: 'Moderate', selected: true }
      ];
    } else if (name.includes('decree') || name.includes('judgement')) {
      prob = 45;
      summ = "The judgment is detailed and primarily based on factual appreciation of oral evidence. Reversing concurrent findings of fact will be challenging.";
      generatedGrounds = [
        { id: 1, title: 'Perverse finding on Issue No. 2', description: 'The trial court relied on inadmissible hearsay evidence of DW-2 to conclude that the agreement was forged.', strength: 'Moderate', selected: true },
        { id: 2, title: 'Misjoinder of Causes of Action', description: 'The suit ought to have been dismissed for misjoinder, a legal plea raised but not adjudicated upon.', strength: 'Moderate', selected: true },
        { id: 3, title: 'Interference with discretion', description: 'The quantum of damages awarded is highly disproportionate and arbitrary.', strength: 'Weak', selected: false }
      ];
    }

    setProbability(prob);
    setSummary(summ);
    setGrounds(generatedGrounds);

    // Set Default Dates
    const today = new Date();
    today.setDate(today.getDate() - 15); // Assume order was 15 days ago
    setOrderDate(today.toISOString().split('T')[0]);
  };

  // Recalculate deadline whenever orderDate changes
  useEffect(() => {
    if (orderDate) {
      const d = new Date(orderDate);
      d.setDate(d.getDate() + 90);
      setDeadlineDate(d.toISOString().split('T')[0]);
    }
  }, [orderDate]);

  const handleAnalyze = () => {
    if (!file) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      analyzeDocument(file.name);
      setIsAnalyzing(false);
      setShowResults(true);
      showToast('Order analyzed successfully');
    }, 2000);
  };

  const toggleGround = (id: number) => {
    setGrounds(prev => prev.map(g => g.id === id ? { ...g, selected: !g.selected } : g));
  };

  const openDraftMemo = () => {
    const selectedGrounds = grounds.filter(g => g.selected);
    if (selectedGrounds.length === 0) {
      showToast('Please select at least one ground to generate a draft', 'error');
      return;
    }

    const compiledDraft = `IN THE HON'BLE [APPELLATE COURT]\n\nAPPEAL NO. ____ OF 2026\n\nIN THE MATTER OF:\n[APPELLANT NAME] ...APPELLANT\n\nVERSUS\n\n[RESPONDENT NAME] ...RESPONDENT\n\nMEMORANDUM OF APPEAL\n\nMost Respectfully Showeth:\n\n1. That the present appeal is directed against the impugned order dated ${new Date(orderDate).toLocaleDateString()} passed by the Ld. [Lower Court] in [Case Number].\n\n2. GROUNDS OF APPEAL:\n\n${selectedGrounds.map((g, idx) => `GROUND ${String.fromCharCode(65 + idx)}: ${g.title}\nBecause the Ld. Court below erred in law and in fact. ${g.description}`).join('\n\n')}\n\n3. LIMITATION\nThat the impugned order was passed on ${new Date(orderDate).toLocaleDateString()}. The present appeal is being filed within the statutory period of 90 days, expiring on ${new Date(deadlineDate).toLocaleDateString()}.\n\n4. PRAYER\nIn view of the facts and circumstances stated above, it is most respectfully prayed that this Hon'ble Court may be pleased to:\na) Set aside the impugned order dated ${new Date(orderDate).toLocaleDateString()};\nb) Pass any other order as deemed fit in the interest of justice.\n\nPLACE: \nDATE: \n\nFILED BY:\nCOUNSEL FOR APPELLANT`;

    setDraftContent(compiledDraft);
    setIsDraftOpen(true);
  };

  const handleExportDoc = () => {
    if (!draftContent) return;
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Draft Appeal</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + draftContent.replace(/\n/g, '<br>') + footer;
    
    const blob = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Draft_Appeal_Memo.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast('Appeal Memo exported successfully');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 border border-slate-800 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/50 border border-blue-700/50 text-[10px] font-bold text-blue-300 uppercase tracking-widest">
              <Lightbulb size={12} />
              Module 4.3 — LexCourt
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Appeal Guidance AI</h2>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Upload a trial court order to analyze grounds of appeal, estimate success probability, and generate a draft appeal memo automatically.
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div 
            key="upload"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-10 flex flex-col items-center justify-center text-center shadow-sm min-h-[400px]"
          >
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500 rounded-full flex items-center justify-center mb-6">
              <UploadCloud size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-zinc-100 mb-2">Upload Impugned Order</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-md mb-8 leading-relaxed">
              Upload the PDF or DOCX file of the lower court judgment you wish to appeal against. Try uploading a file with "dismissal" or "decree" in the name for dynamic logic!
            </p>
            
            <input 
              type="file" 
              id="order-upload" 
              className="hidden" 
              accept=".pdf,.docx" 
              onChange={handleUpload} 
            />
            
            {file ? (
              <div className="space-y-6 flex flex-col items-center">
                <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800 rounded-xl">
                  <FileText size={24} className="text-indigo-500" />
                  <span className="text-sm font-bold text-slate-700 dark:text-zinc-200">{file.name}</span>
                  <button onClick={() => setFile(null)} className="ml-4 text-slate-400 hover:text-rose-500"><X size={16}/></button>
                </div>
                <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-70 active:scale-95"
                >
                  {isAnalyzing ? <FileSearch size={18} className="animate-pulse" /> : <Lightbulb size={18} />}
                  {isAnalyzing ? 'Extracting Legal Findings...' : 'Generate Guidance'}
                </button>
              </div>
            ) : (
              <label 
                htmlFor="order-upload"
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900 dark:bg-zinc-100 hover:bg-slate-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-bold transition-all shadow-md cursor-pointer active:scale-95"
              >
                Select File
              </label>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Quick Stats Panel */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
                    <TrendingUp size={16} className="text-indigo-500" /> Appeal Viability
                  </h3>
                  <button onClick={() => { setShowResults(false); setFile(null); }} className="text-[10px] font-bold text-slate-400 hover:text-indigo-500 uppercase tracking-wider">Start Over</button>
                </div>
                
                <div className="flex items-center justify-center relative mb-6">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="60" fill="none" className="stroke-slate-100 dark:stroke-zinc-800" strokeWidth="8" />
                    <motion.circle 
                      cx="64" cy="64" r="60" fill="none" className={probability > 70 ? "stroke-emerald-500" : probability > 40 ? "stroke-amber-500" : "stroke-rose-500"} 
                      strokeWidth="8" strokeDasharray="377" 
                      initial={{ strokeDashoffset: 377 }}
                      animate={{ strokeDashoffset: 377 - (377 * probability) / 100 }} 
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      strokeLinecap="round" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-extrabold ${probability > 70 ? 'text-emerald-600 dark:text-emerald-400' : probability > 40 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'}`}>{probability}%</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Probability</span>
                  </div>
                </div>
                
                <p className="text-xs text-slate-600 dark:text-zinc-400 text-center leading-relaxed font-medium">
                  {summary}
                </p>
              </div>

              <div className="bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-950/20 dark:to-orange-950/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-rose-800 dark:text-rose-400 mb-4 flex items-center gap-2">
                  <CalendarClock size={16} /> Limitation Period (90 Days)
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs text-rose-800 dark:text-rose-300">
                    <span className="font-semibold">Extracted Order Date:</span>
                    <input 
                      type="date" 
                      value={orderDate}
                      onChange={(e) => setOrderDate(e.target.value)}
                      className="bg-white dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded px-2 py-1 text-rose-900 dark:text-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors"
                    />
                  </div>
                  
                  <div className="pt-3 border-t border-rose-200/50 dark:border-rose-900/50 flex justify-between items-center bg-white/50 dark:bg-rose-950/30 p-2 rounded-lg">
                    <span className="text-xs font-bold text-rose-800 dark:text-rose-300">Filing Deadline:</span>
                    <span className="text-sm font-extrabold text-rose-600 dark:text-rose-400">{new Date(deadlineDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Content */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col h-[calc(100%-100px)]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
                    <Scale size={16} className="text-indigo-500" /> Extracted Grounds of Appeal
                  </h3>
                  <span className="text-xs text-slate-500">Select grounds to include in memo</span>
                </div>
                
                <div className="space-y-3 overflow-y-auto flex-1 pr-2">
                  {grounds.map(ground => (
                    <div 
                      key={ground.id}
                      onClick={() => toggleGround(ground.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        ground.selected 
                          ? ground.strength === 'Strong' ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/30 dark:bg-emerald-900/10' 
                            : ground.strength === 'Moderate' ? 'border-amber-300 dark:border-amber-700 bg-amber-50/30 dark:bg-amber-900/10'
                            : 'border-rose-300 dark:border-rose-700 bg-rose-50/30 dark:bg-rose-900/10'
                          : 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/30 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button className={`mt-0.5 text-slate-400 transition-colors ${ground.selected ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
                          {ground.selected ? <CheckSquare size={18} /> : <Square size={18} />}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1.5">
                            <h4 className={`text-sm font-bold ${ground.selected ? 'text-slate-800 dark:text-zinc-100' : 'text-slate-600 dark:text-zinc-400'}`}>{ground.title}</h4>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              ground.strength === 'Strong' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' :
                              ground.strength === 'Moderate' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' :
                              'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300'
                            }`}>
                              {ground.strength}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                            {ground.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-indigo-50 dark:bg-zinc-900 border border-indigo-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex items-center justify-between h-[80px]">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100 mb-1">Draft Appeal Memo</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">Generate a formatted draft containing your selected grounds.</p>
                </div>
                <button 
                  onClick={openDraftMemo}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold transition-all shadow"
                >
                  <FileText size={14} /> Open Draft
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Draft Modal */}
      <AnimatePresence>
        {isDraftOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-800 w-full max-w-4xl h-full flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg">
                    <Scale size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-zinc-100">Compiled Appeal Memo</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Draft Version 1.0</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleExportDoc}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors shadow"
                  >
                    <Download size={16} /> Export .doc
                  </button>
                  <button onClick={() => setIsDraftOpen(false)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-800 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors">
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-slate-100 dark:bg-zinc-950 p-4 sm:p-8 overflow-y-auto">
                <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 shadow-sm border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden min-h-full">
                  <textarea 
                    value={draftContent}
                    onChange={(e) => setDraftContent(e.target.value)}
                    className="w-full min-h-[800px] p-8 sm:p-12 text-sm font-serif leading-loose text-slate-800 dark:text-zinc-200 bg-transparent resize-none focus:outline-none"
                  />
                </div>
              </div>
            </motion.div>
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
