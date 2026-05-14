import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, ChevronLeft, Send, MessageCircle, HelpCircle, Clock, Instagram } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'sonner';

export const ContactPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const isID = language === 'id';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'Top Up',
    message: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(isID ? 'Pesan terkirim! (Simulasi)' : 'Message sent! (Simulation)');
    setFormData({ name: '', email: '', type: 'Top Up', message: '' });
  };

  const contactMethods = [
    {
      icon: Mail,
      label: isID ? 'Email HRD / Kerja Sama' : 'HR / Collaboration Email',
      value: 'hrd@zenith.co.id',
      link: 'mailto:hrd@zenith.co.id',
      desc: isID ? 'Untuk rekrutmen, magang, dan kerja sama' : 'For recruitment, internships, and cooperation'
    },
    {
      icon: MessageCircle,
      label: 'Customer Support (WhatsApp)',
      value: '0813-8607-3445',
      link: 'https://wa.me/6281386073445',
      desc: isID ? 'Senin–Minggu, 09.00 – 21.00 WIB' : 'Mon–Sun, 09.00 – 21.00 WIB'
    },
    {
      icon: Phone,
      label: isID ? 'Telepon Resmi' : 'Official Phone',
      value: '(021) 1234-5678',
      link: 'tel:02112345678',
      desc: isID ? 'Senin–Jumat, 09.00 – 17.00 WIB' : 'Mon–Fri, 09.00 – 17.00 WIB'
    }
  ];

  const faqs = [
    isID ? 'Bagaimana cara top up diamond Mobile Legends?' : 'How to top up Mobile Legends diamonds?',
    isID ? 'Apakah ada biaya admin?' : 'Are there any admin fees?',
    isID ? 'Berapa lama proses transaksi?' : 'How long does the transaction process take?',
    isID ? 'Bagaimana jika item tidak masuk ke akun game?' : 'What if the item does not enter the game account?'
  ];

  const responseTimes = [
    { label: 'WhatsApp', time: isID ? '2 – 4 jam' : '2 – 4 hours' },
    { label: 'Form Website', time: isID ? '12 – 24 jam' : '12 – 24 hours' },
    { label: isID ? 'Telepon' : 'Phone', time: isID ? 'Langsung' : 'Instant' },
    { label: 'Email', time: isID ? '24 jam' : '24 hours' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-20 px-4 text-slate-300">
      <div className="max-w-6xl mx-auto">
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
            <Send size={14} />
            ZENITH COMMAND CENTER
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white mb-6 leading-tight">
            {isID ? 'Hubungi Tim Zenith' : 'Contact Zenith Team'}
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-2xl leading-relaxed">
            {isID 
              ? 'Ada pertanyaan, saran, atau kendala seputar transaksi top up dan subscription di Zenith? Tim dukungan pelanggan kami siap membantu Anda.'
              : 'Have questions, suggestions, or issues regarding top-up and subscription transactions at Zenith? Our customer support team is ready to help you.'}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white/[0.02] border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-8 flex items-center gap-3">
                <MessageCircle className="text-brand" />
                {isID ? 'Saluran Resmi Zenith' : 'Official Zenith Channels'}
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {contactMethods.map((method, idx) => (
                  <a 
                    key={idx} 
                    href={method.link}
                    className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-brand/30 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand mb-4 group-hover:scale-110 transition-transform">
                      <method.icon size={20} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{method.label}</p>
                    <p className="text-lg font-black italic uppercase tracking-tighter text-white mb-2">{method.value}</p>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">{method.desc}</p>
                  </a>
                ))}
              </div>
            </section>

            <section className="bg-white/[0.02] border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-8">
                {isID ? 'Kirim Pesan Langsung' : 'Send Direct Message'}
              </h2>
              <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-4">Nama Lengkap</label>
                  <input 
                    type="text" 
                    placeholder="Andi Wijaya"
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all font-bold italic uppercase tracking-tighter text-white"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-4">Email Aktif</label>
                  <input 
                    type="email" 
                    placeholder="andi@email.com"
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all font-bold italic uppercase tracking-tighter text-white"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-4">Jenis Keperluan</label>
                  <select 
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all font-bold italic uppercase tracking-tighter text-white appearance-none"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="Top Up">Top Up</option>
                    <option value="Subscription">Subscription</option>
                    <option value="Kerja Sama">Kerja Sama</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-4">Pesan</label>
                  <textarea 
                    rows={4}
                    placeholder={isID ? "Tulis pertanyaan atau kebutuhan Anda..." : "Write your questions or needs..."}
                    className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all font-medium text-white"
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="sm:col-span-2 h-16 bg-brand hover:bg-brand-light text-white rounded-2xl font-black italic uppercase tracking-tighter transition-all flex items-center justify-center gap-3 group shadow-[0_0_20px_rgba(0,183,126,0.3)] hover:shadow-[0_0_30px_rgba(0,183,126,0.5)]"
                >
                  <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  {isID ? 'Kirim Pesan' : 'Send Message'}
                </button>
              </form>
            </section>
          </div>

          <div className="space-y-8">
            <section className="bg-white/[0.02] border border-white/10 rounded-3xl p-8">
              <h2 className="text-xl font-black italic uppercase tracking-tight text-white mb-6 flex items-center gap-2">
                <MapPin className="text-brand" size={18} />
                {isID ? 'Kantor Pusat' : 'Headquarters'}
              </h2>
              <div className="space-y-4">
                <p className="text-white font-bold italic uppercase tracking-tight">Zenith Digital Services</p>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  Gedung Kreasi Teknologi Lantai 3<br />
                  Jl. Merdeka No. 45, Jakarta Pusat 10110
                </p>
                <div className="pt-4 border-t border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Jam Operasional</p>
                  <p className="text-xs text-slate-400">Senin – Jumat, 09.00 – 17.00 WIB</p>
                </div>
              </div>
            </section>

            <section className="bg-white/[0.02] border border-white/10 rounded-3xl p-8">
              <h2 className="text-xl font-black italic uppercase tracking-tight text-white mb-6 flex items-center gap-2">
                <Clock className="text-brand" size={18} />
                {isID ? 'Waktu Respon' : 'Response Times'}
              </h2>
              <div className="space-y-4">
                {responseTimes.map((rt, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">{rt.label}</span>
                    <span className="text-white font-black italic uppercase tracking-tighter">{rt.time}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white/[0.02] border border-white/10 rounded-3xl p-8">
              <h2 className="text-xl font-black italic uppercase tracking-tight text-white mb-6 flex items-center gap-2">
                <Instagram className="text-brand" size={18} />
                Instagram
              </h2>
              <div className="flex flex-wrap gap-3">
                <a 
                  href="https://www.instagram.com/zenithtopup?igsh=MTFrc21idnJjb2RudQ==" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white/5 hover:bg-brand/20 border border-white/5 hover:border-brand/40 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all flex items-center gap-2"
                >
                  <Instagram size={14} />
                  @zenithtopup
                </a>
              </div>
            </section>
          </div>
        </div>

        <section className="bg-brand/5 border border-brand/20 rounded-3xl p-12 text-center">
            <HelpCircle className="w-12 h-12 text-brand mx-auto mb-6" />
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-4">
              {isID ? 'Sebelum Menghubungi…' : 'Before Contacting…'}
            </h2>
            <p className="text-slate-400 font-medium mb-10 max-w-lg mx-auto">
              {isID ? 'Cek dulu halaman FAQ kami. Mungkin pertanyaan Anda sudah terjawab di sana.' : 'Check our FAQ page first. Maybe your questions have already been answered there.'}
            </p>
            <button 
              onClick={() => navigate('/faq')}
              className="bg-brand text-white px-8 py-3 rounded-2xl font-black italic uppercase tracking-tighter hover:bg-brand-light transition-all shadow-[0_0_20px_rgba(0,183,126,0.3)] mb-12"
            >
              {isID ? 'Lihat Semua FAQ' : 'View All FAQ'}
            </button>
            <div className="flex flex-wrap justify-center gap-4">
              {faqs.map((f, i) => (
                <div key={i} className="px-6 py-3 bg-white/[0.03] border border-white/10 rounded-2xl text-xs font-bold text-white italic">
                  {f}
                </div>
              ))}
            </div>
        </section>
      </div>
    </div>
  );
};
