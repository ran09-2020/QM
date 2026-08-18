import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { applySchoolFilter, getSchoolInsertData } from '../utils/supabaseHelpers';
import { useSchool } from '../contexts/SchoolContext';
import { X, Compass, ListTodo, Eye, LogOut, Trash2, Plus, Edit2, ChevronDown, ChevronUp, Brain, Download, FileText, Settings, Calendar, Target, Link as LinkIcon, ExternalLink } from 'lucide-react';

const downloadableFiles = [
  { id: 1, name: 'תבנית אדרת הדג' },
  { id: 2, name: 'טופס ניהול סיכונים' },
  { id: 3, name: 'מטריצת אייזנהאואר - דף עבודה' },
  { id: 4, name: 'מודל RADAR - מחוון' },
  { id: 5, name: '7 השאלות - טופס ראיון' },
  { id: 6, name: 'מטריצה לפריסת חזון (דניאל קים) - טופס ריק', url: '/n-star/vision_matrix_blank.docx' },
  { id: 7, name: 'חזון שקורא לפעולה (4 הזירות) - טופס ריק', url: '/n-star/vision_action_blank.docx' }
];

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
    tools: 'עקומת השינוי, אדרת הדג, 7 השאלות, להפוך קושי לצורך'
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
    tools: 'ניהול תהליכים, ניהול סיכונים, פלסטר למשבר, מעגל למידה מארועים'
  },
  {
    id: 'cluster5',
    title: 'ניהול תוצאות והשפעה',
    desc: 'כלים למיקוד, מדידת תוצאות, תיעדוף משימות לאור יעדים והערכת אפקטיביות.',
    tools: 'מודל RADAR, חשיבה תוצאתית, מטריצת אייזנהאואר, MoSCoW'
  }
];

