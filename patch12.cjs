const fs = require('fs');
const path = require('path');

const geminiPath = path.join(__dirname, 'src', 'services', 'gemini.js');
let content = fs.readFileSync(geminiPath, 'utf8');

const oldLine = '6. הנחיה להמשך: בשורה נפרדת מתחת לוילון: "אני מציע/ה לפרק את הבעיה למרכיבים הבאים:" ואז העתק את רשימת השלבים במדויק מתוך מאגר הידע (מילה במילה, כולל ההדגשות בבולד!). אל תנסח מחדש ואל תשמיט את המילים "שלב 1", "שלב 2" וכו\'.';
const newLine = '6. הנחיה להמשך: בשורה נפרדת מתחת לוילון: "אני מציע/ה לפרק את הבעיה למרכיבים הבאים:" ואז העתק את רשימת השלבים מתוך מאגר הידע. **חובה חמורה:** עליך להדגיש את המילים "שלב X: [שם השלב]" בבולד באמצעות כוכביות כפולות (לדוגמה: **שלב 1: ציון עובדתי** - התיאור...). הקפד להשאיר שורת רווח ריקה בין שלב לשלב כפי שמופיע במאגר הידע.';

if (content.includes(oldLine)) {
    content = content.replace(oldLine, newLine);
    fs.writeFileSync(geminiPath, content, 'utf8');
    console.log("Patched gemini.js with explicit bold formatting instruction");
} else {
    console.log("Could not find the target line in gemini.js");
}
