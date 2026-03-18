import React from 'react';

export const SettingsInput = ({ label, icon, ...props }) => (
  <div className="space-y-1.5 w-full">
    <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-tight">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-3 text-gray-400">
          {icon}
        </div>
      )}
      <input 
        className={`w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all 
          ${icon ? 'pl-10' : ''} 
          ${props.disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-800'}`}
        {...props} 
      />
    </div>
  </div>
);

export const SettingsSelect = ({ label, options, defaultValue, ...props }) => (
  <div className="space-y-1.5 w-full">
    <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-tight">
      {label}
    </label>
    <select 
      className="w-full p-2.5 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
      defaultValue={defaultValue}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.val || opt} value={opt.val || opt}>
          {opt.lab || opt}
        </option>
      ))}
    </select>
  </div>
);

export const SettingsTextArea = ({ label, ...props }) => (
  <div className="space-y-1.5 w-full">
    <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-tight">
      {label}
    </label>
    <textarea 
      rows="3" 
      className="w-full p-2.5 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500 text-gray-800" 
      {...props}
    ></textarea>
  </div>
);