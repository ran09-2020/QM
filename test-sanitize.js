
const historyStr = '[{\"role\":\"user\",\"parts\":[{\"text\":\"Hello\"}]}]';
let sanitizedHistory = [];
const parsedHistory = JSON.parse(historyStr);
if (Array.isArray(parsedHistory)) {
  sanitizedHistory = parsedHistory.map(msg => {
    if (!msg.parts) return msg;
    const cleanParts = msg.parts.map(part => {
      if (part.inlineData) return { text: '[קובץ מצורף הוסר מטעמי שטח אחסון]' };
      if (part.text && part.text.length > 5000) return { text: part.text.substring(0, 5000) + '\n...[הטקסט קוצץ מטעמי שטח אחסון]' };
      return part;
    });
    return { ...msg, parts: cleanParts };
  });
  if (sanitizedHistory.length >= 2) {
    sanitizedHistory.splice(-2, 2);
  }
}
console.log(JSON.stringify(sanitizedHistory));

