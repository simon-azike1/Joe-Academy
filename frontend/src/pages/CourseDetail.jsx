import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  Star, Clock, Users, BookOpen, Play, CheckCircle, 
  Calendar, Video, Award, Shield 
} from 'lucide-react';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isStudent } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`/api/courses/${id}`);
      setCourse(response.data.course);
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Course not found');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }

    if (course.price === 0) {
      // Free courses: enroll directly
      setPurchasing(true);
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
        setPurchasing(false);
      }
      return;
    }

    // Paid courses: go to checkout page
    navigate(`/courses/${id}/checkout`);
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="container-custom">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
            <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) return null;

  const features = [
    { icon: Video, text: `${course.totalLectures || 0} video lectures` },
    { icon: Clock, text: `${Math.floor((course.duration || 0) / 60)} hours of content` },
    { icon: Award, text: 'Certificate of completion' },
    { icon: Shield, text: 'Lifetime access' }
  ];

  return (
    <div className="py-8">
      <div className="container-custom">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <span className="text-amber-600 font-medium uppercase text-sm">
                {course.category}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            
            <p className="text-lg text-gray-600 mb-6">
              {course.description}
            </p>

            <div className="flex items-center gap-4 mb-6">
              <span className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{course.rating?.toFixed(1) || '0.0'}</span>
                <span className="text-gray-500">({course.reviewCount || 0} reviews)</span>
              </span>
              <span className="flex items-center gap-1 text-gray-500">
                <Users className="w-4 h-4" />
                {course.enrollmentCount || 0} students
              </span>
              <span className="capitalize text-gray-500">
                {course.level}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gray-200 rounded-full">
                {course.instructor?.avatar && (
                  <img 
                    src={course.instructor.avatar} 
                    alt={course.instructor.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                )}
              </div>
              <div>
                <p className="font-medium">{course.instructor?.name}</p>
                <p className="text-sm text-gray-500">{course.instructor?.title || 'Instructor'}</p>
              </div>
            </div>

            <div className="card p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">What you'll learn</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {(course.objectives || course.outcomes || []).slice(0, 6).map((objective, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{objective}</span>
                  </div>
                ))}
              </div>
            </div>

            {reviews.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Reviews</h2>
                <div className="space-y-4">
                  {reviews.slice(0, 5).map((review) => (
                    <div key={review._id} className="card p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full">
                          {review.userId?.avatar && (
                            <img 
                              src={review.userId.avatar} 
                              alt={review.userId.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{review.userId?.name}</p>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-gray-600">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20">
              <div className="h-48 bg-gray-200 mb-4 rounded-lg">
                {course.thumbnail && (
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                )}
              </div>

              <div className="text-3xl font-bold mb-4">
                {course.price === 0 ? 'Free' : `$${course.price}`}
              </div>

              <button
                onClick={handlePurchase}
                disabled={purchasing}
                className="btn-amber w-full mb-4"
              >
                {purchasing ? 'Processing...' : course.type === 'external' ? 'Go to Course' : 'Buy Now'}
              </button>

              <div className="space-y-3 mb-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 text-gray-600">
                    <feature.icon className="w-5 h-5 text-gray-400" />
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-500 text-center">
                30-day money-back guarantee
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;