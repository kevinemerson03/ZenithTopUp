import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, ShieldCheck, Headphones, TrendingUp, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GAMES, SUBSCRIPTIONS, BANNER_ITEMS } from '../constants';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'sonner';

export const Home: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const typeFilter = searchParams.get('type');
  const searchQuery = searchParams.get('q') || '';

  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % BANNER_ITEMS.length);
  }, [BANNER_ITEMS.length]);

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + BANNER_ITEMS.length) % BANNER_ITEMS.length);
  };

  const paginate = (newIndex: number) => {
    setDirection(newIndex > currentSlide ? 1 : -1);
    setCurrentSlide(newIndex);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

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
      {/* Hero Carousel */}
      <section className="relative h-[500px] md:h-[650px] overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-bg-main via-bg-main/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-black/40 z-[5]" />
            <img 
              src={BANNER_ITEMS[currentSlide].image} 
              alt="Featured" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="max-w-7xl mx-auto px-6 w-full">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="max-w-3xl"
                >
                  <div className={`inline-flex items-center gap-2 bg-brand/10 border border-brand/20 text-brand px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-8`}>
                    <TrendingUp size={14} />
                    <span>{t(BANNER_ITEMS[currentSlide].tagKey)}</span>
                  </div>
                  <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-[1.1] italic uppercase px-4 pb-4 overflow-visible">
                    {t(BANNER_ITEMS[currentSlide].titleKey).split(' ').slice(0, -1).join(' ')}<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-secondary inline-block pr-8">
                      {t(BANNER_ITEMS[currentSlide].titleKey).split(' ').slice(-1)}
                    </span>
                  </h1>
                  <p className="text-slate-300 text-base md:text-lg mb-10 leading-relaxed max-w-xl font-medium">
                    {t(BANNER_ITEMS[currentSlide].subtitleKey)}
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <button 
                      onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.delete('type');
                        setSearchParams(params);
                      }}
                      className="bg-brand hover:opacity-90 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-brand/40 active:scale-95 inline-block italic"
                    >
                      {t('home.all_products')}
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Controls */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
          {BANNER_ITEMS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => paginate(idx)}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                currentSlide === idx ? 'w-12 bg-brand' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-8 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-2xl bg-black/20 hover:bg-black/40 backdrop-blur-xl border border-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all hidden xl:flex"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-8 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-2xl bg-black/20 hover:bg-black/40 backdrop-blur-xl border border-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all hidden xl:flex"
        >
          <ChevronRight size={24} />
        </button>
      </section>

      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-30 pb-24">
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
          <div className="glass-card p-8 flex flex-col items-center text-center gap-4 border border-white/5">
            <div className="w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center text-brand border border-brand/20">
              <Zap size={32} />
            </div>
            <h4 className="text-lg font-bold text-white">{t('benefits.fast.title')}</h4>
            <p className="text-sm text-slate-500 leading-relaxed">{t('benefits.fast.desc')}</p>
          </div>

          <div className="glass-card p-8 flex flex-col items-center text-center gap-4 border border-white/5">
            <div className="w-16 h-16 rounded-2xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary border border-brand-secondary/20">
              <ShieldCheck size={32} />
            </div>
            <h4 className="text-lg font-bold text-white">{t('benefits.secure.title')}</h4>
            <p className="text-sm text-slate-500 leading-relaxed">{t('benefits.secure.desc')}</p>
          </div>

          <div className="glass-card p-8 flex flex-col items-center text-center gap-4 border border-white/5">
            <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20">
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
