# MedFlow Studio — Hospital & Pharmacy Billing

Files: `index.html` (the app), `sw.js`, `manifest.json`, `icon-192.png`, `icon-512.png`. Keep them all in the same folder.

## Where the data is stored
1. **On the phone/PC (main copy):** inside the browser's IndexedDB storage. Works offline and is fast. It is lost if someone clears Chrome's site data or uninstalls the app, which is why you need #2.
2. **In the user's own Google Drive (backup):** a `MedFlow Backups` folder holds `MedFlow-AutoBackup.json`, updated about 8 seconds after every bill or stock change, plus one `MedFlow-Backup-YYYY-MM-DD.json` per day.
   The app uses Google's `drive.file` permission, so it can only see the files it creates, never the user's other Drive files.

Your GitHub repo holds **only code**, never patient data.

## 1. Put it live on GitHub Pages
1. Create a repo (e.g. `medflow`) and upload all 5 files to the root.
2. Repo → Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)` → Save.
3. After about a minute the app is at `https://<your-username>.github.io/medflow/`.
4. On the phone: open the link in Chrome → menu → **Install app / Add to Home screen**.

## 2. Turn on "Connect Google Drive" (app owner does this ONCE, about 10 minutes)
**Why a Client ID?** Google does not let any website write into someone's Drive anonymously. Every app has to register once and get a Client ID, which is how Google shows "MedFlow wants to access your Drive" on the sign-in screen. It is **not** a password or a secret, and it does **not** store data. It only names the app.
**You** (the owner) create it once and put it into the code. Hospital users never see it: they just tap **Connect Google Drive** and sign in with their own Gmail.

1. https://console.cloud.google.com → create a project → **APIs & Services → Library → Google Drive API → Enable**.
2. **OAuth consent screen** → User type *External* → app name + your email → Save.
   Then **Publish app** (set it to "In production"). The app only asks for `drive.file`, which Google treats as a non-sensitive permission, so no review is needed. If you leave it in "Testing", only Gmail addresses you add as Test users can connect.
3. **Credentials → Create credentials → OAuth client ID → Web application**.
   Authorized JavaScript origins: `https://<your-username>.github.io` (no path, no trailing slash).
4. Copy the Client ID. In `index.html` find `const APP_CONFIG = { googleClientId: '' };`, paste it between the quotes, and commit.
   Keep using the **same** Client ID forever.

Done. In the app: **Clinic & Branding → Connect Google Drive → sign in**. The card then shows which Gmail it's connected to and when it last backed up.

**No Client ID yet?** Backup still works by hand: **Save backup to Drive (share)** opens Android's share sheet, where you pick **Drive**. To restore, use **Restore from file** and pick the file from Drive.

**New phone / data cleared:** open the app → welcome screen → **Restore from Google Drive** (or **Restore from a backup file**).

**Honest limit:** Google gives browser apps a 1-hour sign-in. After that, the next automatic upload may need one tap on the amber **"Cloud backup paused – tap to reconnect"** button. Changes stay safe on the phone meanwhile and upload after the tap. The app never uploads an empty database over an existing backup.

## 2b. MEGA backup (no setup needed by the owner)
Each user taps **Clinic & Branding → Connect MEGA** and signs in with **their own** MEGA account (free at mega.nz). From then on, every bill and stock change is uploaded automatically to a `MedFlow Backups` folder in that account, plus one dated copy per day.
- The phone keeps MEGA's **login session**, not the password. Backups keep running until the user taps **Disconnect** (or logs out of all sessions on mega.nz; then they just tap Connect MEGA again).
- The session is never put inside backup files or exports.
- Accounts with two-step login work: the app asks for the 6-digit code once.
- **New phone:** welcome screen → **Restore from MEGA** → sign in → pick a backup.
- MEGA and Google Drive can both be on at the same time.

## Every user's data is separate
- Each phone or browser keeps its own data. User A opening the website never sees User B's bills.
- Each user backs up to **their own** MEGA / Google account. Nothing is shared through your GitHub site.
- If two people share **one** phone and the same browser, they share the same data. Give each person their own phone, or their own Chrome profile.

## 3. Updating the app later
Replace `index.html` on GitHub. Users get the new version the next time they open it (network-first). Their data is untouched.

## 4. Daily-use rules built in
- Expired medicine cannot be billed. Overselling is blocked (also across several lines of one bill).
- **Void** a bill = it stays in records marked VOID with a reason (best for audits/GST).
- **Delete** a bill = it's removed completely (trash icon in Day-Wise Sales). You can choose to put the stock back. A bill number is **never reused**, even after delete.
- Every stock change (sale, void, delete, stock-in, manual edit) is in the Stock History ledger.
- Same medicine, different batches = separate stock rows. Billing suggests the earliest expiry first.
