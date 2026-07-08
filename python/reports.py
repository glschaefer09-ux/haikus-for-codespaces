# reports.py - simple reader for the sample report
import pathlib
p = pathlib.Path('powershell') / 'report.txt'
if p.exists():
    print('Report contents:')
    print(p.read_text())
else:
    print('No report found at', str(p))
