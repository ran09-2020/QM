import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Search, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const genericReasons = [
  { id: 'valid', text: 'הסעיף תקין והגיוני לחלוטין' },
  { id: 'action-not-outcome', text: 'שגיאה: מנוסח כפעולה אופרטיבית במקום כתוצאה התנהגותית' },
  { id: 'disconnected-vision', text: 'שגיאה: הפרויקט מנותק ממה שהוגדר בהצהרת החזון' },
  { id: 'missing-mechanism', text: 'שגיאה: חסר רכיב הכרחי במנגנון (כגון גורם מבקר או סדירות)' }
];

const mapData = [
  {
    id: 'vision',
    step: 'שלב 2: הצהרת החזון',
    content: '"בית הספר יהווה עוגן של שייכות, המצמיח בוגרים בעלי מעורבות חברתית עמוקה לקהילה."',
    correctReasonId: 'valid',
    explanation: 'משפט השראתי תקין שמתמקד בקהילה ושייכות.'
  },
  {
    id: 'outcome-1',
    step: 'שלב 3: תוצאה ארוכת טווח (חברתי)',
    content: 'כל תלמיד ירגיש משמעות ושייכות דרך תרומה קבועה לקהילה.',
    correctReasonId: 'valid',
    explanation: 'תקין. זוהי באמת תוצאה שנגזרת ישירות מהחזון.'
  },
  {
    id: 'outcome-2',
    step: 'שלב 3: תוצאה ארוכת טווח (פדגוגי)',
    content: 'בניית 2 מעבדות מחשבים חדשות עד סוף השנה.',
    correctReasonId: 'action-not-outcome',
    explanation: 'מצוין! בניית מעבדה זו פעולה (תת-יעד), לא תוצאה ארוכת טווח של שינוי באדם.'
  },
  {
    id: 'project-1',
    step: 'שלב 4+5: תת יעד (חברתי-ערכי)',
    content: 'הקמת מודל התנדבות שכבתית - "נוער מוביל".',
    correctReasonId: 'valid',
    explanation: 'תקין. פעולה אופרטיבית שמחוברת לתוצאה ולחזון.'
  },
  {
    id: 'project-2',
    step: 'שלב 4+5: תת יעד (פדגוגי)',
    content: 'פתיחת מגמת סייבר ורובוטיקה לתלמידים מצטיינים.',
    correctReasonId: 'disconnected-vision',
    explanation: 'מעולה! תפסת סילוא (נתק). סייבר זה יפה, אבל החזון ממוקד נטו בקהילה ושייכות.'
  },
  {
    id: 'mechanism-1',
    step: 'שלב 6: מנגנון יישום ל"נוער מוביל"',
    content: 'צוות: מחנכים. אחראית: רכזת חברתית. סדירות: ביצוע פעם בחודש.',
    correctReasonId: 'missing-mechanism',
    explanation: 'בדיוק! חסרה כאן עמודת ה"בקרה" - מי מוודא שזה קורה ומתי?'
  },
  {
    id: 'mechanism-2',
    step: 'שלב 6: מנגנון שיח מורים',
    content: 'צוות: כלל המורים. אחראית: יועצת. סדירות: אחת לשבוע. בקרה: דיווח שוטף למנהל.',
    correctReasonId: 'valid',
    explanation: 'מנגנון תקין ומלא.'
  }
];

