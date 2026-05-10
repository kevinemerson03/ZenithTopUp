import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { motion } from 'motion/react';
import { Mail, Lock, LogIn, ArrowRight, AlertCircle, Loader2, Eye, EyeOff, Phone } from 'lucide-react';
import { toast } from 'sonner';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (loginMethod === 'email') {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Successfully logged in!');
        navigate('/');
      } else {
        // Find email associated with phone
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('phone', '==', phone), limit(1));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error('No account found with this phone number.');
        }

        const userData = querySnapshot.docs[0].data();
        const userEmail = userData.email;

        if (!userEmail) {
          throw new Error('Registered account has no associated email.');
        }

        await signInWithEmailAndPassword(auth, userEmail, password);
        toast.success('Successfully logged in!');
        navigate('/');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to login. Please check your credentials.');
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen flex items-center justify-center px-4 bg-[#020617]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400 text-sm">Peak performance awaits. Sign in to your account.</p>
        </div>

        <div className="flex gap-2 p-1 bg-white/[0.03] border border-white/5 rounded-2xl mb-8">
          <button 
            onClick={() => setLoginMethod('email')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              loginMethod === 'email' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Email
          </button>
          <button 
            onClick={() => setLoginMethod('phone')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              loginMethod === 'phone' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Phone
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-red-500 text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {loginMethod === 'email' ? (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand transition-colors" size={20} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-brand/50 focus:bg-white/[0.05] transition-all"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand transition-colors" size={20} />
                <input 
                  type="tel" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+62 812 3456 7890"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-brand/50 focus:bg-white/[0.05] transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand transition-colors" size={20} />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-white focus:outline-none focus:border-brand/50 focus:bg-white/[0.05] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>


          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand hover:bg-brand-light disabled:bg-brand/50 text-white font-black italic uppercase tracking-widest py-4 rounded-2xl mt-4 flex items-center justify-center gap-2 transition-all group shadow-lg shadow-brand/20"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Sign In
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-10 text-slate-400 text-sm">
          Don't have an account? {' '}
          <Link to="/register" className="text-brand font-bold hover:underline">Register Now</Link>
        </p>
      </motion.div>
    </div>
  );
};
