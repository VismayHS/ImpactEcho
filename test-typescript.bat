@echo off
echo ========================================
echo   Frontend TypeScript Error Check
echo ========================================
echo.

cd frontend

echo Running TypeScript compiler check...
echo.
npx tsc --noEmit

if errorlevel 1 (
    echo.
    echo ❌ TypeScript errors found!
    echo.
) else (
    echo.
    echo ✅ No TypeScript errors!
    echo.
    echo Running build to verify...
    echo.
    npm run build
    
    if errorlevel 1 (
        echo.
        echo ❌ Build failed!
        echo.
    ) else (
        echo.
        echo ========================================
        echo   ✅ All TypeScript Errors FIXED!
        echo ========================================
        echo.
        echo Your frontend builds perfectly!
        echo Ready to run: npm run dev
        echo.
    )
)

cd ..
pause
