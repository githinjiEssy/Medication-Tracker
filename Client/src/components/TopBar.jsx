import React, { useState, useRef, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import { Search, Bell, User, Check, AlertCircle, ShoppingCart, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const TopBar = ({ searchTerm, setSearchTerm }) => {
  const { user } = useContext(AuthContext);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Define pages where the search bar should be HIDDEN
  const hideSearchPages = ['/profile', '/settings'];
  const shouldShowSearch = !hideSearchPages.includes(location.pathname);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsNotifyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleNotifications = () => {
    if (!isNotifyOpen) setHasUnread(false);
    setIsNotifyOpen(!isNotifyOpen);
  };

  const notifications = [
    { id: 1, type: 'warning', title: 'Refill Required', desc: 'Warfarin is low.', time: '2m ago', icon: <AlertCircle size={16} className="text-orange-600" />, bg: 'bg-orange-50' },
    { id: 2, type: 'action', title: 'Dose Reminder', desc: 'Time for Metformin.', time: '1h ago', icon: <Check size={16} className="text-teal-600" />, bg: 'bg-teal-50' }
  ];

  return (
    <div className="flex flex-col gap-8 mb-10 relative">
      <div className="flex justify-between items-center">
        
        {/* Conditional Search Bar Rendering */}
        {shouldShowSearch ? (
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
        ) : (
          /* Spacer to keep layout consistent when search is hidden */
          <div className="flex-1" />
        )}

        <div className="flex items-center gap-4 ml-8 relative" ref={dropdownRef}>
          {/* Notification Bell */}
          <button 
            onClick={handleToggleNotifications}
            className={`relative p-3 rounded-2xl transition-all shadow-sm border ${
              isNotifyOpen ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Bell size={20} />
            {hasUnread && (
              <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
            )}
          </button>

          {/* Notification Dropdown logic remains the same... */}

          {/* Dynamic Profile Section */}
          <div 
            onClick={() => navigate('/profile')} 
            className="flex items-center gap-3 pl-4 border-l border-slate-200 cursor-pointer group"
          >
            <div className="text-right hidden sm:block">
              {/* Display dynamic user name or 'Guest' if not loaded */}
              <p className="text-sm font-black text-slate-900 leading-none">
                {user ? `${user.first_name} ${user.last_name}` : 'Loading...'}
              </p>
              <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mt-1">
                {user?.username || 'Patient Account'}
              </p>
            </div>
            <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600 border-2 border-white shadow-sm group-hover:border-teal-500 transition-all">
              {user?.profile_picture ? (
                <img src={user.profile_picture} className="w-full h-full rounded-2xl object-cover" alt="Profile" />
              ) : (
                <User size={24} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;