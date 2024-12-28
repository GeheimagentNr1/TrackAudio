@echo off
setlocal enabledelayedexpansion

call "C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvars64.bat"

REM Extract the directory of this script
set "SCRIPT_DIR=%~dp0"
set "SCRIPT_DIR=%SCRIPT_DIR:~0,-1%"

REM Set paths
for %%i in ("%SCRIPT_DIR%\..") do set "TA_PATH=%%~fi"

REM Set the client folder
for %%i in ("%SCRIPT_DIR%") do set "SCRIPT_DIR=%%~fi"

REM Initialize debug flag
set "DEBUG_FLAG="

REM Check for --debug argument
if "%1"=="--debug" set "DEBUG_FLAG=--debug"

REM Prepare the build command
set "BUILD_COMMAND=call node %SCRIPT_DIR%\build-napi.js %DEBUG_FLAG%"

%BUILD_COMMAND%

exit /b 0
