import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, Check, AlertCircle, ShoppingCart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TopBar = ({ title, description, searchTerm, setSearchTerm, showSearch = true }) => {
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true); //State to track if there are unread notifications
  
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsNotifyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Logic to clear the red dot when the menu opens
  const handleToggleNotifications = () => {
    if (!isNotifyOpen) {
      setHasUnread(false); // Mark as read when opening
    }
    setIsNotifyOpen(!isNotifyOpen);
  };

  const notifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Refill Required',
      desc: 'Warfarin is down to 2 doses.',
      time: '2m ago',
      icon: <AlertCircle size={16} className="text-orange-600" />,
      bg: 'bg-orange-50'
    },
    {
      id: 2,
      type: 'action',
      title: 'Dose Reminder',
      desc: 'Time for Metformin (500mg).',
      time: '1h ago',
      icon: <Check size={16} className="text-teal-600" />,
      bg: 'bg-teal-50'
    }
  ];

  return (
    <div className="flex flex-col gap-8 mb-10 relative">
      <div className="flex justify-between items-center">
        {/* Search Bar */}
        {showSearch ? (
          <div className="flex-1 max-w-xl bg-white border border-slate-100 rounded-2xl px-6 py-3 flex items-center gap-4 shadow-sm focus-within:ring-2 focus-within:ring-teal-500/10 transition-all">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search medications..." 
              className="bg-transparent outline-none text-sm w-full font-medium text-slate-600"
            />
          </div>
        ) : <div className="flex-1" />}

        <div className="flex items-center gap-4 ml-8 relative" ref={dropdownRef}>
          {/* Bell Icon & Toggle */}
          <button 
            onClick={handleToggleNotifications}
            className={`relative p-3 rounded-2xl transition-all shadow-sm border ${
              isNotifyOpen ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Bell size={20} />
            {/* Conditional Red Dot */}
            {hasUnread && (
              <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
            )}
          </button>

          {/* Floating Dropdown */}
          {isNotifyOpen && (
            <div className="absolute right-0 top-16 w-80 bg-white rounded-[2rem] shadow-2xl border border-slate-100 z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                <h3 className="font-black text-slate-900">Notifications</h3>
                {/* Dynamic count based on hasUnread */}
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase ${hasUnread ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-400'}`}>
                  {hasUnread ? '2 New' : 'All Read'}
                </span>
              </div>

              <div className="max-h-[350px] overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 cursor-pointer group">
                    <div className="flex gap-4">
                      <div className={`w-10 h-10 ${n.bg} rounded-xl flex items-center justify-center shrink-0`}>
                        {n.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-bold text-slate-900">{n.title}</p>
                          <span className="text-[10px] text-slate-400 font-medium">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.desc}</p>
                        
                        {n.type === 'warning' && (
                          <button className="mt-3 flex items-center gap-1.5 text-[10px] font-black text-orange-600 uppercase tracking-widest hover:text-orange-700">
                            <ShoppingCart size={12} /> Refill Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button 
              // onClick={ navigate('/notifications') }
              className="w-full py-4 bg-slate-50 text-slate-500 text-xs font-bold hover:text-teal-600 transition-colors flex items-center justify-center gap-2 group">
                View All History <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
          
          {/* Profile Section remains the same */}
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-900 leading-none">John Doe</p>
              <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mt-1">Patient #8821</p>
            </div>
            <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600 border-2 border-white shadow-sm hover:border-teal-500 transition-all cursor-pointer">
              <User size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Title Section remains the same */}
      {/* {title && (
        <div className="animate-in fade-in slide-in-from-left-4 duration-500">
          <h1 className="text-4xl font-black text-slate-950 tracking-tight">{title}</h1>
          {description && <p className="text-slate-500 font-medium mt-1">{description}</p>}
        </div>
      )} */}
    </div>
  );
};

export default TopBar;