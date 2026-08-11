import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { X, Trash2, PlayCircle, MessageSquare, FlaskConical, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

export default function CalendarModal({ session, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('chats');
  const [simulations, setSimulations] = useState([]);
  const [expandedSimulations, setExpandedSimulations] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && session?.user?.id) {
      fetchSimulations();
    }
  }, [isOpen, session]);

  const fetchSimulations = async () => {
    const { data } = await supabase
      .from('simulation_summaries')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
    
    if (data) setSimulations(data);
  };

  const toggleSimulationAccordion = (id) => {
    const newSet = new Set(expandedSimulations);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedSimulations(newSet);
  };

  const deleteSimulation = async (id) => {
    const confirmed = window.confirm("האם אתה בטוח שברצונך למחוק רשומה זו לצמיתות?");
    if (!confirmed) return;

    await supabase.from('simulation_summaries').delete().eq('id', id);
    fetchSimulations();
  };

  const resumeSimulation = (sim) => {
    const chatHistory = sim.messages || sim.history;
    
    if (!chatHistory) {
      alert("שגיאה: היסטוריית השיחה חסרה עבור רשומה זו ולכן לא ניתן להמשיך אותה.");
      return;
    }

    sessionStorage.setItem('sim_cluster_title', sim.cluster);
    
    if (sim.cluster && sim.cluster.startsWith('שיחה אישית')) {
      sessionStorage.setItem('gemini_chatHistory', JSON.stringify(chatHistory));
    } else {
      sessionStorage.setItem('gemini_simulationHistory', JSON.stringify(chatHistory));
    }
    
    const mappedMessages = chatHistory.map(item => {
      let hat = undefined;
      let text = item.parts[0].text;
      
      if (item.role === 'model') {
        const hatMatch = text.match(/^\[כובע:\s*(.+?)\]\s*/);
        if (hatMatch) {
           hat = hatMatch[1].trim();
           text = text.replace(hatMatch[0], '');
        } else {
           hat = 'מלמד';
        }
      }
      
      return {
        role: item.role,
        text: text,
        ...(hat && { hat })
      };
    });

    mappedMessages.unshift({
      role: 'system-info',
      text: sim.cluster && sim.cluster.startsWith('שיחה אישית') ? 'המשך שיחה אישית' : `המשך תרגול: ${sim.cluster}`
    });

    if (sim.cluster && sim.cluster.startsWith('שיחה אישית')) {
      sessionStorage.setItem('reg_messages', JSON.stringify(mappedMessages));
      onClose();
      window.dispatchEvent(new Event('force_reset_chat'));
      navigate('/');
    } else {
      sessionStorage.setItem('sim_messages', JSON.stringify(mappedMessages));
      onClose();
      const clusterObj = { title: sim.cluster, tools: '' }; 
      navigate('/simulation', { state: { cluster: clusterObj } });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{
        backgroundColor: '#fff', borderRadius: '12px', width: '90%', maxWidth: '600px',
        maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>יומן אירועים</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
          <button 
            onClick={() => setActiveTab('simulations')}
            style={{ 
              flex: 1, padding: '1rem', background: 'none', border: 'none', 
              borderBottom: activeTab === 'simulations' ? '2px solid #7e22ce' : '2px solid transparent',
              color: activeTab === 'simulations' ? '#7e22ce' : '#64748b',
              fontWeight: activeTab === 'simulations' ? '600' : '400',
              cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'
            }}>
            <FlaskConical size={18} />
            סיכומי תירגול
          </button>
          <button 
            onClick={() => setActiveTab('chats')}
            style={{ 
              flex: 1, padding: '1rem', background: 'none', border: 'none', 
              borderBottom: activeTab === 'chats' ? '2px solid #7e22ce' : '2px solid transparent',
              color: activeTab === 'chats' ? '#7e22ce' : '#64748b',
              fontWeight: activeTab === 'chats' ? '600' : '400',
              cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'
            }}>
            <MessageSquare size={18} />
            שיחות אישיות
          </button>
        </div>

        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          {activeTab === 'chats' && (
            <div className="tasks-list">
              {simulations.filter(s => s.cluster && s.cluster.startsWith('שיחה אישית')).length === 0 ? (
                <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem 0' }}>אין שיחות שמורות כרגע.</p>
              ) : (
                simulations.filter(s => s.cluster && s.cluster.startsWith('שיחה אישית')).map(sim => {
                  const isExpanded = expandedSimulations.has(sim.id);
                  return (
                    <div key={sim.id} className="task-item-container" style={{ marginBottom: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                      <div className="task-header" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }} onClick={() => toggleSimulationAccordion(sim.id)}>
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ color: '#7e22ce', fontWeight: '600' }}>{sim.cluster}</span>
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                              {new Date(sim.created_at).toLocaleDateString('he-IL')} {new Date(sim.created_at).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            onClick={() => resumeSimulation(sim)}
                            title="המשך שיחה"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#059669', padding: '0.25rem' }}>
                            <PlayCircle size={18} />
                          </button>
                          <button 
                            onClick={() => deleteSimulation(sim.id)}
                            title="מחק סיכום"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '0.25rem' }}>
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      
                      {isExpanded && sim.summary && (
                        <div className="task-content markdown-content" style={{ padding: '1rem', backgroundColor: '#fff', borderTop: '1px solid #e2e8f0', fontSize: '0.95rem', color: '#334155', lineHeight: '1.6' }}>
                          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                            {sim.summary}
                          </ReactMarkdown>
                          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                            <button 
                              onClick={() => resumeSimulation(sim)}
                              style={{ padding: '0.6rem 1.5rem', borderRadius: '8px', border: '2px solid #8b5cf6', backgroundColor: '#f3e8ff', color: '#8b5cf6', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}
                            >
                              <MessageSquare size={18} />
                              המשך שיחה זו
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'simulations' && (
            <div className="tasks-list">
              {simulations.filter(s => !s.cluster || !s.cluster.startsWith('שיחה אישית')).length === 0 ? (
                <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem 0' }}>אין סיכומי סימולציות כרגע.</p>
              ) : (
                simulations.filter(s => !s.cluster || !s.cluster.startsWith('שיחה אישית')).map(sim => {
                  const isExpanded = expandedSimulations.has(sim.id);
                  return (
                    <div key={sim.id} className="task-item-container" style={{ marginBottom: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                      <div className="task-header" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }} onClick={() => toggleSimulationAccordion(sim.id)}>
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ color: '#7e22ce', fontWeight: '600' }}>{sim.cluster}</span>
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                              {new Date(sim.created_at).toLocaleDateString('he-IL')} {new Date(sim.created_at).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            onClick={() => resumeSimulation(sim)}
                            title="המשך תירגול"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#059669', padding: '0.25rem' }}>
                            <PlayCircle size={18} />
                          </button>
                          <button 
                            onClick={() => deleteSimulation(sim.id)}
                            title="מחק סיכום"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '0.25rem' }}>
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      
                      {isExpanded && sim.summary && (
                        <div style={{ padding: '1rem', borderTop: '1px solid #e2e8f0', backgroundColor: '#fff', fontSize: '0.95rem', lineHeight: '1.5' }}>
                          <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{sim.summary}</p>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
