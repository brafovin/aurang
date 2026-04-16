/* ─────────────────────────────────────────────────────────
   Aurang – Geografie-Quiz · Kahoot-Style-Logik
   ───────────────────────────────────────────────────────── */

(function () {
  "use strict";

  const QUESTIONS_PER_ROUND = 10;
  const ANSWERS_PER_QUESTION = 4;
  const HS_STORAGE_KEY = "aurang.highscore.v2";
  const BASE_POINTS = 500;       // Sockel für richtige Antwort
  const SPEED_POINTS = 500;      // Zusätzlich möglich je nach Tempo
  const STREAK_BONUS = 100;      // Bonus pro Frage ab Streak 2

  // ── State ──────────────────────────────────────────────
  const state = {
    settings: { mode: "flag", difficulty: 1, continent: "all", timeLimit: 15 },
    questions: [],
    current: 0,
    score: 0,
    correctCount: 0,
    streak: 0,
    bestStreak: 0,
    answered: false,
    review: [],
    questionStart: 0,
    timerId: null,
    rafId: null,
  };

  // ── DOM helpers ───────────────────────────────────────
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const screens = {
    start: $("#screen-start"),
    quiz: $("#screen-quiz"),
    result: $("#screen-result"),
  };

  function showScreen(name) {
    Object.values(screens).forEach((s) => s.classList.remove("active"));
    screens[name].classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Utilities ──────────────────────────────────────────
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function pickRandom(arr, n) { return shuffle(arr).slice(0, n); }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[ch]));
  }

  // Flag-Emoji → ISO-2 (z. B. 🇩🇪 → "de")
  function flagToISO(flag) {
    try {
      const chars = [...flag];
      if (chars.length < 2) return null;
      const a = chars[0].codePointAt(0);
      const b = chars[1].codePointAt(0);
      const BASE = 0x1F1E6;
      if (a < BASE || b < BASE) return null;
      return (
        String.fromCharCode(65 + (a - BASE)) +
        String.fromCharCode(65 + (b - BASE))
      ).toLowerCase();
    } catch { return null; }
  }

  function flagImageUrl(flag) {
    const iso = flagToISO(flag);
    return iso ? `https://flagcdn.com/w640/${iso}.png` : null;
  }

  // ── Highscore ──────────────────────────────────────────
  function getHighscore() {
    try {
      const raw = localStorage.getItem(HS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  function setHighscore(payload) {
    try { localStorage.setItem(HS_STORAGE_KEY, JSON.stringify(payload)); } catch {}
  }

  function formatHighscore(hs) {
    if (!hs) return "—";
    const modeLabels = {
      capital: "Hauptstädte", flag: "Flaggen", country: "Länder", mixed: "Gemischt",
    };
    return `${hs.score} Punkte · ${modeLabels[hs.mode] || hs.mode}`;
  }

  // ── Settings ───────────────────────────────────────────
  function readSettings() {
    return {
      mode: $('input[name="mode"]:checked')?.value || "flag",
      difficulty: parseInt($('input[name="difficulty"]:checked')?.value || "1", 10),
      continent: $('input[name="continent"]:checked')?.value || "all",
      timeLimit: parseInt($('input[name="time"]:checked')?.value || "15", 10),
    };
  }

  // ── Pool & Fragen ──────────────────────────────────────
  function buildPool(settings) {
    let pool = COUNTRIES.slice();
    if (settings.continent !== "all") {
      pool = pool.filter((c) => c.continent === settings.continent);
    }
    if (settings.difficulty !== 0) {
      pool = pool.filter((c) => c.difficulty <= settings.difficulty);
    }
    return pool;
  }

  function pickModeForQuestion(mode) {
    if (mode !== "mixed") return mode;
    return ["capital", "flag", "country"][Math.floor(Math.random() * 3)];
  }

  function makeQuestion(country, pool, mode) {
    const need = ANSWERS_PER_QUESTION - 1;
    let source = pool.filter(
      (c) => c.continent === country.continent && c.name !== country.name
    );
    if (source.length < need) source = pool.filter((c) => c.name !== country.name);
    if (source.length < need) source = COUNTRIES.filter((c) => c.name !== country.name);
    const distractors = pickRandom(source, need);

    let prompt, imageType, imageData, questionText, correct, options;

    if (mode === "capital") {
      prompt = "Wie heißt die Hauptstadt von …";
      imageType = "emoji";
      imageData = country.flag;
      questionText = country.name + "?";
      correct = country.capital;
      options = shuffle([correct, ...distractors.map((d) => d.capital)]);
    } else if (mode === "flag") {
      prompt = "Zu welchem Land gehört diese Flagge?";
      imageType = "flag";
      imageData = { url: flagImageUrl(country.flag), alt: "Flagge " + country.name, emoji: country.flag };
      questionText = "";
      correct = country.name;
      options = shuffle([correct, ...distractors.map((d) => d.name)]);
    } else { // country
      prompt = "Zu welchem Land gehört diese Hauptstadt?";
      imageType = "none";
      imageData = null;
      questionText = country.capital;
      correct = country.name;
      options = shuffle([correct, ...distractors.map((d) => d.name)]);
    }

    return {
      country, mode, prompt, imageType, imageData,
      questionText, correct, options,
    };
  }

  function buildQuestions(settings) {
    const pool = buildPool(settings);
    if (pool.length === 0) return null;
    const chosen = pickRandom(pool, Math.min(QUESTIONS_PER_ROUND, pool.length));
    return chosen.map((c) => makeQuestion(c, pool, pickModeForQuestion(settings.mode)));
  }

  // ── Rendering ──────────────────────────────────────────
  function renderQuestion() {
    const q = state.questions[state.current];
    state.answered = false;

    // Topbar
    $("#progress-text").textContent = `${state.current + 1}/${state.questions.length}`;
    $("#score-text").textContent = state.score.toLocaleString("de-DE");

    const streakChip = $("#streak-chip");
    if (state.streak >= 2) {
      streakChip.classList.remove("hidden");
      $("#streak-value").textContent = `${state.streak} 🔥`;
    } else {
      streakChip.classList.add("hidden");
    }

    // Frage-Inhalt
    $("#question-prompt").textContent = q.prompt;
    $("#question-text").textContent = q.questionText;

    const imgWrap = $("#question-image");
    imgWrap.innerHTML = "";
    imgWrap.classList.remove("hidden", "emoji-only");

    if (q.imageType === "flag" && q.imageData?.url) {
      const img = document.createElement("img");
      img.alt = q.imageData.alt;
      img.src = q.imageData.url;
      img.loading = "eager";
      // Fallback: falls Bild nicht lädt, zeig Emoji-Flagge
      img.onerror = () => {
        imgWrap.innerHTML = "";
        imgWrap.classList.add("emoji-only");
        imgWrap.textContent = q.imageData.emoji;
      };
      imgWrap.appendChild(img);
    } else if (q.imageType === "emoji") {
      imgWrap.classList.add("emoji-only");
      imgWrap.textContent = q.imageData;
    } else {
      imgWrap.classList.add("hidden");
    }

    // Antwort-Kacheln
    const tiles = $$(".answer-tile");
    tiles.forEach((tile, i) => {
      tile.classList.remove("correct", "wrong", "dimmed");
      tile.disabled = false;
      const txt = tile.querySelector(".tile-text");
      txt.textContent = q.options[i] || "";
      tile.dataset.value = q.options[i] || "";
    });

    // Feedback / Next
    const fb = $("#feedback");
    fb.textContent = "";
    fb.className = "feedback";
    $("#btn-next").classList.add("hidden");

    // Timer starten
    startTimer();
  }

  // ── Timer ──────────────────────────────────────────────
  function startTimer() {
    stopTimer();
    const fill = $("#timer-fill");
    const txt = $("#timer-text");
    fill.classList.remove("warning");

    const limit = state.settings.timeLimit;
    state.questionStart = performance.now();

    if (limit <= 0) {
      // Ohne Zeitdruck: Timer-Bar ausblenden
      $("#timer-wrap").classList.add("hidden");
      return;
    }
    $("#timer-wrap").classList.remove("hidden");

    // Sofort auf 100%
    fill.style.transition = "none";
    fill.style.width = "100%";
    txt.textContent = String(limit);

    // Nach einem Frame die Animation starten
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        fill.style.transition = `width ${limit}s linear`;
        fill.style.width = "0%";
      });
    });

    const tick = () => {
      const elapsed = (performance.now() - state.questionStart) / 1000;
      const remaining = Math.max(0, limit - elapsed);
      txt.textContent = remaining > 0 ? Math.ceil(remaining).toString() : "0";
      if (remaining <= 3 && remaining > 0) fill.classList.add("warning");
      if (remaining <= 0) {
        stopTimer();
        if (!state.answered) handleTimeout();
        return;
      }
      state.rafId = requestAnimationFrame(tick);
    };
    state.rafId = requestAnimationFrame(tick);
  }

  function stopTimer() {
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
      state.rafId = null;
    }
    if (state.timerId) {
      clearTimeout(state.timerId);
      state.timerId = null;
    }
  }

  function remainingFraction() {
    const limit = state.settings.timeLimit;
    if (limit <= 0) return 1; // ohne Zeitdruck: volle Punkte
    const elapsed = (performance.now() - state.questionStart) / 1000;
    return Math.max(0, Math.min(1, 1 - elapsed / limit));
  }

  // ── Antwort-Handling ───────────────────────────────────
  function handleAnswer(chosen, tileEl) {
    if (state.answered) return;
    state.answered = true;
    stopTimer();

    // Timer einfrieren
    const fill = $("#timer-fill");
    const computed = getComputedStyle(fill).width;
    fill.style.transition = "none";
    fill.style.width = computed;

    const q = state.questions[state.current];
    const isCorrect = chosen === q.correct;

    // Punkte berechnen
    let points = 0;
    if (isCorrect) {
      const frac = remainingFraction();
      points = BASE_POINTS + Math.round(SPEED_POINTS * frac);
      if (state.streak >= 1) points += STREAK_BONUS; // Streak ab 2. richtiger in Folge
      state.score += points;
      state.correctCount++;
      state.streak++;
      state.bestStreak = Math.max(state.bestStreak, state.streak);
    } else {
      state.streak = 0;
    }

    // Kacheln markieren
    $$(".answer-tile").forEach((t) => {
      t.disabled = true;
      if (t.dataset.value === q.correct) t.classList.add("correct");
      else if (t === tileEl) t.classList.add("wrong");
      else t.classList.add("dimmed");
    });

    // Feedback
    const fb = $("#feedback");
    if (isCorrect) {
      fb.textContent = `✓ Richtig! +${points.toLocaleString("de-DE")} Punkte`;
      fb.className = "feedback correct";
      showPointsPopup("+" + points.toLocaleString("de-DE"), false);
    } else if (chosen === null) {
      fb.textContent = `⏰ Zeit abgelaufen. Richtig: ${q.correct}`;
      fb.className = "feedback wrong";
      showPointsPopup("⏰", true);
    } else {
      fb.textContent = `✗ Leider falsch. Richtig: ${q.correct}`;
      fb.className = "feedback wrong";
      showPointsPopup("✗", true);
    }

    state.review.push({
      prompt: q.prompt,
      questionText: q.questionText,
      imageEmoji: q.imageType === "flag" ? q.imageData.emoji :
                  q.imageType === "emoji" ? q.imageData : "",
      chosen: chosen === null ? "— (zu spät)" : chosen,
      correct: q.correct,
      isCorrect,
      points,
    });

    $("#score-text").textContent = state.score.toLocaleString("de-DE");
    $("#btn-next").classList.remove("hidden");
    $("#btn-next").focus();
  }

  function handleTimeout() {
    handleAnswer(null, null);
  }

  function showPointsPopup(text, miss) {
    const pop = $("#points-popup");
    pop.textContent = text;
    pop.classList.toggle("miss", miss);
    pop.classList.remove("hidden", "show");
    // Reflow → Animation startet
    void pop.offsetWidth;
    pop.classList.add("show");
    setTimeout(() => {
      pop.classList.remove("show");
      setTimeout(() => pop.classList.add("hidden"), 400);
    }, 900);
  }

  function nextQuestion() {
    state.current++;
    if (state.current >= state.questions.length) showResult();
    else renderQuestion();
  }

  // ── Result ─────────────────────────────────────────────
  function showResult() {
    stopTimer();
    const total = state.questions.length;
    const pct = total === 0 ? 0 : Math.round((state.correctCount / total) * 100);

    let emoji, title, message;
    if (pct === 100) {
      emoji = "🏆"; title = "Perfekt!"; message = "Alle Fragen richtig – du bist ein echter Weltenbummler!";
    } else if (pct >= 80) {
      emoji = "🎉"; title = "Ausgezeichnet!"; message = "Beeindruckendes Geografie-Wissen.";
    } else if (pct >= 60) {
      emoji = "👍"; title = "Gut gemacht!"; message = "Solide Leistung – da ist noch mehr drin!";
    } else if (pct >= 40) {
      emoji = "🤔"; title = "Geht so."; message = "Ein paar Treffer – weiter üben lohnt sich.";
    } else {
      emoji = "🌍"; title = "Ein Anfang!"; message = "Kein Problem – Geografie lernt man durchs Spielen.";
    }

    $("#result-emoji").textContent = emoji;
    $("#result-title").textContent = title;
    $("#result-score").textContent = state.score.toLocaleString("de-DE");
    $("#result-message").textContent = message;
    $("#result-correct").textContent = `${state.correctCount}/${total}`;
    $("#result-best-streak").textContent = state.bestStreak;
    $("#result-accuracy").textContent = `${pct}%`;

    // Highscore prüfen
    const hs = getHighscore();
    const isBetter = !hs || state.score > hs.score;
    const badge = $("#result-new-hs");
    if (isBetter && state.score > 0) {
      setHighscore({
        score: state.score,
        correct: state.correctCount,
        total,
        mode: state.settings.mode,
        at: Date.now(),
      });
      badge.classList.remove("hidden");
    } else {
      badge.classList.add("hidden");
    }

    // Review
    const review = $("#result-review");
    review.innerHTML = "";
    state.review.forEach((r, i) => {
      const item = document.createElement("div");
      item.className = "review-item " + (r.isCorrect ? "correct" : "wrong");
      const imagePrefix = r.imageEmoji ? `${r.imageEmoji} ` : "";
      const qPart = r.questionText
        ? `${escapeHtml(r.prompt)} ${escapeHtml(r.questionText)}`
        : `${imagePrefix}${escapeHtml(r.prompt)}`;
      item.innerHTML = `
        <div>
          <div class="review-q">${i + 1}. ${qPart}</div>
          ${r.isCorrect
            ? ""
            : `<div class="review-correct">Richtig: ${escapeHtml(r.correct)}</div>`}
        </div>
        <div class="review-a">${r.isCorrect ? "✓" : "✗"} ${escapeHtml(r.chosen)}</div>
      `;
      review.appendChild(item);
    });

    updateHighscoreDisplay();
    showScreen("result");
  }

  function updateHighscoreDisplay() {
    $("#highscore-value").textContent = formatHighscore(getHighscore());
  }

  // ── Quiz starten ───────────────────────────────────────
  function startQuiz() {
    state.settings = readSettings();
    const qs = buildQuestions(state.settings);
    if (!qs || qs.length === 0) {
      alert("Zu wenig Länder für diese Auswahl. Bitte andere Einstellungen wählen.");
      return;
    }
    state.questions = qs;
    state.current = 0;
    state.score = 0;
    state.correctCount = 0;
    state.streak = 0;
    state.bestStreak = 0;
    state.review = [];
    renderQuestion();
    showScreen("quiz");
  }

  // ── Keyboard ───────────────────────────────────────────
  function handleKeydown(e) {
    if (!screens.quiz.classList.contains("active")) return;

    if (!state.answered && ["1", "2", "3", "4"].includes(e.key)) {
      const idx = parseInt(e.key, 10) - 1;
      const tiles = $$(".answer-tile");
      if (tiles[idx]) {
        e.preventDefault();
        tiles[idx].click();
      }
    } else if (state.answered && (e.key === "Enter" || e.key === " ")) {
      const nextBtn = $("#btn-next");
      if (!nextBtn.classList.contains("hidden")) {
        e.preventDefault();
        nextBtn.click();
      }
    }
  }

  // ── Init ───────────────────────────────────────────────
  function init() {
    updateHighscoreDisplay();

    $("#btn-start").addEventListener("click", startQuiz);
    $("#btn-next").addEventListener("click", nextQuestion);
    $("#btn-back").addEventListener("click", () => { stopTimer(); showScreen("start"); });
    $("#btn-retry").addEventListener("click", startQuiz);
    $("#btn-home").addEventListener("click", () => {
      updateHighscoreDisplay();
      showScreen("start");
    });

    // Klick-Handler für die 4 festen Kacheln
    $$(".answer-tile").forEach((tile) => {
      tile.addEventListener("click", () => {
        if (tile.disabled || state.answered) return;
        handleAnswer(tile.dataset.value, tile);
      });
    });

    document.addEventListener("keydown", handleKeydown);

    // Bei Tab-Wechsel Timer pausieren wäre schöner – für jetzt: wenn der User
    // zurückkommt und das Quiz aktiv ist, läuft er einfach weiter.
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
