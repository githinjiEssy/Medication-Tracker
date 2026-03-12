import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { ChevronLeft, ChevronRight, Clock, Check, AlertCircle } from 'lucide-react';

const SchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock schedule data
  const schedule = [
    { time: '08:00 AM', name: 'Lisinopril', dose: '10mg', status: 'taken' },
    { time: '12:00 PM', name: 'Metformin', dose: '500mg', status: 'pending' },
    { time: '08:00 PM', name: 'Metformin', dose: '500mg', status: 'pending' },
    { time: '09:00 PM', name: 'Warfarin', dose: '3mg', status: 'warning', note: 'Low supply!' },
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex min-h-screen bg-[#f8fafb]">
      <Sidebar />
      <main className="flex-1 p-8">
        <TopBar title="Treatment Schedule" showSearch={false} />

        <div className="max-w-5xl mx-auto space-y-8">
          {/* 1. Week Selector */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8 px-4">
              <h3 className="font-black text-slate-900 text-xl">March 2026</h3>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-50 rounded-xl border border-slate-100 text-slate-400"><ChevronLeft size={20}/></button>
                <button className="p-2 hover:bg-slate-50 rounded-xl border border-slate-100 text-slate-400"><ChevronRight size={20}/></button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-4">
              {weekDays.map((day, i) => (
                <div key={day} className="text-center group cursor-pointer">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{day}</p>
                  <div className={`h-16 rounded-2xl flex flex-col items-center justify-center transition-all ${i === 5 ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30' : 'bg-slate-50 text-slate-900 hover:bg-slate-100'}`}>
                    <span className="text-lg font-black">{10 + i}</span>
                    {i < 5 && <div className="w-1 h-1 bg-teal-500 rounded-full mt-1"></div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Timeline View */}
          <div className="relative">
            <div className="absolute left-[31px] top-0 bottom-0 w-px bg-slate-200 dashed"></div>
            
            <div className="space-y-8">
              {schedule.map((item, idx) => (
                <div key={idx} className="relative flex gap-8 items-start">
                  {/* Time Circle */}
                  <div className={`z-10 w-16 h-16 rounded-full border-4 border-[#f8fafb] flex items-center justify-center shrink-0 shadow-sm ${
                    item.status === 'taken' ? 'bg-teal-500 text-white' : 'bg-white text-slate-400'
                  }`}>
                    <Clock size={20} />
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-teal-500/30 transition-all">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-black text-teal-600 uppercase tracking-widest">{item.time}</span>
                        <h4 className="text-xl font-black text-slate-900 mt-1">{item.name}</h4>
                        <p className="text-sm font-bold text-slate-500">{item.dose}</p>
                      </div>
                      
                      {item.status === 'taken' ? (
                        <div className="flex items-center gap-2 text-teal-600 bg-teal-50 px-4 py-2 rounded-xl font-bold text-sm">
                          <Check size={18} /> Taken
                        </div>
                      ) : (
                        <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">
                          Log Dose
                        </button>
                      )}
                    </div>
                    
                    {item.note && (
                      <div className="mt-4 p-3 bg-orange-50 rounded-xl flex items-center gap-2 text-xs font-bold text-orange-700">
                        <AlertCircle size={14} /> {item.note}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SchedulePage;