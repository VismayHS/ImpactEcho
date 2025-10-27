@echo off
echo ============================================================
echo   🚀 ImpactEcho - ONE-CLICK START (100%% FREE!)
echo ============================================================
echo.
echo Starting all services on localhost...
echo.

REM Check if MongoDB is running
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="1" (
    echo ⚠️  MongoDB not running! Please start MongoDB first.
    echo    Run: net start MongoDB
    echo    Or open MongoDB Compass
    pause
    exit /b 1
)

echo ✅ MongoDB detected
echo.

REM Kill any existing processes on our ports
echo 🧹 Cleaning up old processes...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do taskkill /F /PID %%a 2>NUL
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5000" ^| find "LISTENING"') do taskkill /F /PID %%a 2>NUL
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8000" ^| find "LISTENING"') do taskkill /F /PID %%a 2>NUL
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8545" ^| find "LISTENING"') do taskkill /F /PID %%a 2>NUL
timeout /t 2 /nobreak > NUL
echo.

REM Start Hardhat local blockchain
echo 🔗 Starting Hardhat local blockchain on port 8545...
start "Hardhat Blockchain" cmd /k "cd blockchain && npx hardhat node"
timeout /t 5 /nobreak > NUL

REM Deploy smart contract
echo 📜 Deploying smart contract...
start "Deploy Contract" cmd /c "cd blockchain && npx hardhat run scripts/deploy.js --network localhost && timeout /t 3"
timeout /t 8 /nobreak > NUL

REM Start AI service
echo 🤖 Starting FREE AI service on port 8000...
start "AI Service (Flask)" cmd /k "cd ai_service && python app.py"
timeout /t 3 /nobreak > NUL

REM Start backend
echo 🖥️  Starting Express backend on port 5000...
start "Backend (Express)" cmd /k "cd backend && npm start"
timeout /t 3 /nobreak > NUL

REM Start frontend
echo 🎨 Starting Next.js frontend on port 3000...
start "Frontend (Next.js)" cmd /k "cd frontend && npm run dev"
timeout /t 5 /nobreak > NUL

echo.
echo ============================================================
echo   ✅ ALL SERVICES STARTED!
echo ============================================================
echo.
echo   🔗 Blockchain:  http://localhost:8545 (Hardhat)
echo   🤖 AI Service:  http://localhost:8000 (Flask Mock)
echo   🖥️  Backend:     http://localhost:5000 (Express)
echo   🎨 Frontend:    http://localhost:3000 (Next.js)
echo.
echo   💾 Database:    localhost:27017 (MongoDB)
echo   💰 Test ETH:    10,000 ETH (Hardhat accounts)
echo   💵 Cost:        ₹0 (100%% FREE!)
echo.
echo ============================================================
echo   🦊 CONFIGURE METAMASK:
echo ============================================================
echo   Network Name:   Hardhat Local
echo   RPC URL:        http://localhost:8545
echo   Chain ID:       31337
echo   Currency:       ETH
echo.
echo   Import Account (Hardhat Test Account #0):
echo   Private Key:    0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
echo.
echo ============================================================
echo.
echo ⏳ Waiting 10 seconds for all services to initialize...
timeout /t 10 /nobreak > NUL

echo.
echo 🎉 Opening ImpactEcho in your browser...
start http://localhost:3000

echo.
echo ============================================================
echo   Press any key to STOP all services...
echo ============================================================
pause > NUL

echo.
echo 🛑 Stopping all services...
taskkill /FI "WINDOWTITLE eq Hardhat*" /F 2>NUL
taskkill /FI "WINDOWTITLE eq AI Service*" /F 2>NUL
taskkill /FI "WINDOWTITLE eq Backend*" /F 2>NUL
taskkill /FI "WINDOWTITLE eq Frontend*" /F 2>NUL
taskkill /FI "WINDOWTITLE eq Deploy*" /F 2>NUL

echo ✅ All services stopped.
echo.
pause
