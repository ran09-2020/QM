import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Target, History, MessageCircle, CheckSquare, Activity, GraduationCap } from 'lucide-react';

export default function VisionDemoHub() {
  const navigate = useNavigate();
  const location = useLocation();
  const cluster = location.state?.cluster;

  const courses = [
    {
      title: 'התהליך הליניארי',
      path: '/vision-demo-linear',
      icon: <Target size={24} color="#4f46e5" />,
      description: 'מקרה בוחן: איך תיכון אביב הפך חזון לתכנית עבודה מפורטת.',
      bgColor: '#e0e7ff',
      borderColor: '#c7d2fe'
    },
    {
      title: 'מבט לאחור',
      path: '/vision-demo-reverse',
      icon: <History size={24} color="#059669" />,
      description: 'הנדסה לאחור (Reverse Engineering) מתוך פרויקטים קיימים.',
      bgColor: '#d1fae5',
      borderColor: '#a7f3d0'
    },
    {
      title: 'הדגמת דיאלוג',
      path: '/vision-demo-dialogue',
      icon: <MessageCircle size={24} color="#d97706" />,
      description: 'סימולציית דיאלוג להבנת החסמים וההזדמנויות של המנהל.',
      bgColor: '#fef3c7',
      borderColor: '#fde68a'
    },
    {
      title: 'תירגול מושגים 1',
      path: '/vision-demo-sandbox',
      icon: <CheckSquare size={24} color="#0284c7" />,
      description: 'ארגז חול מבוסס גרירה לזיהוי מדויק של חזון, יעד, ומנגנון.',
      bgColor: '#e0f2fe',
      borderColor: '#bae6fd'
    },
    {
      title: 'תירגול מושגים 2',
      path: '/vision-demo-diagnostic',
      icon: <Activity size={24} color="#db2777" />,
      description: 'אבחון דיאגנוסטי של הפערים בין המצוי לרצוי.',
      bgColor: '#fce7f3',
      borderColor: '#fbcfe8'
    }
  ];

  return (
    <div className="hub-container" style={{ height: '100vh', overflowY: 'auto', display: 'flex', justifyContent: 'center', backgroundColor: '#f8fafc', direction: 'rtl', fontFamily: "'Assistant', sans-serif" }}>
      <style>{`
        .hub-container {
          padding: 2rem;
          box-sizing: border-box;
        }
        .hub-inner {
          width: 100%;
          max-width: 900px;
          padding-bottom: 6rem;
          box-sizing: border-box;
        }
        .hub-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 3rem;
          gap: 1rem;
        }
        .hub-title-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        @media (max-width: 768px) {
          .hub-container {
            padding: 1rem;
          }
          .hub-inner {
            padding-bottom: 8rem;
          }
          .hub-header {
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 2rem;
          }
          .hub-title-section {
            width: 100%;
          }
        }
      `}</style>
      <div className="hub-inner">
        
        {/* Header */}
        <div className="hub-header">
          <div className="hub-title-section">
            <div style={{ backgroundColor: '#4f46e5', padding: '0.75rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <GraduationCap size={36} color="white" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 'bold', color: '#1e293b', lineHeight: '1.2' }}>
                מיני קורס: חזון שקורא לפעולה
              </h1>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '1rem', color: '#64748b' }}>
                בחרו את מודול התירגול הרצוי כדי להתחיל
              </p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/simulation', { state: { cluster } })}
            style={{ 
              backgroundColor: 'white', 
              border: '1px solid #cbd5e1', 
              color: '#334155', 
              padding: '0.5rem 1rem', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontSize: '1rem',
              fontWeight: '600',
              fontFamily: "'Assistant', sans-serif",
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'background-color 0.2s',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              flexShrink: 0
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            חזרה למרחב התירגול
          </button>
        </div>

        {/* Course Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {courses.map((course, idx) => (
            <div 
              key={idx}
              onClick={() => navigate(course.path)}
              style={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                boxSizing: 'border-box'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)';
              }}
            >
              <div style={{
                backgroundColor: course.bgColor,
                border: `1px solid ${course.borderColor}`,
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                {course.icon}
              </div>
              <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.15rem', fontWeight: '600', color: '#1e293b' }}>
                {course.title}
              </h2>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5' }}>
                {course.description}
              </p>
              
              <div style={{ marginTop: 'auto', paddingTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4f46e5', fontWeight: '500', fontSize: '0.9rem' }}>
                התחל תירגול
                <ArrowLeft size={16} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
