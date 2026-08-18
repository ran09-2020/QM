const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'toolsKnowledge.js');
let content = fs.readFileSync(filePath, 'utf8');

const regex = /<details>.*?<\/details>/s;

const newDetails = `<details>
<summary><b>עקרונות לשימוש בכלי</b></summary>
<br>
<p>כשמתמודדים מול אדם שקשה לו, הגישה היא לא "להנחית" פתרונות אינסטנט. יש להבין לעומק מה קשה לו ולעודד אותו להגדיר בעצמו מה הוא צריך. ברגע שהוא מגדיר את הצורך, הוא הופך לשותף פעיל ולוקח בעלות על הפתרון.</p>
<p>תפקידך משתנה בהתאם לכובע שאתה חובש:</p>
<p><b>כיועץ:</b> אתה מברר קודם כל מה הקושי והצורך של המנהלת עצמה.</p>
<p><b>כמאמן:</b> אתה מלמד ומתרגל יחד עם המנהלת כיצד לברר צרכים מול העובדים שלה.</p>
<p><b>גבולות וצורך מערכתי:</b> לעיתים חובה על המנהלת גם להציג את הקושי המערכתי שלה ואת הצורך הבלתי מתפשר של בית הספר, לפני או אחרי שהיא מבררת את צרכי העובד.</p>
</details>`;

if (regex.test(content)) {
  content = content.replace(regex, newDetails);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Patched toolsKnowledge.js strictly for lines!");
} else {
  console.log("Regex didn't match.");
}
