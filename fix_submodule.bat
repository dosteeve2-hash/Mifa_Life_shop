@echo off
cd /d "C:\Users\pc\Documents\GitHub\Mifa_Life_shop"
git rm --cached "Mes pages html/.claude/worktrees/charming-neumann-3e17c2"
git commit --amend -F ".git\COMMIT_EDITMSG_TMP"
echo DONE
