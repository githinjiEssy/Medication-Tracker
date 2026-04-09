import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { medicationService } from '../services/medicationService';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Download, 
  Share2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Pill,
  Activity,
  Clock
} from 'lucide-react';
import { generateHealthReport } from '../utils/pdfGenerator';

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState(30); // days
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch statistics data
  const fetchStatistics = async (days = 30) => {
    try {
      setLoading(true);
      setError(null);
      const response = await medicationService.getStatistics(days);
      setStatistics(response.data);
    } catch (err) {
      console.error("Error fetching statistics:", err);
      setError("Failed to load statistics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics(timeRange);
  }, [timeRange]);

  // Handle time range change
  const handleTimeRangeChange = (days) => {
    const daysMap = {
      'Last 7 Days': 7,
      'Last 30 Days': 30,
      'Last 90 Days': 90
    };
    const daysValue = daysMap[days] || 30;
    setTimeRange(daysValue);
  };

  // Format percentage
  const formatPercentage = (value) => {
    return `${value || 0}%`;
  };

  // Get trend indicator
  const getTrendIndicator = (current, previous) => {
    if (!previous) return null;
    const change = current - previous;
    if (change > 0) {
      return { icon: <ArrowUpRight size={12} />, color: 'text-green-600 bg-green-50', text: `+${change.toFixed(1)}%` };
    } else if (change < 0) {
      return { icon: <ArrowDownRight size={12} />, color: 'text-rose-600 bg-rose-50', text: `${change.toFixed(1)}%` };
    }
    return null;
  };

  // Prepare data for adherence chart
  const getAdherenceChartData = () => {
    if (!statistics?.adherence_by_medication) return [];
    return statistics.adherence_by_medication.slice(0, 7).map(med => ({
      name: med.name,
      rate: med.adherence_rate,
      taken: med.taken_doses,
      total: med.total_doses
    }));
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f8fafb]">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="animate-spin mx-auto mb-4 text-teal-600" size={48} />
            <p className="text-slate-600 font-bold">Loading analytics data...</p>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen bg-[#f8fafb]">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="mx-auto mb-4 text-rose-500" size={48} />
            <p className="text-slate-600 font-bold mb-4">{error}</p>
            <button 
              onClick={() => fetchStatistics(timeRange)}
              className="px-6 py-3 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 transition-all"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Extract data from statistics
  const medsData = statistics?.medications || {};
  const intakesData = statistics?.intakes || {};
  const commentsData = statistics?.comments || {};
  const refillsData = statistics?.refills || {};
  const adherenceByMed = statistics?.adherence_by_medication || [];

  // Calculate stats for summary cards
  const summaryStats = [
    { 
      label: "Overall Adherence", 
      value: formatPercentage(intakesData.adherence_rate), 
      change: null,
      icon: <CheckCircle2 className="text-teal-600" />, 
      color: "bg-teal-50" 
    },
    { 
      label: "Doses Logged", 
      value: intakesData.taken || 0, 
      change: `of ${intakesData.total || 0} total`,
      icon: <TrendingUp className="text-blue-600" />, 
      color: "bg-blue-50" 
    },
    { 
      label: "Side Effects", 
      value: commentsData.side_effects || 0, 
      change: `${commentsData.total || 0} total comments`,
      icon: <AlertCircle className="text-rose-600" />, 
      color: "bg-rose-50" 
    },
  ];

  // Mock user data for PDF (replace with actual user data from auth context)
  const userData = { name: "John Doe" };
  
  // Prepare prescriptions for PDF
  const prescriptionsForPDF = adherenceByMed.map(med => ({
    name: med.name,
    adherence: `${med.adherence_rate}%`,
    doses: `${med.taken_doses}/${med.total_doses}`
  }));

  const handleExportPDF = () => {
    generateHealthReport(userData, prescriptionsForPDF, []);
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafb]">
      <Sidebar />

      <main className="flex-1 p-8">
        <TopBar />

        {/* Header with Export Options */}
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">Health Analytics</h1>
            <p className="text-slate-500 font-medium">
              Insights and adherence patterns for your treatment. 
              <span className="ml-2 text-xs font-bold text-slate-400">
                Period: {statistics?.period_days || timeRange} days
              </span>
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExportPDF} 
              className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
            >
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
          {summaryStats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center`}>
                  {stat.icon}
                </div>
                {stat.change && !stat.change.includes('total') && (
                  <span className="flex items-center gap-1 text-[10px] font-black text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{stat.value}</h3>
              {stat.change && stat.change.includes('total') && (
                <p className="text-xs text-slate-400 mt-1">{stat.change}</p>
              )}
            </div>
          ))}
        </div>

        {/* Medication Status Distribution */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Active</p>
            <p className="text-2xl font-black text-green-600">{medsData.active || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Paused</p>
            <p className="text-2xl font-black text-amber-600">{medsData.paused || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Completed</p>
            <p className="text-2xl font-black text-blue-600">{medsData.completed || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Discontinued</p>
            <p className="text-2xl font-black text-slate-600">{medsData.discontinued || 0}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Adherence Trend by Medication */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 size={20} className="text-teal-600" /> Adherence by Medication
              </h3>
              <select 
                value={`Last ${timeRange} Days`}
                onChange={(e) => handleTimeRangeChange(e.target.value)}
                className="text-xs font-bold text-slate-500 bg-slate-50 border-none rounded-xl px-3 py-2 outline-none cursor-pointer"
              >
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>
            
            {adherenceByMed.length > 0 ? (
              <div className="space-y-4">
                {adherenceByMed.slice(0, 7).map((med, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-32 truncate">
                      <p className="text-sm font-bold text-slate-700 truncate" title={med.name}>
                        {med.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {med.taken_doses}/{med.total_doses} doses
                      </p>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-bold text-slate-500">Adherence</span>
                        <span className={`text-xs font-bold ${
                          med.adherence_rate >= 80 ? 'text-green-600' : 
                          med.adherence_rate >= 50 ? 'text-amber-600' : 'text-rose-600'
                        }`}>
                          {med.adherence_rate}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            med.adherence_rate >= 80 ? 'bg-green-500' : 
                            med.adherence_rate >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${med.adherence_rate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BarChart3 size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 italic">No adherence data available for this period.</p>
              </div>
            )}
          </div>

          {/* Intake Status Distribution & Comments */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-8">
              <Activity size={20} className="text-rose-500" /> Intake & Comment Summary
            </h3>
            
            {/* Intake Status */}
            <div className="mb-8">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Dose Status</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-2xl">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 size={16} className="text-green-600" />
                    <span className="text-xs font-bold text-green-700">Taken</span>
                  </div>
                  <p className="text-2xl font-black text-green-700">{intakesData.taken || 0}</p>
                  <p className="text-[10px] text-green-600">
                    {intakesData.total ? Math.round((intakesData.taken / intakesData.total) * 100) : 0}% of total
                  </p>
                </div>
                <div className="p-4 bg-rose-50 rounded-2xl">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle size={16} className="text-rose-600" />
                    <span className="text-xs font-bold text-rose-700">Missed</span>
                  </div>
                  <p className="text-2xl font-black text-rose-700">{intakesData.missed || 0}</p>
                  <p className="text-[10px] text-rose-600">
                    {intakesData.total ? Math.round((intakesData.missed / intakesData.total) * 100) : 0}% of total
                  </p>
                </div>
              </div>
              {intakesData.pending > 0 && (
                <div className="mt-3 p-3 bg-amber-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-amber-600" />
                      <span className="text-xs font-bold text-amber-700">Pending</span>
                    </div>
                    <span className="text-sm font-black text-amber-700">{intakesData.pending}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Comments Summary */}
            <div className="mb-6">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Comments & Notes</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm text-slate-600">Side Effects</span>
                  <span className="font-bold text-rose-600">{commentsData.side_effects || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm text-slate-600">Effectiveness Notes</span>
                  <span className="font-bold text-teal-600">{commentsData.effectiveness_notes || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm text-slate-600">General Notes</span>
                  <span className="font-bold text-blue-600">{commentsData.general_notes || 0}</span>
                </div>
              </div>
            </div>

            {/* Insight */}
            <div className="mt-6 p-5 bg-blue-50 rounded-3xl border border-blue-100">
              <p className="text-xs text-blue-800 leading-relaxed font-medium">
                <span className="font-bold">Insight:</span>{' '}
                {intakesData.adherence_rate >= 80 ? (
                  "Excellent adherence! Your consistency is helping maintain stable medication levels."
                ) : intakesData.adherence_rate >= 50 ? (
                  "Your adherence is moderate. Setting reminders could help improve consistency."
                ) : intakesData.adherence_rate > 0 ? (
                  "Your adherence needs attention. Consider discussing barriers with your healthcare provider."
                ) : (
                  "Start logging your doses to see personalized adherence insights."
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Refill Status */}
        <div className="mt-8 bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-slate-900/20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Calendar className="text-teal-400" /> Refill Status
            </h3>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {refillsData.low_refills || 0} Low • {refillsData.no_refills || 0} Out
            </span>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800 p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <CheckCircle2 size={20} className="text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{refillsData.with_refills || 0}</p>
                  <p className="text-xs text-slate-400">Sufficient Refills</p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800 p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <AlertCircle size={20} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{refillsData.low_refills || 0}</p>
                  <p className="text-xs text-slate-400">Low Refills (≤2)</p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800 p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center">
                  <AlertCircle size={20} className="text-rose-400" />
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{refillsData.no_refills || 0}</p>
                  <p className="text-xs text-slate-400">No Refills Left</p>
                </div>
              </div>
            </div>
          </div>
          
          {(refillsData.low_refills > 0 || refillsData.no_refills > 0) && (
            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
              <p className="text-sm text-amber-200">
                <span className="font-bold">⚠️ Reminder:</span> You have medications that need refill attention. 
                Contact your pharmacy or healthcare provider to avoid gaps in treatment.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage;