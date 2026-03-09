import React, { useState } from 'react';
import { AlertTriangle, Clock, Activity, BarChart3 } from 'lucide-react';

const adherenceData = [
  { week: "Week 1", percent: 85 },
  { week: "Week 2", percent: 90 },
  { week: "Week 3", percent: 94 },
  { week: "Week 4", percent: 97 },
];

const HealthWidgets = () => {
  const [severity, setSeverity] = useState(5);

  return (
    <div className="space-y-8">
      {/* 3. Adverse Reaction Log */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6 border-b border-slate-50 pb-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <AlertTriangle className="text-orange-500" size={18} />
            Log an adverse reaction
          </h3>
          <div className="flex gap-2">
            <button className="bg-teal-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-teal-700">Save reaction</button>
            <button className="text-slate-400 font-medium text-sm hover:text-slate-600">Cancel</button>
          </div>
        </div>

        <form className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-5 items-end">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5 pl-1">Symptom</label>
              <input type="text" placeholder="e.g., headache, nausea" className="w-full py-3 px-4 border border-slate-200 rounded-xl bg-slate-50/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5 pl-1">Severity (1-10)</label>
              <input 
                type="number" 
                min="1" max="10" 
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-20 py-3 px-4 border border-slate-200 rounded-xl bg-white font-bold text-slate-900 text-center" 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5 pl-1">When did it start?</label>
            <input type="datetime-local" className="w-full py-3 px-4 border border-slate-200 rounded-xl bg-slate-50/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5 pl-1">Notes</label>
            <textarea placeholder="Add additional details..." className="w-full h-24 py-3 px-4 border border-slate-200 rounded-xl bg-slate-50/50 resize-none" />
          </div>
        </form>
      </div>

      {/* 4. 30-day Adherence Statistics */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="text-teal-500" size={18} />
            30-day adherence
          </h3>
          <button className="text-teal-600 text-xs font-bold hover:underline">View history</button>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center mb-8">
          {[
            { label: "On-time", value: "92%" },
            { label: "Late doses", value: "6%" },
            { label: "Missed", value: "2%" },
          ].map((stat, i) => (
            <div key={i} className={`p-4 rounded-xl border ${stat.label === 'Missed' ? 'border-red-100 bg-red-50' : 'border-slate-50 bg-slate-50'}`}>
              <p className={`text-2xl font-black ${stat.label === 'Missed' ? 'text-red-600' : 'text-slate-950'}`}>{stat.value}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {adherenceData.map((week, i) => (
            <div key={i} className="flex items-center gap-4 text-sm">
              <span className="font-bold text-slate-800 w-16">{week.week}</span>
              <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-teal-600 rounded-full transition-all duration-1000" 
                  style={{ width: `${week.percent}%` }}
                />
              </div>
              <span className="font-mono font-medium text-slate-500 text-right w-12">{week.percent}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthWidgets;