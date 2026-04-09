import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { medicationService } from '../services/medicationService';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import AddMedicationModal from '../components/AddMedicationModal';
import AddSymptomModal from '../components/AddSymptomModal';
import { 
  Plus, 
  AlertTriangle, 
  Activity, 
  Clock, 
  ChevronRight, 
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Loader2,
  Pill,
  Calendar
} from 'lucide-react';

const Dashboard = () => {
  const [isMedModalOpen, setIsMedModalOpen] = useState(false);
  const [isSymptomModalOpen, setIsSymptomModalOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Fetch dashboard data on component mount
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await medicationService.getDashboard();
      setDashboardData(response.data);
    } catch (err) {
      console.error("Error fetching dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handler for marking a dose as taken
  const handleMarkTaken = async (intakeId) => {
    try {
      await medicationService.markAsTaken(intakeId);
      // Refresh data to show updated state
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to log dose:", err);
      alert("Failed to log dose. Please try again.");
    }
  };

  // Format time for display
  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Mock User Data (Replace with actual user data from auth context/API)
  const userData = {
    first_name: 'John',
    blood_group: 'B+',
    allergies: 'Penicillin',
    emergency_contact_name: '',
    chronic_conditions: 'Hypertension',
    is_phone_verified: true
  };

  // Logic to calculate Profile Strength
  const calculateStrength = () => {
    const fields = [
      userData.blood_group !== 'UNKNOWN',
      !!userData.allergies,
      !!userData.emergency_contact_name,
      !!userData.chronic_conditions,
      userData.is_phone_verified
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  const profileStrength = calculateStrength();

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f8fafb]">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="animate-spin mx-auto mb-4 text-teal-600" size={48} />
            <p className="text-slate-600 font-bold">Loading your health data...</p>
          </div>
        </main>
      </div>
    );
  }

  // Extract data from dashboard response
  const summary = dashboardData?.summary || {};
  const upcomingIntakes = dashboardData?.upcoming_intakes || [];
  const recentComments = dashboardData?.recent_comments || [];
  const lowRefills = dashboardData?.low_refills || [];

  // Combine today's intakes from summary for display
  // Note: The backend DashboardView doesn't return the actual intake objects,
  // only counts. You might want to fetch today's intakes separately or
  // modify the backend to include them.

  return (
    <div className="flex min-h-screen bg-[#f8fafb]">
      <Sidebar />

      <main className="flex-1 p-8">
        <TopBar 
          title={`${getGreeting()}, ${userData.first_name}`} 
          description="Here's what's happening with your health today."
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <div className="grid grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Main Information (8/12 units) */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            
            {/* 1. Stats Overview Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
                    <Pill size={20} />
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase">Medications</span>
                </div>
                <p className="text-3xl font-black text-slate-900">{summary.total_medications || 0}</p>
                <p className="text-xs text-slate-500 mt-1">Active prescriptions</p>
              </div>
              
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase">Today's Doses</span>
                </div>
                <p className="text-3xl font-black text-slate-900">
                  {summary.today_intakes?.taken || 0}/{summary.today_intakes?.total || 0}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {summary.today_intakes?.completion_rate || 0}% completed
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <TrendingUp size={20} />
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase">Adherence</span>
                </div>
                <p className="text-3xl font-black text-slate-900">{summary.overall_adherence_7d || 0}%</p>
                <p className="text-xs text-slate-500 mt-1">Last 7 days</p>
              </div>
            </div>

            {/* 2. Today's Schedule Card */}
            <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Clock className="text-teal-600" size={22} /> Upcoming Doses
                </h3>
                <button 
                  onClick={() => navigate('/schedule')}
                  className="text-xs font-bold text-teal-600 hover:underline"
                >
                  View Calendar
                </button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {upcomingIntakes.length > 0 ? upcomingIntakes.slice(0, 5).map((intake) => (
                  <div key={intake.id} className="flex items-center justify-between p-5 rounded-3xl bg-slate-50 border border-slate-100 group transition-all">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white text-slate-400 border border-slate-200">
                        <Clock size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">
                          {intake.medication_name || `Medication ${intake.medication}`}
                        </p>
                        <p className="text-xs font-medium text-slate-500">
                          {formatTime(intake.scheduled_time)} • {intake.dosage_taken || 'Standard Dose'}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate('/schedule')}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-teal-600 hover:text-white transition-all"
                    >
                      Log Dose
                    </button>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <Calendar size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-400 italic">No upcoming doses scheduled</p>
                  </div>
                )}
              </div>
            </section>

            {/* 3. Low Refills Alert */}
            {lowRefills.length > 0 && (
              <section className="bg-amber-50 p-6 rounded-[2.5rem] border border-amber-200">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="text-amber-600" size={20} />
                  <h3 className="text-lg font-black text-amber-900">Low Refill Reminders</h3>
                </div>
                <div className="space-y-3">
                  {lowRefills.map((med) => (
                    <div key={med.id} className="flex items-center justify-between p-3 bg-white rounded-2xl">
                      <div>
                        <p className="font-bold text-slate-900">{med.name}</p>
                        <p className="text-xs text-slate-500">{med.refills_remaining} refills remaining</p>
                      </div>
                      <button className="text-xs font-bold text-amber-600 hover:underline">
                        Refill Now
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 4. Recent Comments/Symptoms */}
            {recentComments.length > 0 && (
              <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Activity className="text-rose-500" size={22} /> Recent Symptoms
                  </h3>
                  <button 
                    onClick={() => navigate('/adverse-reactions')}
                    className="text-xs font-bold text-teal-600 hover:underline"
                  >
                    View All
                  </button>
                </div>
                
                <div className="space-y-3">
                  {recentComments.slice(0, 3).map((comment) => (
                    <div key={comment.id} className="p-4 bg-slate-50 rounded-2xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-500">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                        {comment.severity && (
                          <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                            comment.severity > 7 ? 'bg-rose-100 text-rose-600' : 'bg-slate-200 text-slate-600'
                          }`}>
                            Level {comment.severity}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-700 line-clamp-2">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT COLUMN: Sidebar Actions (4/12 units) */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            {/* Profile Strength Widget */}
            <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Profile Strength</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medical Security</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-3xl font-black text-slate-900">{profileStrength}%</span>
                  <span className="text-xs font-bold text-teal-600 mb-1">
                    {profileStrength === 100 ? 'Complete!' : 'Almost there!'}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-teal-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${profileStrength}%` }}
                  ></div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {profileStrength < 100 
                    ? "Add your emergency contact to help first responders in case of an accident."
                    : "Your medical profile is fully optimized for safety alerts."}
                </p>

                <button 
                  onClick={() => navigate('/profile')}
                  className="w-full py-3 mt-2 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 group"
                >
                  Complete Profile <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </section>
            
            {/* Quick Actions Panel */}
            <section className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-slate-900/20">
              <h3 className="text-lg font-bold mb-6">Quick Actions</h3>
              <div className="space-y-4">
                <button 
                  onClick={() => setIsMedModalOpen(true)}
                  className="w-full py-4 bg-teal-500 hover:bg-teal-400 text-slate-900 rounded-2xl font-black flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02]"
                >
                  <Plus size={20} /> Add Prescription
                </button>
                <button 
                  onClick={() => setIsSymptomModalOpen(true)}
                  className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all"
                >
                  <AlertTriangle size={20} className="text-rose-400" /> Log Reaction
                </button>
              </div>
            </section>

            {/* Adherence Insight Card */}
            <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <TrendingUp size={20} />
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Weekly Insight</p>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {summary.overall_adherence_7d >= 80 ? (
                  <>Your adherence is at <span className="text-teal-600 font-bold">{summary.overall_adherence_7d}%</span>. Excellent consistency this week!</>
                ) : summary.overall_adherence_7d >= 50 ? (
                  <>Your adherence is at <span className="text-amber-600 font-bold">{summary.overall_adherence_7d}%</span>. Try to stay on track with your schedule.</>
                ) : (
                  <>Your adherence is at <span className="text-rose-600 font-bold">{summary.overall_adherence_7d}%</span>. Consider setting reminders to help stay on schedule.</>
                )}
              </p>
              <button 
                onClick={() => navigate("/analytics")}
                className="mt-6 w-full py-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-500 hover:text-teal-600 transition-colors flex items-center justify-center gap-2"
              >
                Full Report <ChevronRight size={14} />
              </button>
            </section>
          </div>
        </div>

        {/* Modals */}
        <AddMedicationModal 
          isOpen={isMedModalOpen} 
          onClose={() => setIsMedModalOpen(false)} 
          onSuccess={fetchDashboardData}
        />
        <AddSymptomModal 
          isOpen={isSymptomModalOpen} 
          onClose={() => setIsSymptomModalOpen(false)} 
          onRefresh={fetchDashboardData}
        />
      </main>
    </div>
  );
};

export default Dashboard;