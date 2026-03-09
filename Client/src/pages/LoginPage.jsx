import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in with:", formData);
    // Add authentication logic here
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col lg:flex-row">
      
      {/* Left Side: Branding (Matches Signup Theme) */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="lg:w-2/5 bg-slate-900 p-12 lg:p-20 flex flex-col justify-between text-white relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600 rounded-full blur-[100px] opacity-30" />
        
        <div className="relative z-10">
          <div 
            className="flex items-center gap-3 font-bold text-teal-400 text-2xl mb-16 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Heart size={20} fill="currentColor" />
            </div>
            MedTrack
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Welcome <br />
            <span className="text-teal-400">Back.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-sm">
            Log in to manage your schedule, check your adherence trends, and stay on top of your health.
          </p>
        </div>

        <div className="relative z-10 mt-20 flex items-center gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
           <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center text-teal-400">
              <ShieldCheck size={24} />
           </div>
           <div>
             <p className="text-sm font-bold">Secure Access</p>
             <p className="text-xs text-slate-400">Bank-grade encryption active</p>
           </div>
        </div>
      </motion.div>

      {/* Right Side: Login Form */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="lg:w-3/5 p-8 md:p-16 xl:p-24 flex flex-col justify-center"
      >
        <div className="max-w-md mx-auto w-full">
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-slate-950 mb-2">Sign In</h2>
            <p className="text-slate-500">
              New to MedTrack?{' '}
              <button onClick={() => navigate('/signup')} className="text-teal-600 font-semibold hover:underline">
                Create an account
              </button>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 pl-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-600 transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full py-3.5 pl-12 pr-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition-all font-medium"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2 pl-1">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <a href="#" className="text-xs font-bold text-teal-600 hover:text-teal-700">Forgot Password?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-600 transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="w-full py-3.5 pl-12 pr-12 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition-all font-medium"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 pl-1">
              <input type="checkbox" id="remember" className="w-4 h-4 accent-teal-600 rounded cursor-pointer" />
              <label htmlFor="remember" className="text-sm text-slate-500 cursor-pointer select-none">Remember this device</label>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-teal-100 hover:bg-teal-700 transition-all flex items-center justify-center gap-2 group"
            >
              Log In
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </form>

          {/* Social Login Separator */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-400">Or continue with</span>
            </div>
          </div>

          <button className="w-full py-3 border border-slate-200 rounded-xl flex items-center justify-center gap-3 font-semibold text-slate-700 hover:bg-slate-50 transition-all">
            <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="Google" />
            Google
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;