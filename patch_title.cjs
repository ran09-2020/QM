const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'toolsKnowledge.js');
let content = fs.readFileSync(filePath, 'utf8');

// Replace the <summary> line
const oldLine = '<summary><b>פילוסופיית הכלי: לגדל מנטורים, לא רק לפתור בעיות</b></summary>';
const newLine = '<summary><b>עקרונות לשימוש בכלי</b></summary>';

if (content.includes(oldLine)) {
  content = content.replace(oldLine, newLine);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Patched toolsKnowledge.js summary title successfully!");
} else {
  console.log("Could not find the summary line.");
}
