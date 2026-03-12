#!/bin/bash

# ═══════════════════════════════════════

# Deploy to GitHub Pages (gh-pages)

# Uses plain git — no npm gh-pages needed

# ═══════════════════════════════════════

echo
echo "🚀  Building for production..."
echo

npm run build
if [ $? -ne 0 ]; then
echo
echo "❌  Build failed! Fix errors above and retry."
read -p "Press enter to exit..."
exit 1
fi

echo
echo "📦  Deploying dist/ to gh-pages branch..."
echo

cd dist || exit

git init
git config core.autocrlf input
git checkout -b gh-pages
git add -A
git commit -m "deploy"

# Get remote URL from parent repo

REPO_URL=$(git -C .. remote get-url origin 2>/dev/null)

if [ -z "$REPO_URL" ]; then
echo "❌  No git remote found! Add one first:"
echo "   git remote add origin https://github.com/USER/REPO.git"
cd ..
read -p "Press enter to exit..."
exit 1
fi

git push -f "$REPO_URL" gh-pages

cd ..

if [ $? -ne 0 ]; then
echo
echo "❌  Deploy failed! Check your network/credentials."
read -p "Press enter to exit..."
exit 1
fi

echo
echo "✅  Deployed to gh-pages branch!"
echo "   Go to repo Settings → Pages → Source: gh-pages"
echo
read -p "Press enter to exit..."
