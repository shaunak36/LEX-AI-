import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, MapPin, FileText, CalendarDays, Calculator, 
  CheckCircle2, BellRing, Download, ChevronRight, X, Type, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Config Data
const COURT_TYPES = ['Supreme Court of India', 'High Court of Delhi', 'Bombay High Court', 'District Court', 'NCLT', 'Consumer Forum'];
const MATTER_TYPES = ['Civil Suit (Original)', 'Criminal Appeal', 'Writ Petition', 'Special Leave Petition', 'Company Petition'];

interface ChecklistItem {
  id: number;
  title: string;
  required: boolean;
  status: 'pending' | 'completed' | 'overdue';
  deadline: string | null;
}

interface FeeItem {
  label: string;
  amount: number;
}

interface CourtMatterData {
  fees: FeeItem[];
  checklist: ChecklistItem[];
}

// Logic Engine for Dynamic Generation
const generateFilingData = (court: string, matter: string): CourtMatterData => {
  const isSC = court === 'Supreme Court of India';
  const isHC = court.includes('High Court');
  const isNCLT = court === 'NCLT';
  
  let baseFee = 5000;
  let processFee = 1000;
  let welfareFund = 500;
  let vakalatnama = 200;

  if (isSC) {
    baseFee = 15000;
    processFee = 3000;
    welfareFund = 1000;
    vakalatnama = 500;
  } else if (isHC) {
    baseFee = 8000;
    processFee = 2000;
  } else if (isNCLT) {
    baseFee = 25000;
    processFee = 0;
  }

  const fees = [
    { label: 'Base Filing Fee', amount: baseFee },
    { label: 'Process / Service Fee', amount: processFee },
    { label: 'Advocate Welfare Fund', amount: welfareFund },
    { label: 'Vakalatnama / Stamp', amount: vakalatnama },
  ];

  // Dynamic Checklist based on Matter
  const checklist: ChecklistItem[] = [];
  let idCounter = 1;

  const add = (title: string, required: boolean, daysOffset: number | null) => {
    let deadline = null;
    let status: 'pending' | 'completed' | 'overdue' = 'pending';
    
    if (daysOffset !== null) {
      const d = new Date();
      d.setDate(d.getDate() + daysOffset);
      deadline = d.toISOString().split('T')[0];
      if (daysOffset < 0) status = 'overdue';
    }
    
    checklist.push({ id: idCounter++, title, required, status, deadline });
  };

  add('Vakalatnama', true, -2); // Might be overdue initially to show state
  add('Memo of Parties', true, 2);
  add('Affidavit in Support', true, 3);
  add('List of Dates & Events', true, 5);

  if (matter.includes('Appeal') || matter === 'Special Leave Petition') {
    add('Impugned Order Certified Copy', true, 10);
    add('Application for Condonation of Delay', false, null);
  }

  if (matter === 'Writ Petition') {
    add('Urgency Application', false, null);
    add('Annexures / Evidence', true, 14);
  }

  if (isNCLT || matter === 'Company Petition') {
    add('Board Resolution', true, 7);
    add('Master Data of Company', true, null);
  }

  if (isSC) {
    add('Certificate of Fitness (if applicable)', false, null);
  }

  return { fees, checklist };
};


