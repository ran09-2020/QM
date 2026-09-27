export const buildHTMLString = (content, title) => {
  if (!content) return "";
  let html = "<div style='font-family: Arial, sans-serif; direction: rtl;'>";
  
  if (typeof content === 'string' || content.document_type === 'generic_markdown' || (content.markdown_content && !content.vision_sentences)) {
    if (title) {
      html += `<h2 dir="rtl" style="text-align: right;">${title}</h2>`;
    }
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

  // Default to vision matrix template
  html += `<h2 dir="rtl" style="text-align: right;">${title || 'מסמך אסטרטגיה'}</h2>`;
  html += "<h3 dir=\"rtl\" style=\"text-align: right;\">חזון בית הספר</h3><ul>";
  (content.vision_sentences || []).forEach(sentence => {
    html += `<li dir="rtl" style="text-align: right;">${sentence}</li>`;
  });
  html += "</ul>";
  
  html += "<h3 dir=\"rtl\" style=\"text-align: right;\">הגדרת מדדים והגדרת יעדים</h3>";
  
  Object.keys(content.dimensions || {}).forEach(dim => {
    const dimData = content.dimensions[dim];
    html += `<h4 dir="rtl" style="text-align: right; background-color: #f0f0f0; padding: 5px;">${dim}</h4>`;
    html += `<p dir="rtl" style="text-align: right;"><b>הגדרה משותפת:</b> ${dimData.definition}</p>`;
    
    html += `<table dir="rtl" style="table-layout: fixed; word-wrap: break-word; border-collapse: collapse; width: 100%; border: 1px solid #ccc; margin-bottom: 15px; direction: rtl; text-align: right;">
      <tr style="background-color: #ddd;">
        <th dir="rtl" style="border: 1px solid #ccc; padding: 8px; text-align: right;">ערכים ומושגי יסוד (רדאר)</th>
        <th dir="rtl" style="border: 1px solid #ccc; padding: 8px; text-align: right;">יעדים תוצאתיים</th>
        <th dir="rtl" style="border: 1px solid #ccc; padding: 8px; text-align: right;">מדדי ביצוע ותהליך</th>
      </tr>
      <tr>
        <td dir="rtl" style="border: 1px solid #ccc; padding: 8px; text-align: right;">${(dimData.radar_values || []).join(", ")}</td>
        <td dir="rtl" style="border: 1px solid #ccc; padding: 8px; text-align: right;"><ul>${(dimData.outcome_goals || []).map(g => `<li dir="rtl" style="text-align: right;">${g}</li>`).join("")}</ul></td>
        <td dir="rtl" style="border: 1px solid #ccc; padding: 8px; text-align: right;"><ul>${(dimData.process_metrics || []).map(m => `<li dir="rtl" style="text-align: right;">${m}</li>`).join("")}</ul></td>
      </tr>
    </table>`;
  });
  
  html += "</div>";
  return html;
};
