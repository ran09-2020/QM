import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, Settings, Calendar, Save, LayoutDashboard, Brain, Menu, ChevronDown } from 'lucide-react';
import SettingsModal from './SettingsModal';
import CalendarModal from './CalendarModal';

const clusters = [
  {
    id: 'cluster1',
    title: 'חזון, ייחודיות וערך',
    desc: 'כלים אסטרטגיים העוסקים בכיוון ארוך טווח וזהות המוסד.',
    tools: 'שלושת האופקים, מטריצה לפריסת חזון, חזון שקורא לפעולה'
  },
  {
    id: 'cluster2',
    title: 'הנהגה ותרבות מצמיחה',
    desc: 'כלים העוסקים בהובלת שינויים, ניהול קונפליקטים, קבלת החלטות ופיתוח תרבות.',
    tools: 'עקומת השינוי, אדרת הדג, 7 השאלות, תסריט שיחה: מקושי לצורך'
  },
  {
    id: 'cluster3',
    title: 'הון אנושי ושותפויות',
    desc: 'כלים לניהול מערכות יחסים ובעלי עניין מחוץ ובתוך הארגון.',
    tools: 'ניהול שותפויות, מיפוי בעלי עניין'
  },
  {
    id: 'cluster4',
    title: 'ניהול תהליכים',
    desc: 'כלים לניהול עבודה סדורה, התמודדות עם משברים ולמידה מאירועים.',
    tools: 'ניהול תהליכים, ניהול סיכונים, פלסטר למשבר, מטריצת פעולה למידתית'
  },
  {
    id: 'cluster5',
    title: 'ניהול תוצאות והשפעה',
    desc: 'כלים למיקוד, מדידת תוצאות, תיעדוף משימות לאור יעדים והערכת אפקטיביות.',
    tools: 'מודל RADAR, חשיבה תוצאתית, מטריצת אייזנהאואר, MoSCoW'
  }
];

export default function TopNav({ session, setIsSidebarOpen }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isPracticeMenuOpen, setIsPracticeMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const mentorGender = session?.user?.user_metadata?.mentor_gender || 'male';
  const mentorTitle = mentorGender === 'female' ? 'המנטורית האישית שלך' : 'המנטור האישי שלך';

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsPracticeMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClusterSelect = (cluster) => {
    setIsPracticeMenuOpen(false);
    navigate('/simulation', { state: { cluster } });
  };

  const handleNewChatClick = () => {
    if (location.pathname === '/simulation') {
      const wantsToExit = window.confirm("אזהרה: מעבר לשיחה חדשה ימחק את התירגול הנוכחי. האם לצאת ללא שמירה? (לחץ ביטול כדי לחזור ולשמור)");
      if (!wantsToExit) return;
      
      sessionStorage.removeItem('sim_cluster_title');
      sessionStorage.removeItem('sim_messages');
      sessionStorage.removeItem('gemini_simulationHistory');
    }
    
    sessionStorage.removeItem('reg_messages');
    sessionStorage.removeItem('gemini_chatHistory');
    
    window.dispatchEvent(new CustomEvent('force_reset_chat'));
    navigate('/');
  };

  return (
    <>
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

        <div className="nav-group-container">
          <div className="nav-group">
            <button className={`top-nav-item ${location.pathname === '/' ? 'active' : ''}`} onClick={handleNewChatClick}>
              <MessageSquare size={22} />
              <span className="nav-text">שיחה חדשה</span>
            </button>
            <button className="top-nav-item" onClick={() => setIsSettingsOpen(true)}>
              <Settings size={22} />
              <span className="nav-text">הגדרות</span>
            </button>
            <button className="top-nav-item"><Save size={22} /><span className="nav-text">שמור ליומן</span></button>
            <button className="top-nav-item" onClick={() => setIsCalendarOpen(true)}>
              <Calendar size={22} />
              <span className="nav-text">יומן</span>
            </button>
          </div>
          <div className="nav-group secondary">
            <button className="top-nav-item"><LayoutDashboard size={22} /><span className="nav-text">לוח בקרה</span></button>
            
            <div className="practice-menu-container" ref={menuRef} style={{ position: 'relative' }}>
              <button 
                className={`top-nav-item practice ${isPracticeMenuOpen ? 'active' : ''}`}
                onClick={() => setIsPracticeMenuOpen(!isPracticeMenuOpen)}
                style={{ color: '#8b5cf6', borderColor: isPracticeMenuOpen ? '#8b5cf6' : 'transparent', backgroundColor: isPracticeMenuOpen ? '#f3e8ff' : 'transparent' }}
              >
                <Brain size={22} />
                <span className="nav-text" style={{ fontWeight: '600' }}>תירגול</span>
                <ChevronDown size={16} />
              </button>

              {isPracticeMenuOpen && (
                <div className="practice-dropdown" style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '0.5rem',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e2e8f0',
                  width: '320px',
                  zIndex: 50,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ padding: '0.75rem 1rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontWeight: '600', color: '#334155' }}>
                    בחר נושא לתרגול:
                  </div>
                  <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                    {clusters.map((cluster) => (
                      <div 
                        key={cluster.id}
                        onClick={() => handleClusterSelect(cluster)}
                        style={{
                          padding: '0.75rem 1rem',
                          borderBottom: '1px solid #f1f5f9',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div style={{ fontWeight: '600', color: '#8b5cf6', marginBottom: '0.25rem', fontSize: '0.95rem' }}>
                          {cluster.title}
                        </div>
                        <div style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: '1.4' }}>
                          {cluster.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
      
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
    </>
  );
}
