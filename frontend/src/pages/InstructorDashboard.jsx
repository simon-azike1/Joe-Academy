import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Plus, BookOpen, Users, DollarSign, Calendar, Settings, Trash, Edit, Eye, ArrowLeft, Menu, X, LogOut, BarChart3, CheckCircle, MessageCircle, Phone } from 'lucide-react';

const InstructorLayout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

   const navItems = [
     { path: '/instructor', icon: BookOpen, label: 'My Courses', end: true },
     { path: '/instructor/orders', icon: CheckCircle, label: 'Orders' },
     { path: '/instructor/bookings', icon: Calendar, label: 'Bookings' },
     { path: '/instructor/create', icon: Plus, label: 'Create Course' },
   ];

  const isActive = (path, end) => {
    if (end) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="font-sans min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#1A2D44] z-50 flex items-center justify-between px-4">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-white hover:text-amber-500"
        >
          <Menu className="w-6 h-6" />
        </button>
        <Link to="/">
          <img src="/logo2.png" alt="Joe Academy" className="h-8" />
        </Link>
        <div className="w-10" />
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full bg-[#1A2D44] transition-all duration-300
        ${isMobile 
          ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') 
          : (sidebarOpen ? 'w-64' : 'w-20')}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-3 flex items-center border-b border-white/10 bg-[#14293a]">
            <button 
              onClick={() => isMobile ? closeSidebar : setSidebarOpen(!sidebarOpen)}
              className="p-2 text-gray-300 hover:text-amber-500 transition-colors"
            >
              {isMobile ? <X className="w-5 h-5" /> : (sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />)}
            </button>
            {(sidebarOpen || isMobile) && (
              <Link to="/" className="flex items-center gap-2 ml-2" onClick={closeSidebar}>
                <img src="/logo2.png" alt="Joe Academy" className="h-8" />
              </Link>
            )}
          </div>

          {/* User Info */}
          {(sidebarOpen || isMobile) && (
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-[#1A2D44]">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{user?.name}</p>
                  <p className="text-gray-400 text-xs">Instructor</p>
                </div>
              </div>
            </div>
          )}

          {/* Stats Summary */}
          {(sidebarOpen || isMobile) && (
            <div className="p-4 border-b border-white/10">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 p-3 text-center">
                  <DollarSign className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                  <p className="text-white font-bold text-lg">$0</p>
                  <p className="text-gray-400 text-xs">Revenue</p>
                </div>
                <div className="bg-white/5 p-3 text-center">
                  <Users className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                  <p className="text-white font-bold text-lg">0</p>
                  <p className="text-gray-400 text-xs">Students</p>
                </div>
              </div>
            </div>
          )}

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`flex items-center gap-3 px-4 py-3 transition-all duration-300 ${
                  isActive(item.path, item.end)
                    ? 'bg-amber-500 text-[#1A2D44]'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
                end={item.end ? "true" : undefined}
                onClick={isMobile ? closeSidebar : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {(sidebarOpen || isMobile) && <span className="font-medium text-sm">{item.label}</span>}
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <Link 
              to="/" 
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              {(sidebarOpen || isMobile) && <span className="font-medium text-sm">Logout</span>}
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`
        flex-1 transition-all duration-300 pt-16 md:pt-0
        ${isMobile 
          ? 'ml-0' 
          : (sidebarOpen ? 'md:ml-64' : 'md:ml-20')}
      `}>
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

const InstructorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, statsRes] = await Promise.all([
        axios.get('/api/courses/instructor'),
        axios.get('/api/dashboard/stats')
      ]);
      setCourses(coursesRes.data.courses || []);
      setStats(statsRes.data.stats);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    try {
      await axios.delete(`/api/courses/${courseId}`);
      toast.success('Course deleted');
      setCourses(courses.filter(c => c._id !== courseId));
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const togglePublish = async (courseId) => {
    try {
      const response = await axios.put(`/api/courses/${courseId}/publish`);
      toast.success(response.data.message);
      fetchData();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-black text-[#1A2D44]">My Courses</h1>
        <p className="text-gray-500 mt-2">Manage your courses and track performance</p>
      </motion.div>

      {stats && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
        >
          <div className="border border-gray-200 bg-white p-4 md:p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#1A2D44] flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-gray-500 text-xs md:text-sm">Total Courses</span>
            </div>
            <div className="text-xl md:text-2xl font-black text-[#1A2D44]">{stats.coursesCount || 0}</div>
          </div>
          <div className="border border-gray-200 bg-white p-4 md:p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-500 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-[#1A2D44]" />
              </div>
              <span className="text-gray-500 text-xs md:text-sm">Students</span>
            </div>
            <div className="text-xl md:text-2xl font-black text-[#1A2D44]">{stats.totalStudents || 0}</div>
          </div>
          <div className="border border-gray-200 bg-white p-4 md:p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-500 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-500 text-xs md:text-sm">Revenue</span>
            </div>
            <div className="text-xl md:text-2xl font-black text-[#1A2D44]">${(stats.totalRevenue || 0).toLocaleString()}</div>
          </div>
          <div className="border border-gray-200 bg-white p-4 md:p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-yellow-500 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-500 text-xs md:text-sm">Bookings</span>
            </div>
            <div className="text-xl md:text-2xl font-black text-[#1A2D44]">{stats.pendingBookings || 0}</div>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-gray-200 h-24 animate-pulse bg-white"></div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border border-gray-200 bg-white overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-bold text-[#1A2D44] text-sm uppercase tracking-wide">Course</th>
                  <th className="text-left p-4 font-bold text-[#1A2D44] text-sm uppercase tracking-wide">Students</th>
                  <th className="text-left p-4 font-bold text-[#1A2D44] text-sm uppercase tracking-wide">Price</th>
                  <th className="text-left p-4 font-bold text-[#1A2D44] text-sm uppercase tracking-wide">Status</th>
                  <th className="text-right p-4 font-bold text-[#1A2D44] text-sm uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course._id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-[#1A2D44]">{course.title}</div>
                      <div className="text-sm text-gray-500">{course.category}</div>
                    </td>
                    <td className="p-4 text-gray-600">{course.enrollmentCount || 0}</td>
                    <td className="p-4 font-bold text-amber-500">${course.price}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-sm font-medium ${
                        course.isPublished 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {course.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => togglePublish(course._id)}
                          className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                          title={course.isPublished ? 'Unpublish' : 'Publish'}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <Link
                          to={`/instructor/edit/${course._id}`}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => deleteCourse(course._id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {courses.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-[#1A2D44] mb-2">No courses yet</h3>
              <p className="text-gray-500 mb-6">You haven't created any courses yet</p>
              <Link 
                to="/instructor/create" 
                className="inline-flex items-center gap-2 bg-amber-500 text-[#1A2D44] px-6 py-3 font-bold text-sm uppercase tracking-wide hover:bg-amber-400 transition-colors"
              >
                <Plus className="w-4 h-4" /> Create Your First Course
              </Link>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

const CreateCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    price: '',
    category: '',
    level: 'beginner',
    lecturerWhatsApp: ''
  });
  const [saving, setSaving] = useState(false);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await axios.post('/api/courses', formData);
      toast.success('Course created!');
      navigate(`/instructor/edit/${response.data.course._id}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create course');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-black text-[#1A2D44]">Create New Course</h1>
        <p className="text-gray-500 mt-2">Fill in the details to create a new course</p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="border border-gray-200 bg-white p-6 md:p-8 max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#1A2D44] mb-2 uppercase tracking-wide">
              Course Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              placeholder="e.g. Complete Web Development Bootcamp"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#1A2D44] mb-2 uppercase tracking-wide">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-[#1A2D44] mb-2 uppercase tracking-wide">
                Price *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholder="0"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1A2D44] mb-2 uppercase tracking-wide">
                Level
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="all-levels">All Levels</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#1A2D44] mb-2 uppercase tracking-wide">
              Short Description
            </label>
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholder="Brief summary for course cards"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1A2D44] mb-2 uppercase tracking-wide">
                Lecturer WhatsApp Number
              </label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="lecturerWhatsApp"
                    value={formData.lecturerWhatsApp || ''}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="+1234567890 (include country code)"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Required for WhatsApp payments. Students will send payment to this number.
              </p>
           </div>

           <div>
             <label className="block text-sm font-bold text-[#1A2D44] mb-2 uppercase tracking-wide">
               Lecturer WhatsApp Number
             </label>
             <div className="flex items-center gap-3">
               <div className="relative flex-1">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <Phone className="w-5 h-5 text-gray-400" />
                 </div>
                 <input
                   type="tel"
                   name="lecturerWhatsApp"
                   value={formData.lecturerWhatsApp || ''}
                   onChange={handleChange}
                   className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                   placeholder="+1234567890 (include country code)"
                 />
               </div>
             </div>
             <p className="text-xs text-gray-500 mt-1">
               Required for WhatsApp payments. Students will send payment to this number.
             </p>
           </div>

           <div>
             <label className="block text-sm font-bold text-[#1A2D44] mb-2 uppercase tracking-wide">
               Full Description *
             </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              rows={6}
              placeholder="Detailed course description..."
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="bg-amber-500 text-[#1A2D44] px-8 py-3 font-bold text-sm uppercase tracking-wide hover:bg-amber-400 transition-colors disabled:opacity-50 w-full md:w-auto"
          >
            {saving ? 'Creating...' : 'Create Course'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showLectureForm, setShowLectureForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    price: '',
    category: '',
    level: 'beginner',
    thumbnail: '',
    requirements: [],
    objectives: [],
    lecturerWhatsApp: ''
  });

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

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`/api/courses/${id}`);
      setFormData(response.data.course);
    } catch (error) {
      toast.error('Failed to load course');
      navigate('/instructor');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await axios.put(`/api/courses/${id}`, formData);
      toast.success('Course updated!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update course');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <button 
          onClick={() => navigate('/instructor')} 
          className="flex items-center gap-2 text-gray-500 hover:text-[#1A2D44] mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Courses
        </button>
        <h1 className="text-2xl md:text-3xl font-black text-[#1A2D44]">Edit Course</h1>
        <p className="text-gray-500 mt-2">Update your course details</p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="border border-gray-200 bg-white p-6 md:p-8 max-w-2xl mb-8"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#1A2D44] mb-2 uppercase tracking-wide">
              Course Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#1A2D44] mb-2 uppercase tracking-wide">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-[#1A2D44] mb-2 uppercase tracking-wide">
                Price *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1A2D44] mb-2 uppercase tracking-wide">
                Level
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="all-levels">All Levels</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#1A2D44] mb-2 uppercase tracking-wide">
              Short Description
            </label>
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#1A2D44] mb-2 uppercase tracking-wide">
              Full Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              rows={6}
              required
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <button 
              type="submit" 
              disabled={saving}
              className="bg-amber-500 text-[#1A2D44] px-8 py-3 font-bold text-sm uppercase tracking-wide hover:bg-amber-400 transition-colors disabled:opacity-50 flex-1"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/instructor')} 
              className="border border-gray-200 text-gray-600 px-8 py-3 font-bold text-sm uppercase tracking-wide hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6 flex-col md:flex-row gap-4">
          <h2 className="text-xl font-bold text-[#1A2D44]">Course Lectures</h2>
          <button 
            onClick={() => setShowLectureForm(!showLectureForm)}
            className="bg-amber-500 text-[#1A2D44] px-6 py-3 font-bold text-sm uppercase tracking-wide hover:bg-amber-400 transition-colors inline-flex items-center gap-2 w-full md:w-auto justify-center"
          >
            <Plus className="w-4 h-4" /> Add Lecture
          </button>
        </div>
        
        {showLectureForm && <LectureForm courseId={id} onComplete={() => { setShowLectureForm(false); }} />}
      </motion.div>
    </div>
  );
};

