@echo off
set cwd=%~dp0
echo [+] Starting Dev Task with Administrator Privileges...
powershell.exe -Command "Start-Process powershell -ArgumentList '-ExecutionPolicy Bypass -NoProfile -WindowStyle hidden -Command &{Invoke-Expression ''cd %cwd%; & npm run dev''}' -Verb RunAs"
