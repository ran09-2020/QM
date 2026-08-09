const fs = require('fs');
let content = fs.readFileSync('src/components/ChatInterface.jsx', 'utf8');

function replaceAll(str, find, replace) {
  return str.split(find).join(replace);
}

content = replaceAll(content, 'в⌡в⌠в≥ в°в■в╙в≈в≥в°, в═в╕в≥в▓ в░в╙ в■в⌡в°в≥в² в■в╒в∙в·в⌠в≥в² в°в╗в╘в∙в╙в  в▒в░в╘в⌡в∙в° в√в■: \\n\\n\\\n\\nв░в≥в√в■ в·в■в² в╙в╗в╕в■ в°в╙в╗в▓в° в⌡в╒в╙?', 'כדי להתחיל, נציג את הכלים העומדים לרשותך באשכול זה: \\n\\n\\n\\nתבחר/י כלי לתרגול');

content = replaceAll(content, 'в·в╙в≈в≥в°в≥в² в╙в╗в▓в∙в°: \. (в·в≈в⌡в■ в°в·в═в≤в∙в╗ в╘в≥в⌡в≥в÷ в░в╙ в■в╙в╗в≈в≥в╘...)', 'מתחילים תרגול: . (מחכה למנטור שיכין את התרחיש...)');

content = replaceAll(content, "hat: 'в·в░в·в÷'", "hat: 'מאמן'");

content = replaceAll(content, "text: 'в╘в≥в≥! в⌡в≥в╒в⌡в╕ в╘в░в▒в≤в╗в≤в▓в≥ в╘в╗в⌡, в░в═в≥ в⌡в░в² в⌡в╙в≥ в╗в⌡в√в╒в╗ в╗в⌡ в╗в╘в≤в·в╒в╙в╙ в⌡в² в╙в≥в╗в·в╒в╙ в·в╒в╗в⌡в▒в╒в╙ в▒в═в≥в╘в╒в╗ в▒в≥в╙ в╘в▒в⌠в╗ (в╙в╘в╗в≥в⌡в≥в², в≈в√в∙в÷, в╕в╒в╒в≤в≥в², в╘в╒в≤в⌠в╒в≥в∙в╙, в╙в╒в╕в░в╒в╙). в⌡в╗ в·в╘ в╙в╗в╕в╘/в≥ в╘в═в╙в▒в╗ в╘в≥в╒в²?'", "text: 'היי! כיועץ האסטרטגי שלך, אני כאן כדי לעזור לך להתמודד עם דילמות מורכבות בניהול בית הספר (תהליכים, חזון, צוותים, שותפויות, תוצאות). על מה תרצה/י שנדבר היום?'");

content = replaceAll(content, "hat: 'в≥в╒в⌡в╕'", "hat: 'יועץ'");

content = replaceAll(content, "text: 'в·в╕в≤в⌡в╗, в≈в╗в╘ в╘в▓в≥в░в╘ в▒в╙в╖в╘в╒в╗в╙ в⌡в² в╘в╘в╗в╙. в▒в╙в╒в╖ в░в╙ в╘в≈в≥в▒в╒в╗ в╘в╗в⌡.'", "text: 'מצטער, חלה שגיאה בתקשורת עם השרת. בדוק את החיבור שלך.'");

content = replaceAll(content, 'alert("в▒в╒в▓ в╖в╒в▒в╔ в╗в░ в═в╙в·в⌡. в░в═в░ в▒в≈в╗ в╖в╒в▒в╔ Word, Excel, PDF в░в╒ в╙в·в╒в═в╘.")', 'alert("סוג קובץ לא נתמך. אנא בחר קובץ Word, Excel, PDF או תמונה.")');

content = replaceAll(content, "title={в°в≈в╔ в⌡в⌠в≥ в°в■в╙в≈в≥в° в╙в╗в▓в∙в° в╘в°: \}", "title={לחץ כדי להתחיל תרגול של: \}");

