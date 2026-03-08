import React from 'react'
import { motion } from 'framer-motion'

function FeatureCard({ title, description, icon: Icon }) {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-300"
    >
      <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
        {/* Render the Lucide component passed as a prop */}
        <Icon size={28} strokeWidth={2.5} />
      </div>
      <h3 className="font-bold text-xl mb-3 text-slate-800">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}

export default FeatureCard