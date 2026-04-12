@echo off
title R-Market Server
echo ========================================
echo    R-Market - Lancement du site
echo ========================================
echo.
echo Ouverture du site dans votre navigateur...
start http://localhost:5173
echo.
echo Serveur de developpement en cours...
echo Appuyez sur Ctrl+C pour arreter
echo.
npm run dev
pause
