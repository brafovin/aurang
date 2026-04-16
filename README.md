# Aurang – Geografie-Quiz 🌍

Ein kleines, schnelles Lern-/Bildungsspiel im Browser.
Kein Build, keine Installation, einfach `index.html` öffnen.

## Features

- **4 Spielmodi**
  - 🏛️ Hauptstädte raten (Land → Hauptstadt)
  - 🚩 Flaggen raten (Flagge → Land)
  - 🗺️ Land zur Hauptstadt (Hauptstadt → Land)
  - 🎲 Gemischt (zufälliger Modus pro Frage)
- **4 Schwierigkeitsstufen** – Leicht, Mittel, Schwer, Alle
- **Kontinent-Filter** – gezielt Europa, Asien, Afrika, Nord-/Südamerika, Ozeanien üben
- **10 Fragen pro Runde** mit je 4 Antwortmöglichkeiten
- **Punkte & Streak** inkl. Anzeige einer Serie (🔥)
- **Highscore** lokal gespeichert (localStorage)
- **Tastatur-Support** – Antworten mit `1`–`4`, weiter mit `Enter`
- **Responsive** – funktioniert auf Handy, Tablet & Desktop
- **Barrierearm** – respektiert `prefers-reduced-motion`, Fokus-Indikatoren

## Starten

```bash
# Einfach index.html im Browser öffnen:
xdg-open index.html        # Linux
open index.html            # macOS
start index.html           # Windows

# Oder per lokalem Server (optional):
python3 -m http.server 8000
# dann http://localhost:8000 öffnen
```

## Projektstruktur

```
aurang/
├── index.html     # Markup (Startmenü, Quiz, Ergebnis)
├── styles.css     # Styling (dark theme, responsive)
├── app.js         # Quiz-Logik
├── countries.js   # ~110 Länder mit Hauptstädten, Flaggen, Schwierigkeit
└── README.md
```

## Erweitern

- **Länder hinzufügen** – neues Objekt in `countries.js` ergänzen:
  ```js
  { name: "…", capital: "…", flag: "🏳️", continent: "…", difficulty: 1 }
  ```
- **Fragen pro Runde ändern** – `QUESTIONS_PER_ROUND` oben in `app.js`.
- **Neue Modi** – Logik in `makeQuestion()` in `app.js` erweitern.

## Lizenz

MIT – viel Spaß beim Spielen & Lernen!
