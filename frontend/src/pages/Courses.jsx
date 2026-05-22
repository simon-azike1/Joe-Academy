import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Clock, Users, BookOpen, Filter, X, ChevronDown, ArrowRight } from 'lucide-react';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'Chemistry',
    'Mathematics',
    'Biology',
    'Physics',
    'French',
    'English',
    'GIS',
    'Remote Sensing'
  ];

  const levels = ['beginner', 'intermediate', 'advanced'];

  useEffect(() => {
    fetchCourses();
  }, [search, category, level, page]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (level) params.append('level', level);
      params.append('page', page);
      params.append('limit', 12);

      const response = await axios.get(`/api/courses?${params.toString()}`);
      setCourses(response.data.courses || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setLevel('');
    setPage(1);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    return hours > 0 ? `${hours}h` : `${minutes}m`;
  };

  return (
    <div className="font-sans min-h-screen">

      {/* ─── HERO ─── */}
      <section className="relative bg-[#1A2D44] text-white overflow-hidden py-20">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 80px, #F9A825 80px, #F9A825 81px),
                              repeating-linear-gradient(90deg, transparent, transparent 80px, #F9A825 80px, #F9A825 81px)`
          }}
        />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full filter blur-[100px] -translate-y-1/3 translate-x-1/3" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <div className="inline-block border-l-4 border-amber-500 pl-4 mb-6 text-left mx-auto" style={{ width: 'fit-content' }}>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Our Courses</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
              Explore Our<br /><span className="text-amber-500">Courses</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Discover courses designed to help you achieve your academic goals with expert-led instruction.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses by name, topic, or skill..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-gray-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      {/* ─── FILTERS ─── */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-amber-500 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              {(category || level) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-amber-600 hover:text-amber-800 flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Clear
                </button>
              )}
            </div>
            <p className="text-gray-600 font-medium">
              {courses.length} {courses.length === 1 ? 'course' : 'courses'} found
            </p>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white p-6 shadow-sm border border-gray-100 mt-4">
                  <div className="flex flex-wrap gap-6">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <div className="relative">
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="">All Categories</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                      <div className="relative">
                        <select
                          value={level}
                          onChange={(e) => setLevel(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="">All Levels</option>
                          {levels.map((lvl) => (
                            <option key={lvl} value={lvl}>{lvl.charAt(0).toUpperCase() + lvl.slice(1)}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ─── COURSES GRID ─── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 border border-gray-200">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="border border-gray-200 h-80 animate-pulse bg-white" />
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {courses.map((course, index) => (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    layout
                    className="group"
                  >
                    <Link 
                      to={`/courses/${course._id}`}
                      className="block border border-gray-200 bg-white hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300"
                    >
                      <div className="relative h-52 overflow-hidden">
                        {course.thumbnail ? (
                          <img 
                            src={course.thumbnail} 
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
                        {course.isFeatured && (
                          <span className="absolute top-4 right-4 bg-[#1A2D44] text-white text-xs font-bold px-3 py-1 uppercase tracking-wide">
                            Featured
                          </span>
                        )}
                      </div>

                      <div className="p-5 bg-white group-hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium text-amber-600 uppercase tracking-wide">
                            {course.category}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500 capitalize">
                            {course.level}
                          </span>
                        </div>

                        <h3 className="font-bold text-[#1A2D44] mb-2 line-clamp-1 group-hover:text-amber-600 transition-colors">
                          {course.title}
                        </h3>

                        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                          {course.shortDescription || course.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDuration(course.duration)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {course.enrollmentCount || 0}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="font-bold text-[#1A2D44]">
                              {course.rating?.toFixed(1) || '0.0'}
                            </span>
                            <span className="text-gray-400 text-sm">
                              ({course.reviewCount || 0})
                            </span>
                          </div>
                          <div className="text-right">
                            {course.originalPrice && course.originalPrice > course.price && (
                              <span className="text-sm text-gray-400 line-through mr-2">
                                ${course.originalPrice}
                              </span>
                            )}
                            <span className="text-xl font-black text-amber-500">
                              ${course.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white border border-gray-200"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-[#1A2D44] mb-2">No courses found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-amber-500 text-[#1A2D44] font-bold text-sm uppercase tracking-wide hover:bg-amber-400 transition-colors inline-flex items-center gap-2"
              >
                Clear all filters <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-2 mt-12"
            >
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white border border-gray-200 hover:border-amber-500 disabled:opacity-50"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 font-bold text-sm ${
                      page === i + 1
                        ? 'bg-amber-500 text-[#1A2D44]'
                        : 'bg-white border border-gray-200 hover:border-amber-500'
                    } transition-colors`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-white border border-gray-200 hover:border-amber-500 disabled:opacity-50"
              >
                Next
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Courses;