import json
import os

transcript_path = r'C:\Users\raana\.gemini\antigravity\brain\7bf380f8-92ce-419a-b7f1-d7096a66f052\.system_generated\logs\transcript_full.jsonl'
found = False

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            entry = json.loads(line)
            # Find TOOL_RESPONSE for view_file of ChatInterface.jsx
            if entry.get('type') == 'TOOL_RESPONSE' and 'ChatInterface.jsx' in line and 'import React' in line and 'function ChatInterface' in line:
                content = entry.get('content', '')
                if 'import React' in content and 'function ChatInterface' in content:
                    with open('ChatInterface_backup.jsx', 'w', encoding='utf-8') as out:
                        out.write(content)
                    print('Found ChatInterface in TOOL_RESPONSE!')
                    found = True
                    break
        except:
            pass

if not found:
    print('Could not find ChatInterface')
