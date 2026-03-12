import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Download, 
  Share2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight 
} from 'lucide-react';
import { generateHealthReport } from '../utils/pdfGenerator';

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('Last 30 Days');

  const stats = [
    { label: "Overall Adherence", value: "94%", change: "+2.4%", icon: <CheckCircle2 className="text-teal-600" />, color: "bg-teal-50" },
    { label: "Doses Logged", value: "128", change: "This Month", icon: <TrendingUp className="text-blue-600" />, color: "bg-blue-50" },
    { label: "Side Effects", value: "3", change: "-12%", icon: <AlertCircle className="text-rose-600" />, color: "bg-rose-50" },
  ];

  //mock data for PDF generation
  const userData = { name: "John Doe" };
  const prescriptions = [
    { name: "Lisinopril", dose: "10mg", frequency: "Once Daily", status: "Active" },
    { name: "Metformin", dose: "500mg", frequency: "Twice Daily", status: "Active" },
    { name: "Warfarin", dose: "5mg", frequency: "Once Daily", status: "Active" },
  ]; 
  const symptoms = [
    { date: "2024-06-01", name: "Dizziness", severity: "Moderate", details: "Felt lightheaded for about an hour after taking morning dose." },
    { date: "2024-06-10", name: "Dry Cough", severity: "Mild", details: "Persistent tickle in the throat, especially at night." },
    { date: "2024-06-15", name: "Fatigue", severity: "Severe", details: "Overwhelming tiredness that lasted most of the day." },
  ];

  // Placeholder function for PDF export
  const handleExportPDF = () => {
    generateHealthReport(userData, prescriptions, symptoms);
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafb]">
      <Sidebar />

      <main className="flex-1 p-8">
        <TopBar />

        {/* Header with Export Options */}
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">Health Analytics</h1>
            <p className="text-slate-500 font-medium">Insights and adherence patterns for your treatment.</p>
          </div>
          <div className="flex gap-3">
            <button
            onClick={handleExportPDF} 
            className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
              <Download size={18} className="text-teal-600" />
              Export PDF
            </button>
            <button className="flex items-center gap-2 px-5 py-3 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-600/20 transition-all">
              <Share2 size={18} />
              Share with Doctor
            </button>
          </div>
        </header>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center`}>
                  {stat.icon}
                </div>
                <span className="flex items-center gap-1 text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                  <ArrowUpRight size={12} /> {stat.change}
                </span>
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Adherence Trend (Mock Chart) */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 size={20} className="text-teal-600" /> Adherence Trend
              </h3>
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="text-xs font-bold text-slate-500 bg-slate-50 border-none rounded-xl px-3 py-2 outline-none cursor-pointer"
              >
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>
            
            {/* Visual Bar Mockup */}
            <div className="flex items-end justify-between h-48 gap-2">
              {[60, 80, 45, 90, 100, 85, 95].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div 
                    className={`w-full rounded-t-xl transition-all duration-500 ${height === 100 ? 'bg-teal-500' : 'bg-teal-200 group-hover:bg-teal-300'}`} 
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-[10px] font-bold text-slate-400">Day {i+1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Symptom Severity Correlation */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-8">
              <TrendingUp size={20} className="text-rose-500" /> Symptom Correlation
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold text-slate-700">Morning Dizziness</span>
                    <span className="text-xs font-bold text-rose-500">Frequent</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-[70%] h-full bg-rose-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold text-slate-700">Evening Fatigue</span>
                    <span className="text-xs font-bold text-orange-500">Occasional</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-[30%] h-full bg-orange-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 p-5 bg-blue-50 rounded-3xl border border-blue-100">
              <p className="text-xs text-blue-800 leading-relaxed font-medium">
                <span className="font-bold">Insight:</span> Your adherence is highest in the morning (98%). Consider moving your evening dose earlier to avoid fatigue spikes.
              </p>
            </div>
          </div>
        </div>

        {/* Refill Pipeline */}
        <div className="mt-8 bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-slate-900/20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Calendar className="text-teal-400" /> Inventory Forecast
            </h3>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">3 Prescriptions Remaining</span>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {['Lisinopril', 'Metformin', 'Warfarin'].map((med, i) => (
              <div key={med} className="space-y-3">
                <div className="flex justify-between text-sm font-bold">
                  <span>{med}</span>
                  <span className={i === 2 ? "text-orange-400" : "text-teal-400"}>
                    {i === 2 ? '4 Days Left' : '18 Days Left'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full">
                  <div className={`h-full rounded-full ${i === 2 ? 'bg-orange-500 w-1/4' : 'bg-teal-500 w-3/4'}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage;