const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'services', 'gemini.js');
let content = fs.readFileSync(filePath, 'utf8');

// The exact tool name string in gemini.js:
// line 86: - "המורה כועס...", "המנהלת מזלזלת" -> תקשורת -> תסריט שיחה.
// line 105: - תסריט שיחה(הופכים קושי לצורך): המרה מ"שיח מאשים -> שיח צרכים". במקום "המורה מזלזל" (אשמה) -> "אני צריך שהמורה יגיש בזמן כדי שאוכל לעקוב" (צורך).

content = content.replace(/תסריט שיחה\(הופכים קושי לצורך\)/g, 'להפוך קושי לצורך');
content = content.replace(/-> תסריט שיחה\./g, '-> להפוך קושי לצורך.');
content = content.replace(/- תסריט שיחה:/g, '- להפוך קושי לצורך:');

fs.writeFileSync(filePath, content, 'utf8');
console.log("Patched gemini.js for tool name");
