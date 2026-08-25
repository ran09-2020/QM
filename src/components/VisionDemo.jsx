import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowRight, ArrowLeft, Lightbulb, Target, CheckCircle, Compass, Layers, Zap } from 'lucide-react';
import { useSchool } from '../contexts/SchoolContext';

export default function VisionDemo() {
  const navigate = useNavigate();
  const { role } = useSchool();
  const isMentor = role === 'mentor';

  const courseSteps = [
  {
    id: 'intro',
    title: 'מבוא: מחזון למציאות',
    icon: <Compass size={32} color="white" />,
    content: (
      <>
        <h3 style={{ color: '#334155', fontSize: '1.25rem', fontWeight: '600' }}>ברוכים הבאים</h3>
        <p style={{ fontSize: '1.15rem', lineHeight: '1.7', color: '#334155' }}>
          האם משפט החזון של בית הספר שלכם הוא רק פוסטר שתלוי על הקיר בכניסה? או שהוא גם מוביל לביצועים של "מחר בבוקר"?
        </p>
        <p style={{ fontSize: '1.15rem', lineHeight: '1.7', color: '#334155' }}>
          במיני-קורס זה נעקוב אחר מקרה הבוחן של <strong>"תיכון אביב"</strong>, ונראה כיצד הם הפכו אוסף של יעדי-על רחבים למנוע עבודה אסטרטגי המקיף את כלל המעגלים: תלמידים, צוות, ארגון וקהילה.
        </p>
        
        <details style={{ marginTop: '1.5rem', backgroundColor: '#f1f5f9', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
          <summary style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0f172a', cursor: 'pointer', outline: 'none' }}>
            מדוע חזון חייב לקרוא לפעולה? - לחצו כאן
          </summary>
          <p style={{ marginTop: '1rem', marginBottom: 0, fontSize: '1.05rem', lineHeight: '1.7', color: '#334155' }}>
            חזון אינו יכול להישאר משפט מעוצב על הקיר בלובי או הצהרה מופשטת. חזון מסמן את הכיוון אליו בית הספר שואף לצמוח. כדי לחולל שינוי אמיתי ולבסס מצוינות ארגונית, עליו להיתרגם ליעדים אסטרטגיים רב-שנתיים ולמנגנוני פעולה מוגדרים המכוונים את כלל העשייה הבית-ספרית.
          </p>
        </details>
      </>
    )
  },
  {
    id: 'step0',
    title: 'שלב 0: צומת ההחלטה (אבחון נקודת המוצא)',
    icon: <Target size={32} color="white" />,
    content: (
      <>
        <h3 style={{ color: '#4c1d95', fontSize: '1.25rem', fontWeight: '600' }}>ההחלטה הניהולית הראשונה</h3>
        <p style={{ fontSize: '1.15rem', lineHeight: '1.7', color: '#334155' }}>
          מנהל תיכון אביב הגיע עם מסמך חזון עמוס במושגים כלליים ("מצוינות", "הכלה", "יזמות"). 
          בשלב 0 עלינו לבחור מאיזו גיאומטריה מתחילים לעבוד:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
          <div style={{ backgroundColor: '#fef2f2', padding: '1.5rem', borderRadius: '8px', border: '1px solid #fca5a5' }}>
            <h4 style={{ color: '#991b1b', marginTop: 0 }}>Top-Down (מההצהרות הגדולות אל השטח)</h4>
            <p style={{ margin: 0, color: '#7f1d1d' }}>לנסות להטמיע את מטרות-העל הרחבות מלמעלה למטה.</p>
          </div>
          <div style={{ backgroundColor: '#f0fdf4', padding: '1.5rem', borderRadius: '8px', border: '1px solid #86efac' }}>
            <h4 style={{ color: '#166534', marginTop: 0 }}>Bottom-Up (נקודת התחלה מהיש)</h4>
            <p style={{ margin: 0, color: '#14532d' }}>להשהות לרגע את משפטי החזון הגדולים, ולרדת לשטח כדי לאסוף את ה-DNA האמיתי מתוך עשייה קיימת.</p>
          </div>
        </div>
        <div style={{ marginTop: '2rem', backgroundColor: '#e0e7ff', padding: '1rem', borderRight: '4px solid #4f46e5', borderRadius: '4px' }}>
          <strong>החלטה:</strong> בתיכון אביב בחרנו במסלול <strong>Bottom-Up</strong>. מתחילים מהיש.
        </div>
      </>
    ),
    mentorTip: 'אל תפחד לומר למנהל: "החזון שכתבת יפה, אבל כדאי לחבר אותו לעשייה. בוא נתחיל מהשטח."'
  },
  {
    id: 'step1',
    title: 'שלב 1: איסוף וזיקוק (שיטת 1-3-5)',
    icon: <Layers size={32} color="white" />,
    content: (
      <>
        <h3 style={{ color: '#4c1d95', fontSize: '1.25rem', fontWeight: '600' }}>בניית הרציונאל מתוך השטח</h3>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#334155' }}>
          ביקשנו מהמנהל להציג 5 <strong>מהלכים</strong> (ולא סתם פעולות טקטיות קטנות) שהוא באמת גאה בהם כיום.
        </p>
        
        <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
          <h4 style={{ color: '#334155', marginTop: 0 }}>5 מהלכים קיימים (היש):</h4>
          <ol style={{ lineHeight: '1.6', color: '#475569' }}>
            <li>פתיחת בוקר של 15 דקות שיח רגשי עם המחנך.</li>
            <li>מודל חונכות שכבתית (בוגרים וחט"ב).</li>
            <li>מועצת תלמידים שמנהלת 100% מטקסי בית הספר.</li>
            <li>מעגלי שיח ולמידת עמיתים למורים בכל יום ג'.</li>
            <li>שיחות חתך אישיות מחציתיות.</li>
          </ol>
          <hr style={{ border: 'none', borderTop: '1px dashed #cbd5e1', margin: '1.5rem 0' }}/>
          <h4 style={{ color: '#334155' }}>3 עקרונות מנחים שחולצו:</h4>
          <ul style={{ lineHeight: '1.6', color: '#475569', marginBottom: '1rem' }}>
            <li>קשר אישי כבסיס לכל למידה.</li>
            <li>אקטיביות ומנהיגות (למידה פעילה).</li>
            <li>חוסן ופיתוח רגשי (לצוות ולתלמידים).</li>
          </ul>
          <div style={{ backgroundColor: '#f1f5f9', padding: '1rem', borderRadius: '6px', borderRight: '4px solid #64748b', fontSize: '0.95rem', color: '#475569', marginBottom: '1.5rem' }}>
            <strong style={{ color: '#334155' }}>מהו "עיקרון מנחה"?</strong><br/>
            הוא למעשה ״המנהל האמיתי״ של בית הספר 😉<br/>
            ברמה המקצועית, זהו "קוד ההפעלה" הערכי המכוון את קבלת ההחלטות היומיומית. כשצוות מתלבט כיצד לפתור משבר או האם לאשר יוזמה חדשה, העיקרון המנחה משמש כמצפן ארגוני שקובע מהי הפעולה הנכונה עבורכם.
          </div>
          <hr style={{ border: 'none', borderTop: '1px dashed #cbd5e1', margin: '1.5rem 0' }}/>
          <h4 style={{ color: '#334155' }}>1 רציונאל ליבה (הזהות הנוכחית):</h4>
          <p style={{ fontSize: '1.25rem', color: '#4338ca', fontWeight: 'bold' }}>"קהילה פנימית בטוחה המקדמת למידה דרך קשר ואקטיביות."</p>
        </div>
      </>
    ),
    mentorTip: 'זה בסדר גמור אם 5 המהלכים אינם מאוזנים ונוגעים רק בפדגוגיה. זה משקף את המציאות הנוכחית (היש). תפקידך אינו לתקן אותם עדיין, אלא לחלץ מהם את הרציונאל.'
  },
  {
    id: 'delta',
    title: 'שלב ביניים: המטוטלת והפער',
    icon: <Zap size={32} color="white" />,
    content: (
      <>
        <h3 style={{ color: '#4c1d95', fontSize: '1.25rem', fontWeight: '600' }}>"חזון מסתכל בעיקר אל העתיד"</h3>
        <p style={{ fontSize: '1.15rem', lineHeight: '1.7', color: '#334155' }}>
          רציונאל הליבה מדהים. עכשיו אנחנו בודקים את <strong>הפער</strong> אל מול שאיפות העתיד.
        </p>
        <div style={{ backgroundColor: '#eff6ff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#1e3a8a', fontStyle: 'italic', margin: 0 }}>
            <strong>מנטור:</strong> "לפי הרציונאל, אתם חזקים מאוד בתוך החומות. אבל איפה הקהילה הרחבה? לאן אתם שואפים לצמוח?"<br/><br/>
            <strong>מנהל:</strong> "אנחנו מעולים בלהיות 'חממה'. השאיפה לעתיד היא להפוך ל'עוגן קהילתי'. התלמידים והצוות צריכים להיות מעורבים במה שקורה בעיר."
          </p>
        </div>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#334155', marginTop: '1.5rem' }}>
          <strong>בדיקת המטוטלת:</strong> האם מתוך 5 המהלכים הקיימים שלנו יש משהו שמתכתב עם "עוגן קהילתי"? <em>התשובה היא לא.</em> גילינו פער אמיתי שידרוש בניית פרויקטים מאפס!
        </p>
      </>
    ),
    mentorTip: 'כאן אתה מאתגר את הרציונאל מול השאיפה. אם אין שום מהלך שמתכתב עם השאיפה - זהו פער לוגי ואופרטיבי שצריך לטפל בו בחזון החדש.'
  },
  {
    id: 'step2',
    title: 'שלב 2: תמונת העתיד ההוליסטית',
    icon: <CheckCircle size={32} color="white" />,
    content: (
      <>
        <h3 style={{ color: '#4c1d95', fontSize: '1.25rem', fontWeight: '600' }}>ניסוח הצהרת החזון (הזהות החדשה)</h3>
        <p style={{ fontSize: '1.15rem', lineHeight: '1.7', color: '#334155' }}>
          אנחנו מחברים את <strong>היש</strong> (קהילה בטוחה ואקטיבית) עם <strong>החסר</strong> (עוגן קהילתי) לפסקה הוליסטית אחת. חזון טוב אינו רק משפט סיסמה על התלמיד, הוא מתייחס לכל מעגלי העשייה.
        </p>
        
        <div style={{ backgroundColor: '#fdf4ff', padding: '2rem', borderRadius: '8px', border: '2px solid #e879f9', marginTop: '1.5rem' }}>
          <h4 style={{ margin: '0 0 1rem 0', color: '#86198f' }}>חזון תיכון אביב</h4>
          <p style={{ fontSize: '1.25rem', color: '#701a75', fontWeight: 'bold', margin: 0, lineHeight: '1.8' }}>
            "תיכון אביב מהווה עוגן של שייכות ואקטיביות עירונית. <br/><br/>
            בית הספר מצמיח בוגרים שלוקחים אחריות על למידתם ומובילים יוזמות בעלות ערך בקהילה הרחבה.<br/><br/>
            הצוות החינוכי פועל כקהילה לומדת ויוזמת, הנתמכת על ידי סביבה ארגונית גמישה המאפשרת צמיחה, רווחה וחדשנות."
          </p>
        </div>
      </>
    ),
    mentorTip: 'החזון ההוליסטי הזה מהווה מפת עבודה מושלמת: משפט 1 = תחום חברתי (שייכות), משפט 2 = תחום פדגוגי (אחריות למידה), משפט 3 = תחום צוות וארגון. שום דבר לא נשאר באוויר.'
  },
  {
    id: 'step3',
    title: 'שלב 3: גזירת תתי-יעדים (6 מטרות העל)',
    icon: <Layers size={32} color="white" />,
    content: (
      <>
        <h3 style={{ color: '#4c1d95', fontSize: '1.25rem', fontWeight: '600' }}>מהחזון אל יעדים ארוכי טווח</h3>
        <p style={{ fontSize: '1.15rem', lineHeight: '1.7', color: '#334155' }}>
          בשלב זה אנו קוראים שוב את משפטי החזון, וגוזרים מתוכם בצורה ישירה <strong>תתי-יעדים</strong> (מטרות-על) שיהוו את המצפן לפעולה לשנים הקרובות.
        </p>
        <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '1.5rem' }}>
          <p style={{ margin: 0, color: '#334155', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            לדוגמה, מתוך חזון של "תיכון אביב" נגזרו 6 היעדים הבאים:
          </p>
          <ol style={{ margin: 0, color: '#334155', fontSize: '1.05rem', lineHeight: '1.8' }}>
            <li>חיבור מורשת העבר לאתגרי המחר.</li>
            <li>הצמחת אדם טוב, ערכי ומוסרי המחובר לסביבה.</li>
            <li>טיפוח לומד עצמאי וחוקר המצויד בכלים למציאות משתנה.</li>
            <li>התחדשות פדגוגית המשלבת חדשנות ובינה.</li>
            <li>שיתופי פעולה עם הקהילה וגורמים בסביבה.</li>
            <li>מצוינות ארגונית לטיפוח חוסן של הארגון.</li>
          </ol>
        </div>
      </>
    ),
    mentorTip: 'ודאו שהיעדים הנגזרים אינם רק הצהרות נוספות, אלא מטרות ארוכות-טווח שניתן יהיה לגזור מהן תוצאות מעשיות.'
  },
  {
    id: 'step4',
    title: 'שלב 4: מפת מיפוי לפי 4 תחומי העשייה',
    icon: <Target size={32} color="white" />,
    content: (
      <>
        <h3 style={{ color: '#4c1d95', fontSize: '1.25rem', fontWeight: '600' }}>החזון פוגש את השטח</h3>
        <p style={{ fontSize: '1.15rem', lineHeight: '1.7', color: '#334155' }}>
          את משימות החזון שגזרנו, אנו מתרגמים כעת ל<strong>תהליכי מפתח</strong> אופרטיביים בתוך מטריצה של 4 תחומי העשייה המרכזיים של בית הספר:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
          
          <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde047', padding: '1.25rem', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#854d0e', fontSize: '1.1rem' }}>1. ניהולי-ארגוני</h4>
            <p style={{ fontSize: '0.95rem', color: '#713f12', margin: 0 }}>
              באחריות צוות ניהול.<br/>
              <strong>תהליכים:</strong> תרבות ניהול וביזור סמכויות, ניהול תהליכים, בניית מבנה ארגוני (לו"ז דו-שנתי).
            </p>
          </div>

          <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '1.25rem', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e3a8a', fontSize: '1.1rem' }}>2. חברתי-ערכי</h4>
            <p style={{ fontSize: '0.95rem', color: '#1d4ed8', margin: 0 }}>
              באחריות רכזת חברתית.<br/>
              <strong>תהליכים:</strong> זהות מקומית ומחוברת שורשים, מפגשי במה, תרומה לקהילה.
            </p>
          </div>

          <div style={{ backgroundColor: '#fdf4ff', border: '1px solid #f0abfc', padding: '1.25rem', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#86198f', fontSize: '1.1rem' }}>3. רגשי</h4>
            <p style={{ fontSize: '0.95rem', color: '#701a75', margin: 0 }}>
              באחריות יועצת ביה"ס.<br/>
              <strong>תהליכים:</strong> ערוצי הקשבה ושיח דיאלוגי, פסיכולוגיה חיובית ואקלים מוגן.
            </p>
          </div>

          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1.25rem', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#166534', fontSize: '1.1rem' }}>4. פדגוגי</h4>
            <p style={{ fontSize: '0.95rem', color: '#15803d', margin: 0 }}>
              באחריות רכזת פדגוגית / מנהלת חטיבה.<br/>
              <strong>תהליכים:</strong> תוכנית ספירלית ללומד עצמאי, למידה עפ"י אינטליגנציות.
            </p>
          </div>

        </div>
      </>
    ),
    mentorTip: 'חשוב למפות מיהו "הכתובת" לכל תהליך בארגון. כך מוודאים ששום היבט של החזון אינו נופל בין הכיסאות.'
  },
  {
    id: 'step5',
    title: 'שלב 5: מנגנוני ביצוע - מבחן ה"מחר בבוקר"',
    icon: <CheckCircle size={32} color="white" />,
    content: (
      <>
        <h3 style={{ color: '#4c1d95', fontSize: '1.25rem', fontWeight: '600' }}>הופכים תהליך למנגנון</h3>
        <p style={{ fontSize: '1.15rem', lineHeight: '1.7', color: '#334155' }}>
          תהליך = סדרת פעולות המכוונות לתוצאה.<br/>
          <strong>מנגנון = לכל תהליך יש צוות יישום + אחראי תהליך + בקרה + סדירות.</strong>
        </p>
        <p style={{ fontSize: '1.15rem', lineHeight: '1.7', color: '#334155' }}>
          לדוגמה, יעד של "תרבות ניהול וביזור סמכויות":
        </p>
        <ul style={{ lineHeight: '1.8', color: '#334155', fontSize: '1.15rem', marginTop: '1rem', backgroundColor: '#f8fafc', padding: '1rem 2rem', borderRadius: '8px' }}>
          <li><strong>צוות יישום:</strong> צוות ניהול מתרחב</li>
          <li><strong>סדירות במערכת:</strong> שעתיים במערכת בכל יום ג'</li>
          <li><strong>בקרה:</strong> שיחות משוב רבעוניות, תיעוד החלטות ביומן ניהול</li>
        </ul>
      </>
    ),
    mentorTip: 'ללא המנגנון בשלב 5 - הפרויקט הוא משאלת לב. עמודת ה"בקרה" היא החשובה ביותר שרבים שוכחים למלא.'
  },
  {
    id: 'step6',
    title: '"מסמך חזון" (אפשרויות ייצוג שונות)',
    icon: <Layers size={32} color="white" />,
    content: (
      <>
        <h3 style={{ color: '#4c1d95', fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
          התוצר הסופי: אין "שטאנץ" אחד
        </h3>
        
        <div style={{ backgroundColor: '#fff7ed', border: '1px solid #fdba74', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', color: '#c2410c' }}>
          <strong>חשוב לזכור:</strong> את המסמך הסופי ניתן לייצג במספר דרכים, בהתאם למה שהכי משרת את הצוות. 
          כאן נכנס לתמונה <strong>תפקידו הקריטי של המדריך</strong> - ללוות את המנהל בבחירת הייצוג הנכון שיניע את הצוות לפעולה.
        </div>

        {/* Example 1 */}
        <details style={{ marginBottom: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
          <summary style={{ padding: '1.25rem', backgroundColor: '#f1f5f9', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', color: '#1e293b' }}>
            ייצוג א': פריטת 4 מטרות-העל לתתי-יעדים
          </summary>
          <div style={{ padding: '1.5rem', backgroundColor: 'white' }}>
            <p style={{ fontSize: '0.95rem', color: '#475569', marginBottom: '1.5rem' }}>
              בתצורה זו, מציגים את מטרות העל של בית הספר (העמודות), ותחת כל מטרה מפרטים את תתי-היעדים שלה. המספור (למשל 1.1, 1.2) מייצג את מטרת-העל (1) והיעד הנגזר ממנה.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '6px' }}>
                <strong style={{ color: '#0f172a' }}>מטרת-על 1: חיבור וזהות קהילתית</strong>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#475569' }}>1.1 העמקת הזהות המקומית<br/>1.2 בניית שותפויות אסטרטגיות</p>
              </div>
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '6px' }}>
                <strong style={{ color: '#0f172a' }}>מטרת-על 2: טיפוח לומד עצמאי</strong>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#475569' }}>2.1 שילוב הערכה חלופית מגוונת<br/>2.2 הטמעת מיומנויות למידה בצוות</p>
              </div>
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '6px' }}>
                <strong style={{ color: '#0f172a' }}>מטרת-על 3: אקלים מוגן ודיאלוגי</strong>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#475569' }}>3.1 מיסוד מעגלי שיח קבועים<br/>3.2 הכלה והכרה במגוון</p>
              </div>
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '6px' }}>
                <strong style={{ color: '#0f172a' }}>מטרת-על 4: תרבות ניהולית מתקדמת</strong>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#475569' }}>4.1 ביזור סמכויות ואוטונומיה<br/>4.2 ניהול תהליכים מבוסס נתונים</p>
              </div>
            </div>
          </div>
        </details>

        {/* Example 2 */}
        <details style={{ marginBottom: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
          <summary style={{ padding: '1.25rem', backgroundColor: '#f1f5f9', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', color: '#1e293b' }}>
            ייצוג ב': מטריצת מנגנונים (תהליך משרת מספר יעדים)
          </summary>
          <div style={{ padding: '1.5rem', backgroundColor: 'white' }}>
            <p style={{ fontSize: '0.95rem', color: '#475569', marginBottom: '1.5rem' }}>
              כאן מציגים את 4 תחומי העשייה ואת התהליכים המרכזיים שלהם. מסמנים בצהוב לאילו תתי-יעדים (מייצוג א') כל תהליך תורם. תהליך אחד עשוי לשרת בו-זמנית מספר יעדים שונים.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '6px' }}>
                <strong style={{ color: '#0f172a' }}>1. ניהולי-ארגוני (צוות ניהול)</strong>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#475569' }}>
                  <strong>תהליך:</strong> התאמת מבנה מערכת הלמידה.<br/>
                  <strong>משרת משימות:</strong> <span style={{ backgroundColor: '#fef08a', padding: '0.1rem 0.3rem' }}>2.1, 2.2, 4.1</span>
                </p>
              </div>
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '6px' }}>
                <strong style={{ color: '#0f172a' }}>2. חברתי-ערכי (רכזת חברתית)</strong>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#475569' }}>
                  <strong>תהליך:</strong> שגרות התנדבות בקהילה.<br/>
                  <strong>משרת משימות:</strong> <span style={{ backgroundColor: '#fef08a', padding: '0.1rem 0.3rem' }}>1.1, 1.2, 3.2</span>
                </p>
              </div>
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '6px' }}>
                <strong style={{ color: '#0f172a' }}>3. רגשי (יועצת)</strong>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#475569' }}>
                  <strong>תהליך:</strong> הטמעת שפה אקלימית אחידה.<br/>
                  <strong>משרת משימות:</strong> <span style={{ backgroundColor: '#fef08a', padding: '0.1rem 0.3rem' }}>3.1, 3.2, 4.2</span>
                </p>
              </div>
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '6px' }}>
                <strong style={{ color: '#0f172a' }}>4. פדגוגי (רכזת פדגוגית)</strong>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#475569' }}>
                  <strong>תהליך:</strong> פיתוח משימות למידה מבוססות פרויקטים.<br/>
                  <strong>משרת משימות:</strong> <span style={{ backgroundColor: '#fef08a', padding: '0.1rem 0.3rem' }}>1.1, 2.1, 2.2</span>
                </p>
              </div>
            </div>
          </div>
        </details>

        {/* Example 3 */}
        <details style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
          <summary style={{ padding: '1.25rem', backgroundColor: '#f1f5f9', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', color: '#1e293b' }}>
            ייצוג ג': פריסת תת-יעד בודד על פני 4 התחומים
          </summary>
          <div style={{ padding: '1.5rem', backgroundColor: 'white' }}>
            <p style={{ fontSize: '0.95rem', color: '#475569', marginBottom: '1.5rem' }}>
              תצורה של "זכוכית מגדלת": לוקחים תת-יעד אסטרטגי אחד (למשל: "טיפוח לומד עצמאי") ופורסים אותו לכלל 4 תחומי העשייה. 
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '6px' }}>
                <strong style={{ color: '#0f172a' }}>1. ניהולי-ארגוני:</strong>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#475569' }}>גמישות במערכת השעות והקצאת בלוקים ללמידה חופשית (מנגנון סדור).</p>
              </div>
              <div style={{ border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '6px' }}>
                <strong style={{ color: '#0f172a' }}>2. חברתי-ערכי:</strong>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#475569' }}>שילוב פרויקטים למען הקהילה המנוהלים עצמאית על ידי תלמידים.</p>
              </div>
              <div style={{ border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '6px' }}>
                <strong style={{ color: '#0f172a' }}>3. רגשי:</strong>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#475569' }}>פיתוח תחושת מסוגלות ואחריות אישית דרך מעגלי שיח על חופש בחירה.</p>
              </div>
              <div style={{ border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '6px' }}>
                <strong style={{ color: '#0f172a' }}>4. פדגוגי:</strong>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#475569' }}>פיתוח משימות PBL חלופיות מבוססות רפלקציה.</p>
              </div>
            </div>
          </div>
        </details>

      </>
    ),
    mentorTip: 'המנהל לא צריך לבנות את זה לבד! תפקידך כמדריך הוא לעזור לו לבחור איזו מטריצה מייצגת הכי נכון את הצרכים של הצוות שלו כרגע. הדיאלוג סביב "איך מציגים את זה" הוא לעתים חשוב לא פחות מהמסמך עצמו.'
  },
  {
    id: 'step7',
    title: 'שלב סיום: מסמך חזון (דוגמה חלקית בלבד)',
    icon: <Target size={32} color="white" />,
    content: (
      <>
        <h3 style={{ color: '#4c1d95', fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
          מסמך אסטרטגי
        </h3>

        <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          <h4 style={{ color: '#0f172a', margin: '0 0 0.5rem 0', fontSize: '1.1rem', borderBottom: '2px solid #cbd5e1', display: 'inline-block' }}>
            הצהרת החזון
          </h4>
          <p style={{ fontSize: '1.05rem', color: '#334155', fontStyle: 'italic', lineHeight: '1.6' }}>
            "בית הספר 'תיכון אביב' מהווה בית ועוגן משמעותי בקהילה המקומית<br/>מטפח לומד עצמאי וסקרן<br/>מקדם אקלים של שייכות, דיאלוג ופיתוח זהות אישית בקרב תלמידיו וצוותו<br/>פועל כארגון גמיש המאפשר צמיחה, רווחה וחדשנות"
          </p>
        </div>

        <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          <h4 style={{ color: '#0f172a', margin: '0 0 1rem 0', fontSize: '1.1rem', borderBottom: '2px solid #cbd5e1', display: 'inline-block' }}>
            מטרות-על ארוכות טווח ותתי-יעדים
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <strong style={{ color: '#1d4ed8' }}>1. חיבור וזהות קהילתית</strong>
              <ul style={{ margin: '0.5rem 0 0 0', paddingRight: '1.2rem', color: '#475569', fontSize: '0.95rem' }}>
                <li>1.1 העמקת הזהות המקומית והמורשת.</li>
                <li>1.2 שגרות של חסד, יזמות ומעורבות.</li>
              </ul>
            </div>
            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <strong style={{ color: '#15803d' }}>2. טיפוח לומד עצמאי</strong>
              <ul style={{ margin: '0.5rem 0 0 0', paddingRight: '1.2rem', color: '#475569', fontSize: '0.95rem' }}>
                <li>2.1 מעבר להערכה חלופית רב-תחומית.</li>
                <li>2.2 חיזוק מיומנויות חקר ובחירה.</li>
              </ul>
            </div>
            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <strong style={{ color: '#7e22ce' }}>3. אקלים מוגן ודיאלוגי</strong>
              <ul style={{ margin: '0.5rem 0 0 0', paddingRight: '1.2rem', color: '#475569', fontSize: '0.95rem' }}>
                <li>3.1 מיסוד ערוצי הקשבה לתלמיד ולמורה.</li>
                <li>3.2 בניית שפה אחידה של פסיכולוגיה חיובית.</li>
              </ul>
            </div>
            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <strong style={{ color: '#b45309' }}>4. תרבות ניהולית מתקדמת</strong>
              <ul style={{ margin: '0.5rem 0 0 0', paddingRight: '1.2rem', color: '#475569', fontSize: '0.95rem' }}>
                <li>4.1 פיתוח קהילות לומדות בצוות (PLC).</li>
                <li>4.2 אוטונומיה פדגוגית לכל שכבה.</li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '8px' }}>
          <h4 style={{ color: '#0f172a', margin: '0 0 1rem 0', fontSize: '1.1rem', borderBottom: '2px solid #cbd5e1', display: 'inline-block' }}>
            מטריצת יישום (ייצוג נבחר לפי 4 תחומי עשייה)
          </h4>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem' }}>
            דוגמה לתרגום של תתי-היעדים אל תחומי העשייה המרכזיים בבית הספר בלוויית מנגנון סדור:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            
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
        </div>

      </>
    ),
    mentorTip: 'זהו השלב בו ה"חלום" (חזון) הופך ל"תוכנית עבודה" מוחשית, עם אחראים, תהליכים נגזרים ומנגנוני קבע (סדירויות) במערכת של בית הספר.'
    },
  {
    id: 'step8',
    title: 'הערת סיכום: ומה עם מדדי תוצאה?',
    icon: <Target size={32} color="white" />,
    content: (
      <>
        <h3 style={{ color: '#4c1d95', fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
          התמונה המלאה: מנגנונים לחוד, ותוצאות לחוד
        </h3>

        <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.7', color: '#166534', margin: 0 }}>
            במסמך שבנינו יש חזון, מטרות-על, יעדים נגזרים ומנגנוני יישום סדורים.
            <br/><br/>
            אבל... דבר אחד <strong>חסר</strong> במסמך האסטרטגי הזה:<br/>
            <strong style={{ fontSize: '1.25rem' }}>מדדי תוצאה והצלחה (KPIs)</strong>.
          </p>
        </div>

        <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#334155' }}>
          איך נדע אם המנגנון שבנינו (למשל: "מעגל שיח כל בוקר") באמת השיג את המטרה האסטרטגית ("אקלים מוגן ודיאלוגי")?
          <br/><br/>
          איך נדע אם שילוב "בלוקי חקר" במערכת השעות אכן יהפוך את התלמידים ללומדים עצמאיים וסקרנים במציאות?
          <br/><br/>
          ואיך נדע אם יום ההתנדבות הקבוע שבנינו אכן יטמיע בילדים תחושה עמוקה של זהות מקומית וחיבור לקהילה?
          <br/><br/>
          המנגנון אכן מייצר <strong>תשתית</strong> לעשייה סדירה, אך הוא לבדו אינו מבטיח שהתוצאה המיוחלת תושג. 
          <br/><br/>
          הגדרת מדדי התוצאה (למשל: אחוז התלמידים המדווחים על תחושת מוגנות בסקר אקלים) היא קריטית לבקרה השוטפת של ההנהלה.
          <br/><br/>
          <strong>את בניית מדדי התוצאה, והחיבור שלהם לתהליכים, נלמד ונשבץ בשלב מתקדם יותר של התהליך.</strong>
        </p>

      </>
    ),
    mentorTip: 'אל תתפתו להכניס למנהל מדדים בשלב מוקדם מדי. תנו לצוות קודם להרגיש ביטחון ב"מה עושים מחר בבוקר". המדדים יגיעו בהמשך.'
},
  {
    id: 'step9',
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
        <div style={{ backgroundColor: '#334155', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
        <div style={{ display: 'flex', height: '6px', backgroundColor: '#e2e8f0', flexShrink: 0 }}>
          {courseSteps.map((_, idx) => (
            <div 
              key={idx} 
              style={{ 
                flex: 1, 
                backgroundColor: idx <= currentStep ? '#64748b' : 'transparent',
                borderRight: idx > 0 ? '1px solid white' : 'none',
                transition: 'background-color 0.3s'
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
        <div style={{ padding: '1.5rem 2.5rem', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <button 
            onClick={() => {
              if (isLast) navigate(-1);
              else setCurrentStep(prev => prev + 1);
            }}
            style={{ 
              padding: '0.75rem 1.5rem', backgroundColor: '#334155', color: 'white', border: 'none', 
              borderRadius: '6px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', 
              display: 'flex', alignItems: 'center', gap: '0.5rem' 
            }}
          >
            {isLast ? 'סיום תירגול' : 'הבא'} {!isLast && <ArrowLeft size={18} />}
          </button>

          <div style={{ color: '#64748b', fontSize: '1rem' }}>
            פרק {currentStep + 1} מתוך {courseSteps.length}
          </div>

          <button 
            onClick={() => !isFirst && setCurrentStep(prev => prev - 1)}
            style={{ 
              padding: '0.75rem 1.5rem', backgroundColor: 'transparent', color: isFirst ? '#cbd5e1' : '#64748b', 
              border: '1px solid ' + (isFirst ? '#cbd5e1' : '#94a3b8'), borderRadius: '6px',
              cursor: isFirst ? 'not-allowed' : 'pointer', fontSize: '1.1rem', fontWeight: 'bold', 
              display: 'flex', alignItems: 'center', gap: '0.5rem' 
            }}
          >
            <ArrowRight size={18} /> חזור
          </button>
        </div>
      </div>
    </div>
  );
}
