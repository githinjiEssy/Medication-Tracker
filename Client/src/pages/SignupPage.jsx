import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, User, Mail, Lock, CalendarDays, Phone, CheckCircle2, AlertTriangle, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Toast from '../components/Toast';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

// Reusable InputField component with integrated error handling and password toggle
const InputField = ({ icon: Icon, label, error, success, showPasswordToggle, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPasswordToggle && showPassword ? 'text' : props.type;

  return (
    <div className="relative mb-5 group">
      <label className="block text-sm font-semibold text-slate-700 mb-1.5 pl-1 tracking-tight">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-600 transition-colors">
          <Icon size={20} strokeWidth={2} />
        </div>
        
        <input
          {...props}
          type={inputType}
          className={`w-full py-3.5 pl-12 pr-12 border rounded-xl text-slate-900 placeholder:text-slate-400 
            bg-white shadow-inner shadow-slate-50 transition-all duration-200 font-medium
            focus:ring-2 focus:ring-teal-100 focus:border-teal-500 outline-none
            ${error ? 'border-red-400' : 'border-slate-200'}
          `}
        />

        <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-2">
          {error && <AlertTriangle className="text-red-500" size={20} />}
          {showPasswordToggle && (
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
            className="text-xs text-red-600 mt-1 pl-1 font-medium"
          >
            {Array.isArray(error) ? error[0] : error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

const SignupPage = () => {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();
  //Toast state
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone_number: '',
    date_of_birth: '',
    gender: '',
    password: '',
    password2: '', 
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to show toast notifications
  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    if(type === 'success') {
      setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 4000);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name] || errors.form) {
      setErrors(prev => ({ ...prev, [name]: '', form: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      await signup(formData);
      showToast('Account created successfully!', 'success');
      setTimeout(() => navigate('/dashboard'), 2000); // Delay to allow users to see the success message 
    } catch (err) {
      // Handles DRF validation errors (e.g., { "username": ["This field is required."] })
      setErrors(err || {});
      showToast('Failed to create account.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col lg:flex-row">

      <Toast 
        isVisible={toast.visible} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, visible: false })} 
      />

      {/* Left side content */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}
        className="lg:w-2/5 bg-slate-900 p-12 lg:p-20 flex flex-col justify-between text-white relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 font-bold text-teal-400 text-2xl mb-16">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white">
              <Heart size={20} fill="currentColor" />
            </div>
            MedTrack
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Begin your <br /> <span className="text-teal-400">wellness journey</span> today.
          </h1>
        </div>
      </motion.div>

      {/* Right side form */}
      <motion.div 
        variants={containerVariants} initial="hidden" animate="visible"
        className="lg:w-3/5 p-8 md:p-16 xl:p-24 flex flex-col justify-center bg-white"
      >
        <div className="max-w-2xl mx-auto w-full">
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950 mb-3">Create your account</h2>
            <p className="text-slate-500 text-lg">
              Already have an account? <Link to="/login" className="text-teal-600 font-semibold hover:underline">Log in</Link>
            </p>
          </motion.div>

          {errors.form && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium">{errors.form}</div>}

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-x-6">
            <motion.div variants={itemVariants}>
              <InputField icon={User} label="First Name" name="first_name" placeholder="Sarah" value={formData.first_name} onChange={handleInputChange} error={errors.first_name} required />
            </motion.div>
            <motion.div variants={itemVariants}>
              <InputField icon={User} label="Last Name" name="last_name" placeholder="Jenkins" value={formData.last_name} onChange={handleInputChange} error={errors.last_name} required />
            </motion.div>

            <motion.div variants={itemVariants} className="md:col-span-2">
              <InputField icon={User} label="Username" name="username" placeholder="sarahj_health" value={formData.username} onChange={handleInputChange} error={errors.username} required />
            </motion.div>

            <motion.div variants={itemVariants}>
              <InputField icon={CalendarDays} label="Date of Birth" name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleInputChange} error={errors.date_of_birth} required />
            </motion.div>

            <motion.div variants={itemVariants} className="mb-5 relative group">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 pl-1">Gender</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-600">
                  <User size={20} strokeWidth={2} />
                </div>
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleInputChange}
                  required
                  className={`w-full py-3.5 pl-12 pr-4 border rounded-xl text-slate-900 bg-white outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition-all font-medium appearance-none ${errors.gender ? 'border-red-400' : 'border-slate-200'}`}
                >
                  <option value="" disabled>Select...</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
              </div>
              {errors.gender && <p className="text-xs text-red-600 mt-1 pl-1">{errors.gender[0]}</p>}
            </motion.div>

            <motion.div variants={itemVariants}>
              <InputField icon={Mail} label="Email Address" name="email" type="email" placeholder="sarah.j@email.com" value={formData.email} onChange={handleInputChange} error={errors.email} required />
            </motion.div>
            <motion.div variants={itemVariants}>
              <InputField icon={Phone} label="Phone Number" name="phone_number" type="tel" placeholder="+254..." value={formData.phone_number} onChange={handleInputChange} error={errors.phone_number} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <InputField icon={Lock} label="Password" name="password" type="password" value={formData.password} onChange={handleInputChange} error={errors.password} showPasswordToggle required />
            </motion.div>
            <motion.div variants={itemVariants}>
              <InputField icon={Lock} label="Confirm Password" name="password2" type="password" value={formData.password2} onChange={handleInputChange} error={errors.password2} showPasswordToggle required />
            </motion.div>

            <motion.div variants={itemVariants} className="md:col-span-2 mt-8 flex flex-col items-center gap-6">
              <motion.button 
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                type="submit"
                className="w-full flex items-center gap-2 sm:w-auto bg-teal-600 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-teal-200 hover:bg-teal-700 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
                {!isSubmitting && <ArrowRight size={20} />}
              </motion.button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;