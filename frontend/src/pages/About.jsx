import { motion } from 'framer-motion';
import { Award, Users, BookOpen, GraduationCap, ArrowRight, CheckCircle, FlaskConical, Calculator, Globe, PenTool } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const stats = [
    { value: '5,000+', label: 'Active Students', sub: 'and growing' },
    { value: '8+', label: 'Subjects', sub: 'covered' },
    { value: '50+', label: 'Expert Tutors', sub: 'qualified & vetted' },
    { value: '95%', label: 'Satisfaction Rate', sub: 'student-reported' },
  ];

  const values = [
    { title: 'Quality Education', desc: 'We provide high-quality tutoring in academic subjects with proven teaching methodologies.' },
    { title: 'Personalized Learning', desc: 'One-on-one sessions tailored to your learning style, pace, and academic goals.' },
    { title: 'Expert Tutors', desc: 'Learn from qualified instructors with proven academic credentials and teaching track records.' },
    { title: 'Proven Results', desc: 'Our students achieve outstanding academic results with measurable progress tracking.' }
  ];

  const subjects = [
    { icon: FlaskConical, name: 'Chemistry', emoji: '⚗️' },
    { icon: Calculator, name: 'Mathematics', emoji: '∑' },
    { icon: Award, name: 'Physics', emoji: '⚛️' },
    { icon: BookOpen, name: 'Biology', emoji: '🧬' },
    { icon: Globe, name: 'French', emoji: '🗺️' },
    { icon: PenTool, name: 'English', emoji: '✍️' },
  ];

  const team = [
    { name: 'JOSEPH AMONOO', role: 'Founder', bio: 'Visionary leader driving academic excellence through innovative education' },
    { name: 'Simon Azike', role: 'Co-Founder', bio: 'Dedicated to transforming learning experiences for students worldwide' },
    { name: 'DAMILARE OLADIMEJI', role: 'Team Lead', bio: 'Committed to delivering quality education and student success' }
  ];

  return (
    <div className="font-sans">

      {/* ─── HERO ─── */}
      <section className="relative bg-[#1A2D44] text-white overflow-hidden min-h-[60vh] flex items-center">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 80px, #F9A825 80px, #F9A825 81px),
                              repeating-linear-gradient(90deg, transparent, transparent 80px, #F9A825 80px, #F9A825 81px)`
          }}
        />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full filter blur-[100px] -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/8 rounded-full filter blur-[80px] translate-y-1/3 -translate-x-1/4" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-block border-l-4 border-amber-500 pl-4 mb-6 text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">About Us</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
              Empowering Students<br /><span className="text-amber-500">to Excel</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              We're on a mission to transform education through personalized learning, expert tutoring, and proven methodologies that deliver real results.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center py-10 px-6"
              >
                <p className="text-4xl font-black text-[#1A2D44] mb-1">{stat.value}</p>
                <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{stat.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STORY SECTION ─── */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="inline-block border-l-4 border-amber-500 pl-4 mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Our Story</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-[#1A2D44] leading-tight mb-6">
                A Journey of<br /><span className="text-amber-500">Excellence</span>
              </h2>
              <div className="space-y-6 text-gray-500 text-lg leading-relaxed">
                <p>
                  Joe Academy was founded with a simple vision: to make quality education accessible to every student. What started as a small tutoring center has grown into a comprehensive learning platform serving thousands of students worldwide.
                </p>
                <p>
                  Our approach combines expert instruction with cutting-edge learning technology. We believe that every student has the potential to excel — it's our job to unlock that potential through personalized attention, proven methodologies, and unwavering support.
                </p>
                <p>
                  Today, we're proud to have helped over 3,000 students achieve their academic goals, with a satisfaction rate of over 95%. And we're just getting started.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 border border-amber-500/20" />
              <div className="bg-[#1A2D44] p-10 relative">
                <h3 className="text-2xl font-bold text-white mb-8">Why Choose Us</h3>
                <div className="space-y-6">
                  {values.map((value, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-[#1A2D44]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1">{value.title}</h4>
                        <p className="text-gray-400 text-sm">{value.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── SUBJECTS ─── */}
      <section className="py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block border-l-4 border-amber-500 pl-4 mb-4 text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600">What We Teach</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#1A2D44]">
              Subjects We<br /><span className="text-amber-500">Specialize In</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-0 border border-gray-200">
            {subjects.map((subject, i) => (
              <motion.div
                key={subject.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                viewport={{ once: true }}
                className="p-8 border-b border-r border-gray-200 last:border-r-0 hover:bg-amber-50/50 transition-colors group text-center"
              >
                <div className="text-4xl mb-4">{subject.emoji}</div>
                <h3 className="font-bold text-[#1A2D44]">{subject.name}</h3>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/courses" className="inline-flex items-center gap-2 text-[#1A2D44] font-bold text-sm uppercase tracking-wide border-b-2 border-amber-500 pb-1 hover:text-amber-600 transition-colors">
              View all courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── TEAM ─── */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block border-l-4 border-amber-500 pl-4 mb-4 text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Leadership</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#1A2D44]">
              Meet Our<br /><span className="text-amber-500">Founders</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-0 border border-gray-200">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="p-8 border-r border-gray-200 last:border-r-0 hover:bg-gray-50 transition-colors"
              >
                <div className="w-20 h-20 bg-[#1A2D44] rounded-full flex items-center justify-center mb-6 mx-auto">
                  <span className="text-2xl font-black text-amber-500">{member.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <h3 className="font-bold text-[#1A2D44] text-lg text-center mb-1">{member.name}</h3>
                <p className="text-amber-600 font-medium text-sm text-center mb-3">{member.role}</p>
                <p className="text-gray-500 text-sm text-center">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="py-0 overflow-hidden">
        <div className="bg-amber-500 relative">
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, #1A2D44 0, #1A2D44 1px, transparent 0, transparent 50%)`,
              backgroundSize: '16px 16px'
            }}
          />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-black text-[#1A2D44] leading-tight mb-4">
                  Ready to Start<br />Your Journey?
                </h2>
                <p className="text-[#1A2D44]/70 text-lg">
                  Join thousands of students already achieving academic excellence.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-4 md:justify-end"
              >
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 bg-[#1A2D44] text-white px-8 py-4 font-bold text-sm uppercase tracking-wide hover:bg-[#14293a] transition-colors"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/courses"
                  className="inline-flex items-center justify-center gap-2 border-2 border-[#1A2D44] text-[#1A2D44] px-8 py-4 font-bold text-sm uppercase tracking-wide hover:bg-[#1A2D44]/10 transition-colors"
                >
                  Browse Courses
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;