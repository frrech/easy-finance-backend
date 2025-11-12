@echo off
echo 🚀 Starting MySQL service...

REM Try to start the MySQL service (the name may vary: MySQL or MySQL80)
net start MySQL >nul 2>&1
if errorlevel 1 (
    net start MySQL80 >nul 2>&1
)

REM Check if the service started successfully
sc query MySQL | find "RUNNING" >nul 2>&1
if errorlevel 1 (
    sc query MySQL80 | find "RUNNING" >nul 2>&1
    if errorlevel 1 (
        echo ❌ Failed to start MySQL service. Please start it manually.
        pause
        exit /b 1
    )
)

echo ✅ MySQL service is running.
echo.
echo 🧩 Starting Node.js app...
echo.

npm start

echo.
echo 🛑 Press any key to stop the app and MySQL service...
pause >nul

REM Optionally stop MySQL after you close the app
net stop MySQL >nul 2>&1
net stop MySQL80 >nul 2>&1

echo ✅ MySQL service stopped.
exit /b 0
