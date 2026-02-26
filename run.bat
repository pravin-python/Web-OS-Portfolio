@echo off
setlocal

echo ========================================
echo   Project Helper Script (Windows)
echo ========================================

if "%1"=="install" goto install
if "%1"=="build" goto build
if "%1"=="dev" goto dev
if "%1"=="docker" goto docker
if "%1"=="test" goto test
if "%1"=="lint" goto lint
goto help

:install
echo Installing dependencies...
call npm install
goto end

:build
echo Building project...
call npm run build
goto end

:dev
echo Starting development server...
call npm run dev
goto end

:docker
echo Running in Docker...
docker-compose up --build
goto end

:test
echo Running tests...
call npm run test
goto end

:lint
echo Running linter...
call npm run lint
goto end

:help
echo Usage: run.bat {install|build|dev|docker|test|lint}
echo.
echo   install  - Install Node.js dependencies
echo   build    - Build the project for production
echo   dev      - Run local development server
echo   docker   - Build and run in Docker container
echo   test     - Run tests
echo   lint     - Run linter

:end
endlocal
