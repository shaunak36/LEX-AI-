import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  type: 'Individual' | 'Corporate' | 'Government';
  status: 'Active' | 'Inactive' | 'Pending';
  matters: number;
  lastActivity: string;
  priority: 'High' | 'Normal' | 'Low';
  totalDocuments: number;
  initials: string;
  color: string;
}

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (client: Client) => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose, onAdd }) => {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    type: 'Corporate' as Client['type'],
    status: 'Active' as Client['status'],
    address: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const bg = isDark ? 'bg-[#161b2e]' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-gray-500';
  const border = isDark ? 'border-white/10' : 'border-gray-200';
  const inputBg = isDark ? 'bg-[#1e2436] border-white/10 text-white placeholder-slate-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.company && formData.type === 'Corporate') newErrors.company = 'Company is required for corporate clients';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Generate initials and color
    const initials = formData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'NA';
    const colors = ['#6366f1', '#8b5cf6', '#0ea5e9', '#f59e0b', '#10b981', '#ec4899'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const newClient: Client = {
      id: `c${Date.now()}`,
      name: formData.name,
      company: formData.company || 'N/A',
      email: formData.email,
      phone: formData.phone || 'N/A',
      type: formData.type,
      status: formData.status,
      matters: 0,
      lastActivity: 'Just now',
      priority: 'Normal',
      totalDocuments: 0,
      initials,
      color,
    };

    onAdd(newClient);
    setFormData({ name: '', company: '', email: '', phone: '', type: 'Corporate', status: 'Active', address: '', notes: '' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] ${bg} border ${border}`}
          >
            <div className={`px-6 py-4 border-b ${border} flex items-center justify-between`}>
              <h2 className={`text-lg font-semibold ${textPrimary}`}>Add New Client</h2>
              <button onClick={onClose} className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                <X size={18} className={textMuted} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className={`text-xs font-medium ${textMuted}`}>Client Name *</label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Jane Doe"
                      className={`w-full text-sm px-3 py-2 rounded-lg border outline-none focus:ring-1 focus:ring-indigo-500/50 ${inputBg} ${errors.name ? 'border-red-500' : ''}`}
                    />
                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-xs font-medium ${textMuted}`}>Company</label>
                    <input
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="e.g. Acme Corp"
                      className={`w-full text-sm px-3 py-2 rounded-lg border outline-none focus:ring-1 focus:ring-indigo-500/50 ${inputBg} ${errors.company ? 'border-red-500' : ''}`}
                    />
                    {errors.company && <p className="text-xs text-red-500">{errors.company}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className={`text-xs font-medium ${textMuted}`}>Email *</label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      className={`w-full text-sm px-3 py-2 rounded-lg border outline-none focus:ring-1 focus:ring-indigo-500/50 ${inputBg} ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-xs font-medium ${textMuted}`}>Phone</label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className={`w-full text-sm px-3 py-2 rounded-lg border outline-none focus:ring-1 focus:ring-indigo-500/50 ${inputBg}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className={`text-xs font-medium ${textMuted}`}>Client Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className={`w-full text-sm px-3 py-2 rounded-lg border outline-none focus:ring-1 focus:ring-indigo-500/50 ${inputBg}`}
                    >
                      <option value="Corporate">Corporate</option>
                      <option value="Individual">Individual</option>
                      <option value="Government">Government</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-xs font-medium ${textMuted}`}>Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className={`w-full text-sm px-3 py-2 rounded-lg border outline-none focus:ring-1 focus:ring-indigo-500/50 ${inputBg}`}
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={`text-xs font-medium ${textMuted}`}>Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Physical address..."
                    className={`w-full text-sm px-3 py-2 rounded-lg border outline-none resize-none focus:ring-1 focus:ring-indigo-500/50 ${inputBg}`}
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className={`text-xs font-medium ${textMuted}`}>Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Additional details..."
                    className={`w-full text-sm px-3 py-2 rounded-lg border outline-none resize-none focus:ring-1 focus:ring-indigo-500/50 ${inputBg}`}
                  />
                </div>
              </div>
              
              <div className={`px-6 py-4 border-t ${border} flex justify-end gap-3`}>
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-gray-100 text-gray-700'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  Create Client
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddClientModal;
