import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import PdfViewer from './PdfViewer';
import { File as FileIcon, Save } from 'lucide-react';

function MessageBubble({ msg, idx, isLast, lastModelMessageRef, startPractice, setMessages, handleSend, handlePracticeButtonClick }) {
  const isLastModelMsg = msg.role === 'model' && isLast;

  if (msg.role === 'system-info') {
    return (
      <div className="message-wrapper user" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
        <div className="message-bubble system-bubble" style={{
          backgroundColor: '#1e3a8a',
          color: 'white',
          borderRadius: '12px',
          padding: '0.75rem 1.5rem',
          fontSize: '0.95rem',
          fontWeight: '500',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          {msg.text ? msg.text.replace(/\[TOOL_PRACTICED:\s*(.+?)\]/g, "").trim() : ""}
        </div>
      </div>
    );
  }

  const getHatClass = (hat) => {
    if (hat === 'מאמן' || hat === 'מאמנת') return 'bubble-hat-coach';
    if (hat === 'יועץ' || hat === 'יועצת') return 'bubble-hat-advisor';
    if (hat === 'מלמד' || hat === 'מלמדת' || hat === 'מורה') return 'bubble-hat-teacher';
    return '';
  };

  const getBadgeClass = (hat) => {
    if (hat === 'מאמן' || hat === 'מאמנת') return 'badge-hat-coach';
    if (hat === 'יועץ' || hat === 'יועצת') return 'badge-hat-advisor';
    if (hat === 'מלמד' || hat === 'מלמדת' || hat === 'מורה') return 'badge-hat-teacher';
    return '';
  };

  const getBadgeIcon = (hat) => {
    if (hat === 'מאמן' || hat === 'מאמנת') return `🎯 ${hat}`;
    if (hat === 'יועץ' || hat === 'יועצת') return `💡 ${hat}`;
    if (hat === 'מלמד' || hat === 'מלמדת' || hat === 'מורה') return `📚 ${hat}`;
    return hat;
  };

  return (
    <div 
      className={`message-wrapper ${msg.role}`}
      ref={isLastModelMsg ? lastModelMessageRef : null}
    >
      <div className={`message-bubble ${msg.hat ? getHatClass(msg.hat) : ''}`}>
        <div className="message-content">
          {msg.hat && (
            <div className={`hat-badge ${getBadgeClass(msg.hat)}`}>
              {getBadgeIcon(msg.hat)}
            </div>
          )}
          
          {msg.file && (
            <div className="attached-file-pill user-message-file" style={{marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', color: '#4b5563'}}>
              <FileIcon size={14} />
              <span>{msg.file.name}</span>
            </div>
          )}
          
          <div className="markdown-content">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeRaw]}
              components={{
                a: ({node, ...props}) => {
                  if (props.href && props.href.startsWith('#practice:')) {
                    const toolName = decodeURIComponent(props.href.replace('#practice:', ''));
                    return (
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        if (startPractice) startPractice(toolName);
                      }} className="practice-link">
                        {props.children}
                      </a>
                    );
                  }
                  if (props.href && props.href.startsWith('#action:')) {
                    const action = props.href.replace('#action:', '');
                    return (
                      <button onClick={(e) => {
                        e.preventDefault();
                        if (action === 'end_practice') {
                          setMessages(prev => [...prev, { role: 'system-info', text: 'התירגול הסתיים בהצלחה. לשמירת הסיכום בלוח האירועים לחץ על "סיכום ושמירה" למעלה. למחיקה והתחלה מחדש, לחץ על "יציאה".' }]);
                        } else if (action === 'active_practice') {
                          if (handleSend) handleSend('תאמן אותי על תרחיש שאהיה פעיל בו');
                        } else if (action === 'more_example') {
                          if (handleSend) handleSend('שלב אחרי שלב (הצג לי דוגמה נוספת בדיוק לפי התבנית)');
                        } else if (action === 'continue_demo') {
                          if (handleSend) handleSend('כן, להמשיך לשלב הבא');
                        } else {
                          // Generic fallback
                          if (handleSend) handleSend(String(props.children));
                        }
                      }} className="pill-btn" style={{ margin: '5px', display: 'inline-flex', borderColor: '#8b5cf6', color: '#7e22ce' }}>
                        {props.children}
                      </button>
                    );
                  }
                  if (props.href && props.href.startsWith('#pdf:')) {
                    const pdfFile = props.href.replace('#pdf:', '');
                    const pdfUrl = `${import.meta.env.BASE_URL}process_maps/${pdfFile}`;
                    return (
                      <div style={{ marginTop: '1rem', marginBottom: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ backgroundColor: '#f3f4f6', padding: '8px 12px', fontWeight: 'bold', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{fontSize: '18px'}}>📄</span> {props.children}
                          </div>
                          <a href={pdfUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', backgroundColor: '#8b5cf6', color: 'white', padding: '4px 8px', borderRadius: '4px', textDecoration: 'none' }}>
                            פתח במסך מלא
                          </a>
                        </div>
                        <div style={{ WebkitOverflowScrolling: 'touch', overflowY: 'auto' }}>
                          {isLast ? (
                            <PdfViewer fileUrl={pdfUrl} />
                          ) : (
                            <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f9fafb' }}>
                              <span style={{color: '#6b7280', fontSize: '14px'}}>התצוגה נסגרה כדי לשמור על ביצועים.</span><br/>
                              <a href={pdfUrl} target="_blank" rel="noopener noreferrer" style={{color: '#8b5cf6', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block', marginTop: '8px'}}>
                                לחץ כאן לפתיחת הקובץ 
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return <a {...props} />;
                }
              }}
            >
              {msg.text ? msg.text.replace(/\[TOOL_PRACTICED:\s*(.+?)\]/g, "").trim() : ""}
            </ReactMarkdown>
          </div>
          
          {msg.role === 'model' && msg.text && (msg.text.includes('| ---') || msg.text.includes('|---') || msg.text.includes('<table') || msg.text.includes('<details') || msg.text.includes('מסמך אסטרטגי') || msg.text.includes('מסמך אופרטיבי')) && (
            <div style={{ marginTop: '15px', borderTop: '1px solid #e5e7eb', paddingTop: '12px', display: 'flex', justifyContent: 'center' }}>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new Event('trigger_save_artifact'));
                  const btn = e.currentTarget;
                  btn.innerHTML = 'נשמר בהצלחה ✓';
                  btn.style.backgroundColor = '#10b981';
                  btn.style.color = 'white';
                  setTimeout(() => {
                    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left:5px"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> שמור מסמך זה ליומן השמורים';
                    btn.style.backgroundColor = 'transparent';
                    btn.style.color = '#4f46e5';
                  }, 3000);
                }} 
                className="pill-btn" 
                style={{ borderColor: '#4f46e5', color: '#4f46e5', display: 'flex', alignItems: 'center', transition: 'all 0.3s' }}
              >
                <Save size={16} style={{ marginLeft: '5px' }} />
                שמור מסמך זה ליומן השמורים
              </button>
            </div>
          )}
{msg.buttons && (
            <div className="message-buttons">
              {msg.buttons.map((btn, bidx) => (
                <button 
                  key={bidx} 
                  className="pill-btn practice-btn" 
                  onClick={() => handlePracticeButtonClick && handlePracticeButtonClick(btn.action)}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(MessageBubble);
