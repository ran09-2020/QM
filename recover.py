
import json
import os

transcript_path = r'C:\Users\raana\.gemini\antigravity\brain\7bf380f8-92ce-419a-b7f1-d7096a66f052\.system_generated\logs\transcript_full.jsonl'

matches = []

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        if 'ChatInterface.jsx' in line and 'import React' in line:
            matches.append(line)

print(f'Found {len(matches)} lines with ChatInterface.jsx and import React')
if matches:
    with open('chat_backup.txt', 'w', encoding='utf-8') as out:
        out.write(matches[0]) # just output the first one or we can output sizes

