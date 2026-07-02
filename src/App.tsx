import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Loader2 } from 'lucide-react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { AIAssistant } from './components/layout/AIAssistant';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Pricing } from './pages/Pricing';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Upload } from './pages/Upload';
import { DocumentAnalysis } from './pages/DocumentAnalysis';
import { ClauseVerification } from './pages/ClauseVerification';
import { RiskAnalysis } from './pages/RiskAnalysis';
import { DefinedTerms } from './pages/DefinedTerms';
import { ObligationTracker } from './pages/ObligationTracker';
import { MemoGenerator } from './pages/MemoGenerator';
import { Comparison } from './pages/Comparison';
import { LexCaseResearch } from './pages/LexCaseResearch';
import { Settings } from './pages/Settings';
import { NegotiationAssistant } from './pages/NegotiationAssistant';
import { TemplatesLibrary } from './pages/TemplatesLibrary';
import { ESignIntegration } from './pages/ESignIntegration';
import { LimitationTracker } from './pages/LimitationTracker';
import ClientPortal from './pages/ClientPortal';
import ApprovalWorkflows from './pages/ApprovalWorkflows';
import { DocumentLibrary } from './pages/DocumentLibrary';
import { UserManagement } from './pages/UserManagement';
import { CourtFilingChecklist } from './pages/CourtFilingChecklist';
import { ArgumentBuilder } from './pages/ArgumentBuilder';
import { AppealGuidance } from './pages/AppealGuidance';
import { CaseJourneyTracker } from './pages/CaseJourneyTracker';
import { AIPrecedentSearch } from './pages/AIPrecedentSearch';
import { DueDiligenceAutomation } from './pages/DueDiligenceAutomation';
import { CrossExaminationCopilot } from './pages/CrossExaminationCopilot';
import { ExpertWitnessAnalyser } from './pages/ExpertWitnessAnalyser';

const AppContent: React.FC = () => {
  const { currentView, setCurrentView, selectedDocumentId } = useApp();
  const { currentUser } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);

  // Render active page
  const renderView = () => {
    // RBAC Protection
    const isClient = currentUser?.role === 'Lawyer' || currentUser?.role === 'Viewer' || currentUser?.role === 'client';
    const clientForbiddenViews = ['user-management', 'settings', 'client-portal', 'approval-workflows', 'lexcase-research'];
    
    if (isClient && clientForbiddenViews.includes(currentView)) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Access Denied</h2>
          <p className="text-slate-500 mb-6">You do not have permission to access this area.</p>
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors font-medium shadow-sm"
          >
            Back to Dashboard
          </button>
        </div>
      );
    }

    // User Management is accessible to internal staff
    if (isClient && currentView === 'user-management') {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Access Denied</h2>
          <p className="text-slate-500 mb-6">Clients cannot access User Management.</p>
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors font-medium shadow-sm"
          >
            Back to Dashboard
          </button>
        </div>
      );
    }

    // Non-document based modules
    switch (currentView) {
      case 'client-portal': return <ClientPortal />;
      case 'approval-workflows': return <ApprovalWorkflows />;
      case 'templates-library': return <TemplatesLibrary />;
      case 'esign-integration': return <ESignIntegration />;
      case 'limitation-tracker': return <LimitationTracker />;
      case 'court-filing': return <CourtFilingChecklist />;
      case 'argument-builder': return <ArgumentBuilder />;
      case 'appeal-guidance': return <AppealGuidance />;
      case 'case-journey': return <CaseJourneyTracker />;
      case 'ai-precedent-search': return <AIPrecedentSearch />;
      case 'due-diligence': return <DueDiligenceAutomation />;
      case 'cross-examination': return <CrossExaminationCopilot />;
      case 'expert-witness': return <ExpertWitnessAnalyser />;
      case 'dashboard': return <Dashboard />;
      case 'user-management': return <UserManagement />;
      case 'upload': return <Upload />;
      case 'lexcase-research': return <LexCaseResearch />;
      case 'settings': return <Settings />;
    }

    // Intercept document-based modules if no document is selected
    if (!selectedDocumentId) {
      return <DocumentLibrary />;
    }

    // Document-based modules
    switch (currentView) {
      case 'contract-analysis': return <DocumentAnalysis />;
      case 'missing-checklist': return <DocumentAnalysis />;
      case 'clause-verification': return <ClauseVerification />;
      case 'risk-analysis': return <RiskAnalysis />;
      case 'defined-terms': return <DefinedTerms />;
      case 'obligation-tracker': return <ObligationTracker />;
      case 'memo-generator': return <MemoGenerator />;
      case 'comparison': return <Comparison />;
      case 'negotiation-assistant': return <NegotiationAssistant />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50 transition-colors duration-300 font-sans">
      {/* Sidebar navigation */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed} 
        toggleAIAssistant={() => setAiAssistantOpen(!aiAssistantOpen)}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <Header 
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          isSidebarCollapsed={sidebarCollapsed}
          isAIAssistantOpen={aiAssistantOpen}
          setIsAIAssistantOpen={setAiAssistantOpen}
        />
        
        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin bg-slate-50/50 dark:bg-zinc-950/40">
          {renderView()}
        </main>
      </div>

      {/* Persistent AI Assistant Sidebar */}
      <AIAssistant 
        isOpen={aiAssistantOpen} 
        onClose={() => setAiAssistantOpen(false)}
        onOpen={() => setAiAssistantOpen(true)}
      />
    </div>
  );
};

const Root: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const [publicView, setPublicView] = useState<'landing' | 'pricing' | 'login'>('landing');
  
  if (loading) {
    return (
      <div className="h-screen w-screen bg-slate-900 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-blue-500" size={32} />
        <p className="text-slate-400 text-sm font-medium">Authenticating...</p>
      </div>
    );
  }
  
  if (!currentUser) {
    if (publicView === 'login') {
      return <Login onBack={() => setPublicView('landing')} />;
    }
    if (publicView === 'pricing') {
      return (
        <Pricing 
          onBack={() => setPublicView('landing')} 
          onRequestAccess={() => setPublicView('login')} 
        />
      );
    }
    return (
      <Landing 
        onLoginClick={() => setPublicView('login')} 
        onPricingClick={() => setPublicView('pricing')}
      />
    );
  }
  
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Root />
    </AuthProvider>
  );
}

export default App;
