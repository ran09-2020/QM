const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'services', 'gemini.js');
let content = fs.readFileSync(filePath, 'utf8');

// Update function signatures
content = content.replace(
  "export async function sendMessageToGemini(userMessage, userGender = 'male', mentorGender = 'male', attachedFile = null)",
  "export async function sendMessageToGemini(userMessage, userRole = 'principal', userGender = 'male', mentorGender = 'male', attachedFile = null)"
);

content = content.replace(
  "export async function sendSimulationMessageToGemini(userMessage, clusterName, clusterTools, userGender = 'male', mentorGender = 'male', attachedFile = null)",
  "export async function sendSimulationMessageToGemini(userMessage, clusterName, clusterTools, userRole = 'principal', userGender = 'male', mentorGender = 'male', attachedFile = null)"
);

// Inject userRole into the prompt logic inside sendMessageToGemini
const promptReplacement1 = `
  const userRoleHe = userRole === 'mentor' ? 'מדריך/ת רשת' : 'מנהל/ת בית ספר';
  const roleInstruction = \`שים לב: האדם שאתה מדבר איתו הוא בתפקיד: \${userRoleHe}. התאם את ההנחיות, הוילונות והניסוחים באופן מדויק לתפקיד שלו.\`;
  
  let currentSystemInstruction = systemInstruction + \`\n\n\${roleInstruction}\`;
`;

content = content.replace(
  "let currentSystemInstruction = systemInstruction;",
  promptReplacement1
);

// Do the same for sendSimulationMessageToGemini
content = content.replace(
  "let currentSystemInstruction = simulationSystemInstruction",
  `const userRoleHe = userRole === 'mentor' ? 'מדריך/ת רשת' : 'מנהל/ת בית ספר';
  const roleInstruction = \`שים לב: האדם שאתה מדבר איתו הוא בתפקיד: \${userRoleHe}. התאם את ההנחיות, הוילונות והניסוחים באופן מדויק לתפקיד שלו.\`;
  let currentSystemInstruction = simulationSystemInstruction + \`\\n\\n\${roleInstruction}\``
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Patched gemini.js with userRole");
