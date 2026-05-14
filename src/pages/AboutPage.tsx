import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Info, ChevronLeft, Rocket, Shield, Zap, Target, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export const AboutPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isID = language === 'id';

  const missions = [
    {
      title: isID ? 'Kecepatan' : 'Speed',
      desc: isID ? 'Menyediakan proses transaksi di bawah 30 detik.' : 'Providing transaction processes under 30 seconds.'
    },
    {
      title: isID ? 'Transparansi' : 'Transparency',
      desc: isID ? 'Menjamin transparansi harga tanpa biaya tersembunyi.' : 'Guaranteed price transparency with no hidden fees.'
    },
    {
      title: isID ? 'Keamanan' : 'Security',
      desc: isID ? 'Melindungi data dan privasi pengguna dengan sistem keamanan berstandar industri.' : 'Protecting user data and privacy with industry-standard security systems.'
    },
    {
      title: isID ? 'Inovasi' : 'Innovation',
      desc: isID ? 'Terus berinovasi berdasarkan perilaku dan kebutuhan pengguna muda.' : 'Continuously innovating based on the behavior and needs of young users.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-20 px-4 text-slate-300">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-12 text-sm font-black uppercase tracking-widest italic"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          {isID ? 'Kembali' : 'Back'}
        </button>

        <div className="mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-brand/10 border border-brand/20 text-brand px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 italic"
          >
            <Info size={14} />
            ZENITH CHRONICLE
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white mb-6 leading-tight">
            {isID ? 'Menghubungkan Gaya Hidup Digital dengan Satu Klik' : 'Connecting Digital Lifestyle with One Click'}
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-2xl leading-relaxed">
            {isID 
              ? 'Zenith adalah perusahaan teknologi yang bergerak di bidang layanan top up game dan subscription digital berbasis web. Kami hadir untuk menjawab kebutuhan generasi digital Indonesia akan platform yang cepat, transparan, dan terpercaya.'
              : 'Zenith is a technology company specializing in web-based game top-ups and digital subscription services. We are here to answer the needs of the Indonesian digital generation for a fast, transparent, and trusted platform.'}
          </p>
        </div>

        <div className="grid gap-12 mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-12"
          >
            <p className="text-lg leading-relaxed mb-8">
              {isID 
                ? 'Seiring pesatnya pertumbuhan industri game dan layanan langganan di Indonesia—dengan lebih dari 74% penduduk terhubung ke internet—Zenith hadir sebagai solusi all-in-one. Kami menyediakan berbagai kebutuhan digital, mulai dari diamond Mobile Legends, koin Free Fire, hingga langganan Netflix, Spotify, dan YouTube Premium, dalam satu akun terintegrasi.'
                : 'With the rapid growth of the gaming and subscription services industry in Indonesia—with over 74% of the population connected to the internet—Zenith comes as an all-in-one solution. We provide various digital needs, from Mobile Legends diamonds, Free Fire coins, to Netflix, Spotify, and YouTube Premium subscriptions, in one integrated account.'}
            </p>

            <div className="grid md:grid-cols-2 gap-8 mt-16">
              <div className="bg-brand/5 border border-brand/20 rounded-2xl p-8 relative overflow-hidden group">
                <Target className="absolute -right-4 -bottom-4 w-24 h-24 text-brand/5 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-4">Visi Kami</h3>
                <p className="text-slate-400 font-medium">
                  {isID 
                    ? 'Menjadi platform top up dan subscription terdepan di Asia Tenggara yang mengutamakan kecepatan, keamanan, dan kenyamanan pengguna.'
                    : 'To become the leading top-up and subscription platform in Southeast Asia that prioritizes user speed, security, and convenience.'}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 relative overflow-hidden group">
                <Rocket className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-4">Misi Kami</h3>
                <ul className="space-y-4">
                  {missions.map((m, i) => (
                    <li key={i} className="flex gap-3">
                      <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brand mt-2" />
                      <p className="text-slate-400 text-sm font-medium">
                        <span className="text-white font-black italic">{m.title}:</span> {m.desc}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          <div className="text-center py-12">
            <Heart className="w-12 h-12 text-brand mx-auto mb-6 animate-pulse" />
            <p className="text-2xl font-black italic uppercase tracking-tighter text-white max-w-xl mx-auto">
              {isID 
                ? 'Zenith bukan sekadar tempat top up. Kami adalah mitra digital Anda untuk menikmati hiburan tanpa batas.'
                : 'Zenith is not just a place to top up. We are your digital partner to enjoy limitless entertainment.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
