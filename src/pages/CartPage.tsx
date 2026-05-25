import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Trash2, ArrowRight, Zap, ChevronLeft, CheckCircle2, ShieldCheck, CreditCard, Wallet, Landmark, QrCode } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { formatCurrency } from '../lib/utils';
import { PAYMENT_METHODS } from '../constants/paymentMethods';
import { toast } from 'sonner';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const { t } = useLanguage();
  const { user, addTransaction } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const selectedCartItems = cart.filter(item => selectedItems.has(item.id));
  const selectedTotal = selectedCartItems.reduce((sum, item) => sum + item.price, 0);

  const toggleItem = (id: string) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedItems.size === cart.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cart.map(item => item.id)));
    }
  };

  const handleCheckoutSelected = async () => {
    if (selectedCartItems.length === 0) return;
    if (!selectedPayment) {
      toast.error('Please select a payment method.');
      return;
    }

    if (!user) {
      toast.error('Please sign in to complete your checkout.');
      navigate('/login');
      return;
    }

    setIsProcessing(true);
    
    // Process selected items in cart
    try {
      for (const item of selectedCartItems) {
        await addTransaction({
          productId: item.productId,
          productName: item.productName,
          amount: item.amount,
          price: item.price,
          status: 'completed',
          date: new Date().toISOString()
        });
      }
      
      setIsProcessing(false);
      setShowSuccess(true);
      
      // Remove only processed items from cart
      for (const item of selectedCartItems) {
        await removeFromCart(item.id);
      }
      setSelectedItems(new Set());
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Checkout failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="pt-32 pb-32 min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/20 hover:text-brand transition-colors mb-4 group"
            >
              <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              {t('cart.back')}
            </button>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.85] pr-8 pb-2">
              {t('cart.velocity_cart').split(' ').slice(0, -1).join(' ')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-secondary pr-8">{t('cart.velocity_cart').split(' ').slice(-1)}</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4">
            <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
              <ShoppingCart size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{t('cart.total_items')}</p>
              <p className="text-xl font-black italic tracking-tighter">{cart.length} {t('cart.packages')}</p>
            </div>
          </div>
        </div>

        {cart.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-20 flex flex-col items-center justify-center text-center gap-8"
          >
            <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center text-slate-800">
              <ShoppingCart size={64} />
            </div>
            <div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4 pr-6">{t('cart.empty_title')}</h2>
              <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                {t('cart.empty_desc')}
              </p>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-brand to-brand-secondary hover:opacity-90 text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] italic transition-all shadow-2xl shadow-brand/20 active:scale-95"
            >
              {t('cart.explore')}
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Items */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between px-4 mb-4">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={toggleAll}
                    className="flex items-center gap-2 group"
                  >
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      selectedItems.size === cart.length && cart.length > 0
                        ? 'bg-brand border-brand text-white' 
                        : 'border-white/20 text-transparent group-hover:border-white/40'
                    }`}>
                      <CheckCircle2 size={12} strokeWidth={4} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
                      {selectedItems.size === cart.length ? 'Deselect All' : 'Select All'}
                    </span>
                  </button>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/20 italic">{t('cart.items_queue')}</h3>
                </div>
                <button 
                  onClick={clearCart}
                  className="text-[10px] font-black uppercase tracking-widest text-red-500/40 hover:text-red-500 transition-colors"
                >
                  {t('cart.clear_all')}
                </button>
              </div>
              
              <div className="space-y-4">
                {cart.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => toggleItem(item.id)}
                    className={`glass-card p-6 flex flex-col sm:flex-row items-center gap-8 group transition-all cursor-pointer ${
                      selectedItems.has(item.id) 
                        ? 'border-brand/40 bg-brand/5 shadow-[0_0_40px_-10px_rgba(37,99,235,0.1)]' 
                        : 'hover:border-white/20'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                        selectedItems.has(item.id)
                          ? 'bg-brand border-brand text-white' 
                          : 'border-white/10 text-transparent group-hover:border-white/20'
                      }`}>
                        <CheckCircle2 size={14} strokeWidth={4} />
                      </div>
                    </div>

                    <div className="w-24 h-32 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 shadow-2xl">
                      <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    
                    <div className="flex-grow text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h4 className="text-2xl font-black italic uppercase tracking-tighter text-white group-hover:text-brand transition-colors pr-6">
                          {item.productName}
                        </h4>
                        <span className="hidden sm:block text-white/10">/</span>
                        <span className="text-brand font-black italic uppercase tracking-tighter text-sm">{item.amount}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:flex sm:items-center gap-6 mt-4">
                        <div>
                          <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">{t('topup.user_id')}</p>
                          <p className="text-xs font-mono text-white/60">{item.userId}</p>
                        </div>
                        {item.zoneId && (
                          <div>
                            <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">{t('topup.zone_id')}</p>
                            <p className="text-xs font-mono text-white/60">{item.zoneId}</p>
                          </div>
                        )}
                        <div className="sm:ml-auto text-right">
                          <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">{t('topup.price')}</p>
                          <p className="text-xl font-black italic tracking-tighter text-white">{formatCurrency(item.price)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromCart(item.id);
                      }}
                      className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-600 hover:text-red-500 hover:bg-red-500/10 transition-all border border-white/5"
                    >
                      <Trash2 size={20} />
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Benefits Banner */}
              <div className="mt-12 p-8 rounded-[2rem] bg-brand/5 border border-brand/20 flex flex-col md:flex-row items-center gap-8">
                <div className="w-16 h-16 rounded-2xl bg-brand flex items-center justify-center text-white shadow-xl shadow-brand/20">
                  <Zap size={32} />
                </div>
                <div className="flex-grow text-center md:text-left">
                  <h4 className="text-xl font-black italic uppercase tracking-tighter text-white mb-1">{t('cart.bulk_title')}</h4>
                  <p className="text-sm text-white/40 leading-relaxed font-medium">
                    {t('cart.bulk_desc')}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Checkout */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-6">
                {/* Payment Selection */}
                <section className="glass-card p-8 bg-white/[0.02]">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 italic mb-6">{t('topup.payment_method')}</h3>
                  <div className="flex flex-col gap-3">
                    {PAYMENT_METHODS.map((pm) => (
                      <button 
                        key={pm.id}
                        onClick={() => setSelectedPayment(pm.id)}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                          selectedPayment === pm.id 
                            ? 'bg-brand/10 border-brand text-white' 
                            : 'bg-black/20 border-white/5 text-white/40 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {pm.icon}
                          <span className="text-xs font-black uppercase tracking-widest italic">{pm.name}</span>
                        </div>
                        {selectedPayment === pm.id && <CheckCircle2 size={14} className="text-brand" />}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Summary */}
                <section className="glass-card p-8 bg-white/[0.02] relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-brand" />
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 italic mb-8">{t('cart.order_summary')}</h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-bold text-white/30 uppercase tracking-widest">{t('cart.subtotal')}</p>
                      <p className="text-sm font-black italic text-white">{formatCurrency(selectedTotal)}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-bold text-white/30 uppercase tracking-widest">Selected Items</p>
                      <p className="text-sm font-black italic text-brand">{selectedItems.size} {t('cart.packages')}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-bold text-white/30 uppercase tracking-widest">{t('cart.admin_fee')}</p>
                      <p className="text-sm font-black italic text-white">Rp 0</p>
                    </div>
                    <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                      <div>
                        <p className="text-[10px] font-black text-brand uppercase tracking-[0.2em] mb-1">{t('topup.total')}</p>
                        <p className="text-4xl font-black italic tracking-tighter text-white">{formatCurrency(selectedTotal)}</p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleCheckoutSelected}
                    disabled={isProcessing || !selectedPayment || selectedItems.size === 0}
                    className="w-full bg-gradient-to-r from-brand to-brand-secondary hover:opacity-90 disabled:opacity-20 disabled:cursor-not-allowed text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] italic transition-all shadow-2xl shadow-brand/20 flex items-center justify-center gap-3 group"
                  >
                    {isProcessing ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Checkout ({selectedItems.size})</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                  
                  <div className="mt-6 flex items-center justify-center gap-4">
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-white/20">
                      <ShieldCheck size={12} className="text-brand" /> {t('cart.encrypted')}
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-white/20">
                      <Zap size={12} className="text-brand" /> {t('cart.instant')}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#141414] border border-white/10 rounded-[3rem] p-12 max-w-lg w-full text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-brand" />
              <div className="w-24 h-24 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand mx-auto mb-8">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-4xl font-black italic uppercase tracking-tighter mb-4 pr-6">{t('cart.success_title')}</h3>
              <p className="text-white/40 text-lg mb-10 leading-relaxed font-medium">
                {t('cart.success_desc')}
              </p>
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => navigate('/history')}
                  className="w-full bg-white text-black py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-brand hover:text-white transition-all shadow-xl"
                >
                  {t('topup.view_history')}
                </button>
                <button 
                  onClick={() => setShowSuccess(false)}
                  className="w-full bg-white/5 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  {t('cart.back')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
