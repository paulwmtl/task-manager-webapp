# Sicherheitsproblem behoben: Tasks Isolation

## Problem
Andere Benutzer konnten deine Tasks sehen, weil die Row Level Security (RLS) Policies nicht korrekt konfiguriert waren.

## Was wurde geändert?

### 1. Code-Änderung (✅ Bereits erledigt)
- **Datei**: `frontend/src/api/taskApi.ts`
- **Änderung**: Die `createTask` Funktion setzt jetzt automatisch die `user_id` des eingeloggten Users
- **Ergebnis**: Neue Tasks werden dem richtigen User zugeordnet

### 2. Datenbank-Änderung (⚠️ Du musst das noch machen!)

#### Schritt-für-Schritt Anleitung:

1. **Öffne dein Supabase Dashboard**
   - Gehe zu: https://app.supabase.com
   - Wähle dein Projekt aus

2. **Öffne den SQL Editor**
   - Klicke auf "SQL Editor" in der linken Seitenleiste

3. **Führe das Fix-Script aus**
   - Öffne die Datei `FIX_RLS_POLICIES.sql` (im Projekt-Root)
   - Kopiere den gesamten Inhalt
   - Füge ihn in den SQL Editor ein
   - Klicke auf "Run" (oder drücke Cmd+Enter)

4. **Überprüfe die Änderungen**
   - Nach dem Ausführen solltest du eine Erfolgsmeldung sehen
   - Die Policies sind jetzt aktiv

## Was passiert jetzt?

### ✅ Sicherheit
- **Jeder User sieht nur seine eigenen Tasks**
- **Jeder User kann nur seine eigenen Tasks bearbeiten/löschen**
- **Standard-Kategorien sind für alle sichtbar**
- **Eigene Kategorien sind nur für den Ersteller sichtbar**

### 🔧 Technische Details

Die neuen RLS Policies verwenden `auth.uid()` um:
- Beim **SELECT**: Nur Tasks zu zeigen, wo `user_id = auth.uid()`
- Beim **INSERT**: Sicherzustellen, dass `user_id = auth.uid()`
- Beim **UPDATE**: Nur Tasks zu aktualisieren, wo `user_id = auth.uid()`
- Beim **DELETE**: Nur Tasks zu löschen, wo `user_id = auth.uid()`

## Test

Nach dem Ausführen des SQL-Scripts:

1. Melde dich mit deinem Account an
2. Erstelle ein paar Tasks
3. Melde dich ab
4. Erstelle einen neuen Account oder melde dich mit einem anderen an
5. ✅ Du solltest NUR die Tasks des zweiten Accounts sehen!

## Wichtig: Alte Tasks

Falls du bereits Tasks in der Datenbank hast, die keine `user_id` haben:
- Diese sind jetzt **NICHT mehr sichtbar** (wegen RLS)
- Du kannst sie entweder löschen oder einem User zuweisen

### Optionale Bereinigung (nur wenn nötig):

Wenn du alte Tasks einem bestimmten User zuweisen möchtest:

1. Finde deine User-ID:
   - Gehe zu "Authentication" → "Users" in Supabase
   - Kopiere deine User-ID

2. Führe dieses SQL aus (ersetze `DEINE_USER_ID`):
   ```sql
   UPDATE tasks 
   SET user_id = 'DEINE_USER_ID' 
   WHERE user_id IS NULL;
   ```

Oder lösche alle Tasks ohne user_id:
```sql
DELETE FROM tasks WHERE user_id IS NULL;
```

## Support

Falls du Probleme hast:
- Überprüfe in Supabase Dashboard → Authentication, ob du eingeloggt bist
- Schaue in die Browser-Konsole für Fehlermeldungen
- Überprüfe, ob die RLS Policies aktiv sind:
  ```sql
  SELECT tablename, rowsecurity 
  FROM pg_tables 
  WHERE tablename = 'tasks';
  ```
  → `rowsecurity` sollte `true` sein
