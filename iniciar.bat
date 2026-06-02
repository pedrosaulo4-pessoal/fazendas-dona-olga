@echo off
title Fazendas Dona Olga - Controle de Rebanho
color 1F

set PATH=C:\Users\pedro.sa\Downloads\node-v24.16.0-win-x64\node-v24.16.0-win-x64;%PATH%

echo.
echo  ============================================
echo   FAZENDAS DONA OLGA - CONTROLE DE REBANHO
echo  ============================================
echo.
echo  Iniciando o sistema...
echo.
echo  Acesso no computador:  http://localhost:3000
echo  Acesso pelo celular:   http://10.5.0.9:3000
echo                         (celulares na mesma rede Wi-Fi)
echo.
echo  Para encerrar: feche esta janela.
echo.

cd /d "%~dp0"

for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000 "') do (
    taskkill /F /PID %%a >nul 2>&1
)

npm.cmd run dev -- --hostname 0.0.0.0

pause
