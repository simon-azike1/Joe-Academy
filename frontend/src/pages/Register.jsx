import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { User, Mail, Lock, GraduationCap, Eye, EyeOff, ArrowRight, BookOpen, Users, Award, Globe, Phone } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await register(formData.name, formData.email, formData.password, formData.role);
      toast.success('Account created successfully!');
      
      if (formData.role === 'instructor') {
        navigate('/instructor');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: BookOpen, text: 'Access 50+ expert courses' },
    { icon: Users, text: 'Personalized learning paths' },
    { icon: Award, text: 'Earn recognized certificates' },
    { icon: Globe, text: 'Learn at your own pace' },
  ];

  return (
    <div className="font-sans min-h-screen flex">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1A2D44] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 80px, #F9A825 80px, #F9A825 81px),
                              repeating-linear-gradient(90deg, transparent, transparent 80px, #F9A825 80px, #F9A825 81px)`
          }}
        />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full filter blur-[100px] -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/8 rounded-full filter blur-[80px] translate-y-1/3 -translate-x-1/4" />

        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-amber-500/20 rounded-full mb-8 border border-amber-500/30">
              <img src="/logo2.png" alt="Joe Academy" className="w-16 h-16" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6">Join Joe Academy</h2>
            <p className="text-gray-300 text-lg max-w-md mb-10">
              Start your learning journey today. Get access to expert-led courses and personalized mentorship.
            </p>

            <div className="grid grid-cols-2 gap-4 text-left max-w-md">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3 text-gray-300"
                >
                  <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-4 h-4 text-amber-400" />
                  </div>
                  <span className="text-sm">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent" />
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="inline-block border-l-4 border-amber-500 pl-4 mb-4 text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Sign Up</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-[#1A2D44] mb-2">Create Account</h1>
            <p className="text-gray-500">Start your learning journey today</p>
          </div>

          <div className="bg-white border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (for order notifications)
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="+1234567890"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  I want to
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`flex items-center justify-center gap-3 p-4 border-2 cursor-pointer transition-all ${
                    formData.role === 'student' 
                      ? 'border-amber-500 bg-amber-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="role"
                      value="student"
                      checked={formData.role === 'student'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <User className={`w-5 h-5 ${formData.role === 'student' ? 'text-amber-600' : 'text-gray-400'}`} />
                    <span className={`font-bold ${formData.role === 'student' ? 'text-amber-600' : 'text-gray-700'}`}>
                      Learn
                    </span>
                  </label>
                  <label className={`flex items-center justify-center gap-3 p-4 border-2 cursor-pointer transition-all ${
                    formData.role === 'instructor' 
                      ? 'border-amber-500 bg-amber-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="role"
                      value="instructor"
                      checked={formData.role === 'instructor'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <GraduationCap className={`w-5 h-5 ${formData.role === 'instructor' ? 'text-amber-600' : 'text-gray-400'}`} />
                    <span className={`font-bold ${formData.role === 'instructor' ? 'text-amber-600' : 'text-gray-700'}`}>
                      Teach
                    </span>
                  </label>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-amber-500 text-[#1A2D44] py-4 font-bold text-sm uppercase tracking-wide hover:bg-amber-400 transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </motion.button>
            </form>

            <p className="text-center text-gray-600 mt-8">
              Already have an account?{' '}
              <Link to="/login" className="text-amber-600 font-medium hover:text-amber-700">
                Sign in
              </Link>
            </p>
          </div>

          <p className="text-center text-gray-400 text-sm mt-6">
            By signing up, you agree to our{' '}
            <Link to="/about" className="text-amber-600 hover:underline">Terms of Service</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;