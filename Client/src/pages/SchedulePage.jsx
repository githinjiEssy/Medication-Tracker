import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import Toast from '../components/Toast';
import { scheduleService } from '../services/scheduleService'; 
import { ChevronLeft, ChevronRight, ChevronDown,Clock, Check, Loader2, XCircle, AlertCircle, SkipForward } from 'lucide-react';

const SchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [intakes, setIntakes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
  const navigate = useNavigate();

  // Check if selected date is today for conditional rendering
  const isToday = selectedDate.toDateString() === new Date().toDateString();

  // Format date for API (YYYY-MM-DD)
  const formattedDate = selectedDate.toISOString().split('T')[0];

  const fetchSchedule = async () => {
    try {
      setIsLoading(true);
      // Uses the new service to fetch data for the calendar selection
      const response = await scheduleService.getIntakesByDate(formattedDate);
      
      // Depending on your view return, you might need response.data.results or response.data
      setIntakes(response.data.results || response.data.intakes || response.data);
    } catch (error) {
      console.error("Schedule fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchSchedule();
  }, [selectedDate]);

  const handleGoToToday = () => {
    setSelectedDate(new Date());
  };

  const handleUpdateStatus = async (intakeId, newStatus) => {
    try {
      const payload = { 
        status: newStatus,
        taken_at: newStatus === 'TAKEN' ? new Date().toISOString() : null 
      };
      
      await scheduleService.updateIntakeStatus(intakeId, payload);
      showToast(`Dose marked as ${newStatus.toLowerCase()}`);
      fetchSchedule(); 
    } catch (error) {
      showToast(`Failed to update status`, "error");
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ isVisible: true, message, type });
  };

  // Helper to generate the week view dates
  const getWeekDays = () => {
    const days = [];
    const start = new Date(selectedDate);
    start.setDate(selectedDate.getDate() - selectedDate.getDay());
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getStatusUI = (status) => {
    switch (status) {
      case 'TAKEN': return { color: 'text-teal-600 bg-teal-50', icon: <Check size={16}/> };
      case 'MISSED': return { color: 'text-rose-600 bg-rose-50', icon: <XCircle size={16}/> };
      case 'LATE': return { color: 'text-blue-600 bg-blue-50', icon: <Clock size={16}/> };
      default: return { color: 'text-slate-500 bg-slate-50', icon: <AlertCircle size={16}/> };
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafb]">
      <Toast isVisible={toast.isVisible} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, isVisible: false })} />
      <Sidebar />
      <main className="flex-1 p-8">
        <TopBar title="Treatment Schedule" showSearch={false} />

        <div className="max-w-5xl mx-auto space-y-8">
          {/* 1. Week Selector */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8 px-4">
              <div className="flex items-center gap-4">
                <h3 className="font-black text-slate-900 text-xl">
                  {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                
                {/* TODAY BUTTON: Only shows if NOT on today */}
                {!isToday && (
                  <button
                    onClick={handleGoToToday}
                    className="px-3 py-1 bg-teal-50 text-teal-600 text-xs font-black uppercase tracking-widest rounded-lg border border-teal-100 hover:bg-teal-600 hover:text-white transition-all animate-in fade-in slide-in-from-left-2"
                  >
                    Today
                  </button>
                )}
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 7)))}
                  className="p-2 hover:bg-slate-50 rounded-xl border border-slate-100 text-slate-400"
                ><ChevronLeft size={20}/></button>
                <button 
                  onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 7)))}
                  className="p-2 hover:bg-slate-50 rounded-xl border border-slate-100 text-slate-400"
                ><ChevronRight size={20}/></button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-4">
              {getWeekDays().map((date, i) => (
                <div key={i} onClick={() => setSelectedDate(date)} className="text-center group cursor-pointer">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                  <div className={`h-16 rounded-2xl flex flex-col items-center justify-center transition-all ${
                    date.toDateString() === selectedDate.toDateString() 
                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30' 
                    : 'bg-slate-50 text-slate-900 hover:bg-slate-100'
                  }`}>
                    <span className="text-lg font-black">{date.getDate()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Timeline View */}
          <div className="relative">
            <div className="absolute left-[31px] top-0 bottom-0 w-px bg-slate-200 dashed"></div>
            
            <div className="space-y-8">
              {isLoading ? (
                <div className="flex justify-center p-10"><Loader2 className="animate-spin text-teal-600" /></div>
              ) : intakes.length > 0 ? (
                intakes.map((item, idx) => (
                  <div key={idx} className="relative flex gap-8 items-start">
                    <div className={`z-10 w-16 h-16 rounded-full border-4 border-[#f8fafb] flex items-center justify-center shrink-0 shadow-sm ${
                      item.status === 'TAKEN' ? 'bg-teal-500 text-white' : 
                      item.status === 'MISSED' ? 'bg-rose-500 text-white' : 'bg-white text-slate-400'
                    }`}>
                      {item.status === 'MISSED' ? <XCircle size={20} /> : <Clock size={20} />}
                    </div>

                    <div className="flex-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-teal-500/30 transition-all">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-xs font-black text-teal-600 uppercase tracking-widest">
                            {(() => {
                              const dateObj = new Date(item.scheduled_time);
                              return dateObj.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit', 
                                hour12: true 
                              }).toUpperCase();
                            })()}
                          </span>
                          <h4 className="text-xl font-black text-slate-900 mt-1">{item.medication_name}</h4>
                          <p className="text-sm font-bold text-slate-500">{item.dosage_taken}</p>
                        </div>

                        <div className='flex items-center gap-3'>
                          {item.status === 'PENDING' ? (
                            <div className="relative group">
                              <select
                                value={item.status}
                                onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                                className="appearance-none pl-4 pr-10 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all cursor-pointer outline-none border-none shadow-lg shadow-slate-900/20"
                              >
                                <option value="PENDING">Log dosage</option>
                                <option value="TAKEN">Log: Taken</option>
                                <option value="MISSED">Log: Missed</option>
                                <option value="LATE">Log: Late</option>
                              </select>
                              {/* Custom Arrow Icon for the dropdown */}
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                                <ChevronDown size={16} />
                              </div>
                            </div>
                          ) : (
                            /* Permanent Status Badge after action is taken */
                            <div className="flex flex-col items-end gap-2">
                              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm border ${
                                getStatusUI(item.status).color
                              } border-current/10`}>
                                {getStatusUI(item.status).icon}
                                {item.status.charAt(0) + item.status.slice(1).toLowerCase()}
                              </div>
                              
                              {/* Link to Adverse Reactions (Logging the 'Comment') */}
                              {(item.status === 'TAKEN' || item.status === 'LATE') && (
                                <button 
                                  onClick={() => {
                                    navigate('/reactions', { state: { intakeId: item.id, medicationName: item.medication_name } });
                                  }}
                                  className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-teal-600 transition-colors flex items-center gap-1"
                                >
                                  <AlertCircle size={10} /> Add Reaction
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                        
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-400">No medications scheduled for this day.</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SchedulePage;