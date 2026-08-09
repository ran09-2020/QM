import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Auth from './components/Auth';
import TopNav from './components/TopNav';
import PersonalSidebar from './components/PersonalSidebar';
import ChatInterface from './components/ChatInterface';
import { Loader2 } from 'lucide-react';



function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <Router basename="/n-star">
      <div className="app-container app-layout-new">
        <PersonalSidebar session={session} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        
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
      </div>
    </Router>
  );
}

export default App;
