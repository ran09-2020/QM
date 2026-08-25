import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Target, Layers, Compass, CheckCircle, Lightbulb } from 'lucide-react';
import { useSchool } from '../contexts/SchoolContext';

export default function VisionDemoReverse() {
  const navigate = useNavigate();
  const { role } = useSchool();
  const isMentor = role === 'mentor';

  const courseSteps = [
  {
    id: 'step1',
    title: 'שלב 1: התוצר (הפרויקטים בשטח)',
    icon: <Target size={32} color="white" />,
    content: (
      <>
        <h3 style={{ color: '#4c1d95', fontSize: '1.05rem', fontWeight: '600', marginBottom: '1.5rem' }}>
          מתחילים מהמציאות האופרטיבית
        </h3>
        <p style={{ fontSize: '1.15rem', lineHeight: '1.7', color: '#334155' }}>
          ההנדסה לאחור מתחילה במקום שבו בית הספר נמצא רוב הזמן - <strong>תהליכים ומנגנונים</strong>. הנה מה שעושה צוות "תיכון אביב" ביומיום:
        </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
          
          <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde047', padding: '1rem', borderRadius: '8px' }}>
            <strong style={{ color: '#854d0e' }}>1. ניהולי-ארגוני</strong>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#713f12' }}>
              <strong>תהליך נגזר:</strong> התאמת מערכת השעות ללמידה עצמאית (משרת יעד 2.1, 4.2).<br/>
              <strong>מנגנון:</strong> שילוב "בלוקי חקר" שעתיים פעם בשבוע במערכת קבועה.
            </p>
          </div>
          
          <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '1rem', borderRadius: '8px' }}>
            <strong style={{ color: '#1e3a8a' }}>2. חברתי-ערכי</strong>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#1d4ed8' }}>
              <strong>תהליך נגזר:</strong> יזמות חברתית למען הקהילה (משרת יעד 1.1, 1.2).<br/>
              <strong>מנגנון:</strong> יום התנדבות שכבתי מרוכז אחת לחודש.
            </p>
          </div>

          <div style={{ backgroundColor: '#fdf4ff', border: '1px solid #f0abfc', padding: '1rem', borderRadius: '8px' }}>
            <strong style={{ color: '#86198f' }}>3. רגשי</strong>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#701a75' }}>
              <strong>תהליך נגזר:</strong> חיזוק תחושת מסוגלות ושיח רגשי (משרת יעד 3.1, 3.2).<br/>
              <strong>מנגנון:</strong> מעגלי שיח קבועים של 20 דק' בפתיחת כל בוקר.
            </p>
          </div>

          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1rem', borderRadius: '8px' }}>
            <strong style={{ color: '#166534' }}>4. פדגוגי</strong>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#15803d' }}>
              <strong>תהליך נגזר:</strong> קהילות מורים לומדות לפיתוח הערכה חלופית (משרת יעד 2.1, 4.1).<br/>
              <strong>מנגנון:</strong> מפגש צוות מקצוע רציף אחת לשבועיים בלו"ז ביה"ס.
            </p>
          </div>
          
        </div>
      </>
    ),
    actionText: 'מאיפה הגיעו הפרויקטים האלה?',
    mentorTip: 'המנהל עמוס בביצועים. התחילו מכאן כדי לייצר לו תחושת מסוגלות והיכרות, ואז תשאלו "למה אנחנו בכלל עושים את זה?".'
  },
  {
    id: 'step2',
    title: 'שלב 2: תתי-היעדים',
    icon: <Layers size={32} color="white" />,
    content: (
      <>
        <h3 style={{ color: '#4c1d95', fontSize: '1.05rem', fontWeight: '600' }}>
          הקילוף הראשון: יעדים אופרטיביים
        </h3>
        <p style={{ fontSize: '1.15rem', lineHeight: '1.7', color: '#334155' }}>
          כשאנחנו בודקים מה המטרה הישירה של כל אותם פרויקטים ומנגנונים, אנחנו מגלים שהם משרתים רשימה ברורה של <strong>תתי-יעדים</strong>:
        </p>

        <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '8px', marginTop: '1.5rem' }}>
          <ul style={{ margin: 0, paddingRight: '1.2rem', color: '#475569', fontSize: '1.05rem', lineHeight: '1.8' }}>
            <li><strong style={{ color: '#1d4ed8' }}>1.1</strong> העמקת הזהות המקומית והמורשת.</li>
            <li><strong style={{ color: '#1d4ed8' }}>1.2</strong> שגרות של חסד, יזמות ומעורבות.</li>
            <li><strong style={{ color: '#15803d' }}>2.1</strong> מעבר להערכה חלופית רב-תחומית.</li>
            <li><strong style={{ color: '#15803d' }}>2.2</strong> חיזוק מיומנויות חקר ובחירה.</li>
            <li><strong style={{ color: '#7e22ce' }}>3.1</strong> מיסוד ערוצי הקשבה לתלמיד ולמורה.</li>
            <li><strong style={{ color: '#7e22ce' }}>3.2</strong> בניית שפה אחידה של פסיכולוגיה חיובית.</li>
            <li><strong style={{ color: '#b45309' }}>4.1</strong> פיתוח קהילות לומדות בצוות (PLC).</li>
            <li><strong style={{ color: '#b45309' }}>4.2</strong> אוטונומיה פדגוגית לכל שכבה.</li>
          </ul>
        </div>
      </>
    ),
    actionText: 'ומאיפה נגזרו תתי-היעדים האלו?',
    mentorTip: 'אם פרויקט מסוים (מהשלב הקודם) לא משרת אף אחד מהיעדים הללו, זה הזמן לשאול: "אז למה הושקעו בו משאבים?"'
  },
  {
    id: 'step3',
    title: 'שלב 3: מטרות העל',
    icon: <CheckCircle size={32} color="white" />,
    content: (
      <>
        <h3 style={{ color: '#4c1d95', fontSize: '1.05rem', fontWeight: '600' }}>
          הקילוף השני: מטרות אסטרטגיות ארוכות טווח
        </h3>
        <p style={{ fontSize: '1.15rem', lineHeight: '1.7', color: '#334155' }}>
          תתי-היעדים המדויקים אינם עומדים בפני עצמם. אם מקבצים אותם, רואים שהם למעשה פירוק של <strong>4 מטרות-על</strong> אסטרטגיות:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
          <div style={{ backgroundColor: '#f8fafc', padding: '1rem 1.5rem', borderRadius: '6px', borderRight: '4px solid #1d4ed8', borderLeft: '1px solid #e2e8f0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
            <strong style={{ color: '#1d4ed8', fontSize: '1.1rem' }}>1. חיבור וזהות קהילתית</strong>
          </div>
          <div style={{ backgroundColor: '#f8fafc', padding: '1rem 1.5rem', borderRadius: '6px', borderRight: '4px solid #15803d', borderLeft: '1px solid #e2e8f0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
            <strong style={{ color: '#15803d', fontSize: '1.1rem' }}>2. טיפוח לומד עצמאי</strong>
          </div>
          <div style={{ backgroundColor: '#f8fafc', padding: '1rem 1.5rem', borderRadius: '6px', borderRight: '4px solid #7e22ce', borderLeft: '1px solid #e2e8f0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
            <strong style={{ color: '#7e22ce', fontSize: '1.1rem' }}>3. אקלים מוגן ודיאלוגי</strong>
          </div>
          <div style={{ backgroundColor: '#f8fafc', padding: '1rem 1.5rem', borderRadius: '6px', borderRight: '4px solid #b45309', borderLeft: '1px solid #e2e8f0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
            <strong style={{ color: '#b45309', fontSize: '1.1rem' }}>4. תרבות ניהולית מתקדמת</strong>
          </div>
        </div>
      </>
    ),
    actionText: 'ומאיפה נלקחו מטרות-העל הללו?',
    mentorTip: 'מטרות העל הן "משפטי החזון" (ההבטחות הגדולות). כאן המנהל רואה שהחלוקה למספרים ולתתי-יעדים היא זו שהפכה את הסיסמאות למציאות.'
  },
  {
    id: 'step4',
    title: 'שלב 4: הצהרת החזון',
    icon: <Compass size={32} color="white" />,
    content: (
      <>
        <h3 style={{ color: '#4c1d95', fontSize: '1.05rem', fontWeight: '600' }}>
          הקילוף השלישי: איחוד למסמך אחד
        </h3>
        <p style={{ fontSize: '1.15rem', lineHeight: '1.7', color: '#334155' }}>
          כאשר אנחנו מאחדים את מטרות העל (החיבור, הלומד העצמאי, האקלים, והניהול), אנחנו מקבלים בחזרה את הטקסט ההוליסטי המלא: <strong>הצהרת החזון</strong>.
        </p>

        <div style={{ backgroundColor: '#fdf4ff', padding: '2rem', borderRadius: '8px', border: '2px solid #e879f9', marginTop: '1.5rem', boxShadow: 'inset 0 2px 4px 0 rgba(0,0,0,0.06)' }}>
          <h4 style={{ margin: '0 0 1rem 0', color: '#86198f' }}>חזון תיכון אביב</h4>
          <p style={{ fontSize: '1.05rem', color: '#701a75', fontWeight: 'bold', margin: 0, lineHeight: '1.8' }}>
            "תיכון אביב מהווה עוגן של שייכות ואקטיביות עירונית. <br/><br/>
            בית הספר מצמיח בוגרים שלוקחים אחריות על למידתם ומובילים יוזמות בעלות ערך בקהילה הרחבה.<br/><br/>
            הצוות החינוכי פועל כקהילה לומדת ויוזמת, הנתמכת על ידי סביבה ארגונית גמישה המאפשרת צמיחה, רווחה וחדשנות."
          </p>
        </div>
      </>
    ),
    actionText: 'מאיפה נולדה ההצהרה הזו?',
    mentorTip: 'בשלב הזה המנהל מבין שחזון אינו "טקסט אווירה". כל משפט ומשפט בו קשור ישירות לפרויקטים (שלב 1) ולמנגנונים בבית הספר.'
  },
  {
    id: 'step5',
    title: 'שלב 5: השורש (ה-DNA הארגוני)',
    icon: <Lightbulb size={32} color="white" />,
    content: (
      <>
        <h3 style={{ color: '#4c1d95', fontSize: '1.05rem', fontWeight: '600' }}>
          סוף ההנדסה לאחור: מודל 1-3-5
        </h3>
        <p style={{ fontSize: '1.15rem', lineHeight: '1.7', color: '#334155' }}>
          הצהרת החזון לא צנחה מהשמיים. היא נולדה (בשילוב עם הפער הקהילתי) מתוך מה שבית הספר כבר עשה מצוין בעבר:
        </p>

        <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <strong style={{ color: '#334155', fontSize: '1.1rem' }}>5 פעולות עבר מצטיינות:</strong>
              <p style={{ margin: '0.5rem 0 0 0', color: '#64748b', fontSize: '1rem', lineHeight: '1.5' }}>
                שיחות בוקר אישיות | חונכות שכבתית | מועצת תלמידים אקטיבית<br/>מעגלי שיח בצוות | שיחות חתך אישיות
              </p>
            </div>
            
            <div style={{ height: '30px', width: '2px', backgroundColor: '#cbd5e1', marginBottom: '1.5rem' }}></div>
            
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <strong style={{ color: '#334155', fontSize: '1.1rem' }}>3 עקרונות מנחים שחולצו מהן:</strong>
              <p style={{ margin: '0.5rem 0 0 0', color: '#64748b', fontSize: '1rem', lineHeight: '1.5' }}>
                קשר אישי | אקטיביות ומנהיגות | פיתוח רגשי לחוסן
              </p>
            </div>
            
            <div style={{ height: '30px', width: '2px', backgroundColor: '#cbd5e1', marginBottom: '1.5rem' }}></div>

            <div style={{ textAlign: 'center' }}>
              <strong style={{ color: '#4338ca', fontSize: '1.2rem' }}>1 רציונאל ליבה שהרכיב את החזון:</strong>
              <p style={{ margin: '0.5rem 0 0 0', color: '#4f46e5', fontSize: '1.1rem', fontWeight: 'bold' }}>
                "קהילה פנימית בטוחה המקדמת למידה דרך קשר ואקטיביות"
              </p>
            </div>

          </div>
        </div>
      </>
    ),
    actionText: 'סיום סימולציה',
    mentorTip: 'זה הרגע שבו הכל מתחבר. המנהל רואה שהיומיום העמוס שלו (הפרויקטים מהשלב הראשון) הוא בעצם ביטוי מעשי וישיר ל-DNA הכי עמוק ושורשי של בית הספר.'
  },
  {
    id: 'step6',
    title: 'הגיע הזמן ליישם',
    icon: <Target size={32} color="white" />,
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2rem' }}>
        {role === 'mentor' && (
          <div style={{ backgroundColor: '#fef3c7', borderRight: '4px solid #f59e0b', padding: '1rem', borderRadius: '6px', marginBottom: '2rem', width: '100%', maxWidth: '600px' }}>
            <strong style={{ color: '#92400e', fontSize: '1rem', display: 'block', marginBottom: '0.5rem' }}>💡 זרקור למדריך: הגשר לשיחה האישית</strong>
            <p style={{ margin: 0, color: '#92400e', fontSize: '0.9rem' }}>זהו רגע האמת. השתמש במסך זה כדי לאבחן עם המנהל איפה הוא עומד, והנחה אותו ללחוץ על הכפתור שייקח אתכם לעבודה מעשית בצ'אט.</p>
          </div>
        )}
        {role !== 'mentor' && (
          <div style={{ textAlign: 'center', marginBottom: '2rem', maxWidth: '650px' }}>
            <p style={{ fontSize: '1.15rem', color: '#475569', lineHeight: '1.6', margin: '0 0 1rem 0' }}>
              ראית כיצד חזון מופשט הופך למנוע עבודה יומיומי (או כיצד פרויקטים מתחברים לחזון). 
              <br/>
              כדי שזה לא יישאר רק ברמת התיאוריה, אני מזמין אותך לעבור עכשיו ל<b>מרחב השיחה האישית</b> שלנו.
            </p>
            <p style={{ fontSize: '1.15rem', color: '#475569', lineHeight: '1.6', margin: 0 }}>
              נבנה יחד את <b>המטריצה האסטרטגית של בית הספר שלך</b>. איפה אתה עומד כרגע?
            </p>
          </div>
        )}
        <h3 style={{ margin: '0 0 2rem 0', color: '#1e293b', fontSize: '1.25rem', textAlign: 'center' }}>
          {role === 'mentor' ? 'שקף למנהל את המצב ובחרו נקודת פתיחה:' : 'ראית איך זה עובד. עכשיו תורך.'}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', width: '100%', maxWidth: '600px' }}>
          
          <button 
            onClick={() => navigate('/', { state: { autoPrompt: 'יש לי כבר חזון מנוסח, צריך לעזור לי לפרק אותו למטרות-על ותתי-יעדים.' } })}
            style={{ padding: '1.25rem', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem', color: '#334155', fontWeight: '600', textAlign: 'right', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
          >
            <span>1. יש לי כבר חזון מנוסח, צריך לפרק אותו</span>
            <ArrowLeft size={20} color="#4f46e5" />
          </button>
          
          <button 
            onClick={() => navigate('/', { state: { autoPrompt: 'יש לי המון פרויקטים בשטח, בוא נעשה עליהם הנדסה לאחור ונראה לאן הם מתחברים.' } })}
            style={{ padding: '1.25rem', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem', color: '#334155', fontWeight: '600', textAlign: 'right', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
          >
            <span>2. יש לי בעיקר פרויקטים בשטח, נתחיל משם</span>
            <ArrowLeft size={20} color="#4f46e5" />
          </button>
          
          <button 
            onClick={() => navigate('/', { state: { autoPrompt: 'אין לי כלום. בוא נתחיל מאפס עם שיטת 1-3-5.' } })}
            style={{ padding: '1.25rem', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem', color: '#334155', fontWeight: '600', textAlign: 'right', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
          >
            <span>3. מתחילים מאפס (שיטת 1-3-5)</span>
            <ArrowLeft size={20} color="#4f46e5" />
          </button>

          <button 
            onClick={() => navigate('/')}
            style={{ padding: '1.1rem 1.25rem', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontSize: '1.05rem', color: '#64748b', fontWeight: '600', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '0.5rem', transition: 'background-color 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
          >
            <span>אמשיך את זה בפעם אחרת</span>
          </button>

        </div>
      </div>
    ),
    mentorTip: 'לחיצה על כל אחד מהכפתורים האלה תסיים את התירגול ותעביר אתכם מיד למרחב העבודה של השיחה האישית.',
    actionText: 'לשיחה האישית'
  }
];


  const [currentStep, setCurrentStep] = useState(0);

  const step = courseSteps[currentStep];
  const isLast = currentStep === courseSteps.length - 1;
  const isFirst = currentStep === 0;

  return (
    <div style={{ height: '100%', display: 'flex', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '1rem', direction: 'rtl' }}>
      <div style={{ width: '100%', maxWidth: '850px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
        
        {/* Header (Fixed) */}
        <div style={{ backgroundColor: '#1e293b', color: 'white', padding: '0.6rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {step.icon}
            <div>
              <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '500' }}>{step.title}</h1>
            </div>
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

        {/* Progress Bar (Fixed) */}
        <div style={{ display: 'flex', height: '6px', backgroundColor: '#e2e8f0', flexShrink: 0, flexDirection: 'row' }}>
          {courseSteps.map((_, idx) => (
            <div 
              key={idx} 
              style={{ 
                flex: 1, 
                backgroundColor: idx <= currentStep ? '#8b5cf6' : 'transparent',
                borderRight: idx > 0 ? '1px solid white' : 'none',
                transition: 'background-color 0.4s ease-in-out'
              }} 
            />
          ))}
        </div>

        {/* Content Body (Scrollable) */}
        <div style={{ padding: '1.5rem 2rem', flex: 1, overflowY: 'auto' }}>
          {step.content}

          {isMentor && step.mentorTip && (
            <div style={{ backgroundColor: '#fef3c7', borderRight: '4px solid #f59e0b', padding: '1.25rem', borderRadius: '6px', marginTop: '2rem' }}>
              <strong style={{ color: '#92400e', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                <Lightbulb size={20}/> זרקור למדריך (התפיסה הפדגוגית)
              </strong>
              <p style={{ margin: '0.75rem 0 0 0', color: '#92400e', fontSize: '1.05rem', lineHeight: '1.5' }}>
                {step.mentorTip}
              </p>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div style={{ padding: '1.5rem 2.5rem', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row-reverse', gap: '2rem', flexShrink: 0 }}>
          
          <button 
            onClick={() => {
              if (isLast) navigate(-1);
              else setCurrentStep(prev => prev + 1);
            }}
            style={{ 
              padding: '0.6rem 1.25rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', 
              borderRadius: '50px', cursor: 'pointer', fontSize: '1.05rem', fontWeight: 'bold', 
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.3)'
            }}
          >
            {isLast ? 'סיום תירגול' : step.actionText} {!isLast && <ArrowLeft size={18} />}
          </button>

          {!isFirst && (
            <button 
              onClick={() => setCurrentStep(prev => prev - 1)}
              style={{ 
                backgroundColor: 'transparent', color: '#64748b', border: 'none', cursor: 'pointer', 
                fontSize: '1rem', textDecoration: 'underline' 
              }}
            >
              חזרה לשלב קודם
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
