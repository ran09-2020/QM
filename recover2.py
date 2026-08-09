
import json

transcript_path = r'C:\Users\raana\.gemini\antigravity\brain\7bf380f8-92ce-419a-b7f1-d7096a66f052\.system_generated\logs\transcript_full.jsonl'

chat_texts = []
css_texts = []

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            entry = json.loads(line)
            # Find tool responses that are view_file for ChatInterface.jsx
            if entry.get('type') == 'TOOL_RESPONSE' and 'ChatInterface.jsx' in line and 'import React' in line:
                chat_texts.append(entry.get('content', ''))
            
            # For CSS
            if entry.get('type') == 'TOOL_RESPONSE' and 'index.css' in line and 'message-bubble' in line:
                css_texts.append(entry.get('content', ''))
        except:
            pass

# Output the first one from yesterday (we can just take the first one overall since transcript is chronological)
if chat_texts:
    with open('chat_old.txt', 'w', encoding='utf-8') as f:
        f.write(chat_texts[0])
if css_texts:
    with open('css_old.txt', 'w', encoding='utf-8') as f:
        f.write(css_texts[0])

print(f'Found {len(chat_texts)} Chat and {len(css_texts)} CSS.')