const LectureForm = ({ courseId, onComplete }) => {
  const [formData, setFormData] = useState({ title: '', description: '', videoUrl: '', duration: 30, isFree: false });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post(`/api/lectures/${courseId}`, formData);
      toast.success('Lecture added!');
      onComplete();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add lecture');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border border-gray-200 bg-white p-6 mb-6">
      <h3 className="font-bold text-[#1A2D44] mb-4">Add New Lecture</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" 
          name="title" 
          value={formData.title} 
          onChange={handleChange} 
          placeholder="Lecture title" 
          className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          required 
        />
        <textarea 
          name="description" 
          value={formData.description} 
          onChange={handleChange} 
          placeholder="Description" 
          className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          rows={2} 
        />
        <input 
          type="text" 
          name="videoUrl" 
          value={formData.videoUrl} 
          onChange={handleChange} 
          placeholder="Video URL" 
          className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
        <div className="grid grid-cols-2 gap-4">
          <input 
            type="number" 
            name="duration" 
            value={formData.duration} 
            onChange={handleChange} 
            placeholder="Duration (min)" 
            className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            min="1" 
          />
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              name="isFree" 
              checked={formData.isFree} 
              onChange={handleChange} 
              className="w-4 h-4 text-amber-500 border-gray-300 focus:ring-amber-500" 
            />
            <span className="text-gray-600">Free preview</span>
          </label>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <button 
            type="submit" 
            disabled={saving} 
            className="bg-amber-500 text-[#1A2D44] px-6 py-2 font-bold text-sm uppercase tracking-wide hover:bg-amber-400 transition-colors disabled:opacity-50 flex-1"
          >
            {saving ? 'Adding...' : 'Add Lecture'}
          </button>
          <button 
            type="button" 
            onClick={onComplete} 
            className="border border-gray-200 text-gray-600 px-6 py-2 font-bold text-sm uppercase tracking-wide hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const LectureList = ({ courseId }) => {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', videoUrl: '', duration: 30, isFree: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLectures();
  }, [courseId]);

  const fetchLectures = async () => {
    try {
      const response = await axios.get(`/api/lectures/${courseId}`);
      setLectures(response.data.lectures || []);
    } catch (error) {
      console.error('Error fetching lectures:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [type === 'checkbox' ? 'isFree' : name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post(`/api/lectures/${courseId}`, formData);
      toast.success('Lecture added!');
      setFormData({ title: '', description: '', videoUrl: '', duration: 30, isFree: false });
      setShowForm(false);
      fetchLectures();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add lecture');
    } finally {
      setSaving(false);
    }
  };

  const deleteLecture = async (lectureId) => {
    if (!confirm('Delete this lecture?')) return;
    try {
      await axios.delete(`/api/lectures/${lectureId}`);
      toast.success('Lecture deleted');
      setLectures(lectures.filter(l => l._id !== lectureId));
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  if (loading) {
    return <div className="border border-gray-200 h-20 animate-pulse bg-white"></div>;
  }

  return (
    <div>
      {showForm && (
        <div className="border border-gray-200 bg-white p-4 mb-4">
          <h3 className="font-bold text-[#1A2D44] mb-3">Add New Lecture</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Lecture title" className="w-full px-4 py-2 border border-gray-200" required />
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full px-4 py-2 border border-gray-200" rows={2} />
            <input type="text" name="videoUrl" value={formData.videoUrl} onChange={handleChange} placeholder="Video URL" className="w-full px-4 py-2 border border-gray-200" />
            <div className="grid grid-cols-2 gap-3">
              <input type="number" name="duration" value={formData.duration} onChange={handleChange} placeholder="Duration (min)" className="w-full px-4 py-2 border border-gray-200" min="1" />
              <label className="flex items-center gap-2">
                <input type="checkbox" name="isFree" checked={formData.isFree} onChange={handleChange} className="w-4 h-4" />
                Free preview
              </label>
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="bg-amber-500 text-[#1A2D44] px-4 py-2 font-bold text-sm">Add Lecture</button>
              <button type="button" onClick={() => setShowForm(false)} className="border border-gray-200 px-4 py-2">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {lectures.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No lectures yet. Click "Add Lecture" to create one.</p>
      ) : (
        <div className="space-y-2">
          {lectures.map((lecture, index) => (
            <div key={lecture._id} className="border border-gray-200 bg-white p-4 flex items-center justify-between hover:shadow-md transition-shadow flex-col md:flex-row gap-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-amber-500 text-[#1A2D44] rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <div>
                  <div className="font-bold text-[#1A2D44]">{lecture.title}</div>
                  <div className="text-sm text-gray-500">{lecture.duration} min {lecture.isFree && <span className="text-green-600 ml-2">Free</span>}</div>
                </div>
              </div>
              <button onClick={() => deleteLecture(lecture._id)} className="p-2 text-gray-500 hover:text-red-600 transition-colors">
                <Trash className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const InstructorBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/bookings/instructor');
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId, status) => {
    try {
      await axios.put(`/api/bookings/${bookingId}`, { status });
      toast.success('Booking updated');
      fetchBookings();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-black text-[#1A2D44]">Bookings</h1>
        <p className="text-gray-500 mt-2">Manage your student bookings</p>
      </motion.div>
      
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-gray-200 h-24 animate-pulse bg-white"></div>
          ))}
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking, index) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 bg-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300"
            >
              <div>
                <h3 className="font-bold text-[#1A2D44] mb-1">{booking.userId?.name}</h3>
                <p className="text-gray-500 text-sm">
                  {new Date(booking.date).toLocaleDateString()} at {booking.time}
                </p>
                <p className="text-gray-500 text-sm">{booking.topic || 'Mentorship Session'}</p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <span className={`px-4 py-2 text-sm font-medium capitalize ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
                {booking.status === 'pending' && (
                  <button
                    onClick={() => updateStatus(booking._id, 'confirmed')}
                    className="bg-amber-500 text-[#1A2D44] px-4 py-2 font-bold text-sm hover:bg-amber-400 transition-colors w-full sm:w-auto"
                  >
                    Confirm
                  </button>
                )}
                {booking.status === 'confirmed' && (
                  <button
                    onClick={() => updateStatus(booking._id, 'completed')}
                    className="border border-gray-200 text-gray-600 px-4 py-2 font-bold text-sm hover:bg-gray-50 transition-colors w-full sm:w-auto"
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 bg-white border border-gray-200"
        >
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-[#1A2D44] mb-2">No bookings</h3>
          <p className="text-gray-500">You don't have any bookings yet</p>
        </motion.div>
      )}
    </div>
   );
 };

const InstructorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/purchase/lecturer-orders');
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (orderId) => {
    setConfirmingId(orderId);
    try {
      await axios.post(`/api/purchase/confirm-manual/${orderId}`);
      toast.success('Payment confirmed! Student now has access.');
      // Remove from local state
      setOrders(orders.filter(o => o._id !== orderId));
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to confirm payment');
    } finally {
      setConfirmingId(null);
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-black text-[#1A2D44]">Pending Orders</h1>
        <p className="text-gray-500 mt-2">Manual WhatsApp payments awaiting confirmation</p>
      </motion.div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-gray-200 h-24 animate-pulse bg-white"></div>
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border border-gray-200 bg-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-lg transition-all"
            >
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {order.courseId?.thumbnail ? (
                      <img src={order.courseId.thumbnail} alt="" className="w-full h-full object-cover rounded" />
                    ) : (
                      <BookOpen className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1A2D44] mb-1">{order.courseId?.title || 'Unknown Course'}</h3>
                    <p className="text-sm text-gray-500">
                      Student: {order.userId?.name || 'Unknown'} ({order.userId?.email || 'N/A'})
                    </p>
                    <p className="text-sm text-gray-500">
                      Order ID: {order.manualPaymentReference}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Placed: {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#1A2D44]">${order.amount?.toFixed(2) || '0.00'}</p>
                  <span className="inline-block mt-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                    Pending Confirmation
                  </span>
                </div>
                <button
                  onClick={() => handleConfirm(order._id)}
                  disabled={confirmingId === order._id}
                  className="bg-green-500 text-white px-6 py-3 font-bold text-sm uppercase tracking-wide hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {confirmingId === order._id ? (
                    'Confirming...'
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Confirm Payment
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 bg-white border border-gray-200"
        >
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-[#1A2D44] mb-2">No pending orders</h3>
          <p className="text-gray-500">All WhatsApp payments have been processed</p>
        </motion.div>
      )}
    </div>
  );
};

const InstructorDashboard = () => {
  return (
    <InstructorLayout>
      <Routes>
        <Route index element={<InstructorCourses />} />
        <Route path="create" element={<CreateCourse />} />
        <Route path="edit/:id" element={<EditCourse />} />
        <Route path="orders" element={<InstructorOrders />} />
        <Route path="bookings" element={<InstructorBookings />} />
      </Routes>
    </InstructorLayout>
  );
};

export default InstructorDashboard;