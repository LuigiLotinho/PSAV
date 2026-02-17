# Vercel Deployment – Schritt-für-Schritt Anleitung

## Problem
Fehlermeldung: *"There is a problem with the server configuration"*

## Ursache
Fehlende oder falsche Umgebungsvariablen (Environment Variables) bei Vercel.

---

## Schritt 1: AUTH_SECRET erzeugen

Diese Variable ist **Pflicht** für NextAuth in Produktion.

**Option A – PowerShell:**
```powershell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

**Option B – falls OpenSSL vorhanden (z.B. über Git Bash):**
```bash
openssl rand -base64 32
```

**Option C – über npx:**
```powershell
npx auth secret
```

**Ergebnis:** Ein längerer zufälliger String, z.B. `K7gNU3sdo+OL0wNhqoVWhr3g6s1xYv72ol/pe/Unols=`

→ **Diesen Wert kopieren und sichern** – du brauchst ihn gleich.

---

## Schritt 2: Vercel-Dashboard öffnen

1. Browser öffnen
2. Gehe zu **https://vercel.com**
3. Einloggen (falls nötig)
4. Im Dashboard dein Projekt **PSAV** auswählen

---

## Schritt 3: Environment Variables hinzufügen

1. In deinem Projekt auf den Tab **"Settings"** klicken
2. In der linken Sidebar **"Environment Variables"** auswählen
3. Die folgenden Variablen nacheinander hinzufügen:

### Variable 1: AUTH_SECRET

| Feld | Wert |
|------|------|
| **Key (Name)** | `AUTH_SECRET` |
| **Value (Wert)** | Der von dir in Schritt 1 erzeugte String |
| **Environments** | Production, Preview, Development (alle anhaken) |

Dann auf **"Save"** klicken.

### Variable 2: AUTH_URL

| Feld | Wert |
|------|------|
| **Key (Name)** | `AUTH_URL` |
| **Value (Wert)** | `https://DEIN-PROJEKTNAME.vercel.app` |
| **Environments** | Production, Preview, Development |

**Beispiel:** Wenn dein Projekt `psav` heißt: `https://psav.vercel.app`  
Die genaue URL findest du unter **Deployments** → letztes Deployment → oben wird die URL angezeigt.

Dann auf **"Save"** klicken.

### Variable 3: DATABASE_URL

| Feld | Wert |
|------|------|
| **Key (Name)** | `DATABASE_URL` |
| **Value (Wert)** | Deine PostgreSQL-Verbindungs-URL |
| **Environments** | Production, Preview, Development |

**Format:**  
`postgresql://USER:PASSWORT@HOST:PORT/DATENBANKNAME?sslmode=require`

Wenn du z.B. **Neon**, **Supabase** oder **Railway** nutzt:  
Die URL findest du im jeweiligen Dashboard unter „Connection string“ oder „Database URL“.

Dann auf **"Save"** klicken.

### Variable 4: DIRECT_URL

| Feld | Wert |
|------|------|
| **Key (Name)** | `DIRECT_URL` |
| **Value (Wert)** | Dieselbe oder ähnliche URL wie bei DATABASE_URL |
| **Environments** | Production, Preview, Development |

**Hinweis:** Bei Neon/Supabase ist DIRECT_URL oft fast identisch mit DATABASE_URL, nur ohne Connection Pooler. Im Provider-Dashboard nach „Direct connection“ oder „Connection pooling“ schauen.

Dann auf **"Save"** klicken.

---

## Schritt 4: Redeploy auslösen

Die neuen Variablen werden nur bei einem **neuen Deployment** verwendet.

1. Auf den Tab **"Deployments"** wechseln
2. Beim letzten Deployment rechts auf die **drei Punkte (⋮)** klicken
3. **"Redeploy"** auswählen
4. Optional: **"Use existing Build Cache"** abhaken für einen frischen Build
5. Auf **"Redeploy"** klicken
6. Warten bis der Status **"Ready"** ist (ca. 1–2 Minuten)

---

## Schritt 5: App testen

1. Auf den grünen **"Visit"**-Button oder die URL klicken
2. Die App sollte ohne die Fehlermeldung laden
3. `/login` testen – Login sollte funktionieren (wenn Admin-Account existiert)

---

## Checkliste

- [ ] AUTH_SECRET erzeugt und in Vercel hinterlegt
- [ ] AUTH_URL auf die richtige Vercel-URL gesetzt
- [ ] DATABASE_URL von deinem PostgreSQL-Provider eingetragen
- [ ] DIRECT_URL eingetragen ( falls benötigt)
- [ ] Redeploy durchgeführt
- [ ] App im Browser getestet

---

## Häufige Fehler

| Fehler | Mögliche Ursache |
|--------|-------------------|
| "There is a problem with the server configuration" | AUTH_SECRET fehlt oder ist leer |
| Datenbank-Fehler beim Start | DATABASE_URL oder DIRECT_URL falsch bzw. nicht erreichbar |
| Login funktioniert nicht | AUTH_URL entspricht nicht der tatsächlichen App-URL |
| Build schlägt fehl | Evtl. andere fehlende Env-Vars – Vercel-Build-Logs prüfen |

---

## Datenbank noch nicht eingerichtet?

Falls du noch keine PostgreSQL-Datenbank hast:

- **Neon:** https://neon.tech (kostenloser Plan)
- **Supabase:** https://supabase.com (kostenloser Plan)
- **Railway:** https://railway.app

Nach der Erstellung:
1. Connection String kopieren
2. In Vercel als `DATABASE_URL` und `DIRECT_URL` eintragen
3. Lokal `npx prisma migrate deploy` und `npx prisma db seed` ausführen (oder migrieren und seeden im jeweiligen Tool)
