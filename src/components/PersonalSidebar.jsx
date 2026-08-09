import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { X, Compass, ListTodo, Eye, LogOut, Trash2, Plus, Edit2, ChevronDown, ChevronUp, Brain, Download, FileText } from 'lucide-react';

const downloadableFiles = [
  { id: 1, name: 'תבנית אדרת הדג' },
  { id: 2, name: 'טופס ניהול סיכונים' },
  { id: 3, name: 'מטריצת אייזנהאואר - דף עבודה' },
  { id: 4, name: 'מודל RADAR - מחוון' },
  { id: 5, name: '7 השאלות - טופס ראיון' },
  { id: 6, name: 'מטריצה לפריסת חזון (דניאל קים) - טופס ריק', url: '/n-star/vision_matrix_blank.docx' },
  { id: 7, name: 'חזון שקורא לפעולה (4 הזירות) - טופס ריק', url: '/n-star/vision_action_blank.docx' }
];

export default function PersonalSidebar({ session, isOpen, setIsOpen }) {
  const [tasks, setTasks] = useState([]);
  const [expandedTasks, setExpandedTasks] = useState(new Set());
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: '', description: '' });
  
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [isRepoOpen, setIsRepoOpen] = useState(false);
  const [isTasksOpen, setIsTasksOpen] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      fetchTasks();
    }
  }, [session]);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: true });
    
    if (data) setTasks(data);
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ user_id: session.user.id, title: newTaskTitle.trim(), description: newTaskDesc.trim() }])
      .select();
      
    if (data) {
      setTasks([...tasks, data[0]]);
      setNewTaskTitle('');
      setNewTaskDesc('');
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
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const email = session?.user?.email || '';
  const metadata = session?.user?.user_metadata || {};
  const name = metadata.full_name || email.split('@')[0] || 'משתמש';
  
  const userGender = metadata.user_gender || 'male';
  const mentorGender = metadata.mentor_gender || 'male';
  
  const mentorTitle = mentorGender === 'female' ? 'המנטורית האישית שלך' : 'המנטור האישי שלך';
  const logoutText = userGender === 'female' ? 'התנתקי' : 'התנתק';

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
          <div className="sidebar-section">
            <div className="section-header" style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }} onClick={() => setIsTasksOpen(!isTasksOpen)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ListTodo size={18} />
                <h4>משימות</h4>
              </div>
              <button className="accordion-toggle" style={{ background: 'transparent', border: 'none', color: '#64748b' }}>
                {isTasksOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
            {isTasksOpen && (
              <>
                <div className="add-task-section" style={{ marginBottom: '15px' }}>
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
                        <div className="task-header">
                          <div className="task-header-left">
                            <button className="accordion-toggle" onClick={() => toggleAccordion(task.id)}>
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            <label className={`task-checkbox-label ${task.is_completed ? 'completed' : ''}`}>
                              <input 
                                type="checkbox" 
                                checked={task.is_completed} 
                                onChange={() => toggleTask(task.id, task.is_completed)} 
                              />
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span className="task-title">{task.title}</span>
                                {task.created_at && (
                                  <span className="task-date" style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '400', marginTop: '2px' }}>
                                    {new Date(task.created_at).toLocaleDateString('he-IL')}
                                  </span>
                                )}
                              </div>
                            </label>
                          </div>
                          
                          <div className="task-actions">
                            <button className="task-action-btn edit" onClick={() => {
                              setEditingTaskId(task.id);
                              setEditFormData({ title: task.title, description: task.description || '' });
                              setExpandedTasks(prev => new Set(prev).add(task.id));
                            }} title="ערוך משימה"><Edit2 size={14} /></button>
                            <button className="task-action-btn delete" onClick={() => deleteTask(task.id)} title="מחק משימה">
                              <Trash2 size={14} />
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

          <div className="sidebar-section">
            <div className="section-header" style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }} onClick={() => setIsRepoOpen(!isRepoOpen)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={18} />
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
        </div>



        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} />
            <span>{logoutText}</span>
          </button>
        </div>
      </div>
    </>
  );
}
