import React, { useState, useEffect } from 'react';
import { medicationService } from '../services/medicationService';
import { X, Loader2, Plus, Trash2, Clock, ChevronDown } from 'lucide-react';

const EditMedicationModal = ({ isOpen, onClose, onSuccess, medication }) => {
  // 1. Define the choices exactly as they appear in Django
  const FREQUENCY_OPTIONS = [
    { value: 'ONCE', label: 'Once daily' },
    { value: 'TWICE', label: 'Twice daily' },
    { value: 'THRICE', label: 'Three times daily' },
    { value: 'FOUR', label: 'Four times daily' },
    { value: 'EVERY_OTHER', label: 'Every other day' },
    { value: 'WEEKLY', label: 'Once weekly' },
    { value: 'BIWEEKLY', label: 'Twice weekly' },
    { value: 'MONTHLY', label: 'Once monthly' },
    { value: 'AS_NEEDED', label: 'As needed' },
    { value: 'SPECIFIC', label: 'Specific times' },
    { value: 'OTHER', label: 'Other' },
  ];

  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    dosage_form: '',
    instructions: '',
    frequency: 'ONCE',
    refills_remaining: 0,
    specific_times: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (medication) {
      setFormData({
        name: medication.name || '',
        dosage: medication.dosage || '',
        dosage_form: medication.dosage_form || '',
        instructions: medication.instructions || '',
        frequency: medication.frequency || 'ONCE',
        refills_remaining: medication.refills_remaining || 0,
        specific_times: Array.isArray(medication.specific_times) ? [...medication.specific_times] : []
      });
    }
  }, [medication]);

  const handleTimeChange = (index, value) => {
    const newTimes = [...formData.specific_times];
    newTimes[index] = value;
    setFormData({ ...formData, specific_times: newTimes });
  };

  const addTimeSlot = () => {
    setFormData({ ...formData, specific_times: [...formData.specific_times, "08:00"] });
  };

  const removeTimeSlot = (index) => {
    const newTimes = formData.specific_times.filter((_, i) => i !== index);
    setFormData({ ...formData, specific_times: newTimes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Using patch to only update the fields we changed
      await medicationService.updateMedication(medication.id, formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update medication.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl animate-in zoom-in-95 duration-200 no-scrollbar">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 sticky top-0 bg-white pb-4 z-10 border-b border-slate-50">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Update Prescription</h2>
            <p className="text-slate-400 font-bold text-sm">Modifying {formData.name}</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row: Name */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Medication Name</label>
            <input 
              type="text"
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none font-bold text-slate-700"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          {/* Row: Dosage & Form */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Dosage (e.g. 500mg)</label>
              <input 
                type="text"
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none font-bold text-slate-700"
                value={formData.dosage}
                onChange={(e) => setFormData({...formData, dosage: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Refills Left</label>
              <input 
                type="number"
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none font-bold text-slate-700"
                value={formData.refills_remaining}
                onChange={(e) => setFormData({...formData, refills_remaining: e.target.value})}
              />
            </div>
          </div>

          {/* Frequency Dropdown - UPDATED WITH CHOICES */}
          <div className="relative">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">How often?</label>
            <select 
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none font-bold text-slate-700 appearance-none cursor-pointer"
              value={formData.frequency}
              onChange={(e) => setFormData({...formData, frequency: e.target.value})}
            >
              {FREQUENCY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 bottom-4 text-slate-400 pointer-events-none" size={20} />
          </div>

          {/* Times Section */}
          <div className="bg-teal-50/50 p-6 rounded-[2rem] border border-teal-100/50">
            <div className="flex justify-between items-center mb-4">
              <label className="text-[10px] font-black text-teal-700 uppercase tracking-[0.2em] flex items-center gap-2">
                <Clock size={14} /> Intake Times
              </label>
              <button 
                type="button" 
                onClick={addTimeSlot}
                className="bg-white text-teal-600 p-2 rounded-xl border border-teal-100 shadow-sm hover:shadow-md transition-all"
              >
                <Plus size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {formData.specific_times.length > 0 ? (
                formData.specific_times.map((time, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-teal-100 shadow-sm">
                    <input 
                      type="time"
                      className="flex-1 bg-transparent outline-none font-bold text-slate-700 p-1"
                      value={time}
                      onChange={(e) => handleTimeChange(index, e.target.value)}
                    />
                    <button 
                      type="button" 
                      onClick={() => removeTimeSlot(index)}
                      className="text-red-400 hover:text-red-500 p-1 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="col-span-2 text-center py-2 text-xs font-bold text-teal-600/60 italic">No times set. Click the plus to add one.</p>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Special Instructions</label>
            <textarea 
              rows="3"
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none text-slate-600 italic font-medium"
              placeholder="e.g. Take after breakfast..."
              value={formData.instructions}
              onChange={(e) => setFormData({...formData, instructions: e.target.value})}
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Confirm Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditMedicationModal;