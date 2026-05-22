import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BookOpen, Users, Award, ArrowRight, ChevronRight, Play, TrendingUp, Shield, Clock, Star } from 'lucide-react';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const coursesRes = await axios.get('/api/courses?limit=6');
      setCourses(coursesRes.data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Expert-Verified Tutors',
      description: 'Every instructor is rigorously vetted with proven academic credentials and teaching track records.',
    },
    {
      icon: Users,
      title: 'Personalized Learning',
      description: 'Adaptive one-on-one sessions crafted around your learning pace, style, and academic goals.',
    },
    {
      icon: Award,
      title: 'Recognized Certificates',
      description: 'Earn verifiable certificates upon completion — credentials that carry real academic weight.',
    },
    {
      icon: Clock,
      title: 'Flexible Scheduling',
      description: 'Book sessions that fit your timetable. Learn at your own pace, on your own time.',
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Detailed analytics and milestone reports keep you and your tutor aligned at every step.',
    },
    {
      icon: BookOpen,
      title: 'Rich Study Materials',
      description: 'Access curated notes, practice papers, and multimedia resources for every subject.',
    },
  ];

  const stats = [
    { value: '5,000+', label: 'Active Students', sub: 'and growing' },
    { value: '8+', label: 'Subjects', sub: 'covered' },
    { value: '50+', label: 'Expert Tutors', sub: 'qualified & vetted' },
    { value: '95%', label: 'Satisfaction Rate', sub: 'student-reported' },
  ];

  const testimonials = [
    {
      name: 'Amara Osei',
      role: 'A-Level Chemistry Student',
      text: 'Joe Academy completely transformed my understanding of organic chemistry. I went from a C to an A in two months.',
      rating: 5,
      avatar: 'A',
    },
    {
      name: 'Kofi Mensah',
      role: 'GCSE Mathematics',
      text: 'The tutors here don\'t just teach — they help you truly understand. My confidence in maths has never been higher.',
      rating: 5,
      avatar: 'K',
    },
    {
      name: 'Fatima Diallo',
      role: 'French Language Learner',
      text: 'Structured, engaging, and effective. I passed my DELF B2 exam thanks to my Joe Academy tutor.',
      rating: 5,
      avatar: 'F',
    },
  ];

  const subjects = [
    { name: 'Chemistry', color: 'from-[#1A2D44] to-[#243d5c]', accent: '#F9A825', emoji: '⚗️' },
    { name: 'Mathematics', color: 'from-[#1A2D44] to-[#1e3a52]', accent: '#F9A825', emoji: '∑' },
    { name: 'Physics', color: 'from-[#14293a] to-[#1A2D44]', accent: '#F9A825', emoji: '⚛️' },
    { name: 'Biology', color: 'from-[#1A2D44] to-[#243d5c]', accent: '#F9A825', emoji: '🧬' },
    { name: 'French', color: 'from-[#14293a] to-[#1A2D44]', accent: '#F9A825', emoji: '🗺️' },
    { name: 'English', color: 'from-[#1A2D44] to-[#1e3a52]', accent: '#F9A825', emoji: '✍️' },
  ];

  return (
    <div className="font-sans">

      {/* ─── HERO ─── */}
      <section className="relative bg-[#1A2D44] text-white overflow-hidden min-h-screen flex items-center">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 80px, #F9A825 80px, #F9A825 81px),
                              repeating-linear-gradient(90deg, transparent, transparent 80px, #F9A825 80px, #F9A825 81px)`
          }}
        />
        {/* Ambient blobs */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-amber-500/10 rounded-full filter blur-[120px] -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/8 rounded-full filter blur-[100px] translate-y-1/3 -translate-x-1/4" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <div className="inline-flex items-center gap-2 border border-amber-500/30 bg-amber-500/10 px-4 py-2 mb-8">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                <span className="text-amber-400 text-sm font-medium tracking-wide uppercase">Welcome to Joe Academy</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6">
                Academic<br />
                <span className="text-amber-500">Excellence</span><br />
                Starts Here
              </h1>

              <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-lg">
                World-class tutoring in Chemistry, Mathematics, Biology, Physics, Languages and more.
                One-on-one. Results-focused. Built around you.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/courses"
                  className="group inline-flex items-center gap-3 bg-amber-500 text-[#1A2D44] px-8 py-4 font-bold text-sm tracking-wide uppercase hover:bg-amber-400 transition-colors"
                >
                  Browse Courses
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-3 border border-white/20 text-white px-8 py-4 font-semibold text-sm tracking-wide hover:border-amber-500/50 hover:bg-white/5 transition-all"
                >
                  <Play className="w-4 h-4 fill-amber-500 text-amber-500" />
                  Get Started Free
                </Link>
              </div>
            </motion.div>

            {/* Right — hero image card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
              className="hidden lg:block relative"
            >
              <div className="absolute -inset-px border border-amber-500/20" />
              <div className="absolute -top-4 -right-4 w-24 h-24 border border-amber-500/20" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 border border-amber-500/20" />

              <img
                src="/joe.png"
                alt="Joe Academy Tutor"
                className="w-full max-w-lg mx-auto relative z-10"
                style={{ filter: 'drop-shadow(0 40px 80px rgba(249,168,37,0.15))' }}
              />
            </motion.div>
          </div>
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

      {/* ─── WHY CHOOSE US ─── */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-start">

            {/* Left text */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:sticky lg:top-24"
            >
              <div className="inline-block border-l-4 border-amber-500 pl-4 mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Why Joe Academy</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-[#1A2D44] leading-tight mb-6">
                Everything You Need<br />to <span className="text-amber-500">Excel.</span>
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                We've built a learning platform where every detail — from tutor quality to scheduling flexibility — is optimized for one outcome: your academic success.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-[#1A2D44] font-bold text-sm uppercase tracking-wide border-b-2 border-amber-500 pb-1 hover:text-amber-600 transition-colors"
              >
                Learn about our approach <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Right grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="p-7 border border-gray-200 bg-white hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-[#1A2D44] flex items-center justify-center mb-5 group-hover:bg-amber-500 transition-colors">
                    <feature.icon className="w-5 h-5 text-amber-500 group-hover:text-[#1A2D44] transition-colors" />
                  </div>
                  <h3 className="font-bold text-[#1A2D44] mb-2">{feature.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SUBJECTS / COURSES ─── */}
      <section className="py-28 bg-[#1A2D44] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #F9A825 0, #F9A825 1px, transparent 0, transparent 50%)`,
            backgroundSize: '20px 20px'
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="inline-block border-l-4 border-amber-500 pl-4 mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Our Subjects</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                Courses Built for<br /><span className="text-amber-500">Real Results</span>
              </h2>
            </div>
            <Link
              to="/courses"
              className="hidden md:inline-flex items-center gap-2 border border-amber-500/40 text-amber-400 px-6 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-amber-500/10 transition-colors"
            >
              All Courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border border-white/10 h-80 animate-pulse bg-white/5" />
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {courses.slice(0, 6).map((course, index) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Link
                    to={`/courses/${course._id}`}
                    className="block border border-white/10 overflow-hidden relative bg-[#1A2D44] hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300"
                  >
                    <div className="relative h-52 overflow-hidden">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 brightness-75"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#243d5c] to-[#1A2D44] flex items-center justify-center">
                          <BookOpen className="w-10 h-10 text-amber-500/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A2D44] via-transparent to-transparent" />
                      <span className="absolute top-4 left-4 bg-amber-500 text-[#1A2D44] text-xs font-bold px-3 py-1 uppercase tracking-wide">
                        {course.category}
                      </span>
                    </div>

                    <div className="p-6 bg-[#1A2D44] group-hover:bg-[#1e3550] transition-colors">
                      <h3 className="font-bold text-white mb-2 line-clamp-1 group-hover:text-amber-400 transition-colors text-sm uppercase tracking-wide">
                        {course.title}
                      </h3>
                      <p className="text-gray-400 text-xs mb-4 line-clamp-2 leading-relaxed">
                        {course.shortDescription || course.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-black text-amber-500">${course.price}</span>
                        <span className="flex items-center gap-1 text-xs text-gray-300">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {course.rating?.toFixed(1) || '0.0'}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            /* Fallback subject tiles when no courses yet */
            <div className="grid md:grid-cols-3 gap-6">
              {subjects.map((subject, i) => (
                <motion.div
                  key={subject.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Link
                    to={`/courses?category=${subject.name}`}
                    className="block border border-white/10 p-10 bg-[#1A2D44] hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300"
                  >
                    <div className="text-4xl mb-5">{subject.emoji}</div>
                    <h3 className="text-white font-bold text-lg mb-1 group-hover:text-amber-400 transition-colors">{subject.name}</h3>
                    <div className="flex items-center gap-1 text-amber-500/60 group-hover:text-amber-500 transition-colors text-sm font-medium">
                      Explore <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link to="/courses" className="inline-flex items-center gap-2 text-amber-400 font-semibold text-sm">
              View all courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
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
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Student Stories</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#1A2D44] mt-2">
              Real Students.<br />Real Results.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="group p-8 border border-gray-200 bg-white hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-8 text-sm italic">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-6 border-t border-gray-100">
                  <div className="w-10 h-10 bg-[#1A2D44] flex items-center justify-center font-black text-amber-500 text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-[#1A2D44] text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                  </div>
                </div>
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
                  Start Learning<br />Today. For Free.
                </h2>
                <p className="text-[#1A2D44]/70 text-lg">
                  Create your account and access your first session at no cost.
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
                  Create Free Account <ArrowRight className="w-4 h-4" />
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

      {/* ─── FOOTER ─── */}
      <footer className="bg-[#0f1e2d] text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="grid md:grid-cols-4 gap-12 pb-12 border-b border-white/10">

            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-5">
                <img src="/logo2.png" alt="Joe Academy" className="h-9" />
              </div>
              <p className="text-sm leading-relaxed text-gray-500">
                Your trusted partner in academic excellence. Quality tutoring for students at every level.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-5 text-xs uppercase tracking-widest">Platform</h4>
              <ul className="space-y-3 text-sm">
                {['Courses','About Us','Contact','Blog'].map(l => (
                  <li key={l}>
                    <Link to={`/${l.toLowerCase().replace(' ','-')}`} className="hover:text-amber-400 transition-colors">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-5 text-xs uppercase tracking-widest">Subjects</h4>
              <ul className="space-y-3 text-sm">
                {['Chemistry','Mathematics','Physics','Biology','French','English'].map(s => (
                  <li key={s}>
                    <Link to={`/courses?category=${s}`} className="hover:text-amber-400 transition-colors">
                      {s}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-5 text-xs uppercase tracking-widest">Contact</h4>
              <ul className="space-y-3 text-sm">
                <li>support@joeacademy.com</li>
                <li>+1 (555) 123-4567</li>
                <li>New York, NY 10001</li>
              </ul>
              <div className="flex gap-3 mt-6">
                {['T','I','F','L'].map((s, i) => (
                  <div key={i} className="w-8 h-8 border border-white/10 flex items-center justify-center text-xs font-bold text-gray-500 hover:border-amber-500 hover:text-amber-500 cursor-pointer transition-colors">
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
            <p>&copy; 2025 Joe Academy. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link to="/about" className="hover:text-amber-400 transition-colors">Privacy Policy</Link>
              <Link to="/contact" className="hover:text-amber-400 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;