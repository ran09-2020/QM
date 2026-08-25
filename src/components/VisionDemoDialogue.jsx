import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Home, MessageSquare, Info } from 'lucide-react';

const dialogueSteps = [
  {
    phase: "שלב 0: הפער בין חזון למציאות",
    mentor: "שלום! אז יש לבית הספר חזון מנוסח ויפה. איפה אתה מרגיש את הפער הכי גדול בין מה שכתוב לבין מה שקורה בפועל?",
    principal: "יש לנו חזון מדהים שנקרא 'קהילה מצמיחה'. אבל ביומיום, זה נשאר פוסטר על הקיר. אני רוצה להפוך אותו לתוכנית אסטרטגית שמשנה את ניהול התהליכים בבית הספר.",
    insight: "זיהוי הפער בין 'הרוח' (החזון) ל'חומר' (השגרות והתהליכים) הוא הצעד הראשון בבניית תוכנית אסטרטגית אמיתית."
  },
  {
    phase: "שלב 1: גזירת יעד ארוך טווח",
    mentor: "הפער בין הפוסטר למציאות הוא האתגר הקלאסי. בוא ניקח אלמנט אחד מתוך ה'קהילה המצמיחה' שלכם. מהו היעד ארוך הטווח (למשל, בעוד 3 שנים) שתרצה לראות בהתנהלות הצוות?",
    principal: "אני רוצה שכל מורה בבית הספר ירגיש שיש לו השפעה אמיתית על קבלת ההחלטות הפדגוגיות, ולא רק להנהלת בית הספר. שותפות אמת.",
    insight: "תרגום של מושג ערטילאי כמו 'קהילה' ליעד קונקרטי שמתאר שינוי התנהגותי מובהק (השפעת המורים על החלטות)."
  },
  {
    phase: "שלב 2: תרגום לשגרות ניהול",
    mentor: "יעד מעולה ומדויק. כדי ליישם אותו, אנחנו צריכים להגדיר תהליכים ניהוליים. איזו שגרת ניהול או פלטפורמה אפשר להקים כבר בחודש הקרוב, שתתרגם את היעד הזה למעשה יומיומי?",
    principal: "אולי נקים 'פרלמנט מורים' שייפגש פעם בחודש. כל פעם נציג סוגיה פדגוגית לדיון, וההחלטות יתקבלו שם בהצבעה של הצוות.",
    insight: "ירידה לרמת השטח. בלי שגרה קבועה (פעם בחודש) ופלטפורמה (פרלמנט), היעד ארוך הטווח יישאר רק שאיפה."
  },
  {
    phase: "שלב 3: בניית סדירות ובקרה",
    mentor: "רעיון מצוין. אבל כדי שזה לא יהפוך לעוד 'ישיבת צוות' עייפה, איך נוודא שהתהליך הזה באמת מנוהל ומדיד? מי מנהל את זה ואיך עוקבים אחרי ההחלטות?",
    principal: "רכזת הפדגוגיה תוביל את הפרלמנט. נמדוד את ההצלחה לפי מספר ההחלטות שהתקבלו בפרלמנט ויושמו בפועל בכיתות באותו רבעון.",
    insight: "יצירת מחויבות ובקרה (Accountability). תהליך ניהולי בלי גורם אחראי, סדירות, ומדדי ביצוע דינו לדעוך."
  },
  {
    phase: "שלב 4: סיכום המסע המשותף",
    mentor: "מעולה! שים לב לתהליך שעברנו עכשיו: התחלנו בפוסטר ('קהילה מצמיחה'), עברנו ליעד אסטרטגי ('שותפות מורים'), וסיימנו בניהול תהליך ('פרלמנט פדגוגי' עם אחראית ומדד). איך זה מרגיש?",
    principal: "זה מרגיש שעכשיו החזון באמת קורא לפעולה, ולא נשאר באוויר. אני מרגיש מוכן לקחת את זה לשטח וליישם את זה.",
    insight: "הדיאלוג ממחיש שהבינה המלאכותית אינה 'מכונת מסמכים', אלא שותפה אינטראקטיבית לחשיבה שעוזרת לפרום פלונטרים ניהוליים מורכבים."
  },
  {
    phase: "סיום ההדגמה: תורך לנסות",
    mentor: "ההדגמה הסתיימה. עכשיו הגיע הזמן שלך להתנסות בזה בעצמך בתוך ארגז החול. זכור: אתה לא צריך לבוא עם תשובות מוכנות, הבוט יעזור לך לדייק אותן בדיאלוג.",
    principal: "אני מוכן. בואו נתחיל.",
    insight: "מעבר מתיאוריה לפרקטיקה."
  }
];

