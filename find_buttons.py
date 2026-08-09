import json
import re

transcript_path = r'C:\Users\raana\.gemini\antigravity\brain\7bf380f8-92ce-419a-b7f1-d7096a66f052\.system_generated\logs\transcript_full.jsonl'
found = False

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        if 'תראה לי שלב אחרי שלב' in line:
            print("FOUND IN TRANSCRIPT:")
            # Just print the whole match snippet to understand the context
            match = re.search(r'.{0,100}תראה לי שלב אחרי שלב.{0,100}', line)
            if match:
                print(match.group(0))
            found = True
            break
if not found:
    print('NOT FOUND')
