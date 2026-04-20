import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Award, BookOpen, Star, Calendar, ArrowRight, GraduationCap } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Lecturers = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const res = await axios.get('/api/auth/instructors');
      setInstructors(res.data.instructors || []);
    } catch (error) {
      console.error('Error fetching instructors:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayInstructors = instructors;

  return (
    <div className="font-sans">

      {/* ─── HERO ─── */}
      <section className="relative bg-[#1A2D44] text-white overflow-hidden min-h-[50vh] flex items-center">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 80px, #F9A825 80px, #F9A825 81px),
                              repeating-linear-gradient(90deg, transparent, transparent 80px, #F9A825 80px, #F9A825 81px)`
          }}
        />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full filter blur-[100px] -translate-y-1/3 translate-x-1/3" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-block border-l-4 border-amber-500 pl-4 mb-6 text-left mx-auto" style={{ width: 'fit-content' }}>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Our Team</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
              Learn From<br /><span className="text-amber-500">Expert Tutors</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Our tutors are carefully selected for their expertise, teaching ability, and dedication to student success.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      {/* ─── STATS ─── */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-gray-200">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center py-8 px-4"
            >
              <p className="text-4xl font-black text-[#1A2D44] mb-1">50+</p>
              <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Expert Tutors</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center py-8 px-4"
            >
              <p className="text-4xl font-black text-[#1A2D44] mb-1">5,000+</p>
              <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Students</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center py-8 px-4"
            >
              <p className="text-4xl font-black text-[#1A2D44] mb-1">95%</p>
              <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Satisfaction</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── INSTRUCTORS GRID ─── */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block border-l-4 border-amber-500 pl-4 mb-4 text-left mx-auto" style={{ width: 'fit-content' }}>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Meet Our Tutors</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#1A2D44]">
              Dedicated to Your<br /><span className="text-amber-500">Success</span>
            </h2>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border border-gray-200 h-80 animate-pulse bg-gray-50" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayInstructors.map((instructor, index) => (
                <motion.div
                  key={instructor._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="group bg-white border border-gray-200 hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300"
                >
                  <div className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="relative">
                        {instructor.avatar ? (
                          <img
                            src={instructor.avatar}
                            alt={instructor.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-amber-500"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-[#1A2D44] flex items-center justify-center border-2 border-amber-500">
                            <span className="text-lg font-black text-amber-500">
                              {instructor.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        )}
                        {instructor.rating && (
                          <div className="absolute -bottom-1 -right-1 bg-amber-500 text-[#1A2D44] text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            {instructor.rating}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-[#1A2D44] text-lg">{instructor.name}</h3>
                        <p className="text-amber-600 font-medium text-sm">{instructor.title}</p>
                        {instructor.students && (
                          <p className="text-gray-400 text-xs mt-1">{instructor.students}+ students</p>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-500 text-sm mb-5 line-clamp-3">{instructor.bio}</p>
                    
                    {instructor.expertise && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {instructor.expertise.slice(0, 3).map((skill, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <a
                        href={`mailto:${instructor.email}`}
                        className="flex items-center gap-2 text-gray-500 hover:text-amber-600 text-sm font-medium transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        Contact
                      </a>
                      <Link 
                        to={`/courses?instructor=${instructor._id}`}
                        className="flex items-center gap-2 text-[#1A2D44] hover:text-amber-600 text-sm font-medium transition-colors ml-auto"
                      >
                        View Courses <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section className="py-0 overflow-hidden">
        <div className="bg-[#1A2D44] relative">
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 80px, #F9A825 80px, #F9A825 81px),
                                repeating-linear-gradient(90deg, transparent, transparent 80px, #F9A825 80px, #F9A825 81px)`
            }}
          />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full filter blur-[80px]" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
                  Become an<br /><span className="text-amber-500">Instructor</span>
                </h2>
                <p className="text-gray-400 text-lg">
                  Join our team of expert tutors and share your knowledge with thousands of students.
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
                  to="/register?role=instructor"
                  className="inline-flex items-center justify-center gap-2 bg-amber-500 text-[#1A2D44] px-8 py-4 font-bold text-sm uppercase tracking-wide hover:bg-amber-400 transition-colors"
                >
                  <GraduationCap className="w-4 h-4" />
                  Apply Now
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 border border-amber-500/40 text-amber-400 px-8 py-4 font-bold text-sm uppercase tracking-wide hover:bg-amber-500/10 transition-colors"
                >
                  Learn More
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Lecturers;