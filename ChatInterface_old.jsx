import React' in line and 'const ChatInterface' in line:
            try:
                data = json.loads(line)
                s = json.dumps(data)
                match = re.search(r'import React.*?(?=\\