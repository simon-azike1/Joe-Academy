import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Calendar, Clock, Play, Award, Settings, Menu, X, ChevronRight, Home, User, LogOut, Star, Gift, Target, Lock } from 'lucide-react';

const DashboardLayout = ({ children }) => {
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
    { path: '/dashboard', icon: BookOpen, label: 'My Courses', end: true },
    { path: '/dashboard/bookings', icon: Calendar, label: 'Bookings' },
    { path: '/dashboard/profile', icon: User, label: 'Profile' },
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
                  <p className="text-gray-400 text-xs">Student</p>
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

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchasedCourses();
  }, []);

  const fetchPurchasedCourses = async () => {
    try {
      const response = await axios.get('/api/purchase/user');
      // Filter to only show completed and pending_manual_payment purchases
      const purchases = (response.data.purchases || []).filter(p =>
        p.paymentStatus === 'completed' || p.paymentStatus === 'pending_manual_payment'
      );
      setCourses(purchases);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
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
        <p className="text-gray-500 mt-2">Continue learning from where you left off</p>
      </motion.div>
      
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-gray-200 h-64 animate-pulse bg-white"></div>
          ))}
        </div>
       ) : courses.length > 0 ? (
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           {courses.map((purchase, index) => {
             const course = purchase.courseId;
             const isExternal = course?.type === 'external' && course.externalUrl;
             const isPending = purchase.paymentStatus === 'pending_manual_payment';

             return (
               <motion.div
                 key={purchase._id}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: index * 0.1 }}
                 className="group"
               >
                 {isExternal ? (
                   // External courses: only accessible if payment completed
                   isPending ? (
                     <div className="border border-gray-200 bg-white opacity-75 cursor-not-allowed">
                       <div className="h-40 bg-gray-100 relative overflow-hidden">
                         {course.thumbnail ? (
                           <img
                             src={course.thumbnail}
                             alt={course.title}
                             className="w-full h-full object-cover"
                           />
                         ) : (
                           <div className="w-full h-full bg-gradient-to-br from-[#1A2D44] to-[#243d5c] flex items-center justify-center">
                             <BookOpen className="w-10 h-10 text-amber-500/30" />
                           </div>
                         )}
                         <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                           <div className="bg-black/60 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                             <Lock className="w-4 h-4" />
                             <span className="text-sm font-medium">Pending Payment</span>
                           </div>
                         </div>
                       </div>
                       <div className="p-5">
                         <h3 className="font-bold text-[#1A2D44] mb-2 line-clamp-1">{course.title}</h3>
                         <p className="text-gray-500 text-sm mb-4">
                           {course.totalLectures || 0} lectures
                         </p>
                         <p className="text-sm text-amber-600 font-medium">
                           Awaiting lecturer confirmation
                         </p>
                       </div>
                     </div>
                   ) : (
                     <a
                       href={course.externalUrl}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="block border border-gray-200 bg-white hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300"
                     >
                       <div className="h-40 bg-gray-100 relative overflow-hidden">
                         {course.thumbnail ? (
                           <img
                             src={course.thumbnail}
                             alt={course.title}
                             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                           />
                         ) : (
                           <div className="w-full h-full bg-gradient-to-br from-[#1A2D44] to-[#243d5c] flex items-center justify-center">
                             <BookOpen className="w-10 h-10 text-amber-500/30" />
                           </div>
                         )}
                         <div className="absolute inset-0 bg-gradient-to-t from-[#1A2D44]/60 to-transparent" />
                         <div className="absolute bottom-3 left-3">
                           <span className="bg-amber-500 text-[#1A2D44] text-xs font-bold px-2 py-1">
                             {course.category}
                           </span>
                         </div>
                       </div>
                       <div className="p-5">
                         <h3 className="font-bold text-[#1A2D44] mb-2 line-clamp-1">{course.title}</h3>
                         <p className="text-gray-500 text-sm mb-4">
                           {course.totalLectures || 0} lectures
                         </p>
                       <div className="flex items-center gap-2 text-amber-500 font-medium text-sm">
                         Go to Course <ChevronRight className="w-4 h-4" />
                       </div>
                       </div>
                     </a>
                   )
                 ) : (
                   // Internal courses
                   isPending ? (
                     <div className="border border-gray-200 bg-white opacity-75 cursor-not-allowed">
                       <div className="h-40 bg-gray-100 relative overflow-hidden">
                         {course.thumbnail ? (
                           <img
                             src={course.thumbnail}
                             alt={course.title}
                             className="w-full h-full object-cover"
                           />
                         ) : (
                           <div className="w-full h-full bg-gradient-to-br from-[#1A2D44] to-[#243d5c] flex items-center justify-center">
                             <BookOpen className="w-10 h-10 text-amber-500/30" />
                           </div>
                         )}
                         <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                           <div className="bg-black/60 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                             <Lock className="w-4 h-4" />
                             <span className="text-sm font-medium">Pending Payment</span>
                           </div>
                         </div>
                       </div>
                       <div className="p-5">
                         <h3 className="font-bold text-[#1A2D44] mb-2 line-clamp-1">{course.title}</h3>
                         <p className="text-gray-500 text-sm mb-4">
                           {course.totalLectures || 0} lectures
                         </p>
                         <p className="text-sm text-amber-600 font-medium">
                           Awaiting lecturer confirmation
                         </p>
                       </div>
                     </div>
                   ) : (
                     <Link
                       to={`/courses/${course._id}/learn`}
                       className="block border border-gray-200 bg-white hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300"
                     >
                       <div className="h-40 bg-gray-100 relative overflow-hidden">
                         {course.thumbnail ? (
                           <img
                             src={course.thumbnail}
                             alt={course.title}
                             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                           />
                         ) : (
                           <div className="w-full h-full bg-gradient-to-br from-[#1A2D44] to-[#243d5c] flex items-center justify-center">
                             <BookOpen className="w-10 h-10 text-amber-500/30" />
                           </div>
                         )}
                         <div className="absolute inset-0 bg-gradient-to-t from-[#1A2D44]/60 to-transparent" />
                         <div className="absolute bottom-3 left-3">
                           <span className="bg-amber-500 text-[#1A2D44] text-xs font-bold px-2 py-1">
                             {course.category}
                           </span>
                         </div>
                       </div>
                       <div className="p-5">
                         <h3 className="font-bold text-[#1A2D44] mb-2 line-clamp-1">{course.title}</h3>
                         <p className="text-gray-500 text-sm mb-4">
                           {course.totalLectures || 0} lectures
                         </p>
                         <div className="flex items-center gap-2 text-amber-500 font-medium text-sm">
                           Continue Learning <Play className="w-4 h-4" />
                         </div>
                       </div>
                     </Link>
                   )
                )}
               </motion.div>
             );
           })}
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
          <h3 className="text-xl font-bold text-[#1A2D44] mb-2">No courses yet</h3>
          <p className="text-gray-500 mb-6">You haven't purchased any courses yet</p>
          <Link 
            to="/courses" 
            className="inline-flex items-center gap-2 bg-amber-500 text-[#1A2D44] px-6 py-3 font-bold text-sm uppercase tracking-wide hover:bg-amber-400 transition-colors"
          >
            Browse Courses <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      )}
    </div>
  );

};

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/bookings/user');
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
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
        <h1 className="text-2xl md:text-3xl font-black text-[#1A2D44]">My Bookings</h1>
        <p className="text-gray-500 mt-2">View your scheduled mentorship sessions</p>
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
                <h3 className="font-bold text-[#1A2D44] mb-1">{booking.topic || 'Mentorship Session'}</h3>
                <p className="text-gray-500 text-sm">
                  {new Date(booking.date).toLocaleDateString()} at {booking.time}
                </p>
                <p className="text-gray-500 text-sm">
                  with {booking.instructorId?.name}
                </p>
              </div>
              <span className={`px-4 py-2 text-sm font-medium capitalize ${getStatusColor(booking.status)}`}>
                {booking.status}
              </span>
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

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    title: user?.title || ''
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put('/api/auth/profile', formData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  // Calculate stats
  const completedCoursesCount = user?.completedCourses?.length || 0;
  const totalCredits = user?.credits || 0;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-black text-[#1A2D44]">Profile Settings</h1>
        <p className="text-gray-500 mt-2">Update your personal information</p>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-gray-200 p-6 rounded-xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A2D44]">{user?.purchasedCourses?.length || 0}</p>
              <p className="text-sm text-gray-500">Courses Purchased</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-gray-200 p-6 rounded-xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A2D44]">{completedCoursesCount}</p>
              <p className="text-sm text-gray-500">Courses Completed</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-gray-200 p-6 rounded-xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A2D44]">{totalCredits}</p>
              <p className="text-sm text-gray-500">Credits Earned</p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="border border-gray-200 bg-white p-6 md:p-8 max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#1A2D44] mb-2 uppercase tracking-wide">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-[#1A2D44] mb-2 uppercase tracking-wide">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-[#1A2D44] mb-2 uppercase tracking-wide">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              placeholder="e.g. Software Developer"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-[#1A2D44] mb-2 uppercase tracking-wide">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              rows={4}
              placeholder="Tell us about yourself..."
            />
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="bg-amber-500 text-[#1A2D44] px-8 py-3 font-bold text-sm uppercase tracking-wide hover:bg-amber-400 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<MyCourses />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;