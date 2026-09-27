import React, { useState, useEffect, useRef } from 'react';
import VisionDemo from './components/VisionDemo';
import VisionDemoReverse from './components/VisionDemoReverse';
import VisionDemoDialogue from './components/VisionDemoDialogue';
import VisionDemoSandbox from './components/VisionDemoSandbox';
import VisionDemoDiagnostic from './components/VisionDemoDiagnostic';
import VisionDemoHub from './components/VisionDemoHub';
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


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: 'red', direction: 'ltr', background: 'white', zIndex: 9999, position: 'relative' }}>
          <h2>Something went wrong.</h2>
          <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '1.2rem', fontWeight: 'bold' }}>{this.state.error && this.state.error.toString()}</div>
          <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent({ session }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const isResizing = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing.current) return;
      const deltaX = e.clientX - startX.current;
      const newWidth = startWidth.current - deltaX;
      if (newWidth > 150 && newWidth < 800) {
        setSidebarWidth(newWidth);
      }
    };
    const handleMouseUp = () => {
      if (isResizing.current) {
        isResizing.current = false;
        document.body.style.cursor = 'default';
        document.body.classList.remove('resizing');
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleMouseDown = (e) => {
    isResizing.current = true;
    startX.current = e.clientX;
    startWidth.current = sidebarWidth;
    document.body.style.cursor = 'col-resize';
    document.body.classList.add('resizing');
    e.preventDefault();
  };

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
        borderTop: `4px solid ${activeSchool?.theme_color || '#4F46E5'}`,
        '--right-sidebar-width': `${sidebarWidth}px`
      } 
    : { backgroundColor: '#fafafa', '--right-sidebar-width': `${sidebarWidth}px` };

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
        <div 
          className="sidebar-resizer" 
          onMouseDown={handleMouseDown}
          title="גרור לשינוי גודל"
        >
          <div className="resizer-handle"></div>
        </div>
        
        <main className="main-content-area">
          <TopNav session={session} setIsSidebarOpen={setIsSidebarOpen} />
          <div className="page-wrapper">
            <Routes>
              <Route path="/" element={<ErrorBoundary><ChatInterface session={session} isSimulationMode={false} /></ErrorBoundary>} />
              <Route path="/vision-demo" element={<ErrorBoundary><VisionDemoHub /></ErrorBoundary>} />
              <Route path="/vision-demo-linear" element={<ErrorBoundary><VisionDemo /></ErrorBoundary>} />
              <Route path="/vision-demo-reverse" element={<ErrorBoundary><VisionDemoReverse /></ErrorBoundary>} />
              <Route path="/vision-demo-dialogue" element={<ErrorBoundary><VisionDemoDialogue /></ErrorBoundary>} />
              <Route path="/vision-demo-sandbox" element={<ErrorBoundary><VisionDemoSandbox /></ErrorBoundary>} />
              <Route path="/vision-demo-diagnostic" element={<ErrorBoundary><VisionDemoDiagnostic /></ErrorBoundary>} />
              <Route path="/simulation" element={<ErrorBoundary><ChatInterface session={session} isSimulationMode={true} /></ErrorBoundary>} />
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
