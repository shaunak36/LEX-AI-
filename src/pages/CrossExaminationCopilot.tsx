import React, { useState } from 'react';
import { Mic, FileText, CheckCircle2, MessageSquare, AlertCircle, Copy, Target, BrainCircuit, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Question {
  id: number;
  category: 'Contradiction' | 'Credibility' | 'Bias' | 'Factual Probe';
  question: string;
  rationale: string;
}

const MOCK_QUESTIONS: Question[] = [
  {
    id: 1,
    category: 'Contradiction',
    question: 'You stated in paragraph 4 that the meeting occurred at 10:00 AM, but the email evidence (Exhibit C) shows you sent the draft agreement at 9:15 AM from your office desktop. How do you explain this discrepancy?',
    rationale: 'Highlights a timeline contradiction between oral testimony and documentary evidence.'
  },
  {
    id: 2,
    category: 'Credibility',
    question: 'Is it not true that you failed to mention this "verbal assurance" during your initial police complaint on the day of the incident?',
    rationale: 'Establishes that material facts were introduced as an afterthought.'
  },
  {
    id: 3,
    category: 'Bias',
    question: 'You are currently employed by the Defendant\'s sister concern, correct? And a portion of your annual bonus depends on the financial performance of that entity?',
    rationale: 'Demonstrates financial interest and potential bias in favor of the opposing party.'
  },
  {
    id: 4,
    category: 'Factual Probe',
    question: 'You claim you saw the signature being forged from 20 feet away through a glass partition. What is your vision prescription?',
    rationale: 'Challenges the physical possibility of the witness\'s primary claim.'
  }
];

export const CrossExaminationCopilot: React.FC = () => {
  const [statement, setStatement] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAnalyze = () => {
    if (!statement.trim()) {
      showToast('Please paste a witness statement first', 'error');
      return;
    }
    
    setIsAnalyzing(true);
    setQuestions(null);
    
    // Simulate AI generation
    setTimeout(() => {
      setIsAnalyzing(false);
      setQuestions(MOCK_QUESTIONS);
      showToast('Cross-examination strategy generated');
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard');
  };

  const copyAll = () => {
    if (!questions) return;
    const compiled = questions.map((q, i) => `Q${i + 1}. [${q.category}] ${q.question}\n(Objective: ${q.rationale})`).join('\n\n');
    navigator.clipboard.writeText(compiled);
    showToast('All questions copied to clipboard');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10 flex flex-col h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-orange-950 border border-slate-800 shadow-xl flex-shrink-0">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-900/50 border border-orange-700/50 text-[10px] font-bold text-orange-300 uppercase tracking-widest">
              <Mic size={12} />
              Module 2.3 — LexResearch
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Cross-Examination Copilot</h2>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Paste a witness affidavit or statement. The AI will analyze psychological cues, logical fallacies, and contradictions to draft piercing cross-examination questions.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        {/* Left Column: Input */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
              <FileText size={16} className="text-orange-500" /> Witness Statement / Chief Affidavit
            </h3>
          </div>
          <div className="flex-1 p-4 relative">
            <textarea
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              placeholder="Paste the contents of the affidavit or deposition here..."
              className="w-full h-full p-4 bg-transparent resize-none focus:outline-none text-sm text-slate-700 dark:text-zinc-300 font-serif leading-relaxed"
            />
            {statement.length === 0 && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="text-center opacity-30">
                  <Users size={48} className="mx-auto mb-2" />
                  <p className="font-bold">Awaiting Testimony</p>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/50">
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || statement.length === 0}
              className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold transition-all shadow-md disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
            >
              {isAnalyzing ? <BrainCircuit size={18} className="animate-pulse" /> : <Target size={18} />}
              {isAnalyzing ? 'Drafting Strategy...' : 'Generate Interrogation Plan'}
            </button>
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
              <MessageSquare size={16} className="text-indigo-500" /> Recommended Questions
            </h3>
            {questions && (
              <button 
                onClick={copyAll}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
              >
                <Copy size={14} /> Copy All
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-slate-400"
                >
                  <BrainCircuit size={48} className="animate-pulse mb-4 opacity-50" />
                  <p className="font-bold">Analyzing logic gates in testimony...</p>
                </motion.div>
              ) : !questions ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-slate-400 text-center px-8"
                >
                  <Target size={48} className="mb-4 opacity-20" />
                  <p className="font-bold text-slate-600 dark:text-zinc-400 mb-2">No Questions Drafted Yet</p>
                  <p className="text-xs">Paste a statement on the left to uncover weak points, logical fallacies, and contradictions.</p>
                </motion.div>
              ) : (
                <motion.div key="results" className="space-y-4">
                  {questions.map((q, idx) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                      key={q.id}
                      className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm relative group"
                    >
                      <button 
                        onClick={() => copyToClipboard(q.question)}
                        className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-300 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all bg-slate-50 dark:bg-zinc-800"
                        title="Copy Question"
                      >
                        <Copy size={14} />
                      </button>
                      
                      <div className="mb-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          q.category === 'Contradiction' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                          q.category === 'Credibility' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                          q.category === 'Bias' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {q.category}
                        </span>
                      </div>
                      
                      <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200 leading-relaxed mb-4">
                        "{q.question}"
                      </h4>
                      
                      <div className="flex items-start gap-2 pt-3 border-t border-slate-100 dark:border-zinc-800/50">
                        <AlertCircle size={14} className="text-slate-400 mt-0.5" />
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Tactical Rationale</span>
                          <p className="text-xs text-slate-600 dark:text-zinc-400">{q.rationale}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
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
