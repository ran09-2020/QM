const fs = require('fs');
const path = require('path');

// 1. Fix gemini.js (The huge text issue)
const geminiPath = path.join(__dirname, 'src', 'services', 'gemini.js');
let geminiContent = fs.readFileSync(geminiPath, 'utf8');

const geminiRegex = /חובה עליך לפתוח את התשובה במבנה הבא בדיוק.*?\(עם כותרת מודגשת בבולד לכל שלב\)\./s;

const newGemini = `חובה עליך לפתוח את התשובה במבנה הבא בדיוק (חל איסור מוחלט על שימוש בכותרות Markdown בפתיח!):
1. שורה ראשונה: "הדילמה שאת/ה מציג/ה נוגעת לאשכול [שם האשכול]." 
2. שורה שנייה: "אני מציע/ה את הכלי **[שם הכלי]**" 
3. שורה שלישית: "הכלי הזה מסייע ל [מטרת הכלי במשפט קצר]."
4. קו מפריד: חובה להשאיר שורת רווח ריקה אחת אחרי מטרת הכלי, ואז לכתוב את תגית ה-HTML <hr> כדי ליצור קו מפריד נקי. אסור להשתמש במינוס (---) כי זה הופך את הטקסט לכותרת ענקית!
5. וילון (אם יש במאגר הידע): מתחת ל-<hr>, העתק את הוילון (בלוק ה-HTML) כפי שהוא מוגדר בכלי.
6. הנחיה להמשך: בשורה נפרדת מתחת לוילון: "אני מציע/ה לפרק את הבעיה למרכיבים הבאים:" ואז רשימת השלבים.`;

if (geminiRegex.test(geminiContent)) {
  geminiContent = geminiContent.replace(geminiRegex, newGemini);
  fs.writeFileSync(geminiPath, geminiContent, 'utf8');
  console.log("Patched gemini.js to use <hr> instead of ---");
} else {
  console.log("Could not match regex in gemini.js");
}

// 2. Fix toolsKnowledge.js (The line breaks in the curtain)
const toolsPath = path.join(__dirname, 'src', 'toolsKnowledge.js');
let toolsContent = fs.readFileSync(toolsPath, 'utf8');

const toolsRegex = /<details>.*?<\/details>/s;

const newTools = `<details>
<summary><b>עקרונות לשימוש בכלי</b></summary>
<br>
<p>כשמתמודדים מול אדם שקשה לו, הגישה היא לא "להנחית" פתרונות אינסטנט. יש להבין לעומק מה קשה לו ולעודד אותו להגדיר בעצמו מה הוא צריך. ברגע שהוא מגדיר את הצורך, הוא הופך לשותף פעיל ולוקח בעלות על הפתרון.</p>
<p>תפקידך משתנה בהתאם לכובע שאתה חובש:</p>
<ul>
<li><b>כיועץ:</b> אתה מברר קודם כל מה הקושי והצורך של המנהלת עצמה.</li>
<li><b>כמאמן:</b> אתה מלמד ומתרגל יחד עם המנהלת כיצד לברר צרכים מול העובדים שלה.</li>
</ul>
<p><b>גבולות וצורך מערכתי:</b> לעיתים חובה על המנהלת גם להציג את הקושי המערכתי שלה ואת הצורך הבלתי מתפשר של בית הספר, לפני או אחרי שהיא מבררת את צרכי העובד.</p>
</details>
(הערה למודל: העתק את כל בלוק ה-<details> הזה מילה במילה, כולל כל תגיות ה-HTML, ה-<ul> וה-<li>. אל תנסה לנסח אותו מחדש ב-Markdown!)`;

if (toolsRegex.test(toolsContent)) {
  toolsContent = toolsContent.replace(toolsRegex, newTools);
  fs.writeFileSync(toolsPath, toolsContent, 'utf8');
  console.log("Patched toolsKnowledge.js to use strict HTML lists and force verbatim copy.");
} else {
  console.log("Could not match regex in toolsKnowledge.js");
}
