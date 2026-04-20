import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock, MessageSquare, Headphones, Calendar } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Thank you for contacting us! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      desc: 'Send us an email anytime',
      detail: 'support@joeacademy.com',
      color: 'bg-amber-500'
    },
    {
      icon: Phone,
      title: 'Call Us',
      desc: 'Mon - Fri, 9am - 6pm EST',
      detail: '+1 (555) 123-4567',
      color: 'bg-[#1A2D44]'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      desc: 'Chat with our team',
      detail: 'Available 24/7',
      color: 'bg-[#1A2D44]'
    },
    {
      icon: Headphones,
      title: 'Support',
      desc: 'Technical assistance',
      detail: 'help.joeacademy.com',
      color: 'bg-amber-500'
    }
  ];

  return (
    <div className="font-sans">

      {/* ─── HERO ─── */}
      <section className="relative bg-[#1A2D44] text-white overflow-hidden min-h-[50vh] flex items-center">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 80px, #F9A825 80px, #F9A825 81px),
                              repeating-linear-gradient(90deg, transparent, transparent 80px, #F9A825 80px, #F9A825 81px)`
          }}
        />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full filter blur-[100px] -translate-y-1/3 translate-x-1/3" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-block border-l-4 border-amber-500 pl-4 mb-6 text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Contact Us</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
              We'd Love to<br /><span className="text-amber-500">Hear From You</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Have questions about our courses or need support? Our team is here to help you every step of the way.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      {/* ─── CONTACT METHODS ─── */}
      <section className="py-16 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-0 border border-gray-200">
            {contactMethods.map((method, i) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                viewport={{ once: true }}
                className="p-6 border-b md:border-b-0 md:border-r border-gray-200 last:border-r-0 hover:bg-white transition-colors group"
              >
                <div className={`w-12 h-12 ${method.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <method.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-[#1A2D44] mb-1">{method.title}</h3>
                <p className="text-gray-500 text-sm mb-1">{method.desc}</p>
                <p className="text-amber-600 text-sm font-medium">{method.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT FORM SECTION ─── */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Left - Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="inline-block border-l-4 border-amber-500 pl-4 mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Get in Touch</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-[#1A2D44] leading-tight mb-6">
                Let's Start a<br /><span className="text-amber-500">Conversation</span>
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-10">
                Whether you're looking for more information about our courses, need help with your account, or have a general inquiry — we're here to help.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#1A2D44] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1A2D44] mb-1">Visit Us</h3>
                    <p className="text-gray-500">123 Education Street<br />New York, NY 10001</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#1A2D44] flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1A2D44] mb-1">Office Hours</h3>
                    <p className="text-gray-500">Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 2:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#1A2D44] flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1A2D44] mb-1">Book a Consultation</h3>
                    <p className="text-gray-500">Schedule a free 30-minute call with our team</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right - Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-gray-50 border border-gray-200 p-8 md:p-10">
                <h3 className="text-2xl font-bold text-[#1A2D44] mb-6">Send us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white resize-none"
                      placeholder="Write your message..."
                    ></textarea>
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    className="w-full bg-amber-500 text-[#1A2D44] py-4 font-bold text-sm uppercase tracking-wide hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Sending...' : (
                      <>
                        Send Message <Send className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── GOOGLE MAP ─── */}
      <section className="bg-gray-50 py-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative h-96 md:h-[500px] border border-gray-200 overflow-hidden rounded-b-2xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98513058459413!3d40.74881757932756!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1680000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '400px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Joe Academy Headquarters Location"
            />
          </div>
          {/* Map overlay info */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 md:bottom-auto md:top-8 md:left-auto md:translate-x-0 md:right-8">
            <div className="bg-white/95 backdrop-blur-sm shadow-lg rounded-lg px-6 py-4 border border-gray-200 max-w-xs">
              <h4 className="font-bold text-[#1A2D44] mb-1">Joe Academy</h4>
              <p className="text-sm text-gray-600">123 Education Street<br/>New York, NY 10001</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;