export default function PersonalSidebar({ isOpen, setIsOpen, session, onOpenDashboard, onOpenSettings, onOpenCalendar }) {
  // Tasks state
  const [tasks, setTasks] = useState([]);
  const [expandedTasks, setExpandedTasks] = useState(new Set());
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: '', description: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskType, setNewTaskType] = useState('task'); // 'task' or 'guidance'
  
  // Links state
  const [links, setLinks] = useState([]);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  // Accordion state
  const [isPracticeMenuOpen, setIsPracticeMenuOpen] = useState(false);
  const [isTasksOpen, setIsTasksOpen] = useState(false);
  const [isLinksOpen, setIsLinksOpen] = useState(false);
  const [isRepoOpen, setIsRepoOpen] = useState(false);
  
  const { role, activeSchool } = useSchool();
  const navigate = useNavigate();

  useEffect(() => {
    if (session?.user?.id) {
      fetchTasks();
      fetchLinks();
    }
  }, [session, role, activeSchool]);

  const fetchTasks = async () => {
    let query = supabase.from('tasks').select('*').eq('user_id', session.user.id);
    query = applySchoolFilter(query, role, activeSchool);
    const { data } = await query.order('created_at', { ascending: true });
    if (data) setTasks(data);
  };

  const fetchLinks = async () => {
    let query = supabase.from('user_links').select('*').eq('user_id', session.user.id);
    query = applySchoolFilter(query, role, activeSchool);
    const { data } = await query.order('created_at', { ascending: true });
    if (data) setLinks(data);
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    let finalTitle = newTaskTitle.trim();
    if (newTaskType === 'guidance') {
      finalTitle = '[הדרכה] ' + finalTitle;
    }
    
    const schoolData = getSchoolInsertData(role, activeSchool);
    const { data } = await supabase
      .from('tasks')
      .insert([{ user_id: session.user.id, title: finalTitle, description: newTaskDesc.trim(), ...schoolData }])
      .select();
      
    if (data) {
      setTasks([...tasks, data[0]]);
      setNewTaskTitle('');
      setNewTaskDesc('');
      setNewTaskType('task');
      setIsAdding(false);
    }
  };

  const saveEditedTask = async (id) => {
    if (!editFormData.title.trim()) return;
    
    setTasks(tasks.map(t => t.id === id ? { ...t, title: editFormData.title.trim(), description: editFormData.description.trim() } : t));
    await supabase.from('tasks').update({ title: editFormData.title.trim(), description: editFormData.description.trim() }).eq('id', id);
    setEditingTaskId(null);
  };

  const toggleAccordion = (id) => {
    const newSet = new Set(expandedTasks);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedTasks(newSet);
  };

  const toggleTask = async (id, currentStatus) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, is_completed: !currentStatus } : t));
    await supabase.from('tasks').update({ is_completed: !currentStatus }).eq('id', id);
  };

  const deleteTask = async (id) => {
    setTasks(tasks.filter(t => t.id !== id));
    await supabase.from('tasks').delete().eq('id', id);
  };

  const addLink = async (e) => {
    e.preventDefault();
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) return;
    
    let formattedUrl = newLinkUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }
    
    const schoolData = getSchoolInsertData(role, activeSchool);
    const { data, error } = await supabase
      .from('user_links')
      .insert([{ user_id: session.user.id, title: newLinkTitle.trim(), url: formattedUrl, ...schoolData }])
      .select();
      
    if (error) {
      console.error('Error adding link:', error);
      alert('שגיאה בהוספת הקישור. ודא שיצרת את טבלת user_links ב-Supabase.');
      return;
    }

    if (data) {
      setLinks([...links, data[0]]);
      setNewLinkTitle('');
      setNewLinkUrl('');
      setIsAddingLink(false);
    }
  };

  const deleteLink = async (id) => {
    setLinks(links.filter(l => l.id !== id));
    await supabase.from('user_links').delete().eq('id', id);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleClusterSelect = (cluster) => {
    setIsPracticeMenuOpen(false);
    setIsOpen(false);
    navigate('/simulation', { state: { cluster } });
  };

  const email = session?.user?.email || '';
  const metadata = session?.user?.user_metadata || {};
  const name = metadata.full_name || email.split('@')[0] || 'משתמש';
  
  const userGender = metadata.user_gender || 'male';
  const mentorGender = metadata.mentor_gender || 'male';
  
  const mentorTitle = mentorGender === 'female' ? 'המנטורית האישית שלך' : 'המנטור האישי שלך';
  const logoutText = userGender === 'female' ? 'התנתקי' : 'התנתק';

  // Make the spacing between items very small to save space
  const sectionStyle = { borderBottom: 'none', paddingBottom: '0.15rem' };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>}
      
      <div className={`personal-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo-section">
          <h2>מצפן</h2>
          <Compass size={28} color="var(--accent-color)" />
          <button className="mobile-close-btn" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="profile-section">
          <div className="profile-info">
            <span className="profile-role" style={{fontSize: '1rem', color: '#64748b', fontWeight: '500'}}>{mentorTitle}</span>
            <div style={{height: '1rem'}}></div>
            <h3>{name}</h3>
            <span className="profile-email">{email}</span>
          </div>
        </div>



        <div className="sidebar-content">
          
          {/* 1. Practice (Tirgul) Accordion */}
          <div className="sidebar-section" style={sectionStyle}>
            <div className="section-header" style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }} onClick={() => setIsPracticeMenuOpen(!isPracticeMenuOpen)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Brain size={18} color="#8b5cf6" />
                <h4>תירגול</h4>
              </div>
              <button className="accordion-toggle" style={{ background: 'transparent', border: 'none', color: '#64748b' }}>
                {isPracticeMenuOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
            {isPracticeMenuOpen && (
              <div style={{ padding: '0.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {clusters.map((cluster) => (
                  <div 
                    key={cluster.id}
                    onClick={() => handleClusterSelect(cluster)}
                    style={{
                      padding: '0.4rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{ fontWeight: '600', color: '#8b5cf6', fontSize: '0.9rem' }}>
                      {cluster.title}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Dashboard Menu Item */}
          <div className="sidebar-section" style={sectionStyle}>
            <div 
              className="section-header" 
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }} 
              onClick={() => {
                if (onOpenDashboard) onOpenDashboard();
                setIsOpen(false);
              }}
            >
              <Compass size={18} color="#10b981" />
              <h4>מצפן התפתחות</h4>
            </div>
          </div>

          {/* 3. Chat Summaries (Calendar) Menu Item */}
          <div className="sidebar-section" style={sectionStyle}>
            <div 
              className="section-header" 
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }} 
              onClick={() => {
                if (onOpenCalendar) onOpenCalendar();
                setIsOpen(false);
              }}
            >
              <Calendar size={18} color="#3b82f6" />
              <h4>סיכום שיחות</h4>
            </div>
          </div>

          {/* 4. Tasks Accordion */}
          <div className="sidebar-section" style={sectionStyle}>
            <div className="section-header" style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }} onClick={() => setIsTasksOpen(!isTasksOpen)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ListTodo size={18} color="#f59e0b" />
                <h4>משימות</h4>
              </div>
              <button className="accordion-toggle" style={{ background: 'transparent', border: 'none', color: '#64748b' }}>
                {isTasksOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
            {isTasksOpen && (
              <>
                <div className="add-task-section" style={{ marginBottom: '10px', marginTop: '5px' }}>
                  {!isAdding ? (
                    <button className="add-task-trigger" onClick={() => setIsAdding(true)}>
                      <Plus size={16} /> <span>הוסף משימה חדשה</span>
                    </button>
                  ) : (
                    <form onSubmit={addTask} className="add-task-form">
                      <input 
                        type="text" 
                        placeholder="כותרת המשימה..." 
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        autoFocus
                      />
                      <textarea 
                        placeholder="פירוט (אופציונלי)..." 
                        value={newTaskDesc}
                        onChange={(e) => setNewTaskDesc(e.target.value)}
                        rows={2}
                      />
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
                          <input 
                            type="radio" 
                            name="taskType" 
                            value="task" 
                            checked={newTaskType === 'task'} 
                            onChange={() => setNewTaskType('task')} 
                          />
                          משימה אופרטיבית
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
                          <input 
                            type="radio" 
                            name="taskType" 
                            value="guidance" 
                            checked={newTaskType === 'guidance'} 
                            onChange={() => setNewTaskType('guidance')} 
                          />
                          לדיון בהדרכה
                        </label>
                      </div>
                      <div className="form-actions">
                        <button type="submit" disabled={!newTaskTitle.trim()} className="save-btn">שמור</button>
                        <button type="button" onClick={() => setIsAdding(false)} className="cancel-btn">ביטול</button>
                      </div>
                    </form>
                  )}
                </div>
                
                <div className="tasks-list">
                  {tasks.length === 0 ? (
                    <p className="placeholder-text" style={{fontSize:'0.9rem', color:'#888'}}>אין משימות כרגע.</p>
                  ) : (
                    tasks.map(task => {
                      const isExpanded = expandedTasks.has(task.id);
                      const isEditing = editingTaskId === task.id;
                      
                      return (
                      <div key={task.id} className="task-item-container">
                        {isEditing ? (
                          <div className="task-edit-form">
                            <input 
                              type="text" 
                              value={editFormData.title} 
                              onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                              placeholder="כותרת..."
                            />
                            <textarea 
                              value={editFormData.description} 
                              onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                              placeholder="פירוט..."
                              rows={2}
                            />
                            <div className="task-edit-actions">
                              <button className="save-btn" onClick={() => saveEditedTask(task.id)}>שמור</button>
                              <button className="cancel-btn" onClick={() => setEditingTaskId(null)}>ביטול</button>
                            </div>
                          </div>
                        ) : (
                            <div className="task-view-mode">
                              <div className="task-header" style={{ display: 'flex', alignItems: 'flex-start', width: '100%', gap: '0.5rem' }}>
                                {/* Checkbox Only */}
                                <label className={`task-checkbox-label ${task.is_completed ? 'completed' : ''}`} style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', margin: 0, flexShrink: 0, width: 'auto' }}>
                                  <input 
                                    type="checkbox" 
                                    checked={task.is_completed} 
                                    onChange={() => toggleTask(task.id, task.is_completed)} 
                                    style={{ margin: '4px 0 0 0', flexShrink: 0, cursor: 'pointer' }}
                                  />
                                </label>
                                
                                {/* Clickable Title & Date */}
                                <div onClick={() => toggleAccordion(task.id)} style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, cursor: 'pointer', paddingTop: '2px' }}>
                                  <span 
                                    className="task-title" 
                                    style={{ 
                                      fontSize: '1rem', 
                                      fontWeight: 500, 
                                      color: '#334155', 
                                      textAlign: 'right', 
                                      display: 'block',
                                      whiteSpace: isExpanded ? 'normal' : 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: isExpanded ? 'clip' : 'ellipsis',
                                      wordBreak: 'break-word',
                                      textDecoration: task.is_completed ? 'line-through' : 'none',
                                      opacity: task.is_completed ? 0.5 : 1
                                    }}
                                  >
                                    {task.title}
                                  </span>
                                  {task.created_at && (
                                    <span className="task-date" style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '400', marginTop: '2px', textAlign: 'right', display: 'block' }}>
                                      {new Date(task.created_at).toLocaleDateString('he-IL')}
                                    </span>
                                  )}
                                </div>
                                
                                {/* Actions & Chevron */}
                                <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, gap: '0.2rem', paddingTop: '2px' }}>
                                  <div className="task-actions">
                                    <button className="task-action-btn edit" onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingTaskId(task.id);
                                      setEditFormData({ title: task.title, description: task.description || '' });
                                      setExpandedTasks(prev => new Set(prev).add(task.id));
                                    }} title="ערוך משימה"><Edit2 size={14} /></button>
                                    <button className="task-action-btn delete" onClick={(e) => { 
                                      e.stopPropagation(); 
                                      deleteTask(task.id); 
                                    }} title="מחק משימה">
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                  
                                  <button className="accordion-toggle" onClick={() => toggleAccordion(task.id)} style={{ background: 'none', border: 'none', padding: '2px', color: '#94a3b8', cursor: 'pointer' }}>
                                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                  </button>
                                </div>
                              </div>
                            
                            {isExpanded && task.description && (
                              <div className="task-body">
                                <p>{task.description}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )})
                  )}
                </div>
              </>
            )}
          </div>

          {/* 5. Links Accordion */}
          <div className="sidebar-section" style={sectionStyle}>
            <div className="section-header" style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }} onClick={() => setIsLinksOpen(!isLinksOpen)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LinkIcon size={18} color="#06b6d4" />
                <h4>קישורים חשובים</h4>
              </div>
              <button className="accordion-toggle" style={{ background: 'transparent', border: 'none', color: '#64748b' }}>
                {isLinksOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
            {isLinksOpen && (
              <>
                <div className="add-task-section" style={{ marginBottom: '10px', marginTop: '5px' }}>
                  {!isAddingLink ? (
                    <button className="add-task-trigger" onClick={() => setIsAddingLink(true)}>
                      <Plus size={16} /> <span>הוסף קישור חדש</span>
                    </button>
                  ) : (
                    <form onSubmit={addLink} className="add-task-form">
                      <input 
                        type="text" 
                        placeholder="שם האתר..." 
                        value={newLinkTitle}
                        onChange={(e) => setNewLinkTitle(e.target.value)}
                        autoFocus
                      />
                      <input 
                        type="text" 
                        placeholder="www.example.com" 
                        value={newLinkUrl}
                        onChange={(e) => setNewLinkUrl(e.target.value)}
                        dir="ltr"
                      />
                      <div className="form-actions">
                        <button type="submit" disabled={!newLinkTitle.trim() || !newLinkUrl.trim()} className="save-btn">שמור</button>
                        <button type="button" onClick={() => setIsAddingLink(false)} className="cancel-btn">ביטול</button>
                      </div>
                    </form>
                  )}
                </div>
                
                <div className="tasks-list">
                  {links.length === 0 ? (
                    <p className="placeholder-text" style={{fontSize:'0.9rem', color:'#888'}}>אין קישורים כרגע.</p>
                  ) : (
                    links.map(link => (
                      <div key={link.id} className="task-item-container" style={{ padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: '6px', marginBottom: '6px' }}>
                        <a 
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: '0.9rem', color: '#0ea5e9', fontWeight: '500', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                        >
                          <ExternalLink size={14} /> {link.title}
                        </a>
                        <button 
                          className="task-action-btn delete" 
                          onClick={() => deleteLink(link.id)} 
                          title="מחק קישור"
                          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          {/* 6. Documents Repo Accordion */}
          <div className="sidebar-section" style={sectionStyle}>
            <div className="section-header" style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }} onClick={() => setIsRepoOpen(!isRepoOpen)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={18} color="#ef4444" />
                <h4>מאגר מסמכים להורדה</h4>
              </div>
              <button className="accordion-toggle" style={{ background: 'transparent', border: 'none', color: '#64748b' }}>
                {isRepoOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
            {isRepoOpen && (
              <div className="tasks-list">
                {downloadableFiles.map(file => (
                  <div key={file.id} className="task-item-container" style={{ padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: '6px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.9rem', color: '#334155', fontWeight: '500' }}>{file.name}</span>
                    {file.url ? (
                      <a 
                        href={file.url}
                        download
                        target="_blank"
                        rel="noreferrer"
                        style={{ background: '#e0e7ff', border: 'none', color: '#4f46e5', cursor: 'pointer', padding: '6px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title="הורד קובץ"
                      >
                        <Download size={16} />
                      </a>
                    ) : (
                      <button 
                        onClick={() => alert("הקובץ יעלה בקרוב ויחובר ל-Storage!")} 
                        style={{ background: '#e0e7ff', border: 'none', color: '#4f46e5', cursor: 'pointer', padding: '6px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title="הורד קובץ"
                      >
                        <Download size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 7. Settings Menu Item */}
          <div className="sidebar-section" style={sectionStyle}>
            <div 
              className="section-header" 
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }} 
              onClick={() => {
                if (onOpenSettings) onOpenSettings();
                setIsOpen(false);
              }}
            >
              <Settings size={18} color="#64748b" />
              <h4>הגדרות</h4>
            </div>
          </div>

        </div>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} color="#64748b" />
            {logoutText}
          </button>
        </div>
      </div>
    </>
  );
}
