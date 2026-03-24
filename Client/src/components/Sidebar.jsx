import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Pill, 
  AlertCircle, 
  BarChart3, 
  Settings, 
  Heart,
  UserCircle,
  Bell,
  CalendarCheck2,
  LogOut 
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext); // Get user data and logout function

  const menuItems = [
    { name: 'Today', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Schedule', icon: CalendarCheck2, path: '/schedule' },
    { name: 'Medications', icon: Pill, path: '/medications' },
    { name: 'Adverse Reactions', icon: AlertCircle, path: '/reactions' },
    { name: 'Analytics', icon: BarChart3, path: '/analytics' },
    { name: 'Notifications', icon: Bell, path: '/notifications' },
  ];

  const settingItems = [
    { name: 'Profile', icon: UserCircle, path: '/profile' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-[#f0f9f9] border-r border-slate-100 flex flex-col h-screen sticky top-0">
      {/* Brand Logo */}
      <div className="p-6 mb-4">
        <div 
          className="flex items-center gap-3 font-bold text-[#0d7a8a] text-xl cursor-pointer"
          onClick={() => navigate('/dashboard')}
        >
          <div className="w-9 h-9 bg-[#0d7a8a] rounded-lg flex items-center justify-center text-white shadow-md">
            <Heart size={20} fill="currentColor" />
          </div>
          MedTrack
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        <p className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Main</p>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                isActive 
                  ? 'bg-[#0d7a8a] text-white shadow-lg shadow-teal-900/10' 
                  : 'text-[#4a7c82] hover:bg-teal-50 hover:text-[#0d7a8a]'
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {item.name}
            </button>
          );
        })}

        {/* Settings Group */}
        <div className="pt-8">
          <p className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Settings</p>
          {settingItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#0d7a8a] text-white shadow-lg shadow-teal-900/10' 
                    : 'text-[#4a7c82] hover:bg-teal-50 hover:text-[#0d7a8a]'
                }`}
              >
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {item.name}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer / User Quick Link & Logout */}
      <div className="p-4 mt-auto border-t border-teal-100/50">
        <div className="flex items-center gap-3 p-2 group">
          {/* User Info Section */}
          <div 
            className="flex items-center gap-3 flex-1 cursor-pointer overflow-hidden"
            onClick={() => navigate('/profile')}
          >
            <div className="w-8 h-8 rounded-full bg-teal-600 border-2 border-white shadow-sm flex items-center justify-center text-[10px] text-white font-bold">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-slate-800 truncate">
                {user?.full_name || 'Guest User'}
              </p>
              <p className="text-[10px] text-teal-600 font-medium">Patient Account</p>
            </div>
          </div>
          
          {/* Logout Action */}
          <button 
            onClick={logout}
            title="Logout"
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;