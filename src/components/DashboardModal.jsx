import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Compass, PieChart, CheckSquare, Printer, Loader2, Target, X, Info } from 'lucide-react';
import './DashboardModal.css';

export default function DashboardModal({ session, isOpen, onClose }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('stats'); // 'stats' or 'tasks'
  const [showInfo, setShowInfo] = useState(false);
  const [showClusterInfo, setShowClusterInfo] = useState(false);
  const [showTasksInfo, setShowTasksInfo] = useState(false);

  useEffect(() => {
    if (isOpen && session?.user?.id) {
      fetchData();
    }
  }, [isOpen, session]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch user stats
      const { data: statsData } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', session.user.id);
      if (statsData) {
        const resetTime = session?.user?.user_metadata?.dashboard_reset_time;
        if (resetTime) {
          const resetDate = new Date(resetTime);
          setStats(statsData.filter(s => new Date(s.created_at) > resetDate));
        } else {
          setStats(statsData);
        }
      }

      // Fetch open tasks
      const { data: tasksData } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('is_completed', false)
        .order('created_at', { ascending: false });
      
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

  if (!isOpen) return null;

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

  // Helper to get a short clean name for the cluster KPI
  const getShortClusterName = (fullName) => {
    if (!fullName) return '-';
    if (fullName.includes('חזון')) return 'חזון';
    if (fullName.includes('הנהגה')) return 'הנהגה';
    if (fullName.includes('הון אנושי')) return 'הון אנושי';
    if (fullName.includes('תהליכים')) return 'תהליכים';
    if (fullName.includes('תוצאות')) return 'תוצאות';
    return fullName.split(' ')[0].replace(',', ''); // fallback for old test data
  };

  return (
    <div className="dashboard-modal-overlay" dir="rtl" onClick={onClose}>
      <div className="dashboard-modal-content" onClick={e => e.stopPropagation()}>
        <div className="dashboard-modal-header" style={{flexDirection: 'column', alignItems: 'center'}}>
          <div className="dashboard-modal-title" style={{ width: '100%', justifyContent: 'center', position: 'relative' }}>
            <Compass className="icon-header" size={28} color="var(--accent-color)" /> 
            <h2 style={{ fontSize: '1.5rem', margin: '0 0.5rem' }}>מצפן התפתחות</h2>
            <button className="close-modal-btn print-hidden" onClick={onClose} style={{ position: 'absolute', right: 0 }}>
              <X size={24} />
            </button>
          </div>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', margin: '0.5rem 0', color: '#64748b' }}>
            מראה ניהולית המשקפת את התפתחות דפוסי החשיבה והתכנון שלך
          </p>
          <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', background: '#f8fafc', padding: '0.2rem 1rem', borderRadius: '20px' }}>
            <span>🔒</span> המידע בעמוד זה הוא פרטי ומשמש ככלי רפלקציה אישי ללא מעקב
          </div>
        </div>

        <div className="dashboard-tabs print-hidden">
          <button 
            className={`dashboard-tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            דפוסי עבודה
          </button>
          <button 
            className={`dashboard-tab ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            הכנה להדרכה
          </button>
        </div>

        <div className="dashboard-modal-body">
          {loading ? (
            <div className="dashboard-loading">
              <Loader2 className="animate-spin" size={48} />
            </div>
          ) : (
            <>
              {activeTab === 'stats' && (
                <div className="dashboard-grid print-hidden" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  
                  {/* Top KPIs Row */}
                  <div className="dashboard-card kpi-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', padding: '1.5rem', background: 'linear-gradient(to right, #ffffff, #f8fafc)', margin: 0 }}>
                    <div className="kpi-item" style={{ textAlign: 'center', borderLeft: '1px solid #e2e8f0', padding: '0 0.5rem', position: 'relative' }}>
                      {showInfo ? (
                        <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.4', textAlign: 'right', paddingRight: '1rem' }}>
                          <button 
                            onClick={() => setShowInfo(false)} 
                            style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                            title="סגור"
                          >
                            <X size={16} />
                          </button>
                          <strong>מה המשמעות?</strong><br/>
                          כשאתה מעלה אתגר או דילמה, המטרה היא לא רק לתת עצה, אלא לצייד בשיטת עבודה והתכוונות מערכתית. המנטור חושף בפניך כלי ניהולי (כמו מודל RADAR, אדרת הדג) ומדריך אותך. כך אתה מתרגל חשיבה ניהולית-אסטרטגית.
                        </div>
                      ) : (
                        <>
                          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#8b5cf6' }}>{stats.length}</div>
                          <div style={{ color: '#64748b', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            כלים שתורגלו
                            <button 
                              onClick={() => setShowInfo(true)} 
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8b5cf6', padding: 0, display: 'flex' }}
                              title="מה זה אומר?"
                            >
                              <Info size={22} strokeWidth={2.5} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="kpi-item" style={{ textAlign: 'center', borderLeft: '1px solid #e2e8f0', padding: '0 0.5rem', position: 'relative' }}>
                      {showClusterInfo ? (
                        <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.4', textAlign: 'right', paddingRight: '1rem' }}>
                          <button 
                            onClick={() => setShowClusterInfo(false)} 
                            style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                            title="סגור"
                          >
                            <X size={16} />
                          </button>
                          <strong>מהו האשכול המוביל?</strong><br/>
                          נתון זה חושף את אזור המיקוד המרכזי שבו פעלת לאחרונה, מתוך 5 האשכולות למצוינות ארגונית. המערכת מזהה לאיזה אשכול שייכים הכלים שתרגלת הכי הרבה פעמים בשיחות שלך, ומציגה אותו כאן. כך תוכל לראות במבט מהיר היכן מושקעת עיקר האנרגיה הניהולית והאסטרטגית שלך בתקופה זו.<br/>
                          נקודה לחשיבה: ניווט מכוון או תגובתי?
                        </div>
                      ) : (
                        <>
                          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#10b981' }}>{sortedClusters.length > 0 ? getShortClusterName(sortedClusters[0][0]) : '-'}</div>
                          <div style={{ color: '#64748b', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            אשכול מוביל
                            <button 
                              onClick={() => setShowClusterInfo(true)} 
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#10b981', padding: 0, display: 'flex' }}
                              title="מה זה אומר?"
                            >
                              <Info size={22} strokeWidth={2.5} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="kpi-item" style={{ textAlign: 'center', padding: '0 0.5rem', position: 'relative' }}>
                      {showTasksInfo ? (
                        <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.4', textAlign: 'right', paddingRight: '1rem' }}>
                          <button 
                            onClick={() => setShowTasksInfo(false)} 
                            style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                            title="סגור"
                          >
                            <X size={16} />
                          </button>
                          <strong>מה המשמעות?</strong><br/>
                          מספר זה מייצג את הדילמות והאתגרים שבחרת לשמור לדיון מעמיק, פנים אל פנים, עם המדריך הבית-ספרי. זהו כלי ניהולי שעוזר לך לאסוף שאלות ממוקדות ולא ללכת לאיבוד בשוטף.<br/>
                          נקודה לחשיבה: האם רשימה זו משקפת את האתגרים הדחופים ביותר שלך כרגע?
                        </div>
                      ) : (
                        <>
                          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#f59e0b' }}>{displayGuidanceTasks.length}</div>
                          <div style={{ color: '#64748b', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            ממתינים להדרכה
                            <button 
                              onClick={() => setShowTasksInfo(true)} 
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f59e0b', padding: 0, display: 'flex' }}
                              title="מה זה אומר?"
                            >
                              <Info size={22} strokeWidth={2.5} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    {/* Section 2: Tool Usage (Moved to Right column, styled Purple) */}
                    <div className="dashboard-card" style={{ margin: 0, borderColor: '#e9d5ff', backgroundColor: '#faf5ff' }}>
                      <h3 style={{ color: '#8b5cf6' }}><Target className="icon-title" style={{ color: '#8b5cf6' }} /> ארגז הכלים בשימוש</h3>
                      <p style={{ fontSize: '0.8rem', color: '#a78bfa', marginBottom: '1rem' }}>כלים ניהוליים שתורגלו</p>
                      
                      {sortedTools.length === 0 ? (
                        <p className="empty-state" style={{ color: '#a78bfa' }}>טרם השתמשת בכלים בצ'אט.</p>
                      ) : (
                        <ul className="stats-list">
                          {sortedTools.map(([tool, count]) => (
                            <li key={tool}>
                              <div className="stat-label" style={{ color: '#8b5cf6' }}>
                                <span>{tool}</span>
                                <span className="stat-count" style={{ color: '#8b5cf6' }}>({count})</span>
                              </div>
                              <div className="progress-bar-bg" style={{ backgroundColor: '#e9d5ff' }}>
                                <div className="progress-bar-fill" style={{ width: `${(count / totalStats) * 100}%`, backgroundColor: '#8b5cf6' }}></div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Section 1: Clusters (Moved to Left column) */}
                    <div className="dashboard-card" style={{ margin: 0 }}>
                      <h3><PieChart className="icon-title" /> התפתחות המיקוד הניהולי</h3>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>התפלגות לפי 5 האשכולות</p>
                      {sortedClusters.length === 0 ? (
                        <p className="empty-state">אין עדיין נתונים על אשכולות.</p>
                      ) : (
                        <ul className="stats-list">
                          {sortedClusters.map(([cluster, count]) => (
                            <li key={cluster}>
                              <div className="stat-label">
                                <span>{cluster}</span>
                                <span className="stat-count">({count})</span>
                              </div>
                              <div className="progress-bar-bg">
                                <div className="progress-bar-fill cluster-fill" style={{ width: `${(count / totalStats) * 100}%` }}></div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {(activeTab === 'tasks' || window.matchMedia("print").matches) && (
                <div className="dashboard-card full-width print-visible" style={{ marginTop: 0 }}>
                  <div className="card-header-flex">
                    <h3><CheckSquare className="icon-title" /> נקודות לדיון בהדרכה</h3>
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
                          <h4>{task.title}</h4>
                          {task.description && <p>{task.description}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
