import json
import re

transcript_path = r'C:\Users\raana\.gemini\antigravity\brain\7bf380f8-92ce-419a-b7f1-d7096a66f052\.system_generated\logs\transcript_full.jsonl'
found = False

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            entry = json.loads(line)
            # Find the view_file tool response
            if entry.get('type') == 'TOOL_RESPONSE':
                output = entry.get('output', '')
                if 'import React' in output and 'function ChatInterface' in output and 'ChatInterface.jsx' in output:
                    # The output contains the file text. We want to extract just the code.
                    match = re.search(r'(import React.*?)\n(The above content|$)', output, flags=re.DOTALL)
                    if match:
                        with open('ChatInterface_restored.jsx', 'w', encoding='utf-8') as out:
                            out.write(match.group(1))
                        print('Restored ChatInterface_restored.jsx')
                        found = True
                        break
        except Exception as e:
            pass

if not found:
    print('Could not find ChatInterface')
