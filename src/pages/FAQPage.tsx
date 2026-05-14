import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronLeft, Search, Plus, Minus, CreditCard, Zap, Shield, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export const FAQPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isID = language === 'id';

  const faqData: FAQItem[] = [
    {
      id: 'q1',
      category: isID ? 'Umum' : 'General',
      question: isID ? 'Apa itu Zenith Top-Up?' : 'What is Zenith Top-Up?',
      answer: isID 
        ? 'Zenith adalah platform top-up digital tercepat yang menyediakan berbagai kebutuhan game dan layanan subscription dengan sistem otomatis 24/7.'
        : 'Zenith is the fastest digital top-up platform providing various gaming needs and subscription services with a 24/7 automated system.'
    },
    {
      id: 'q2',
      category: isID ? 'Transaksi' : 'Transaction',
      question: isID ? 'Bagaimana cara melakukan top-up?' : 'How do I top up?',
      answer: isID 
        ? 'Pilih game Anda, masukkan User ID, pilih nominal, pilih metode pembayaran, dan lakukan pembayaran. Engine Zenith akan memproses item Anda dalam hitungan detik.'
        : 'Select your game, enter your User ID, choose the amount, pick a payment method, and complete the payment. The Zenith engine will process your items in seconds.'
    },
    {
      id: 'q3',
      category: isID ? 'Pembayaran' : 'Payment',
      question: isID ? 'Metode pembayaran apa saja yang tersedia?' : 'What payment methods are available?',
      answer: isID 
        ? 'Kami mendukung berbagai metode pembayaran termasuk QRIS (GoPay, OVO, Dana), Virtual Account (BCA, Mandiri, BNI), dan Transfer Bank.'
        : 'We support various payment methods including QRIS (GoPay, OVO, Dana), Virtual Account (BCA, Mandiri, BNI), and Bank Transfers.'
    },
    {
      id: 'q4',
      category: isID ? 'Keamanan' : 'Security',
      question: isID ? 'Apakah transaksi di Zenith aman?' : 'Is transaction at Zenith safe?',
      answer: isID 
        ? 'Sangat aman. Kami menggunakan enkripsi SSL standar industri dan tidak pernah menyimpan informasi kartu kredit/debit secara langsung.'
        : 'Extremely safe. We use industry-standard SSL encryption and never store credit/debit card information directly.'
    },
    {
      id: 'q5',
      category: isID ? 'Kendala' : 'Troubleshooting',
      question: isID ? 'Bagaimana jika item tidak masuk dalam 5 menit?' : 'What if items don\'t arrive within 5 minutes?',
      answer: isID 
        ? 'Hubungi tim dukungan kami melalui menu Support atau lampirkan bukti pembayaran ke WhatsApp kami. Pastikan User ID yang Anda masukkan sudah benar.'
        : 'Contact our support team via the Support menu or attach proof of payment to our WhatsApp. Make sure the User ID you entered is correct.'
    },
    {
      id: 'q6',
      category: isID ? 'Biaya' : 'Fees',
      question: isID ? 'Apakah ada biaya admin?' : 'Are there admin fees?',
      answer: isID 
        ? 'Biaya admin bervariasi tergantung metode pembayaran yang dipilih (biasanya Rp 500 - Rp 2.500). Transparansi adalah prioritas kami, semua biaya akan terlihat sebelum Anda membayar.'
        : 'Admin fees vary depending on the selected payment method (usually Rp 500 - Rp 2,500). Transparency is our priority, all fees will be visible before you pay.'
    }
  ];

  const filteredFaqs = faqData.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <HelpCircle size={14} />
            ZENITH HELP CENTER
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white mb-6 leading-tight">
            {t('faq.title')}
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-2xl leading-relaxed">
            {t('faq.subtitle')}
          </p>
        </div>

        <div className="relative mb-12 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand transition-colors" size={20} />
          <input 
            type="text" 
            placeholder={isID ? "Cari pertanyaan..." : "Search questions..."}
            className="w-full h-16 bg-white/[0.02] border border-white/10 rounded-2xl pl-16 pr-6 focus:border-brand/50 focus:ring-1 focus:ring-brand/50 outline-none transition-all font-bold italic uppercase tracking-tighter text-white text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {filteredFaqs.map((faq) => (
            <motion.div 
              key={faq.id}
              className={`bg-white/[0.02] border transition-all rounded-3xl overflow-hidden ${
                openId === faq.id ? 'border-brand/40 bg-white/[0.05]' : 'border-white/10 hover:border-white/20'
              }`}
            >
              <button 
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full px-8 py-6 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-6">
                  <div className="w-24 md:w-32 flex-shrink-0">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-brand bg-brand/10 px-2 py-1 rounded text-center border border-brand/20">
                      {faq.category}
                    </span>
                  </div>
                  <span className="text-lg md:text-xl font-black italic uppercase tracking-tighter text-white leading-tight">
                    {faq.question}
                  </span>
                </div>
                <div className={`transition-transform duration-300 ${openId === faq.id ? 'rotate-180 text-brand' : 'text-slate-500'}`}>
                  {openId === faq.id ? <Minus size={20} /> : <Plus size={20} />}
                </div>
              </button>
              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-8 text-slate-400 leading-relaxed font-medium">
                      <div className="h-px bg-white/10 mb-6" />
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 grid sm:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-brand/5 border border-brand/20 text-center">
            <Zap className="w-10 h-10 text-brand mx-auto mb-4" />
            <h4 className="text-white font-black italic uppercase tracking-tighter mb-2">{isID ? 'Proses Instan' : 'Instant Process'}</h4>
            <p className="text-xs text-slate-500 font-medium">{isID ? 'Dalam hitungan detik' : 'Within seconds'}</p>
          </div>
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center group cursor-pointer hover:bg-white/10 transition-all" onClick={() => navigate('/support')}>
            <MessageCircle className="w-10 h-10 text-white/40 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h4 className="text-white font-black italic uppercase tracking-tighter mb-2">{isID ? 'Bantuan Live' : 'Live Support'}</h4>
            <p className="text-xs text-slate-500 font-medium">{isID ? 'Tanya admin kami' : 'Ask our admin'}</p>
          </div>
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center">
            <Shield className="w-10 h-10 text-white/40 mx-auto mb-4" />
            <h4 className="text-white font-black italic uppercase tracking-tighter mb-2">{isID ? 'Aman 100%' : '100% Secure'}</h4>
            <p className="text-xs text-slate-500 font-medium">{isID ? 'Enkripsi Military' : 'Military Encryption'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
