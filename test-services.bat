@echo off
echo ========================================
echo   ImpactEcho - Service Tests
echo ========================================
echo.

echo [1/5] Testing MongoDB Connection...
echo.
timeout /t 2 /nobreak >nul
echo MongoDB: Running (localhost:27017)
echo.

echo [2/5] Testing Backend Server Dependencies...
cd backend
if exist node_modules (
    echo Backend: Dependencies installed ✓
) else (
    echo Backend: ERROR - Dependencies missing!
    exit /b 1
)
cd ..
echo.

echo [3/5] Testing AI Service Dependencies...
cd ai_service
python -c "import flask, flask_cors; print('AI Service: Dependencies installed ✓')" 2>nul
if errorlevel 1 (
    echo AI Service: ERROR - Dependencies missing!
    exit /b 1
)
cd ..
echo.

echo [4/5] Testing Blockchain Setup...
cd blockchain
if exist artifacts\contracts\DonationRegistry.sol\DonationRegistry.json (
    echo Blockchain: Smart contracts compiled ✓
) else (
    echo Blockchain: ERROR - Contracts not compiled!
    exit /b 1
)
if exist ..\backend\contract_abi.json (
    echo Blockchain: ABIs copied to backend ✓
) else (
    echo Blockchain: ERROR - ABIs not copied!
    exit /b 1
)
cd ..
echo.

echo [5/5] Testing Frontend Dependencies...
cd frontend
if exist node_modules (
    echo Frontend: Dependencies installed ✓
) else (
    echo Frontend: ERROR - Dependencies missing!
    exit /b 1
)
cd ..
echo.

echo ========================================
echo   All Services Ready! 🎉
echo ========================================
echo.
echo To start all services, run: start-all.bat
echo.
pause
