@echo off
REM Build and Package Script for DataStax Dashboard Application (Windows)
REM This script builds both the React SPA and Express BFF, then packages them into executables

echo ======================================
echo DataStax Dashboard Build ^& Package
echo ======================================
echo.

REM Step 1: Build React SPA
echo Step 1: Building React SPA...
cd datastax-dashboard-spa
call npm install
if %errorlevel% neq 0 exit /b %errorlevel%
call npm run build
if %errorlevel% neq 0 exit /b %errorlevel%
echo [32m✓ React SPA built successfully[0m
echo.

REM Step 2: Build Express BFF
echo Step 2: Building Express BFF...
cd ..\datastax-dashboard-bff
call npm install
if %errorlevel% neq 0 exit /b %errorlevel%
call npm run build
if %errorlevel% neq 0 exit /b %errorlevel%
echo [32m✓ Express BFF built successfully[0m
echo.

REM Step 3: Package with pkg
echo Step 3: Packaging application...
call npm run package
if %errorlevel% neq 0 exit /b %errorlevel%
echo [32m✓ Application packaged successfully[0m
echo.

echo ======================================
echo Build Complete!
echo ======================================
echo.
echo Executables created in: datastax-dashboard-bff\release\
echo.
echo Available executables:
echo   - DataOnTheHouse-win.exe (Windows)
echo   - DataOnTheHouse-macos (macOS)
echo   - DataOnTheHouse-linux (Linux)
echo.
echo To run the application:
echo   Windows: .\datastax-dashboard-bff\release\DataOnTheHouse-win.exe
echo   macOS:   ./datastax-dashboard-bff/release/DataOnTheHouse-macos
echo   Linux:   ./datastax-dashboard-bff/release/DataOnTheHouse-linux
echo.
echo The application will start on http://localhost:3000
echo.

cd ..

@REM Made with Bob
