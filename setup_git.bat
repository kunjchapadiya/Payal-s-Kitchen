@echo off
git remote remove origin
git remote add origin https://github.com/kunjchapadiya/Payal-s-Kitchen
git branch -M main
git add .
git commit -m "Push to GitHub"
git push -u origin main