export default function VisionDemoDiagnostic() {
  const navigate = useNavigate();
  // Store which reason user selected for each item: { itemId: reasonId }
  const [selections, setSelections] = useState({});
  // Store if a specific item's selection was submitted and evaluated: { itemId: isCorrect }
  const [evaluations, setEvaluations] = useState({});

  const totalFlaws = mapData.filter(d => d.correctReasonId !== 'valid').length;
  const foundFlaws = Object.keys(evaluations).filter(id => {
    const item = mapData.find(d => d.id === id);
    return evaluations[id] === true && item.correctReasonId !== 'valid';
  }).length;
  
  const isComplete = foundFlaws === totalFlaws;

  const handleSelectReason = (itemId, reasonId) => {
    // Only allow selection if not already correctly evaluated
    if (evaluations[itemId] !== true) {
      setSelections(prev => ({ ...prev, [itemId]: reasonId }));
      // Clear previous error state when changing selection
      if (evaluations[itemId] === false) {
        setEvaluations(prev => {
          const newEvals = { ...prev };
          delete newEvals[itemId];
          return newEvals;
        });
      }
    }
  };

  const handleCheckItem = (item) => {
    const selected = selections[item.id];
    if (!selected) return;

    if (selected === item.correctReasonId) {
      setEvaluations(prev => ({ ...prev, [item.id]: true }));
    } else {
      setEvaluations(prev => ({ ...prev, [item.id]: false }));
    }
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', backgroundColor: '#fbfaf8', padding: '2rem', paddingBottom: '4rem', direction: 'rtl' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ backgroundColor: '#543e32', color: 'white', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem' }}>סימולטור המנוע השבור (אבחון מנומק)</h1>
            <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>לא מספיק לזהות כשל - צריך גם להסביר למה. בחר את הסטטוס הלוגי של כל סעיף.</p>
          </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => navigate(-1)}
              style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.5)', color: 'rgba(255,255,255,0.9)', padding: '0.3rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              חזרה
            </button>
            <button 
              onClick={() => navigate('/')}
              style={{ backgroundColor: 'transparent', border: '1px solid white', color: 'white', padding: '0.3rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              יציאה
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ padding: '1.5rem', backgroundColor: '#e9e6db', borderBottom: '1px solid #d2ccb4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', color: '#644b3c' }}>
            <Search size={20} />
            <span>כשלים שאובחנו נכון: {foundFlaws} / {totalFlaws}</span>
          </div>
          {isComplete && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2e4c39', fontWeight: 'bold', backgroundColor: '#e7f0ea', padding: '0.5rem 1rem', borderRadius: '999px' }}>
              <CheckCircle size={18} /> סיימת! אבחנת והסברת בהצלחה את כל הנתקים באסטרטגיה.
            </div>
          )}
        </div>

        {/* The Diagnostic Board */}
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {mapData.map(item => {
            const isCorrect = evaluations[item.id] === true;
            const isWrong = evaluations[item.id] === false;
            const hasSelection = !!selections[item.id];
            
            return (
              <div 
                key={item.id}
                style={{ 
                  padding: '1.5rem', 
                  borderRadius: '8px', 
                  border: isCorrect ? '2px solid #56906b' : (isWrong ? '2px solid #b28080' : '1px solid #cbd5e0'),
                  backgroundColor: isCorrect ? '#f4f8f5' : (isWrong ? '#f9f6f6' : '#f8fafb'),
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ fontSize: '0.85rem', color: '#63738b', fontWeight: 'bold', marginBottom: '0.5rem' }}>{item.step}</div>
                <div style={{ fontSize: '1.1rem', color: '#151923', marginBottom: '1rem' }}>{item.content}</div>

                {/* The Checkboxes */}
                <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '6px', border: '1px solid #e3e8ee' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '0.75rem', fontSize: '0.9rem', color: '#475569' }}>
                    אבחון פדגוגי לסעיף זה:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {genericReasons.map(reason => (
                      <label 
                        key={reason.id} 
                        style={{ 
                          display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: isCorrect ? 'default' : 'pointer',
                          opacity: (isCorrect && selections[item.id] !== reason.id) ? 0.5 : 1
                        }}
                      >
                        <input 
                          type="radio" 
                          name={'reason-' + item.id}
                          checked={selections[item.id] === reason.id}
                          onChange={() => handleSelectReason(item.id, reason.id)}
                          disabled={isCorrect}
                          style={{ cursor: isCorrect ? 'default' : 'pointer' }}
                        />
                        <span style={{ fontSize: '0.95rem', color: reason.id === 'valid' ? '#375d45' : '#704343' }}>
                          {reason.text}
                        </span>
                      </label>
                    ))}
                  </div>

                  {!isCorrect && hasSelection && (
                    <button 
                      onClick={() => handleCheckItem(item)}
                      style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#644b3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold' }}
                    >
                      בדיקת אבחון
                    </button>
                  )}
                </div>

                {/* Feedback Messages */}
                {isCorrect && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #cfe2d6', color: '#375d45', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <Info size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ lineHeight: '1.5', fontWeight: 'bold' }}>{item.explanation}</div>
                  </div>
                )}

                {isWrong && (
                  <div style={{ marginTop: '1rem', color: '#854f4f', fontSize: '0.9rem', display: 'flex', gap: '0.5rem', alignItems: 'center', fontWeight: 'bold' }}>
                    <AlertTriangle size={16} /> טעות באבחון. האם אתה בטוח שזו הסיבה לנתק הלוגי? נסה שוב.
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
