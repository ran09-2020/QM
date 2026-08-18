const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, 'src', 'toolsKnowledge.js');
let content = fs.readFileSync(toolsPath, 'utf8');

// Replace the title
const oldSummary = '<summary><b>עקרונות לשימוש בכלי</b></summary>';
const newSummary = '<summary><b>עקרונות לשימוש בכלי - הקישו כאן</b></summary>';

if (content.includes(oldSummary)) {
    content = content.replace(oldSummary, newSummary);
    console.log("Patched summary title");
}

// Replace the steps
const oldStep1 = 'שלב 1: ציון עובדתי - המנהלת מציגה את העובדות';
const newStep1 = '**שלב 1: ציון עובדתי** - המנהלת מציגה את העובדות';

const oldStep2 = 'שלב 2: הצגת הקושי המערכתי - שיקוף ההשלכות';
const newStep2 = '**שלב 2: הצגת הקושי המערכתי** - שיקוף ההשלכות';

const oldStep3 = 'שלב 3: בירור קושי וצרכים של הרכזת - המנהלת בודקת';
const newStep3 = '**שלב 3: בירור קושי וצרכים של הרכזת** - המנהלת בודקת';

const oldStep4 = 'שלב 4: הגדרת הצורך של בית הספר והסכמה על פתרון - המנהלת מחדדת';
const newStep4 = '**שלב 4: הגדרת הצורך של בית הספר והסכמה על פתרון** - המנהלת מחדדת';

content = content.replace(oldStep1, newStep1);
content = content.replace(oldStep2, newStep2);
content = content.replace(oldStep3, newStep3);
content = content.replace(oldStep4, newStep4);

fs.writeFileSync(toolsPath, content, 'utf8');
console.log("Patched tools steps!");
