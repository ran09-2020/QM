const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else if (dirPath.endsWith('.js') || dirPath.endsWith('.jsx')) {
      callback(dirPath);
    }
  });
}

let modifiedCount = 0;
const srcPath = path.join(__dirname, 'src');

walkDir(srcPath, (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  const targetStr = 'תסריט שיחה(הופכים קושי לצורך)';
  if (content.includes(targetStr)) {
    // Replace globally
    content = content.split(targetStr).join('להפוך קושי לצורך');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Replaced in ${filePath}`);
    modifiedCount++;
  }
});

console.log(`Total files modified: ${modifiedCount}`);
