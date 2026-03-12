import React, { useState } from 'react';
import { X, Activity, AlertCircle, Calendar, Clock, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AddSymptomModal = ({ isOpen, onClose }) => {
  const [severity, setSeverity] = useState(3);
  
  if (!isOpen) return null;

  const commonSymptoms = ["Dizziness", "Nausea", "Fatigue", "Headache", "Insomnia", "Dry Mouth"];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-rose-50/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Activity size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Log Side Effect</h2>
                <p className="text-[10px] text-rose-600 font-black uppercase tracking-widest">Symptom Journal</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-slate-400 transition-colors shadow-sm">
              <X size={20} />
            </button>
          </div>

          <div className="p-8 space-y-6">
            {/* Symptom Selection */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 ml-1">What are you feeling?</label>
              <div className="flex flex-wrap gap-2">
                {commonSymptoms.map((symptom) => (
                  <button 
                    key={symptom}
                    type="button"
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:border-rose-500 hover:text-rose-500 transition-all bg-white shadow-sm"
                  >
                    {symptom}
                  </button>
                ))}
                <input 
                  type="text" 
                  placeholder="+ Other" 
                  className="px-4 py-2 rounded-xl border border-dashed border-slate-300 text-xs font-bold w-24 outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Severity Slider */}
            <div className="space-y-4 p-5 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-700">Severity Level</label>
                <span className={`text-xs font-black px-3 py-1 rounded-lg uppercase ${
                  severity > 7 ? 'bg-red-100 text-red-600' : 'bg-teal-100 text-teal-600'
                }`}>
                  Level {severity}
                </span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                <span>Mild</span>
                <span>Moderate</span>
                <span>Severe</span>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Date</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-4 top-4 text-slate-400" />
                  <input type="date" className="w-full pl-11 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-rose-500 transition-all" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Time</label>
                <div className="relative">
                  <Clock size={16} className="absolute left-4 top-4 text-slate-400" />
                  <input type="time" className="w-full pl-11 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-rose-500 transition-all" />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Additional Notes</label>
              <textarea 
                rows="3" 
                placeholder="Describe how long it lasted or if anything triggered it..." 
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-rose-500 transition-all resize-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-8 border-t border-slate-50 flex gap-4 bg-white">
            <button 
              onClick={onClose}
              className="flex-1 py-4 border border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-bold hover:bg-rose-600 shadow-xl shadow-rose-500/20 transition-all">
              Save Entry
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddSymptomModal;