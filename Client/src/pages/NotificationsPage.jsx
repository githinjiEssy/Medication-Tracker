import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { 
  Bell, AlertCircle, Check, Info, Trash2, 
  ShoppingCart, Calendar, MoreVertical, Filter 
} from 'lucide-react';

const NotificationsPage = () => {
  const [filter, setFilter] = useState('All');

  const allNotifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Refill Required',
      desc: 'Warfarin is down to 2 doses. Your current prescription ends on Sunday.',
      time: '2m ago',
      date: 'Today',
      icon: <AlertCircle className="text-orange-600" />,
      bg: 'bg-orange-50',
      action: 'Order Refill'
    },
    {
      id: 2,
      type: 'dose',
      title: 'Dose Reminder',
      desc: 'Time for Metformin (500mg). Take with your meal.',
      time: '1h ago',
      date: 'Today',
      icon: <Check className="text-teal-600" />,
      bg: 'bg-teal-50',
      action: 'Mark Taken'
    },
    {
      id: 3,
      type: 'info',
      title: 'Lab Results Ready',
      desc: 'Your recent blood work results have been uploaded by Dr. Smith.',
      time: 'Yesterday',
      date: 'March 12, 2026',
      icon: <Info className="text-blue-600" />,
      bg: 'bg-blue-50',
      action: 'View Results'
    }
  ];

  const filteredItems = filter === 'All' 
    ? allNotifications 
    : allNotifications.filter(n => n.type === filter.toLowerCase());

  return (
    <div className="flex min-h-screen bg-[#f8fafb]">
      <Sidebar />
      <main className="flex-1 p-8">
        <TopBar 
          title="Notification Center" 
          description="A complete history of your health alerts and reminders."
          showSearch={false}
        />

        <div className="max-w-4xl mx-auto">
          {/* Header Controls */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              {['All', 'Warning', 'Dose', 'Info'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    filter === f 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors">
              <Trash2 size={16} /> Clear All History
            </button>
          </div>

          {/* Activity Feed */}
          <div className="space-y-4">
            {filteredItems.map((n) => (
              <div key={n.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-start gap-6 group hover:border-teal-500/30 transition-all">
                <div className={`w-14 h-14 ${n.bg} rounded-2xl flex items-center justify-center shrink-0`}>
                  {React.cloneElement(n.icon, { size: 24 })}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-slate-900 text-lg">{n.title}</h3>
                      <p className="text-slate-500 text-sm mt-1 leading-relaxed">{n.desc}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{n.date}</p>
                      <p className="text-xs font-bold text-teal-600 mt-1">{n.time}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between items-center">
                    <div className="flex gap-3">
                      <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all">
                        {n.action}
                      </button>
                      <button className="px-5 py-2.5 bg-slate-50 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all">
                        Dismiss
                      </button>
                    </div>
                    <button className="text-slate-300 hover:text-slate-600">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State (If no results) */}
          {filteredItems.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Bell size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">All caught up!</h3>
              <p className="text-slate-500 font-medium">No new notifications in this category.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NotificationsPage;