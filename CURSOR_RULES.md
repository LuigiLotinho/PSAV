# Cursor Rules: Next.js + React + Tailwind
## Auroville Problem-Solution Plattform

**Version:** 1.1 | **Datum:** 2025-12-09  
**Zweck:** Entwicklungsrichtlinien für Next.js (App Router), React, TypeScript und Tailwind CSS

---

## Inhaltsverzeichnis

1. [Core Principles](#1-core-principles)
2. [App Router & Architektur](#2-app-router--architektur)
3. [React Components](#3-react-components)
4. [Forms & Validation](#4-forms--validation)
5. [Tailwind & UI](#5-tailwind--ui)
6. [Accessibility](#6-accessibility)
7. [JavaScript & Client Code](#7-javascript--client-code)
8. [Performance](#8-performance)
9. [Code Style & Conventions](#9-code-style--conventions)
10. [Mindset](#10-mindset)

---

## 1. Core Principles

### Grundlegende Regeln

- **Immer `/instructions` lesen** bevor Code geschrieben oder modifiziert wird
- **Server-First-Ansatz**: Server Components bevorzugen, Client Components nur wenn nötig
- **TypeScript überall** (keine `any`, klare Typen für Datenmodelle)
- **Minimiere Client-Logik**; keine zusätzlichen Frontend-Frameworks einführen
- **Priorisiere**: Klarheit, Wartbarkeit, Accessibility, vorhersehbares Verhalten

### Philosophie

- Server ist die Quelle der Wahrheit
- Datenzugriff und Mutationen über Server Actions/Route Handlers
- Progressive Enhancement über Server Components + minimale Client-Interaktionen
- Einfache, langfristig wartbare Software

---

## 2. App Router & Architektur

### Struktur

- **App Router** verwenden (`app/` statt `pages/`)
- **Server Components** sind Default
- **Route Handlers** in `app/api/**/route.ts`
- **Server Actions** für Mutationen
- **Shared UI** in `components/`
- **Utility-Funktionen** in `lib/`

### Semantisches HTML

- Verwende semantische HTML5-Elemente:
  - `<header>`, `<main>`, `<section>`, `<nav>`, `<form>`, `<button>`
  - `<article>` für Inhalte, `<aside>` für Sidebars
  - `<footer>` für Fußzeilen

### Beispiel-Struktur

```tsx
export default function Page() {
  return (
    <main className="container mx-auto px-4">
      <section aria-labelledby="solutions-heading">
        <h2 id="solutions-heading" className="text-xl font-semibold">
          Lösungen
        </h2>
        {/* Solutions list */}
      </section>
      <section aria-labelledby="problems-heading" className="mt-8">
        <h2 id="problems-heading" className="text-xl font-semibold">
          Probleme
        </h2>
        {/* Problems list */}
      </section>
    </main>
  )
}
```

---

## 3. React Components

### Server vs Client

- **Server Components** als Default
- **Client Components** nur wenn nötig (`'use client'`)
- **Keine Client-Logik** für Dinge, die auf dem Server gehören

### Daten-Fetching

- Daten in Server Components laden
- Client Components erhalten Daten per Props
- Caching und Revalidation via `fetch` Options oder Tags

### Beispiel

```tsx
import { getSolutions } from "@/lib/data"

export default async function SolutionsSection() {
  const solutions = await getSolutions({ limit: 10, orderBy: "upvotes" })

  return (
    <section className="space-y-4">
      {solutions.map((solution) => (
        <article key={solution.id} className="rounded-lg border p-4">
          <h3 className="font-semibold">{solution.short_text}</h3>
          <p className="text-sm text-muted-foreground">{solution.long_text}</p>
        </article>
      ))}
    </section>
  )
}
```

---

## 4. Forms & Validation

### Server-Side Validation

- **Validierung immer auf dem Server** durchführen
- **Zod für Schema-Validierung** verwenden
- **Server Actions** für Mutationen

### Validation Feedback

- **Fehlerzustände** mit klaren UI-States darstellen
- **Form-State** in Client Components verwalten, wenn nötig
- **Fehlertexte** neben Feldern anzeigen

### Beispiel: Problem-Erstellung (Server Action)

```tsx
"use server"

import { z } from "zod"

const problemSchema = z.object({
  short_text: z.string().min(10).max(300),
  long_text: z.string().max(2500).optional(),
  category_id: z.string().uuid(),
  rankings: z.object({
    impact: z.number().min(1).max(10),
    urgency: z.number().min(1).max(10),
    feasibility: z.number().min(1).max(10),
    affected: z.number().min(1).max(10),
    costs: z.number().min(1).max(10),
  }),
})

export async function createProblem(formData: FormData) {
  const raw = {
    short_text: formData.get("short_text"),
    long_text: formData.get("long_text"),
    category_id: formData.get("category_id"),
    rankings: {
      impact: Number(formData.get("impact")),
      urgency: Number(formData.get("urgency")),
      feasibility: Number(formData.get("feasibility")),
      affected: Number(formData.get("affected")),
      costs: Number(formData.get("costs")),
    },
  }

  const parsed = problemSchema.safeParse(raw)
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten() }
  }

  // Persist data here...
  return { ok: true }
}
```

### Fehlerdarstellung

- **Field-level Errors** direkt unter dem Feld
- **Global Errors** als Alert-Komponente (z. B. `components/ui/alert`)

### User Input Preservation

- **Eingaben bei Validation Errors erhalten**
- Formular-State auf Server speichern oder in Response zurückgeben
- Beispiel: `value="{{old_input}}"` in Templates

### Global Messages

- Verwende `components/ui/alert` oder `sonner` für Toasts

---

## 5. Tailwind & UI

### Tailwind-Prinzipien

- Utility-First-Ansatz
- Konsistente Spacing- und Typografie-Skalen
- Möglichst keine custom CSS-Dateien
- Komponenten aus `components/ui` (shadcn/ui) bevorzugen

### Beispiel: Layout

```tsx
<main className="container mx-auto px-4">
  <section className="space-y-4">
    <h2 className="text-xl font-semibold">Lösungen</h2>
    <div className="grid gap-4 md:grid-cols-2">
      {/* Cards */}
    </div>
  </section>
</main>
```

---

## 6. Accessibility

### Form Fields

- **Alle Formular-Felder müssen Labels haben**
- `<label for="field_id">` verwenden
- Oder `aria-label` wenn Label nicht sichtbar sein soll

### Semantische Elemente

- **Semantische Elemente vor ARIA-Attributen** verwenden
- Beispiel: `<button>` statt `<div role="button">`
- ARIA nur wenn semantisches HTML nicht ausreicht

### Keyboard Navigation

- **Tastatur-Navigation für alle interaktiven Elemente** sicherstellen
- Tab-Reihenfolge logisch
- Focus-States sichtbar (Bootstrap bietet diese)
- Enter/Space für Buttons funktioniert automatisch

### Feedback States

- **Loading**: Skeletons oder Loading-States in Komponenten
- **Success**: Toasts (`sonner`) oder Alerts
- **Error**: Inline Errors + globale Alerts

### Beispiel: Accessible Upvote-Button

```tsx
<button
  type="submit"
  aria-label={`Upvote für Problem: ${problem.short_text}`}
  className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
>
  <span aria-hidden="true">▲</span>
  <span>{problem.upvote_count}</span>
</button>
```

---

## 7. JavaScript & Client Code

### Minimale Verwendung

- **Client Code minimieren**
- Nur `use client`, wenn Interaktion nötig ist (Form-Feedback, Modals, Tabs)
- Kein Duplizieren von Server-Logik im Client

### Keine Duplikation

- **Keine Server-Logik in JavaScript duplizieren**
- Validierung auf Server, nicht Client
- Business-Logik auf Server

### Beispiel: Erlaubter Client Hook

```tsx
"use client"

import { useState } from "react"

export function CharCounter({ max }: { max: number }) {
  const [value, setValue] = useState("")
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={max}
        className="w-full rounded-md border p-2"
      />
      <p className="text-xs text-muted-foreground">{value.length}/{max}</p>
    </div>
  )
}
```

### Nicht erlaubt

- ❌ Client-Side Routing
- ❌ State Management Libraries
- ❌ Zusätzliche Frontend-Frameworks
- ❌ Duplikation von Server-Logik

---

## 8. Performance

### Rendering

- Nutze Server Components für statische Inhalte
- Client Components nur wo nötig
- Avoid re-rendering großer Listen im Client

### Assets & Images

- **Assets optimieren**
- Bilder komprimieren
- Lazy Loading für Bilder (Bootstrap bietet `loading="lazy"`)

### Caching

- `fetch` mit `next: { revalidate }` oder `cache: "force-cache"` nutzen
- Tags/Invalidation für Upvotes und Listen

### Beispiel: Effiziente Liste (Server Component + Pagination)

```tsx
export default async function ProblemsPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = Number(searchParams.page ?? "1")
  const problems = await getProblems({ page, limit: 20 })
  return <ProblemsList problems={problems} />
}
```

---

## 9. Code Style & Conventions

### Naming Conventions

- **Konsistente Namensgebung** für:
  - **Routes**: `/problems`, `/solutions`, `/votes`
  - **Components**: `ProblemCard`, `SolutionList`
  - **Server Actions**: `createProblem`, `upvoteProblem`
  - **IDs**: `problem-${id}`, `solution-${id}`

### Explizit über Implizit

- Klare Datenflüsse und Props
- Server Actions statt versteckter Client-Logik

### Kommentare

- **Kommentiere WARUM**, nicht WAS
- Code sollte selbsterklärend sein
- Kommentare für komplexe Logik oder Entscheidungen

### Beispiel: Guter Code-Style

```tsx
export function ProblemCard({ problem }: { problem: Problem }) {
  return (
    <article id={`problem-${problem.id}`} className="rounded-lg border p-4">
      <h3 className="font-semibold">{problem.short_text}</h3>
      <p className="text-sm text-muted-foreground">{problem.long_text}</p>
    </article>
  )
}
```

---

## 10. Mindset

### Server-Driven Thinking

- Denke in Server Components und Datenflüssen
- Client State nur für lokale UI-Interaktionen

### Server Owns the Truth

- Server Actions sind der einzige Weg für Mutationen
- Client hat keinen eigenen Source of Truth

### Boring Software

- **Baue langweilige, zuverlässige, langlebige Software**
- Keine überkomplizierten Patterns
- Einfache, verständliche Lösungen
- Wartbar und vorhersehbar

### Beispiel-Mindset

❌ **Falsch (Client-First):**
```tsx
const [problems, setProblems] = useState<Problem[]>([])
useEffect(() => {
  fetch("/api/problems").then(...)
}, [])
```

✅ **Richtig (Server-First):**
```tsx
export default async function Page() {
  const problems = await getProblems({ limit: 20 })
  return <ProblemsList problems={problems} />
}
```

---

## Spezielle Anforderungen für Auroville Plattform

### Problem-Erstellung (Server Action + Client Form)

- Hilfsfragen nur beim Schreiben sichtbar
- Zeichenlimits: 300/2500
- Rankings 1–10 (5 Felder)

### Lösung-Erstellung

- Zeichenlimits: 300/2500/500
- Kein Ranking im MVP
- Many-to-Many Verknüpfung möglich

---

## Checkliste für Code-Review

- [ ] Server Components als Default, Client Components nur wenn nötig
- [ ] Validation mit Zod auf dem Server
- [ ] Tailwind statt custom CSS
- [ ] shadcn/ui Komponenten konsistent genutzt
- [ ] Alle Formular-Felder haben Labels
- [ ] Keyboard-Navigation funktioniert
- [ ] Loading-States sichtbar (Skeleton/Spinner)
- [ ] Error-Handling mit Alerts/Toasts
- [ ] Keine Server-Logik im Client dupliziert
- [ ] Konsistente Namensgebung
- [ ] Helper Questions nur beim Schreiben sichtbar
- [ ] Permanent Votes mit Bestätigung
- [ ] Many-to-Many Links funktionieren
- [ ] Moderation-Aktionen erfordern Begründung

---

**Ende des Dokuments**

*Diese Rules gelten für die Entwicklung der Auroville Problem-Solution Plattform mit Next.js, React und Tailwind.* 
