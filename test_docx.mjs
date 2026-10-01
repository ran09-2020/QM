import fs from 'fs';
import { htmlToDocx } from 'wp-html-to-docx';
const html = '<table width="100%"><tr><td width="50%">A</td><td width="50%">B</td></tr></table>';
htmlToDocx(html).then(res => fs.writeFileSync('test.docx', Buffer.from(res)));
