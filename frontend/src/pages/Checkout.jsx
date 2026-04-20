import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  CheckCircle, 
  BookOpen, 
  ArrowRight, 
  Home, 
  Shield, 
  Lock,
  ArrowLeft,
  MessageCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${id}/checkout` } });
      return;
    }
    fetchCourse();
  }, [id, isAuthenticated]);

   const fetchCourse = async () => {
     try {
       const response = await axios.get(`/api/courses/${id}`);
       setCourse(response.data.course);
     } catch (error) {
       console.error('Error fetching course:', error);
       toast.error('Course not found');
       navigate('/courses');
     } finally {
       setLoading(false);
     }
   };

   const handleFreeEnrollment = async () => {
    setProcessing(true);
    try {
      const response = await axios.post('/api/purchase', { courseId: id });
      toast.success(response.data.message || 'Enrolled successfully!');

      if (course.type === 'external' && course.externalUrl) {
        window.location.href = course.externalUrl;
      } else {
        navigate('/dashboard/courses');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Enrollment failed');
      setProcessing(false);
    }
  };

  const handleWhatsAppPayment = async () => {
    setProcessing(true);
    try {
      const response = await axios.post('/api/purchase/whatsapp-order', { courseId: id });

      if (response.data.success) {
        toast.success(
          <div>
            <div className="font-bold">Order Placed!</div>
            <div className="text-sm">Check your WhatsApp for payment instructions.</div>
          </div>,
          { icon: '📱', duration: 6000 }
        );

        setTimeout(() => {
          navigate('/dashboard/courses');
        }, 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create order');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!course) return null;

  const totalLectures = course.totalLectures || 0;
  const totalHours = Math.floor((course.duration || 0) / 60);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1A2D44] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to course
        </button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left - Course summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <div className="h-48 bg-gray-200 relative">
                {course.thumbnail ? (
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1A2D44] to-[#243d5c] flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-amber-500/30" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="bg-amber-500 text-[#1A2D44] text-xs font-bold px-3 py-1 uppercase tracking-wide">
                    {course.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h1 className="text-2xl font-bold text-[#1A2D44] mb-3">
                  {course.title}
                </h1>

                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {course.shortDescription || course.description?.substring(0, 200)}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <BookOpen className="w-5 h-5 text-amber-500" />
                    <span>{totalLectures} lectures</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Lock className="w-5 h-5 text-amber-500" />
                    <span>Lifetime access</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Shield className="w-5 h-5 text-amber-500" />
                    <span>30-day money-back guarantee</span>
                  </div>
                </div>

                {course.instructor && (
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="w-10 h-10 bg-[#1A2D44] rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-amber-500">
                        {course.instructor.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1A2D44]">{course.instructor.name}</p>
                      <p className="text-xs text-gray-500">{course.instructor.title || 'Instructor'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right - Checkout card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 sticky top-20">
              <div className="mb-6">
                <div className="text-4xl font-black text-[#1A2D44] mb-2">
                  {course.price === 0 ? 'Free' : `$${course.price}`}
                </div>
                {course.originalPrice && course.originalPrice > course.price && (
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-gray-400 line-through">${course.originalPrice}</span>
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 uppercase">
                      Save ${(course.originalPrice - course.price).toFixed(0)}
                    </span>
                  </div>
                )}
              </div>

               {/* Main Payment Button - Free or WhatsApp */}
               <div className="mb-6">
                 {course.price === 0 ? (
                   <button
                     onClick={handleFreeEnrollment}
                     disabled={processing}
                     className="w-full bg-amber-500 text-[#1A2D44] font-bold uppercase tracking-wide py-4 hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                   >
                     {processing ? 'Processing...' : (
                       <>Enroll Now <CheckCircle className="w-5 h-5" /></>
                     )}
                   </button>
                 ) : (
                   <button
                     onClick={handleWhatsAppPayment}
                     disabled={processing}
                     className="w-full bg-[#25D366] text-white font-bold uppercase tracking-wide py-4 hover:bg-[#20BD5A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                   >
                     {processing ? (
                       'Processing...'
                     ) : (
                       <>Pay via WhatsApp <MessageCircle className="w-5 h-5" /></>
                     )}
                   </button>
                 )}
               </div>

               {/* Payment method info */}
               {course.price > 0 && (
                 <div className="flex items-center justify-center gap-2 text-gray-500 text-xs mb-6">
                   <Lock className="w-4 h-4" />
                   <span>Manual payment via WhatsApp — lecturer will contact you</span>
                 </div>
               )}

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600">
                    Instant access to all course materials
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600">
                    Watch on any device, anytime
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600">
                    Certificate upon completion
                  </p>
                </div>
              </div>

              {course.type === 'external' && course.externalUrl && (
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-[#1A2D44] font-semibold mb-2">
                    External Course
                  </p>
                  <p className="text-xs text-gray-600 mb-3">
                    This course is hosted on an external platform. After purchase, you'll be redirected to access it.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
