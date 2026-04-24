import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Monitor, Home, BookOpen, CheckCircle, ArrowRight, X } from 'lucide-react';

// --- Sub-Components Defined OUTSIDE to prevent re-rendering glitches ---

const Hero = () => (
  <section className="relative bg-[#1A2D44] text-white overflow-hidden py-20">
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full filter blur-[100px] -translate-y-1/3 translate-x-1/3" />
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="inline-block border-l-4 border-amber-500 pl-4 mb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Private Tutoring</span>
      </div>
      <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
        Book Your<br /><span className="text-amber-500">Session</span>
      </h1>
      <p className="text-gray-400 text-lg max-w-2xl mx-auto">
        Get personalized one-on-one tutoring online or at your home. Expert lecturers in Sciences and Languages.
        <br className="hidden sm:block" />
        <span className="text-amber-400">•</span> Quick booking via Google Form also available
      </p>
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent" />
  </section>
);

const PricingCards = () => (
  <section className="bg-gray-50 border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { Icon: Monitor, title: 'Online Session', desc: 'Virtual one-on-one', price: 130, label: 'Sciences & GIS', color: 'bg-amber-100 text-amber-600' },
          { Icon: Home, title: 'Home Service', desc: 'Lecturer at your place', price: 130, label: 'Sciences + Travel', color: 'bg-green-100 text-green-600' },
          { Icon: BookOpen, title: 'Languages', desc: 'French & English', price: 120, label: 'Online or Home', color: 'bg-blue-100 text-blue-600' }
        ].map((c) => (
           <div key={c.title} className="bg-white border border-gray-200 p-6 text-center hover:-translate-y-2 hover:shadow-lg transition-all">
            <div className={`w-12 h-12 ${c.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <c.Icon className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-[#1A2D44] mb-2">{c.title}</h3>
            <p className="text-gray-500 text-sm mb-3">{c.desc}</p>
            <p className="text-2xl font-black text-amber-500">{c.price} <span className="text-sm font-normal text-gray-400">DHS/hr</span></p>
            <p className="text-xs text-gray-400 mt-1">{c.label}</p>
           </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
          <CheckCircle className="w-4 h-4" /> 10% discount on weekly/continuous sessions
        </div>
      </div>
    </div>
  </section>
);

const GoogleFormView = ({ onClose }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-gray-200">
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
      <div>
        <h2 className="text-2xl font-black text-[#1A2D44]">Book via Google Form</h2>
        <p className="text-gray-500 text-sm mt-1">Fill out the form below and we will contact you shortly</p>
      </div>
      <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
        <X className="w-5 h-5" />
      </button>
    </div>
    <div className="p-6">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-[#1A2D44] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            <span className="font-bold">Book via Google Form</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            Fill out the form below to request a tutoring session. Our team will contact you within 24 hours to confirm your booking.
          </p>
        </div>
        <div className="p-4">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSdBmdEYzWExu90RRbVS1QOJ_LgmDCRBA4IfyEP7Abq_oPhsJg/viewform?embedded=true"
            width="100%"
            height="600"
            frameBorder="0"
            className="rounded"
            title="Google Form Booking"
          >
            Loading Google Form...
          </iframe>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-blue-800">
                After submitting the form, you'll receive a confirmation email within 24 hours. Our team will contact you to confirm your booking details and arrange payment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const Step1 = ({ onSelectService, onShowGoogleForm }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
    <div className="text-center mb-10">
      <h2 className="text-3xl font-black text-[#1A2D44] mb-3">Choose Your Service</h2>
      <p className="text-gray-500">Select the type of session you prefer</p>
    </div>
    <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
      {[
        { type: 'virtual', icon: Monitor, title: 'Online Session', desc: 'Learn from the comfort of your home via video call. Flexible scheduling and instant access.' },
        { type: 'in-person', icon: Home, title: 'Home Service', desc: 'Our expert lecturer comes to your location. Personalized attention in your own space.' }
      ].map((opt) => (
        <button key={opt.type} onClick={() => onSelectService(opt.type)} className="group p-8 border-2 border-gray-200 hover:border-amber-500 hover:bg-amber-50 transition-all text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <opt.icon className="w-10 h-10 text-amber-500 mb-4" />
          <h3 className="text-xl font-bold text-[#1A2D44] mb-2 group-hover:text-amber-600">{opt.title}</h3>
          <p className="text-gray-500 text-sm mb-4">{opt.desc}</p>
          <div className="flex items-center gap-2 text-amber-600 font-semibold text-sm">
            Select <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      ))}
    </div>
    <div className="text-center mt-10">
      <p className="text-gray-400 text-sm mb-3">Prefer to use Google Form?</p>
      <button onClick={onShowGoogleForm} className="inline-flex items-center gap-2 text-amber-600 font-semibold text-sm hover:text-amber-800 transition-colors">
        <BookOpen className="w-4 h-4" />
        Book via Google Form instead
      </button>
    </div>
  </motion.div>
);

const Progress = ({ step }) => (
  <div className="flex items-center justify-center gap-4 mb-10">
    {[1, 2, 3, 4].map((s) => (
      <div key={s} className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${s <= step ? 'bg-amber-500 text-[#1A2D44]' : 'bg-gray-200 text-gray-500'}`}>
          {s}
        </div>
        {s < 4 && <div className={`w-12 h-0.5 ${s < step ? 'bg-amber-500' : 'bg-gray-200'}`} />}
      </div>
    ))}
  </div>
);

