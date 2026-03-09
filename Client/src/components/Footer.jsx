import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Product",
      links: ["Features", "Security", "Pricing", "Mobile App"]
    },
    {
      title: "Company",
      links: ["About Us", "Careers", "Press", "Contact"]
    },
    {
      title: "Resources",
      links: ["Help Center", "Privacy Policy", "Terms of Service", "Trust Center"]
    }
  ];

  return (
    <footer className="bg-white pt-20 pb-10 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 font-bold text-teal-600 text-2xl mb-6">
              <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-200">
                <Heart size={20} fill="currentColor" />
              </div>
              MedTrack
            </div>
            <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
              Your trusted partner in medication management. We help you stay on top of your health journey with smart technology and simple tools.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-teal-600 hover:text-white transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav Columns */}
          {footerLinks.map((group, i) => (
            <div key={i}>
              <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">{group.title}</h4>
              <ul className="space-y-4">
                {group.links.map((link, j) => (
                  <li key={j}>
                    <a href="#" className="text-gray-500 hover:text-teal-600 transition-colors text-sm font-medium">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-gray-400 text-sm">
            © {currentYear} MedTrack Inc. All rights reserved. Made with 🩺 for a healthier world.
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              All Systems Operational
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
              <Mail size={16} className="text-teal-600" />
              support@medtrack.io
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;