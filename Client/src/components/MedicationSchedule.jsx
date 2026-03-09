import React, { useState } from 'react';
import { Pill, Plus, CalendarDays, FlaskConical, Trash2, Clock, CheckCircle, Info } from 'lucide-react';

const scheduleData = [
  { id: 1, time: "08:00", name: "Lisinopril 10 mg", instruction: "1 tablet b7 Before breakfast", type: "warning", statusText: "Due in 15 min" },
  { id: 2, time: "12:30", name: "Metformin 500 mg", instruction: "2 tablets b7 With food", type: "info", statusText: "Upcoming" },
  { id: 3, time: "21:00", name: "Atorvastatin 20 mg", instruction: "1 tablet b7 Evening", type: "success", statusText: "Taken" },
];

const MedicationSchedule = () => {
  const [schedule, setSchedule] = useState(scheduleData);

  const handleAction = (id, action) => {
    alert(`${action} medication ID: ${id}`);
    // State management logic would go here
  };

  return (
    <div className="space-y-8">
      {/* 1. Today's Schedule (List View) */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Clock className="text-teal-500" size={18} />
            Today's Schedule
          </h3>
          <button className="text-teal-600 text-xs font-bold hover:underline">View full week</button>
        </div>
        
        <div className="space-y-4">
          {schedule.map((item) => (
            <div key={item.id} className="grid grid-cols-[80px_1fr_120px] items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-teal-50 hover:shadow-inner transition-all group">
              <span className="text-slate-500 font-medium text-sm">{item.time}</span>
              <div>
                <p className="font-bold text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">{item.instruction}</p>
              </div>
              <div className="flex justify-end gap-2">
                {item.type === 'success' ? (
                   <div className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold text-xs">
                     <CheckCircle size={12}/> Taken
                   </div>
                ) : (
                  <>
                    <button onClick={() => handleAction(item.id, 'Taken')} className="bg-teal-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-teal-700">Mark as taken</button>
                    <button onClick={() => handleAction(item.id, 'Skip')} className="bg-white border border-slate-200 text-slate-500 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-100">Skip</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Add / Edit Medication Form */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6 border-b border-slate-50 pb-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Plus className="text-teal-500" size={18} />
            Add / edit medication
          </h3>
          <div className="flex gap-2">
            <button className="bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-teal-700">Save medication</button>
            <button className="text-slate-400 font-medium text-sm hover:text-slate-600">Clear</button>
          </div>
        </div>

        <form className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5 pl-1">Medication name</label>
              <input type="text" placeholder="e.g., Lisinopril, Metformin" className="w-full py-3 px-4 border border-slate-200 rounded-xl bg-slate-50/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5 pl-1">Dosage</label>
              <input type="text" placeholder="e.g., 10 mg, 500 mg" className="w-full py-3 px-4 border border-slate-200 rounded-xl bg-slate-50/50" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5 pl-1">Frequency</label>
              <input type="text" placeholder="e.g., Once daily, With food" className="w-full py-3 px-4 border border-slate-200 rounded-xl bg-slate-50/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5 pl-1">Start date</label>
              <input type="date" className="w-full py-3 px-4 border border-slate-200 rounded-xl bg-slate-50/50" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5 pl-1">End date (or ongoing)</label>
            <input type="text" placeholder="Set end date or ongoing" className="w-full py-3 px-4 border border-slate-200 rounded-xl bg-slate-50/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5 pl-1">Additional instructions</label>
            <textarea placeholder="e.g., take before breakfast" className="w-full h-24 py-3 px-4 border border-slate-200 rounded-xl bg-slate-50/50 resize-none" />
          </div>
        </form>

        {/* Interaction Check Banner */}
        <div className="mt-8 flex gap-3 p-4 rounded-xl bg-teal-50 border border-teal-100 text-teal-800">
          <Info className="text-teal-600 shrink-0" size={20}/>
          <div>
             <p className="font-bold text-sm">Interaction check</p>
             <p className="text-xs text-teal-700 mb-2">No major interactions found based on your current medications.</p>
             <button className="text-xs text-teal-600 font-bold hover:underline">View interaction details</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationSchedule;