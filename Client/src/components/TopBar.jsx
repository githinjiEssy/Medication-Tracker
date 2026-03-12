import React from 'react';
import { Search, Bell, User, Settings } from 'lucide-react';

const TopBar = ({ searchTerm, setSearchTerm, showSearch = true }) => {
  return (
    <div className="flex flex-col gap-8 mb-10">
      {/* Search & Profile Row */}
      <div className="flex justify-between items-center">

        {showSearch ? (
          <div className="flex-1 max-w-xl bg-white border border-slate-100 rounded-2xl px-6 py-3 flex items-center gap-4 shadow-sm focus-within:ring-2 focus-within:ring-teal-500/10 transition-all">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..." 
              className="bg-transparent outline-none text-sm w-full font-medium text-slate-600"
            />
          </div>
        ) : (
          <div className="flex-1" /> // Spacer if search is hidden
        )}

        <div className="flex items-center gap-4 ml-8">
          <button className="relative p-3 bg-white border border-slate-100 rounded-2xl text-slate-500 hover:bg-slate-50 transition-all shadow-sm">
            <Bell size={20} />
            <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-900 leading-none">John Doe</p>
              <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mt-1">Patient ID: #8821</p>
            </div>
            <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600 border-2 border-white shadow-sm overflow-hidden cursor-pointer hover:border-teal-500 transition-all">
              <User size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Page Title Row
      {title && (
        <div className="animate-in fade-in slide-in-from-left-4 duration-500">
          <h1 className="text-4xl font-black text-slate-950 tracking-tight">{title}</h1>
          {description && <p className="text-slate-500 font-medium mt-1">{description}</p>}
        </div>
      )} */}
    </div>
  );
};

export default TopBar;