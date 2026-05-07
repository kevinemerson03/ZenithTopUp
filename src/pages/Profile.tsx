import React from 'react';
import { motion } from 'motion/react';
import { User as UserIcon, Mail, Phone, Calendar, ShieldCheck, Zap, TrendingUp, History } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { user, history, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen pt-32 px-4 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const totalSpent = history.reduce((sum, tx) => sum + tx.price, 0);
  const totalTransactions = history.length;
  const lastActive = history[0]?.date ? new Date(history[0].date).toLocaleDateString() : 'Never';

  const stats = [
    { label: 'Total Spent', value: `Rp ${totalSpent.toLocaleString()}`, icon: TrendingUp, color: 'text-brand' },
    { label: 'Transactions', value: totalTransactions, icon: History, color: 'text-brand-secondary' },
    { label: 'Status', value: 'Zenith Elite', icon: ShieldCheck, color: 'text-emerald-500' },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative glass-card p-8 md:p-12 overflow-hidden mb-8"
        >
          {/* Background Decorative Element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="relative">
              <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-brand to-brand-secondary flex items-center justify-center text-white text-5xl font-black italic shadow-2xl shadow-brand/20">
                {user.name ? user.name.charAt(0) : user.email.charAt(0)}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-slate-950 border-4 border-slate-950 flex items-center justify-center">
                <ShieldCheck size={20} className="text-brand" />
              </div>
            </div>

            <div className="flex-grow">
              <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-4 mb-2">
                <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
                  {user.name || 'Account'}
                </h1>
                <span className="px-3 py-1 bg-brand/10 text-brand text-[10px] font-black uppercase tracking-widest rounded-lg mb-2">
                  Verified Member
                </span>
              </div>
              <p className="text-slate-400 font-bold tracking-widest uppercase text-xs flex items-center justify-center md:justify-start gap-2">
                <Mail size={14} className="text-brand" />
                {user.email}
              </p>
            </div>

            <Link 
              to="/history"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 border border-white/5"
            >
              Recent Activity
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + idx * 0.1 }}
              className="glass-card p-8 group hover:border-brand/30 transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-2xl bg-white/5 ${stat.color} group-hover:bg-brand/10 group-hover:scale-110 transition-all`}>
                  <stat.icon size={24} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
              </div>
              <p className="text-3xl font-black italic tracking-tighter text-white">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Account Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-10"
          >
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-white mb-8 border-b border-white/5 pb-4">
              Account Details
            </h3>
            
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-brand">
                  <UserIcon size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Full Name</p>
                  <p className="text-sm font-bold text-white">{user.name || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-brand">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Email Address</p>
                  <p className="text-sm font-bold text-white">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-brand">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Phone Number</p>
                  <p className="text-sm font-bold text-white">{user.phone || 'Not linked'}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Membership Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-10 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8">
              <Zap size={64} className="text-brand/5 group-hover:text-brand/10 transition-colors" />
            </div>

            <h3 className="text-xl font-black italic uppercase tracking-tighter text-white mb-8 border-b border-white/5 pb-4">
              Zenith Status
            </h3>
            
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-500">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Security Level</p>
                  <p className="text-sm font-bold text-white italic uppercase tracking-tight">Maximum Hardened</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-brand">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Member Since</p>
                  <p className="text-sm font-bold text-white italic uppercase tracking-tight">May 2026</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-brand-secondary">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Last Transaction</p>
                  <p className="text-sm font-bold text-white italic uppercase tracking-tight">{lastActive}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
