import json
import os

transcript = 'c:/Users/Admin/.gemini/antigravity-ide/brain/277fbfcf-0866-4d4b-9959-48d6614c5259/.system_generated/logs/transcript.jsonl'
files = {}

# Extract last write_to_file calls from transcript
for line in open(transcript, encoding='utf-8'):
    try:
        data = json.loads(line)
        for c in data.get('tool_calls', []):
            if c.get('name') == 'write_to_file':
                target = c.get('args', {}).get('TargetFile', '')
                if 'pages' in target:
                    content = c.get('args', {}).get('CodeContent', '')
                    # normalize path
                    target = target.replace('"', '').strip()
                    files[target] = content
    except Exception as e:
        continue

# Write them back with apiFetch applied
for f, content in files.items():
    if 'Login.jsx' in f or 'Register.jsx' in f or 'Auth.css' in f:
        continue # Already correct
    
    modified_content = "import { apiFetch } from '../utils/api';\n" + content.replace('fetch(', 'apiFetch(')
    
    with open(f, 'w', encoding='utf-8') as out:
        out.write(modified_content)
        print(f"Restored and patched: {f}")

