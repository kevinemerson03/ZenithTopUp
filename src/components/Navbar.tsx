import React, { useState, useEffect } from 'react';
import { Search, User as UserIcon, LogIn, Menu, X, Bell, History, Settings, LogOut, ShoppingCart, Zap, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { User } from '../types';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

export const Navbar: React.FC = () => {
  const { cart } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const { user, loading, history: txHistory } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const then = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return then.toLocaleDateString();
  };

  const notifications = txHistory
    .filter(tx => tx.status === 'completed')
    .slice(0, 5)
    .map(tx => ({
      id: tx.id,
      title: 'Top Up Successful',
      message: `Your ${tx.productName} (${tx.amount}) top-up was processed.`,
      time: formatRelativeTime(tx.date),
      type: 'success' as const
    }));

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      // Close open dropdowns on scroll to prevent "stuck" UI
      setIsNotificationsOpen(false);
      setIsProfileOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const search = new URLSearchParams(location.search).get('q');
    if (search) setSearchQuery(search);
    else setSearchQuery('');
  }, [location.search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    const params = new URLSearchParams(location.search);
    if (value) {
      params.set('q', value);
    } else {
      params.delete('q');
    }
    
    navigate(`/?${params.toString()}`, { replace: true });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsProfileOpen(false);
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 transition-[box-shadow] duration-300 ease-in-out bg-slate-950/98 backdrop-blur-md border-b border-white/10 shadow-xl shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between py-4 transition-all duration-300">
        <div className="flex items-center gap-16">
          <Link to="/" className="flex items-center group" onClick={() => setIsMenuOpen(false)}>
            <img 
              src="https://i.ibb.co.com/gZzdD7B3/d057742f-0196-4e90-b5ce-dcd59f053995.png" 
              alt="ZenithTopUp" 
              className="h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden flex flex-col">
              <span className="text-2xl font-black tracking-tighter text-white uppercase leading-none italic">ZENITH</span>
              <span className="text-[8px] font-black tracking-[0.4em] text-brand uppercase leading-none mt-1">TopUp</span>
            </div>
          </Link>
          
          <div className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
            <Link to="/?type=games" className="hover:text-white transition-all hover:tracking-[0.3em]">{t('home.games')}</Link>
            <Link to="/?type=subscriptions" className="hover:text-white transition-all hover:tracking-[0.3em]">{t('home.subscriptions')}</Link>
            <Link to="/support" className="hover:text-white transition-all hover:tracking-[0.3em]">{t('nav.support')}</Link>
          </div>
        </div>

        <div className="flex items-center gap-4 lg:gap-8">
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="relative">
              <button 
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                }}
                className={`hidden sm:flex w-11 h-11 rounded-2xl bg-white/[0.03] border border-white/5 items-center justify-center transition-all relative ${
                  isNotificationsOpen ? 'text-brand border-brand/50 bg-brand/10' : 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <div className="absolute top-3 right-3 w-2 h-2 bg-brand rounded-full border-2 border-slate-950" />
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-80 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl z-[60]"
                  >
                    <div className="p-5 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                      <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black italic">{t('nav.notifications')}</p>
                      {notifications.length > 0 && (
                        <span className="text-[8px] font-black text-brand uppercase tracking-widest bg-brand/10 px-2 py-0.5 rounded">{notifications.length} {t('nav.new')}</span>
                      )}
                    </div>
                    <div className="p-2 max-h-[400px] overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <button key={notif.id} className="w-full text-left p-4 rounded-2xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5 mb-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-[11px] font-black text-white uppercase italic tracking-tighter group-hover:text-brand transition-colors">{notif.title}</p>
                              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{notif.time}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-relaxed">{notif.message}</p>
                          </button>
                        ))
                      ) : (
                        <div className="p-10 text-center">
                          <Bell size={24} className="text-white/10 mx-auto mb-3" />
                          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">No notifications yet</p>
                        </div>
                      )}
                    </div>
                    <div className="p-4 border-t border-white/5 bg-white/[0.01]">
                      <button 
                        onClick={() => {
                          setIsNotificationsOpen(false);
                          navigate('/history');
                        }}
                        className="w-full py-3 text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-white transition-colors italic"
                      >
                        {t('nav.view_all')}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button 
              onClick={() => navigate('/cart')}
              className={`w-11 h-11 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center transition-all relative ${
                location.pathname === '/cart' ? 'text-brand border-brand/50 bg-brand/10' : 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-brand rounded-full flex items-center justify-center text-[10px] font-black text-white border-2 border-slate-950"
                >
                  {cart.length}
                </motion.div>
              )}
            </button>
          </div>

          <div className="h-8 w-px bg-white/10 hidden sm:block" />

          {loading ? (
            <div className="w-10 h-10 rounded-xl bg-white/5 animate-pulse" />
          ) : user ? (
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 rounded-2xl p-1.5 pr-5 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center text-white font-black italic shadow-lg shadow-brand/20 group-hover:scale-105 transition-transform uppercase">
                  {user.name ? user.name.charAt(0) : user.email.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-black text-white uppercase italic tracking-tighter leading-none mb-1">
                    {user.name || 'Account'}
                  </p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">Zenith Member</p>
                </div>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-72 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl z-[60]"
                  >
                    <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                      <p className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-black mb-2 italic">Authenticated as</p>
                      <p className="text-sm text-white font-black italic uppercase tracking-tighter truncate">{user.email}</p>
                    </div>
                    <div className="p-3">
                      <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-4 px-5 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                        <UserIcon size={18} className="text-brand" /> My Profile
                      </Link>
                      <Link to="/history" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-4 px-5 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                        <History size={18} className="text-brand" /> History
                      </Link>
                      <div className="h-px bg-white/5 my-3 mx-3" />
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-5 py-4 text-[11px] font-black uppercase tracking-widest text-red-400 hover:bg-red-400/10 rounded-2xl transition-all"
                      >
                        <LogOut size={18} /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="bg-brand hover:bg-brand-light text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-2xl shadow-brand/30 active:scale-95 italic"
            >
              Sign In
            </button>
          )}

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-slate-400 p-2 hover:text-white transition-colors"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
    </nav>

    {/* Floating Cart Button (Always Visible) */}
    <AnimatePresence>
      {location.pathname !== '/cart' && cart.length > 0 && (
        <motion.button
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0, y: 20 }}
          onClick={() => navigate('/cart')}
          className="fixed bottom-8 left-8 z-[100] w-16 h-16 rounded-full bg-brand text-white shadow-2xl shadow-brand/40 flex items-center justify-center group active:scale-90 transition-transform"
        >
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-[11px] font-black text-brand border-2 border-brand">
            {cart.length}
          </div>
          <ShoppingCart size={28} className="group-hover:scale-110 transition-transform" />
          
          {/* Pulsing Ring */}
          <div className="absolute inset-0 rounded-full bg-brand animate-ping opacity-20 -z-10" />
        </motion.button>
      )}
    </AnimatePresence>

    {/* Mobile Menu */}
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[110] lg:hidden bg-slate-950/95 backdrop-blur-3xl"
        >
          <div className="p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center">
                <img 
                  src="https://i.ibb.co.com/gZzdD7B3/d057742f-0196-4e90-b5ce-dcd59f053995.png" 
                  alt="ZenithTopUp" 
                  className="h-14 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="text-slate-400 p-2">
                <X size={32} />
              </button>
            </div>

            <div className="flex flex-col gap-8">
              <Link to="/?type=games" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black italic uppercase tracking-tighter text-white/40 hover:text-brand transition-all">{t('home.games')}</Link>
              <Link to="/?type=subscriptions" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black italic uppercase tracking-tighter text-white/40 hover:text-brand transition-all">{t('home.subscriptions')}</Link>
              {user && (
                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black italic uppercase tracking-tighter text-white/40 hover:text-emerald-500 transition-all">My Profile</Link>
              )}
              <Link to="/support" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black italic uppercase tracking-tighter text-white/40 hover:text-brand transition-all">Support</Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black italic uppercase tracking-tighter text-white/40 hover:text-brand transition-all">About</Link>
            </div>

            <div className="mt-auto pt-12 border-t border-white/10">
              {!user ? (
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/login');
                  }}
                  className="w-full bg-brand text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] italic shadow-2xl shadow-brand/20"
                >
                  Sign In to Zenith
                </button>
              ) : (
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5">
                  <div className="w-12 h-12 rounded-xl bg-brand flex items-center justify-center text-white font-black italic text-xl uppercase">
                    {user.name ? user.name.charAt(0) : user.email.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-black italic uppercase tracking-tighter text-white">
                      {user.name || 'Account'}
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Zenith Member</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </>
  );
};
