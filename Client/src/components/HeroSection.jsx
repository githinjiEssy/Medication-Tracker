import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="relative py-20 px-6 overflow-hidden bg-gradient-to-b from-white to-slate-50">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-teal-50 rounded-full blur-3xl opacity-60" />

      <div className="grid lg:grid-cols-2 gap-12 items-center w-full max-w-7xl mx-auto relative z-10">
        
        {/* Left Side: Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-left"
        >
          <motion.span 
            variants={itemVariants}
            className="text-teal-600 font-bold tracking-widest text-xs uppercase bg-teal-50 px-3 py-1 rounded-full"
          >
            Welcome to MedTrack
          </motion.span>
          
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold mt-6 mb-6 leading-[1.1] text-slate-900"
          >
            Never miss a dose. <br />
            <span className="text-teal-600">Stay ahead of your health.</span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-gray-500 text-lg md:text-xl mb-10 max-w-xl leading-relaxed"
          >
            We help you manage your medications easily, safely, and efficiently. 
            Your health is your priority, and we make it ours too.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <button 
            onClick={() => navigate('/signup')}
            className="bg-teal-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-teal-200 hover:bg-teal-700 hover:-translate-y-1 transition-all duration-300">
              Get Started Free
            </button>
            <button className="group flex items-center gap-3 bg-white border border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all">
              <span className="w-8 h-8 flex items-center justify-center bg-teal-100 text-teal-600 rounded-full group-hover:scale-110 transition-transform">
                <Play />
              </span>
              Watch Video
            </button>
          </motion.div>
        </motion.div>

        {/* Right Side: Animated Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="relative group"
        >
          {/* Main Mockup Container */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="bg-blue-50 rounded-[2.5rem] p-4 md:p-6 shadow-2xl border border-blue-100 relative z-10"
          >
            <div className="bg-white rounded-[1.5rem] h-[300px] md:h-[450px] w-full shadow-inner overflow-hidden flex flex-col border border-gray-100">
              {/* Fake UI Header */}
              <div className="h-12 border-b border-gray-50 flex items-center px-6 gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <div className="w-3 h-3 rounded-full bg-slate-200" />
              </div>
              {/* Content Placeholder */}
              <div className="p-8 flex-1 space-y-6">
                <div className="flex justify-between items-center">
                   <div className="h-6 w-32 bg-slate-100 rounded animate-pulse" />
                   <div className="h-10 w-10 bg-teal-50 rounded-lg" />
                </div>
                <div className="space-y-3">
                  <div className="h-20 w-full bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-slate-300">
                    Dashboard Analytics View
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 bg-teal-50/50 rounded-xl" />
                    <div className="h-24 bg-blue-50/50 rounded-xl" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating Interaction Card */}
          <motion.div 
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-6 -left-12 bg-white p-5 rounded-2xl shadow-2xl border border-teal-50 z-20 flex items-center gap-4 hidden md:flex"
          >
            <div className="w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center text-xl shadow-lg shadow-teal-200">
              🔔
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Next Reminder</p>
              <p className="text-sm font-extrabold text-slate-800">Vitamin C • 10:30 AM</p>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;