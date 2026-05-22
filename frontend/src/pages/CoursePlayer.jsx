import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  Play,
  Pause,
  CheckCircle,
  Lock,
  ChevronLeft,
  ChevronRight,
  Award,
  BookOpen,
  Clock,
  Menu,
  X,
  SkipForward,
  SkipBack,
  Volume2,
  Maximize,
  List
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CoursePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [progress, setProgress] = useState({});
  const [playing, setPlaying] = useState(false);
  const [completedLectures, setCompletedLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCompletionBanner, setShowCompletionBanner] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCourseData();
  }, [id, authLoading, user, navigate]);

  // Close sidebar on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchCourseData = async () => {
    try {
      const [courseRes, lecturesRes, progressRes] = await Promise.all([
        axios.get(`/api/courses/${id}`),
        axios.get(`/api/lectures/${id}`),
        axios.get(`/api/progress/${id}`)
      ]);

      setCourse(courseRes.data.course);
      setLectures(lecturesRes.data.lectures || []);

      const progressMap = {};
      (progressRes.data.progress || []).forEach(p => {
        progressMap[p.lectureId] = p;
      });
      setProgress(progressMap);

      const completed = progressRes.data.progress
        .filter(p => p.completed)
        .map(p => p.lectureId);
      setCompletedLectures(completed);

      if (lecturesRes.data.lectures?.length > 0 && !currentLecture) {
        const firstUnlocked = lecturesRes.data.lectures.find(l =>
          l.isFree || completed.includes(l._id)
        ) || lecturesRes.data.lectures[0];
        setCurrentLecture(firstUnlocked);
      }
    } catch (error) {
      console.error('Error fetching course:', error);

      // Handle unauthorized - redirect to login
      if (error.response?.status === 401) {
        toast.error('Please login to access this course');
        navigate('/login');
        return;
      }

      // Handle course not found
      if (error.response?.status === 404) {
        toast.error('Course not found');
        navigate('/dashboard');
        return;
      }

      // Handle course not purchased (403 from lectures endpoint)
      if (error.response?.status === 403 || error.response?.data?.code === 'COURSE_NOT_PURCHASED') {
        toast.error('You need to purchase this course to access it');
        navigate('/dashboard');
        return;
      }

      toast.error('Unable to load course');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoTimeUpdate = async () => {
    if (!videoRef.current || !currentLecture) return;
    const currentTime = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    if (duration > 0 && currentTime > duration * 0.9) {
      markAsComplete(currentLecture._id);
    }
  };

  const markAsComplete = async (lectureId) => {
    if (completedLectures.includes(lectureId)) return;
    try {
      const response = await axios.post(`/api/progress/${id}`, {
        lectureId,
        completed: true,
        watchedDuration: videoRef.current?.currentTime || 0
      });
      const { creditsAwarded } = response.data;
      const updated = [...completedLectures, lectureId];
      setCompletedLectures(updated);

      if (creditsAwarded > 0) {
        setShowCompletionBanner(true);
        setTimeout(() => setShowCompletionBanner(false), 5000);
        toast.success(
          <div>
            <div className="font-bold">Course Completed! 🏆</div>
            <div className="text-sm">You earned {creditsAwarded} credits!</div>
          </div>,
          { duration: 5000 }
        );
      } else {
        toast.success('Lecture completed! ✅');
      }
    } catch (error) {
      toast.error('Failed to update progress');
    }
  };

  const selectLecture = (lecture) => {
    const lectureIndex = lectures.findIndex(l => l._id === lecture._id);
    const previousLecture = lectureIndex > 0 ? lectures[lectureIndex - 1] : null;
    const isLocked = !lecture.isFree && previousLecture && !completedLectures.includes(previousLecture._id);

    if (isLocked) {
      toast.error('Complete previous lectures to unlock this one');
      return;
    }
    setCurrentLecture(lecture);
    setPlaying(false);
    setSidebarOpen(false);
  };

  const playNext = () => {
    const currentIndex = lectures.findIndex(l => l._id === currentLecture?._id);
    if (currentIndex < lectures.length - 1) selectLecture(lectures[currentIndex + 1]);
  };

  const playPrevious = () => {
    const currentIndex = lectures.findIndex(l => l._id === currentLecture?._id);
    if (currentIndex > 0) selectLecture(lectures[currentIndex - 1]);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs > 0 ? secs + 's' : ''}` : `${secs}s`;
  };

  const completedCount = completedLectures.length;
  const progressPercentage = lectures.length > 0 ? Math.round((completedCount / lectures.length) * 100) : 0;
  const currentLectureIndex = lectures.findIndex(l => l._id === currentLecture?._id);
  const isLastLecture = currentLectureIndex >= lectures.length - 1;
  const isFirstLecture = currentLectureIndex === 0;

  // ── Loading ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1117] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-amber-500/20"></div>
            <div className="absolute inset-0 rounded-full border-2 border-t-amber-500 animate-spin"></div>
          </div>
          <p className="text-gray-500 text-sm tracking-widest uppercase">Loading course</p>
        </div>
      </div>
    );
  }

  // ── Empty state ──────────────────────────────────────────────
  if (!course || lectures.length === 0) {
    return (
      <div className="min-h-screen bg-[#0F1117] flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-700">
            <BookOpen className="w-9 h-9 text-gray-600" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No Lectures Yet</h2>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">This course doesn't have content yet. Check back soon.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-amber-500 text-gray-900 px-8 py-3 rounded-xl font-semibold text-sm hover:bg-amber-400 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ── Main render ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0F1117] flex flex-col font-sans">

      {/* ── Top nav bar ── */}
      <header className="h-14 bg-[#151820] border-b border-white/5 flex items-center px-4 gap-4 sticky top-0 z-50 backdrop-blur-sm">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
        >
          <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium hidden sm:inline">Dashboard</span>
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">{course.title}</p>
          <p className="text-gray-500 text-xs hidden sm:block">
            {completedCount} / {lectures.length} lectures completed
          </p>
        </div>

        {/* Progress pill */}
        <div className="hidden md:flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-full">
          <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
            />
          </div>
          <span className="text-amber-400 text-xs font-bold tabular-nums">{progressPercentage}%</span>
        </div>

        {progressPercentage === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden md:flex items-center gap-1.5 bg-green-500/15 text-green-400 px-3 py-1.5 rounded-full text-xs font-semibold"
          >
            <Award className="w-3.5 h-3.5" />
            Complete!
          </motion.div>
        )}

        {/* Mobile: chapters toggle */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg text-sm"
        >
          <List className="w-4 h-4" />
          <span className="hidden sm:inline">Chapters</span>
          <span className="sm:hidden text-xs">{completedCount}/{lectures.length}</span>
        </button>
      </header>

      {/* ── Completion banner ── */}
      <AnimatePresence>
        {showCompletionBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gradient-to-r from-amber-500/20 via-amber-400/20 to-amber-500/20 border-b border-amber-500/30 overflow-hidden"
          >
            <div className="flex items-center justify-center gap-3 py-2.5 text-amber-400 text-sm font-semibold">
              <Award className="w-4 h-4" />
              <span>Course Completed! You earned credits 🎉</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Video + controls ── */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Video area */}
          <div className="relative bg-black flex-1 flex items-center justify-center min-h-0">
            {currentLecture?.videoUrl ? (
              <video
                ref={videoRef}
                key={currentLecture._id}
                src={currentLecture.videoUrl}
                controls
                autoPlay
                className="w-full h-full max-h-[60vh] lg:max-h-[65vh] object-contain"
                onTimeUpdate={handleVideoTimeUpdate}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={playNext}
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-gray-600" />
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Lecture Locked</p>
                  <p className="text-gray-500 text-sm">Complete previous lectures to unlock</p>
                </div>
              </div>
            )}

            {/* Prev / Next floating buttons on video */}
            <button
              onClick={playPrevious}
              disabled={isFirstLecture}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/70 disabled:opacity-0 transition-all"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={playNext}
              disabled={isLastLecture}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/70 disabled:opacity-0 transition-all"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* ── Lecture info bar ── */}
          <div className="bg-[#151820] border-t border-white/5 px-4 py-4 shrink-0">
            <div className="max-w-4xl mx-auto space-y-3">

              {/* Title + meta */}
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-white font-bold text-base sm:text-lg leading-snug truncate">
                    {currentLecture?.title || 'Select a lecture'}
                  </h2>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span>Lecture {currentLectureIndex + 1} of {lectures.length}</span>
                    {currentLecture?.duration && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-gray-700 inline-block"></span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDuration(currentLecture.duration)}
                        </span>
                      </>
                    )}
                    {currentLecture?.isFree && (
                      <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Free</span>
                    )}
                  </div>
                </div>

                {/* Mark complete */}
                {currentLecture && (
                  <button
                    onClick={() => markAsComplete(currentLecture._id)}
                    disabled={completedLectures.includes(currentLecture._id)}
                    className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      completedLectures.includes(currentLecture._id)
                        ? 'bg-green-500/15 text-green-400 cursor-default'
                        : 'bg-white/8 text-gray-300 hover:bg-amber-500/20 hover:text-amber-400 border border-white/10'
                    }`}
                  >
                    <CheckCircle className={`w-4 h-4 ${completedLectures.includes(currentLecture._id) ? 'fill-current' : ''}`} />
                    <span className="hidden sm:inline">
                      {completedLectures.includes(currentLecture._id) ? 'Completed' : 'Mark Complete'}
                    </span>
                  </button>
                )}
              </div>

              {/* Controls row */}
              <div className="flex items-center gap-2">
                <button
                  onClick={playPrevious}
                  disabled={isFirstLecture}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Prev</span>
                </button>

                <button
                  onClick={() => videoRef.current && (playing ? videoRef.current.pause() : videoRef.current.play())}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold rounded-lg transition-all text-sm"
                >
                  {playing
                    ? <><Pause className="w-4 h-4" /> Pause</>
                    : <><Play className="w-4 h-4" fill="currentColor" /> Play</>
                  }
                </button>

                <button
                  onClick={playNext}
                  disabled={isLastLecture}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Mobile progress */}
                <div className="ml-auto flex items-center gap-2 lg:hidden">
                  <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${progressPercentage}%` }} />
                  </div>
                  <span className="text-amber-400 text-xs font-bold">{progressPercentage}%</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* ── Desktop sidebar ── */}
        <aside className="hidden lg:flex flex-col w-80 xl:w-96 bg-[#151820] border-l border-white/5">
          <SidebarContent
            course={course}
            lectures={lectures}
            completedLectures={completedLectures}
            currentLecture={currentLecture}
            completedCount={completedCount}
            progressPercentage={progressPercentage}
            selectLecture={selectLecture}
            formatDuration={formatDuration}
          />
        </aside>

        {/* ── Mobile sidebar overlay ── */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="fixed right-0 top-0 bottom-0 w-[85vw] max-w-sm bg-[#151820] border-l border-white/5 z-50 flex flex-col"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 shrink-0">
                  <span className="text-white font-bold text-sm">Course Content</span>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <SidebarContent
                  course={course}
                  lectures={lectures}
                  completedLectures={completedLectures}
                  currentLecture={currentLecture}
                  completedCount={completedCount}
                  progressPercentage={progressPercentage}
                  selectLecture={selectLecture}
                  formatDuration={formatDuration}
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ── Sidebar content (shared between desktop + mobile) ──────────
const SidebarContent = ({
  course, lectures, completedLectures, currentLecture,
  completedCount, progressPercentage, selectLecture, formatDuration
}) => (
  <>
    {/* Header */}
    <div className="px-4 pt-4 pb-3 border-b border-white/5 shrink-0">
      <h2 className="text-white font-bold text-sm mb-0.5">Course Content</h2>
      <p className="text-gray-500 text-xs">
        {lectures.length} lectures · {Math.floor((course?.totalDuration || 0) / 60)} hrs total
      </p>
      <div className="mt-3 space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">{completedCount} of {lectures.length} done</span>
          <span className="text-amber-400 font-bold">{progressPercentage}%</span>
        </div>
        <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
          />
        </div>
      </div>
    </div>

    {/* Lecture list */}
    <div className="flex-1 overflow-y-auto">
      {lectures.map((lecture, index) => {
        const isCompleted = completedLectures.includes(lecture._id);
        const isCurrent = currentLecture?._id === lecture._id;
        const isLocked = !lecture.isFree && index > 0 && !completedLectures.includes(lectures[index - 1]._id);

        return (
          <motion.button
            key={lecture._id}
            onClick={() => !isLocked && selectLecture(lecture)}
            whileHover={!isLocked ? { x: 3 } : {}}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`w-full text-left px-4 py-3.5 border-b border-white/5 flex gap-3 items-start transition-colors ${
              isCurrent ? 'bg-amber-500/10' : 'hover:bg-white/4'
            } ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {/* Status dot / number */}
            <div className={`shrink-0 mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              isCompleted ? 'bg-green-500/20 text-green-400' :
              isLocked ? 'bg-white/5 text-gray-600' :
              isCurrent ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/40' :
              'bg-white/8 text-gray-400'
            }`}>
              {isCompleted ? <CheckCircle className="w-3.5 h-3.5 fill-current" /> :
               isLocked ? <Lock className="w-3 h-3" /> :
               <span>{index + 1}</span>}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className={`text-sm font-medium leading-snug line-clamp-2 ${
                  isLocked ? 'text-gray-600' :
                  isCurrent ? 'text-amber-400' :
                  isCompleted ? 'text-gray-300' : 'text-gray-200'
                }`}>
                  {lecture.title}
                </p>
                {lecture.isFree && (
                  <span className="shrink-0 text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    Free
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-600">
                {lecture.duration && (
                  <span className="flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {formatDuration(lecture.duration)}
                  </span>
                )}
                {isCompleted && <span className="text-green-500">✓ Done</span>}
                {isCurrent && !isCompleted && <span className="text-amber-500">▶ Watching</span>}
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  </>
);

export default CoursePlayer;