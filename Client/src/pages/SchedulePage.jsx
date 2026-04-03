import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import Toast from '../components/Toast';
import { medicationService } from '../services/medicationService'; 
import { scheduleService } from '../services/scheduleService'; 
import { ChevronLeft, ChevronRight, Clock, Check, AlertCircle, Loader2 } from 'lucide-react';

const SchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [intakes, setIntakes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

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

  const handleLogDose = async (intakeId) => { // medId no longer strictly needed here
    try {
      // Use the PATCH method that targets the specific ID
      await scheduleService.updateIntakeStatus(intakeId, { 
        status: 'TAKEN',
        taken_at: new Date().toISOString() 
      });
      
      showToast("Dose logged successfully");
      fetchSchedule(); 
    } catch (error) {
      console.error("PATCH Error:", error.response?.data || error.message);
      showToast("Failed to log dose", "error");
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
              <h3 className="font-black text-slate-900 text-xl">
                {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h3>
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
                      item.status === 'TAKEN' ? 'bg-teal-500 text-white' : 'bg-white text-slate-400'
                    }`}>
                      <Clock size={20} />
                    </div>

                    <div className="flex-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-teal-500/30 transition-all">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-xs font-black text-teal-600 uppercase tracking-widest">
                            {new Date(item.scheduled_time).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit',
                              timeZone: 'UTC' // Forces the display to match the database exactly
                            })}
                          </span>
                          <h4 className="text-xl font-black text-slate-900 mt-1">{item.medication_name}</h4>
                          <p className="text-sm font-bold text-slate-500">{item.dosage_taken}</p>
                        </div>
                        
                        {item.status === 'TAKEN' ? (
                          <div className="flex items-center gap-2 text-teal-600 bg-teal-50 px-4 py-2 rounded-xl font-bold text-sm">
                            <Check size={18} /> Taken
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleLogDose(item.id)} // Pass the intake ID to log the dose
                            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
                          >
                            Log Dose
                          </button>
                        )}
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