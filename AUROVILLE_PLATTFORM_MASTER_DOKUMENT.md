# Auroville Problem–Solution Plattform
## Master-Dokument für Cursor

**Version:** Master-Dokument | **Autor:** Lukas | **Datum:** 2025-12-09

---

## Inhaltsverzeichnis

1. [Produktvision & Grundprinzipien](#1-produktvision--grundprinzipien)
2. [Nutzerrollen](#2-nutzerrollen)
3. [Einladungssystem](#3-einladungssystem)
4. [Probleme](#4-probleme)
5. [Lösungen](#5-lösungen)
6. [Problem–Lösung-Beziehung](#6-problemlösung-beziehung)
7. [Voting](#7-voting)
8. [Kategorien](#8-kategorien)
9. [Startseite & Sortierung](#9-startseite--sortierung)
10. [Moderation](#10-moderation)
11. [KI-Funktionen](#11-ki-funktionen)
12. [API (MVP)](#12-api-mvp)
13. [Datenmodell](#13-datenmodell)
14. [UI/UX](#14-uiux)
15. [Nicht-Ziele](#15-nicht-ziele)
16. [Roadmap](#16-roadmap)
17. [Entscheidungen von Lukas](#17-entscheidungen-von-lukas)
18. [User Flows](#18-user-flows)
19. [Product Requirements Document (PRD)](#19-product-requirements-document-prd)
20. [Qualitätssicherung](#20-qualitätssicherung)

---

## 1. Produktvision & Grundprinzipien

Offene, anonyme Plattform für die Auroville-Community zur strukturierten Erfassung von Problemen und Lösungen. Fokus auf kollektive Intelligenz ohne Social-Media-Dynamiken.

**Kernprinzipien:**
- **Anonymität by Design**: Device-ID basierte Identität, keine Email/Telefon erforderlich
- **Upvotes statt Diskussionen**: Nur positive Bewertungen, keine Kommentar-Threads
- **KI nur unterstützend**: Keine automatischen Entscheidungen, nur Hinweise für Moderatoren
- **Open Source**: Vollständig dokumentiert und frei verfügbar
- **Transparent & konstruktiv**: Positive digitale Infrastruktur für gemeinschaftliche Entwicklung

---

## 2. Nutzerrollen

### Reader (Gast)
- **Berechtigungen**: Inhalte lesen ohne Interaktion
- **Zugriff**: Keine Authentifizierung erforderlich
- **Einschränkungen**: Keine Votes, keine Einreichungen, keine Call-to-Actions sichtbar

### Contributor (User)
- **Berechtigungen**: 
  - Probleme & Lösungen einreichen
  - Upvotes vergeben
  - Eigene Einreichungen verwalten
- **Voraussetzung**: Einladung erforderlich
- **Einladungen**: Erhält automatisch 2 Einladungen

### Moderator
- **Berechtigungen**:
  - Alle Contributor-Rechte
  - Inhalte prüfen (Spam, Hate Speech, Missbrauch)
  - Duplikate mergen
  - Kategorien verwalten
  - Einladungen verwalten
  - Device-IDs temporär/permanent sperren
- **Besonderheit**: Alle Aktionen werden protokolliert mit Begründung

### Admin
- **Berechtigungen**:
  - Alle Moderator-Rechte
  - Systemkonfiguration
  - Nutzerverwaltung (Rollen ändern)
  - Plattform-Statistiken
  - Audit-Logs einsehen
  - AI-Thresholds anpassen

---

## 3. Einladungssystem

**Kapazität:**
- Maximal 500 Nutzer auf der Plattform
- Jeder User erhält automatisch **2 Einladungen** (unabhängig von Aktivität)
- Einladung per **Einmal-Code** (z.B. "AV-X7K9-MNPL")
- Ablaufzeit: 7 Tage (konfigurierbar)

**Prozess:**
1. User generiert Einladungscode
2. Code wird geteilt (z.B. per Link)
3. Neuer User löst Code ein
4. Device-ID wird automatisch generiert (gehasht)
5. Optionaler Alias kann gesetzt werden
6. User erhält Contributor-Status + 2 eigene Einladungen

**Sicherheit:**
- CAPTCHA bei Einladungseinlösung
- Rate Limiting auf Einladungsgenerierung
- Einmalige Nutzung pro Code

---

## 4. Probleme

### Struktur

**Kurzbeschreibung:**
- Maximal **300 Zeichen** (3 Sätze)
- Wird in Listen und Übersichten angezeigt

**Langbeschreibung:**
- Maximal **2500 Zeichen** (ursprünglich 2000, später auf 2500 erhöht)
- Detaillierte Problembeschreibung
- Wird nur in Detailansicht angezeigt

**Rankings (1–10 Skala):**
1. **Impact** (Auswirkung)
2. **Dringlichkeit** (Urgency)
3. **Umsetzbarkeit** (Feasibility)
4. **Betroffenheitsgrad** (Affected)
5. **Kosten** (Costs)

**Hilfsfragen (nur beim Schreiben sichtbar):**
1. Wer ist betroffen?
2. Seit wann?
3. Wie stark?
4. Was wurde versucht?
5. Beispiele?
6. Häufigkeit?
7. Emotionale Belastung?

→ Diese Fragen bleiben **fix** und werden nicht gespeichert, nur als Hilfestellung beim Formulieren angezeigt.

**Zusätzliche Felder:**
- Kategorie (User-gewählt, später KI-unterstützt)
- Status (active, merged, archived)
- Upvote-Count
- Embedding (für Duplikaterkennung)

---

## 5. Lösungen

### Struktur

**Kurzer Teaser:**
- Maximal **300 Zeichen** (3 Sätze)
- Wird in Listen und Übersichten angezeigt

**Lange Beschreibung:**
- Maximal **2500 Zeichen**
- Detaillierte Lösungsbeschreibung
- Wird nur in Detailansicht angezeigt

**Kommentare/Verbesserungen:**
- Maximal **500 Zeichen**
- Verbesserungsvorschläge oder zusätzliche Hinweise

**Ranking:**
- **Kein Ranking für Lösungen im MVP**
- Später als optionales Feature aktivierbar

**Hilfsfragen:**
- Unterstützende Präzisierungsfragen oberhalb des Formulars
- Nur beim Schreiben sichtbar, nicht gespeichert

**Verknüpfungen:**
- Lösungen können **mehreren Problemen** zugeordnet sein (Many-to-Many)
- Manuelle Verknüpfung im MVP

---

## 6. Problem–Lösung-Beziehung

**Many-to-Many Beziehung:**
- Eine Lösung kann mehrere Probleme lösen
- Ein Problem kann mehrere Lösungen haben
- Verknüpfung über `problem_solution_links` Tabelle

**MVP:**
- **Manuelle Verknüpfung** durch User
- Keine automatische KI-Verknüpfung
- Verknüpfung kann beim Erstellen oder später hinzugefügt werden

**V2 (geplant):**
- KI-basierte Matching-Vorschläge
- Automatische Lösungsvorschläge für Probleme

---

## 7. Voting

**System:**
- **Nur Upvotes** (keine Downvotes)
- **Anonym**: Keine User-ID gespeichert
- **Ein Vote pro Device & Target**: Hash(Device-ID + Target-ID)
- **Final**: Votes sind **nicht entfernbar** und **nicht änderbar**

**Technische Umsetzung:**
- Unique Constraint auf `hash_id` verhindert Mehrfachvotes
- Trigger aktualisiert automatisch `upvote_count`
- Keine DELETE-Funktion für Votes

**V2 (optional):**
- Gewichtete Upvotes als optionales Feature
- Bereits in Datenmodell integrierbar, aber erst später aktiviert

---

## 8. Kategorien

**Struktur:**
- **Flache Struktur**, nur Namen
- Keine Hierarchie im MVP
- Zunächst **User-gewählt** beim Erstellen
- Struktur so bauen, dass später **KI-Auto-Kategorisierung** möglich ist

**Verwaltung:**
- Moderatoren/Admins können Kategorien anlegen, umbenennen, löschen
- Kategorien als **Filter**, nicht als Navigationsebene

**Standard-Kategorien:**
- Environment
- Infrastructure
- Education
- Health
- Community
- Governance
- Economy

---

## 9. Startseite & Sortierung

**Layout:**
- **Öffentliche Startseite** für alle Besucher
- **Zwei globale Listen**:
  - **Oben**: Lösungen aus allen Kategorien
  - **Unten**: Probleme aus allen Kategorien
- Filter nach Kategorie (optional)

**Sortierung:**
- **Nach Upvotes** (absteigend)
- Lösungen werden **immer über Problemen** angezeigt
- Innerhalb einer Kategorie: Lösungen zuerst, dann Probleme

**Anzeige:**
- Kategorien nur als Namen (keine Icons, keine Beschreibungen)
- Listen zeigen: Titel + Upvote-Count
- Mobile-first Design

---

## 10. Moderation

**Aufgaben:**
- Prüfung auf **Spam, Missbrauch, Hate Speech**
- **Duplikate mergen** (mit Begründung)
- Inhalte **löschen** (mit Begründung)
- Device-IDs **sperren** (temporär/permanent)
- **Kategorien verwalten**
- **Einladungen verwalten**

**Prozess:**
1. Moderator sieht Dashboard mit:
   - Neu eingereichte Inhalte
   - Von Usern gemeldete Inhalte (Flags)
   - AI-Duplikat-Hinweise (Score >0.78)
2. Moderator prüft Inhalte
3. Moderator führt Aktion aus (merge, delete, ban, etc.)
4. **Begründung ist Pflicht** für jede Aktion
5. Aktion wird in `moderation_logs` protokolliert

**Transparenz:**
- Alle Moderationsaktionen sind für andere Moderatoren einsehbar
- Logs enthalten: Moderator-ID, Zeitstempel, Aktion, Begründung, Details

**KI-Unterstützung:**
- Duplikat-Hinweise (nicht blockierend)
- Keine automatischen Entscheidungen
- Alle Aktionen erfordern menschliche Bestätigung

---

## 11. KI-Funktionen

### MVP (V1)

**Duplicate Detection:**
- **Embeddings-basiert** (OpenAI text-embedding-3-small)
- **Score >0.78** = Moderator-Hinweis
- **Non-Blocking**: Blockiert keine Einreichungen
- Speichert Hinweise in `ai_insights` Tabelle
- Moderator entscheidet über Merge

**Speicherung:**
- Embeddings werden gespeichert (für Similarity-Search)
- DSGVO-konform: Minimaler Datenbestand
- Embeddings können temporär gespeichert werden

### V2 (geplant)

**AI Matching:**
- Automatische Lösungsvorschläge für Probleme
- Basierend auf Embedding-Ähnlichkeit

**Kategorie Suggestions:**
- KI schlägt Kategorien vor beim Erstellen
- User kann Vorschlag annehmen oder ändern

**Grundsatz:**
- **Keine automatischen Entscheidungen**
- Alles Moderator-confirmed
- KI nur als Unterstützung, nicht als Entscheider

---

## 12. API (MVP)

### Authentication
- `POST /auth/invite` - Einladung konsumieren, User erstellen

### Categories
- `GET /categories` - Alle Kategorien laden
- `GET /categories/{id}/problems` - Probleme einer Kategorie
- `GET /categories/{id}/solutions` - Lösungen einer Kategorie

### Problems
- `GET /problems` - Liste aller Probleme (für Startseite)
- `GET /problems/{id}` - Problem-Detailseite mit verknüpften Lösungen
- `POST /problems` - Problem erstellen (Contributor)
- `DELETE /problems/{id}` - Problem löschen (Moderator)

### Solutions
- `GET /solutions` - Liste aller Lösungen (für Startseite)
- `GET /solutions/{id}` - Lösung-Detailseite mit verknüpften Problemen
- `POST /solutions` - Lösung erstellen (Contributor)
- `DELETE /solutions/{id}` - Lösung löschen (Moderator)

### Links
- `POST /links` - Lösung mit Problem verknüpfen (Many-to-Many)

### Votes
- `POST /votes` - Upvote vergeben (permanent, nicht rückgängig)

### Moderation
- `POST /moderation/merge` - Duplikate mergen (Moderator, mit Begründung)
- `GET /moderation/dashboard` - Moderations-Dashboard (Moderator)
- `GET /moderation/logs` - Moderations-Logs einsehen (Moderator/Admin)

---

## 13. Datenmodell

### Logisches Modell

**Users:**
- `id` (UUID, PK)
- `device_id` (VARCHAR, UNIQUE, gehasht)
- `alias` (VARCHAR, optional)
- `invited_by` (UUID, FK → users)
- `invites_remaining` (INTEGER, default: 2)
- `role` (VARCHAR: reader, contributor, moderator, admin)
- `created_at` (TIMESTAMP)

**Categories:**
- `id` (UUID, PK)
- `name` (VARCHAR, UNIQUE)
- `created_at` (TIMESTAMP)

**Problems:**
- `id` (UUID, PK)
- `user_id` (UUID, FK → users)
- `short_text` (VARCHAR 300)
- `long_text` (VARCHAR 2500)
- `category_id` (UUID, FK → categories)
- `ranking_impact` (INTEGER 1-10)
- `ranking_urgency` (INTEGER 1-10)
- `ranking_feasibility` (INTEGER 1-10)
- `ranking_affected` (INTEGER 1-10)
- `ranking_costs` (INTEGER 1-10)
- `upvote_count` (INTEGER, default: 0)
- `embedding` (VECTOR 1536)
- `status` (VARCHAR: active, merged, archived)
- `merged_into` (UUID, FK → problems, optional)
- `created_at`, `updated_at` (TIMESTAMP)

**Solutions:**
- `id` (UUID, PK)
- `user_id` (UUID, FK → users)
- `short_text` (VARCHAR 300)
- `long_text` (VARCHAR 2500)
- `improvements` (VARCHAR 500, optional)
- `category_id` (UUID, FK → categories)
- `upvote_count` (INTEGER, default: 0)
- `embedding` (VECTOR 1536)
- `status` (VARCHAR: active, merged, archived)
- `merged_into` (UUID, FK → solutions, optional)
- `created_at`, `updated_at` (TIMESTAMP)

**Problem-Solution-Links (Many-to-Many):**
- `id` (UUID, PK)
- `problem_id` (UUID, FK → problems)
- `solution_id` (UUID, FK → solutions)
- `created_at` (TIMESTAMP)
- UNIQUE(problem_id, solution_id)

**Votes:**
- `id` (UUID, PK)
- `hash_id` (VARCHAR, UNIQUE) - Hash(device_id + target_id)
- `target_type` (VARCHAR: problem, solution)
- `target_id` (UUID)
- `created_at` (TIMESTAMP)
- Keine `user_id` (anonym)

**AI_Insights:**
- `id` (UUID, PK)
- `insight_type` (VARCHAR: duplicate, category_suggestion, match)
- `source_type` (VARCHAR: problem, solution)
- `source_id` (UUID)
- `data` (JSONB) - duplicate_scores, category_suggestions, etc.
- `reviewed` (BOOLEAN, default: false)
- `reviewed_by` (UUID, FK → users, optional)
- `reviewed_at` (TIMESTAMP, optional)
- `created_at` (TIMESTAMP)

**Moderation_Logs:**
- `id` (UUID, PK)
- `moderator_id` (UUID, FK → users)
- `action_type` (VARCHAR: merge, delete, ban_device, etc.)
- `target_type` (VARCHAR: problem, solution, user)
- `target_id` (UUID)
- `details` (JSONB) - Muss 'justification' enthalten
- `created_at` (TIMESTAMP)

**Invites:**
- `id` (UUID, PK)
- `code` (VARCHAR, UNIQUE)
- `created_by` (UUID, FK → users)
- `used_by` (UUID, FK → users, optional)
- `used_at` (TIMESTAMP, optional)
- `expires_at` (TIMESTAMP)
- `created_at` (TIMESTAMP)

### Indizes

- `idx_problems_category` auf `problems(category_id)`
- `idx_problems_upvotes` auf `problems(upvote_count DESC)`
- `idx_solutions_upvotes` auf `solutions(upvote_count DESC)`
- `idx_votes_target` auf `votes(target_type, target_id)`
- `idx_votes_hash` auf `votes(hash_id)`
- `idx_links_problem` auf `problem_solution_links(problem_id)`
- `idx_links_solution` auf `problem_solution_links(solution_id)`
- Vector-Indizes für Embeddings (pgvector)

---

## 14. UI/UX

### Design-Prinzipien

**Mobile-First:**
- Responsive Design, primär für mobile Geräte optimiert
- Touch-freundliche Bedienelemente

**Ruhig & Sachlich:**
- Keine Gamification-Elemente
- Keine Social-Profile
- Klare, lösungsorientierte Ästhetik
- Barrierearm (Accessibility)

**Layout:**
- Startseite: Lösungen oben, Probleme unten
- Kategorien als Filter, nicht als Navigationsebene
- Listen: Titel + Upvote-Count
- Detailansicht: Vollständige Informationen + verknüpfte Items

**Hilfsfragen:**
- Nur beim **Schreiben** sichtbar
- Oberhalb des Formulars angezeigt
- Werden **nicht gespeichert**, nur als Hilfestellung

**Call-to-Actions:**
- Reader sehen keine CTAs
- Contributor sehen: "Problem einreichen", "Lösung einreichen", "Upvote"
- Moderator sehen zusätzlich: Moderations-Dashboard

### V3 (geplant)

**Senioren-Interface:**
- Größere Schriftarten
- Vereinfachte Navigation
- Alternative UI-Theme

---

## 15. Nicht-Ziele

**Explizit ausgeschlossen:**

- ❌ **Kein Social Network**: Keine Freunde, Profile, Awards, Follower
- ❌ **Kein Chat/Messaging**: Keine Kommunikationsfunktionen zwischen Usern
- ❌ **Keine Projektverwaltung**: Keine Gruppen, Aufgaben, Kalender, Projekt-Management
- ❌ **Keine komplexen Kommentar-Threads**: Keine Diskussionen unter Problemen
- ❌ **Keine automatische KI-Moderation**: Alle Entscheidungen erfordern menschliche Bestätigung
- ❌ **Keine Gamification**: Keine Punkte, Badges, Leaderboards
- ❌ **Keine Email/Telefon-Authentifizierung**: Nur Einladungssystem

**Wichtig für Scope-Klarheit:**
Diese Liste dient dazu, den Fokus auf die Kernfunktionalität zu halten und Feature-Creep zu vermeiden.

---

## 16. Roadmap

### V1 MVP (0–3 Monate)

**Core Features:**
- ✅ Öffentliche Startseite (Lösungen oben, Probleme unten)
- ✅ Problem-Erstellung (Kurz/Lang, Rankings)
- ✅ Lösung-Erstellung (Kurz/Lang, Verbesserungen)
- ✅ Upvote-System (permanent, anonym)
- ✅ Einladungssystem (max 500 User, 2 Invites pro User)
- ✅ Basic Moderation (Dashboard, Löschen, Mergen)
- ✅ Duplikat-Erkennung (non-blocking, Score >0.78)
- ✅ Kategorie-Management
- ✅ Many-to-Many Links (Problem ↔ Lösung)
- ✅ Device-ID basierte Authentifizierung

**Technologie:**
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth + DB)
- PostgreSQL + pgvector
- OpenAI Embeddings

### V2 (3–9 Monate)

**Erweiterte Features:**
- AI Matching (Lösungsvorschläge für Probleme)
- Kategorie-Prediction (KI-Vorschläge)
- Analytics-Dashboard
- UX-Verbesserungen
- Gewichtete Upvotes (optional aktivierbar)

### V3 (9–18 Monate)

**Zukünftige Features:**
- Senioren-Interface (größere Schrift, vereinfachte Navigation)
- Self-Hosting Option
- Sub-Communities

---

## 17. Entscheidungen von Lukas

### 1. Problem-Beschreibung
- **Kurzbeschreibung**: 3 Sätze (max 300 Zeichen)
- **Lange Beschreibung**: max 2000 Zeichen (später auf 2500 erhöht)
- **Ranking**: Impact, Dringlichkeit, Umsetzbarkeit, Betroffenheitsgrad, Kosten – jeweils 1–10
- **Zusatzfragen**: Bleiben fix, werden nicht gespeichert

### 2. Lösungen
- **Kurzer Teaser**: 3 Sätze (max 300 Zeichen)
- **Lange Beschreibung**: max 2500 Zeichen
- **Kommentare/Verbesserungen**: bis 500 Zeichen
- **Kein Ranking** für Lösungen (erst später aktivierbar)

### 3. Userrollen
- Admin, Moderator, User (Contributor), Leser (Reader)

### 4. Kategorien-Zuordnung
- Zunächst durch User
- Struktur so bauen, dass später KI-Auto-Kategorisierung möglich ist

### 5. Einladungssystem
- Maximal 500 Plätze auf der Plattform
- Jeder User bekommt automatisch 2 Einladungen, unabhängig von Beiträgen

### 6. Gewichtete Upvotes
- Erst später als optionales Feature in die Datenbank integrierbar

### 7. Fragen für bessere Beschreibungen
- Bleibt bei den formulierten Fragen (keine zusätzlichen Mechaniken)

### 8. Sortierung am Anfang
- Oben werden zuerst die Lösungen angezeigt

### 9. Eintragslängen
- Problem: 300 Zeichen Kurz / 2500 Zeichen Lang
- Lösung: 300 Zeichen Kurz / 2500 Zeichen Lang
- Kommentare: 500 Zeichen

### 10. Impact-Level
- Bereits im Problemranking enthalten, daher kein zusätzliches Feld notwendig

### 11. First-World-Problem-Abgrenzung
- Wird erst später als optionales Feature aktiviert

### 12. Senioren-Version
- Kommt erst in späteren Versionen hinzu

---

## 18. User Flows

### User Flow — Rolle: Moderator / Admin

**Schritt 1 — Login & Start**
- Moderator meldet sich über speziellen Zugang an
- Sieht reguläre Startseite + Moderationsfunktionen

**Schritt 2 — Lesen & Kontext verstehen**
- Nutzt Plattform wie normaler User
- Kategorien öffnen, Probleme/Lösungen lesen, Detailseiten aufrufen

**Schritt 3 — Moderations-Dashboard**
- Sieht neu eingereichte Inhalte
- Sieht von Usern gemeldete Inhalte (Flags)
- Sieht AI-Duplikat-Hinweise

**Schritt 4 — Inhaltsprüfung**
- Prüft auf Spam, Hate Speech, Regelverstöße
- Kann Inhalte ausblenden, löschen, User sperren

**Schritt 5 — Kategorien & Struktur pflegen**
- Kategorien anlegen, umbenennen, anpassen

**Schritt 6 — Nutzer- & Einladungssystem**
- Einladungen generieren oder entziehen
- Einladungsrechte verwalten

**Schritt 7 — Transparenz & Nachvollziehbarkeit**
- Alle Aktionen werden protokolliert
- Begründung für jede Aktion erforderlich

**Schritt 8 — Laufender Betrieb**
- Regelmäßige Prüfung neuer Inhalte
- Strukturpflege
- Sicherstellung konstruktiver Kultur

### User Flow — Rolle: Contributor / Beitragender

**Schritt 1 — Startseite**
- Zugriff über Einladungscode
- Sieht Lösungs-Kategorien oben, Problem-Kategorien unten
- Nur Kategorienamen werden angezeigt

**Schritt 2 — Kategorie auswählen**
- Wählt Kategorie
- Innerhalb der Kategorie: Lösungen zuerst, dann Probleme
- Sortiert nach Upvotes

**Schritt 3 — Detailansicht**
- Öffnet Eintrag
- Sieht Kurzbeschreibung, Langbeschreibung, Upvote-Anzahl, Verknüpfungen
- Kann Upvotes vergeben

**Schritt 4 — Lösung einreichen**
- Kann Lösung unabhängig oder aus Problem heraus einreichen
- Unterstützende Präzisierungsfragen oberhalb des Formulars

**Schritt 5 — Problem einreichen**
- Erstellt Problem mit Kurz- und Langbeschreibung
- Strukturierende Präzisierungsfragen beim Schreiben

**Schritt 6 — Voting**
- Kann Probleme und Lösungen upvoten
- Keine Downvotes

**Schritt 7 — Weiteres Nutzen**
- Weitere Kategorien durchsuchen
- Zusätzliche Probleme/Lösungen einreichen
- Bestehende Inhalte bewerten
- Alles anonym und device-gebunden

### User Flow — Rolle: Leser (Read-only)

**Schritt 1 — Startseite**
- Öffnet Plattform ohne Login
- Sieht Lösungs-Kategorien oben, Problem-Kategorien unten
- Nur Kategorienamen werden angezeigt

**Schritt 2 — Kategorieansicht**
- Wählt Kategorie
- Sieht Liste aller Lösungen dieser Kategorie
- Dann Liste aller Probleme dieser Kategorie
- Sortiert nach Upvotes

**Schritt 3 — Detailansicht**
- Öffnet Eintrag
- Sieht Kurzbeschreibung, Langbeschreibung, Upvotes, Verknüpfungen
- Keine Interaktionsmöglichkeiten

**Schritt 4 — Weiteres Lesen**
- Kann weitere Kategorien oder Einträge öffnen
- Keine Call-to-Actions oder Aufforderungen zur Interaktion

---

## 19. Product Requirements Document (PRD)

### Version
PRD | Autor: Lukas | Datum: 2025-12-09

### Zielgruppe
Vibe Coding Team - Implementierung, Priorisierung, Teamkommunikation

### Core Features (MVP relevant)

1. **Öffentliche Startseite**
   - Für alle Besucher und eingeloggte Nutzer
   - Zwei globale Listen: oben Lösungen, unten Probleme
   - Filter nach Kategorie (optional)

2. **Nutzerrollen**
   - Gast (lesen), User (einreichen + upvoten), Moderator (prüfen, mergen), Admin

3. **Problem Erstellung**
   - Kurztext, Langtext, Rankings (5 Skalen)
   - Hilfsfragen nur für den Autor sichtbar

4. **Lösung Erstellung**
   - Kurztext, Langtext, Verbesserungsfeld
   - Hilfsfragen nur für den Autor sichtbar

5. **Upvotes only Voting**
   - Permanent, anonym, einmalig

6. **KI basierte Duplicate Erkennung**
   - Non blocking, nur Moderator Hinweis

7. **Manuelles Matching**
   - Lösungen ↔ Probleme (Many-to-Many)

8. **Anonyme Identität**
   - Device ID + optionaler Alias

9. **Einladesystem**
   - Maximal 500 Nutzer, jeder zwei Einladungen

### API Anforderungen (MVP)

- `POST /auth/invite` – Einladung konsumieren
- `POST /problems` – Problem erstellen
- `GET /problems` – Liste (für Startseite)
- `GET /problems/{id}` – Detailseite
- `POST /solutions` – Lösung erstellen
- `POST /votes` – Upvote
- `POST /moderation/merge` – Moderator Action
- `GET /categories` – Kategorien laden

### KI Funktionen

- **Duplicate Detection**: Embeddings Suche, Score >0.78 = Vorschlag
- **Matching (V2)**: Lösungsvorschläge zu Problem
- **Kategorie Suggestions (V2)**: KI schlägt Kategorien vor
- **Keine automatischen Entscheidungen**: Alles Moderator confirmed
- **Embeddings**: Nur temporär gespeichert, DSGVO konform

### Sicherheit, Datenschutz & Anonymität

- Kein Login mit Email/Telefon, nur Einladungslink
- Device ID als statische, hashed Identität
- Minimaler Datenbestand
- Rate Limiting, Captcha bei Invite Einlösung
- Rollenbasiertes Rechtesystem
- Vollständig Open Source und dokumentiert

### UI/UX Anforderungen

- Startseite: Lösungen oben, Probleme unten
- Mobile first, barrierearm
- Hilfsfragen sichtbar beim Schreiben, nicht im Endprodukt
- Klare, ruhige Darstellung, lösungsorientierte Ästhetik
- Kategorien als Filter, nicht als Navigationsebene

### Nicht Ziele

- Keine Projektorganisation (Gruppen, Aufgaben, Chat, Kalender)
- Keine komplexen Kommentar Threads bei Problemen
- Keine Social Network Features (Freunde, Profile, Awards)
- Keine automatische AI Moderation ohne menschliche Freigabe

---

## 20. Qualitätssicherung

### Testing-Strategie

**Unit Tests:**
- Backend-Logik (Voting, Duplikat-Erkennung, Validierung)
- Datenmodell-Operationen
- Utility-Funktionen

**Integration Tests:**
- API-Endpunkte
- Datenbank-Interaktionen
- Authentifizierung & Autorisierung

**E2E Tests:**
- Einreichung von Problemen/Lösungen
- Voting-Prozess
- Einladungssystem
- Moderations-Workflows

**Accessibility Tests:**
- WCAG 2.1 Compliance
- Screen-Reader-Kompatibilität
- Keyboard-Navigation
- Mobile-Usability

**Load Tests:**
- k6 für Performance-Testing
- Stress-Tests für Voting-System
- Skalierbarkeit der Duplikat-Erkennung

### Code-Qualität

- TypeScript für Type-Safety
- ESLint für Code-Standards
- Prettier für Code-Formatierung
- Pre-Commit Hooks für Qualitätssicherung

### Dokumentation

- API-Dokumentation (OpenAPI/Swagger)
- Code-Kommentare für komplexe Logik
- README mit Setup-Anleitung
- Deployment-Dokumentation

---

## Anhang: Cursor Implementation Guide

### Status: Engineering-ready

Dieses Dokument fasst alle definierten Schritte so zusammen, dass Cursor die Plattform direkt umsetzen kann.

### Zentrale Regeln für Implementierung

1. **Lösungen können mehrere Probleme lösen**
2. **Probleme können mehrere Lösungen haben**
3. **Votes sind anonym, einmalig, nicht rückgängig**
4. **Alles öffentlich lesbar**
5. **Keine KI-Blockierungen**

### Cursor Prompt für Projekt-Setup

```
Create a Next.js 14 project with TypeScript, Tailwind CSS, and Supabase integration. 
Set up the folder structure for a problem-solution platform with anonymous device-based auth, 
upvotes-only voting, and AI-powered duplicate detection. Max 500 users with invite system. 
Mobile-first, calm UI without gamification.
```

### Cursor Prompt für API-Implementierung

```
Create Next.js API routes using the App Router (route.ts files) for the Auroville Platform. 
Use Server Actions where appropriate. Implement: input validation with Zod (300/2500/500 char limits, 1-10 rankings), 
device-based auth middleware, permanent votes (no toggle), many-to-many problem-solution links, 
and moderation logging with required justification. All endpoints should return consistent JSON 
with proper HTTP status codes.
```

---

**Ende des Master-Dokuments**

*Dieses Dokument dient als vollständige Referenz für die Implementierung der Auroville Problem-Solution Plattform.*
