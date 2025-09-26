@echo off
:: Change to the script's directory
cd /d "%~dp0"

:: Add all changes
git add .

:: Create commit with timestamp
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /format:list') do set datetime=%%I
set datetime=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2% %datetime:~8,2%:%datetime:~10,2%:%datetime:~12,2% UTC
git commit -m "Auto-update: %datetime%"

:: Push changes
git push origin main 