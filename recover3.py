import json
import re

transcript_path = r'C:\Users\raana\.gemini\antigravity\brain\7bf380f8-92ce-419a-b7f1-d7096a66f052\.system_generated\logs\transcript_full.jsonl'

found = False
with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        if 'ChatInterface.jsx' in line and 'import React' in line and 'const ChatInterface' in line:
            try:
                data = json.loads(line)
                s = json.dumps(data)
                match = re.search(r'import React.*?(?=\",|\"})', s, flags=re.DOTALL | re.MULTILINE)
                if match:
                    content = match.group(0).replace('\\n', '\n').replace('\\"', '"').replace('\\\\', '\\')
                    with open('ChatInterface_old.jsx', 'w', encoding='utf-8') as out:
                        out.write(content)
                    print('Wrote ChatInterface_old.jsx')
                    found = True
                    break
            except Exception as e:
                print('Error', e)

if not found:
    print('Could not find ChatInterface')
