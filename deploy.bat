@echo off
REM ═══════════════════════════════════════
REM  Deploy to GitHub Pages (gh-pages)
REM  Uses plain git — no npm gh-pages needed
REM ═══════════════════════════════════════

echo.
echo  🚀  Building for production...
echo.

call npm run build
if %errorlevel% neq 0 (
    echo.
    echo  ❌  Build failed! Fix errors above and retry.
    pause
    exit /b 1
)

echo.
echo  📦  Deploying dist/ to gh-pages branch...
echo.

cd dist

git init
git config core.autocrlf true
git checkout -b gh-pages
git add -A
git commit -m "deploy"

REM  Get the remote URL from the parent repo
for /f "tokens=*" %%i in ('git -C .. remote get-url origin 2^>nul') do set REPO_URL=%%i

if not defined REPO_URL (
    echo  ❌  No git remote found! Add one first:
    echo     git remote add origin https://github.com/USER/REPO.git
    cd ..
    pause
    exit /b 1
)

git push -f %REPO_URL% gh-pages

cd ..

if %errorlevel% neq 0 (
    echo.
    echo  ❌  Deploy failed! Check your network/credentials.
    pause
    exit /b 1
)

echo.
echo  ✅  Deployed to gh-pages branch!
echo     Go to repo Settings → Pages → Source: gh-pages
echo.
pause
