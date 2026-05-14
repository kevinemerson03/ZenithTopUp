import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, FileText, Cookie, ChevronLeft, Lock, Gavel, Eye } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export const LegalPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const section = searchParams.get('section') || 'privacy';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [section]);

  const sections = [
    { id: 'privacy', icon: Eye, label: t('legal.privacy') },
    { id: 'terms', icon: Gavel, label: t('legal.terms') },
    { id: 'cookies', icon: Cookie, label: t('legal.cookies') },
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-12 text-sm font-black uppercase tracking-widest italic"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="mb-16">
          <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/20 text-brand px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 italic">
            <Shield size={14} />
            ZENITH DATA PROTECTION
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white mb-6">
            {t('legal.title')}
          </h1>
          <p className="text-slate-400 text-lg font-medium">
            {t('legal.subtitle')}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mb-12">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => navigate(`/legal?section=${s.id}`)}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black italic uppercase tracking-tighter transition-all ${
                section === s.id 
                  ? 'bg-brand text-white scale-105 shadow-[0_0_30px_rgba(0,183,126,0.3)]' 
                  : 'bg-white/5 text-white/40 hover:bg-white/10'
              }`}
            >
              <s.icon size={18} />
              {s.label}
            </button>
          ))}
        </div>

        <motion.div 
          key={section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-12"
        >
          {section === 'privacy' && (
            <div className="prose prose-invert prose-slate max-w-none">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-8 border-b border-white/10 pb-4">Privacy Policy</h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>
              <div className="space-y-12">
                <section>
                  <h3 className="text-xl font-black italic uppercase tracking-tight text-brand mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                    1. Data Collection
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    At Zenith, we prioritize the precision and security of your data. We collect essential information to process your top-ups, including game IDs, email addresses, and transaction details. We do not store sensitive payment information; all transactions are routed through high-security encrypted gateways.
                  </p>
                </section>
                <section>
                  <h3 className="text-xl font-black italic uppercase tracking-tight text-brand mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                    2. Usage of Information
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    Your data fuels our automated engine. We use it to ensure instant delivery to the correct game accounts, provide 24/7 localized support, and analyze platform performance to maintain Zenith speed. We never sell your personal information to third parties.
                  </p>
                </section>
                <section>
                  <h3 className="text-xl font-black italic uppercase tracking-tight text-brand mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                    3. Data Security
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    Zenith employs military-grade encryption and secure socket layers (SSL) for all data transmissions. Our internal security protocols are audited regularly to prevent unauthorized access and ensure your digital goods remain protected.
                  </p>
                </section>
              </div>
            </div>
          )}

          {section === 'terms' && (
            <div className="prose prose-invert prose-slate max-w-none">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-8 border-b border-white/10 pb-4">Terms of Service</h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                Effective Date: {new Date().toLocaleDateString()}
              </p>
              <div className="space-y-12">
                <section>
                  <h3 className="text-xl font-black italic uppercase tracking-tight text-brand mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                    1. Acceptance
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    By accessing Zenith, you enter into a binding agreement with the most advanced digital goods engine. You agree to use our services only for lawful purposes related to game and subscription top-ups.
                  </p>
                </section>
                <section>
                  <h3 className="text-xl font-black italic uppercase tracking-tight text-brand mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                    2. User Responsibilities
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    Precision is mandatory. You are responsible for ensuring the accuracy of the Game IDs and account details provided. Zenith is not liable for items delivered to incorrect accounts due to user input errors. Always double-verify before committing to a transaction.
                  </p>
                </section>
                <section>
                  <h3 className="text-xl font-black italic uppercase tracking-tight text-brand mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                    3. Refunds and Exchanges
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    Due to the instant and permanent nature of digital top-ups, all sales are final. Refunds are only issued in the rare event of a total engine failure where items cannot be delivered within our 24-hour service guarantee.
                  </p>
                </section>
              </div>
            </div>
          )}

          {section === 'cookies' && (
            <div className="prose prose-invert prose-slate max-w-none">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-8 border-b border-white/10 pb-4">Cookie Policy</h2>
              <div className="space-y-12">
                <section>
                  <h3 className="text-xl font-black italic uppercase tracking-tight text-brand mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                    What are Cookies?
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    Cookies are small data packets that Zenith uses to remember your preferences and speed up your experience. They help us track your cart, maintain your login session, and remember your language choices.
                  </p>
                </section>
                <section>
                  <h3 className="text-xl font-black italic uppercase tracking-tight text-brand mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                    How We Use Them
                  </h3>
                  <ul className="list-none space-y-4 text-slate-300">
                    <li className="flex gap-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded bg-brand/10 border border-brand/20 flex items-center justify-center text-brand text-[10px] font-black">ESS</div>
                      <p><span className="text-white font-bold">Essential:</span> Required for security and core functionality (cart, login).</p>
                    </li>
                    <li className="flex gap-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded bg-brand/10 border border-brand/20 flex items-center justify-center text-brand text-[10px] font-black">ANA</div>
                      <p><span className="text-white font-bold">Analytics:</span> Helps us understand platform load and delivery speeds.</p>
                    </li>
                    <li className="flex gap-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded bg-brand/10 border border-brand/20 flex items-center justify-center text-brand text-[10px] font-black">PRE</div>
                      <p><span className="text-white font-bold">Preferences:</span> Remembers your theme and language settings.</p>
                    </li>
                  </ul>
                </section>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