const Step2 = ({ serviceType, formData, setFormData, setStep, subjects, durations }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-[#1A2D44] mb-2 uppercase tracking-wide">Service Type</label>
        <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200">
          {serviceType === 'virtual' ? <Monitor className="w-5 h-5 text-amber-500" /> : <Home className="w-5 h-5 text-amber-500" />}
          <span className="font-medium text-[#1A2D44]">{serviceType === 'virtual' ? 'Online Session' : 'Home Service'}</span>
          <button onClick={() => setStep(1)} className="ml-auto text-xs text-amber-600 hover:underline">Change</button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-[#1A2D44] mb-2 uppercase tracking-wide">Subject *</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {subjects.map((subject) => (
            <button key={subject} type="button" onClick={() => setFormData(prev => ({ ...prev, subject }))}
              className={`p-3 text-sm font-medium border transition-all ${formData.subject === subject ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-200 hover:border-amber-300 text-gray-600'}`}>
              {subject}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-[#1A2D44] mb-2 uppercase tracking-wide">Duration *</label>
          <select name="duration" value={formData.duration} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent">
            {durations.map((d) => <option key={d} value={d}>{d} hour{d > 1 ? 's' : ''}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-[#1A2D44] mb-2 uppercase tracking-wide">Session Frequency</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={!formData.isWeekly} onChange={() => setFormData(prev => ({ ...prev, isWeekly: false }))} className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-gray-600">One-time</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={formData.isWeekly} onChange={() => setFormData(prev => ({ ...prev, isWeekly: true }))} className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-gray-600">Weekly (10% off)</span>
            </label>
          </div>
        </div>
      </div>

       {serviceType === 'in-person' && (
         <div>
           <label className="block text-sm font-bold text-[#1A2D44] mb-2 uppercase tracking-wide">Your Address *</label>
           <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Enter your full address for the home service..." className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent" rows={3} required />
         </div>
       )}

       <div>
         <label className="block text-sm font-bold text-[#1A2D44] mb-2 uppercase tracking-wide">Topic / Focus Area</label>
         <input type="text" name="topic" value={formData.topic} onChange={handleChange} placeholder="e.g., Organic Chemistry - Chapter 5" className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
       </div>

      <button type="button" onClick={() => setStep(3)} disabled={!formData.subject}
        className="w-full bg-amber-500 text-[#1A2D44] px-8 py-4 font-bold text-sm uppercase tracking-wide hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        Continue to Schedule
       </button>
    </motion.div>
  );
};

const Step3 = ({ formData, setFormData, setStep, times, lecturers, handleChange }) => {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-[#1A2D44] mb-2 uppercase tracking-wide">Preferred Date *</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent" required />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#1A2D44] mb-2 uppercase tracking-wide">Preferred Time *</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {times.map((t) => (
              <button key={t} type="button" onClick={() => setFormData(prev => ({ ...prev, time: t }))}
                className={`p-2 text-sm font-medium border transition-all ${formData.time === t ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-200 hover:border-amber-300 text-gray-600'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-[#1A2D44] mb-2 uppercase tracking-wide">Lecturer Preference *</label>
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={formData.lecturerPreference === 'match'} onChange={() => setFormData(prev => ({ ...prev, lecturerPreference: 'match', instructorId: '' }))} className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-gray-600">Match me with any available lecturer</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={formData.lecturerPreference === 'specific'} onChange={() => setFormData(prev => ({ ...prev, lecturerPreference: 'specific' }))} className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-gray-600">I have a preferred lecturer</span>
          </label>
        </div>

        {formData.lecturerPreference === 'specific' && (
          <div className="space-y-3">
            {lecturers.map((lecturer) => (
              <label key={lecturer._id} className={`flex items-center gap-4 p-4 border cursor-pointer transition-all ${formData.instructorId === lecturer._id ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-amber-300'}`}>
                <input type="radio" name="instructorId" value={lecturer._id} checked={formData.instructorId === lecturer._id} onChange={handleChange} className="w-4 h-4 text-amber-500" />
                <div className="w-10 h-10 bg-[#1A2D44] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-amber-500">{lecturer.name?.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-bold text-[#1A2D44]">{lecturer.name}</p>
                  <p className="text-sm text-gray-500">{lecturer.title || 'Instructor'}</p>
                  {lecturer.expertise?.length > 0 && <p className="text-xs text-gray-400 mt-1">{lecturer.expertise.join(', ')}</p>}
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-bold text-[#1A2D44] mb-2 uppercase tracking-wide">Additional Notes</label>
        <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Any special requirements or topics to cover..." className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent" rows={3} />
      </div>

      <button type="button" onClick={() => setStep(4)} disabled={!formData.date || !formData.time}
        className="w-full bg-amber-500 text-[#1A2D44] px-8 py-4 font-bold text-sm uppercase tracking-wide hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        Continue to Your Info
       </button>
    </motion.div>
  );
};

const Step4 = ({ formData, setFormData, user, handleSubmit, submitting, serviceType, feeEstimate }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-[#1A2D44] mb-2 uppercase tracking-wide">Full Name *</label>
          <input type="text" name="studentName" value={formData.studentName || user?.name || ''} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent" required />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#1A2D44] mb-2 uppercase tracking-wide">Email *</label>
          <input type="email" name="studentEmail" value={formData.studentEmail || user?.email || ''} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent" required />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-[#1A2D44] mb-2 uppercase tracking-wide">Phone / WhatsApp *</label>
        <input type="tel" name="studentPhone" value={formData.studentPhone || user?.phone || ''} onChange={handleChange} placeholder="+212 6XX XXX XXX" className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent" required />
      </div>

      <div className="bg-gray-50 p-6 border border-gray-200">
        <h3 className="font-bold text-[#1A2D44] mb-4">Booking Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Service</span><span className="font-medium">{serviceType === 'virtual' ? 'Online Session' : 'Home Service'}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Subject</span><span className="font-medium">{formData.subject}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Date &amp; Time</span><span className="font-medium">{formData.date} at {formData.time}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Duration</span><span className="font-medium">{formData.duration} hour{formData.duration > 1 ? 's' : ''}</span></div>
          {formData.isWeekly && <div className="flex justify-between text-green-600"><span>Frequency</span><span className="font-medium">Weekly (10% discount)</span></div>}
          {feeEstimate && <div className="border-t border-gray-200 pt-2 flex justify-between text-lg font-bold"><span>Total Fee</span><span className="text-amber-500">{feeEstimate.subtotal - feeEstimate.discount} DHS</span></div>}
        </div>
      </div>

      <button type="submit" disabled={submitting} className="w-full bg-amber-500 text-[#1A2D44] px-8 py-4 font-bold text-sm uppercase tracking-wide hover:bg-amber-400 transition-colors disabled:opacity-50">
         {submitting ? 'Submitting...' : 'Confirm Booking Request'}
      </button>

      <p className="text-xs text-gray-400 text-center">You will be contacted within 24 hours to confirm your booking and arrange payment.</p>
    </motion.form>
  );
};

const FeeCalc = ({ formData }) => {
  if (!formData.subject) return null;
  
  const getSubjectPrice = (subject) => {
    const scienceSubjects = ['Chemistry', 'Mathematics', 'Biology', 'Physics', 'GIS', 'Remote Sensing'];
    return scienceSubjects.includes(subject) ? 130 : 120;
  };

  const rate = getSubjectPrice(formData.subject);
  const subtotal = rate * formData.duration;
  const discount = formData.isWeekly ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discount;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#1A2D44] text-white p-6 rounded-lg">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-amber-500" /> Fee Breakdown
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between"><span className="text-gray-400">Hourly Rate</span><span>{rate} DHS/hr</span></div>
        <div className="flex justify-between"><span className="text-gray-400">Duration</span><span>{formData.duration}h</span></div>
        <div className="flex justify-between"><span className="text-gray-400">Subtotal</span><span>{subtotal} DHS</span></div>
        {formData.isWeekly && <div className="flex justify-between text-green-400"><span>Weekly Discount</span><span>-{discount} DHS</span></div>}
        <div className="border-t border-white/20 pt-3 flex justify-between text-lg font-bold">
          <span>Total</span><span className="text-amber-500">{total} DHS</span>
        </div>
       </div>
    </motion.div>
  );
};

// --- Main Component ---

const BookNow = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [serviceType, setServiceType] = useState('');
  const [lecturers, setLecturers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [showGoogleForm, setShowGoogleForm] = useState(false);
  const [formData, setFormData] = useState({
    instructorId: '',
    lecturerPreference: 'match',
    subject: '',
    date: '',
    time: '',
    duration: 1,
    isWeekly: false,
    topic: '',
    notes: '',
    address: '',
    studentName: '',
    studentEmail: '',
    studentPhone: ''
  });
  const [feeEstimate, setFeeEstimate] = useState(null);

  const subjects = ['Chemistry', 'Mathematics', 'Biology', 'Physics', 'French', 'English', 'GIS', 'Remote Sensing'];
  const durations = [1, 2, 3];
  const times = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  useEffect(() => {
    axios.get('/api/bookings/lecturers').then(r => setLecturers(r.data.lecturers || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!formData.subject) return;
    axios.get('/api/bookings/estimate', {
      params: { subject: formData.subject, duration: formData.duration, isWeekly: formData.isWeekly }
    }).then(r => setFeeEstimate(r.data.breakdown)).catch(() => {});
  }, [formData.subject, formData.duration, formData.isWeekly]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleServiceSelect = (type) => { setServiceType(type); setStep(2); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login', { state: { from: '/book-now' } }); return; }
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        type: serviceType,
        instructorId: formData.lecturerPreference === 'match' ? lecturers[0]?._id : formData.instructorId
      };
      await axios.post('/api/bookings/standalone', payload);
      toast.success('Booking request submitted successfully!');
      navigate('/dashboard/bookings');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Booking failed');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="font-sans min-h-screen bg-gray-50">
      <Hero />
      <PricingCards />

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {showGoogleForm ? (
            <GoogleFormView onClose={() => setShowGoogleForm(false)} />
          ) : (
            <div>
              {step === 1 && <Step1 onSelectService={handleServiceSelect} onShowGoogleForm={() => setShowGoogleForm(true)} />}
              {step >= 2 && (
                <>
                  <Progress step={step} />
                  <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <div className="bg-white border border-gray-200 p-6 md:p-8">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-2xl font-black text-[#1A2D44]">{step === 2 ? 'Session Details' : step === 3 ? 'Schedule & Lecturer' : 'Your Information'}</h2>
                          <button onClick={() => setStep(Math.max(1, step - 1))} className="text-gray-400 hover:text-gray-600 text-sm">Back</button>
                        </div>
                        {step === 2 && <Step2 serviceType={serviceType} formData={formData} setFormData={setFormData} setStep={setStep} subjects={subjects} durations={durations} />}
                        {step === 3 && <Step3 formData={formData} setFormData={setFormData} setStep={setStep} times={times} lecturers={lecturers} handleChange={handleChange} />}
                        {step === 4 && <Step4 formData={formData} setFormData={setFormData} user={user} handleSubmit={handleSubmit} submitting={submitting} serviceType={serviceType} feeEstimate={feeEstimate} />}
                      </div>
                    </div>
                    <div className="lg:col-span-1">
                      <div className="sticky top-24 space-y-6">
                        <FeeCalc formData={formData} />
                        <div className="bg-white border border-gray-200 p-6">
                          <h3 className="font-bold text-[#1A2D44] mb-3 flex items-center gap-2"><BookOpen className="w-5 h-5 text-amber-500" /> Prefer Google Form?</h3>
                          <p className="text-gray-500 text-sm mb-4">If you prefer, you can also book via our Google Form. The same great service, your preferred way.</p>
                          <button onClick={() => setShowGoogleForm(true)} className="w-full border border-amber-500 text-amber-600 px-4 py-3 font-bold text-sm uppercase tracking-wide hover:bg-amber-50 transition-colors">Book via Google Form</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BookNow;