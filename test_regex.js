let mkd = `
  | שלב בשיח | מטרת השלב | מסר מרכזי או שאלת הנחיה | תוצר מצופה |
  | ---: | ---: | ---: | ---: |
  | 1. פתיחה ומיצוב | חיבור לחזון היישובי | בית הספר פועל מתוך שייכות לרשות ומבקש לשזור את תמונת העתיד העירונית בעשייתו. | ביסוס אמון והורדת מגננות הדדית. |
`;
mkd = mkd.replace(/^[\s]*\|(.+)\|[\s]*$/gm, (match, inner) => {
   if (inner.includes('---')) return '';
   let cols = inner.split('|');
   return '<tr>' + cols.map(c => `<td style="border: 1px solid #ccc; padding: 5px;">${c.trim()}</td>`).join('') + '</tr>';
});
mkd = mkd.replace(/(<tr>[\s\S]*?<\/tr>\s*)+/g, (match) => {
   return `<table style="border-collapse: collapse; width: 100%; border: 1px solid #ccc; margin: 15px 0;">\n${match}</table>\n`;
});
console.log(mkd);
