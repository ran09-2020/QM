import React, { useState } from 'react';
import { Menu, ChevronDown, Plus, Navigation } from 'lucide-react';
import { useSchool } from '../contexts/SchoolContext';

export default function TopNav({ session, setIsSidebarOpen }) {
  const mentorGender = session?.user?.user_metadata?.mentor_gender || 'male';
  const mentorTitle = mentorGender === 'female' ? 'המנטורית האישית שלי' : 'המנטור האישי שלי';
  
  const { role } = useSchool();

  return (
    <div className="top-nav">
      <div className="mobile-brand-section">
        <button className="menu-btn" onClick={() => setIsSidebarOpen(true)}>
          <Menu size={28} color="#0f172a" />
        </button>
        <div className="mobile-brand-text">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', margin: 0, color: '#1e3a8a' }}>
            כוכב
            <Navigation size={20} style={{ transform: 'rotate(-45deg)' }} fill="none" color="#3b82f6" />
            צפון
          </h2>
          <span>{mentorTitle}</span>
        </div>
        <div className="status-dot"></div>
      </div>
      
    </div>
  );
}
