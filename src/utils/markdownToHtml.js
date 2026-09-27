export const buildHTMLString = (content, title) => {
  if (!content) return "";
  let html = "<div style='font-family: Arial, sans-serif; direction: rtl;'>";
  
  if (typeof content === 'string' || content.document_type === 'generic_markdown' || (content.markdown_content && !content.vision_sentences)) {
    // Very basic markdown to HTML converter for Word export
    let mkd = typeof content === 'string' ? content : (content.markdown_content || '');
    mkd = mkd.replace(/^### (.*$)/gim, '<h4 dir="rtl" style="text-align: right;">$1</h4>')
             .replace(/^## (.*$)/gim, '<h3 dir="rtl" style="text-align: right;">$1</h3>')
             .replace(/^# (.*$)/gim, '<h2 dir="rtl" style="text-align: right;">$1</h2>')
             .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
             .replace(/\*(.*)\*/gim, '<i>$1</i>')
             .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');
             
    // Basic table support for Word (if the AI generated markdown tables)
    if (mkd.includes('|')) {
      // First convert each row to <tr>...</tr>
      mkd = mkd.replace(/^[\s]*\|(.+)\|[\s]*$/gm, (match, inner) => {
         if (inner.includes('---')) return ''; // drop separator row entirely
         let cols = inner.split('|');
         return '<tr>' + cols.map(c => `<td dir="rtl" style="border: 1px solid #ccc; padding: 5px; text-align: right; direction: rtl; word-wrap: break-word;">${c.trim()}</td>`).join('') + '</tr>';
      });
      
      // Then wrap contiguous <tr> blocks in a <table>
      mkd = mkd.replace(/(<tr>[\s\S]*?<\/tr>\s*)+/g, (match) => {
         
        // Add a dummy row to force minimum column widths in Word
        let firstRowMatch = match.match(/<tr>(.*?)<\/tr>/i);
        let forcedWidthRow = "";
        if (firstRowMatch) {
          let colCount = (firstRowMatch[1].match(/<td/g) || []).length;
          if (colCount > 0) {
            let hiddenText = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"; // Unbreakable long string
            let dummyCols = Array(colCount).fill(`<td style="border: none; padding: 0; color: white; font-size: 1px;">${hiddenText}</td>`).join("");
            forcedWidthRow = `<tr style="height: 1px; color: white; font-size: 1px;">${dummyCols}</tr>`;
          }
        }
        return `<table dir="rtl" style="table-layout: fixed; word-wrap: break-word; border-collapse: collapse; width: 100%; border: 1px solid #ccc; margin: 15px 0; direction: rtl; text-align: right;">\n${forcedWidthRow}\n${match}</table>\n`;

      });
    }

    // Finally, replace remaining newlines with <br/> (after tables are processed)
    mkd = mkd.replace(/\n\n/gim, '<br/><br/>')
             .replace(/\n/gim, '<br/>');
             
    html += `<div>${mkd}</div>`;
    html += "</div>";
    return html;
  }

  // Strategy Template
  html += `<h2 dir="rtl" style="text-align: center;">${title || 'מסמך אסטרטגיה'}</h2>`;
  html += "<h3 dir=\"rtl\" style=\"text-align: right; margin-top: 20px;\">חזון בית הספר</h3><ol style=\"line-height: 1.8;\">";
  (content.vision_sentences || []).forEach(sentence => {
    if (sentence) {
      html += `<li dir="rtl" style="text-align: right;">${sentence}</li>`;
    }
  });
  html += "</ol>";
  
  if (content.goals && content.goals.length > 0) {
    html += "<h3 dir=\"rtl\" style=\"text-align: right; margin-top: 30px;\">יעדים אופרטיביים</h3>";
    html += `<table dir="rtl" style="table-layout: fixed; word-wrap: break-word; border-collapse: collapse; width: 100%; border: 1px solid #ccc; direction: rtl; text-align: center;">
      <tr style="background-color: #f3f4f6;">
        <th style="border: 1px solid #ccc; padding: 10px; width: 8%;">מס' יעד</th>
        <th style="border: 1px solid #ccc; padding: 10px; width: 23%;">פדגוגי</th>
        <th style="border: 1px solid #ccc; padding: 10px; width: 23%;">חברתי-ערכי</th>
        <th style="border: 1px solid #ccc; padding: 10px; width: 23%;">רגשי</th>
        <th style="border: 1px solid #ccc; padding: 10px; width: 23%;">ארגוני-ניהולי</th>
      </tr>`;
      
    content.goals.forEach(g => {
      const isP = g.domain === 'פדגוגי' ? g.desc : '';
      const isS = g.domain === 'חברתי-ערכי' ? g.desc : '';
      const isC = g.domain === 'רגשי' ? g.desc : '';
      const isM = (g.domain === 'ארגוני-ניהולי' || g.domain === 'ניהולי-ארגוני') ? g.desc : '';
      
      html += `<tr>
        <td style="border: 1px solid #ccc; padding: 10px; font-weight: bold;">${g.id}</td>
        <td style="border: 1px solid #ccc; padding: 10px; vertical-align: top; background: ${isP ? '#eff6ff' : 'transparent'};">${isP}</td>
        <td style="border: 1px solid #ccc; padding: 10px; vertical-align: top; background: ${isS ? '#eff6ff' : 'transparent'};">${isS}</td>
        <td style="border: 1px solid #ccc; padding: 10px; vertical-align: top; background: ${isC ? '#eff6ff' : 'transparent'};">${isC}</td>
        <td style="border: 1px solid #ccc; padding: 10px; vertical-align: top; background: ${isM ? '#eff6ff' : 'transparent'};">${isM}</td>
      </tr>`;
    });
    html += `</table>`;
  }
  
  html += "</div>";
  return html;
};
