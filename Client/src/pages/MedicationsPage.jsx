import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AddMedicationModal from '../components/AddMedicationModal';
import TopBar from '../components/TopBar';
import { 
  Pill, Plus, MoreVertical, AlertCircle, 
  RefreshCw, Calendar, ArrowLeft, Edit2, Trash2, History, CheckCircle2
} from 'lucide-react';

// --- SUB-COMPONENT: MEDICATION CARD ---
// Defined here to keep the main component clean and readable
const MedicationCard = ({ med, onViewDetails }) => (
  <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
    <div>
      <div className="flex justify-between items-start mb-6">
        <div className={`w-12 h-12 ${med.color} rounded-2xl flex items-center justify-center text-white shadow-inner`}>
          <Pill size={24} />
        </div>
        <button className="text-slate-300 hover:text-slate-600 transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-black text-slate-900">{med.name}</h3>
        <p className="text-sm font-bold text-teal-600 uppercase tracking-wider">
          {med.dose} • {med.frequency}
        </p>
      </div>
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-slate-500 text-sm">
          <Calendar size={16} />
          <span>Last taken: <b className="text-slate-700">{med.lastTaken}</b></span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <RefreshCw size={16} className={med.refills === 0 ? "text-orange-500" : "text-slate-500"} />
          <span className="text-slate-500">
            Refills: <b className={med.refills === 0 ? "text-orange-600" : "text-slate-700"}>{med.refills}</b>
          </span>
        </div>
      </div>
    </div>
    
    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
        med.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
      }`}>
        {med.status}
      </span>
      <button 
        onClick={() => onViewDetails(med)} 
        className="text-xs font-bold text-slate-400 hover:text-teal-600 transition-colors"
      >
        View Details
      </button>
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---
const MedicationsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMed, setSelectedMed] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const prescriptions = [
    { 
      id: 1, 
      name: "Lisinopril", 
      dose: "10 mg", 
      frequency: "Once daily", 
      refills: 2, 
      status: "Active",
      lastTaken: "Today, 08:00 AM",
      color: "bg-teal-500",
      instructions: "Take on an empty stomach at least 30 minutes before breakfast."
    },
    { 
      id: 2, 
      name: "Metformin", 
      dose: "500 mg", 
      frequency: "Twice daily", 
      refills: 5, 
      status: "Active",
      lastTaken: "Yesterday, 08:30 PM",
      color: "bg-blue-500",
      instructions: "Take with a full meal to reduce stomach upset."
    },
    { 
      id: 3, 
      name: "Warfarin", 
      dose: "3 mg", 
      frequency: "Once daily", 
      refills: 0, 
      status: "Refill Needed",
      lastTaken: "Today, 09:15 AM",
      color: "bg-orange-500",
      instructions: "Avoid significant changes in intake of foods high in Vitamin K."
    }
  ];

  // Logic to filter meds based on TopBar input
  const filteredMeds = prescriptions.filter(med => 
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafb]">
      <Sidebar />

      <main className="flex-1 p-8">
        <TopBar
          title={!selectedMed ? "Prescribed Medications" : "Medication Details"}
          description={!selectedMed ? "Manage your active prescriptions and refill history" : ""}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showSearch={!selectedMed} // Hide search bar when viewing details
        />
        
        {!selectedMed ? (
          /* GRID VIEW */
          <div className="animate-in fade-in duration-500">
            <header className="flex justify-between items-center mb-10">
              <h2 className="text-xl font-bold text-slate-800">Your Cabinet</h2>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-teal-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20"
              >
                <Plus size={20} />
                Add New Prescription
              </button>
            </header>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredMeds.map((med) => (
                <MedicationCard 
                  key={med.id} 
                  med={med} 
                  onViewDetails={setSelectedMed} 
                />
              ))}
              
              {/* Interaction Warning Card */}
              <div className="bg-orange-50 rounded-3xl p-6 border border-orange-100 flex flex-col justify-center items-center text-center">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle size={24} />
                </div>
                <h4 className="font-bold text-orange-900 mb-2">Safety Alert</h4>
                <p className="text-xs text-orange-700 mb-6 px-4 leading-relaxed">
                  Possible interaction detected between current meds.
                </p>
                <button 
                  onClick={() => navigate('/adverse-reactions')}
                  className="text-xs font-black text-orange-600 uppercase tracking-widest hover:scale-105 transition-transform"
                >
                  Review Now
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* DETAILED VIEW */
          <div className="animate-in slide-in-from-right-10 fade-in duration-500 space-y-8">
            <button 
              onClick={() => setSelectedMed(null)}
              className="flex items-center gap-2 text-slate-500 hover:text-teal-600 font-bold transition-colors group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
              Back to Cabinet
            </button>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-6">
                <div className={`w-20 h-20 ${selectedMed.color} rounded-3xl flex items-center justify-center text-white shadow-lg`}>
                  <Pill size={40} />
                </div>
                <div>
                  <h1 className="text-4xl font-black text-slate-900">{selectedMed.name}</h1>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-lg font-bold text-teal-600 uppercase tracking-widest">{selectedMed.dose}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                    <span className="text-slate-500 font-medium">{selectedMed.frequency}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm">
                  <Edit2 size={18}/> Edit
                </button>
                <button className="p-3 bg-red-50 text-red-500 rounded-2xl border border-red-100 hover:bg-red-100 transition-all">
                  <Trash2 size={20}/>
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
                    <History className="text-teal-600" /> Intake History
                  </h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <CheckCircle2 size={20}/>
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">Dose Logged</p>
                            <p className="text-xs text-slate-400">March {13-i}, 2026 • 08:12 AM</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Verified</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Refill Progress</h4>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-2xl font-black text-slate-900">{selectedMed.refills}</span>
                      <span className="text-xs font-bold text-slate-400">of 6 refills</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${selectedMed.color} rounded-full`} 
                        style={{ width: `${(selectedMed.refills / 6) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-50">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Instructions</h4>
                    <p className="text-sm text-slate-600 leading-relaxed italic">"{selectedMed.instructions}"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <AddMedicationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </main>
    </div>
  );
};

export default MedicationsPage;