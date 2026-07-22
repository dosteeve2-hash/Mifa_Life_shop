# ╔══════════════════════════════════════════════════════════════╗
# ║  MIFA Life — Sprint 15 delivery script                      ║
# ║  Run from: C:\Users\pc\Documents\GitHub\Mifa_Life_shop      ║
# ╚══════════════════════════════════════════════════════════════╝

Set-Location $PSScriptRoot
$ErrorActionPreference = "Stop"

function Step($msg) { Write-Host "`n[$msg]" -ForegroundColor Cyan }
function OK($msg)   { Write-Host "  ✓ $msg" -ForegroundColor Green }
function Fail($msg) { Write-Host "  ✗ $msg" -ForegroundColor Red; exit 1 }

# 1. Sync main
Step "Git — checkout main + pull"
git checkout main; if ($LASTEXITCODE -ne 0) { Fail "git checkout main failed" }
git pull;          if ($LASTEXITCODE -ne 0) { Fail "git pull failed" }
OK "main is up to date"

# 2. Create feature branch
Step "Git — create branch"
$branch = "feat/sprint15-admin-commandes-produits"
git checkout -b $branch
if ($LASTEXITCODE -ne 0) { Fail "branch creation failed (already exists? run: git branch -D $branch)" }
OK "Branch $branch created"

# 3. Build
Step "npm run build"
npm run build
if ($LASTEXITCODE -ne 0) { Fail "Build failed — fix TypeScript errors above then re-run this script" }
OK "Build passed with 0 errors"

# 4. Commit
Step "Git — add + commit"
git add -A
git commit -m "feat: admin commandes + formulaire produit sprint15

- /admin/commandes : tableau commandes, KPIs, filtres statut/periode/search, changement statut inline, modal detail, export CSV
- /admin/produits/nouveau : formulaire multi-sections, preview temps reel, validation, brouillon/publier
- /admin : quick-actions mis a jour vers les nouvelles routes

Co-authored-by: Claude <claude@anthropic.com>"
if ($LASTEXITCODE -ne 0) { Fail "git commit failed" }
OK "Commit done"

# 5. Push
Step "Git — push"
git push -u origin $branch
if ($LASTEXITCODE -ne 0) { Fail "git push failed" }
OK "Pushed to origin/$branch"

# 6. PR
Step "GitHub — create PR"
gh pr create `
  --title "feat: admin commandes + nouveau produit (sprint 15)" `
  --body "## Sprint 15 — MIFA Life

### Pages livrées
- \`/admin/commandes\` — Gestion commandes : KPIs, tableau filtrable (statut/période/recherche), modal détail, changement statut, export CSV
- \`/admin/produits/nouveau\` — Formulaire produit multi-sections avec preview temps réel, validation, brouillon/publier
- \`/admin\` — Quick actions mis à jour

### Checklist
- [x] TypeScript strict (0 any)
- [x] Framer Motion spring animations
- [x] Données mock uniquement
- [x] Build 0 erreur
- [x] \`use client\` sur tous les composants interactifs" `
  --base main
if ($LASTEXITCODE -ne 0) { Fail "gh pr create failed (is gh CLI authenticated?)" }

OK "PR created — Sprint 15 livré !"