export const CourtFilingChecklist: React.FC = () => {
  const [court, setCourt] = useState(COURT_TYPES[1]);
  const [matter, setMatter] = useState(MATTER_TYPES[2]);
  
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [feeBreakdown, setFeeBreakdown] = useState<FeeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [reminderItemTitle, setReminderItemTitle] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [isSubmittingReminder, setIsSubmittingReminder] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Initialize and React to Changes
  useEffect(() => {
    setIsLoading(true);
    // Simulate slight API/generation delay
    const timer = setTimeout(() => {
      const data = generateFilingData(court, matter);
      setChecklist(data.checklist);
      setFeeBreakdown(data.fees);
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [court, matter]);

  const totalFee = feeBreakdown.reduce((acc, curr) => acc + curr.amount, 0);
  const completedCount = checklist.filter(c => c.status === 'completed').length;
  const progress = checklist.length === 0 ? 0 : Math.round((completedCount / checklist.length) * 100);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleStatus = (id: number) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'completed' ? 'pending' : 'completed';
        return { ...item, status: nextStatus };
      }
      return item;
    }));
    // We don't show toast for every checkbox tick to avoid spam, but the UI updates instantly.
  };

  const openReminderModal = (itemTitle: string, currentDeadline: string | null) => {
    setReminderItemTitle(itemTitle);
    setReminderDate(currentDeadline ? `${currentDeadline}T09:00` : '');
    setIsReminderOpen(true);
  };

  const handleSetReminder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReminder(true);
    setTimeout(() => {
      setIsSubmittingReminder(false);
      setIsReminderOpen(false);
      showToast(`Reminder set for: ${reminderItemTitle}`);
    }, 800);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(79, 70, 229); // Indigo 600
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('Court Filing Checklist', 15, 20);
    doc.setFontSize(10);
    doc.text('Generated by LexAI Legal Intelligence', 15, 30);

    // Matter Info
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(12);
    doc.text(`Target Court: ${court}`, 15, 50);
    doc.text(`Matter Type: ${matter}`, 15, 58);
    doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, 15, 66);
    doc.text(`Estimated Fee: Rs. ${totalFee.toLocaleString()}`, 120, 50);

    // Checklist Table
    const tableData = checklist.map(item => [
      item.title,
      item.required ? 'Yes' : 'No',
      item.deadline || 'N/A',
      item.status.toUpperCase()
    ]);

    autoTable(doc, {
      startY: 75,
      head: [['Document / Task', 'Required', 'Deadline', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 10 }
    });

    // Save
    doc.save(`Filing_Checklist_${matter.replace(/\s+/g, '_')}.pdf`);
    showToast('PDF Exported Successfully');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border border-slate-800 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-900/50 border border-indigo-700/50 text-[10px] font-bold text-indigo-300 uppercase tracking-widest">
              <CheckSquare size={12} />
              Module 4.1 — LexCourt
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Court Filing Checklist</h2>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Auto-generate court-specific filing checklists, calculate deadlines, estimate court fees, and track document completeness for your litigation matters.
            </p>
          </div>
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs tracking-wider transition-colors shadow-lg active:scale-95"
          >
            <Download size={15} />
            EXPORT PDF
          </button>
        </div>
      </div>

      {/* Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100 mb-4 flex items-center gap-2">
            <MapPin size={16} className="text-indigo-500" /> Matter Configuration
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400">Target Court</label>
              <select value={court} onChange={(e) => setCourt(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-sm text-slate-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-colors">
                {COURT_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400">Matter Type</label>
              <select value={matter} onChange={(e) => setMatter(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-sm text-slate-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-colors">
                {MATTER_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
        </div>
        
        {/* Fee Calculator Widget */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden shadow-sm">
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <div>
            <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-1 flex items-center gap-2">
              <Calculator size={16} /> Estimated Court Fee
            </h3>
            <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70">Based on court rules & claim value</p>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-400">
              ₹{totalFee.toLocaleString()}
            </div>
            <button 
              onClick={() => setIsFeeModalOpen(true)}
              className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mt-2 hover:underline flex items-center gap-1 active:opacity-70 transition-opacity"
            >
              View Breakdown <ChevronRight size={10} />
            </button>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm relative min-h-[300px]">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
            <div className="h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
              <FileText size={20} className="text-indigo-500" /> Generated Checklist
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Checklist generated for {matter} in {court}.</p>
          </div>
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-zinc-950 px-4 py-2 rounded-xl border border-slate-100 dark:border-zinc-800">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-700 dark:text-zinc-300">Completeness</div>
              <div className="text-xs text-slate-500 dark:text-zinc-500">{progress}% Ready</div>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-zinc-800 flex items-center justify-center relative">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <motion.circle 
                  cx="20" cy="20" r="20" fill="none" className="stroke-indigo-500" 
                  strokeWidth="4" 
                  strokeDasharray="125"
                  initial={{ strokeDashoffset: 125 }}
                  animate={{ strokeDashoffset: 125 - ((progress / 100) * 125) }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  strokeLinecap="round" 
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {checklist.map((item) => (
              <motion.div 
                layout 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={item.id} 
                className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                  item.status === 'completed' 
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30' 
                    : item.status === 'overdue'
                      ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30'
                      : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => toggleStatus(item.id)}
                    className={`w-6 h-6 rounded flex items-center justify-center transition-colors flex-shrink-0 ${
                      item.status === 'completed' ? 'bg-emerald-500 text-white' : 'border-2 border-slate-300 dark:border-zinc-600 text-transparent hover:border-indigo-500'
                    }`}
                  >
                    <CheckCircle2 size={16} className={item.status === 'completed' ? 'block' : 'hidden'} />
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold text-sm transition-all ${item.status === 'completed' ? 'text-emerald-700 dark:text-emerald-400 line-through opacity-70' : 'text-slate-800 dark:text-zinc-100'}`}>
                        {item.title}
                      </span>
                      {item.required && <span className="text-[9px] font-bold bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 px-1.5 py-0.5 rounded uppercase">Required</span>}
                    </div>
                    {item.deadline && (
                      <div className={`text-xs flex items-center gap-1 mt-1 ${item.status === 'overdue' ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-slate-500 dark:text-zinc-500'}`}>
                        <CalendarDays size={12} /> Deadline: {new Date(item.deadline).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => openReminderModal(item.title, item.deadline)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors" 
                    title="Set Reminder"
                  >
                    <BellRing size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Modals & Toasts */}
      <AnimatePresence>
        {isFeeModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-800 w-full max-w-sm overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-zinc-800">
                <h3 className="font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
                  <Calculator size={18} className="text-indigo-500" />
                  Fee Breakdown
                </h3>
                <button onClick={() => setIsFeeModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-3">
                  {feeBreakdown.map((fee, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-zinc-400">{fee.label}</span>
                      <span className="font-semibold text-slate-800 dark:text-zinc-200">₹{fee.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-zinc-100">Total Estimated Fee</span>
                  <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">₹{totalFee.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

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
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">Item</label>
                  <div className="relative">
                    <Type size={14} className="absolute left-3 top-3 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      value={reminderItemTitle}
                      onChange={e => setReminderItemTitle(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-zinc-200 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">Notify On</label>
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
                    disabled={isSubmittingReminder}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-70 flex justify-center items-center"
                  >
                    {isSubmittingReminder ? (
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
