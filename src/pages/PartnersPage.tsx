import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Handshake, ChevronLeft, Target, TrendingUp, Cpu, Users, Mail, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export const PartnersPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isID = language === 'id';

  const partnershipTypes = [
    {
      category: isID ? 'Publisher / Developer Game' : 'Game Publisher / Developer',
      desc: isID ? 'Jadikan Zenith sebagai channel top-up resmi untuk game Anda.' : 'Make Zenith the official top-up channel for your games.'
    },
    {
      category: isID ? 'Platform Subscription' : 'Subscription Platform',
      desc: isID ? 'Integrasikan layanan streaming/VoD/SaaS Anda di Zenith.' : 'Integrate your streaming/VoD/SaaS services in Zenith.'
    },
    {
      category: isID ? 'Payment Gateway' : 'Payment Gateway',
      desc: isID ? 'Daftarkan metode pembayaran (QRIS, VA, e-wallet) untuk transaksi lebih lancar.' : 'Register payment methods (QRIS, VA, e-wallet) for smoother transactions.'
    },
    {
      category: isID ? 'Affiliate & Influencer' : 'Affiliate & Influencer',
      desc: isID ? 'Promosikan Zenith dan dapatkan komisi dari setiap transaksi referral.' : 'Promote Zenith and earn commissions from every referral transaction.'
    }
  ];

  const benefits = [
    isID ? 'Margin kompetitif untuk setiap transaksi.' : 'Competitive margins for every transaction.',
    isID ? 'Dashboard real-time untuk memantau volume dan pendapatan.' : 'Real-time dashboard to monitor volume and revenue.',
    isID ? 'Dukungan teknis 24/7 dari tim integrasi kami.' : '24/7 technical support from our integration team.',
    isID ? 'Program co-marketing melalui media sosial Zenith dengan jangkauan 50.000+ pengguna.' : 'Co-marketing programs through Zenith social media with 50,000+ users reach.'
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-20 px-4">
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
            <Handshake size={14} />
            ZENITH ALLIANCE
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white mb-6 leading-tight">
            {t('partners.title')}
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-2xl">
            {t('partners.subtitle')}
          </p>
        </div>

        <div className="grid gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-12"
          >
            <div className="prose prose-invert prose-slate max-w-none">
              <p className="text-slate-300 text-lg leading-relaxed mb-12">
                {isID 
                  ? 'Zenith membuka pintu selebar-lebarnya untuk menjalin kemitraan strategis. Kami percaya ekosistem digital yang sehat dibangun melalui kolaborasi antara penyedia layanan, pengembang game, dan gerbang pembayaran.'
                  : 'Zenith opens its doors wide to establish strategic partnerships. We believe a healthy digital ecosystem is built through collaboration between service providers, game developers, and payment gateways.'}
              </p>

              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-8 border-b border-white/10 pb-4">
                {isID ? 'Jenis Kemitraan' : 'Partnership Types'}
              </h2>
              
              <div className="overflow-x-auto mb-16">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 px-6 text-sm font-black uppercase tracking-widest text-brand">{isID ? 'Kategori' : 'Category'}</th>
                      <th className="text-left py-4 px-6 text-sm font-black uppercase tracking-widest text-brand">{isID ? 'Deskripsi' : 'Description'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partnershipTypes.map((type, idx) => (
                      <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-6 text-white font-bold italic uppercase tracking-tight">{type.category}</td>
                        <td className="py-4 px-6 text-slate-400">{type.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-8 border-b border-white/10 pb-4">
                {isID ? 'Keuntungan Menjadi Mitra Zenith' : 'Benefits of Being a Zenith Partner'}
              </h2>

              <div className="grid sm:grid-cols-2 gap-4 mb-16">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex gap-4 p-6 rounded-2xl bg-white/[0.03] border border-white/5 transition-all">
                    <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand flex-shrink-0 transition-transform">
                      <CheckCircle2 size={20} />
                    </div>
                    <p className="text-slate-300 font-medium leading-relaxed">{benefit}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-brand/20 to-brand-secondary/5 border border-brand/30 rounded-3xl p-8 md:p-12 text-center">
                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-4">
                  {isID ? 'Tertarik menjadi mitra?' : 'Interested in becoming a partner?'}
                </h3>
                <p className="text-white/60 mb-8 font-medium">
                  {isID ? 'Kirim proposal kemitraan ke:' : 'Send your partnership proposal to:'}
                </p>
                <div className="inline-flex items-center gap-4 px-8 py-4 bg-white text-slate-950 rounded-2xl font-black italic tracking-tighter text-xl mb-8">
                  <Mail />
                  partners@zenith.co.id
                </div>
                <div className="text-xs font-black uppercase tracking-[0.2em] text-brand-light/60 bg-brand/10 py-3 px-6 rounded-xl border border-brand/20 inline-block">
                  {isID ? 'Subjek: [Nama Perusahaan] – Kerja Sama [Top Up/Subscription/Payment]' : 'Subject: [Company Name] – Cooperation [Top Up/Subscription/Payment]'}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
