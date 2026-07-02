import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scale, 
  ChevronRight, 
  ShieldCheck, 
  FileText, 
  Search, 
  CheckCircle2, 
  Lock, 
  Building2, 
  Mail,
  ArrowRight,
  X,
  Briefcase,
  Settings,
  Sun,
  Moon,
  Plus,
  Minus,
  TrendingUp,
  Users,
  Award,
  PlayCircle,
  ChevronLeft,
  ArrowDown,
  Clock,
  Zap,
  Check
} from 'lucide-react';
import { trackEvent, trackPageview } from '../utils/analytics';

interface LandingProps {
  onLoginClick: () => void;
  onPricingClick: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onLoginClick, onPricingClick }) => {
  const [isEarlyAccessOpen, setIsEarlyAccessOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    trackPageview('/');
  }, []);

  const testimonials = [
    {
      quote: "LexAI has fundamentally transformed how our corporate department approaches due diligence. LexAI saved us 40 hours per month. The ROI is immediate.",
      name: "Adv. Yash Raut",
      title: "Managing Partner, Mehta Infra",
      image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=800&auto=format&fit=crop"
    },
    {
      quote: "The accuracy is incredible. Not a single missed clause in our high-stakes vendor agreements. It's like giving every associate a senior partner looking over their shoulder.",
      name: "Priya Sharma",
      title: "Head of Legal Ops, MMRDA",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop"
    },
    {
      quote: "Deploying LexAI on-premise gave our security team the peace of mind they needed, while giving our litigation team the AI power they demanded.",
      name: "Rahul Desai",
      title: "General Counsel, Nair Associates",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const faqs = [
    {
      q: "How does LexAI ensure client confidentiality?",
      a: "LexAI utilizes a zero-retention policy and can be deployed entirely on-premise or within your firm's sovereign cloud. We do not use your contracts to train our foundational models, ensuring absolute compliance with attorney-client privilege."
    },
    {
      q: "Can it integrate with our existing Document Management System (DMS)?",
      a: "Yes. LexAI seamlessly integrates with iManage, NetDocuments, and standard SharePoint environments. We provide native plugins so your attorneys can initiate AI reviews directly from where they already work."
    },
    {
      q: "What types of contracts does LexAI support out-of-the-box?",
      a: "LexAI comes pre-trained on NDAs, MSAs, DPAs, Vendor Agreements, and Commercial Leases. However, our system is highly adaptable and can be fine-tuned to your firm's specific playbook in under 48 hours."
    },
    {
      q: "How accurate is the clause verification?",
      a: "In recent benchmark studies by leading Am Law 100 firms, LexAI achieved a 99.2% recall rate in identifying non-standard liabilities and indemnification clauses, significantly outperforming junior associate baselines."
    }
  ];

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const handleCTA = (action: string) => {
    trackEvent('Clicked CTA', { action });
    setIsEarlyAccessOpen(true);
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-amber-200 ${isDark ? 'dark bg-slate-950 text-slate-100' : 'bg-[#fbfaf8] text-slate-900'} transition-colors duration-300`}>
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-[#fbfaf8]/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-2">
              <Scale size={24} className="text-slate-900 dark:text-white" />
              <span className="font-bold text-xl tracking-tight dark:text-white">Lex<span className="text-amber-600">AI</span></span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
              <a href="#platform" className="hover:text-slate-900 dark:hover:text-white transition-colors">Platform</a>
              <a href="#customers" className="hover:text-slate-900 dark:hover:text-white transition-colors">Customers</a>
              <a href="#security" className="hover:text-slate-900 dark:hover:text-white transition-colors">Security</a>
              <button 
                onClick={() => {
                  trackEvent('Navigated to Pricing');
                  onPricingClick();
                }}
                className="hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Pricing
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button 
              onClick={() => {
                trackEvent('Clicked Sign In Header');
                onLoginClick();
              }}
              className="hidden md:block text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => handleCTA('Header Request Access')}
              className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg shadow-amber-600/20"
            >
              Request early access
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
        <motion.div 
          {...fadeIn}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 text-xs font-semibold mb-6 border border-amber-200/50 dark:border-amber-500/20">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            INTRODUCING LEXAI ENTERPRISE
          </div>
          <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-slate-900 dark:text-white mb-8 leading-[1.1] font-serif">
            The intelligence engine for <br/>
            <span className="text-amber-600 italic">modern law firms.</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed">
            LexAI is a highly fine-tuned legal intelligence platform that reads, 
            drafts, and reviews contracts and precedents. Built for top-tier law firms, 
            corporate counsels, and legal ops teams to automate routine work with unmatched precision.
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <button 
              onClick={() => handleCTA('Hero Request Access')}
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-full text-base font-medium transition-all shadow-xl shadow-amber-600/20 flex items-center gap-2"
            >
              Request early access <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => {
                trackEvent('Clicked View Enterprise Plans');
                onPricingClick();
              }}
              className="px-8 py-4 rounded-full text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-all"
            >
              View Enterprise Plans
            </button>
          </div>
        </motion.div>
      </section>

      {/* Social Proof & Numbers (Localized) */}
      <section className="py-12 border-y border-slate-200/50 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Legal Features", value: "45+", icon: FileText },
            { label: "Accuracy Rate", value: "90%+", icon: Award },
            { label: "Indian Legal Q&A", value: "47K+", icon: Search },
            { label: "Document Types", value: "18+", icon: FileText }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center text-center">
              <div className="text-3xl font-bold font-serif text-slate-900 dark:text-white mb-2">{stat.value}</div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <stat.icon size={14} className="text-amber-500" />
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* "How It Works" Timeline */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <motion.div {...fadeIn} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-medium font-serif mb-4 dark:text-white">How LexAI Works</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            From raw document to actionable intelligence in seconds.
          </p>
        </motion.div>
        
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 relative before:absolute before:inset-0 before:top-12 md:before:top-12 before:left-8 md:before:left-12 before:w-0.5 md:before:w-[calc(100%-6rem)] before:h-[calc(100%-3rem)] md:before:h-0.5 before:bg-slate-200 dark:before:bg-slate-800 before:-z-10">
          {[
            { step: "1", title: "Upload Contract", desc: "Drag & drop your PDF or DOCX file securely into the portal." },
            { step: "2", title: "AI Analyzes", desc: "LexAI extracts entities and checks clauses in under 30 seconds." },
            { step: "3", title: "Get Report", desc: "Instantly view missing clauses, risks, and obligations." },
            { step: "4", title: "Act on Findings", desc: "Export redlines and save 10+ hours per transaction." }
          ].map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex md:flex-col items-center md:items-center text-left md:text-center gap-6 md:gap-4 flex-1 w-full"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-amber-500/20 shrink-0">
                {item.step}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[200px]">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Demo Video Section with enhanced CTA */}
      <section className="py-24 px-6 bg-slate-900 text-center relative border-y border-slate-800">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeIn} className="mb-12">
            <h2 className="text-3xl md:text-4xl font-medium font-serif mb-4 text-white">See LexAI in Action</h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-6 text-lg">
              Watch how top-tier lawyers use LexAI to analyze contracts and extract risks in seconds.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl overflow-hidden bg-black shadow-2xl shadow-amber-900/10 relative aspect-video border border-slate-700"
            onViewportEnter={() => trackEvent('Viewed Demo Video Section')}
          >
            {/* Placeholder for Loom Iframe */}
            <iframe 
              src="https://www.loom.com/embed/YOUR_LOOM_ID" 
              title="LexAI Demo Video"
              frameBorder="0" 
              allowFullScreen 
              className="w-full h-full absolute inset-0 z-10 opacity-40 pointer-events-none" 
            />
            {/* Mock Video Overlay */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
              <button 
                onClick={() => trackEvent('Played Demo Video')}
                className="group flex flex-col items-center gap-4"
              >
                <div className="w-20 h-20 bg-amber-600 hover:bg-amber-500 text-white rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(217,119,6,0.4)] transition-transform group-hover:scale-110">
                  <PlayCircle size={40} className="ml-1" />
                </div>
                <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur px-4 py-2 rounded-full border border-slate-700">
                  <span className="text-white font-medium text-sm">Play Demo Video</span>
                  <span className="text-slate-400 text-xs font-mono bg-slate-900 px-2 py-1 rounded">2:15</span>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* "Before vs After" Comparison */}
      <section className="py-24 px-6 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeIn} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium font-serif mb-4 dark:text-white">Transform your workflow</h2>
            <p className="text-slate-500 dark:text-slate-400">Concrete ROI from day one. Stop selling hours, start delivering value.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 opacity-70"
            >
              <h3 className="text-lg font-bold text-slate-500 mb-8 uppercase tracking-widest text-center">Before LexAI</h3>
              <ul className="space-y-6">
                <li className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
                  <X className="text-red-400 shrink-0" size={24} />
                  <span>Read 40-page contracts manually</span>
                </li>
                <li className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
                  <X className="text-red-400 shrink-0" size={24} />
                  <span>Manually check and document risks</span>
                </li>
                <li className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
                  <X className="text-red-400 shrink-0" size={24} />
                  <span>2+ hours spent per contract review</span>
                </li>
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-amber-50 dark:bg-amber-900/10 p-8 rounded-3xl border-2 border-amber-400 dark:border-amber-600 shadow-xl shadow-amber-500/10 relative"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                The LexAI Advantage
              </div>
              <h3 className="text-lg font-bold text-amber-600 mb-8 uppercase tracking-widest text-center mt-2">After LexAI</h3>
              <ul className="space-y-6">
                <li className="flex items-center gap-4 text-slate-900 dark:text-white font-medium">
                  <Check className="text-amber-500 shrink-0" size={24} />
                  <span>Read and analyze in 30 seconds</span>
                </li>
                <li className="flex items-center gap-4 text-slate-900 dark:text-white font-medium">
                  <Check className="text-amber-500 shrink-0" size={24} />
                  <span>Risks and obligations auto-flagged</span>
                </li>
                <li className="flex items-center gap-4 text-slate-900 dark:text-white font-medium">
                  <Check className="text-amber-500 shrink-0" size={24} />
                  <span>15 minutes spent per contract review</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Customers & Testimonials Carousel (Localized) */}
      <section id="customers" className="py-24 px-6 max-w-7xl mx-auto">
        <motion.div {...fadeIn} className="text-center mb-16">
          <p className="text-sm font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-8">Trusted by India's Leading Legal Firms</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-70 dark:opacity-50">
            <span className="text-2xl font-bold font-serif text-slate-800 dark:text-slate-200">MMRDA</span>
            <span className="text-2xl font-bold font-serif text-slate-800 dark:text-slate-200">Mehta Infra</span>
            <span className="text-2xl font-bold font-serif text-slate-800 dark:text-slate-200">Nair Associates</span>
            <span className="text-2xl font-bold font-serif text-slate-800 dark:text-slate-200">DLA Piper</span>
          </div>
        </motion.div>

        <motion.div {...fadeIn} className="relative bg-amber-50 dark:bg-amber-900/10 rounded-3xl p-8 md:p-12 border border-amber-100 dark:border-amber-800/30 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row gap-12 items-center"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-amber-500 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  ))}
                </div>
                <h3 className="text-2xl md:text-3xl font-serif text-slate-900 dark:text-white leading-tight mb-6 min-h-[120px]">
                  "{testimonials[currentTestimonial].quote}"
                </h3>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{testimonials[currentTestimonial].name}</p>
                  <p className="text-sm text-slate-500">{testimonials[currentTestimonial].title}</p>
                </div>
              </div>
              <div className="w-full md:w-1/3">
                <div className="aspect-[4/5] rounded-2xl bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                  <img 
                    src={testimonials[currentTestimonial].image} 
                    alt={testimonials[currentTestimonial].name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          <div className="absolute bottom-12 left-12 flex gap-4">
            <button 
              onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-lg border border-slate-200 dark:border-slate-700 hover:text-amber-600 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
              className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-lg border border-slate-200 dark:border-slate-700 hover:text-amber-600 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="platform" className="py-24 bg-white dark:bg-slate-900/50 px-6 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium font-serif mb-4 dark:text-white">The LexAI Platform</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              A comprehensive suite of tools designed specifically for the complexities of modern legal practice.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div 
              {...fadeIn}
              transition={{ delay: 0.1 }}
              className="bg-[#fbfaf8] dark:bg-slate-800 p-8 md:p-12 rounded-3xl border border-slate-100 dark:border-slate-700 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <FileText size={32} className="text-amber-600 mb-6" />
              <h3 className="text-2xl font-medium mb-3 dark:text-white">LexAI Contracts</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                Automated contract analysis, redlining, and clause verification. Compare drafts and identify missing clauses in seconds.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300 font-medium">
                  <CheckCircle2 size={16} className="text-amber-600" /> Clause Verification
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300 font-medium">
                  <CheckCircle2 size={16} className="text-amber-600" /> Risk Scoring
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300 font-medium">
                  <CheckCircle2 size={16} className="text-amber-600" /> Multi-contract Comparison
                </li>
              </ul>
            </motion.div>

            <motion.div 
              {...fadeIn}
              transition={{ delay: 0.2 }}
              className="bg-[#fbfaf8] dark:bg-slate-800 p-8 md:p-12 rounded-3xl border border-slate-100 dark:border-slate-700 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              {/* Coming Soon Badge */}
              <div className="absolute top-8 right-8 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Coming Soon
              </div>
              
              <Search size={32} className="text-amber-600 mb-6" />
              <h3 className="text-2xl font-medium mb-3 dark:text-white opacity-60">LexResearch</h3>
              <p className="text-slate-500 dark:text-slate-500 leading-relaxed mb-8">
                AI-powered precedent search across Indian statutes and Supreme Court judgments. Due diligence automation for litigation teams.
              </p>
              <ul className="space-y-3 opacity-50">
                <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-400 font-medium">
                  <CheckCircle2 size={16} className="text-slate-400" /> AI Precedent Search
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-400 font-medium">
                  <CheckCircle2 size={16} className="text-slate-400" /> Supreme Court Database
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-400 font-medium">
                  <CheckCircle2 size={16} className="text-slate-400" /> Argument Builder
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Security Section with Badges */}
      <section id="security" className="py-24 bg-slate-900 text-white px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-600/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
          <motion.div {...fadeIn} className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-amber-400 text-xs font-semibold mb-6">
              <Lock size={12} /> ENTERPRISE SECURITY
            </div>
            <h2 className="text-4xl md:text-5xl font-medium font-serif mb-6 leading-tight">
              Your data never <br/>leaves the firm.
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg">
              LexAI runs on a strictly fine-tuned private architecture. Unlike consumer AI tools, 
              inference happens within your sovereign environment. We do not use your confidential 
              contracts to train our base models.
            </p>
            
            {/* Compliance Badges */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center gap-3">
                <ShieldCheck className="text-amber-500" size={24} />
                <span className="font-semibold text-sm">Enterprise Encryption</span>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center gap-3">
                <Lock className="text-amber-500" size={24} />
                <span className="font-semibold text-sm">DPDP Compliant</span>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center gap-3 col-span-2">
                <CheckCircle2 className="text-slate-500" size={24} />
                <span className="font-semibold text-sm text-slate-300">SOC2 Type II <span className="text-xs text-slate-500 ml-2 font-normal">(Coming Q3 2026)</span></span>
              </div>
            </div>

            <button 
              onClick={() => {
                trackEvent('Downloaded Security Brief');
                alert("Security Brief PDF will be available soon!");
              }}
              className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-3 rounded-full text-sm font-bold transition-all shadow-lg"
            >
              Read Security Brief
            </button>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full"
          >
            <div className="aspect-square md:aspect-[4/3] rounded-3xl bg-slate-800 border border-slate-700 flex items-center justify-center relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-slate-900/50 mix-blend-overlay z-10" />
              <img 
                src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2000&auto=format&fit=crop" 
                alt="Secure Server Infrastructure" 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <Lock size={80} className="text-white/30 backdrop-blur-sm drop-shadow-xl" strokeWidth={1} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-24 bg-[#fbfaf8] dark:bg-slate-950 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div {...fadeIn} className="mb-16">
            <h2 className="text-3xl md:text-4xl font-medium font-serif mb-4 dark:text-white">Built for high-volume legal teams</h2>
            <p className="text-slate-500 dark:text-slate-400">Whether you are a boutique firm or an in-house corporate legal department.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              { title: "Law Firms", desc: "Accelerate due diligence and contract review. Allow partners to focus on strategy while associates process hundreds of documents instantly.", icon: Building2 },
              { title: "In-House Counsel", desc: "Streamline procurement and sales contracts. Maintain a centralized repository of obligations and easily track compliance across the org.", icon: Briefcase },
              { title: "Legal Ops", desc: "Standardize approval workflows and bring structure to unstructured data. Generate instant reports on risk exposure.", icon: Settings }
            ].map((audience, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-amber-200 dark:hover:border-amber-900 transition-colors"
              >
                <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                  <audience.icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 dark:text-white">{audience.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{audience.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Recognition Section */}
      <section className="py-12 bg-white dark:bg-slate-900 border-y border-slate-200/50 dark:border-slate-800 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-8">Featured In</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 dark:opacity-40 grayscale">
            <span className="text-xl font-bold text-slate-800 dark:text-slate-200">Legal Tech News</span>
            <span className="text-xl font-bold font-serif text-slate-800 dark:text-slate-200">LawFirm Magazine</span>
            <span className="text-xl font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200">AI in Law</span>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-[#fbfaf8] dark:bg-slate-950 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeIn} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium font-serif mb-4 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-slate-500 dark:text-slate-400">Everything you need to know about the product and billing.</p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div 
                key={i}
                {...fadeIn}
                transition={{ delay: i * 0.1 }}
                className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden"
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
                >
                  <span className="font-semibold text-slate-900 dark:text-white pr-4">{faq.q}</span>
                  {openFaq === i ? <Minus size={18} className="text-amber-500 shrink-0" /> : <Plus size={18} className="text-slate-400 shrink-0" />}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-white dark:bg-slate-900 px-6 pb-5 text-slate-600 dark:text-slate-400 leading-relaxed text-sm"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog / Insights Section (with tags) */}
      <section className="py-24 bg-white dark:bg-slate-900/50 px-6 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn} className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-medium font-serif mb-4 dark:text-white">Latest Insights</h2>
              <p className="text-slate-500 dark:text-slate-400">Industry news, legal tech updates, and company announcements.</p>
            </div>
            <button 
              onClick={() => {
                trackEvent('Clicked View All Articles');
                alert("Full Blog will be available in Phase 4!");
              }}
              className="hidden md:flex items-center gap-2 text-amber-600 font-bold hover:text-amber-700 transition-colors"
            >
              View all articles <ArrowRight size={16} />
            </button>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "The Future of AI in Mergers & Acquisitions",
                tags: ["#AI", "#LegalTech", "#M&A", "#3min-read"],
                image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=800&auto=format&fit=crop",
                date: "Aug 12, 2026"
              },
              {
                title: "Navigating DPDP Compliance in Legal Tech",
                tags: ["#Security", "#DPDP", "#Compliance", "#4min-read"],
                image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=800&auto=format&fit=crop",
                date: "Jul 28, 2026"
              },
              {
                title: "How Mid-Size Firms are Beating the Am Law 100",
                tags: ["#CaseStudy", "#Growth", "#ROI", "#2min-read"],
                image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop",
                date: "Jul 15, 2026"
              }
            ].map((article, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
                onClick={() => trackEvent('Clicked Blog Article', { title: article.title })}
              >
                <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-6 relative">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {article.tags.map(tag => (
                    <span key={tag} className="text-xs font-bold text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-bold dark:text-white group-hover:text-amber-600 transition-colors leading-snug mb-2">{article.title}</h3>
                <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">{article.date}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-amber-600 text-white px-6 text-center">
        <motion.div {...fadeIn} className="max-w-3xl mx-auto">
          <Scale size={48} className="mx-auto mb-8 text-amber-200" />
          <h2 className="text-4xl md:text-5xl font-medium font-serif mb-6">Ready to upgrade your practice?</h2>
          <p className="text-amber-100 text-lg mb-10">
            Join leading law firms using LexAI to read faster, review better, and manage risk with absolute confidence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => handleCTA('Footer Request Access')}
              className="bg-slate-900 text-white hover:bg-slate-800 px-8 py-4 rounded-full text-base font-bold transition-all shadow-xl shadow-slate-900/20 w-full sm:w-auto"
            >
              Request early access
            </button>
            <button 
              onClick={() => {
                trackEvent('Clicked Footer Sign In');
                onLoginClick();
              }}
              className="bg-transparent border-2 border-white/20 hover:bg-white/10 px-8 py-4 rounded-full text-base font-bold transition-all w-full sm:w-auto"
            >
              Sign in to platform
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 px-6 border-t border-slate-900">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-10 border-b border-slate-800 pb-16 mb-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Scale size={24} className="text-amber-500" />
              <span className="font-bold text-xl tracking-tight text-white">Lex<span className="text-amber-500">AI</span></span>
            </div>
            <p className="text-sm max-w-sm mb-8">
              The intelligence engine for modern law firms. Next-generation contract analysis and risk management.
            </p>
            {/* Newsletter Signup */}
            <div className="max-w-sm">
              <h4 className="text-white font-bold mb-3 text-sm">Subscribe to our newsletter</h4>
              <form 
                onSubmit={(e) => { e.preventDefault(); trackEvent('Subscribed to Newsletter'); alert("Thanks for subscribing!"); }}
                className="flex gap-2"
              >
                <input 
                  type="email" 
                  required
                  placeholder="name@lawfirm.com" 
                  className="bg-slate-900 border border-slate-800 text-white text-sm rounded-lg px-4 py-2.5 flex-1 focus:outline-none focus:border-amber-500 transition-colors"
                />
                <button type="submit" className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-amber-400 transition-colors">LexAI Contracts</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">LexResearch</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Enterprise Security</a></li>
              <li>
                <button onClick={() => onPricingClick()} className="hover:text-amber-400 transition-colors">Pricing</button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-amber-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Security & Privacy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#faq" className="hover:text-amber-400 transition-colors">Help Center / FAQ</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">System Status</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Security Certifications</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">API Documentation</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-sm text-slate-600">
          <p>© 2026 LexAI Technologies Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-400 transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Twitter</a>
            <a href="#" className="hover:text-slate-400 transition-colors">YouTube</a>
          </div>
        </div>
      </footer>

      {/* Early Access Modal */}
      <AnimatePresence>
        {isEarlyAccessOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl relative border border-slate-200 dark:border-slate-800"
            >
              <button 
                onClick={() => setIsEarlyAccessOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              <div className="mb-8">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-2xl flex items-center justify-center mb-4">
                  <Mail size={24} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Request Early Access</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Join our waitlist to be among the first firms to experience LexAI Enterprise.</p>
              </div>
              
              <form 
                onSubmit={(e) => { 
                  e.preventDefault(); 
                  trackEvent('Submitted Waitlist Form');
                  setIsEarlyAccessOpen(false); 
                  alert("Request received! We'll be in touch soon."); 
                }} 
                className="space-y-4"
              >
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 block">Work Email</label>
                  <input type="email" required placeholder="you@lawfirm.com" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all placeholder:text-slate-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 block">Firm Name</label>
                  <input type="text" required placeholder="Smith & Associates" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all placeholder:text-slate-400" />
                </div>
                <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl mt-4 transition-colors">
                  Join Waitlist
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
