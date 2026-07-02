import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Plus, Trash2, CheckCircle, FileText, User, Calendar, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';

export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected' | 'In Review' | 'Escalated';
export type Priority = 'Urgent' | 'High' | 'Normal' | 'Low';

export interface Approver {
  name: string;
  role: string;
  status: 'Waiting' | 'Approved' | 'Rejected' | 'Current';
  time?: string;
  comment?: string;
}

export interface ApprovalItem {
  id: string;
  title: string;
  documentType: string;
  clientName: string;
  submittedBy: string;
  submittedDate: string;
  dueDate: string;
  status: ApprovalStatus;
  priority: Priority;
  stage: number;
  totalStages: number;
  approvers: Approver[];
  summary: string;
  riskLevel: 'High' | 'Medium' | 'Low';
}

interface CreateApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (item: ApprovalItem) => void;
}

const MOCK_USERS = [
  { name: 'Parth Vibhute', role: 'Junior Associate' },
  { name: 'Mrudul Patil', role: 'Senior Associate' },
  { name: 'External Counsel', role: 'Infrastructure Expert' },
  { name: 'Managing Partner', role: 'Final Signatory' },
  { name: 'Priya Nair', role: 'Compliance Officer' }
];

const CreateApprovalModal: React.FC<CreateApprovalModalProps> = ({ isOpen, onClose, onCreate }) => {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1); // For animation direction

  const [formData, setFormData] = useState({
    title: '',
    clientName: '',
    documentType: 'Contract',
    priority: 'Normal' as Priority,
    riskLevel: 'Medium' as 'High' | 'Medium' | 'Low',
    dueDate: '',
    summary: '',
    approvers: [
      { name: '', role: '' }
    ]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const bg = isDark ? 'bg-[#161b2e]' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-gray-500';
  const border = isDark ? 'border-white/10' : 'border-gray-200';
  const inputBg = isDark ? 'bg-[#1e2436] border-white/10 text-white placeholder-slate-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400';

  const resetForm = () => {
    setFormData({
      title: '',
      clientName: '',
      documentType: 'Contract',
      priority: 'Normal',
      riskLevel: 'Medium',
      dueDate: '',
      summary: '',
      approvers: [{ name: '', role: '' }]
    });
    setErrors({});
    setCurrentStep(1);
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetForm, 300);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleApproverChange = (index: number, field: 'name' | 'role', value: string) => {
    const newApprovers = [...formData.approvers];
    newApprovers[index][field] = value;
    setFormData({ ...formData, approvers: newApprovers });
  };

  const addApprover = () => {
    setFormData({ ...formData, approvers: [...formData.approvers, { name: '', role: '' }] });
  };

  const removeApprover = (index: number) => {
    if (formData.approvers.length > 1) {
      const newApprovers = formData.approvers.filter((_, i) => i !== index);
      setFormData({ ...formData, approvers: newApprovers });
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = 'Document Name is required';
    if (!formData.clientName) newErrors.clientName = 'Client is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    formData.approvers.forEach((app, i) => {
      if (!app.name) newErrors[`approver_${i}_name`] = 'Required';
      if (!app.role) newErrors[`approver_${i}_role`] = 'Required';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    setDirection(1);
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (!validateStep2()) return; // just in case

    // Format date properly
    let formattedDate = formData.dueDate;
    try {
      const dateObj = new Date(formData.dueDate);
      if (!isNaN(dateObj.getTime())) {
        formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
    } catch (e) {}

    const mappedApprovers: Approver[] = formData.approvers.map((app, i) => ({
      name: app.name,
      role: app.role,
      status: i === 0 ? 'Current' : 'Waiting',
    }));

    const newItem: ApprovalItem = {
      id: `ap${Date.now()}`,
      title: formData.title,
      documentType: formData.documentType,
      clientName: formData.clientName,
      submittedBy: 'Current User',
      submittedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      dueDate: formattedDate,
      status: 'Pending',
      priority: formData.priority,
      stage: 1,
      totalStages: mappedApprovers.length,
      approvers: mappedApprovers,
      summary: formData.summary || 'No additional notes provided.',
      riskLevel: formData.riskLevel,
    };

    onCreate(newItem);
    handleClose();
  };

  const stepVariants = {
    hidden: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? 50 : -50,
      transition: { duration: 0.2 }
    }),
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2 }
    },
    exit: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? -50 : 50,
      transition: { duration: 0.2 }
    })
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col h-[600px] ${bg} border ${border}`}
          >
            {/* Header */}
            <div className={`px-6 py-4 border-b ${border} flex items-center justify-between z-10 ${bg}`}>
              <div>
                <h2 className={`text-lg font-semibold ${textPrimary}`}>Create Approval Workflow</h2>
                <div className="flex items-center gap-2 mt-1">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center gap-2">
                      <div className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                        currentStep === step 
                          ? 'bg-indigo-600 text-white' 
                          : currentStep > step 
                            ? 'bg-emerald-500 text-white' 
                            : isDark ? 'bg-white/10 text-slate-400' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {currentStep > step ? <CheckCircle size={10} /> : step}
                      </div>
                      {step < 3 && <div className={`w-8 h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />}
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={handleClose} className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                <X size={18} className={textMuted} />
              </button>
            </div>
            
            {/* Body */}
            <div className="flex-1 overflow-hidden relative">
              <AnimatePresence custom={direction} mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    custom={direction}
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute inset-0 overflow-y-auto p-6 space-y-5"
                  >
                    <div className="space-y-1.5">
                      <label className={`text-xs font-medium ${textMuted}`}>Document Name *</label>
                      <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Master Service Agreement"
                        className={`w-full text-sm px-3 py-2 rounded-lg border outline-none focus:ring-1 focus:ring-indigo-500/50 ${inputBg} ${errors.title ? 'border-red-500' : ''}`}
                      />
                      {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className={`text-xs font-medium ${textMuted}`}>Client *</label>
                        <input
                          name="clientName"
                          value={formData.clientName}
                          onChange={handleChange}
                          placeholder="e.g. Acme Corp"
                          className={`w-full text-sm px-3 py-2 rounded-lg border outline-none focus:ring-1 focus:ring-indigo-500/50 ${inputBg} ${errors.clientName ? 'border-red-500' : ''}`}
                        />
                        {errors.clientName && <p className="text-xs text-red-500">{errors.clientName}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <label className={`text-xs font-medium ${textMuted}`}>Document Type</label>
                        <select
                          name="documentType"
                          value={formData.documentType}
                          onChange={handleChange}
                          className={`w-full text-sm px-3 py-2 rounded-lg border outline-none focus:ring-1 focus:ring-indigo-500/50 ${inputBg}`}
                        >
                          <option value="Contract">Contract</option>
                          <option value="Settlement">Settlement Deed</option>
                          <option value="Compliance">Compliance Document</option>
                          <option value="Deed">Deed</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-5">
                      <div className="space-y-1.5">
                        <label className={`text-xs font-medium ${textMuted}`}>Risk Level</label>
                        <select
                          name="riskLevel"
                          value={formData.riskLevel}
                          onChange={handleChange}
                          className={`w-full text-sm px-3 py-2 rounded-lg border outline-none focus:ring-1 focus:ring-indigo-500/50 ${inputBg}`}
                        >
                          <option value="Low">Low Risk</option>
                          <option value="Medium">Medium Risk</option>
                          <option value="High">High Risk</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className={`text-xs font-medium ${textMuted}`}>Priority</label>
                        <select
                          name="priority"
                          value={formData.priority}
                          onChange={handleChange}
                          className={`w-full text-sm px-3 py-2 rounded-lg border outline-none focus:ring-1 focus:ring-indigo-500/50 ${inputBg}`}
                        >
                          <option value="Urgent">Urgent</option>
                          <option value="High">High</option>
                          <option value="Normal">Normal</option>
                          <option value="Low">Low</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className={`text-xs font-medium ${textMuted}`}>Due Date *</label>
                        <input
                          name="dueDate"
                          type="date"
                          value={formData.dueDate}
                          onChange={handleChange}
                          className={`w-full text-sm px-3 py-2 rounded-lg border outline-none focus:ring-1 focus:ring-indigo-500/50 ${inputBg} ${errors.dueDate ? 'border-red-500' : ''}`}
                        />
                        {errors.dueDate && <p className="text-xs text-red-500">{errors.dueDate}</p>}
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className={`text-xs font-medium ${textMuted}`}>Notes / Summary</label>
                      <textarea
                        name="summary"
                        value={formData.summary}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Provide executive summary or context..."
                        className={`w-full text-sm px-3 py-2 rounded-lg border outline-none resize-none focus:ring-1 focus:ring-indigo-500/50 ${inputBg}`}
                      />
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    custom={direction}
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute inset-0 overflow-y-auto p-6 space-y-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className={`text-sm ${textMuted}`}>Build the sequential pipeline of approvers for this document.</p>
                      <button
                        type="button"
                        onClick={addApprover}
                        className="flex items-center gap-1.5 text-xs font-medium text-indigo-500 hover:text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Plus size={14} /> Add Stage
                      </button>
                    </div>

                    <div className="space-y-4">
                      {formData.approvers.map((approver, index) => (
                        <div key={index} className={`p-4 rounded-xl border ${border} ${isDark ? 'bg-white/5' : 'bg-gray-50'} relative`}>
                          <div className={`absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ${index === 0 ? 'bg-indigo-600' : 'bg-slate-500'}`}>
                            {index + 1}
                          </div>
                          <div className="pl-4 grid grid-cols-[1fr,1fr,auto] gap-4 items-end">
                            <div className="space-y-1.5">
                              <label className={`text-xs font-medium ${textMuted}`}>Approver Name *</label>
                              <input
                                value={approver.name}
                                onChange={(e) => handleApproverChange(index, 'name', e.target.value)}
                                placeholder="e.g. Parth Vibhute"
                                list={`users-list-${index}`}
                                className={`w-full text-sm px-3 py-2 rounded-lg border outline-none focus:ring-1 focus:ring-indigo-500/50 ${inputBg} ${errors[`approver_${index}_name`] ? 'border-red-500' : ''}`}
                              />
                              <datalist id={`users-list-${index}`}>
                                {MOCK_USERS.map((u, i) => <option key={i} value={u.name} />)}
                              </datalist>
                            </div>
                            <div className="space-y-1.5">
                              <label className={`text-xs font-medium ${textMuted}`}>Role *</label>
                              <input
                                value={approver.role}
                                onChange={(e) => handleApproverChange(index, 'role', e.target.value)}
                                placeholder="e.g. Junior Associate"
                                list={`roles-list-${index}`}
                                className={`w-full text-sm px-3 py-2 rounded-lg border outline-none focus:ring-1 focus:ring-indigo-500/50 ${inputBg} ${errors[`approver_${index}_role`] ? 'border-red-500' : ''}`}
                              />
                              <datalist id={`roles-list-${index}`}>
                                {MOCK_USERS.map((u, i) => <option key={i} value={u.role} />)}
                              </datalist>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeApprover(index)}
                              disabled={formData.approvers.length === 1}
                              className={`p-2.5 rounded-lg border ${border} transition-colors ${formData.approvers.length === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30'} ${textMuted}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    custom={direction}
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute inset-0 overflow-y-auto p-6"
                  >
                    <div className="space-y-6">
                      <div className={`p-5 rounded-xl border ${border} ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                        <div className="flex items-start gap-4 mb-4">
                          <div className={`p-3 rounded-lg ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                            <FileText size={24} />
                          </div>
                          <div>
                            <h3 className={`text-lg font-semibold ${textPrimary}`}>{formData.title}</h3>
                            <div className={`flex flex-wrap items-center gap-3 mt-1 text-sm ${textMuted}`}>
                              <span className="flex items-center gap-1"><User size={14} /> {formData.clientName}</span>
                              <span className="flex items-center gap-1"><Calendar size={14} /> Due {formData.dueDate}</span>
                              <span className="flex items-center gap-1"><ShieldAlert size={14} /> {formData.riskLevel} Risk</span>
                            </div>
                          </div>
                        </div>
                        {formData.summary && (
                          <div className={`text-sm ${textMuted} pt-4 border-t ${border}`}>
                            <p className="font-medium mb-1">Summary</p>
                            <p className="leading-relaxed">{formData.summary}</p>
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className={`text-sm font-semibold mb-4 ${textPrimary}`}>Pipeline Configuration ({formData.approvers.length} Stages)</h4>
                        <div className="space-y-3">
                          {formData.approvers.map((app, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                                i === 0 ? 'bg-indigo-600 border-indigo-600 text-white' : `bg-transparent ${isDark ? 'border-slate-600 text-slate-400' : 'border-gray-300 text-gray-500'}`
                              }`}>
                                {i + 1}
                              </div>
                              <div className={`flex-1 p-3 rounded-lg border ${border} ${isDark ? 'bg-white/5' : 'bg-white'}`}>
                                <p className={`text-sm font-medium ${textPrimary}`}>{app.name}</p>
                                <p className={`text-xs ${textMuted}`}>{app.role}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Footer */}
            <div className={`px-6 py-4 border-t ${border} flex justify-between items-center z-10 ${bg}`}>
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-gray-100 text-gray-700'}`}
                >
                  <ChevronLeft size={16} /> Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleClose}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-gray-100 text-gray-700'}`}
                >
                  Cancel
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ml-auto"
                >
                  Next Step <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ml-auto"
                >
                  <CheckCircle size={16} /> Submit Workflow
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateApprovalModal;
