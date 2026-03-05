@echo off
echo Starting Desktop Commander Bridge...
cd /d %~dp0
start "DC Bridge" /B node server.js
timeout /t 2 /nobreak > nul
echo Starting ngrok tunnel...
ngrok http 7883
