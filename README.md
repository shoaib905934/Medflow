# MedFlow Studio — Hospital & Pharmacy Billing

Files: `index.html` (the app), `sw.js`, `manifest.json`, `icon-192.png`, `icon-512.png`. Keep them all in the same folder.

## 1. Put it live on GitHub Pages
1. Create a **private** repo (e.g. `medflow`) on GitHub and upload all 5 files to the repo root.
2. Repo → Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)` → Save.
3. After ~1 minute your app is at `https://<your-username>.github.io/medflow/`.
   (Private repos need GitHub Pro/Team for Pages; otherwise use a public repo — it contains NO patient data, only code.)
4. On the phone: open the link in Chrome → menu → **Add to Home screen / Install app**.

## 2. Turn on automatic Google Drive backup (one-time, ~10 minutes)
1. Go to https://console.cloud.google.com → create a project → **APIs & Services → Library → Google Drive API → Enable**.
2. **OAuth consent screen**: User type *External*, add your app name and email, add your Gmail(s) as **Test users** (or Publish app).
3. **Credentials → Create credentials → OAuth client ID → Web application**.
   Authorized JavaScript origins: `https://<your-username>.github.io` (no path, no trailing slash).
4. Copy the **Client ID**. Open `index.html`, find `const APP_CONFIG = { googleClientId: '' };` and paste it between the quotes. Commit.
   (A Client ID is not a secret. Keep using the SAME Client ID forever — backups are tied to it.)
5. Open the app → Clinic & Branding → **Back up to Google Drive** → sign in once.

After that the app uploads `MedFlow-AutoBackup.json` to the user's Drive ~8 seconds after every bill / stock change, and keeps a dated `MedFlow-Backup-YYYY-MM-DD.json` snapshot once per day.

**If the phone's data is cleared / new phone:** open the app → the welcome screen appears → **Restore from Google Drive** → everything (bills, stock, ledger, settings) returns.

**Honest limits:** Google only gives browser apps 1-hour sign-in tokens. The app renews silently when it can; if Google asks for interaction, an amber "Cloud backup paused — tap to reconnect" button appears — tap once. Changes stay safely on the phone meanwhile and upload on reconnect. The app never uploads an empty database over an existing backup.

## 3. Updating the app later
Replace `index.html` on GitHub. Users get the new version on next open (network-first). Their data is untouched (stored on their phone + Drive).

## 4. Daily-use rules built in
- Expired medicine cannot be billed. Overselling is blocked (also across multiple lines of one bill).
- Bills are never deleted — **Void** keeps the number and a reason; stock is restored if chosen.
- Every stock change (sale, void, stock-in, manual edit) is in the Stock History ledger.
- Same medicine, different batches = separate stock rows; billing suggests earliest expiry.
