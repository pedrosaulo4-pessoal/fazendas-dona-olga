@echo off
set PATH=C:\Users\pedro.sa\Downloads\node-v24.16.0-win-x64\node-v24.16.0-win-x64;%PATH%
cd /d "C:\Users\pedro.sa\fazendas-dona-olga"
npm.cmd run dev -- --hostname 0.0.0.0
