import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ShieldCheck, Zap, Info, CheckCircle2, CreditCard, Wallet, Landmark, QrCode, ArrowLeft } from 'lucide-react';
import { GAMES, SUBSCRIPTIONS } from '../constants';
import { Product, Transaction, CartItem } from '../types';
import { PAYMENT_METHODS } from '../constants/paymentMethods';
import { store } from '../lib/store';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency } from '../lib/utils';
import { toast } from 'sonner';

export const TopUpPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const { user, addTransaction } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [userId, setUserId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [selectedDenom, setSelectedDenom] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const allProducts = [...GAMES, ...SUBSCRIPTIONS];
    const found = allProducts.find(p => p.id === id);
    if (found) {
      setProduct(found);
    } else {
      navigate('/');
    }
  }, [id, navigate]);

  if (!product) return null;

  const handleCheckout = async () => {
    if (!userId || !selectedDenom || !selectedPayment) {
      toast.error('Please complete all steps before checking out.');
      return;
    }

    if (!user) {
      toast.error('Please sign in to complete your purchase.');
      navigate('/login');
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(async () => {
      const denom = product.denominations.find(d => d.id === selectedDenom);
      if (denom) {
        await addTransaction({
          productId: product.id,
          productName: product.name,
          amount: denom.amount,
          price: denom.price,
          status: 'completed',
          date: new Date().toISOString(),
          targetId: userId
        });
        setIsProcessing(false);
        setShowSuccess(true);
      }
    }, 2000);
  };

  const handleAddToCart = () => {
    if (!userId || !selectedDenom) {
      toast.error(product?.category === 'subscription' ? 'Please enter your Email Address and select an amount.' : 'Please enter your User ID and select an amount.');
      return;
    }

    const denom = product?.denominations.find(d => d.id === selectedDenom);
    if (product && denom) {
      const cartItem: CartItem = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        denomId: denom.id,
        amount: denom.amount,
        price: denom.price,
        userId: userId,
        zoneId: zoneId
      };
      addToCart(cartItem);
    }
  };

  const selectedDenomData = product.denominations.find(d => d.id === selectedDenom);

  return (
    <div className="pt-24 pb-32 min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button & Breadcrumbs */}
        <div className="flex flex-col gap-6 mb-12">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-white/40 hover:text-brand transition-all group w-fit"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            {t('topup.back')}
          </button>
          
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/10">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={10} />
            <span className="text-white/20">{product.category === 'game' ? 'Games' : 'Subscriptions'}</span>
            <ChevronRight size={10} />
            <span className="text-brand">{product.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Product Info */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative aspect-[3/4] rounded-[2rem] overflow-hidden border border-white/10 mb-8 group"
              >
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80" />
                
                {/* Product Badge */}
                <div className="absolute top-6 left-6 px-4 py-2 bg-gradient-to-r from-brand to-brand-secondary rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-brand/20">
                  {t('topup.official_partner')}
                </div>

                {product.promoLabel && (
                  <div className="absolute top-6 right-6 px-4 py-2 bg-red-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-red-500/20">
                    {product.promoLabel}
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-2 leading-[0.85]">{product.name}</h1>
                <p className="text-brand font-bold text-sm uppercase tracking-[0.3em] mb-8">{product.publisher}</p>
                
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:bg-white/[0.04] transition-colors group">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Zap size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase tracking-tighter italic mb-1">{t('topup.instant_delivery')}</p>
                        <p className="text-xs text-white/40 leading-relaxed font-medium">{t('topup.instant_desc')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:bg-white/[0.04] transition-colors group">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 flex-shrink-0 group-hover:scale-110 transition-transform">
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase tracking-tighter italic mb-1">{t('topup.secure_transaction')}</p>
                        <p className="text-xs text-white/40 leading-relaxed font-medium">{t('topup.secure_desc')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Middle Column: Steps */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {/* Step 1: User ID */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/10 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-brand/10 transition-colors" />
              
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white font-black italic text-lg">01</div>
                <div>
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter">{t('topup.account_details')}</h2>
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{t('topup.credentials_desc')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">
                    {product.category === 'subscription' ? 'Email Address' : t('topup.user_id')}
                  </label>
                  <input 
                    type={product.category === 'subscription' ? 'email' : 'text'}
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder={product.category === 'subscription' ? 'e.g. user@example.com' : 'e.g. 12345678'}
                    className="bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all font-mono"
                  />
                </div>
                {product.id === 'mlbb' && (
                  <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">{t('topup.zone_id')}</label>
                    <input 
                      type="text" 
                      value={zoneId}
                      onChange={(e) => setZoneId(e.target.value)}
                      placeholder="e.g. 1234"
                      className="bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all font-mono"
                    />
                  </div>
                )}
              </div>
              
              <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
                <Info size={16} className="text-brand flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-white/40 leading-relaxed font-medium">
                  {product.category === 'subscription' 
                    ? 'Please enter the email address linked to your service account. The subscription will be activated on this email.' 
                    : t('topup.id_help')}
                </p>
              </div>
            </motion.section>

            {/* Step 2: Denominations */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/10 relative overflow-hidden"
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white font-black italic text-lg">02</div>
                <div>
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter">{t('topup.select_amount')}</h2>
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{t('topup.package_desc')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {product.denominations.map((denom) => (
                  <button 
                    key={denom.id}
                    onClick={() => setSelectedDenom(denom.id)}
                    className={`relative p-5 rounded-2xl border transition-all text-left group overflow-hidden ${
                      selectedDenom === denom.id 
                        ? 'bg-brand border-brand text-white shadow-xl shadow-brand/20' 
                        : 'bg-black/20 border-white/10 hover:border-white/30 text-white/60'
                    }`}
                  >
                    <div className="relative z-10">
                      <p className="text-base font-black italic uppercase tracking-tighter mb-1">{denom.amount}</p>
                      <p className={`text-xs font-bold font-mono ${selectedDenom === denom.id ? 'text-white/80' : 'text-white/40'}`}>
                        {formatCurrency(denom.price)}
                      </p>
                      {denom.bonus && (
                        <div className={`mt-3 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full inline-block ${
                          selectedDenom === denom.id ? 'bg-white text-brand' : 'bg-brand/20 text-brand'
                        }`}>
                          {denom.bonus}
                        </div>
                      )}
                    </div>
                    
                    {selectedDenom === denom.id && (
                      <motion.div 
                        layoutId="activeDenom"
                        className="absolute inset-0 bg-gradient-to-br from-brand to-brand-secondary"
                      />
                    )}
                    
                    {selectedDenom === denom.id && (
                      <div className="absolute top-4 right-4 z-10">
                        <CheckCircle2 size={18} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.section>

            {/* Step 3: Payment (Mobile Only) */}
            <div className="lg:hidden">
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/10 relative overflow-hidden"
              >
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white font-black italic text-lg">03</div>
                  <div>
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">
                      {t('topup.payment_method')} 
                      <span className="text-[10px] text-brand/50 ml-3 opacity-60">Optional for Cart</span>
                    </h2>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{t('topup.gateway_desc')}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {PAYMENT_METHODS.map((pm) => (
                    <button 
                      key={pm.id}
                      onClick={() => setSelectedPayment(pm.id)}
                      className={`flex items-center justify-between p-5 rounded-2xl border transition-all group ${
                        selectedPayment === pm.id 
                          ? 'bg-white/10 border-brand shadow-xl shadow-brand/5' 
                          : 'bg-black/20 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                          selectedPayment === pm.id ? 'bg-brand text-white' : 'bg-white/5 text-white/40 group-hover:text-white'
                        }`}>
                          {pm.icon}
                        </div>
                        <div className="text-left">
                          <p className="text-base font-black italic uppercase tracking-tighter">{pm.name}</p>
                          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{pm.type}</p>
                        </div>
                      </div>
                      {selectedPayment === pm.id && (
                        <div className="w-6 h-6 rounded-full bg-brand flex items-center justify-center text-white">
                          <CheckCircle2 size={14} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </motion.section>
            </div>
          </div>

          {/* Right Column: Payment & Order Summary (Desktop) */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 flex flex-col gap-6">
              {/* Step 3: Payment (Desktop) */}
              <motion.section 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/10 relative overflow-hidden"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white font-black italic text-sm">03</div>
                  <h2 className="text-lg font-black italic uppercase tracking-tighter">
                    {t('topup.payment_method')}
                    <span className="text-[9px] text-brand/50 ml-2 opacity-60 lowercase">optional for cart</span>
                  </h2>
                </div>

                <div className="flex flex-col gap-2">
                  {PAYMENT_METHODS.map((pm) => (
                    <button 
                      key={pm.id}
                      onClick={() => setSelectedPayment(pm.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all group ${
                        selectedPayment === pm.id 
                          ? 'bg-white/10 border-brand' 
                          : 'bg-black/20 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          selectedPayment === pm.id ? 'bg-brand text-white' : 'bg-white/5 text-white/40'
                        }`}>
                          {pm.icon}
                        </div>
                        <span className="text-xs font-black italic uppercase tracking-tighter">{pm.name}</span>
                      </div>
                      {selectedPayment === pm.id && <CheckCircle2 size={12} className="text-brand" />}
                    </button>
                  ))}
                </div>
              </motion.section>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/10 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand to-brand-secondary" />
                <h2 className="text-lg font-black italic uppercase tracking-tighter mb-6">{t('topup.summary')}</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{t('topup.product')}</p>
                    <p className="text-xs font-black italic uppercase tracking-tighter">{product.name}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{t('topup.package')}</p>
                    <p className="text-xs font-black italic uppercase tracking-tighter">{selectedDenomData?.amount || '-'}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                      {product.category === 'subscription' ? 'Email Address' : t('topup.user_id')}
                    </p>
                    <p className="text-xs font-mono text-white/60">{userId || '-'}</p>
                  </div>

                  {selectedPayment && (
                    <div className="flex justify-between items-center">
                      <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{t('topup.payment_method')}</p>
                      <p className="text-xs font-black italic uppercase tracking-tighter text-brand">
                        {PAYMENT_METHODS.find(pm => pm.id === selectedPayment)?.name || selectedPayment}
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-white/5">
                    <div className="flex justify-between items-end mb-6">
                      <div>
                        <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-1">{t('topup.total')}</p>
                        <p className="text-2xl font-black italic tracking-tighter text-brand">
                          {selectedDenomData ? formatCurrency(selectedDenomData.price) : 'Rp 0'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={handleCheckout}
                        disabled={isProcessing || !selectedDenom || !userId || !selectedPayment}
                        className="w-full bg-gradient-to-r from-brand to-brand-secondary hover:opacity-90 disabled:opacity-20 disabled:cursor-not-allowed text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-brand/20 flex items-center justify-center gap-2"
                      >
                        {isProcessing ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>{t('topup.pay_now')}</span>
                            <ChevronRight size={14} />
                          </>
                        )}
                      </button>
                      <button 
                        onClick={handleAddToCart}
                        disabled={!selectedDenom || !userId}
                        className="w-full bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all border border-white/10 flex items-center justify-center gap-2"
                      >
                        <span>{t('topup.add_to_cart')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Checkout Bar */}
      <AnimatePresence>
        {selectedDenom && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0A]/80 backdrop-blur-xl border-t border-white/10 p-6 lg:hidden"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="hidden sm:block">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">{t('topup.total')}</p>
                <p className="text-2xl font-black italic tracking-tighter text-brand">
                  {selectedDenomData ? formatCurrency(selectedDenomData.price) : 'Rp 0'}
                </p>
              </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="flex-grow sm:flex-grow-0 text-right sm:text-left mr-4">
                    <p className="text-xs font-bold uppercase tracking-tighter italic">{selectedDenomData?.amount}</p>
                    {selectedPayment && (
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">
                        via {PAYMENT_METHODS.find(pm => pm.id === selectedPayment)?.name || selectedPayment}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleAddToCart}
                      className="p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex-shrink-0"
                      title={t('topup.add_to_cart')}
                    >
                      <CreditCard size={18} />
                    </button>
                    <button 
                      onClick={handleCheckout}
                      disabled={isProcessing}
                      className="flex-grow sm:flex-grow-0 bg-gradient-to-r from-brand to-brand-secondary hover:opacity-90 disabled:opacity-50 text-white px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-brand/20 flex items-center justify-center gap-3"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>{t('topup.processing')}</span>
                        </>
                      ) : (
                        <>
                          <span>{t('topup.checkout_now')}</span>
                          <ChevronRight size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#141414] border border-white/10 rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-brand" />
              <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">{t('topup.success_title')}</h3>
              <p className="text-white/40 text-sm mb-8 leading-relaxed">
                {t('topup.success_desc')}
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => navigate('/history')}
                  className="w-full bg-white text-black py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-brand hover:text-white transition-all"
                >
                  {t('topup.view_history')}
                </button>
                <button 
                  onClick={() => setShowSuccess(false)}
                  className="w-full bg-white/5 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  {t('topup.close')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
