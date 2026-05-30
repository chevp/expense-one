# expense-one 💸

Eine schlanke **Spesenapp** (expense tracker) als Firebase Backend-as-a-Service.
Erfasse Spesen mit Beleg-Upload, sieh Auswertungen pro Kategorie — ohne eigenen Server.

## Stack

| Bereich            | Technologie                          |
| ------------------ | ------------------------------------ |
| Frontend           | Vue 3 + Vite                         |
| State              | Pinia                                |
| Styling            | Tailwind CSS v4                      |
| Auth               | Firebase Authentication (E-Mail + Google) |
| Datenbank          | Cloud Firestore (Live-Updates)       |
| Beleg-Uploads      | Firebase Storage                     |
| Hosting            | Firebase Hosting                     |

## Datenmodell

Collection `expenses`:

```json
{
  "userId": "abc123",
  "date": "2026-05-30",
  "amount": 45.90,
  "currency": "CHF",
  "category": "Verpflegung",
  "description": "Mittagessen mit Kunde",
  "receiptUrl": "https://…",
  "status": "submitted",
  "createdAt": "<serverTimestamp>"
}
```

## Setup

```bash
npm install
cp .env.example .env   # Werte aus Firebase-Konsole eintragen
npm run dev
```

### Firebase-Projekt vorbereiten

1. Projekt in der [Firebase-Konsole](https://console.firebase.google.com) anlegen.
2. **Authentication** → Sign-in method → *E-Mail/Passwort* und *Google* aktivieren.
3. **Firestore** und **Storage** anlegen.
4. SDK-Config (Projekt­einstellungen → Web-App) in `.env` eintragen.
5. Regeln deployen:

   ```bash
   firebase deploy --only firestore:rules,storage
   ```

> **Composite Index:** Das Dashboard fragt `where('userId','==',…)` kombiniert
> mit `orderBy('date','desc')` ab. Firestore verlangt dafür beim ersten Aufruf
> einen zusammengesetzten Index — der Konsolen-Fehler enthält einen Direktlink
> zum Anlegen.

## Deploy

```bash
npm run deploy   # vite build + firebase deploy
```

## Projektstruktur

```
src/
├── lib/firebase.js        # Firebase-Initialisierung (db, auth, storage)
├── stores/
│   ├── auth.js            # Pinia: Login-Zustand, Auth-Aktionen
│   └── expenses.js        # Pinia: Live-Liste, Upload, CRUD, Aggregationen
├── router/index.js        # Routen + Auth-Guard
├── views/
│   ├── LoginView.vue
│   ├── DashboardView.vue
│   └── ExpenseFormView.vue
└── components/
    └── ExpenseCard.vue
```

## Lizenz

[Apache 2.0](./LICENSE)
