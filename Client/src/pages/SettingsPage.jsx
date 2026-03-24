import React, { useContext, useState, useEffect } from 'react';
import { Shield, Lock, LogOut } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { SettingsInput } from '../components/FormElements';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import Toast from '../components/Toast';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    // Functional update ensures the timer clears the correct state
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 4000);
  };

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  const handlePasswordChange = async () => {
    if (!passwordData.old_password || !passwordData.new_password) {
      return showToast("Please fill in all fields", "error");
    }
    if (passwordData.new_password !== passwordData.confirm_password) {
      return showToast("Passwords do not match", "error");
    }

    setIsUpdating(true);
    try {
      const response = await api.post('change-password/', {
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
        new_password2: passwordData.confirm_password
      });

      // IMPORTANT: Update tokens so the session stays active
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      showToast("Password updated successfully!", "success");
      setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      const errorData = err.response?.data;
      const errorMessage = errorData?.new_password2?.[0] || errorData?.detail || "Update failed";
      showToast(errorMessage, "error");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return null;

  return (
    <div className="flex min-h-screen bg-[#f8fafb]">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
          <Toast 
            isVisible={toast.visible}
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast({ ...toast, show: false })}
          />

        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Security Settings</h1>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
            <h3 className="text-sm font-bold text-red-600 uppercase tracking-wider flex items-center gap-2 mb-2">
              <Lock size={16} /> Update Password
            </h3>

            <div className="space-y-5">
              <SettingsInput 
                label="Current Password" 
                type="password" 
                value={passwordData.old_password} 
                onChange={(e) => setPasswordData({...passwordData, old_password: e.target.value})} 
                placeholder="••••••••" 
              />
              <SettingsInput 
                label="New Password" 
                type="password" 
                value={passwordData.new_password} 
                onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})} 
                placeholder="••••••••" 
              />
              <SettingsInput 
                label="Confirm New Password" 
                type="password" 
                value={passwordData.confirm_password} 
                onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})} 
                placeholder="••••••••" 
              />
            </div>

            <button 
              onClick={handlePasswordChange}
              disabled={isUpdating}
              className="w-full bg-gray-800 text-white py-3.5 rounded-xl font-bold hover:bg-black transition-all mt-4 disabled:opacity-50"
            >
              {isUpdating ? 'Saving...' : 'Save New Password'}
            </button>

            <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
               <div className="flex items-start gap-4 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg text-green-600">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">Data Privacy Compliance</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">Account protected with end-to-end encryption.</p>
                  </div>
               </div>
               <button 
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 text-red-500 text-sm font-bold py-3 border border-red-100 rounded-xl hover:bg-red-50"
              >
                <LogOut size={16} /> Logout from this Device
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;