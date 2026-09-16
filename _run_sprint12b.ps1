# Sprint 12B — Page /compte/parametres
# Usage: Right-click > Run with PowerShell

Set-Location "C:\Users\pc\Documents\GitHub\Mifa_Life_shop"

Write-Host "=== [1/5] Checkout main & pull ===" -ForegroundColor Cyan
git checkout main
git pull origin main

Write-Host "=== [2/5] Création branche feat/compte-parametres ===" -ForegroundColor Cyan
git checkout -b feat/compte-parametres

Write-Host "=== [3/5] Build Next.js ===" -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "BUILD FAILED — arrêt." -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour fermer"
    exit 1
}

Write-Host "=== [4/5] Commit ===" -ForegroundColor Cyan
git add -A
git commit -m "feat: page /compte/parametres utilisateur MIFA Life

- Migration SQL 009_user_preferences (notifications, langue, devise, theme)
- Server Component src/app/compte/parametres/page.tsx (Supabase SSR + fallback mock)
- Client Component ParametresClient.tsx (Framer Motion stagger, toggles Navy/Gold, toast dore)
- Navbar : lien /compte/parametres icone Settings (mobile drawer)
- ProfilClient : quick link Parametres (grille 3 colonnes)

Co-authored-by: Claude <claude@anthropic.com>"

Write-Host "=== [5/5] Push + PR ===" -ForegroundColor Cyan
git push origin feat/compte-parametres
gh pr create `
  --title "feat: /compte/parametres" `
  --body "Sprint 12B — Page parametres : notifications, langue, devise, securite, deconnexion" `
  --base main

Write-Host "=== DONE ===" -ForegroundColor Green
Read-Host "Appuyez sur Entrée pour fermer"
