import React from 'react';
import Sidebar from '../components/Sidebar';
import MedicationSchedule from '../components/MedicationSchedule';
import HealthWidgets from '../components/HealthWidget';
import { Search, Bell, Settings } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-[#f8fafb]">
      {/* Sidebar - Fixed width component */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        
        {/* Top Navigation Bar */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 w-96">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search medications or records..." 
              className="bg-transparent outline-none text-sm w-full font-medium"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-teal-600 transition-colors relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-900">Alex Johnson</p>
                <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Adherence: 92%</p>
              </div>
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold border-2 border-white shadow-sm">
                AJ
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Scrollable Area */}
        <main className="p-8">
          {/* Welcome Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">Todays Medications</h1>
            <p className="text-slate-500 font-medium">Auto-generated schedule based on your prescriptions</p>
          </div>

          {/* Main Dashboard Grid Section */}
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
            
            {/* Left Column: Schedule and Forms */}
            <div className="space-y-8">
              <MedicationSchedule />
            </div>

            {/* Right Column: Analytics and Logs */}
            <div className="space-y-8">
              <HealthWidgets />
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;