import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, ArrowLeft, Building2, Scale, Mail } from 'lucide-react';
import { trackEvent, trackPageview } from '../utils/analytics';

interface PricingProps {
  onBack: () => void;
  onRequestAccess: () => void;
}

export const Pricing: React.FC<PricingProps> = ({ onBack, onRequestAccess }) => {
  const [isAnnual, setIsAnnual] = useState(true);

  useEffect(() => {
    trackPageview('/pricing');
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  };

  const handlePlanSelect = (planName: string) => {
    trackEvent('Selected Pricing Plan', { plan: planName, billing: isAnnual ? 'annual' : 'monthly' });
    onRequestAccess();
  };

  return (
    <div className="min-h-screen bg-[#fbfaf8] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-amber-200 transition-colors duration-300 pb-24">
      {/* Navigation */}
      <nav className="w-full bg-[#fbfaf8]/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                trackEvent('Clicked Back from Pricing');
                onBack();
              }}
              className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <ArrowLeft size={16} /> Back to Home
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Scale size={24} className="text-slate-900 dark:text-white" />
            <span className="font-bold text-xl tracking-tight dark:text-white">Lex<span className="text-amber-600">AI</span></span>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.div {...fadeIn}>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-slate-900 dark:text-white mb-6 font-serif">
            Transparent pricing for <br/>
            <span className="text-amber-600 italic">modern law practices.</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
            Choose the plan that fits your firm's volume and security requirements. 
            All plans include core AI analysis.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Monthly</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-7 rounded-full bg-slate-200 dark:bg-slate-700 relative transition-colors focus:outline-none"
            >
              <div className={`w-5 h-5 rounded-full bg-amber-600 absolute top-1 transition-transform ${isAnnual ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
            <span className={`text-sm font-medium flex items-center gap-2 ${isAnnual ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
              Annually <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs px-2 py-0.5 rounded-full font-bold">Save 20%</span>
            </span>
          </div>
        </motion.div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        
        {/* Professional */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 flex flex-col"
        >
          <h3 className="text-xl font-bold mb-2">Professional</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Perfect for boutique firms and solo practitioners.</p>
          <div className="mb-6">
            <span className="text-4xl font-bold">${isAnnual ? '99' : '119'}</span>
            <span className="text-slate-500 dark:text-slate-400">/user/mo</span>
          </div>
          <button 
            onClick={() => handlePlanSelect('Professional')}
            className="w-full py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 font-bold hover:border-amber-600 hover:text-amber-600 transition-colors mb-4"
          >
            Start Free Trial
          </button>
          <p className="text-center text-xs text-slate-500 mb-6">No setup fees. Cancel anytime.</p>
          <div className="flex-1 space-y-4">
            <p className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-300 mb-4">Includes</p>
            {['1,000 document analyses/mo', 'Standard AI drafting tools', 'Basic precedent search', 'Email support'].map((feature, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                <Check size={18} className="text-amber-500 shrink-0" /> {feature}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Enterprise */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900 text-white rounded-3xl p-8 border-2 border-amber-600 flex flex-col relative shadow-2xl shadow-amber-900/20"
        >
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Most Popular
          </div>
          <h3 className="text-xl font-bold mb-2">Enterprise</h3>
          <p className="text-slate-400 text-sm mb-6">For high-volume corporate legal departments.</p>
          <div className="mb-6">
            <span className="text-4xl font-bold">${isAnnual ? '399' : '499'}</span>
            <span className="text-slate-400">/user/mo</span>
          </div>
          <button 
            onClick={() => handlePlanSelect('Enterprise')}
            className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors mb-4"
          >
            Request Access
          </button>
          <p className="text-center text-xs text-amber-200/60 mb-6">No setup fees. Annual commitment required.</p>
          <div className="flex-1 space-y-4">
            <p className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">Everything in Pro, plus</p>
            {['Unlimited document analyses', 'Advanced Cross-Examination Copilot', 'Automated Due Diligence', 'Custom clause libraries', 'Priority 24/7 support'].map((feature, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-slate-300">
                <Check size={18} className="text-amber-500 shrink-0" /> {feature}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Custom / On-Premise */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 flex flex-col"
        >
          <h3 className="text-xl font-bold mb-2">On-Premise</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">For Am Law 100 firms with strict data sovereignty.</p>
          <div className="mb-6">
            <span className="text-4xl font-bold">Custom</span>
          </div>
          <button 
            onClick={() => handlePlanSelect('Custom')}
            className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors mb-8"
          >
            Contact Sales
          </button>
          <div className="flex-1 space-y-4">
            <p className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-300 mb-4">Includes</p>
            {['Deployed in your private cloud', 'Zero data retention architecture', 'Fine-tuning on your firm\'s precedents', 'Dedicated customer success manager', 'SSO & Advanced RBAC'].map((feature, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                <Check size={18} className="text-amber-500 shrink-0" /> {feature}
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};