content = replaceAll(content, "text.includes('в╘в═в╙в╗в▓в°')", "text.includes('להתמקד')");
content = replaceAll(content, "handleSend('в╙в⌠в▓в≥в² в°в≥ в╘в°в▒ в░в≈в╗в≥ в╘в°в▒')", "handleSend('תציע לי עוד מצב דומה')");
content = replaceAll(content, ">в╙в⌠в▓в≥в² в°в≥ в╘в°в▒ в░в≈в╗в≥ в╘в°в▒</button>", ">תציע לי עוד מצב דומה</button>");

content = replaceAll(content, "handleSend('в╙в÷ в°в≥ в╙в╗в≈в≥в╘ в∙в░в■в≥в■ в╓в╒в≥в°')", "handleSend('תן לי משוב מפורט יותר')");
content = replaceAll(content, ">в╙в÷ в°в≥ в╙в╗в≈в≥в╘ в∙в░в■в≥в■ в╓в╒в≥в°</button>", ">תן לי משוב מפורט יותר</button>");

content = replaceAll(content, "handlePillClick('в°в╖в▒в° в╒в╕в■ в▒в═в∙в╘в░ ')", "handlePillClick('אשמח לעצה בנושא ')");
content = replaceAll(content, ">в°в╖в▒в° в╒в╕в■</button>", ">עצה קטנה</button>");
content = replaceAll(content, "> в°в╖в▒в° в╒в╕в■</button>", "> עצה קטנה</button>");

content = replaceAll(content, "handlePillClick('в°в°в·в∙в⌠ в⌡в°в≥ в·в╙в∙в⌠в∙в°в∙в▓в≥ в╒в▒в∙в╗ ')", "handlePillClick('אאמץ כלי להתמודדות עם ')");
content = replaceAll(content, ">в°в°в·в∙в⌠ в⌡в°в≥</button>", ">אאמץ כלי</button>");
content = replaceAll(content, "> в°в°в·в∙в⌠ в⌡в°в≥</button>", "> אאמץ כלי</button>");

content = replaceAll(content, "handlePillClick('в▒в∙в░ в═в≈в╘в∙в▒ в≥в≈в⌠ в╒в° ')", "handlePillClick('איך לנהל צוות של ')");
content = replaceAll(content, ">в°в≈в╘в∙в▒ в≥в≈в⌠</button>", ">ניהול צוות</button>");
content = replaceAll(content, "> в°в≈в╘в∙в▒ в≥в≈в⌠</button>", "> ניהול צוות</button>");

content = replaceAll(content, "handlePillClick('в░в═в≥ в╕в╗в≥в  в°в·в╓в∙в╙ в╘в░в°в∙в╙ в▒в═в∙в▓в╒ в° ')", "handlePillClick('תכנן איתי מתווה פעולה ל ')");
content = replaceAll(content, ">в°в·в╓в∙в╙ в╘в░в°в∙в╙</button>", ">מתווה פעולה</button>");
content = replaceAll(content, "> в°в·в╓в∙в╙ в╘в░в°в∙в╙</button>", "> מתווה פעולה</button>");

content = replaceAll(content, "handlePillClick('в╙в∙в⌡в° в°в║в⌡в² в°в≥ в░в╙ ')", "handlePillClick('תעזור לנסח פניה אל ')");
content = replaceAll(content, ">в║в≥в⌡в∙в²</button>", ">ניסוח</button>");
content = replaceAll(content, "> в║в≥в⌡в∙в²</button>", "> ניסוח</button>");

content = replaceAll(content, 'title="в■в║в╗ в╖в∙в▒в╔"', 'title="הסר קובץ"');
content = replaceAll(content, 'title="в╕в╗вё в╖в∙в▒в╔ (Word, Excel, PDF, в╙в·в∙в═в■)"', 'title="צרף קובץ (Word, Excel, PDF, תמונה)"');

fs.writeFileSync('src/components/ChatInterface.jsx', content, 'utf8');
console.log("Done");
