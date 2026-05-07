import React from 'react';
import { motion } from 'motion/react';
import { Zap, ShieldCheck, Headphones, TrendingUp, Search, X } from 'lucide-react';
import { GAMES, SUBSCRIPTIONS } from '../constants';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'sonner';

export const Home: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const typeFilter = searchParams.get('type');
  const searchQuery = searchParams.get('q') || '';

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('q', value);
    } else {
      params.delete('q');
    }
    setSearchParams(params, { replace: true });
  };

  const allProducts = [...GAMES, ...SUBSCRIPTIONS];
  
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.publisher.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (typeFilter === 'games') {
      return matchesSearch && GAMES.some(g => g.id === product.id);
    }
    if (typeFilter === 'subscriptions') {
      return matchesSearch && SUBSCRIPTIONS.some(s => s.id === product.id);
    }
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-bg-main text-slate-200">
      {/* Hero Slider */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-bg-main via-bg-main/20 to-transparent z-10" />
        <img 
          src="https://picsum.photos/seed/gaming-banner/1920/1080" 
          alt="Featured" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 z-20 flex items-center pt-24 md:pt-0">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/20 text-brand px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                <TrendingUp size={14} />
                <span>{t('hero.featured')}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-[0.9]">
                {t('hero.title').split(' ').slice(0, -1).join(' ')}<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-secondary">{t('hero.title').split(' ').slice(-1)}</span>
              </h1>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed max-w-lg">
                {t('hero.subtitle')}
              </p>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.delete('type');
                    setSearchParams(params);
                  }}
                  className="bg-gradient-to-r from-brand to-brand-secondary hover:opacity-90 text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all shadow-xl shadow-brand/20 active:scale-95 inline-block"
                >
                  {t('home.all_products')}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-30 pb-24">
        {/* Search Bar */}
        <div className="glass-card p-4 mb-12 flex items-center gap-4">
          <div className="flex-grow flex items-center bg-slate-950/50 border border-white/5 rounded-2xl px-4 py-3 gap-3 w-full focus-within:border-brand/50 transition-all relative">
            <Search size={20} className="text-slate-500" />
            <input 
              type="text" 
              placeholder={t('home.search_placeholder')}
              value={searchQuery}
              onChange={handleSearch}
              className="bg-transparent border-none outline-none text-sm text-white placeholder:text-slate-600 w-full"
            />
            {searchQuery && (
              <button 
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.delete('q');
                  setSearchParams(params, { replace: true });
                }}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-8 bg-brand rounded-full" />
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">
              {typeFilter === 'games' 
                ? t('home.games') 
                : typeFilter === 'subscriptions' 
                  ? t('home.subscriptions') 
                  : t('home.all_products')}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredProducts.map((item, idx) => (
            <Link 
              key={item.id}
              to={`/topup/${item.id}`}
              className="group flex flex-col gap-3"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.03 }}
              >
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/5 bg-slate-900 shadow-lg group-hover:shadow-brand/10 group-hover:border-brand/30 transition-all duration-300">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                  
                  {item.promoLabel && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest shadow-xl">
                      {item.promoLabel}
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="bg-brand/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg inline-block mb-2">
                      {t('product.instant')}
                    </div>
                  </div>
                </div>
                <div className="px-1 mt-3">
                  <h3 className="text-sm font-bold text-white group-hover:text-brand transition-colors truncate">{item.name}</h3>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">{item.publisher}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
            <Search size={48} className="text-slate-700 mx-auto mb-6" />
            <p className="text-slate-400 font-black uppercase tracking-widest italic">{t('home.no_results')}</p>
          </div>
        )}

        {/* Benefits Section */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 flex flex-col items-center text-center gap-4 group hover:border-brand/30 transition-all">
            <div className="w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center text-brand border border-brand/20 group-hover:scale-110 transition-transform">
              <Zap size={32} />
            </div>
            <h4 className="text-lg font-bold text-white">{t('benefits.fast.title')}</h4>
            <p className="text-sm text-slate-500 leading-relaxed">{t('benefits.fast.desc')}</p>
          </div>

          <div className="glass-card p-8 flex flex-col items-center text-center gap-4 group hover:border-blue-500/30 transition-all">
            <div className="w-16 h-16 rounded-2xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary border border-brand-secondary/20 group-hover:scale-110 transition-transform">
              <ShieldCheck size={32} />
            </div>
            <h4 className="text-lg font-bold text-white">{t('benefits.secure.title')}</h4>
            <p className="text-sm text-slate-500 leading-relaxed">{t('benefits.secure.desc')}</p>
          </div>

          <div className="glass-card p-8 flex flex-col items-center text-center gap-4 group hover:border-green-500/30 transition-all">
            <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20 group-hover:scale-110 transition-transform">
              <Headphones size={32} />
            </div>
            <h4 className="text-lg font-bold text-white">{t('benefits.support.title')}</h4>
            <p className="text-sm text-slate-500 leading-relaxed">{t('benefits.support.desc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
