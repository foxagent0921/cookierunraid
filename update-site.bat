@echo off
setlocal EnableExtensions DisableDelayedExpansion
title Cookie Run Raid Website Updater

rem Keep this file ASCII-only because cmd.exe may misread UTF-8 batch files.
rem Only website files are staged. Source screenshots and tests stay local.
set "EXIT_CODE=1"
set "DID_PUSHD="

where git >nul 2>&1
if errorlevel 1 goto :no_git

pushd "%~dp0" >nul
if errorlevel 1 goto :path_error
set "DID_PUSHD=1"

if not exist ".git" goto :not_repo

call git remote get-url origin >nul 2>&1
if errorlevel 1 goto :no_remote

for /f "delims=" %%B in ('call git branch --show-current 2^>nul') do set "CURRENT_BRANCH=%%B"
if not defined CURRENT_BRANCH goto :no_branch
if /i not "%CURRENT_BRANCH%"=="main" goto :wrong_branch

echo.
echo [1/3] Preparing website files...
call git add -- index.html styles.css script.js README.md .nojekyll update-site.bat "*.bat" "*.md"
if errorlevel 1 goto :add_failed

call git diff --cached --quiet
if errorlevel 2 goto :diff_failed
if not errorlevel 1 goto :no_changes

echo [2/3] Creating an update commit...
call git commit -m "Update website"
if errorlevel 1 goto :commit_failed

echo [3/3] Pushing to GitHub...
call git push origin main
if errorlevel 1 goto :push_failed

echo.
echo Update complete. GitHub Pages should publish it within a few minutes.
set "EXIT_CODE=0"
goto :finish

:no_changes
echo.
echo No website changes were found. Nothing needs to be uploaded.
set "EXIT_CODE=0"
goto :finish

:no_git
echo.
echo Git was not found. Install Git for Windows, then run this file again.
goto :finish

:path_error
echo.
echo Could not open the folder containing this batch file.
goto :finish

:not_repo
echo.
echo This folder is not a Git repository. Complete the first GitHub setup first.
goto :finish

:no_remote
echo.
echo The Git remote named origin was not found. Complete the first upload setup.
goto :finish

:no_branch
echo.
echo The current Git branch could not be detected.
goto :finish

:wrong_branch
echo.
echo Current branch: %CURRENT_BRANCH%
echo GitHub Pages is configured for main. Run: git switch main
goto :finish

:add_failed
echo.
echo Could not prepare the website files. Review the Git error above.
goto :finish

:diff_failed
echo.
echo Could not check the staged changes. Review the Git error above.
goto :finish

:commit_failed
echo.
echo Could not create the update commit. Review the Git error above.
goto :finish

:push_failed
echo.
echo Push failed. Check the network, GitHub login, and remote changes.
goto :finish

:finish
if defined DID_PUSHD popd >nul
echo.
pause
exit /b %EXIT_CODE%
