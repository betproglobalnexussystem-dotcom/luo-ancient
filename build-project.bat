@echo off
echo Building Linda Fashions for Production...
echo.
echo Adding Node.js to PATH...
set PATH=%PATH%;C:\Program Files\nodejs
echo.
echo Building project...
npm run build
echo.
echo Build completed!
pause

