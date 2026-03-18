import React from 'react';
import { Shield, Lock, LogOut } from 'lucide-react';
import Sidebar from '../components/Sidebar';

// reusable form components
import { SettingsInput } from '../components/FormElements';

const Settings = () => {
  return (
    <div className="flex min-h-screen bg-[#f8fafb]">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Security Settings</h1>
              <p className="text-gray-500 text-sm">Manage your password and account protection.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
            <h3 className="text-sm font-bold text-red-600 uppercase tracking-wider flex items-center gap-2 mb-2">
              <Lock size={16} /> Update Password
            </h3>
            
            <div className="space-y-5">
              <SettingsInput label="Current Password" type="password" placeholder="••••••••" />
              <SettingsInput label="New Password" type="password" placeholder="••••••••" />
              <SettingsInput label="Confirm New Password" type="password" placeholder="••••••••" />
            </div>

            <button className="w-full bg-gray-800 text-white py-3.5 rounded-xl font-bold hover:bg-black transition-all mt-4">
              Save New Password
            </button>

            <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                  <Shield size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800">Data Privacy Compliance</h4>
                  <p className="text-xs text-gray-500 leading-relaxed mt-1">
                    Your account is protected with end-to-end encryption. MedTrack complies with medical data standards to ensure your history remains private.
                  </p>
                </div>
              </div>
              <button className="w-full flex items-center justify-center gap-2 text-red-500 text-sm font-bold py-3 border border-red-100 rounded-xl hover:bg-red-50 transition">
                <LogOut size={16} /> Terminate All Active Sessions
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
