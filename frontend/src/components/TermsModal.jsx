import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';

const TermsModal = ({ isOpen, onAgree, onClose }) => {
  const [agreed, setAgreed] = useState(false);

  if (!isOpen) return null;

  const handleAgree = () => {
    if (agreed) {
      setAgreed(false);
      onAgree();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-[#1A2D44]">Terms & Conditions & Privacy Policy</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-gray-700">
          {/* Terms of Service */}
          <section>
            <h3 className="text-xl font-bold text-[#1A2D44] mb-3">Terms of Service for Instructors</h3>
            <div className="space-y-3 text-sm">
              <p>
                <strong>1. Instructor Responsibilities:</strong> As an instructor, you agree to create high-quality educational content, maintain professional conduct, and respond to student inquiries in a timely manner.
              </p>
              <p>
                <strong>2. Content Rights:</strong> You retain ownership of your course content. By uploading content to Joe Academy, you grant us a license to host, distribute, and display your courses to students.
              </p>
              <p>
                <strong>3. Payment Terms:</strong> Instructors receive a percentage of course revenue as outlined in the payment agreement. Payments are processed monthly to your registered account.
              </p>
              <p>
                <strong>4. Code of Conduct:</strong> You agree not to engage in any illegal activity, harassment, or discrimination. Violation of this code may result in account suspension.
              </p>
              <p>
                <strong>5. Intellectual Property:</strong> You are responsible for ensuring your course content does not infringe on any third-party intellectual property rights.
              </p>
            </div>
          </section>

          {/* Privacy Policy */}
          <section>
            <h3 className="text-xl font-bold text-[#1A2D44] mb-3">Privacy Policy for Instructors</h3>
            <div className="space-y-3 text-sm">
              <p>
                <strong>1. Data Collection:</strong> We collect your name, email, phone number, and payment information. This data is used solely for account management, communication, and payment processing.
              </p>
              <p>
                <strong>2. Data Protection:</strong> Your personal information is protected with industry-standard encryption and security measures. We do not sell your data to third parties.
              </p>
              <p>
                <strong>3. Student Information:</strong> You will have access to student names and emails for course communication purposes only. You agree not to use this information for marketing or any other unauthorized purpose.
              </p>
              <p>
                <strong>4. Cookies & Analytics:</strong> We use cookies and analytics tools to improve our platform. You consent to the use of these technologies.
              </p>
              <p>
                <strong>5. Data Retention:</strong> Your account data is retained as long as your account is active. You may request data deletion by contacting our support team.
              </p>
            </div>
          </section>

          {/* Additional Terms */}
          <section>
            <h3 className="text-xl font-bold text-[#1A2D44] mb-3">Additional Requirements</h3>
            <div className="space-y-3 text-sm">
              <p>
                <strong>1. Quality Standards:</strong> All courses must meet our quality standards. We reserve the right to review and remove courses that do not meet these standards.
              </p>
              <p>
                <strong>2. Certification:</strong> You certify that you have the expertise to teach the subject matter and that your qualifications are as stated in your profile.
              </p>
              <p>
                <strong>3. Compliance:</strong> You agree to comply with all applicable laws and regulations in your jurisdiction.
              </p>
              <p>
                <strong>4. Modification Rights:</strong> Joe Academy reserves the right to modify these terms at any time. Continued use of the platform constitutes acceptance of modifications.
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-5 h-5 text-amber-500 rounded cursor-pointer"
            />
            <span className="text-sm text-gray-700">
              I have read and agree to the Terms of Service and Privacy Policy
            </span>
          </label>

          <div className="flex gap-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Decline
            </button>
            <button
              onClick={handleAgree}
              disabled={!agreed}
              className={`flex-1 px-4 py-3 font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
                agreed
                  ? 'bg-amber-500 text-[#1A2D44] hover:bg-amber-400'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              I Agree
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsModal;
