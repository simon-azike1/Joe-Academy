import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Award } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isInstructor, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo2.png" alt="Joe Academy" className="h-12" />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link 
              to="/courses" 
              className={`px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors ${
                isActive('/courses') 
                  ? 'text-amber-500' 
                  : 'text-[#1A2D44] hover:text-amber-500'
              }`}
            >
              Courses
            </Link>
            <Link 
              to="/lecturers" 
              className={`px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors ${
                isActive('/lecturers') 
                  ? 'text-amber-500' 
                  : 'text-[#1A2D44] hover:text-amber-500'
              }`}
            >
              Lecturers
            </Link>
            <Link 
              to="/about" 
              className={`px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors ${
                isActive('/about') 
                  ? 'text-amber-500' 
                  : 'text-[#1A2D44] hover:text-amber-500'
              }`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors ${
                isActive('/contact') 
                  ? 'text-amber-500' 
                  : 'text-[#1A2D44] hover:text-amber-500'
              }`}
            >
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {isInstructor && (
                  <Link 
                    to="/instructor" 
                    className={`px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors ${
                      isActive('/instructor') 
                        ? 'text-amber-500' 
                        : 'text-[#1A2D44] hover:text-amber-500'
                    }`}
                  >
                    Instructor
                  </Link>
                )}
                
                <Link 
                  to="/dashboard" 
                  className={`px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors ${
                    isActive('/dashboard') 
                      ? 'text-amber-500' 
                      : 'text-[#1A2D44] hover:text-amber-500'
                  }`}
                >
                  Dashboard
                </Link>

                 <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                   <div className="w-8 h-8 bg-[#1A2D44] rounded-full flex items-center justify-center">
                     <span className="text-xs font-bold text-amber-500">
                       {user?.name?.charAt(0).toUpperCase()}
                     </span>
                   </div>
                   <span className="text-sm font-bold text-[#1A2D44]">{user?.name}</span>
                   {user?.credits > 0 && (
                     <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                       <Award className="w-3 h-3" />
                       {user.credits}
                     </div>
                   )}
                   <button 
                     onClick={handleLogout}
                     className="text-gray-400 hover:text-red-600 text-sm font-medium transition-colors"
                   >
                     Logout
                   </button>
                 </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/login" 
                  className="px-5 py-2.5 text-[#1A2D44] text-sm font-bold uppercase tracking-wide hover:text-amber-500 transition-colors"
                >
                  Log in
                </Link>
                <Link 
                  to="/register" 
                  className="px-5 py-2.5 bg-amber-500 text-[#1A2D44] text-sm font-bold uppercase tracking-wide hover:bg-amber-400 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2 text-[#1A2D44] hover:text-amber-500"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-1">
            <Link 
              to="/courses" 
              className={`block py-3 px-4 text-sm font-bold uppercase tracking-wide ${
                isActive('/courses') 
                  ? 'text-amber-500' 
                  : 'text-[#1A2D44]'
              }`}
              onClick={closeMobileMenu}
            >
              Courses
            </Link>
            <Link 
              to="/lecturers" 
              className={`block py-3 px-4 text-sm font-bold uppercase tracking-wide ${
                isActive('/lecturers') 
                  ? 'text-amber-500' 
                  : 'text-[#1A2D44]'
              }`}
              onClick={closeMobileMenu}
            >
              Lecturers
            </Link>
            <Link 
              to="/about" 
              className={`block py-3 px-4 text-sm font-bold uppercase tracking-wide ${
                isActive('/about') 
                  ? 'text-amber-500' 
                  : 'text-[#1A2D44]'
              }`}
              onClick={closeMobileMenu}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`block py-3 px-4 text-sm font-bold uppercase tracking-wide ${
                isActive('/contact') 
                  ? 'text-amber-500' 
                  : 'text-[#1A2D44]'
              }`}
              onClick={closeMobileMenu}
            >
              Contact
            </Link>

            {isAuthenticated ? (
              <div className="pt-3 border-t border-gray-200">
                {isInstructor && (
                  <Link 
                    to="/instructor" 
                    className="block py-3 px-4 text-[#1A2D44] text-sm font-bold uppercase tracking-wide"
                    onClick={closeMobileMenu}
                  >
                    Instructor
                  </Link>
                )}
                <Link 
                  to="/dashboard" 
                  className="block py-3 px-4 text-[#1A2D44] text-sm font-bold uppercase tracking-wide"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
                <div className="py-3 px-4 border-t border-gray-200 flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#1A2D44] rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-amber-500">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-[#1A2D44]">{user?.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left py-3 px-4 text-gray-500 hover:text-red-600 text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link 
                  to="/login" 
                  className="block py-3 px-4 text-[#1A2D44] text-sm font-bold uppercase tracking-wide text-center border border-gray-200"
                  onClick={closeMobileMenu}
                >
                  Log in
                </Link>
                <Link 
                  to="/register" 
                  className="block py-3 px-4 bg-amber-500 text-[#1A2D44] text-sm font-bold uppercase tracking-wide text-center hover:bg-amber-400"
                  onClick={closeMobileMenu}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;