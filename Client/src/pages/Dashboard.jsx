import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import AddMedicationModal from '../components/AddMedicationModal';
import { 
  Plus, 
  AlertTriangle, 
  Activity, 
  Clock, 
  ChevronRight, 
  CheckCircle2,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

const Dashboard = () => {
  const [isMedModalOpen, setIsMedModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Mock data for today's tasks
  const dailySchedule = [
    { id: 1, name: 'Lisinopril', time: '08:00 AM', taken: true, dose: '10mg' },
    { id: 2, name: 'Metformin', time: '12:00 PM', taken: false, dose: '500mg' },
    { id: 3, name: 'Metformin', time: '08:00 PM', taken: false, dose: '500mg' },
  ];

  // Mock User Data
  const userData = {
    blood_group: 'B+',
    allergies: 'Penicillin',
    emergency_contact_name: '', // Empty to test logic
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

  return (
    <div className="flex min-h-screen bg-[#f8fafb]">
      <Sidebar />

      <main className="flex-1 p-8">
        <TopBar 
          title="Good Morning, John" 
          description="Here is what's happening with your health today."
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <div className="grid grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Main Information (8/12 units) */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            
            {/* 1. Today's Schedule Card */}
            <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Clock className="text-teal-600" size={22} /> Today's Schedule
                </h3>
                <button 
                  onClick={() => navigate('/schedule')}
                  className="text-xs font-bold text-teal-600 hover:underline"
                >
                  View Calendar
                </button>
              </div>

              <div className="space-y-4">
                {dailySchedule.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-5 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-teal-500/30 transition-all">
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.taken ? 'bg-teal-100 text-teal-600' : 'bg-white text-slate-400 border border-slate-200'}`}>
                        {item.taken ? <CheckCircle2 size={24} /> : <div className="w-6 h-6 rounded-full border-2 border-slate-200" />}
                      </div>
                      <div>
                        <p className={`font-bold ${item.taken ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{item.name}</p>
                        <p className="text-xs font-medium text-slate-500">{item.time} • {item.dose}</p>
                      </div>
                    </div>
                    {!item.taken && (
                      <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-all">
                        Log Dose
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* 2. Analysis Preview (30d) */}
            <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Activity className="text-rose-500" size={22} /> Adverse Reactions
                </h3>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last 30 Days</span>
              </div>
              
              {/* Simplified Sparkline / Placeholder for Chart */}
              <div className="h-40 w-full bg-slate-50 rounded-3xl flex items-center justify-center border border-dashed border-slate-200">
                <p className="text-slate-400 font-bold text-sm italic">Symptom Trend Chart will render here</p>
              </div>
            </section>
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
                  <span className="text-xs font-bold text-teal-600 mb-1">Almost there!</span>
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

                <button className="w-full py-3 mt-2 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 group">
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
                  className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all"
                >
                  <AlertTriangle size={20} className="text-rose-400" /> Log Reaction
                </button>
              </div>
            </section>

            {/* Insight Card */}
            <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <TrendingUp size={20} />
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Weekly Insight</p>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                "Your adherence has improved by <span className="text-teal-600 font-bold">12%</span> this week. Keeping up this consistency helps stabilize your blood pressure."
              </p>
              <button className="mt-6 w-full py-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-500 hover:text-teal-600 transition-colors flex items-center justify-center gap-2">
                Full Report <ChevronRight size={14} />
              </button>
            </section>

          </div>
        </div>

        {/* Modals */}
        <AddMedicationModal 
          isOpen={isMedModalOpen} 
          onClose={() => setIsMedModalOpen(false)} 
        />
      </main>
    </div>
  );
};

export default Dashboard;