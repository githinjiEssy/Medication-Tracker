import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { User as UserIcon, Camera, Save, Phone, Heart, Activity, Calendar, Users, ShieldCheck, CheckCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { SettingsInput, SettingsSelect, SettingsTextArea } from '../components/FormElements';

const Profile = () => {
  const location = useLocation();

  // Simulated "New User" state: Medical fields are empty/blank
  const [profileData, setProfileData] = useState({
    fullName: "John Doe",
    email: "john.doe@medtrack.com",
    phone_number: "+254712345678",
    date_of_birth: "1995-08-15",
    gender: "M",
    // Medical fields starting blank for new users
    blood_group: "UNKNOWN",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    allergies: "",
    chronic_conditions: ""
  });

  // Calculate completion percentage
  const calculateProgress = () => {
    const fields = [
      profileData.fullName,
      profileData.phone_number,
      profileData.date_of_birth,
      profileData.blood_group !== "UNKNOWN",
      profileData.emergency_contact_name,
      profileData.emergency_contact_phone,
      profileData.allergies,
      profileData.chronic_conditions
    ];
    const completed = fields.filter(field => field && field !== "").length;
    return Math.round((completed / fields.length) * 100);
  };

  const progress = calculateProgress();

  useEffect(() => {
    if (window.location.hash === '#medical') {
      const element = document.getElementById('medical-info');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        element.classList.add('ring-2', 'ring-blue-500', 'ring-offset-4');
        setTimeout(() => element.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-4'), 3000);
      }
    }
  }, [location]);

  return (
    <div className="flex min-h-screen bg-[#f8fafb]">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          
          {/* Animated Completion Banner */}
          <div className="mb-8 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h2 className="font-bold text-gray-800">Profile Completion</h2>
                  <p className="text-xs text-gray-500">Complete medical info to unlock all safety features.</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-blue-600">{progress}%</span>
              </div>
            </div>
            
            {/* Progress Bar Track */}
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(37,99,235,0.3)]"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">My Medical Profile</h1>
            <p className="text-gray-500 text-sm">Update your personal and clinical information.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-10">
            {/* Profile Header */}
            <div className="flex items-center gap-6 pb-8 border-b border-gray-100">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-blue-100 border-4 border-white shadow-md overflow-hidden">
                  <img src={`https://ui-avatars.com/api/?name=${profileData.fullName}&background=0284c7&color=fff`} alt="Profile" />
                </div>
                <button className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full border-2 border-white shadow-sm hover:bg-blue-700">
                  <Camera size={12} />
                </button>
              </div>
              <div>
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-800">{profileData.fullName}</h2>
                    {progress === 100 && <CheckCircle size={18} className="text-green-500" />}
                </div>
                <p className="text-gray-500 text-sm flex items-center gap-2">
                  <Activity size={14} className="text-blue-500" /> Patient Account
                </p>
              </div>
            </div>

            {/* Personal Info */}
            <section>
              <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-6 flex items-center gap-2">
                <UserIcon size={16}/> Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <SettingsInput label="Full Name" defaultValue={profileData.fullName} />
                <SettingsInput label="Email Address" defaultValue={profileData.email} disabled />
                <SettingsInput label="Phone Number" defaultValue={profileData.phone_number} icon={<Phone size={16}/>} />
                <SettingsInput label="Date of Birth" type="date" defaultValue={profileData.date_of_birth} icon={<Calendar size={16}/>} />
                <SettingsSelect 
                  label="Gender" 
                  options={[{val:'M', lab:'Male'}, {val:'F', lab:'Female'}]} 
                  defaultValue={profileData.gender} 
                />
              </div>
            </section>

            {/* Medical Info Section - Empty for New Users */}
            <section id="medical-info" className="bg-blue-50/40 p-6 rounded-2xl border border-blue-50 transition-all duration-500">
              <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-6 flex items-center gap-2">
                <Heart size={16} /> Medical Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <SettingsSelect 
                  label="Blood Group" 
                  options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'UNKNOWN'].map(g => ({val:g, lab:g}))} 
                  defaultValue={profileData.blood_group} 
                />
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/50 p-4 rounded-xl border border-blue-100">
                  <SettingsInput label="Emergency Contact Name" placeholder="Full name of contact" defaultValue={profileData.emergency_contact_name} icon={<Users size={16}/>} />
                  <SettingsInput label="Emergency Contact Phone" placeholder="+254..." defaultValue={profileData.emergency_contact_phone} icon={<Phone size={16}/>} />
                </div>
                <div className="md:col-span-2">
                  <SettingsTextArea label="Allergies" placeholder="e.g. Penicillin, Nuts (Leave empty if none)" defaultValue={profileData.allergies} />
                </div>
                <div className="md:col-span-2">
                  <SettingsTextArea label="Chronic Conditions" placeholder="e.g. Asthma, Diabetes" defaultValue={profileData.chronic_conditions} />
                </div>
              </div>
            </section>

            <div className="flex justify-end pt-4">
              <button className="bg-blue-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 flex items-center gap-2">
                <Save size={18} /> Update Profile
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;