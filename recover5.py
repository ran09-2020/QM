import json
import os
import re

transcript_path = r'C:\Users\raana\.gemini\antigravity\brain\7bf380f8-92ce-419a-b7f1-d7096a66f052\.system_generated\logs\transcript_full.jsonl'
found = False

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            entry = json.loads(line)
            if entry.get('type') == 'PLANNER_RESPONSE':
                content = entry.get('content', '')
                if 'import React' in content and 'function ChatInterface' in content:
                    match = re.search(r'```(?:jsx|javascript)?\n(import React.*?)\n```', content, flags=re.DOTALL)
                    if match:
                        with open('ChatInterface_backup.jsx', 'w', encoding='utf-8') as out:
                            out.write(match.group(1))
                        print('Found ChatInterface in PLANNER_RESPONSE!')
                        found = True
                        break
            if entry.get('type') == 'TOOL_RESPONSE':
                # The output string is the response output
                output = str(entry)
                if 'import React' in output and 'function ChatInterface' in output:
                    match = re.search(r'import React.*?(?=\",|\})', output, flags=re.DOTALL)
                    if match:
                        with open('ChatInterface_backup2.jsx', 'w', encoding='utf-8') as out:
                            out.write(match.group(0).replace('\\n', '\n').replace('\\"', '"').replace('\\\\', '\\'))
                        print('Found ChatInterface in TOOL_RESPONSE!')
                        found = True
                        break
        except Exception as e:
            pass

if not found:
    print('Could not find ChatInterface')
