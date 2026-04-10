import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { 
  Bell, AlertCircle, Check, Info, Trash2, 
  MoreVertical 
} from 'lucide-react';
import { medicationService } from '../services/medicationService';

const NotificationsPage = () => {
  const [filter, setFilter] = useState('All');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real data on load
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await medicationService.getNotifications();
      const rawData = response.data.results || response.data;
      
      // Map the Django data to match your UI's expected format!
      const formattedData = rawData.map(note => {
        // 1. Figure out the styling and action based on the backend's type
        let iconToUse, bgClassToUse, actionTextToUse;
        
        switch(note.notification_type) {
            case 'warning':
                iconToUse = <AlertCircle className="text-orange-600" />;
                bgClassToUse = 'bg-orange-50';
                actionTextToUse = note.is_read ? 'Dismiss' : 'Order Refill';
                break;
            case 'info':
                iconToUse = <Info className="text-blue-600" />;
                bgClassToUse = 'bg-blue-50';
                actionTextToUse = note.is_read ? 'Dismiss' : 'View Details';
                break;
            case 'dose':
            default: // Default to dose if something goes wrong
                iconToUse = <Check className="text-teal-600" />;
                bgClassToUse = 'bg-teal-50';
                actionTextToUse = note.is_read ? 'Dismiss' : 'Mark Taken';
                break;
        }

        // 2. Return the dynamically formatted object
        return {
            id: note.id,
            type: note.notification_type || 'dose',
            title: note.title,
            desc: note.message,
            time: new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: new Date(note.created_at).toLocaleDateString(),
            icon: iconToUse,
            bg: bgClassToUse,
            action: actionTextToUse,
            is_read: note.is_read
        };
      });

      setNotifications(formattedData);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = async (note) => {
    if (!note.is_read) {
      try {
        await medicationService.markNotificationRead(note.id);
        // Update UI instantly
        setNotifications(notifications.map(n => 
          n.id === note.id ? { ...n, is_read: true, action: 'Dismiss' } : n
        ));
      } catch (error) {
        console.error("Error marking as read:", error);
      }
    } else {
      // Logic for dismissing/deleting could go here later
      console.log("Dismissing notification", note.id);
    }
  };

  const filteredItems = filter === 'All' 
    ? notifications 
    : notifications.filter(n => n.type === filter.toLowerCase());

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
          {/* Header Controls (Unchanged) */}
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
          {loading ? (
             <div className="text-center py-20 text-slate-500">Loading notifications...</div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((n) => (
                <div key={n.id} style={{ opacity: n.is_read ? 0.6 : 1 }} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-start gap-6 group hover:border-teal-500/30 transition-all">
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
                        <button 
                          onClick={() => handleActionClick(n)}
                          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            n.is_read 
                            ? 'bg-slate-50 text-slate-500 hover:bg-slate-100' 
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                          }`}
                        >
                          {n.action}
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
          )}

          {/* Empty State */}
          {!loading && filteredItems.length === 0 && (
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