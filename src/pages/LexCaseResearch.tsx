import React, { useState } from 'react';
import { BookOpen, Search, Bookmark, BookmarkCheck, Scale, Sparkles, ChevronRight, FileText, BrainCircuit, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data Structure
type Act = 'BNS' | 'BNSS' | 'BSA';

interface Section {
  id: string;
  number: string;
  title: string;
  text: string;
  insights: string;
  elements: string[];
  judgments: string[];
  isBookmarked?: boolean;
}

const MOCK_DATABASE: Record<Act, Section[]> = {
  BNS: [
    {
      id: 'bns-103',
      number: 'Section 103',
      title: 'Punishment for Murder',
      text: '(1) Whoever commits murder shall be punished with death or imprisonment for life, and shall also be liable to fine.\n(2) When a group of five or more persons acting in concert commits murder on the ground of race, caste or community, sex, place of birth, language, personal belief or any other similar ground each member of such group shall be punished with death or with imprisonment for life, and shall also be liable to fine.',
      insights: 'This section replaces Section 302 of the IPC. Sub-section (2) is a new addition specifically targeting mob lynching and hate crimes, imposing strict liability on all members of the group.',
      elements: [
        'Act causing death',
        'Intention of causing death',
        'Intention of causing bodily injury likely to cause death'
      ],
      judgments: [
        'Bachan Singh v. State of Punjab (1980) - "Rarest of rare" doctrine for death penalty remains applicable.',
        'Machhi Singh v. State of Punjab (1983) - Guidelines for death penalty.'
      ]
    },
    {
      id: 'bns-111',
      number: 'Section 111',
      title: 'Organised Crime',
      text: '(1) Any continuing unlawful activity including kidnapping, robbery, vehicle theft, extortion, land grabbing, contract killing, economic offences, cyber-crimes having severe consequences, trafficking in people, drugs, illicit goods or weapons and human trafficking racket for prostitution or ransom by any person or a group of persons acting in concert, singly or jointly, either as a member of an organised crime syndicate or on behalf of such syndicate, by use of violence, threat of violence, intimidation, coercion, corruption or related means or other unlawful means to obtain direct or indirect material benefit including a financial benefit, shall constitute organised crime.',
      insights: 'A completely new provision in the BNS addressing organized crime at the national level, filling the void that was previously handled by state-specific laws like MCOCA or GUJCOCA.',
      elements: [
        'Continuing unlawful activity',
        'Acting as a syndicate or group',
        'Use of violence, coercion, or corruption',
        'Intent to obtain financial or material benefit'
      ],
      judgments: [
        'State of Maharashtra v. Bharat Shanti Lal Shah (2008) - Constitutional validity of state organized crime laws (Reference point).'
      ]
    },
    {
      id: 'bns-69',
      number: 'Section 69',
      title: 'Sexual intercourse by employing deceitful means, etc.',
      text: 'Whoever, by deceitful means or making by promise to marry to a woman without any intention of fulfilling the same, and has sexual intercourse with her, such sexual intercourse not amounting to the offence of rape, shall be punished with imprisonment of either description for a term which may extend to ten years and shall also be liable to fine.\nExplanation.— "deceitful means" shall include the false promise of employment or promotion, inducement, or marring after suppressing identity.',
      insights: 'This specifically criminalizes sexual intercourse under false promise of marriage or employment without classifying it as rape, addressing a highly debated grey area in criminal jurisprudence.',
      elements: [
        'Sexual intercourse',
        'Consent obtained via deceitful means',
        'False promise of marriage without intent to fulfill',
        'Suppression of identity'
      ],
      judgments: [
        'Pramod Suryabhan Pawar v. State of Maharashtra (2019) - Distinction between breach of promise and false promise.'
      ]
    }
  ],
  BNSS: [
    {
      id: 'bnss-163',
      number: 'Section 163',
      title: 'Power to issue order in urgent cases of nuisance or apprehended danger',
      text: 'In cases where, in the opinion of a District Magistrate, a Sub-divisional Magistrate or any other Executive Magistrate specially empowered by the State Government in this behalf, there is sufficient ground for proceeding under this section and immediate prevention or speedy remedy is desirable... such Magistrate may, by a written order stating the material facts of the case and served in the manner provided by section 153, direct any person to abstain from a certain act or to take certain order with respect to certain property in his possession.',
      insights: 'This replaces Section 144 of the CrPC. The core powers remain identical, allowing magistrates to issue prohibitory orders to prevent apprehended danger to human life, health, or safety, or a disturbance of the public tranquility.',
      elements: [
        'Opinion of Executive Magistrate',
        'Urgency requiring immediate prevention',
        'Apprehended danger to life, health, or public tranquility'
      ],
      judgments: [
        'Babulal Parate v. State of Maharashtra (1961) - Upholding constitutional validity of prohibitory orders.',
        'Anuradha Bhasin v. Union of India (2020) - Cannot be used indefinitely to suppress legitimate expression.'
      ]
    }
  ],
  BSA: [
    {
      id: 'bsa-61',
      number: 'Section 61',
      title: 'Electronic or Digital Record',
      text: 'Nothing in the Adhiniyam shall apply to deny the admissibility of an electronic or digital record in evidence on the ground that it is an electronic or digital record and such record shall, subject to section 63, have the same legal effect, validity and enforceability as any other document.',
      insights: 'Replaces Section 65B of the Indian Evidence Act. It broadens the scope of digital evidence and streamlines the certification process, making digital and electronic records primary evidence when properly certified.',
      elements: [
        'Admissibility of electronic record',
        'Subject to certification requirements (Sec 63)',
        'Parity with physical documents'
      ],
      judgments: [
        'Arjun Panditrao Khotkar v. Kailash Kushanrao Gorantyal (2020) - Requirement of certificate under 65B is mandatory.'
      ]
    }
  ]
};

export const LexCaseResearch: React.FC = () => {
  const [activeAct, setActiveAct] = useState<Act>('BNS');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSectionId, setActiveSectionId] = useState<string>('bns-103');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  // Filter sections
  const filteredSections = MOCK_DATABASE[activeAct].filter(sec => 
    sec.number.toLowerCase().includes(searchQuery.toLowerCase()) || 
    sec.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeSection = MOCK_DATABASE[activeAct].find(s => s.id === activeSectionId) || filteredSections[0];

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10 flex flex-col h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden p-6 md:p-8 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 border border-slate-800 shadow-xl flex-shrink-0">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/50 border border-blue-700/50 text-[10px] font-bold text-blue-300 uppercase tracking-widest">
              <BookOpen size={12} />
              Module 3.3 — LexCase
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Bare Acts Browser</h2>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Explore the new criminal laws (BNS, BNSS, BSA). Access bare text, track new additions like organized crime and mob lynching, and leverage AI annotations to decode complex provisions.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Column: Index & Search */}
        <div className="lg:col-span-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 flex flex-col overflow-hidden">
          {/* Act Selector */}
          <div className="p-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/50">
            <div className="flex bg-slate-200/50 dark:bg-zinc-900 rounded-xl p-1">
              {(['BNS', 'BNSS', 'BSA'] as Act[]).map(act => (
                <button
                  key={act}
                  onClick={() => {
                    setActiveAct(act);
                    setSearchQuery('');
                    setActiveSectionId(MOCK_DATABASE[act][0]?.id);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    activeAct === act 
                      ? 'bg-white dark:bg-zinc-800 shadow text-blue-600 dark:text-blue-400' 
                      : 'text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-300'
                  }`}
                >
                  {act}
                </button>
              ))}
            </div>
          </div>
          
          {/* Search */}
          <div className="p-4 border-b border-slate-200 dark:border-zinc-800">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Section or Keyword..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-800 dark:text-zinc-200"
              />
            </div>
          </div>

          {/* Section List */}
          <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
            {filteredSections.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                <Search size={24} className="mb-2 opacity-50" />
                <span className="text-xs font-semibold">No sections found</span>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredSections.map(sec => (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSectionId(sec.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group ${
                      activeSectionId === sec.id 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50' 
                        : 'border border-transparent hover:bg-slate-50 dark:hover:bg-zinc-950'
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <div className={`text-xs font-extrabold mb-0.5 ${activeSectionId === sec.id ? 'text-blue-700 dark:text-blue-400' : 'text-slate-800 dark:text-zinc-200'}`}>
                        {sec.number}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                        {sec.title}
                      </div>
                    </div>
                    {bookmarkedIds.has(sec.id) ? (
                      <BookmarkCheck size={16} className="text-blue-500 flex-shrink-0" />
                    ) : (
                      <ChevronRight size={16} className={`flex-shrink-0 transition-opacity ${activeSectionId === sec.id ? 'text-blue-500 opacity-100' : 'text-slate-300 opacity-0 group-hover:opacity-100'}`} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Bare Text & AI Insights */}
        <div className="lg:col-span-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 flex flex-col overflow-hidden relative">
          
          {activeSection ? (
            <div className="flex flex-col h-full absolute inset-0 overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center justify-between p-5 lg:p-6 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 z-10 shadow-sm flex-shrink-0">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 tracking-wider">
                      {activeAct}
                    </span>
                    <h3 className="font-extrabold text-lg text-slate-800 dark:text-zinc-100">{activeSection.number}</h3>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-500 dark:text-zinc-400">{activeSection.title}</h4>
                </div>
                <button 
                  onClick={() => toggleBookmark(activeSection.id)}
                  className={`p-2.5 rounded-xl transition-all shadow-sm border ${
                    bookmarkedIds.has(activeSection.id)
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50'
                      : 'bg-white dark:bg-zinc-950 text-slate-400 hover:text-blue-600 border-slate-200 dark:border-zinc-800'
                  }`}
                  title={bookmarkedIds.has(activeSection.id) ? "Remove Bookmark" : "Bookmark Section"}
                >
                  {bookmarkedIds.has(activeSection.id) ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-5 lg:p-8 space-y-8 bg-slate-50/50 dark:bg-zinc-950/20">
                {/* Bare Text */}
                <div className="space-y-4">
                  <h5 className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    <FileText size={14} /> Bare Act Text
                  </h5>
                  <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
                    <p className="text-sm md:text-base leading-relaxed text-slate-800 dark:text-zinc-200 font-serif whitespace-pre-wrap">
                      {activeSection.text}
                    </p>
                  </div>
                </div>

                {/* AI Insights Engine */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h5 className="flex items-center gap-2 text-[11px] font-bold text-blue-500 uppercase tracking-widest">
                      <Sparkles size={14} /> AI Context & Insights
                    </h5>
                    <div className="p-5 bg-blue-50/50 dark:bg-blue-950/10 rounded-2xl border border-blue-100 dark:border-blue-900/30 h-[calc(100%-2rem)]">
                      <p className="text-sm leading-relaxed text-slate-700 dark:text-zinc-300">
                        {activeSection.insights}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h5 className="flex items-center gap-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">
                      <ShieldAlert size={14} /> Key Ingredients
                    </h5>
                    <div className="p-5 bg-emerald-50/50 dark:bg-emerald-950/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 h-[calc(100%-2rem)]">
                      <ul className="space-y-2.5">
                        {activeSection.elements.map((el, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-zinc-300">
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                            <span className="leading-tight">{el}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Landmark Judgments */}
                <div className="space-y-4">
                  <h5 className="flex items-center gap-2 text-[11px] font-bold text-purple-600 dark:text-purple-500 uppercase tracking-widest">
                    <Scale size={14} /> Landmark Precedents
                  </h5>
                  <div className="grid grid-cols-1 gap-3">
                    {activeSection.judgments.map((judg, i) => (
                      <div key={i} className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm flex items-start gap-3">
                        <BrainCircuit size={16} className="text-purple-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-medium text-slate-700 dark:text-zinc-300 leading-relaxed">
                          {judg}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <Scale size={64} className="mb-4 opacity-20" />
              <p className="font-bold">Select a section to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};