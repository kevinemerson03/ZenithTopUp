import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Briefcase, ChevronLeft, Zap, GraduationCap, Users, TrendingUp, Mail, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export const CareersPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isID = language === 'id';

  const reasons = [
    {
      icon: Zap,
      title: isID ? 'Lingkungan Kerja Dinamis' : 'Dynamic Work Environment',
      desc: isID ? 'Kami menghargai inisiatif dan ide-ide baru.' : 'We value initiative and new ideas.'
    },
    {
      icon: GraduationCap,
      title: isID ? 'Pengembangan Kompetensi' : 'Competency Development',
      desc: isID ? 'Akses ke pelatihan, sertifikasi, dan proyek-proyek menantang.' : 'Access to training, certification, and challenging projects.'
    },
    {
      icon: Users,
      title: isID ? 'Budaya Kolaboratif' : 'Collaborative Culture',
      desc: isID ? 'Bekerja sama dengan tim muda yang berpikiran maju.' : 'Collaborate with forward-thinking young teams.'
    },
    {
      icon: TrendingUp,
      title: isID ? 'Kesempatan Tumbuh' : 'Growth Opportunities',
      desc: isID ? 'Jalur karier yang jelas dari staf hingga posisi kepemimpinan.' : 'Clear career path from staff to leadership positions.'
    }
  ];

  const openings = [
    {
      title: 'Full-Stack Developer',
      qual: isID ? 'Menguasai Laravel/Node.js & React.js' : 'Mastering Laravel/Node.js & React.js'
    },
    {
      title: 'UI/UX Designer',
      qual: isID ? 'Portfolio aplikasi/web minimal 3 proyek' : 'App/web portfolio of at least 3 projects'
    },
    {
      title: 'Digital Marketing Specialist',
      qual: isID ? 'Paham social media ads & SEO' : 'Understand social media ads & SEO'
    },
    {
      title: 'Customer Success (Gamer)',
      qual: isID ? 'Rank tinggi di ML/FF & komunikatif' : 'High rank in ML/FF & communicative'
    },
    {
      title: 'Finance & Operations Staff',
      qual: isID ? 'Familiar dengan e-wallet & payment gateway' : 'Familiar with e-wallets & payment gateways'
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
            <Briefcase size={14} />
            ZENITH TALENT ACQUISITION
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white mb-6 leading-tight">
            {isID ? 'Bangun Karier di Perusahaan Teknologi Digital Terdepan' : 'Build a Career at the Leading Digital Tech Company'}
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-2xl leading-relaxed">
            {isID 
              ? 'Zenith adalah perusahaan rintisan (startup) yang bergerak cepat. Kami mencari talenta-talenta terbaik yang ingin berkontribusi dalam ekosistem digital Indonesia.'
              : 'Zenith is a fast-moving startup. We are looking for the best talents who want to contribute to the Indonesia digital ecosystem.'}
          </p>
        </div>

        <div className="grid gap-12 mb-16">
          <section>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-8 border-b border-white/10 pb-4">
              {isID ? 'Mengapa bergabung dengan Zenith?' : 'Why join Zenith?'}
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {reasons.map((r, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand mb-6 transition-transform">
                    <r.icon size={24} />
                  </div>
                  <h3 className="text-xl font-black italic uppercase tracking-tight text-white mb-2">{r.title}</h3>
                  <p className="text-slate-400 text-sm">{r.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-8 border-b border-white/10 pb-4">
              {isID ? 'Posisi yang tersedia' : 'Open Positions'}
              <span className="ml-4 text-sm font-medium text-slate-500 lowercase italic">(Full-time / Magang)</span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-6 text-sm font-black uppercase tracking-widest text-brand">{isID ? 'Posisi' : 'Position'}</th>
                    <th className="text-left py-4 px-6 text-sm font-black uppercase tracking-widest text-brand">{isID ? 'Kualifikasi Singkat' : 'Short Qualification'}</th>
                  </tr>
                </thead>
                <tbody>
                  {openings.map((job, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                      <td className="py-4 px-6 text-white font-bold italic uppercase tracking-tight flex items-center gap-2">
                        {job.title}
                        <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 text-brand transition-opacity" />
                      </td>
                      <td className="py-4 px-6 text-slate-400">{job.qual}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-brand/20 to-brand-secondary/5 border border-brand/30 rounded-3xl p-8 md:p-12 text-center"
          >
            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-4">
              {isID ? 'Cara melamar:' : 'How to apply:'}
            </h3>
            <p className="text-white/60 mb-8 font-medium">
              {isID ? 'Kirim CV dan portofolio ke:' : 'Send CV and portfolio to:'}
            </p>
            <div className="inline-flex items-center gap-4 px-8 py-4 bg-white text-slate-950 rounded-2xl font-black italic tracking-tighter text-xl mb-8">
              <Mail />
              hrd@zenith.co.id
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-brand group-hover:text-white transition-colors">
              {isID ? 'Kami akan menghubungi kandidat terbaik dalam maksimal 7 hari kerja.' : 'We will contact the best candidates within a maximum of 7 working days.'}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
