import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Pointer, CheckCircle, Search } from 'lucide-react';

const initialBank = [
  { id: 'item-1', type: 'success', text: 'מעורבות גבוהה של תלמידים במיזמי קהילה' },
  { id: 'item-2', type: 'success', text: 'מורים משלבים טכנולוגיה באופן עצמאי' },
  { id: 'item-3', type: 'vision', text: 'בית הספר יצמיח בוגרים המובילים מצוינות דרך קהילה' },
  { id: 'item-4', type: 'outcome', text: 'פיתוח תחושת שייכות אצל כל תלמיד' },
  { id: 'item-5', type: 'outcome', text: 'יכולת חקר ולמידה עצמאית' },
  { id: 'item-6', type: 'project', text: 'בניית מודל חונכות שכבתית' },
  { id: 'item-7', type: 'project', text: 'הקמת מרחב מייקרים בית ספרי' },
  { id: 'item-8', type: 'mechanism', text: 'אחראי: יועצת, פעם בשבוע בבוקר, מעקב הנהלה' }
];

const initialZones = {
  success: { title: 'שלב 1: איסוף הצלחות קיימות', items: [] },
  vision: { title: 'שלב 2: הצהרת החזון (השראה)', items: [] },
  outcome: { title: 'שלב 3: תוצאות ארוכות טווח', items: [] },
  project: { title: 'שלב 4: תתי יעדים / פרויקטים', items: [] },
  mechanism: { title: 'שלב 6: מנגנוני יישום ("מחר בבוקר")', items: [] }
};

