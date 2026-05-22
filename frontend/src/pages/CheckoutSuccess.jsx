import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CheckCircle, BookOpen, ArrowRight, Home, RefreshCw } from 'lucide-react';

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (sessionId) {
      verifySession();
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  const verifySession = async (retries = 3) => {
    try {
      const response = await axios.get(`/api/purchase/verify-session?session_id=${sessionId}`);
      setCourse(response.data.purchase?.courseId || null);
      setVerified(true);
    } catch (error) {
      console.error('Error verifying session:', error);
      if (retries > 0) {
        setTimeout(() => verifySession(retries - 1), 2000);
      } else {
        setVerified(true); // Still mark as verified to show the message
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[#1A2D44] mb-4">
            Payment Successful!
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Congratulations! Your purchase is complete.
            {!verified && " We're confirming your enrollment..."}
          </p>

          {course && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {course.thumbnail && (
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="text-left flex-1">
                  <h2 className="font-bold text-[#1A2D44] text-lg">{course.title}</h2>
                  <p className="text-gray-500 text-sm">
                    {course.totalLectures || 0} lectures • {Math.floor((course.duration || 0) / 60)} hours
                  </p>
                </div>
              </div>
            </div>
          )}

          {!course && verified && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
              <p className="text-yellow-800 text-sm">
               enrollment is being processed. If you don't see your course in the dashboard within a few minutes, please try refreshing.
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {course && course.type === 'external' && course.externalUrl ? (
              <>
                <a
                  href={course.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-amber-500 text-[#1A2D44] px-8 py-3 font-bold text-sm uppercase tracking-wide hover:bg-amber-400 transition-colors"
                >
                  Go to External Course
                  <ArrowRight className="w-5 h-5" />
                </a>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 text-[#1A2D44] px-8 py-3 font-bold text-sm uppercase tracking-wide hover:border-amber-500 transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                  Refresh Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 bg-amber-500 text-[#1A2D44] px-8 py-3 font-bold text-sm uppercase tracking-wide hover:bg-amber-400 transition-colors"
                >
                  <BookOpen className="w-5 h-5" />
                  Start Learning
                </Link>

                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 text-[#1A2D44] px-8 py-3 font-bold text-sm uppercase tracking-wide hover:border-amber-500 transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                  Refresh Page
                </button>
              </>
            )}
          </div>
        </motion.div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Need help? Contact our support team at support@learnhub.com</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
