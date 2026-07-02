import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { 
  Search, 
  FileText, 
  Clock, 
  AlertCircle,
  FileCheck2,
  FileClock
} from 'lucide-react';

export const DocumentLibrary: React.FC = () => {
  const { documents, setSelectedDocumentId, currentView } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Analyzed' | 'Processing' | 'Failed'>('All');

  // Filter documents
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || doc.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Analyzed': return <FileCheck2 size={16} className="text-emerald-500" />;
      case 'Processing': return <FileClock size={16} className="text-blue-500 animate-pulse" />;
      case 'Failed': return <AlertCircle size={16} className="text-rose-500" />;
      default: return <FileText size={16} className="text-slate-500" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Analyzed': return 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50';
      case 'Processing': return 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/50';
      case 'Failed': return 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/50';
      default: return 'bg-slate-50 dark:bg-zinc-900 text-slate-700 dark:text-zinc-400 border-slate-200 dark:border-zinc-800';
    }
  };

  // Nice module name formatter for the heading
  const getModuleName = () => {
    switch (currentView) {
      case 'contract-analysis': return 'Contract Analysis';
      case 'missing-checklist': return 'Missing Clause Checklist';
      case 'clause-verification': return 'Clause Verification';
      case 'risk-analysis': return 'Risk Analysis';
      case 'defined-terms': return 'Defined Terms Dictionary';
      case 'obligation-tracker': return 'Obligation Tracker';
      case 'memo-generator': return 'Memo Generator';
      case 'comparison': return 'Comparison';
      case 'negotiation-assistant': return 'Negotiation Assistant';
      default: return 'the module';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-3">
          <FileText className="text-blue-500" size={28} />
          Document Library
        </h2>
        <p className="text-slate-500 dark:text-zinc-400 text-sm max-w-2xl">
          Please select a document to continue to <strong>{getModuleName()}</strong>. You can choose an existing file from your library or upload a new one via the header.
        </p>
      </div>

      {/* Toolbar (Search, Filter) */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
        
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {['All', 'Analyzed', 'Processing', 'Failed'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter as any)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === filter
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      {filteredDocs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDocs.map((doc, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              key={doc.id}
              onClick={() => setSelectedDocumentId(doc.id)}
              className="group bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm hover:shadow-premium hover:border-blue-300 dark:hover:border-blue-900/50 cursor-pointer transition-all duration-300 flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl text-blue-600 dark:text-blue-400 group-hover:scale-110 group-hover:bg-blue-100 transition-transform">
                    <FileText size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-zinc-100 text-sm line-clamp-1 break-all" title={doc.name}>
                      {doc.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono mt-0.5">
                      {doc.size} • {doc.pages} pages
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-auto space-y-4">
                <div className="flex items-center justify-between text-[11px] font-medium border-t border-slate-100 dark:border-zinc-800 pt-4">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
                    <Clock size={12} />
                    {doc.uploadDate}
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${getStatusStyle(doc.status)}`}>
                    {getStatusIcon(doc.status)}
                    {doc.status}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center">
          <div className="p-4 bg-slate-50 dark:bg-zinc-950 rounded-full mb-4 text-slate-400 dark:text-zinc-600">
            <Search size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-200 mb-2">No documents found</h3>
          <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-md">
            We couldn't find any documents matching your current filters. Try adjusting your search or upload a new document.
          </p>
        </div>
      )}

    </div>
  );
};
