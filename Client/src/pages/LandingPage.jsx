import React from 'react'
import logo from '../assets/images/logo.png'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import FeatureCard from '../components/FeatureCard'
import { Bell, BarChart3, ClipboardPlus, ShieldCheck } from 'lucide-react'
import { CalendarClock, BellRing, Pill, CheckCircle2 } from 'lucide-react'
import { Quote, Star } from 'lucide-react'
import { Zap, ArrowRight, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import Footer from '../components/Footer'

function LandingPage() {
  const steps = [
    {
      id: "01",
      title: "Set your schedule",
      description: "Easily input your prescriptions and dosage times. Our smart system handles the rest.",
      icon: CalendarClock,
      color: "bg-blue-500",
    },
    {
      id: "02",
      title: "Get smart reminders",
      description: "Receive timely notifications across all your devices, ensuring you never miss a beat.",
      icon: BellRing,
      color: "bg-teal-500",
    },
    {
      id: "03",
      title: "Stay on track",
      description: "Monitor your adherence with automated logs and get refill alerts before you run out.",
      icon: Pill,
      color: "bg-indigo-500",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Diabetes Patient",
      content: "MedTrack has completely changed how I manage my insulin. The reminders are persistent but not annoying. I haven't missed a dose in three months!",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      rating: 5
    },
    {
      name: "Dr. Michael Chen",
      role: "Cardiologist",
      content: "I recommend this to all my patients. The ability to export logs directly to my office makes our check-ups much more efficient and data-driven.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      rating: 5
    },
    {
      name: "Emma Thompson",
      role: "Caretaker",
      content: "Managing my father's 8 different medications was a nightmare before this. Now, the family sync feature keeps everyone on the same page.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      rating: 4
    }
  ];

  return (
    <div className='bg-[var(--background)'>
      {/* ================== Navbar ========================= */}
      <Navbar/>

      {/* ================== Hero section =========================*/}
      <HeroSection />

      {/* ================== Features Grid ================== */}
      <section id='feature' className="bg-slate-50/50 py-24 px-6 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-900 tracking-tight">
              Everything you need to manage your meds
            </h2>
            <p className="text-gray-500 text-lg">
              Powerful tools designed to make health management stress-free and automated.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={Bell} 
              title="Medication Alerts" 
              description="Get notified exactly when it's time to take your pills with smart, persistent reminders." 
            />
            <FeatureCard 
              icon={BarChart3} 
              title="Track Progress" 
              description="Monitor your adherence and health trends over time with beautiful, easy-to-read charts." 
            />
            <FeatureCard 
              icon={ClipboardPlus} 
              title="Doctor Reports" 
              description="Generate and share detailed logs with your healthcare provider in just a few clicks." 
            />
            <FeatureCard 
              icon={ShieldCheck} 
              title="Secure Data" 
              description="Your information is encrypted with bank-grade security and is always kept private." 
            />
          </div>
        </div>
      </section>

      {/* ================== How it works section ==================*/}
      <section id='product' className="py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          
          {/* Left Side: Dynamic Illustration */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Decorative Glows */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-teal-100 rounded-full blur-[100px] opacity-60" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-100 rounded-full blur-[100px] opacity-60" />

            <div className="relative z-10 bg-gradient-to-br from-slate-50 to-teal-50/30 rounded-[3rem] p-8 border border-slate-100 shadow-2xl aspect-square flex items-center justify-center">
              {/* Main 3D Placeholder */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="text-[160px] drop-shadow-2xl"
              >
                👨‍⚕️
              </motion.div>

              {/* Floating Interaction Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="absolute top-10 right-0 bg-white p-4 rounded-2xl shadow-xl border border-teal-50 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Status</p>
                  <p className="text-sm font-bold text-slate-800">Dose Logged</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side: Timeline Steps */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
                Simple steps to <br />
                <span className="text-teal-600 font-black tracking-tight underline decoration-teal-100 underline-offset-8">better health.</span>
              </h2>
              <p className="text-slate-500 text-lg">Managing your wellness shouldn't be a full-time job. We made it a 3-step breeze.</p>
            </motion.div>

            <div className="space-y-12 relative">
              {/* Vertical Connector Line */}
              <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-slate-100 hidden md:block" />

              {steps.map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="group flex gap-8 relative z-10"
                >
                  {/* Number Icon */}
                  <div className={`w-12 h-12 rounded-2xl ${step.color} text-white flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform shrink-0`}>
                    <step.icon size={24} />
                  </div>

                  <div className="pt-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-teal-600 font-mono font-bold text-sm tracking-tighter">{step.id}</span>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-slate-500 leading-relaxed max-w-md">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ====================================== Testimonials Section ========================= */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Content */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-extrabold text-slate-900 mb-4"
            >
              Trusted by <span className="text-teal-600">thousands of patients</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-500 text-lg"
            >
              Join a community of people taking control of their health journeys with confidence and ease.
            </motion.p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative group transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/5"
              >
                {/* Decorative Quote Icon */}
                <div className="absolute top-6 right-8 text-teal-50 group-hover:text-teal-100 transition-colors">
                  <Quote size={48} fill="currentColor" />
                </div>

                {/* Star Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={i < item.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200"} 
                    />
                  ))}
                </div>

                <p className="text-slate-600 leading-relaxed mb-8 italic relative z-10">
                  "{item.content}"
                </p>

                {/* User Profile */}
                <div className="flex items-center gap-4 border-t border-slate-50 pt-6">
                  <img 
                    src={item.avatar} 
                    alt={item.name} 
                    className="w-12 h-12 rounded-full bg-teal-50 border border-teal-100"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900">{item.name}</h4>
                    <p className="text-xs text-teal-600 font-semibold uppercase tracking-wider">
                      {item.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust Badges Placeholder */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-20 flex flex-wrap justify-center items-center gap-12 grayscale opacity-50"
          >
            <span className="font-black text-2xl text-slate-400 tracking-tighter italic">HEALTHLINE</span>
            <span className="font-black text-2xl text-slate-400 tracking-tighter italic">Forbes Health</span>
            <span className="font-black text-2xl text-slate-400 tracking-tighter italic">WebMD</span>
            <span className="font-black text-2xl text-slate-400 tracking-tighter italic">Mayo Clinic</span>
          </motion.div>
        </div>
      </section>

      {/* ================================== Call to Action ================================== */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Main Card Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative bg-slate-900 rounded-[3rem] p-12 md:p-20 overflow-hidden shadow-2xl shadow-teal-900/20"
          >
            {/* Animated Background Glows */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3] 
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute -top-24 -right-24 w-96 h-96 bg-teal-500 rounded-full blur-[100px]"
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2] 
              }}
              transition={{ duration: 10, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600 rounded-full blur-[100px]"
            />

            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Side: Content */}
              <div className="text-left">
                <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 text-teal-400 px-4 py-2 rounded-full mb-6">
                  <Zap size={16} fill="currentColor" />
                  <span className="text-xs font-bold uppercase tracking-widest">Join 50,000+ Users</span>
                </div>
                
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  Ready to take control of <br />
                  <span className="text-teal-400">your health?</span>
                </h2>
                
                <p className="text-slate-400 text-lg mb-10 max-w-md">
                  Start your 14-day free trial today. No credit card required. 
                  Sync with your doctor in seconds.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-teal-500 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-teal-500/25 flex items-center justify-center gap-2 group hover:bg-teal-400 transition-all"
                  >
                    Get Started Now
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                  
                  <button className="bg-slate-800 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-slate-700 transition-all border border-slate-700">
                    Contact Sales
                  </button>
                </div>
              </div>

              {/* Right Side: Quick Features List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  "HIPAA Compliant",
                  "Real-time Sync",
                  "No hidden fees",
                  "24/7 Support",
                  "Offline Access",
                  "Family Sharing"
                ].map((text, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    className="flex items-center gap-3 text-slate-300"
                  >
                    <div className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 flex-shrink-0">
                      <CheckCircle size={14} />
                    </div>
                    <span className="text-sm font-medium">{text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Footer Credit Line */}
          <p className="text-center text-slate-400 mt-12 text-sm">
            Trusted by healthcare providers worldwide. 
            <a href="#" className="text-teal-600 font-bold ml-1 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </section>

      {/* =================== Footer ====================== */}
      <Footer />

    </div>
  )
}

export default LandingPage
