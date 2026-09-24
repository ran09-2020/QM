# מסמך עיצוב תוכנה (SDD) - כוכב הצפון (Agent App) - עדכני לאוגוסט 2026

## 1. ארכיטקטורה כללית (Architecture Overview)
מערכת "כוכב הצפון" מבוססת על ארכיטקטורת Client-Side עשירה (SPA), הנשענת על שירותי ענן לניהול מידע (BaaS) ועל חיבור ישיר למודל אינטליגנציה מלאכותית (LLM).
- **Frontend Framework:** פותח ב-React 18 על גבי סביבת הבנייה Vite. משתמש ב-`react-router-dom` לניהול ניתובים פנימיים.
- **Backend & Database:** שירותי Supabase מספקים ניהול זהויות (Authentication), ושמירת נתוני הקשר (היסטוריית שיחות, יומני מנטור).
- **AI Engine:** Google Gemini API המנהל את דיאלוג הייעוץ בסטרימינג בזמן אמת.

## 2. מבנה רכיבים מרכזיים (Component Structure)

### 2.1 מעטפת וניווט (App Shell & Navigation)
- `App.jsx`: רכיב השורש. מנהל את ה-Routing ואת חלונות ה-Modal הגלובליים. כולל מנגנון ייחודי (Draggable Resizer) לשינוי רוחב תפריט הצד באופן דינמי (Drag & Drop).
- `PersonalSidebar.jsx` & `TopNav.jsx`: רכיבי הניווט. מנהלים גישה מהירה להגדרות, לדשבורד, וליומן (Calendar).
- `Auth.jsx`: טיפול בכניסת משתמשים והרשאות מול Supabase.

### 2.2 ליבת המערכת וצ'אט (Core Chat & AI)
- `ChatInterface.jsx`: רכיב מורכב המנהל את הדיאלוג השוטף. 
  - מטפל בסטרימינג (Streaming) של תגובות ה-AI.
  - מרנדר עיצוב עשיר (Markdown, Tables).
  - מכיל מנגנון אבחנה בין שיחת ייעוץ רגילה לשיחת סימולציה (`isSimulationMode`).
- `MessageBubble.jsx` & `ChatInput.jsx`: רכיבי תצוגה והזנה.

### 2.3 מרכז סימולציות חזון (Vision Demo Hub)
אזור ניתוב עצמאי תחת `/vision-demo` המכיל 5 אפליקציות-משנה לתרגול מתודולוגי:
- `VisionDemo.jsx` (מסלול ליניארי).
- `VisionDemoReverse.jsx` (מסלול הפוך).
- `VisionDemoDialogue.jsx` (דיאלוג וראיונות בעלי עניין).
- `VisionDemoSandbox.jsx` (ארגז חול חופשי).
- `VisionDemoDiagnostic.jsx` (אבחון מול שטח וביצוע).

### 2.4 תצוגות מחוונים והיסטוריה (Dashboards & Logs)
- `DashboardModal.jsx` & `Dashboard.jsx`: חלון המנתח את מצב המנהל, מציג את ה"אשכול המוביל" (Leading Cluster), משימות פעילות, ורשימת "ממתין להנחיה" בהתבסס על ניתוח השיחות.
- `CalendarModal.jsx`: מערכת יומן ארטיפקטים לשמירה ושליפה של מסמכי סיכום ותובנות מהשיחות הקודמות.

## 3. ניהול מצב גלובלי (Global State Management)
- **School Context (`contexts/SchoolContext.jsx`):** 
  מנהל את ההקשר הבית-ספרי. עוטף את המערכת ומספק לרכיבים את ה-`activeSchool` (בית הספר הנבחר), צבעי ערכת הנושא (`theme_color`), והתפקיד הפעיל (`role` - מנטור או יועץ). מאפשר תמיכה עתידית במנהל רשת החולש על מספר בתי ספר.

## 4. שירותים וניהול ידע (Services & Utilities)
### 4.1 אינטגרציית AI (`services/gemini.js`)
- אחראי על בניית הקונטקסט (System Prompt) השלם עבור מודל השפה.
- מזריק דינמית את פרסונת המנטור או היועץ לפי ההגדרות.
- מנהל את שיחות העבר לשמירה על רצף (Memory).

### 4.2 מאגרי ידע ומתודולוגיות (`src/*Knowledge.js`)
קובצי ידע סטטיים הנטענים לתוך הפרומפטים לפי דרישה:
- `toolsKnowledge.js`: מכיל את התבניות המדויקות ל"חזון שקורא לפעולה", מודל RADAR, שיטת 1-3-5, וכו'.
- `efqmKnowledge.js` & `knowledge.js`: מאגר נתונים רחב לניהול איכות ומצוינות ארגונית.

### 4.3 מסדי נתונים (`utils/supabaseHelpers.js` & `supabaseClient.js`)
- שכבת אבסטרקציה מעל ה-API של Supabase לביצוע פעולות CRUD (שמירת צ'אט, אחזור ארטיפקטים).

## 5. דגשי אבטחה, ביצועים ו-UI
- **Environment Variables:** כלל מפתחות השירות (`VITE_GEMINI_API_KEY`, `VITE_SUPABASE_URL`) מוגנים ברמת ה-`.env`.
- **CSS Architecture:** שילוב בין קבצי CSS מסורתיים (`index.css`, `App.css`, `Dashboard.css`) למחלקות של TailwindCSS. שימוש במשתני CSS דינמיים כדי לייצר Theme ייחודי לכל בית ספר (מוזרק דרך ה-`SchoolContext`).
- **Error Handling:** שימוש ברכיב מותאם `ErrorBoundary` ב-`App.jsx` ללכידת שגיאות רינדור קריטיות והצגת חלון שגיאה ידידותי במקום התרסקות "מסך לבן".

---
*מסמך SDD זה נסרק, נכתב ועודכן אוטומטית בהתבסס על קוד המקור בגרסת אוגוסט 2026.*
