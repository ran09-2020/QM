import React, { useState } from 'react';
import { Menu, ChevronDown, Plus } from 'lucide-react';
import { useSchool } from '../contexts/SchoolContext';

export default function TopNav({ session, setIsSidebarOpen }) {
  const mentorGender = session?.user?.user_metadata?.mentor_gender || 'male';
  const mentorTitle = mentorGender === 'female' ? 'המנטורית האישית שלך' : 'המנטור האישי שלך';
  
  const { role } = useSchool();

  return (
    <div className="top-nav">
      <div className="mobile-brand-section">
        <button className="menu-btn" onClick={() => setIsSidebarOpen(true)}>
          <Menu size={28} color="#0f172a" />
        </button>
        <div className="mobile-brand-text">
          <h2>מצפן</h2>
          <span>{mentorTitle}</span>
        </div>
        <div className="status-dot"></div>
      </div>
      
    </div>
  );
}
