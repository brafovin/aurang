# Aurang – Geografie-Quiz 🌍

Ein **Kahoot-inspiriertes Geografie-Quiz** im Browser.
Bunt, schnell, mit echten Bildern und Timer – für Jung und Alt.
Kein Build, keine Installation: einfach `index.html` öffnen.

## Features

- **Kahoot-Style UI** – 4 große farbige Antwort-Kacheln mit Formen
  (🔺 Rot, ◆ Blau, ● Gelb, ■ Grün)
- **Echte Flaggen-Bilder** über `flagcdn.com` (mit Emoji-Fallback)
- **Timer pro Frage** – 10 s (Blitz) / 15 s (Normal) / 30 s (Entspannt) / ohne Zeitdruck
- **Tempo-Punkte** – je schneller, desto mehr (500 Sockel + bis zu 500 Tempo + 100 Streak)
- **4 Spielmodi**
  - 🚩 Flagge → Land
  - 🏛️ Hauptstadt zum Land
  - 🗺️ Land zur Hauptstadt
  - 🎲 Alles gemischt
- **Filter** – Schwierigkeit (leicht/mittel/schwer/alle) und Kontinent
- **Streak-System** – Serie richtiger Antworten bringt Bonus-Punkte 🔥
- **Highscore** lokal gespeichert (localStorage)
- **Tastatur** – Antworten mit `1`–`4`, weiter mit `Enter`
- **Responsive** – Handy, Tablet, Desktop
- **Barrierearm** – respektiert `prefers-reduced-motion`, sichtbarer Fokus

## Starten

```bash
# Einfach index.html im Browser öffnen:
xdg-open index.html        # Linux
open index.html            # macOS
start index.html           # Windows

# Oder per lokalem Server (optional, für das beste Laden der Flaggen-Bilder):
python3 -m http.server 8000
# dann http://localhost:8000 öffnen
```

> Flaggen-Bilder werden von `flagcdn.com` geladen (kostenlos, kein Account nötig).
> Ohne Internet fällt das Quiz automatisch auf Emoji-Flaggen zurück.

## Punktesystem

| Ereignis            | Punkte                                        |
|---------------------|-----------------------------------------------|
| Richtige Antwort    | `500` Sockel + bis zu `500` Tempo-Bonus       |
| Streak-Bonus        | `+100` je richtiger Antwort ab 2er-Serie      |
| Falsche Antwort     | `0`                                           |
| Zeit abgelaufen     | `0` (gilt als falsch)                         |

**Maximum pro Frage:** 1100 (sofort richtig mit aktivem Streak)

## Projektstruktur

```
aurang/
├── index.html     # Markup (Start, Quiz, Ergebnis)
├── styles.css     # Kahoot-Style (Farben, Formen, Animationen)
├── app.js         # Quiz-Logik + Timer + Tempo-Punkte
├── countries.js   # 118 Länder (Name, Hauptstadt, Flagge, Schwierigkeit)
└── README.md
```

## Erweitern

- **Länder ergänzen** → neues Objekt in `countries.js`:
  ```js
  { name: "…", capital: "…", flag: "🏳️", continent: "…", difficulty: 1 }
  ```
- **Punkte anpassen** → Konstanten oben in `app.js` (`BASE_POINTS`, `SPEED_POINTS`, `STREAK_BONUS`)
- **Fragen pro Runde** → `QUESTIONS_PER_ROUND` in `app.js`

## Lizenz

MIT – viel Spaß beim Spielen & Lernen!
