const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const xlsx = require('xlsx');

async function extractFiles() {
    const rootDir = path.resolve('..');
    const docxPath = path.join(rootDir, 'תרשים מעגל השיפור ורדאר3.5.20.docx');
    const xlsxPath = path.join(rootDir, 'טופס מבדק לבתי הספר.xlsx');

    let textDocx = "";
    let textXlsx = "";

    try {
        console.log("Reading docx...");
        const result = await mammoth.extractRawText({path: docxPath});
        textDocx = result.value;
    } catch(e) {
        console.error("Error reading docx", e);
    }

    try {
        console.log("Reading xlsx...");
        const workbook = xlsx.readFile(xlsxPath);
        for (const sheetName of workbook.SheetNames) {
            const sheet = workbook.Sheets[sheetName];
            textXlsx += `\n--- Sheet: ${sheetName} ---\n`;
            textXlsx += xlsx.utils.sheet_to_csv(sheet);
        }
    } catch (e) {
        console.error("Error reading xlsx", e);
    }

    const outputContent = `
export const docxContent = \`${textDocx.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
export const xlsxContent = \`${textXlsx.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
`;

    fs.writeFileSync(path.join('src', 'knowledge.js'), outputContent, 'utf-8');
    console.log("Extraction complete. Wrote to src/knowledge.js");
}

extractFiles();
