import React, { useState, useEffect } from 'react';
import { Gavel, Sparkles, Scale, AlertTriangle, FileText, CheckCircle2, BrainCircuit, Library, Download, Copy, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Argument {
  id: number;
  title: string;
  content: string;
  strength: number;
  precedents: string[];
  counterArgument: string;
  type: string;
}

const generateMockArguments = (facts: string, sections: string): Argument[] => {
  const text = (facts + " " + sections).toLowerCase();
  const args: Argument[] = [];
  let id = 1;

  if (text.includes('fraud') || text.includes('420') || text.includes('cheat')) {
    args.push({
      id: id++,
      title: 'Absence of Mens Rea from Inception',
      content: 'The prosecution has failed to establish dishonest intention from the inception of the transaction, which is a sine qua non for an offense under Sec 420 IPC.',
      strength: 88,
      precedents: ['Hridaya Ranjan Prasad Verma v. State of Bihar (2000)', 'Prof. R.K. Vijayasarathy v. Sudha Seetharam (2019)'],
      counterArgument: 'The conduct of the accused post-transaction indicates a calculated move to deceive.',
      type: 'Primary'
    });
    args.push({
      id: id++,
      title: 'Purely Civil Dispute',
      content: 'The dispute is purely civil in nature arising out of a commercial contract. Criminal proceedings cannot be used as an instrument for recovery of dues.',
      strength: 92,
      precedents: ['Indian Oil Corp. v. NEPC India Ltd. (2006)'],
      counterArgument: 'The civil remedy does not bar criminal proceedings if the ingredients of cheating are independently satisfied.',
      type: 'Primary'
    });
  }
  
  if (text.includes('murder') || text.includes('302') || text.includes('kill')) {
    args.push({
      id: id++,
      title: 'Lack of Chain of Circumstances',
      content: 'In a case based on circumstantial evidence, the chain of circumstances must be so complete as to leave no reasonable ground for a conclusion consistent with the innocence of the accused.',
      strength: 85,
      precedents: ['Sharad Birdhichand Sarda v. State of Maharashtra (1984)'],
      counterArgument: 'The last seen theory combined with motive forms a complete chain.',
      type: 'Primary'
    });
    args.push({
      id: id++,
      title: 'Exception 4 to Section 300 IPC',
      content: 'The incident occurred during a sudden fight in the heat of passion upon a sudden quarrel without premeditation.',
      strength: 78,
      precedents: ['Surinder Kumar v. UT, Chandigarh (1989)'],
      counterArgument: 'The accused acted in a cruel and unusual manner by using a deadly weapon.',
      type: 'Alternative'
    });
  }

  if (text.includes('contract') || text.includes('breach') || text.includes('agreement')) {
    args.push({
      id: id++,
      title: 'Frustration of Contract (Force Majeure)',
      content: 'The contract became impossible to perform due to unforeseen circumstances beyond the control of the parties, attracting Section 56 of the Indian Contract Act.',
      strength: 82,
      precedents: ['Satyabrata Ghose v. Mugneeram Bangur & Co. (1954)'],
      counterArgument: 'Commercial hardship or unprofitability does not amount to frustration.',
      type: 'Primary'
    });
  }

  // Fallback if no keywords matched
  if (args.length === 0) {
    args.push({
      id: id++,
      title: 'Violation of Principles of Natural Justice',
      content: 'The impugned action was taken without affording a reasonable opportunity of being heard (Audi Alteram Partem), rendering it null and void.',
      strength: 90,
      precedents: ['Maneka Gandhi v. Union of India (1978)', 'A.K. Kraipak v. Union of India (1969)'],
      counterArgument: 'Statutory exclusion of natural justice is permissible in cases of extreme urgency.',
      type: 'Primary'
    });
    args.push({
      id: id++,
      title: 'Arbitrariness under Article 14',
      content: 'The decision is manifestly arbitrary, discriminatory, and fails the test of reasonable classification.',
      strength: 85,
      precedents: ['E.P. Royappa v. State of Tamil Nadu (1974)'],
      counterArgument: 'The classification is based on intelligible differentia with a rational nexus to the object sought to be achieved.',
      type: 'Primary'
    });
  }

  return args;
};

export const ArgumentBuilder: React.FC = () => {
  const [facts, setFacts] = useState('');
  const [sections, setSections] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [argumentsList, setArgumentsList] = useState<Argument[]>([]);
  const [activeTab, setActiveTab] = useState<'build' | 'draft'>('build');
  
  const [draftContent, setDraftContent] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleGenerate = () => {
    if (!facts) return;
    setIsGenerating(true);
    
    setTimeout(() => {
      const generated = generateMockArguments(facts, sections);
      setArgumentsList(generated);
      setIsGenerating(false);
      showToast('Arguments successfully generated!');
      
      // Auto-compile draft
      const compiledDraft = `IN THE HON'BLE COURT OF [JURISDICTION]\n\nIN THE MATTER OF:\n[PETITIONER NAME]\nVERSUS\n[RESPONDENT NAME]\n\nWRITTEN SUBMISSIONS ON BEHALF OF [PARTY]\n\nI. BRIEF FACTS OF THE CASE\n${facts}\n\nII. APPLICABLE STATUTES\n${sections || 'As applicable by law.'}\n\nIII. ARGUMENTS ADVANCED\n\n${generated.map((arg, index) => `${index + 1}. ${arg.title.toUpperCase()}\n${arg.content}\n\nReliance is placed upon: ${arg.precedents.join(', ')}.\n\nWhile the opposing counsel may argue that "${arg.counterArgument}", it is respectfully submitted that such a contention is untenable in law.`).join('\n\n')}\n\nIV. PRAYER\nIn light of the above submissions, it is most respectfully prayed that this Hon'ble Court may be pleased to grant relief in favor of the applicant/petitioner.\n\nPLACE: \nDATE: \n\nFILED BY:\nCOUNSEL FOR [PARTY]`;
      
      setDraftContent(compiledDraft);
    }, 1800);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard');
  };

  const handleExportDoc = () => {
    if (!draftContent) return;
    
    // Create HTML blob for .doc format
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
    const footer = "</body></html>";
    // Convert newlines to HTML breaks
    const sourceHTML = header + draftContent.replace(/\n/g, '<br>') + footer;
    
    const blob = new Blob(['\ufeff', sourceHTML], {
        type: 'application/msword'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Written_Submissions_Draft.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast('Document exported successfully');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col relative pb-6">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden p-6 bg-gradient-to-r from-slate-900 to-indigo-950 border border-slate-800 shadow-xl flex-shrink-0 transition-all">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-900/50 border border-indigo-700/50 text-[10px] font-bold text-indigo-300 uppercase tracking-widest">
              <Gavel size={12} />
              Module 4.2 — LexCourt
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Argument Builder</h2>
            <p className="text-xs text-slate-400">Input case facts to generate legal arguments with precedent support and counter-arguments.</p>
          </div>
          <div className="flex gap-2 p-1 bg-slate-950/50 rounded-xl border border-slate-800">
            <button 
              onClick={() => setActiveTab('build')} 
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'build' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Builder
            </button>
            <button 
              onClick={() => setActiveTab('draft')} 
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'draft' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Synopsis Draft
              {argumentsList.length > 0 && <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'build' ? (
          <motion.div 
            key="build"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 flex flex-col md:flex-row gap-6 min-h-0"
          >
            {/* Left Pane - Input */}
            <div className="w-full md:w-1/3 flex flex-col gap-4 min-h-0">
              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 flex flex-col flex-1 shadow-sm overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
                    <FileText size={16} className="text-indigo-500" /> Case Facts & Context
                  </h3>
                  {facts && (
                    <button onClick={() => { setFacts(''); setSections(''); setArgumentsList([]); }} className="text-xs text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1">
                      <RefreshCw size={12} /> Clear
                    </button>
                  )}
                </div>
                
                <div className="space-y-4 flex-1 flex flex-col">
                  <div className="space-y-1.5 flex-1 flex flex-col">
                    <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400">Brief Facts (Chronological)</label>
                    <textarea 
                      value={facts} 
                      onChange={e => setFacts(e.target.value)}
                      placeholder="Enter the material facts of the case here. Tip: Use keywords like 'fraud', 'murder', 'breach of contract' to see dynamic logic..."
                      className="w-full flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800 text-sm text-slate-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400">Applicable Statutes / Sections</label>
                    <input 
                      value={sections} 
                      onChange={e => setSections(e.target.value)}
                      placeholder="e.g. Sec 420 IPC, Sec 138 NI Act"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800 text-sm text-slate-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleGenerate}
                  disabled={!facts || isGenerating}
                  className="mt-6 w-full flex justify-center items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 text-white text-sm font-bold transition-all shadow-lg relative overflow-hidden"
                >
                  {isGenerating ? (
                    <>
                      <BrainCircuit size={18} className="animate-pulse" />
                      Analyzing Precedents...
                      <motion.div 
                        className="absolute inset-0 bg-white/20"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      />
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Generate Arguments
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Pane - Results */}
            <div className="w-full md:w-2/3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm overflow-y-auto flex flex-col relative">
              {isGenerating && (
                <div className="absolute inset-0 z-10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm flex flex-col items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="font-bold text-sm">Synthesizing case law...</p>
                </div>
              )}
              
              <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2"><Scale size={16} className="text-indigo-500" /> AI Generated Arguments</span>
                {argumentsList.length > 0 && <span className="text-xs font-bold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-lg">{argumentsList.length} Arguments Found</span>}
              </h3>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                <AnimatePresence>
                  {argumentsList.length === 0 && !isGenerating ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-zinc-500 space-y-3">
                      <Scale size={48} className="opacity-20 mb-2" />
                      <p className="text-base font-bold text-slate-600 dark:text-zinc-400">Ready to build your arguments.</p>
                      <p className="text-sm text-center max-w-sm leading-relaxed">Input your case facts on the left and let the AI draft compelling arguments backed by precedent.</p>
                    </motion.div>
                  ) : (
                    argumentsList.map((arg, idx) => (
                      <motion.div 
                        key={arg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.15 }}
                        className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-slate-50 dark:bg-zinc-950/30 group"
                      >
                        <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex justify-between items-start bg-white dark:bg-zinc-900">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">{arg.type} Argument</span>
                              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                                Strength: {arg.strength}%
                              </span>
                            </div>
                            <h4 className="font-bold text-sm text-slate-800 dark:text-zinc-100">{arg.title}</h4>
                          </div>
                          <button 
                            onClick={() => copyToClipboard(`${arg.title}\n\n${arg.content}\n\nPrecedents: ${arg.precedents.join(', ')}`)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Copy Argument"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                        <div className="p-4 space-y-4">
                          <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed font-medium">{arg.content}</p>
                          
                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                            <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
                              <h5 className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase mb-2 flex items-center gap-1.5"><Library size={14}/> Supported By</h5>
                              <ul className="space-y-1.5">
                                {arg.precedents.map((p, i) => (
                                  <li key={i} className="text-xs text-slate-600 dark:text-zinc-400 font-semibold flex gap-1">
                                    <span className="text-blue-400">•</span> {p}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
                              <h5 className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase mb-2 flex items-center gap-1.5"><AlertTriangle size={14}/> Anticipated Counter</h5>
                              <p className="text-xs font-semibold text-slate-600 dark:text-zinc-400 leading-relaxed">{arg.counterArgument}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="draft"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col min-h-0"
          >
            {argumentsList.length === 0 ? (
              <div className="flex-1 flex flex-col justify-center items-center text-center">
                <FileText size={48} className="text-indigo-200 dark:text-indigo-900/50 mb-4" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 mb-2">Written Submissions Draft</h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-md mb-6 leading-relaxed">
                  Generate arguments first to automatically compile them into an editable court-ready written submission document.
                </p>
                <button 
                  onClick={() => setActiveTab('build')}
                  className="px-6 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                >
                  Go to Builder
                </button>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
                    <FileText size={18} className="text-indigo-500" /> Compiled Synopsis Draft
                  </h3>
                  <button 
                    onClick={handleExportDoc}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-bold transition-all shadow"
                  >
                    <Download size={16} /> Export .doc
                  </button>
                </div>
                
                <div className="flex-1 bg-slate-50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800 rounded-xl p-1 overflow-hidden flex flex-col">
                  {/* Pseudo Editor Toolbar */}
                  <div className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 p-2 flex gap-2 rounded-t-lg">
                    <div className="h-6 w-6 rounded bg-slate-100 dark:bg-zinc-800" />
                    <div className="h-6 w-6 rounded bg-slate-100 dark:bg-zinc-800" />
                    <div className="h-6 w-6 rounded bg-slate-100 dark:bg-zinc-800" />
                    <div className="w-px h-6 bg-slate-200 dark:bg-zinc-700 mx-1" />
                    <div className="h-6 w-20 rounded bg-slate-100 dark:bg-zinc-800" />
                  </div>
                  
                  {/* Editable Area */}
                  <textarea 
                    value={draftContent}
                    onChange={(e) => setDraftContent(e.target.value)}
                    className="w-full flex-1 p-6 text-sm font-serif leading-loose text-slate-800 dark:text-zinc-200 bg-transparent resize-none focus:outline-none focus:ring-inset focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>
            )}
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
