@echo off
echo ========================================
echo    R-Market - Deploiement
echo ========================================
echo.

echo [1/3] Nettoyage...
if exist dist rmdir /s /q dist

echo [2/3] Build en cours...
call npm run build

if %errorlevel% neq 0 (
    echo ERREUR: Le build a echoue!
    pause
    exit /b 1
)

echo [3/3] Build termine avec succes!
echo.
echo Dossier dist/ pret pour le deploiement.
echo.
echo Prochaines etapes:
echo 1. Pour Vercel: vercel --prod
echo 2. Pour Netlify: glisser le dossier dist/ sur app.netlify.com/drop
echo 3. Pour Ionos: uploader le contenu de dist/ dans htdocs/
echo.
pause
