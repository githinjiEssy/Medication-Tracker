import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, User, Mail, Lock, CalendarDays, Phone, CheckCircle2, AlertTriangle, Eye, EyeOff } from 'lucide-react';

// Common animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

// Reusable Input Component with Icons and Interaction
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
            ${success ? 'border-green-400' : ''}
          `}
        />

        {/* Dynamic Status Icons (Error, Success, Password Toggle) */}
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-2">
          {error && <AlertTriangle className="text-red-500" size={20} />}
          {success && <CheckCircle2 className="text-green-500" size={20} />}
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
      
      {/* Dynamic Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-xs text-red-600 mt-1 pl-1 font-medium"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

const SignupPage = () => {
  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    dob: '',
    age: '',
    gender: '',
    password: '',
  });

  // Basic Validation State (example)
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }

    // Auto-calculate age from DOB (example interaction)
    if (name === 'dob') {
      const birthDate = new Date(value);
      if (!isNaN(birthDate)) {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        setFormData(prev => ({ ...prev, age: age >= 0 ? age.toString() : '' }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate validation
    let newErrors = {};
    if (!formData.email.includes('@')) newErrors.email = 'Invalid email address';
    if (formData.password.length < 8) newErrors.password = 'Must be at least 8 characters';
    
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert('Signup request submitted! (Simulated)');
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col lg:flex-row">
      
      {/* ================== Left Side: Visual/Branding ========================= */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="lg:w-2/5 bg-slate-900 p-12 lg:p-20 flex flex-col justify-between text-white relative overflow-hidden"
      >
        {/* Animated Background Glows to match theme */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-24 -right-24 w-96 h-96 bg-teal-500 rounded-full blur-[100px]"
        />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 font-bold text-teal-400 text-2xl mb-16">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-200/50">
              <Heart size={20} fill="currentColor" />
            </div>
            MedTrack
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight">
            Begin your <br />
            <span className="text-teal-400">wellness journey</span> <br />
            today.
          </h1>
          <p className="text-slate-400 text-lg mb-10 max-w-sm">
            Create your secure account to instantly access smart medication tracking, adherence insights, and professional reports.
          </p>
        </div>

        {/* Abstract/Iconic visual at bottom left */}
        <div className="relative z-10 mt-20 flex justify-center grayscale opacity-20 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
           <Zap className="w-48 h-48 text-teal-500" strokeWidth={1}/>
        </div>
      </motion.div>

      {/* ================== Right Side: Interactive Form ========================= */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="lg:w-3/5 p-8 md:p-16 xl:p-24 flex flex-col justify-center bg-white"
      >
        <div className="max-w-2xl mx-auto w-full">
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-slate-950 mb-3">
              Create your account
            </h2>
            <p className="text-slate-500 text-lg">
              Already have an account? <a href="/login" className="text-teal-600 font-semibold hover:underline">Log in</a>
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-x-6">
            
            {/* Row 1: First/Last Name */}
            <motion.div variants={itemVariants}>
              <InputField icon={User} label="First Name" name="firstName" placeholder="Sarah" value={formData.firstName} onChange={handleInputChange} required />
            </motion.div>
            <motion.div variants={itemVariants}>
              <InputField icon={User} label="Last Name" name="lastName" placeholder="Jenkins" value={formData.lastName} onChange={handleInputChange} required />
            </motion.div>

            {/* Row 2: Username (full width) */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              <InputField icon={User} label="Username" name="username" placeholder="sarahj_health" value={formData.username} onChange={handleInputChange} required />
            </motion.div>

            {/* Row 3: DOB & Age */}
            <motion.div variants={itemVariants}>
              <InputField icon={CalendarDays} label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleInputChange} required />
            </motion.div>
            <motion.div variants={itemVariants}>
              <InputField 
                icon={User} 
                label="Age" 
                name="age" 
                type="number" 
                placeholder="28" 
                value={formData.age} 
                onChange={handleInputChange} 
                readOnly 
                className="w-full py-3.5 pl-12 pr-4 border rounded-xl bg-slate-50 text-slate-600 cursor-not-allowed border-slate-200 outline-none font-medium" 
                title="Calculated from DOB"
              />
            </motion.div>

            {/* Row 4: Gender */}
            <motion.div variants={itemVariants} className="mb-5 relative group">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 pl-1 tracking-tight">Gender</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-600 transition-colors">
                  <User size={20} strokeWidth={2} />
                </div>
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleInputChange}
                  required
                  className="w-full py-3.5 pl-12 pr-4 border rounded-xl text-slate-900 bg-white border-slate-200 outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition-all font-medium appearance-none"
                >
                  <option value="" disabled className="text-slate-400">Select...</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">▼</div>
              </div>
            </motion.div>

            {/* Row 5: Email & Phone */}
            <motion.div variants={itemVariants}>
              <InputField icon={Mail} label="Email Address" name="email" type="email" placeholder="sarah.j@email.com" value={formData.email} onChange={handleInputChange} error={errors.email} required />
            </motion.div>
            <motion.div variants={itemVariants}>
              <InputField icon={Phone} label="Phone Number" name="phone" type="tel" placeholder="(555) 123-4567" value={formData.phone} onChange={handleInputChange} />
            </motion.div>

            {/* Row 6: Password (full width) */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              <InputField 
                icon={Lock} 
                label="Create Password" 
                name="password" 
                type="password" 
                placeholder="Min 8 characters" 
                value={formData.password} 
                onChange={handleInputChange} 
                error={errors.password} 
                showPasswordToggle 
                required 
              />
            </motion.div>

            {/* Row 7: Submit Button & Terms */}
            <motion.div variants={itemVariants} className="md:col-span-2 mt-8 flex flex-col items-center gap-6">
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full sm:w-auto bg-teal-600 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-teal-200 hover:bg-teal-700 transition-all flex items-center gap-2 group"
              >
                Create Account
                <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
              </motion.button>
              
              <p className="text-center text-slate-400 text-sm max-w-sm leading-relaxed">
                By signing up, you agree to our <a href="#" className="text-teal-600 font-medium hover:underline">Terms of Service</a> and <a href="#" className="text-teal-600 font-medium hover:underline">Privacy Policy</a>.
              </p>
            </motion.div>

          </form>
        </div>
      </motion.div>
    </div>
  );
};

// Re-using the abstract Zap component definition from landing page components (optional import or redefine)
const Zap = ({ className, strokeWidth = 1.5 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth} 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <path d="m8 11 4-4 4 4" />
    <path d="M12 7v14" />
  </svg>
);

// Define ArrowRight since we use it in the button
const ArrowRight = ({ className, size = 20 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export default SignupPage;