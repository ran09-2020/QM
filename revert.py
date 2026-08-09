import re

path = 'src/components/ChatInterface.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove all instances of [לתרגול](#action:...)
content = re.sub(r' \[לתרגול\]\(#action:[^)]+\)', '', content)

# 2. Remove the ReactMarkdown custom components prop
markdown_pattern = r'<\s*ReactMarkdown\s+remarkPlugins=\{([^}]+)\}\s+rehypePlugins=\{([^}]+)\}\s+components=\{.*?\}\s*>\s*\{msg\.text\}\s*</\s*ReactMarkdown\s*>'
replacement = r'<ReactMarkdown remarkPlugins={\1} rehypePlugins={\2}>{msg.text}</ReactMarkdown>'
content = re.sub(markdown_pattern, replacement, content, flags=re.DOTALL)

# 3. Remove handlePillClick function
pill_click_pattern = r'const handlePillClick = \(text\) => \{\s*handleSend\(text\);\s*\};\s*'
content = re.sub(pill_click_pattern, '', content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated ChatInterface.jsx")
