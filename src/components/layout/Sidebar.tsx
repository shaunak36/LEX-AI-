import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABELS } from '../../pages/Login';
import { 
  LayoutDashboard, 
  FileSearch, 
  UploadCloud, 
  FileCheck2, 
  ShieldAlert, 
  CheckSquare, 
  FileText, 
  BookOpen, 
  CalendarClock, 
  Columns, 
  Bot, 
  Settings,
  BookOpenCheck,
  Scale,
  ChevronLeft,
  ChevronRight,
  Handshake,
  LayoutTemplate,
  PenTool,
  Timer,
  Users,
  GitMerge,
  Shield,
  Map,
  Lightbulb,
  Gavel,
  Search,
  ShieldCheck,
  Mic,
  UserCheck,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleAIAssistant: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed, toggleAIAssistant }) => {
  const { currentView, setCurrentView } = useApp();
  const { currentUser, logout } = useAuth();

  const menuSections = [
    {
      label: 'Core',
      items: [
        { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
        { id: 'contract-analysis', name: 'Contract Analysis', icon: FileSearch },
        { id: 'upload', name: 'Upload Documents', icon: UploadCloud },
        { id: 'clause-verification', name: 'Clause Verification', icon: FileCheck2 },
        { id: 'risk-analysis', name: 'Risk Analysis', icon: ShieldAlert },
        { id: 'missing-checklist', name: 'Missing Clause Checklist', icon: CheckSquare },
        { id: 'memo-generator', name: 'Memo Generator', icon: FileText },
        { id: 'defined-terms', name: 'Defined Terms Dictionary', icon: BookOpen },
        { id: 'obligation-tracker', name: 'Obligation Tracker', icon: CalendarClock },
        { id: 'comparison', name: 'Multi Contract Comparison', icon: Columns },
      ],
    },
    {
      label: 'Contracts+',
      items: [
        { id: 'negotiation-assistant', name: 'Negotiation Assistant', icon: Handshake },
        { id: 'templates-library', name: 'Templates Library', icon: LayoutTemplate },
        { id: 'esign-integration', name: 'eSign Integration', icon: PenTool },
        { id: 'limitation-tracker', name: 'Limitation Tracker', icon: Timer },
      ],
    },
    {
      label: 'LexCase',
      items: [
        { id: 'client-portal', name: 'Client Portal', icon: Users },
        { id: 'approval-workflows', name: 'Approval Workflows', icon: GitMerge },
        { id: 'lexcase-research', name: 'Bare Acts Browser', icon: BookOpenCheck },
      ],
    },
    {
      label: 'LexResearch',
      items: [
        { id: 'ai-precedent-search', name: 'AI Precedent Search', icon: Search },
        { id: 'due-diligence', name: 'Due Diligence Automation', icon: ShieldCheck },
        { id: 'cross-examination', name: 'Cross-Exam Copilot', icon: Mic },
        { id: 'expert-witness', name: 'Expert Witness Analyser', icon: UserCheck },
      ],
    },
    {
      label: 'LexCourt',
      items: [
        { id: 'case-journey', name: 'Case Journey Tracker', icon: Map },
        { id: 'court-filing', name: 'Court Filing Checklist', icon: CheckSquare },
        { id: 'argument-builder', name: 'Argument Builder', icon: Gavel },
        { id: 'appeal-guidance', name: 'Appeal Guidance AI', icon: Lightbulb },
      ],
    },
    {
      label: 'System',
      items: [
        { id: 'user-management', name: 'User Management', icon: Shield },
        { id: 'ai-assistant', name: 'AI Legal Assistant', icon: Bot, action: toggleAIAssistant },
        { id: 'settings', name: 'Settings', icon: Settings },
      ],
    },
  ];

  // Filter sections based on Role
  const filteredMenuSections = menuSections.filter(section => {
    // Hide LexCase and System for Lawyers/Clients
    if (currentUser?.role === 'Lawyer' || currentUser?.role === 'Viewer' || currentUser?.role === 'client') {
      if (section.label === 'LexCase' || section.label === 'System') {
        return false;
      }
    }
    return true;
  });

  return (
    <div 
      className={`h-screen sticky top-0 bg-slate-900 text-slate-100 border-r border-slate-800 flex flex-col transition-all duration-300 z-30 ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Platform Logo Brand */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white flex-shrink-0 shadow-lg shadow-blue-500/20">
            <Scale size={20} className="transform rotate-12" />
          </div>
          {!collapsed && (
            <span className="font-extrabold text-xl tracking-wide bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent font-sans">
              Lex<span className="text-blue-500">AI</span>
            </span>
          )}
        </div>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden md:block"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-4 scrollbar-thin">
        {filteredMenuSections.map((section) => (
          <div key={section.label}>
            {/* Section label — hidden when collapsed */}
            {!collapsed && (
              <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                {section.label}
              </p>
            )}
            {collapsed && (
              <div className="border-t border-slate-800 my-2" />
            )}

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if ('action' in item && item.action) {
                        item.action();
                      } else {
                        setCurrentView(item.id);
                      }
                    }}
                    className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 group relative ${
                      isActive 
                        ? 'bg-blue-600 text-white font-medium shadow-md shadow-blue-600/10' 
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon 
                      size={20} 
                      className={`flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                      }`} 
                    />
                    
                    {!collapsed && (
                      <span className="text-[14px] tracking-wide transition-opacity duration-300 truncate">
                        {item.name}
                      </span>
                    )}

                    {/* Tooltip for collapsed sidebar */}
                    {collapsed && (
                      <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-slate-950 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-slate-800 shadow-xl">
                        {item.name}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile & Footer */}
      <div className="border-t border-slate-800 bg-slate-950/20 p-4 flex flex-col gap-3 mt-auto">
        {!collapsed && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-200 truncate">{currentUser?.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{currentUser?.role ? ROLE_LABELS[currentUser.role] || currentUser.role : 'Standard'}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors flex-shrink-0"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
        {collapsed && (
          <button 
            onClick={logout}
            title="Sign Out"
            className="w-full flex justify-center p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <LogOut size={20} />
          </button>
        )}
      </div>
    </div>
  );
};
