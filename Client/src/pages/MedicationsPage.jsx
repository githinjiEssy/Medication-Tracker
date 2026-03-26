import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AddMedicationModal from '../components/AddMedicationModal';
import EditMedicationModal from '../components/EditMedicationModal';
import TopBar from '../components/TopBar';
import Toast from '../components/Toast'; // Import the Toast component
import { medicationService } from '../services/medicationService';
import { 
  Pill, Plus, MoreVertical, 
  RefreshCw, Calendar, ArrowLeft, Edit2, Trash2, History, CheckCircle2, Loader2,
  Clock, Info
} from 'lucide-react';

// --- SUB-COMPONENT: MEDICATION CARD ---
const MedicationCard = ({ med, onViewDetails, onDelete }) => (
  <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
    <div>
      <div className="flex justify-between items-start mb-6">
        <div className={`w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center text-white shadow-inner`}>
          <Pill size={24} />
        </div>
        <div className="flex gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(med.id); }}
            className="text-slate-300 hover:text-red-500 transition-colors"
          >
            <Trash2 size={20} />
          </button>
          <button className="text-slate-300 hover:text-slate-600 transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-black text-slate-900">{med.name}</h3>
        <p className="text-sm font-bold text-teal-600 uppercase tracking-wider">
          {med.dosage_strength} {med.dosage_unit}
        </p>
      </div>
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-slate-500 text-sm">
          <Calendar size={16} />
          <span>Next: <b className="text-slate-700">{med.next_occurrence || 'No schedule'}</b></span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <RefreshCw size={16} className={med.refills_remaining === 0 ? "text-orange-500" : "text-slate-500"} />
          <span className="text-slate-500">
            Remaining: <b className="text-slate-700">{med.refills_remaining}</b>
          </span>
        </div>
      </div>
    </div>
    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
        med.is_active ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'
      }`}>
        {med.is_active ? 'Active' : 'Inactive'}
      </span>
      <button 
        onClick={() => onViewDetails(med.id)} 
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
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [medToEdit, setMedToEdit] = useState(null);

  // --- TOAST STATE ---
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ isVisible: true, message, type });
  };

  const closeToast = () => setToast(prev => ({ ...prev, isVisible: false }));

  // Auto-hide toast
  useEffect(() => {
    if (toast.isVisible) {
      const timer = setTimeout(closeToast, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.isVisible]);

  const fetchMedications = async () => {
    try {
      setIsLoading(true);
      const response = await medicationService.getMedications();
      setPrescriptions(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching meds:", error);
      showToast("Could not load medications", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      setIsDetailLoading(true);
      const response = await medicationService.getMedicationDetails(id);
      setSelectedMed(response.data);
    } catch (error) {
      showToast("Error loading details", "error");
    } finally {
      setIsDetailLoading(false);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  const handleDelete = async (id) => {
    // Keep native confirm for safety, but use toast for results
    if (window.confirm("Are you sure you want to delete this medication?")) {
      try {
        await medicationService.deleteMedication(id);
        setPrescriptions(prev => prev.filter(m => m.id !== id));
        setSelectedMed(null);
        showToast("Medication deleted successfully", "success");
      } catch (err) { 
        showToast("Delete failed. Please try again.", "error"); 
      }
    }
  };

  const handleEditClick = (med) => {
    setMedToEdit(med);
    setIsEditModalOpen(true);
  };

  const filteredMeds = prescriptions.filter(med => 
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafb]">
      {/* Toast notification */}
      <Toast 
        isVisible={toast.isVisible} 
        message={toast.message} 
        type={toast.type} 
        onClose={closeToast} 
      />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8">
        <TopBar 
          title={!selectedMed ? "Prescribed Medications" : "Medication Details"}
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          showSearch={!selectedMed} 
        />
        
        {!selectedMed ? (
          <div className="animate-in fade-in duration-500">
            <header className="flex justify-between items-center mb-10">
              <h2 className="text-xl font-bold text-slate-800">Your Cabinet</h2>
              <button onClick={() => setIsModalOpen(true)} className="bg-teal-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20">
                <Plus size={20} /> Add New Prescription
              </button>
            </header>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <Loader2 className="animate-spin mb-4" size={40} />
                <p>Loading your cabinet...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMeds.length > 0 ? (
                  filteredMeds.map(med => (
                    <MedicationCard key={med.id} med={med} onViewDetails={handleViewDetails} onDelete={handleDelete} />
                  ))
                ) : (
                   <div className="col-span-full py-20 text-center text-slate-400 font-medium">
                     No medications found in your cabinet.
                   </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="animate-in slide-in-from-right-10 fade-in duration-500 space-y-8">
            <button onClick={() => setSelectedMed(null)} className="flex items-center gap-2 text-slate-500 hover:text-teal-600 font-bold transition-colors group">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Cabinet
            </button>

            {isDetailLoading ? (
              <div className="flex justify-center p-20"><Loader2 className="animate-spin text-teal-600" size={48} /></div>
            ) : (
              <>
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-teal-500 rounded-3xl flex items-center justify-center text-white shadow-lg">
                      <Pill size={40} />
                    </div>
                    <div>
                      <h1 className="text-4xl font-black text-slate-900">{selectedMed.name}</h1>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-lg font-bold text-teal-600 uppercase tracking-widest">
                          {selectedMed.dosage_strength} {selectedMed.dosage_unit}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${selectedMed.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {selectedMed.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEditClick(selectedMed)} 
                    className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50">
                      <Edit2 size={18}/> Edit
                    </button>
                    <button onClick={() => handleDelete(selectedMed.id)} className="p-3 bg-red-50 text-red-500 rounded-2xl border border-red-100 hover:bg-red-100">
                      <Trash2 size={20}/>
                    </button>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
                        <Clock className="text-teal-600" /> Current Schedule
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {selectedMed.specific_times?.length > 0 ? (
                          selectedMed.specific_times.map((time, idx) => (
                            <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                              <p className="text-xs font-black text-slate-400 uppercase mb-1">
                                {selectedMed.frequency}
                              </p>
                              <p className="font-bold text-slate-800 text-lg">{time}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-400 text-sm italic">No specific times set for this medication.</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
                        <History className="text-teal-600" /> Recent Activity
                      </h3>
                      <div className="space-y-4">
                        {selectedMed.recent_intakes?.length > 0 ? (
                          selectedMed.recent_intakes.map((intake, i) => (
                            <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                  <CheckCircle2 size={20}/>
                                </div>
                                <div>
                                  <p className="font-bold text-slate-800">Dose Taken</p>
                                  <p className="text-xs text-slate-400">{new Date(intake.taken_at).toLocaleString()}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-400 text-sm italic">No intake logs found yet.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                      <div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Supply Progress</h4>
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-2xl font-black text-slate-900">{selectedMed.refills_remaining}</span>
                          <span className="text-xs font-bold text-slate-400">Total: {selectedMed.refills_count}</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-teal-500 rounded-full" 
                            style={{ width: `${(selectedMed.refills_remaining / (selectedMed.refills_count || 1)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="pt-6 border-t border-slate-50">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <Info size={14}/> Instructions
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed italic">
                          "{selectedMed.instructions || 'No specific instructions provided.'}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <AddMedicationModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            fetchMedications();
            showToast("Prescription added to cabinet", "success");
          }} 
        />
        
        <EditMedicationModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          medication={medToEdit}
          onSuccess={() => {
            fetchMedications();
            handleViewDetails(selectedMed.id);
            showToast("Changes saved successfully", "success");
          }}
        />
      </main>
    </div>
  );
};

export default MedicationsPage;