export default function VisionDemoSandbox() {
  const navigate = useNavigate();
  const [bank, setBank] = useState(initialBank);
  const [zones, setZones] = useState(initialZones);
  const [selectedItem, setSelectedItem] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState({ text: '', isError: false });

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setFeedbackMsg({ text: '', isError: false });
  };

  const getGuidingQuestion = (wrongZoneKey) => {
    switch (wrongZoneKey) {
      case 'success': return 'לא מתאים. שלב האיסוף (הצלחות) כולל נתונים עובדתיים שכבר קיימים בשטח היום. האם המשפט שניסית לשבץ מתאר עובדה קיימת?';
      case 'vision': return 'לא מתאים. חזון צריך להיות תמונת עתיד רחבה, השראתית (מצפן עליון). האם המשפט שניסית לשבץ הוא השראה או משימה קונקרטית מדי?';
      case 'outcome': return 'לא מתאים. "תוצאה ארוכת טווח" מתארת איזה שינוי נראה אצל התלמיד/מורה בעוד 3 שנים. האם המשפט שלך מתאר שינוי, או שאולי הוא פרויקט מעשי?';
      case 'project': return 'לא מתאים. פרויקט (תת-יעד) הוא פעולה אופרטיבית קונקרטית שאפשר לבצע השנה. האם המשפט שלך הוא פעולה, או שאולי מדובר בתוצאה/מנגנון?';
      case 'mechanism': return 'לא מתאים. מנגנון יישום חייב לכלול את ה"ברזלים": מי הצוות, מי האחראי, מתי זה קורה ואיך מפקחים על זה.';
      default: return 'לא מתאים.';
    }
  };

  const handleDropToZone = (zoneType) => {
    if (!selectedItem) return;

    if (selectedItem.type !== zoneType) {
      setFeedbackMsg({ text: getGuidingQuestion(zoneType), isError: true });
      setSelectedItem(null);
      return;
    }

    setBank(prev => prev.filter(i => i.id !== selectedItem.id));
    const newZones = { ...zones };
    Object.keys(newZones).forEach(k => {
      newZones[k].items = newZones[k].items.filter(i => i.id !== selectedItem.id);
    });
    newZones[zoneType].items = [...newZones[zoneType].items, selectedItem];
    
    setZones(newZones);
    setSelectedItem(null);
    setFeedbackMsg({ text: 'כל הכבוד! שיבוץ לוגי מדויק.', isError: false });
  };

  const handleRemoveFromZone = (item, zoneType) => {
    setZones(prev => ({
      ...prev,
      [zoneType]: {
        ...prev[zoneType],
        items: prev[zoneType].items.filter(i => i.id !== item.id)
      }
    }));
    setBank(prev => [...prev, item]);
  };

  const isComplete = bank.length === 0;

  return (
    <div style={{ height: '100%', overflowY: 'auto', backgroundColor: '#f8fafb', padding: '2rem', paddingBottom: '4rem', direction: 'rtl' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', overflow: 'hidden' }}>
        
        <div style={{ backgroundColor: '#151923', color: 'white', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem' }}>ארגז החול (הקלקה סוקרטית)</h1>
            <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>שבץ את הנתונים למקומם. טעויות ייענו בשאלת הכוונה.</p>
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

        {feedbackMsg.text && (
          <div style={{ padding: '1rem', backgroundColor: feedbackMsg.isError ? '#f9f6f6' : '#f4f8f5', color: feedbackMsg.isError ? '#704343' : '#2e4c39', borderBottom: '1px solid ' + (feedbackMsg.isError ? '#eadddd' : '#cfe2d6'), textAlign: 'center', fontWeight: 'bold' }}>
            {feedbackMsg.text}
          </div>
        )}

        {isComplete && (
          <div style={{ padding: '1rem', backgroundColor: '#f4f8f5', color: '#2e4c39', borderBottom: '1px solid #cfe2d6', textAlign: 'center', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <CheckCircle size={20} /> כל הכבוד! המבנה האסטרטגי הושלם בהצלחה.
          </div>
        )}

        <div style={{ display: 'flex', padding: '2rem', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          
          <div style={{ flex: '1', minWidth: '300px', backgroundColor: '#f2f4f7', borderRadius: '8px', padding: '1.5rem', border: '1px dashed #cbd5e0' }}>
            <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', color: '#334155', borderBottom: '2px solid #cbd5e0', paddingBottom: '0.5rem' }}>בנק נתונים גולמיים</h2>
            
            {bank.length === 0 ? (
              <div style={{ color: '#8fa2bc', textAlign: 'center', padding: '2rem 0' }}>הבנק ריק. הכל שובץ!</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {bank.map(item => {
                  const isSelected = selectedItem?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      style={{ 
                        backgroundColor: isSelected ? '#d2dee4' : 'white', 
                        border: isSelected ? '2px solid #4b6c7d' : '1px solid #cbd5e0', 
                        borderRadius: '6px', padding: '0.75rem', 
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', 
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)', transition: 'all 0.2s', userSelect: 'none'
                      }}
                    >
                      <Pointer size={16} color={isSelected ? '#4b6c7d' : '#8fa2bc'} />
                      <span style={{ fontSize: '0.9rem', color: isSelected ? '#3d5766' : '#212937', fontWeight: isSelected ? 'bold' : 'normal' }}>
                        {item.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{ flex: '2', minWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {Object.entries(zones).map(([zoneKey, zoneData]) => {
              const isHighlighted = selectedItem !== null;
              return (
                <div 
                  key={zoneKey}
                  onClick={() => handleDropToZone(zoneKey)}
                  style={{ 
                    backgroundColor: isHighlighted ? '#f8fafb' : '#ffffff', 
                    border: isHighlighted ? '2px dashed #8fa2bc' : '2px dashed #cbd5e0', 
                    borderRadius: '8px', padding: '1.5rem', minHeight: '100px', 
                    cursor: selectedItem ? 'pointer' : 'default', transition: 'all 0.2s'
                  }}
                >
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#151923' }}>{zoneData.title}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {zoneData.items.length === 0 ? (
                      <div style={{ color: '#cbd5e0', fontSize: '0.9rem', fontStyle: 'italic' }}>
                        {selectedItem ? 'לחץ כאן כדי לשבץ את הפריט' : 'הקופסה ריקה'}
                      </div>
                    ) : (
                      zoneData.items.map(item => (
                        <div
                          key={item.id}
                          onClick={(e) => { e.stopPropagation(); handleRemoveFromZone(item, zoneKey); }}
                          style={{ 
                            backgroundColor: '#ebeff3', border: '1px solid #abc2cd', borderRadius: '6px', 
                            padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.9rem', color: '#3d5766', 
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                          }}
                          title="לחץ כדי להחזיר לבנק"
                        >
                          {item.text}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
