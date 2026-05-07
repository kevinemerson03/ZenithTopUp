import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History as HistoryIcon, Clock, CheckCircle2, XCircle, 
  ChevronRight, Search, Filter, CreditCard, Zap, 
  X, ExternalLink, RefreshCw, Copy, ShieldCheck
} from 'lucide-react';
import { Transaction } from '../types';
import { SUBSCRIPTIONS, GAMES } from '../constants';
import { formatCurrency } from '../lib/utils';
import { toast } from 'sonner';

import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

export const HistoryPage: React.FC = () => {
  const { t } = useLanguage();
  const { history, user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const getProductImage = (productId: string) => {
    const product = [...GAMES, ...SUBSCRIPTIONS].find(p => p.id === productId);
    return product?.image || `https://picsum.photos/seed/${productId}/200/200`;
  };

  if (loading) {
    return (
      <div className="pt-32 pb-32 min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-white/40 font-black uppercase tracking-widest italic animate-pulse">Scanning Transmissions...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-32 pb-32 min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-4">Unauthorized Access</h1>
        <p className="text-white/40 text-sm max-w-sm mb-8">Please sign in to view your transaction engine logs.</p>
        <Link to="/login" className="bg-brand text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest">Sign In</Link>
      </div>
    );
  }

  const filteredHistory = history.filter(tx => 
    tx.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Transaction ID copied to clipboard');
  };

  const downloadReceipt = (tx: Transaction) => {
    const isSub = SUBSCRIPTIONS.some(s => s.id === tx.id); 
    // Wait, check category correctly
    const product = [...GAMES, ...SUBSCRIPTIONS].find(p => p.id === tx.productId);
    const idLabel = product?.category === 'subscription' ? 'Email Address' : 'User ID';

    const receiptContent = `
==========================================
       ZENITH DIGITAL TOP-UP
          OFFICIAL RECEIPT
==========================================

TRANSACTION DETAILS
------------------------------------------
Status:         ${tx.status.toUpperCase()}
Order Date:     ${new Date(tx.date).toLocaleString()}
Transaction ID: ${tx.id}
${idLabel}:      ${tx.targetId || 'N/A'}

PRODUCT INFO
------------------------------------------
Product:        ${tx.productName}
Amount:         ${tx.amount}
Unit Price:     Rp ${tx.price.toLocaleString()}

PAYMENT INFO
------------------------------------------
Method:         Zenith Wallet
Total Paid:     Rp ${tx.price.toLocaleString()}

------------------------------------------
Thank you for using Zenith Digital!
This is a computer-generated receipt.
==========================================
    `;
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Zenith_Receipt_${tx.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Receipt downloaded successfully!');
  };

  return (
    <div className="pt-32 pb-32 min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center text-brand border border-brand/20">
              <HistoryIcon size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter">{t('history.title')}</h1>
              <p className="text-white/40 text-sm font-bold uppercase tracking-widest">{t('history.subtitle')}</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-5 py-2.5 gap-3 w-80 focus-within:border-brand/50 transition-all relative group">
              <Search size={16} className="text-white/40 group-focus-within:text-brand transition-colors" />
              <input 
                type="text" 
                placeholder={t('history.search_placeholder')} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-white placeholder:text-white/20 w-full font-medium"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-white/20 hover:text-white transition-colors"
                >
                  <XCircle size={14} />
                </button>
              )}
            </div>
            <button className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all">
              <Filter size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: t('history.total_transactions'), value: history.length, icon: <Zap size={20} />, color: 'brand' },
            { label: t('history.total_spent'), value: formatCurrency(history.reduce((acc, tx) => acc + tx.price, 0)), icon: <CreditCard size={20} />, color: 'brand-secondary' },
            { label: t('history.active_subs'), value: history.filter(tx => SUBSCRIPTIONS.some(s => s.id === tx.productId)).length, icon: <Clock size={20} />, color: 'emerald' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-sm"
            >
              <div className={`w-10 h-10 rounded-xl bg-${stat.color === 'brand' ? 'brand' : stat.color === 'brand-secondary' ? 'brand-secondary' : 'emerald'}-500/10 flex items-center justify-center text-${stat.color === 'brand' ? 'brand' : stat.color === 'brand-secondary' ? 'brand-secondary' : 'emerald'}-500 mb-4`}>
                {stat.icon}
              </div>
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black italic tracking-tighter">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {history.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((tx, idx) => (
                <motion.div 
                  key={tx.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedTx(tx)}
                  className="group flex items-center justify-between p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-white/20 hover:bg-white/[0.04] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 relative">
                      <img 
                        src={getProductImage(tx.productId)} 
                        alt={tx.productName} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-brand/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-black italic uppercase tracking-tighter group-hover:text-brand transition-colors">{tx.productName}</h3>
                        <span className="px-2 py-0.5 rounded-md bg-white/5 text-[8px] font-bold text-white/40 uppercase tracking-widest border border-white/5">#{tx.id}</span>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">
                        <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full"><Clock size={12} className="text-brand" /> {new Date(tx.date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full"><Zap size={12} className="text-brand-secondary" /> {tx.amount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-12">
                    <div className="text-right">
                      <p className="text-2xl font-black italic tracking-tighter text-white mb-1">{formatCurrency(tx.price)}</p>
                      <div className={`flex items-center gap-1.5 justify-end text-[9px] font-black uppercase tracking-[0.2em] ${
                        tx.status === 'completed' ? 'text-emerald-500' : tx.status === 'pending' ? 'text-brand' : 'text-red-500'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                          tx.status === 'completed' ? 'bg-emerald-500' : tx.status === 'pending' ? 'bg-brand' : 'bg-red-500'
                        }`} />
                        {tx.status}
                      </div>
                    </div>
                    <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 group-hover:text-white group-hover:bg-gradient-to-br group-hover:from-brand group-hover:to-brand-secondary group-hover:border-transparent transition-all group-hover:rotate-12">
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
                <Search size={48} className="text-white/10 mx-auto mb-6" />
                <p className="text-white/40 font-black uppercase tracking-widest italic">{t('history.no_results')} "{searchQuery}"</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-white/10 mb-8 border border-white/5">
              <HistoryIcon size={48} />
            </div>
            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">{t('history.no_transactions')}</h3>
            <p className="text-white/40 text-sm max-w-sm leading-relaxed">
              Your ZenithTopUp engine is idling. Start your first top up to see your transaction journey here.
            </p>
            <Link 
              to="/"
              className="mt-8 bg-gradient-to-r from-brand to-brand-secondary text-white px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all shadow-2xl shadow-brand/20"
            >
              {t('history.start_shopping')}
            </Link>
          </div>
        )}

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedTx && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedTx(null)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl shadow-black"
              >
                {/* Modal Header */}
                <div className="p-8 pb-0 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
                      <ShieldCheck size={20} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic">Transaction Detail</p>
                  </div>
                  <button 
                    onClick={() => setSelectedTx(null)}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-8">
                  {/* Receipt Header */}
                  <div className="flex items-start gap-6 mb-10 pb-10 border-b border-dashed border-white/10">
                    <div className="w-24 h-24 rounded-3xl overflow-hidden border border-white/10 flex-shrink-0">
                      <img 
                        src={getProductImage(selectedTx.productId)} 
                        alt={selectedTx.productName} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-2 leading-none">{selectedTx.productName}</h2>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand">{selectedTx.amount}</span>
                        <div className="w-1 h-1 rounded-full bg-white/10" />
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">#{selectedTx.id}</span>
                      </div>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                        selectedTx.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-brand/10 text-brand'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${selectedTx.status === 'completed' ? 'bg-emerald-500' : 'bg-brand'}`} />
                        {selectedTx.status}
                      </div>
                    </div>
                  </div>

                  {/* Receipt Data */}
                  <div className="space-y-6 mb-10">
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Order Date</p>
                      <p className="text-sm font-bold text-white">{new Date(selectedTx.date).toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/30">
                        {(() => {
                          const product = [...GAMES, ...SUBSCRIPTIONS].find(p => p.id === selectedTx.productId);
                          return product?.category === 'subscription' ? 'Email Address' : 'User ID';
                        })()}
                      </p>
                      <p className="text-sm font-bold text-white">{selectedTx.targetId || '-'}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Payment Method</p>
                      <div className="flex items-center gap-2">
                        <CreditCard size={14} className="text-brand" />
                        <p className="text-sm font-bold text-white">Zenith Wallet</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Transaction ID</p>
                      <button 
                        onClick={() => copyToClipboard(selectedTx.id)}
                        className="group flex items-center gap-2 text-white/60 hover:text-brand transition-all"
                      >
                        <p className="text-xs font-mono font-bold tracking-tighter">{selectedTx.id}</p>
                        <Copy size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </div>
                    <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand italic">Grand Total</p>
                      <p className="text-4xl font-black italic tracking-tighter text-white">{formatCurrency(selectedTx.price)}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => {
                        setSelectedTx(null);
                        navigate(`/topup/${selectedTx.productId}`);
                      }}
                      className="flex items-center justify-center gap-3 py-4 bg-white/5 hover:bg-white/10 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/5"
                    >
                      <RefreshCw size={16} className="text-brand" />
                      Buy Again
                    </button>
                    <button 
                      onClick={() => downloadReceipt(selectedTx)}
                      className="flex items-center justify-center gap-3 py-4 bg-brand hover:opacity-90 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                    >
                      <ExternalLink size={16} />
                      Receipt
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
