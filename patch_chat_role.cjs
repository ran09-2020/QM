const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'ChatInterface.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Get userRole
content = content.replace(
  "const userGender = metadata.user_gender || 'male';",
  "const userRole = metadata.user_role || 'principal';\n  const userGender = metadata.user_gender || 'male';"
);

// Update sendMessageToGemini calls
content = content.replace(
  /sendMessageToGemini\((.*?),\s*userGender/g,
  "sendMessageToGemini($1, userRole, userGender"
);

content = content.replace(
  /sendSimulationMessageToGemini\((.*?),\s*cluster\.title,\s*cluster\.tools,\s*userGender/g,
  "sendSimulationMessageToGemini($1, cluster.title, cluster.tools, userRole, userGender"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Patched ChatInterface.jsx with userRole");
