import React, { useState } from 'react';
import { Twitter, Instagram, Mail, Phone, MapPin, ArrowRight, ShieldCheck, Zap, Globe, MessageSquare, LifeBuoy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Suggestions } from './Suggestions';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export const Footer: React.FC = () => {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const products = [
    { name: 'Mobile Legends', id: 'mlbb' },
    { name: 'Free Fire', id: 'ff' },
    { name: 'PUBG Mobile', id: 'pubgm' },
    { name: 'Genshin Impact', id: 'genshin' },
    { name: 'Valorant', id: 'valorant' },
    { name: 'Roblox', id: 'roblox' }
  ];

  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-24 pb-12 overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand/5 blur-[120px] rounded-full -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-secondary/5 blur-[120px] rounded-full translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center mb-8 group">
              <img 
                src="https://i.ibb.co.com/gZzdD7B3/d057742f-0196-4e90-b5ce-dcd59f053995.png" 
                alt="ZenithTopUp" 
                className="h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-10 max-w-sm font-medium">
              The ultimate premium digital top-up engine. Powering millions of transactions for gamers and digital enthusiasts worldwide with peak speed and absolute security.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://www.instagram.com/zenithtopup?igsh=MTFrc21idnJjb2RudQ==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-brand hover:border-brand transition-all group"
              >
                <Instagram size={20} className="group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-black italic uppercase tracking-[0.2em] mb-8 text-xs">Products</h4>
            <ul className="flex flex-col gap-4 text-xs font-bold uppercase tracking-widest text-white/30">
              {products.map((item) => (
                <li key={item.id}>
                  <Link to={`/topup/${item.id}`} className="hover:text-brand transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
              <li><Link to="/" className="hover:text-brand transition-colors italic opacity-50 underline decoration-brand/30">etc...</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-white font-black italic uppercase tracking-[0.2em] mb-8 text-xs">Company</h4>
            <ul className="flex flex-col gap-4 text-xs font-bold uppercase tracking-widest text-white/30">
              <li><Link to="/about" className="hover:text-brand transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-brand transition-colors">Careers</Link></li>
              <li><Link to="/faq" className="hover:text-brand transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-brand transition-colors">Contact</Link></li>
              <li><Link to="/partners" className="hover:text-brand transition-colors">{t('nav.partners')}</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-4">
            <h4 className="text-white font-black italic uppercase tracking-[0.2em] mb-8 text-xs">Stay with Zenith</h4>
            <div className="mt-8 flex flex-col gap-4">
              <button 
                onClick={() => setIsSuggestionsOpen(true)}
                className="w-full group flex items-start gap-5 bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 rounded-[2rem] p-8 transition-all active:scale-[0.98] border-dashed"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center text-brand group-hover:scale-110 transition-transform flex-shrink-0">
                  <MessageSquare size={28} />
                </div>
                <div className="text-left flex-grow">
                  <p className="text-xs font-black uppercase tracking-widest text-white mb-2">Community Engine</p>
                  <p className="text-[10px] font-medium text-white/40 leading-relaxed max-w-[200px]">
                    Suggest new games or products you want to see engine-supported next.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:text-brand transition-colors flex-shrink-0 self-center">
                  <ArrowRight size={18} />
                </div>
              </button>

              <Link 
                to="/support"
                className="w-full group flex items-start gap-5 bg-brand/5 hover:bg-brand/10 border border-brand/20 rounded-[2rem] p-8 transition-all active:scale-[0.98]"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand/20 flex items-center justify-center text-brand group-hover:scale-110 transition-transform flex-shrink-0">
                  <LifeBuoy size={28} />
                </div>
                <div className="text-left flex-grow">
                  <p className="text-xs font-black uppercase tracking-widest text-white mb-2">{isAdmin ? t('nav.admin') : t('nav.support')}</p>
                  <p className="text-[10px] font-medium text-white/40 leading-relaxed max-w-[200px]">
                    {isAdmin ? 'Access the admin console to prioritize and reply to secure transmissions.' : 'Need help? Chat privately with our secure support channel operatives.'}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:text-brand transition-colors flex-shrink-0 self-center">
                  <ArrowRight size={18} />
                </div>
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-6">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20">
                <ShieldCheck size={14} className="text-brand" /> Secure
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20">
                <Zap size={14} className="text-brand" /> Fast
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20">
                <Globe size={14} className="text-brand" /> Global
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
              © 2026 ZENITH TOPUP ENGINE. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-white/20">
              <Link to="/legal?section=privacy" className="hover:text-white transition-colors">{t('legal.privacy')}</Link>
              <Link to="/legal?section=terms" className="hover:text-white transition-colors">{t('legal.terms')}</Link>
              <Link to="/legal?section=cookies" className="hover:text-white transition-colors">{t('legal.cookies')}</Link>
            </div>
          </div>
        </div>
      </div>
      <Suggestions isOpen={isSuggestionsOpen} onClose={() => setIsSuggestionsOpen(false)} />
    </footer>
  );
};
