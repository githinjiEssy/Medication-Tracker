import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { 
  AlertTriangle, Activity, Thermometer, MessageSquare, Info, 
  ArrowLeft, Clock, Calendar, Pill, ChevronRight 
} from 'lucide-react';
import AddSymptomModal from '../components/AddSymptomModal';

const AdverseReactions = () => {
  const [isSymptomModalOpen, setSymptomModalOpen] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState(null);

  const activeRisks = [
    { id: 1, type: 'Interaction', severity: 'High', desc: 'Warfarin + Aspirin', note: 'Increases bleeding risk significantly.' },
    { id: 2, type: 'Side Effect', severity: 'Moderate', desc: 'Lisinopril', note: 'Reported: Dry cough (Logged 3x this week).' }
  ];

  const symptomLogs = [
    { 
      id: 1, 
      name: "Fatigue / Drowsiness", 
      time: "2:00 PM", 
      date: "Today", 
      severity: "Moderate",
      details: "Feeling extremely drained shortly after afternoon dose. Lasted about 3 hours.",
      relatedMeds: ["Metformin", "Lisinopril"]
    },
    { 
      id: 2, 
      name: "Dry Cough", 
      time: "09:30 AM", 
      date: "Yesterday", 
      severity: "Mild",
      details: "Persistent tickle in the throat. Started about 1 week after beginning Lisinopril.",
      relatedMeds: ["Lisinopril"]
    }
  ];

  // --- SUB-COMPONENT: SYMPTOM DETAILS VIEW ---
  const SymptomDetails = ({ symptom }) => (
    <div className="animate-in slide-in-from-right-8 duration-500 space-y-8">
      <button 
        onClick={() => setSelectedSymptom(null)}
        className="flex items-center gap-2 text-slate-500 hover:text-rose-500 font-bold transition-colors group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Overview
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center">
                  <Activity size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900">{symptom.name}</h2>
                  <p className="text-slate-500 font-medium">{symptom.date} at {symptom.time}</p>
                </div>
              </div>
              <span className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl font-bold text-sm">
                {symptom.severity} Severity
              </span>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <MessageSquare size={18} className="text-teal-600" /> Patient Notes
              </h4>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100 italic">
                "{symptom.details}"
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Potential Culprits</h3>
            <div className="grid gap-4">
              {symptom.relatedMeds.map(med => (
                <div key={med} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-teal-500 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-teal-600 shadow-sm">
                      <Pill size={20} />
                    </div>
                    <span className="font-bold text-slate-800">{med}</span>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-teal-600" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-600/20">
            <Info size={24} className="mb-4 text-blue-200" />
            <h4 className="font-bold text-xl mb-2">Doctor's Tip</h4>
            <p className="text-blue-100 text-sm leading-relaxed">
              If {symptom.name.toLowerCase()} persists for more than 48 hours, schedule a telehealth follow-up to discuss alternative dosages.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafb]">
      <Sidebar />
      <main className="flex-1 p-8">
        
        {!selectedSymptom ? (
          <div className="animate-in fade-in duration-500">
            <header className="mb-10">
              <h1 className="text-3xl font-extrabold text-slate-950">Adverse Reactions</h1>
              <p className="text-slate-500 font-medium">Track symptoms and monitor potential medication conflicts.</p>
            </header>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Interaction Intelligence */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="text-orange-500" /> Active Safety Alerts
                </h3>
                {activeRisks.map(risk => (
                  <div key={risk.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-orange-200 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        risk.severity === 'High' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {risk.severity} Risk
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900">{risk.desc}</h4>
                    <p className="text-sm text-slate-500 mt-1">{risk.note}</p>
                  </div>
                ))}
              </div>

              {/* Symptom Journal */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
                  <Activity className="text-teal-600" /> Symptom Journal
                </h3>
                <div className="space-y-4 mb-8 flex-1">
                  {symptomLogs.map((log) => (
                    <div 
                      key={log.id} 
                      onClick={() => setSelectedSymptom(log)}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 hover:bg-white hover:border-teal-500 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-teal-600 group-hover:bg-teal-50 transition-colors">
                        <Thermometer size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-800">{log.name}</p>
                        <p className="text-[10px] text-slate-400">{log.date} • {log.time}</p>
                      </div>
                      <span className="text-xs font-black text-slate-400 uppercase group-hover:text-teal-600 transition-colors">{log.severity}</span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setSymptomModalOpen(true)}
                  className="w-full py-4 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-600/20">
                  <MessageSquare size={18} /> Record New Side Effect
                </button>
              </div>
            </div>

            {/* Informational Footer */}
            <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-3xl flex gap-4 items-center">
              <Info className="text-blue-600 shrink-0" size={20} />
              <p className="text-[11px] text-blue-800 leading-tight">
                <b>Emergency:</b> If you experience difficulty breathing, swelling of the face, or chest pain, stop use and seek immediate medical attention.
              </p>
            </div>
          </div>
        ) : (
          <SymptomDetails symptom={selectedSymptom} />
        )}

        <AddSymptomModal isOpen={isSymptomModalOpen} onClose={() => setSymptomModalOpen(false)} />
      </main>
    </div>
  );
};

export default AdverseReactions;