export default function VisionDemoDialogue() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < dialogueSteps.length - 1) setCurrentStep(c => c + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(c => c - 1);
  };

  const step = dialogueSteps[currentStep];

  return (
    <div style={{ height: '100%', overflowY: 'auto', backgroundColor: '#f4f8f5', padding: '2rem', paddingBottom: '4rem', direction: 'rtl' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ backgroundColor: '#264030', color: 'white', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem' }}>חזון שקורא לפעולה (סימולציית דיאלוג)</h1>
            <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>הדגמה: למידה דרך האינטראקציה בין המדריך למנהל</p>
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

        {/* Progress */}
        <div style={{ display: 'flex', backgroundColor: '#e7f0ea', height: '8px' }}>
          {dialogueSteps.map((s, i) => (
            <div key={i} style={{ flex: 1, backgroundColor: i <= currentStep ? '#457356' : 'transparent', borderLeft: '1px solid #cfe2d6', transition: 'background-color 0.3s' }} />
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: '2rem', paddingBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', color: '#457356', borderBottom: '2px solid #f4f8f5', paddingBottom: '1rem' }}>
            <MessageSquare size={28} />
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{step.phase}</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
            
            {/* Mentor Bubble */}
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ backgroundColor: '#f2f3f6', padding: '1rem 1.5rem', borderRadius: '16px 16px 0 16px', maxWidth: '80%', border: '1px solid #e5e7ea' }}>
                <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.5rem', fontWeight: 'bold' }}>מדריך (Mentor):</div>
                <div style={{ fontSize: '1.1rem', color: '#202935', lineHeight: '1.5' }}>{step.mentor}</div>
              </div>
            </div>

            {/* Principal Bubble */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ backgroundColor: '#e7ebf1', padding: '1rem 1.5rem', borderRadius: '16px 16px 16px 0', maxWidth: '80%', border: '1px solid #d6dde6' }}>
                <div style={{ fontSize: '0.85rem', color: '#7e92b2', marginBottom: '0.5rem', fontWeight: 'bold' }}>מנהל בית הספר:</div>
                <div style={{ fontSize: '1.1rem', color: '#3f4969', lineHeight: '1.5' }}>{step.principal}</div>
              </div>
            </div>

          </div>

          {/* Meta Insight */}
          <div style={{ backgroundColor: '#f4f8f5', border: '1px dashed #79ae8c', borderRadius: '8px', padding: '1rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <Info size={20} color="#375d45" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ color: '#375d45', fontWeight: 'bold', marginBottom: '0.25rem' }}>התובנה הפדגוגית של השלב:</div>
              <div style={{ color: '#2e4c39', fontSize: '1rem' }}>{step.insight}</div>
            </div>
          </div>

          {/* Final CTA Slide */}
          {currentStep === dialogueSteps.length - 1 && (
            <div style={{ backgroundColor: '#264030', color: 'white', padding: '2rem', borderRadius: '12px', textAlign: 'center', marginTop: '3rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#e7f0ea' }}>ההדגמה הסתיימה בהצלחה</h3>
              <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9 }}>
                ראינו איך הבוט לוקח חזון מופשט, מפרק אותו ליעד ארוך טווח, ומתרגם אותו לשגרות ותהליכים ניהוליים קונקרטיים דרך דיאלוג משותף.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px', margin: '0 auto' }}>
                <button 
                  onClick={() => navigate('/', { state: { autoPrompt: 'אני רוצה להתחיל לעבוד על פירוק החזון הבית ספרי שלי ליעדים ולשגרות ניהוליות, כפי שראינו בהדגמה.' } })}
                  style={{ backgroundColor: '#457356', color: 'white', border: 'none', padding: '1rem', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <MessageSquare size={20} /> קח אותי לארגז החול
                </button>
                <button 
                  onClick={() => navigate('/')}
                  style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '0.75rem', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', transition: 'background-color 0.2s' }}
                >
                  אמשיך בפעם אחרת
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid #e7f0ea', display: 'flex', justifyContent: 'space-between' }}>
          <button 
            onClick={handleNext}
            style={{ display: currentStep === dialogueSteps.length - 1 ? 'none' : 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: '#457356', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            המשך בדיאלוג <ArrowLeft size={18} />
          </button>
          
          <button 
            onClick={handlePrev}
            disabled={currentStep === 0}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: 'transparent', color: currentStep === 0 ? '#cfe2d6' : '#375d45', border: '1px solid', borderColor: currentStep === 0 ? '#cfe2d6' : '#457356', borderRadius: '6px', cursor: currentStep === 0 ? 'not-allowed' : 'pointer' }}
          >
            <ArrowRight size={18} /> חזור
          </button>
        </div>

      </div>
    </div>
  );
}
