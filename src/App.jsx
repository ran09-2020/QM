import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Auth from './components/Auth';
import TopNav from './components/TopNav';
import PersonalSidebar from './components/PersonalSidebar';
import ChatInterface from './components/ChatInterface';
import DashboardModal from './components/DashboardModal';
import SettingsModal from './components/SettingsModal';
import CalendarModal from './components/CalendarModal';
import { Loader2 } from 'lucide-react';
import { SchoolProvider, useSchool } from './contexts/SchoolContext';

function AppContent({ session }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const { role, activeSchool, loading: schoolLoading } = useSchool();

  if (schoolLoading) {
    return (
      <div className="loading-screen" style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Loader2 className="animate-spin" size={48} style={{ color: 'var(--accent-color)' }}/>
      </div>
    );
  }

  const appStyle = role === 'mentor' 
    ? { 
        backgroundColor: activeSchool?.theme_color ? `${activeSchool.theme_color}0A` : '#f8fafc',
        borderTop: `4px solid ${activeSchool?.theme_color || '#4F46E5'}`
      } 
    : { backgroundColor: '#fafafa' };

  return (
    <Router basename={import.meta.env.MODE === 'production' ? '/n-star' : '/'}>
      <div className="app-container app-layout-new" style={appStyle}>
        <PersonalSidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
          session={session} 
          onOpenDashboard={() => setIsDashboardModalOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenCalendar={() => setIsCalendarOpen(true)}
        />
        
        <main className="main-content-area">
          <TopNav session={session} setIsSidebarOpen={setIsSidebarOpen} />
          <div className="page-wrapper">
            <Routes>
              <Route path="/" element={<ChatInterface session={session} isSimulationMode={false} />} />
              <Route path="/simulation" element={<ChatInterface session={session} isSimulationMode={true} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>

        <DashboardModal 
          isOpen={isDashboardModalOpen} 
          onClose={() => setIsDashboardModalOpen(false)} 
          session={session} 
        />

        {isSettingsOpen && (
          <SettingsModal 
            isOpen={isSettingsOpen} 
            onClose={() => setIsSettingsOpen(false)} 
            session={session} 
          />
        )}
        
        {isCalendarOpen && (
          <CalendarModal 
            isOpen={isCalendarOpen} 
            onClose={() => setIsCalendarOpen(false)} 
            session={session} 
          />
        )}
      </div>
    </Router>
  );
}

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen" style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Loader2 className="animate-spin" size={48} style={{ color: 'var(--accent-color)' }}/>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <SchoolProvider session={session}>
      <AppContent session={session} />
    </SchoolProvider>
  );
}

export default App;
