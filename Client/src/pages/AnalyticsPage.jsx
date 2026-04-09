import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
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
  Loader2,
  Activity,
  Clock,
  Mail,
  MessageCircle,
} from 'lucide-react';
import { generateHealthReport, shareHealthReport } from '../utils/pdfGenerator';

const AnalyticsPage = () => {
  const { user } = useContext(AuthContext);
  const [timeRange, setTimeRange] = useState(30);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [exportMode, setExportMode] = useState('full'); // 'full' or 'share'

  // Build complete user data object from auth context
  const userData = {
    username: user?.username || '',
    email: user?.email || 'Not specified',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    full_name: user?.full_name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Patient',
    phone_number: user?.phone_number || 'Not specified',
    date_of_birth: user?.date_of_birth || null,
    age: user?.age || 'N/A',
    gender: user?.gender === 'M' ? 'Male' : user?.gender === 'F' ? 'Female' : 'Not specified',
    blood_group: user?.blood_group || 'Not specified',
    emergency_contact_name: user?.emergency_contact_name || 'Not specified',
    emergency_contact_phone: user?.emergency_contact_phone || 'Not specified',
    allergies: user?.allergies || 'None reported',
    chronic_conditions: user?.chronic_conditions || 'None reported',
  };

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

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle PDF Export
  const handleExportPDF = (mode = 'full') => {
    const prescriptionsForPDF = adherenceByMed.map(med => ({
      name: med.name,
      dosage: 'See prescription', // Default since dosage isn't in statistics
      adherence_rate: med.adherence_rate,
      taken_doses: med.taken_doses,
      total_doses: med.total_doses,
      status: 'Active' // Default since status isn't in statistics
    }));
      
    console.log('Exporting PDF with mode:', mode);
    console.log('UserData:', userData);
    console.log('Statistics:', statistics);
    console.log('Prescriptions:', prescriptionsForPDF);
    
    try {
      generateHealthReport(userData, statistics, prescriptionsForPDF, mode);
      setShowShareMenu(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  // Handle Share
  const handleShare = (method) => {
    const prescriptionsForPDF = adherenceByMed.map(med => ({
      name: med.name,
      adherence_rate: med.adherence_rate,
      taken_doses: med.taken_doses,
      total_doses: med.total_doses,
    }));
    
    console.log('Sharing via:', method);
    
    try {
      const result = shareHealthReport(userData, statistics, prescriptionsForPDF, method);
      if (!result) {
        alert('Sharing failed or was cancelled.');
      }
      setShowShareMenu(false);
    } catch (error) {
      console.error('Error sharing:', error);
      alert('Failed to share. Please try again.');
    }
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
            {userData.full_name !== 'Patient' && (
              <p className="text-xs text-slate-400 mt-1">
                Report for: {userData.full_name}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            
            {/* Export Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
              >
                <Download size={18} className="text-teal-600" />
                Export
              </button>
              
              {showShareMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowShareMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-100 z-20 overflow-hidden">
                    <div className="p-3 border-b border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Download PDF</p>
                    </div>
                    <button
                      onClick={() => handleExportPDF('full')}
                      className="w-full px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                    >
                      <Download size={16} className="text-teal-600" />
                      <div>
                        <p className="font-bold">Full Report</p>
                        <p className="text-[10px] text-slate-400">Complete medical history</p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleExportPDF('share')}
                      className="w-full px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors border-t border-slate-100"
                    >
                      <Share2 size={16} className="text-blue-600" />
                      <div>
                        <p className="font-bold">Share-Friendly Report</p>
                        <p className="text-[10px] text-slate-400">Redacted contact details</p>
                      </div>
                    </button>
                    
                    <div className="p-3 border-t border-b border-slate-100 bg-slate-50">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Share via</p>
                    </div>
                    <button
                      onClick={() => handleShare('email')}
                      className="w-full px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                    >
                      <Mail size={16} className="text-teal-600" />
                      <div>
                        <p className="font-bold">Email</p>
                        <p className="text-[10px] text-slate-400">Send to healthcare provider</p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleShare('whatsapp')}
                      className="w-full px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors border-t border-slate-100"
                    >
                      <MessageCircle size={16} className="text-green-600" />
                      <div>
                        <p className="font-bold">WhatsApp</p>
                        <p className="text-[10px] text-slate-400">Share summary via message</p>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>
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
            <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-teal-50 rounded-3xl border border-blue-100">
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                <span className="font-bold text-teal-700">💡 Insight:</span>{' '}
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