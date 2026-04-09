import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { 
  Activity, Thermometer, MessageSquare, Info, 
  ArrowLeft, Pill, ChevronRight, Loader2 
} from 'lucide-react';
import AddSymptomModal from '../components/AddSymptomModal';
import TopBar from '../components/TopBar';
import { commentService } from '../services/commentService';

const AdverseReactions = () => {
  const [isSymptomModalOpen, setSymptomModalOpen] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [symptomLogs, setSymptomLogs] = useState([]); 
  const [loadingSymptoms, setLoadingSymptoms] = useState(false);

  const fetchSymptoms = async () => {
    try {
      setLoadingSymptoms(true);
      const response = await commentService.getAllComments();
      const data = Array.isArray(response.data) ? response.data : response.data.results || [];
      
      // Filter array to only include SIDE_EFFECTS from backend
      const sideEffects = data.filter(c => c.comment_type === 'SIDE_EFFECT');
      setSymptomLogs(sideEffects);
    } catch (error) {
      console.error('Error fetching symptoms:', error);
    } finally {
      setLoadingSymptoms(false);
    }
  }

  useEffect(() => {
    fetchSymptoms();
  }, []);

  // Helper to format the backend "created_at" string
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return {
      date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  // --- SUB-COMPONENT: SYMPTOM DETAILS VIEW ---
  const SymptomDetails = ({ symptom }) => {
    const { date, time } = formatDateTime(symptom.created_at);
    // Splitting the content if it follows "Symptom: Details" format
    const [title, ...detailsArray] = symptom.content.split(':');
    const details = detailsArray.join(':').trim();

    return (
      <div className="animate-in slide-in-from-right-8 duration-500 space-y-8 max-w-5xl mx-auto">
        <button 
          onClick={() => setSelectedSymptom(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-rose-500 font-bold transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Journal
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center">
                    <Activity size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900">{title}</h2>
                    <p className="text-slate-500 font-medium">{date} at {time}</p>
                  </div>
                </div>
                <span className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl font-bold text-sm">
                  Severity Level {symptom.severity}
                </span>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                  <MessageSquare size={18} className="text-teal-600" /> Patient Notes
                </h4>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100 italic">
                  "{details || "No additional notes provided."}"
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Related Medication</h3>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-teal-600 shadow-sm">
                    <Pill size={20} />
                  </div>
                  <span className="font-bold text-slate-800">
                    {/* Accessing medication name from the nested object if available */}
                    {symptom.medication_name || "Medication ID: " + symptom.medication}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-600/20">
              <Info size={24} className="mb-4 text-blue-200" />
              <h4 className="font-bold text-xl mb-2">Health Tip</h4>
              <p className="text-blue-100 text-sm leading-relaxed">
                Persistent side effects should always be discussed with your healthcare provider. 
                Keep tracking your symptoms to help your doctor adjust your treatment plan.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafb]">
      <Sidebar />
      <main className="flex-1 p-8">
        <TopBar />
        
        {!selectedSymptom ? (
          <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
            <header className="mb-10 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-950">Symptom Journal</h1>
                <p className="text-slate-500 font-medium">History of your medication side effects.</p>
              </div>
              <button 
                onClick={() => setSymptomModalOpen(true)}
                className="px-6 py-3 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 transition-all flex items-center gap-2 shadow-lg shadow-teal-600/20">
                <MessageSquare size={18} /> Log New Symptom
              </button>
            </header>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[400px]">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
                <Activity className="text-teal-600" /> Recent Entries
              </h3>
              
              {loadingSymptoms ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <Loader2 className="animate-spin mb-2" size={32} />
                  <p>Loading your journal...</p>
                </div>
              ) : symptomLogs.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-[2rem]">
                   <Thermometer size={48} className="mx-auto text-slate-200 mb-4" />
                   <p className="text-slate-400 font-medium">No symptoms logged yet.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {symptomLogs.map((log) => {
                    const { date, time } = formatDateTime(log.created_at);
                    return (
                      <div 
                        key={log.id} 
                        onClick={() => setSelectedSymptom(log)}
                        className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 hover:bg-white hover:border-teal-500 hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-teal-600 group-hover:bg-teal-50 transition-colors">
                          <Thermometer size={24} />
                        </div>
                        <div className="flex-1">
                          {/* Backend 'content' split to show title */}
                          <p className="text-base font-bold text-slate-800">{log.content.split(':')[0]}</p>
                          <p className="text-xs text-slate-400">{date} • {time}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${log.severity > 7 ? 'bg-rose-100 text-rose-600' : 'bg-slate-200 text-slate-600'}`}>
                            Level {log.severity}
                          </span>
                        </div>
                        <ChevronRight size={20} className="text-slate-300 group-hover:text-teal-600 ml-2" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-3xl flex gap-4 items-center">
              <Info className="text-blue-600 shrink-0" size={20} />
              <p className="text-[11px] text-blue-800 leading-tight">
                <b>Medical Disclaimer:</b> This journal is for tracking purposes. If you experience severe reactions like difficulty breathing or chest pain, seek emergency medical care immediately.
              </p>
            </div>
          </div>
        ) : (
          <SymptomDetails symptom={selectedSymptom} />
        )}

        <AddSymptomModal 
          isOpen={isSymptomModalOpen} 
          onClose={() => setSymptomModalOpen(false)} 
          onRefresh={fetchSymptoms}
        />
      </main>
    </div>
  );
};

export default AdverseReactions;