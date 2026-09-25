import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { applySchoolFilter } from '../utils/supabaseHelpers';
import { useSchool } from '../contexts/SchoolContext';
import { X, Trash2, PlayCircle, Download, Save, FileText, MessageSquare, FlaskConical, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { loadChatHistory, loadSimulationHistory } from '../services/gemini';

export default function CalendarModal({ session, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('chats');
  const [simulations, setSimulations] = useState([]);
  const [artifacts, setArtifacts] = useState([]);
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [expandedSimulations, setExpandedSimulations] = useState(new Set());
  const { role, activeSchool } = useSchool();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && session?.user?.id) {
      fetchSimulations();
    }
  }, [isOpen, session, role, activeSchool]);

  const fetchSimulations = async () => {
    let query = supabase.from('simulation_summaries').select('*').eq('user_id', session.user.id);
    query = applySchoolFilter(query, role, activeSchool);
    const { data } = await query.order('created_at', { ascending: false });
    if (data) setSimulations(data);

    let artQuery = supabase.from('saved_artifacts').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
    artQuery = applySchoolFilter(artQuery, role, activeSchool);
    const { data: artData } = await artQuery;
    if (artData) setArtifacts(artData);
  };

  const toggleSimulationAccordion = (id) => {
    const newSet = new Set(expandedSimulations);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedSimulations(newSet);
  };


  const buildHTMLString = (content, title) => {
    if (!content) return "";
    let html = "<div style='font-family: Arial, sans-serif; direction: rtl;'>";
    
    if (content.document_type === 'generic_markdown' || (content.markdown_content && !content.vision_sentences)) {
      html += `<h2>${title || 'מסמך אסטרטגיה'}</h2>`;
      // Very basic markdown to HTML converter for Word export
      let mkd = content.markdown_content || '';
      mkd = mkd.replace(/^### (.*$)/gim, '<h4>$1</h4>')
               .replace(/^## (.*$)/gim, '<h3>$1</h3>')
               .replace(/^# (.*$)/gim, '<h2>$1</h2>')
               .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
               .replace(/\*(.*)\*/gim, '<i>$1</i>')
               .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');
               
      // Basic table support for Word (if the AI generated markdown tables)
      if (mkd.includes('|')) {
        // First convert each row to <tr>...</tr>
        mkd = mkd.replace(/^[\s]*\|(.+)\|[\s]*$/gm, (match, inner) => {
           if (inner.includes('---')) return ''; // drop separator row entirely
           let cols = inner.split('|');
           return '<tr>' + cols.map(c => `<td style="border: 1px solid #ccc; padding: 5px;">${c.trim()}</td>`).join('') + '</tr>';
        });
        
        // Then wrap contiguous <tr> blocks in a <table>
        mkd = mkd.replace(/(<tr>[\s\S]*?<\/tr>\s*)+/g, (match) => {
           return `<table style="border-collapse: collapse; width: 100%; border: 1px solid #ccc; margin: 15px 0;">\n${match}</table>\n`;
        });
      }

      // Finally, replace remaining newlines with <br/> (after tables are processed)
      mkd = mkd.replace(/\n\n/gim, '<br/><br/>')
               .replace(/\n/gim, '<br/>');
               
      html += `<div>${mkd}</div>`;
      html += "</div>";
      return html;
    }

    // Default to vision matrix template
    html += `<h2>${title || 'מסמך אסטרטגיה'}</h2>`;
    html += "<h3>חזון בית הספר</h3><ul>";
    for (let i=0; i<5; i++) {
       const sentence = content.vision_sentences?.[i] || "(להגדרה - עיין במחוון)";
       html += `<li>${sentence}</li>`;
    }
    html += "</ul><h3>יעדים אופרטיביים</h3>";
    html += "<table border='1' style='width:100%; border-collapse: collapse;' cellpadding='8'>";
    html += "<tr style='background: #f3f4f6;'><th>מס' יעד</th><th>פדגוגי</th><th>חברתי-ערכי</th><th>רגשי</th><th>ארגוני-ניהולי</th></tr>";
    
    if (content.goals?.length > 0) {
      content.goals.forEach(g => {
        const isPed = g.domain === 'פדגוגי';
        const isSoc = g.domain === 'חברתי-ערכי';
        const isEmo = g.domain === 'רגשי';
        const isMan = g.domain === 'ארגוני-ניהולי' || g.domain === 'ניהולי-ארגוני';
        
        let notesHTML = "";
        if (g.mentor_notes && g.mentor_notes.length > 0) {
           notesHTML = `<div style="color: red; font-size: 0.9em; margin-top: 10px;"><b>הערות מאמן:</b><ul>`;
           g.mentor_notes.forEach(n => notesHTML += `<li>${n}</li>`);
           notesHTML += `</ul></div>`;
        }
        
        html += `<tr>`;
        html += `<td style="text-align:center;"><b>${g.id}</b></td>`;
        html += `<td>${isPed ? g.desc + notesHTML : ''}</td>`;
        html += `<td>${isSoc ? g.desc + notesHTML : ''}</td>`;
        html += `<td>${isEmo ? g.desc + notesHTML : ''}</td>`;
        html += `<td>${isMan ? g.desc + notesHTML : ''}</td>`;
        html += `</tr>`;
      });
    } else {
      html += "<tr><td colspan='5'>אין יעדים מוגדרים</td></tr>";
    }
    html += "</table>";

    // Add domains section
    html += "<h3 style='margin-top: 30px;'>מפת התחומים האסטרטגיים (חללים ריקים)</h3>";
    html += "<table style='width:100%; border-collapse: separate; border-spacing: 15px;'>";
    
    const domainKeys = ['פדגוגי', 'חברתי-ערכי', 'רגשי', 'ארגוני-ניהולי'];
    // In some older saves, 'קהילה' might be used instead of 'רגשי'
    const getDomainData = (key) => {
        if (key === 'רגשי') return content.domains?.[key] || content.domains?.['קהילה'];
        if (key === 'ארגוני-ניהולי') return content.domains?.[key] || content.domains?.['ניהולי-ארגוני'];
        return content.domains?.[key];
    };
    
    html += "<tr>";
    for(let i=0; i<2; i++) {
       const key = domainKeys[i];
       const data = getDomainData(key);
       html += `<td style='border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; width: 50%;'>`;
       html += `<h4 style='margin: 0 0 10px 0;'>${key}</h4>`;
       html += `<p style='margin: 5px 0;'><b>אחראי: </b>${data?.owner || 'להשלמה עם המדריך'}</p>`;
       html += `<p style='margin: 5px 0;'><b>יעדים שנגזרו: </b>${(data?.goals && data.goals.length > 0) ? data.goals.join(', ') : 'חלל ריק למילוי בשנתון'}</p>`;
       html += `</td>`;
    }
    html += "</tr><tr>";
    for(let i=2; i<4; i++) {
       const key = domainKeys[i];
       const data = getDomainData(key);
       html += `<td style='border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; width: 50%;'>`;
       html += `<h4 style='margin: 0 0 10px 0;'>${key}</h4>`;
       html += `<p style='margin: 5px 0;'><b>אחראי: </b>${data?.owner || 'להשלמה עם המדריך'}</p>`;
       html += `<p style='margin: 5px 0;'><b>יעדים שנגזרו: </b>${(data?.goals && data.goals.length > 0) ? data.goals.join(', ') : 'חלל ריק למילוי בשנתון'}</p>`;
       html += `</td>`;
    }
    html += "</tr></table>";

    html += "</div>";
    return html;
  };

  const handleExportWord = (content, title) => {
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>מסמך אסטרטגיה</title><style>body { font-family: Arial, sans-serif; direction: rtl; }</style></head><body>";
    const footer = "</body></html>";
    
    const sourceHTML = header + buildHTMLString(content, title) + footer;
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = (title || 'מסמך_אסטרטגיה') + '.doc';
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  const handleExportPDF = (content, title, art) => {
    if (!selectedArtifact && art) {
      // If clicked from list, select it first, wait for render, then print
      setSelectedArtifact(art);
      setTimeout(() => window.print(), 300);
    } else {
      window.print();
    }
  };

  const renderArtifactContent = (content) => {
    if (!content) return null;
    
    if (content.document_type === 'generic_markdown' || (content.markdown_content && !content.vision_sentences)) {
      return (
        <div className="viewer-content markdown-content" style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', lineHeight: '1.6', color: '#1e293b' }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {content.markdown_content ? content.markdown_content.replace(/\[TOOL_PRACTICED:\s*(.+?)\]/g, "").replace(/\[ARTIFACT\]/g, "").trim() : ''}
          </ReactMarkdown>
        </div>
      );
    }

    return (
      <div className="viewer-content">
        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#334155' }}>חזון בית הספר</h3>
          <ol style={{fontSize: '1.1rem', paddingRight: '20px', lineHeight: '1.8'}}>
            {[0, 1, 2, 3, 4].map(i => {
              const sentence = content.vision_sentences?.[i];
              return (
                <li key={i} style={{ color: sentence ? '#1f2937' : '#9ca3af' }}>
                  {sentence || <span style={{fontStyle: 'italic'}}>(להגדרה - עיין במחוון)</span>}
                </li>
              );
            })}
          </ol>
        </div>
        
        <div>
          <h3 style={{ margin: '0 0 1rem 0', color: '#334155' }}>יעדים אופרטיביים</h3>
          <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '15px'}}>
            <thead>
              <tr style={{background: '#f3f4f6'}}>
                <th style={{padding: '10px', border: '1px solid #e5e7eb', textAlign: 'right', width: '60px'}}>מס' יעד</th>
                <th style={{padding: '10px', border: '1px solid #e5e7eb', textAlign: 'center', width: '23%'}}>פדגוגי</th>
                <th style={{padding: '10px', border: '1px solid #e5e7eb', textAlign: 'center', width: '23%'}}>חברתי-ערכי</th>
                <th style={{padding: '10px', border: '1px solid #e5e7eb', textAlign: 'center', width: '23%'}}>רגשי</th>
                <th style={{padding: '10px', border: '1px solid #e5e7eb', textAlign: 'center', width: '23%'}}>ארגוני-ניהולי</th>
              </tr>
            </thead>
            <tbody>
              {content.goals?.length > 0 ? content.goals.map((g, i) => {
                const isPedagogy = g.domain === 'פדגוגי';
                const isSocial = g.domain === 'חברתי-ערכי';
                const isCommunity = g.domain === 'רגשי';
                const isManagement = g.domain === 'ארגוני-ניהולי' || g.domain === 'ניהולי-ארגוני';
                return (
                <tr key={i}>
                  <td style={{padding: '10px', border: '1px solid #e5e7eb', fontWeight: 'bold', textAlign: 'center'}}>{g.id}</td>
                  <td style={{padding: '10px', border: '1px solid #e5e7eb', background: isPedagogy ? '#eff6ff' : 'transparent', verticalAlign: 'top'}}>
                    {isPedagogy && (
                      <div>
                        <div style={{marginBottom: g.mentor_notes?.length ? '8px' : '0'}}>{g.desc}</div>
                        {g.mentor_notes && g.mentor_notes.length > 0 && (
                          <div style={{background: '#fef2f2', border: '1px dashed #f87171', padding: '6px', borderRadius: '4px', fontSize: '0.85rem'}}>
                            <div style={{color: '#b91c1c', fontWeight: 'bold', marginBottom: '4px'}}>הערות מאמן:</div>
                            <ul style={{margin: 0, paddingRight: '15px', color: '#991b1b'}}>
                              {g.mentor_notes.map((note, idx) => <li key={idx}>{note}</li>)}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td style={{padding: '10px', border: '1px solid #e5e7eb', background: isSocial ? '#eff6ff' : 'transparent', verticalAlign: 'top'}}>
                    {isSocial && (
                      <div>
                        <div style={{marginBottom: g.mentor_notes?.length ? '8px' : '0'}}>{g.desc}</div>
                        {g.mentor_notes && g.mentor_notes.length > 0 && (
                          <div style={{background: '#fef2f2', border: '1px dashed #f87171', padding: '6px', borderRadius: '4px', fontSize: '0.85rem'}}>
                            <div style={{color: '#b91c1c', fontWeight: 'bold', marginBottom: '4px'}}>הערות מאמן:</div>
                            <ul style={{margin: 0, paddingRight: '15px', color: '#991b1b'}}>
                              {g.mentor_notes.map((note, idx) => <li key={idx}>{note}</li>)}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td style={{padding: '10px', border: '1px solid #e5e7eb', background: isCommunity ? '#eff6ff' : 'transparent', verticalAlign: 'top'}}>
                    {isCommunity && (
                      <div>
                        <div style={{marginBottom: g.mentor_notes?.length ? '8px' : '0'}}>{g.desc}</div>
                        {g.mentor_notes && g.mentor_notes.length > 0 && (
                          <div style={{background: '#fef2f2', border: '1px dashed #f87171', padding: '6px', borderRadius: '4px', fontSize: '0.85rem'}}>
                            <div style={{color: '#b91c1c', fontWeight: 'bold', marginBottom: '4px'}}>הערות מאמן:</div>
                            <ul style={{margin: 0, paddingRight: '15px', color: '#991b1b'}}>
                              {g.mentor_notes.map((note, idx) => <li key={idx}>{note}</li>)}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td style={{padding: '10px', border: '1px solid #e5e7eb', background: isManagement ? '#eff6ff' : 'transparent', verticalAlign: 'top'}}>
                    {isManagement && (
                      <div>
                        <div style={{marginBottom: g.mentor_notes?.length ? '8px' : '0'}}>{g.desc}</div>
                        {g.mentor_notes && g.mentor_notes.length > 0 && (
                          <div style={{background: '#fef2f2', border: '1px dashed #f87171', padding: '6px', borderRadius: '4px', fontSize: '0.85rem'}}>
                            <div style={{color: '#b91c1c', fontWeight: 'bold', marginBottom: '4px'}}>הערות מאמן:</div>
                            <ul style={{margin: 0, paddingRight: '15px', color: '#991b1b'}}>
                              {g.mentor_notes.map((note, idx) => <li key={idx}>{note}</li>)}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
                );
              }) : <tr><td colSpan="5" style={{padding: '10px', border: '1px solid #e5e7eb', textAlign: 'center', color: '#9ca3af', fontStyle: 'italic'}}>אין יעדים אופרטיביים מוגדרים</td></tr>}
            </tbody>
          </table>
        </div>
        
        <div style={{ marginTop: '3rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#334155' }}>מפת התחומים האסטרטגיים (חללים ריקים)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {['פדגוגי', 'חברתי-ערכי', 'רגשי', 'ארגוני-ניהולי'].map((domainKey) => {
              let domainData = content.domains?.[domainKey];
              if (domainKey === 'רגשי' && !domainData) domainData = content.domains?.['קהילה'];
              if (domainKey === 'ארגוני-ניהולי' && !domainData) domainData = content.domains?.['ניהולי-ארגוני'];
              
              const owner = domainData?.owner || 'להשלמה עם המדריך';
              const goalsList = domainData?.goals?.length > 0 ? domainData.goals.join(', ') : 'חלל ריק למילוי בשנתון';
              
              return (
                <div key={domainKey} style={{
                  padding: '1.5rem',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  textAlign: 'center'
                }}>
                  <h4 style={{ margin: '0 0 1rem 0', color: '#0f172a', fontSize: '1.1rem' }}>{domainKey}</h4>
                  <div style={{ marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                    <span style={{ fontWeight: '600', color: '#475569' }}>אחראי: </span>
                    <span style={{ color: owner === 'להשלמה עם המדריך' ? '#94a3b8' : '#334155', fontStyle: owner === 'להשלמה עם המדריך' ? 'italic' : 'normal' }}>{owner}</span>
                  </div>
                  <div style={{ fontSize: '0.95rem' }}>
                    <span style={{ fontWeight: '600', color: '#475569' }}>יעדים שנגזרו: </span>
                    <span style={{ color: goalsList === 'חלל ריק למילוי בשנתון' ? '#94a3b8' : '#334155', fontStyle: goalsList === 'חלל ריק למילוי בשנתון' ? 'italic' : 'normal' }}>{goalsList}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
      </div>
    );
  };

  const deleteArtifact = async (id) => {
    const confirmed = window.confirm("האם למחוק מסמך שמור זה?");
    if (!confirmed) return;
    const { error } = await supabase.from('saved_artifacts').delete().eq('id', id);
    if (!error) {
      if (selectedArtifact?.id === id) setSelectedArtifact(null);
      fetchSimulations();
    }
  };

  const deleteSimulation = async (id) => {
    const confirmed = window.confirm("האם אתה בטוח שברצונך למחוק רשומה זו לצמיתות?");
    if (!confirmed) return;

    const { error } = await supabase.from('simulation_summaries').delete().eq('id', id);
    if (error) {
      console.error("Error deleting record:", error);
      alert("שגיאה במחיקה: ייתכן וחסרות הרשאות מחיקה (RLS Policy) במסד הנתונים.");
    }
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
      loadChatHistory(chatHistory);
    } else {
      loadSimulationHistory(chatHistory);
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

    mappedMessages.push({
      role: 'system-info',
      text: 'המשך השיחה'
    });

    if (sim.cluster && sim.cluster.startsWith('שיחה אישית')) {
      sessionStorage.setItem('reg_messages', JSON.stringify(mappedMessages));
      onClose();
      window.dispatchEvent(new Event('load_resumed_chat'));
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
            onClick={() => setActiveTab('artifacts')}
            style={{ 
              flex: 1, padding: '1rem', background: 'none', border: 'none', 
              borderBottom: activeTab === 'artifacts' ? '2px solid #7e22ce' : '2px solid transparent',
              color: activeTab === 'artifacts' ? '#7e22ce' : '#64748b',
              fontWeight: activeTab === 'artifacts' ? '600' : '400',
              cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'
            }}>
            <Save size={18} />
            מסמכים שמורים
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

        <div className="modal-body-scroll" style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
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
                            <span style={{ color: '#7e22ce', fontWeight: '600' }}>{sim.cluster ? (sim.cluster === 'שיחה אישית' ? sim.cluster : sim.cluster.replace('שיחה אישית:', '').trim()) : 'ללא נושא'}</span>
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
                            {sim.summary ? sim.summary.replace(/\[TOOL_PRACTICED:\s*(.+?)\]/g, "").replace(/\[ARTIFACT\]/g, "").trim() : ''}
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
                            <span style={{ color: '#7e22ce', fontWeight: '600' }}>{sim.cluster === 'שיחה אישית' ? sim.cluster : sim.cluster.replace('שיחה אישית:', '').trim()}</span>
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
                          <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{sim.summary ? sim.summary.replace(/\[TOOL_PRACTICED:\s*(.+?)\]/g, "").replace(/\[ARTIFACT\]/g, "").trim() : ''}</p>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          )}

          {activeTab === 'artifacts' && (
            <div className="tab-pane active fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {selectedArtifact ? (
                  <div className="artifact-viewer">
                    <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid #e2e8f0' }}>
                      <div>
                        <h2 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>{selectedArtifact.title}</h2>
                        <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{new Date(selectedArtifact.created_at).toLocaleDateString('he-IL')} {new Date(selectedArtifact.created_at).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })} &bull; מסמך אסטרטגיה</div>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button 
                          onClick={() => handleExportWord(selectedArtifact.content, selectedArtifact.title)}
                          style={{ padding: '0.5rem 1rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                          <Download size={16} /> Word
                        </button>
                        <button 
                          onClick={() => handleExportPDF()}
                          style={{ padding: '0.5rem 1rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                          <Download size={16} /> PDF
                        </button>
                        <button 
                          onClick={() => setSelectedArtifact(null)}
                          style={{ padding: '0.5rem 1rem', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
                          חזור לרשימה
                        </button>
                      </div>
                    </div>
                    {renderArtifactContent(selectedArtifact.content)}
                  </div>
              ) : (
                artifacts.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>אין עדיין תוצרים שמורים.</div>
                ) : (
                  artifacts.map((art) => (
                    <div key={art.id} style={{
                      backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0',
                      padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '1rem',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        
                        <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          <div style={{ 
                            backgroundColor: '#e0e7ff', color: '#4f46e5',
                            padding: '0.5rem', borderRadius: '8px', display: 'flex',
                            justifyContent: 'center', alignItems: 'center'
                          }}>
                            <Save size={24} />
                          </div>
                          <div>
                            <h3 style={{ margin: '0 0 0.3rem 0', color: '#1e293b', fontSize: '1.1rem' }}>{art.title}</h3>
                            <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                              {new Date(art.created_at).toLocaleDateString('he-IL')} {new Date(art.created_at).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })} &bull; מסמך אסטרטגיה
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button style={{
                            background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px',
                            padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                            cursor: 'pointer', color: '#475569', fontSize: '0.9rem', fontWeight: '500'
                          }} onClick={() => setSelectedArtifact(art)}>
                            <FileText size={16} /> צפייה
                          </button>
                          
                          <button style={{
                            background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px',
                            padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                            cursor: 'pointer', color: '#059669', fontSize: '0.9rem', fontWeight: '500'
                          }} onClick={() => {
                              const resumeSim = simulations.find(s => s.id === art.simulation_id);
                              if (resumeSim) resumeSimulation(resumeSim);
                              else {
                                if (art.chat_history) {
                                  sessionStorage.setItem('reg_messages', JSON.stringify(art.chat_history));
                                  window.dispatchEvent(new Event('load_resumed_chat'));
                                  onClose();
                                } else {
                                  alert("לא ניתן לשחזר את השיחה (היסטוריה חסרה במסד הנתונים)");
                                }
                              }
                          }}>
                            <MessageSquare size={16} /> המשך שיחה
                          </button>
                          
                          <button style={{
                            background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px',
                            padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                            cursor: 'pointer', color: '#ef4444', fontSize: '0.9rem', fontWeight: '500'
                          }} onClick={() => deleteArtifact(art.id)}>
                            <Trash2 size={16} /> מחיקה
                          </button>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                         <button onClick={() => handleExportWord(art.content, art.title)} style={{ flex: 1, padding: '0.6rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '500', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                           <Download size={16} /> הורד כ-Word
                         </button>
                         <button onClick={() => handleExportPDF(art.content, art.title, art)} style={{ flex: 1, padding: '0.6rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '500', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                           <Download size={16} /> הורד כ-PDF
                         </button>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
