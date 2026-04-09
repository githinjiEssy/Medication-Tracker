import React, { useState, useEffect } from 'react';
import { X, Activity, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { commentService } from '../services/commentService';
import { medicationService } from '../services/medicationService';

const AddSymptomModal = ({ isOpen, onClose, onRefresh }) => {
  const [severity, setSeverity] = useState(3);
  const [medications, setMedications] = useState([]);
  const [selectedMedication, setSelectedMedication] = useState('');
  const [symptomType, setSymptomType] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      medicationService.getMedications().then(response => {
        const meds = Array.isArray(response.data) ? response.data : response.data.results || [];
        setMedications(meds);
      }).catch(error => console.error('Error fetching medications:', error));
    }
  }, [isOpen]);

  const handleSave = async () => {
    // 1. Validation
    if (!selectedMedication || !symptomType) {
      alert('Please select a medication and a symptom type.');
      return;
    }

    setLoading(true);
    try {
      const fullNote = notes ? `${symptomType}: ${notes}` : symptomType;
      const severityInt = parseInt(severity, 10);

      await commentService.addMedicationSideEffect(
        selectedMedication, 
        fullNote, 
        severityInt
      );

      if (onRefresh) onRefresh();
      
      // Reset and Close
      setNotes('');
      setSymptomType('');
      setSelectedMedication('');
      setSeverity(3);
      onClose();

    } catch (error) {
      console.error('Submission Error:', error.response?.data);
      const serverErrors = error.response?.data;
      
      // Better error messaging for the user
      const message = serverErrors 
        ? Object.entries(serverErrors).map(([k, v]) => `${k}: ${v}`).join('\n')
        : 'There was an error saving your symptom.';
      
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const commonSymptoms = ["Dizziness", "Nausea", "Fatigue", "Headache", "Insomnia", "Dry Mouth"];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

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
            {/* Medication Selection */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Which medication?</label>
              <select 
                value={selectedMedication}
                onChange={(e) => setSelectedMedication(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-rose-500"
              >
                <option value="">Select Medication...</option>
                {medications.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>

            {/* Symptom Quick-Select */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 ml-1">What are you feeling?</label>
              <div className="flex flex-wrap gap-2">
                {commonSymptoms.map((symptom) => (
                  <button 
                    key={symptom}
                    type="button"
                    onClick={() => setSymptomType(symptom)}
                    className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all shadow-sm ${symptomType === symptom ? 'bg-rose-500 border-rose-500 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-rose-500'}`}
                  >
                    {symptom}
                  </button>
                ))}
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
            </div>

            {/* Additional Notes */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Additional Notes</label>
              <textarea 
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe how long it lasted or triggers..." 
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-rose-500 transition-all resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="p-8 border-t border-slate-50 flex gap-4 bg-white">
            <button 
              onClick={onClose}
              className="flex-1 py-4 border border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={loading}
              className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-bold hover:bg-rose-600 shadow-xl shadow-rose-500/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Save Entry'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddSymptomModal;