@echo off
REM Start the React frontend (requires Node.js and npm)
cd /d "%~dp0"
if not exist package.json (
  echo package.json not found. Please run this script from the myapp folder.
  exit /b 1
)

echo Running frontend on http://localhost:3000 ...

npm start
