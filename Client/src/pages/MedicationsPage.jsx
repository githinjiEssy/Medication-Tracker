import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AddMedicationModal from '../components/AddMedicationModal';
import EditMedicationModal from '../components/EditMedicationModal';
import AddCommentModal from '../components/AddCommentModal';
import TopBar from '../components/TopBar';
import Toast from '../components/Toast';
import { medicationService } from '../services/medicationService';
import { 
  Pill, Plus, MoreVertical, 
  RefreshCw, Calendar, ArrowLeft, Edit2, Trash2, History, CheckCircle2, Loader2,
  Clock, Info, AlertCircle, MessageSquare, Activity, ChevronDown, User, Phone, FileText,
  TrendingUp
} from 'lucide-react';

// --- STATUS BADGE COMPONENT ---
const StatusBadge = ({ status }) => {
  const statusConfig = {
    'ACTIVE': { color: 'bg-green-100 text-green-700 border-green-200', label: 'Active' },
    'DISCONTINUED': { color: 'bg-red-100 text-red-700 border-red-200', label: 'Discontinued' },
    'PAUSED': { color: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Paused' },
    'COMPLETED': { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Completed' }
  };
  
  const config = statusConfig[status] || statusConfig['ACTIVE'];
  
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${config.color}`}>
      {config.label}
    </span>
  );
};

// --- STATUS DROPDOWN COMPONENT ---
const StatusDropdown = ({ currentStatus, onStatusChange, isLoading }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const statuses = [
    { value: 'ACTIVE', label: 'Active', color: 'text-green-600 bg-green-50' },
    { value: 'PAUSED', label: 'Paused', color: 'text-amber-600 bg-amber-50' },
    { value: 'COMPLETED', label: 'Completed', color: 'text-blue-600 bg-blue-50' },
    { value: 'DISCONTINUED', label: 'Discontinued', color: 'text-red-600 bg-red-50' }
  ];
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <>
            <span>Status:</span>
            <StatusBadge status={currentStatus} />
            <ChevronDown size={16} />
          </>
        )}
      </button>
      
      {isOpen && !isLoading && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 z-20 overflow-hidden">
            {statuses.map((s) => (
              <button
                key={s.value}
                onClick={() => {
                  onStatusChange(s.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left text-sm font-bold hover:bg-slate-50 transition-colors flex items-center gap-2 ${s.value === currentStatus ? s.color : 'text-slate-700'}`}
              >
                {s.value === currentStatus && <CheckCircle2 size={14} />}
                <span className={s.value === currentStatus ? '' : 'ml-6'}>{s.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// --- ACTION MENU COMPONENT ---
const ActionMenu = ({ onEdit, onAddNote, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
      >
        <span>Actions</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 z-20 overflow-hidden">
            <button
              onClick={() => {
                onEdit();
                setIsOpen(false);
              }}
              className="w-full px-4 py-3.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
            >
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <Edit2 size={16} className="text-slate-600" />
              </div>
              <div>
                <p className="font-bold">Edit Medication</p>
                <p className="text-[10px] text-slate-400">Update details or schedule</p>
              </div>
            </button>
            
            <button
              onClick={() => {
                onAddNote();
                setIsOpen(false);
              }}
              className="w-full px-4 py-3.5 text-left text-sm font-medium text-slate-700 hover:bg-teal-50 flex items-center gap-3 transition-colors border-t border-slate-100"
            >
              <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                <MessageSquare size={16} className="text-teal-600" />
              </div>
              <div>
                <p className="font-bold text-teal-700">Add Note</p>
                <p className="text-[10px] text-slate-400">Log effectiveness or concerns</p>
              </div>
            </button>
            
            <button
              onClick={() => {
                onDelete();
                setIsOpen(false);
              }}
              className="w-full px-4 py-3.5 text-left text-sm font-medium text-slate-700 hover:bg-red-50 flex items-center gap-3 transition-colors border-t border-slate-100"
            >
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <Trash2 size={16} className="text-red-600" />
              </div>
              <div>
                <p className="font-bold text-red-600">Delete Medication</p>
                <p className="text-[10px] text-slate-400">Remove from your cabinet</p>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// --- COMMENT CARD COMPONENT ---
const CommentCard = ({ comment }) => {
  const getCommentIcon = (type) => {
    switch(type) {
      case 'SIDE_EFFECT': return <Activity size={16} className="text-rose-500" />;
      case 'EFFECTIVENESS': return <TrendingUp size={16} className="text-teal-500" />;
      case 'QUESTION': return <MessageSquare size={16} className="text-blue-500" />;
      case 'CONCERN': return <AlertCircle size={16} className="text-amber-500" />;
      default: return <MessageSquare size={16} className="text-slate-500" />;
    }
  };
  
  const getCommentTypeLabel = (type) => {
    const labels = {
      'SIDE_EFFECT': 'Side Effect',
      'EFFECTIVENESS': 'Effectiveness',
      'NOTE': 'Note',
      'QUESTION': 'Question',
      'CONCERN': 'Concern'
    };
    return labels[type] || type;
  };
  
  return (
    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {getCommentIcon(comment.comment_type)}
          <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
            {getCommentTypeLabel(comment.comment_type)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {comment.severity && (
            <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
              comment.severity > 7 ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
            }`}>
              Severity {comment.severity}/10
            </span>
          )}
          {comment.effectiveness && (
            <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
              comment.effectiveness > 7 ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'
            }`}>
              Effectiveness {comment.effectiveness}/10
            </span>
          )}
          <span className="text-[10px] text-slate-400">
            {new Date(comment.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
      <p className="text-sm text-slate-700 leading-relaxed">{comment.content}</p>
    </div>
  );
};

// --- MEDICATION CARD (List View) ---
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
          {med.dosage}
        </p>
        {med.generic_name && (
          <p className="text-xs text-slate-400 mt-1">{med.generic_name}</p>
        )}
      </div>
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-slate-500 text-sm">
          <Calendar size={16} />
          <span>
            Next: <b className="text-slate-700">
              {med.next_occurrence?.includes('T') 
              ? med.next_occurrence.split('T')[1].substring(0, 5) // Grabs "09:00" out of the ISO string
              : med.next_occurrence || 'No schedule'}
            </b>
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <RefreshCw size={16} className={med.refills_remaining === 0 ? "text-orange-500" : "text-slate-500"} />
          <span className="text-slate-500">
            Refills: <b className="text-slate-700">{med.refills_remaining}</b>
          </span>
        </div>
      </div>
    </div>
    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
      <StatusBadge status={med.status} />
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
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedMed, setSelectedMed] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [medToEdit, setMedToEdit] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('schedule');

  // --- TOAST STATE ---
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ isVisible: true, message, type });
  };

  const closeToast = () => setToast(prev => ({ ...prev, isVisible: false }));

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

  const handleStatusChange = async (newStatus) => {
    if (!selectedMed) return;
    
    try {
      setStatusUpdating(true);
      await medicationService.updateMedicationStatus(selectedMed.id, newStatus);
      
      setSelectedMed(prev => ({ ...prev, status: newStatus }));
      
      setPrescriptions(prev => 
        prev.map(med => 
          med.id === selectedMed.id 
            ? { ...med, status: newStatus }
            : med
        )
      );
      
      showToast(`Status updated to ${newStatus.toLowerCase()}`, "success");
    } catch (error) {
      showToast("Failed to update status", "error");
    } finally {
      setStatusUpdating(false);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  const handleDelete = async (id) => {
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
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (med.generic_name && med.generic_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const recentActivity = selectedMed?.intakes 
    ? [...selectedMed.intakes]
        .filter(intake => {
          const isValidStatus = intake.status === 'TAKEN' || intake.status === 'MISSED';
          const now = new Date();
          const sixDaysAgo = new Date();
          sixDaysAgo.setDate(now.getDate() - 6);
          sixDaysAgo.setHours(0, 0, 0, 0);
          const intakeDate = new Date(intake.taken_at || intake.scheduled_time);
          return isValidStatus && intakeDate >= sixDaysAgo && intakeDate <= now;
        }) 
        .sort((a, b) => new Date(b.taken_at || b.scheduled_time) - new Date(a.taken_at || a.scheduled_time))
    : [];

  return (
    <div className="flex min-h-screen bg-[#f8fafb]">
      <Toast 
        isVisible={toast.isVisible} 
        message={toast.message} 
        type={toast.type} 
        onClose={closeToast} 
      />

      <Sidebar />

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
                {/* Header Card */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl flex items-center justify-center text-white shadow-lg">
                        <Pill size={40} />
                      </div>
                      <div>
                        <h1 className="text-4xl font-black text-slate-900">{selectedMed.name}</h1>
                        {selectedMed.generic_name && (
                          <p className="text-sm text-slate-500 mt-1">{selectedMed.generic_name}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-lg font-bold text-teal-600 uppercase tracking-widest">
                            {selectedMed.dosage}
                          </span>
                          <span className="text-sm text-slate-400">
                            {selectedMed.dosage_form_display} • {selectedMed.route_display}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <StatusDropdown 
                        currentStatus={selectedMed.status} 
                        onStatusChange={handleStatusChange}
                        isLoading={statusUpdating}
                      />
                      
                      {/* Action Menu Dropdown */}
                      <ActionMenu 
                        onEdit={() => handleEditClick(selectedMed)}
                        onAddNote={() => setIsCommentModalOpen(true)}
                        onDelete={() => handleDelete(selectedMed.id)}
                      />
                    </div>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 border-b border-slate-200">
                  <button
                    onClick={() => setActiveTab('schedule')}
                    className={`px-6 py-3 font-bold text-sm transition-colors ${
                      activeTab === 'schedule' 
                        ? 'text-teal-600 border-b-2 border-teal-600' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Schedule & Activity
                  </button>
                  <button
                    onClick={() => setActiveTab('comments')}
                    className={`px-6 py-3 font-bold text-sm transition-colors flex items-center gap-2 ${
                      activeTab === 'comments' 
                        ? 'text-teal-600 border-b-2 border-teal-600' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Comments & Notes
                    {selectedMed.comments?.length > 0 && (
                      <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs">
                        {selectedMed.comments.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`px-6 py-3 font-bold text-sm transition-colors ${
                      activeTab === 'details' 
                        ? 'text-teal-600 border-b-2 border-teal-600' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Full Details
                  </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    {/* Schedule Tab */}
                    {activeTab === 'schedule' && (
                      <>
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
                            <Clock className="text-teal-600" /> Current Schedule
                          </h3>
                          <div className="grid sm:grid-cols-2 gap-4">
                            {selectedMed.specific_times?.length > 0 ? (
                              selectedMed.specific_times.map((time, idx) => (
                                <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                  <p className="text-xs font-black text-slate-400 uppercase mb-1">
                                    {selectedMed.frequency_display}
                                  </p>
                                  <p className="font-bold text-slate-800 text-lg">{time}</p>
                                </div>
                              ))
                            ) : (
                              <div className="col-span-2 p-5 bg-slate-50 rounded-2xl">
                                <p className="text-slate-600">
                                  <b>{selectedMed.frequency_display}</b>
                                </p>
                                {selectedMed.frequency_other && (
                                  <p className="text-sm text-slate-500 mt-1">{selectedMed.frequency_other}</p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
                            <History className="text-teal-600" /> Recent Activity
                          </h3>
                          <div className="space-y-4">
                            {recentActivity.length > 0 ? (
                              recentActivity.map((intake, i) => {
                                const isTaken = intake.status === 'TAKEN';
                                return (
                                  <div key={intake.id || i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl">
                                    <div className="flex items-center gap-4">
                                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                        isTaken ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                                      }`}>
                                        {isTaken ? <CheckCircle2 size={20}/> : <Clock size={20}/>}
                                      </div>
                                      <div>
                                        <p className="font-bold text-slate-800">
                                          {isTaken ? "Medication logged successfully" : "Dose Missed"}
                                        </p>
                                        <p className="text-xs text-slate-400 font-medium">
                                          {new Date(intake.taken_at || intake.scheduled_time).toLocaleString()}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {isTaken ? (
                                        <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 bg-teal-50 px-2 py-1 rounded-md border border-teal-100">
                                          {intake.dosage_taken || selectedMed.dosage}
                                        </span>
                                      ) : (
                                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                                          Skipped
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <p className="text-slate-400 text-sm italic text-center py-8">No intake logs found yet.</p>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Comments Tab */}
                    {activeTab === 'comments' && (
                      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <MessageSquare className="text-teal-600" /> All Comments & Notes
                          </h3>
                          <button
                            onClick={() => setIsCommentModalOpen(true)}
                            className="px-4 py-2 bg-teal-50 border border-teal-200 rounded-xl text-sm font-bold text-teal-700 hover:bg-teal-100 transition-all flex items-center gap-2"
                          >
                            <Plus size={16} /> Add Note
                          </button>
                        </div>
                        <div className="space-y-4">
                          {selectedMed.comments?.length > 0 ? (
                            selectedMed.comments.map((comment) => (
                              <CommentCard key={comment.id} comment={comment} />
                            ))
                          ) : (
                            <p className="text-slate-400 text-sm italic text-center py-8">
                              No comments or notes yet. Add notes about side effects or effectiveness.
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Details Tab */}
                    {activeTab === 'details' && (
                      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Prescriber</h4>
                            <p className="font-bold text-slate-800">{selectedMed.prescribed_by || 'Not specified'}</p>
                            {selectedMed.prescription_number && (
                              <p className="text-sm text-slate-500">Rx#: {selectedMed.prescription_number}</p>
                            )}
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Pharmacy</h4>
                            <p className="font-bold text-slate-800">{selectedMed.pharmacy_name || 'Not specified'}</p>
                            {selectedMed.pharmacy_phone && (
                              <p className="text-sm text-slate-500">{selectedMed.pharmacy_phone}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                          <div>
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Dates</h4>
                            <p className="text-sm text-slate-700">
                              <b>Prescribed:</b> {new Date(selectedMed.prescribed_date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-slate-700">
                              <b>Started:</b> {new Date(selectedMed.start_date).toLocaleDateString()}
                            </p>
                            {selectedMed.end_date && (
                              <p className="text-sm text-slate-700">
                                <b>Ends:</b> {new Date(selectedMed.end_date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Reason</h4>
                            <p className="text-sm text-slate-700">{selectedMed.reason || 'Not specified'}</p>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-slate-100">
                          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Info size={14}/> Instructions
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed italic">
                            "{selectedMed.instructions || 'No specific instructions provided.'}"
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Sidebar */}
                  <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                      <div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Supply Progress</h4>
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-2xl font-black text-slate-900">{selectedMed.refills_remaining}</span>
                          <span className="text-xs font-bold text-slate-400">refills remaining</span>
                        </div>
                        {selectedMed.quantity && (
                          <p className="text-sm text-slate-500 mb-3">Quantity: {selectedMed.quantity}</p>
                        )}
                      </div>
                      
                      <div className="pt-6 border-t border-slate-50">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Quick Stats</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-600">Duration</span>
                            <span className="font-bold text-slate-800">
                              {selectedMed.duration_days ? `${selectedMed.duration_days} days` : 'Ongoing'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-600">Total Intakes</span>
                            <span className="font-bold text-slate-800">{selectedMed.intakes?.length || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-600">Adherence Rate</span>
                            <span className="font-bold text-slate-800">
                              {selectedMed.intakes?.length > 0 
                                ? `${Math.round((selectedMed.intakes.filter(i => i.status === 'TAKEN').length / selectedMed.intakes.length) * 100)}%`
                                : 'N/A'
                              }
                            </span>
                          </div>
                        </div>
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
            if (selectedMed) {
              handleViewDetails(selectedMed.id);
            }
            showToast("Changes saved successfully", "success");
          }}
        />

        <AddCommentModal
          isOpen={isCommentModalOpen}
          onClose={() => setIsCommentModalOpen(false)}
          medication={selectedMed}
          onSuccess={() => {
            handleViewDetails(selectedMed.id);
            showToast("Note added successfully", "success");
          }}
        />
      </main>
    </div>
  );
};

export default MedicationsPage;