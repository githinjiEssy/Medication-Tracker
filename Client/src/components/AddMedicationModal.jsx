import React, { useState } from 'react';
import { X, Pill, User, Building2, ClipboardList, Clock, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { medicationService } from '../services/medicationService';

const AddMedicationModal = ({ isOpen, onClose, onSuccess }) => {
  const [isOngoing, setIsOngoing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [specificTimes, setSpecificTimes] = useState([]);
  const [timeInput, setTimeInput] = useState("");

  // Helper to add a time to the list
  const addTime = () => {
    if (timeInput && !specificTimes.includes(timeInput)) {
      setSpecificTimes([...specificTimes, timeInput]);
      setTimeInput("");
    }
  }

  // Helper to remove a time
  const removeTime = (index) => {
    setSpecificTimes(specificTimes.filter((_, i) => i !== index));
  };

  const [formData, setFormData] = useState({
    name: '',
    generic_name: '',
    dosage: '',
    dosage_form: 'TABLET',
    frequency: 'ONCE',
    frequency_other: '',
    route: 'ORAL',
    prescribed_date: new Date().toISOString().split('T')[0],
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    specific_times: [], 
    prescribed_by: '',
    prescription_number: '',
    pharmacy_name: '',
    pharmacy_phone: '',
    refills_remaining: 0,
    quantity: '',
    instructions: '',
    reason: '',
    status: 'ACTIVE'
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Determine the correct frequency
      let finalFrequency = formData.frequency;
      
      // If there are specific times, force frequency to SPECIFIC
      if (specificTimes.length > 0) {
        finalFrequency = 'SPECIFIC';
      }
      
      const payload = {
        ...formData,
        frequency: finalFrequency,
        specific_times: specificTimes,
        end_date: isOngoing ? null : (formData.end_date || null),
        refills_remaining: parseInt(formData.refills_remaining) || 0,
        quantity: formData.quantity ? parseInt(formData.quantity) : null,
      };
      
      // Validate specific times if frequency is SPECIFIC
      if (finalFrequency === 'SPECIFIC' && specificTimes.length === 0) {
        setError({ specific_times: ['Please add at least one time for SPECIFIC frequency'] });
        setLoading(false);
        return;
      }
      
      // Validate frequency_other if frequency is OTHER
      if (finalFrequency === 'OTHER' && !formData.frequency_other) {
        setError({ frequency_other: ['Please specify the frequency'] });
        setLoading(false);
        return;
      }
      
      console.log('Submitting payload:', payload); // For debugging
      
      await medicationService.createMedication(payload);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Error creating medication:', err);
      setError(err.response?.data || "Failed to create medication. Check your input.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputStyle = "w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-teal-500 transition-all text-sm";
  const labelStyle = "text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-teal-50/30 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg"><Pill size={20} /></div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Add Medication</h2>
                <p className="text-[10px] text-teal-600 font-black uppercase tracking-widest">Complete Clinical Profile</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="p-2 hover:bg-white rounded-full text-slate-400"><X size={20} /></button>
          </div>

          <form onSubmit={handleSubmit} className="overflow-y-auto p-8 space-y-8 custom-scrollbar">
            {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold">Error: {JSON.stringify(error)}</div>}

            {/* Section 1: Core Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2"><ClipboardList size={18} className="text-teal-600"/><h3 className="font-bold text-slate-800">Basic Information</h3></div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Brand Name</label>
                  <input required id="name" value={formData.name} onChange={handleChange} type="text" placeholder="e.g. Panadol" className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Generic Name</label>
                  <input id="generic_name" value={formData.generic_name} onChange={handleChange} type="text" placeholder="e.g. Paracetamol" className={inputStyle} />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className={labelStyle}>Dosage (e.g. 500mg)</label>
                  <input required id="dosage" value={formData.dosage} onChange={handleChange} type="text" className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Form</label>
                  <select id="dosage_form" value={formData.dosage_form} onChange={handleChange} className={inputStyle}>
                    <option value="TABLET">Tablet</option>
                    <option value="CAPSULE">Capsule</option>
                    <option value="LIQUID">Liquid</option>
                    <option value="INJECTION">Injection</option>
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>Route</label>
                  <select id="route" value={formData.route} onChange={handleChange} className={inputStyle}>
                    <option value="ORAL">Oral</option>
                    <option value="TOPICAL">Topical</option>
                    <option value="INHALATION">Inhalation</option>
                </select></div>
              </div>
            </div>

            {/* Section 2: Scheduling */}
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-teal-600"/>
                  <h3 className="font-bold text-slate-800">Schedule & Dates</h3>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-xl border border-slate-200">
                  <input 
                    type="checkbox" 
                    id="ongoing" 
                    checked={isOngoing} 
                    onChange={() => setIsOngoing(!isOngoing)} 
                    className="w-4 h-4 accent-teal-600 cursor-pointer" 
                  />
                  <label htmlFor="ongoing" className="text-xs font-bold text-slate-600">Ongoing</label>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className={labelStyle}>Frequency</label>
                  <select 
                    id="frequency" 
                    value={formData.frequency} 
                    onChange={handleChange} 
                    className={inputStyle}
                  >
                    <option value="ONCE">Once daily</option>
                    <option value="TWICE">Twice daily</option>
                    <option value="THRICE">Three times daily</option>
                    <option value="FOUR">Four times daily</option>
                    <option value="EVERY_OTHER">Every other day</option>
                    <option value="WEEKLY">Once weekly</option>
                    <option value="BIWEEKLY">Twice weekly</option>
                    <option value="MONTHLY">Once monthly</option>
                    <option value="AS_NEEDED">As needed</option>
                    <option value="SPECIFIC">Specific times</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>Start Date</label>
                  <input 
                    id="start_date" 
                    type="date" 
                    value={formData.start_date} 
                    onChange={handleChange} 
                    className={inputStyle} 
                    required
                  />
                </div>
                {!isOngoing && (
                  <div>
                    <label className={labelStyle}>End Date</label>
                    <input 
                      id="end_date" 
                      type="date" 
                      value={formData.end_date} 
                      onChange={handleChange} 
                      className={inputStyle} 
                    />
                  </div>
                )}
              </div>
              
              {formData.frequency === 'OTHER' && (
                <input 
                  id="frequency_other" 
                  value={formData.frequency_other} 
                  onChange={handleChange} 
                  type="text" 
                  placeholder="Specify frequency..." 
                  className={`${inputStyle} bg-white mt-2`} 
                />
              )}
            </div>

            {/* Dosing Schedule Times */}
            <div className="space-y-4 p-6 bg-teal-50/30 rounded-3xl border border-teal-100">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Clock size={16} className="text-teal-600" /> 
                Dosing Schedule Times
              </label>
              
              <div className="flex gap-2">
                <input 
                  type="time" 
                  value={timeInput}
                  onChange={(e) => setTimeInput(e.target.value)}
                  className="flex-1 p-3 bg-white border border-slate-200 rounded-xl outline-none"
                />
                <button 
                  type="button"
                  onClick={addTime}
                  className="px-4 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {specificTimes.map((time, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-teal-200 text-teal-700 font-bold text-sm">
                    {time}
                    <button type="button" onClick={() => removeTime(index)}>
                      <Trash2 size={14} className="text-red-400 hover:text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Medical/Pharmacy Details */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User size={18} className="text-teal-600"/>
                  <h3 className="font-bold text-slate-800">Prescriber</h3>
                </div>
                <div>
                  <label className={labelStyle}>Prescribed By</label>
                  <input id="prescribed_by" value={formData.prescribed_by} onChange={handleChange} type="text" placeholder="Dr. Name" className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Prescription #</label>
                  <input id="prescription_number" value={formData.prescription_number} onChange={handleChange} type="text" className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Reason for taking</label>
                  <input id="reason" value={formData.reason} onChange={handleChange} type="text" placeholder="e.g. Hypertension" className={inputStyle} />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2"><Building2 size={18} className="text-teal-600"/><h3 className="font-bold text-slate-800">Pharmacy</h3></div>
                <div>
                  <label className={labelStyle}>Pharmacy Name</label>
                  <input id="pharmacy_name" value={formData.pharmacy_name} onChange={handleChange} type="text" className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Pharmacy Phone</label>
                  <input id="pharmacy_phone" value={formData.pharmacy_phone} onChange={handleChange} type="tel" className={inputStyle} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelStyle}>Total Quantity</label>
                    <input id="quantity" value={formData.quantity} onChange={handleChange} type="number" className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelStyle}>Refills Left</label>
                    <input id="refills_remaining" value={formData.refills_remaining} onChange={handleChange} type="number" className={inputStyle} />
                  </div>
                </div>
              </div>
            </div>

            {/* prescribed date */}
            <div>
              <label className={labelStyle}>Prescribed Date</label>
              <input type="date" id='prescribedDate' value={formData.prescribed_date} onChange={handleChange} className={inputStyle} />
            </div>

            {/* Instructions */}
            <div>
              <label className={labelStyle}>Instructions</label>
              <textarea id="instructions" value={formData.instructions} onChange={handleChange} rows="2" className={`${inputStyle} resize-none`} placeholder="e.g. Take with food..." />
            </div>
          </form>

          {/* Footer */}
          <div className="p-6 border-t border-slate-50 flex gap-4 bg-white flex-shrink-0">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
            <button type="submit" onClick={handleSubmit} disabled={loading} className="flex-2 px-8 py-3 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-600/20 disabled:opacity-50">
              {loading ? "Saving..." : "Save Medication"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddMedicationModal;