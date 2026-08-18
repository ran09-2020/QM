const fs = require('fs');
const path = require('path');

const geminiPath = path.join(__dirname, 'src', 'services', 'gemini.js');
let geminiContent = fs.readFileSync(geminiPath, 'utf8');

const regex = /חובה עליך לפתוח את התשובה במבנה הבא בדיוק.*?\(חובה לפרט מיד לאחר מכן את השלבים, כאשר הכותרת של כל שלב\/מרכיב חייבת להיות מודגשת בבולד\. אסור לעצור במשפט המעבר ולשאול שאלה!\)\./s;

const newContent = `חובה עליך לפתוח את התשובה במבנה הבא בדיוק (טקסט רגיל בלבד! חל איסור מוחלט להשתמש בכותרות Markdown כמו # או ## בפתיח):
1. שורה ראשונה: "הדילמה שאת/ה מציג/ה נוגעת לאשכול [שם האשכול]." (ללא הדגשות וללא כוכביות).
2. שורה שנייה: "אני מציע/ה את הכלי **[שם הכלי]**" (רק שם הכלי מודגש).
3. שורה שלישית: "הכלי הזה מסייע ל [מטרת הכלי במשפט קצר]."
4. קו מפריד: מיד לאחר 3 השורות האלו, רד שורה וכתוב שלוש מקפים ברצף (---) ליצירת קו ויזואלי.
5. וילון (אם יש במאגר הידע): אם לכלי יש פילוסופיה (כמו "פילוסופיית הכלי"), הצג אותה מתחת לקו המפריד בתוך תגית <details> עם <summary> ככותרת.
6. הנחיה להמשך: מתחת לוילון (או הקו), בשורה נפרדת: "אני מציע/ה לפרק את הבעיה למרכיבים הבאים:" ואז רשימת השלבים (עם כותרת מודגשת בבולד לכל שלב).`;

if (regex.test(geminiContent)) {
  geminiContent = geminiContent.replace(regex, newContent);
  fs.writeFileSync(geminiPath, geminiContent, 'utf8');
  console.log("Patched gemini.js strictly!");
} else {
  console.log("Regex didn't match.");
}
