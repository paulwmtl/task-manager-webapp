# Vercel Deployment Guide

## Vorbereitung

### 1. Git Repository erstellen (falls noch nicht vorhanden)

```bash
cd /Users/paul/Library/Mobile\ Documents/com~apple~CloudDocs/Github/task-manager-webapp
git init
git add .
git commit -m "Initial commit"
```

### 2. GitHub Repository erstellen und pushen

1. Gehe zu https://github.com/new
2. Erstelle ein neues Repository (z.B. `task-manager-webapp`)
3. Verbinde dein lokales Repository:

```bash
git remote add origin https://github.com/DEIN-USERNAME/task-manager-webapp.git
git branch -M main
git push -u origin main
```

## Vercel Deployment

### 1. Vercel Account erstellen

- Gehe zu https://vercel.com/signup
- Melde dich mit deinem GitHub Account an

### 2. Neues Projekt erstellen

1. Klicke auf "Add New..." → "Project"
2. Importiere dein GitHub Repository
3. Konfiguriere das Projekt:

**Framework Preset:** Vite  
**Root Directory:** `frontend`  
**Build Command:** `npm run build`  
**Output Directory:** `dist`

### 3. Environment Variables hinzufügen

Füge folgende Environment Variables hinzu:

```
VITE_SUPABASE_URL=deine_supabase_url
VITE_SUPABASE_ANON_KEY=dein_supabase_anon_key
```

Diese findest du in deinem Supabase Dashboard unter Settings → API.

### 4. Deploy

Klicke auf "Deploy" - Vercel wird deine App automatisch bauen und deployen!

## Nach dem Deployment

### Domain

Vercel gibt dir automatisch eine Domain wie:
`https://task-manager-webapp-xxxxx.vercel.app`

Du kannst auch eine Custom Domain hinzufügen.

### Automatische Deployments

Jedes Mal wenn du Code nach GitHub pushst, wird Vercel automatisch ein neues Deployment erstellen:

```bash
git add .
git commit -m "Update features"
git push
```

### Environment Variables aktualisieren

Wenn du Environment Variables änderst:
1. Gehe zu deinem Projekt in Vercel
2. Settings → Environment Variables
3. Füge/Bearbeite die Variables
4. Redeploy (wird automatisch ausgelöst)

## Troubleshooting

### Build Fehler

Falls der Build fehlschlägt, überprüfe:
- Node Version (sollte 18+ sein)
- `package.json` hat alle Dependencies
- Environment Variables sind korrekt gesetzt

### 404 Fehler bei Routing

Falls du 404 Fehler bei direkten URLs bekommst, erstelle eine `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
