import React, { useState } from 'react';
import { X, Pill, Info, Calendar, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AddMedicationModal = ({ isOpen, onClose }) => {
  const [isOngoing, setIsOngoing] = useState(true);

  if (!isOpen) return null;

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
          className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-teal-50/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Pill size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Add New Prescription</h2>
                <p className="text-[10px] text-teal-600 font-black uppercase tracking-widest">Prescription Details</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-600 transition-colors shadow-sm"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-8 max-h-[65vh] overflow-y-auto custom-scrollbar">
            <form className="space-y-6">
              
              {/* Row 1: Name & Dose */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Medication Name</label>
                  <input type="text" placeholder="e.g. Lisinopril" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Dosage</label>
                  <input type="text" placeholder="e.g. 10mg" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all" />
                </div>
              </div>

              {/* Row 2: Frequency & Refills */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Frequency</label>
                  <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all cursor-pointer">
                    <option>Once daily</option>
                    <option>Twice daily</option>
                    <option>Three times daily</option>
                    <option>As needed (PRN)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-1">
                    <Hash size={14} className="text-slate-400" /> Refills Remaining
                  </label>
                  <input type="number" placeholder="0" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all" />
                </div>
              </div>

              {/* Row 3: Date Logic */}
              <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Calendar size={16} className="text-teal-600" />
                    Medication Duration
                  </label>
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                    <input 
                      type="checkbox" 
                      id="ongoing"
                      checked={isOngoing}
                      onChange={() => setIsOngoing(!isOngoing)}
                      className="w-4 h-4 accent-teal-600 rounded cursor-pointer"
                    />
                    <label htmlFor="ongoing" className="text-xs font-bold text-slate-600 cursor-pointer select-none">Ongoing</label>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Date</span>
                    <input type="date" className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:border-teal-500 outline-none text-sm" />
                  </div>
                  
                  {/* Conditional End Date */}
                  <AnimatePresence>
                    {!isOngoing && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-1.5"
                      >
                        <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest ml-1">End Date</span>
                        <input type="date" className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:border-orange-500 outline-none text-sm" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Row 4: Instructions */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Special Instructions</label>
                <textarea rows="2" placeholder="e.g. Take with a glass of water, avoid alcohol..." className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all resize-none" />
              </div>

            </form>
          </div>

          {/* Footer Actions */}
          <div className="p-8 border-t border-slate-50 flex gap-4 bg-white">
            <button 
              onClick={onClose}
              className="flex-1 py-4 border border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button className="flex-1 py-4 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 shadow-xl shadow-teal-600/20 transition-all">
              Save Prescription
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddMedicationModal;