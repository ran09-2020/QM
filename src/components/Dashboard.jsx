import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { applySchoolFilter } from '../utils/supabaseHelpers';
import { useSchool } from '../contexts/SchoolContext';
import { BarChart3, PieChart, CheckSquare, Printer, Loader2, Target, ArrowRight } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard({ session }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [tasks, setTasks] = useState([]);

  const { role, activeSchool } = useSchool();

  useEffect(() => {
    if (session?.user?.id) {
      fetchData();
    }
  }, [session, role, activeSchool]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch user stats
      let statsQuery = supabase.from('user_stats').select('*').eq('user_id', session.user.id);
      statsQuery = applySchoolFilter(statsQuery, role, activeSchool);
      const { data: statsData, error: statsError } = await statsQuery;
      
      if (statsData) setStats(statsData);

      // Fetch open tasks
      let tasksQuery = supabase.from('tasks').select('*').eq('user_id', session.user.id).eq('is_completed', false);
      tasksQuery = applySchoolFilter(tasksQuery, role, activeSchool);
      const { data: tasksData, error: tasksError } = await tasksQuery.order('created_at', { ascending: false });
      
      if (tasksData) setTasks(tasksData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculate tool usage distribution
  const toolUsage = stats.reduce((acc, stat) => {
    if (stat.tool_name) {
      acc[stat.tool_name] = (acc[stat.tool_name] || 0) + 1;
    }
    return acc;
  }, {});

  const sortedTools = Object.entries(toolUsage).sort((a, b) => b[1] - a[1]);

  // Calculate cluster usage distribution
  const clusterUsage = stats.reduce((acc, stat) => {
    if (stat.cluster_name) {
      acc[stat.cluster_name] = (acc[stat.cluster_name] || 0) + 1;
    }
    return acc;
  }, {});

  const sortedClusters = Object.entries(clusterUsage).sort((a, b) => b[1] - a[1]);
  const totalStats = stats.length || 1; // Prevent division by zero

  // Separate tasks for guidance and others
  const guidanceTasks = tasks.filter(t => t.title.startsWith('[הדרכה]'));
  
  // Clean task titles for display
  const displayGuidanceTasks = guidanceTasks.map(t => ({
    ...t,
    title: t.title.replace('[הדרכה] ', '')
  }));

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="dashboard-container" dir="rtl">
      <div className="dashboard-header" style={{ position: 'relative' }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: '500' }}
          className="print-hidden"
        >
          <ArrowRight size={20} /> חזור לשיחה
        </button>
        <h1><Compass className="icon-header" /> מצפן התפתחות</h1>
        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
          מראה ניהולית המשקפת את התפתחות דפוסי החשיבה והתכנון שלך
        </p>
        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
          <span>🔒</span> המידע בעמוד זה הוא פרטי ומשמש ככלי רפלקציה אישי ללא מעקב
        </div>
      </div>

      <div className="dashboard-grid">
        
        {/* Top KPIs Row */}
        <div className="dashboard-card kpi-card" style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', padding: '1.5rem', background: 'linear-gradient(to right, #ffffff, #f8fafc)' }}>
          <div className="kpi-item" style={{ textAlign: 'center', borderLeft: '1px solid #e2e8f0', padding: '0 1rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6' }}>{totalStats}</div>
            <div style={{ color: '#64748b', fontSize: '0.9rem' }}>אירועים שתועדו</div>
          </div>
          <div className="kpi-item" style={{ textAlign: 'center', borderLeft: '1px solid #e2e8f0', padding: '0 1rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{sortedClusters.length > 0 ? sortedClusters[0][0] : '-'}</div>
            <div style={{ color: '#64748b', fontSize: '0.9rem' }}>אשכול מוביל</div>
          </div>
          <div className="kpi-item" style={{ textAlign: 'center', borderLeft: '1px solid #e2e8f0', padding: '0 1rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>{displayGuidanceTasks.length}</div>
            <div style={{ color: '#64748b', fontSize: '0.9rem' }}>נושאים ממתינים להדרכה</div>
          </div>
          <div className="kpi-item" style={{ textAlign: 'center', padding: '0 1rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
              {totalStats > 0 ? Math.round(((clusterUsage['חזון, ייחודיות וערך'] || 0) + (clusterUsage['הנהגה ותרבות מצמיחה'] || 0)) / totalStats * 100) : 0}%
            </div>
            <div style={{ color: '#64748b', fontSize: '0.9rem' }}>מיקוד אסטרטגי</div>
          </div>
        </div>

        {/* Section 1: Clusters (Focus) */}
        <div className="dashboard-card print-hidden">
          <h2><PieChart className="icon-title" /> התפתחות המיקוד הניהולי</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>התפלגות הפניות שלך לפי 5 האשכולות</p>
          {sortedClusters.length === 0 ? (
            <p className="empty-state">אין עדיין נתונים על אשכולות.</p>
          ) : (
            <ul className="stats-list">
              {sortedClusters.map(([cluster, count]) => (
                <li key={cluster}>
                  <div className="stat-label">
                    <span>{cluster}</span>
                    <span className="stat-count">{count} מקרים</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill cluster-fill" style={{ width: `${(count / totalStats) * 100}%` }}></div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Section 2: Tool Usage */}
        <div className="dashboard-card print-hidden">
          <h2><Target className="icon-title" /> ארגז הכלים האסטרטגיים בשימוש</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>אילו כלים ניהוליים מתורגלים הכי הרבה</p>
          {sortedTools.length === 0 ? (
            <p className="empty-state">טרם השתמשת בכלים בצ'אט.</p>
          ) : (
            <ul className="stats-list">
              {sortedTools.map(([tool, count]) => (
                <li key={tool}>
                  <div className="stat-label">
                    <span>{tool}</span>
                    <span className="stat-count">{count} פעמים</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${(count / totalStats) * 100}%` }}></div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Section 3: Handoff Hub (Guidance Tasks only) */}
        <div className="dashboard-card full-width print-visible">
          <div className="card-header-flex">
            <h2><CheckSquare className="icon-title" /> נקודות לדיון בהדרכה</h2>
            <button className="print-button print-hidden" onClick={handlePrint}>
              <Printer size={18} /> הדפס לפגישה
            </button>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>
            אלו הדילמות והנושאים שסימנת במיוחד מתוך האפליקציה כדי לדון בהם פנים אל פנים מול המדריך הבית-ספרי.
          </p>
          {displayGuidanceTasks.length === 0 ? (
            <p className="empty-state">אין כרגע נושאים הממתינים להדרכה. סמן דילמות בסרגל המשימות כ"לדיון בהדרכה".</p>
          ) : (
            <div className="handoff-tasks">
              {displayGuidanceTasks.map(task => (
                <div key={task.id} className="handoff-task-item">
                  <h3>{task.title}</h3>
                  {task.description && <p>{task.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
