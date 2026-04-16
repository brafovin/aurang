/* ─────────────────────────────────────────────────────────
   Aurang – Geografie-Quiz · Logik
   ───────────────────────────────────────────────────────── */

(function () {
  "use strict";

  const QUESTIONS_PER_ROUND = 10;
  const ANSWERS_PER_QUESTION = 4;
  const HS_STORAGE_KEY = "aurang.highscore.v1";

  // ── State ──────────────────────────────────────────────
  const state = {
    settings: { mode: "capital", difficulty: 1, continent: "all" },
    pool: [],
    questions: [],
    current: 0,
    score: 0,
    streak: 0,
    bestStreak: 0,
    answered: false,
    review: [],
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

  function pickRandom(arr, n) {
    return shuffle(arr).slice(0, n);
  }

  function getHighscore() {
    try {
      const raw = localStorage.getItem(HS_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function setHighscore(score, total, meta) {
    const payload = { score, total, ...meta, at: Date.now() };
    try {
      localStorage.setItem(HS_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* quota or privacy mode – ignore */
    }
    return payload;
  }

  function formatHighscore(hs) {
    if (!hs) return "—";
    const modeLabels = {
      capital: "Hauptstädte",
      flag: "Flaggen",
      country: "Länder",
      mixed: "Gemischt",
    };
    return `${hs.score}/${hs.total} · ${modeLabels[hs.mode] || hs.mode}`;
  }

  // ── Settings (Start-Screen) ────────────────────────────
  function readSettings() {
    const mode = $('input[name="mode"]:checked')?.value || "capital";
    const difficulty = parseInt($('input[name="difficulty"]:checked')?.value || "1", 10);
    const continent = $('input[name="continent"]:checked')?.value || "all";
    return { mode, difficulty, continent };
  }

  // ── Pool-Aufbau ────────────────────────────────────────
  function buildPool(settings) {
    let pool = COUNTRIES.slice();
    if (settings.continent !== "all") {
      pool = pool.filter((c) => c.continent === settings.continent);
    }
    if (settings.difficulty !== 0) {
      // Gewählte Stufe UND alle darunter verwenden (damit "Mittel" auch leichte einschließt)
      pool = pool.filter((c) => c.difficulty <= settings.difficulty);
    }
    return pool;
  }

  // ── Fragen generieren ──────────────────────────────────
  function pickModeForQuestion(mode) {
    if (mode !== "mixed") return mode;
    const modes = ["capital", "flag", "country"];
    return modes[Math.floor(Math.random() * modes.length)];
  }

  function makeQuestion(country, pool, mode) {
    // Distraktoren bevorzugt vom gleichen Kontinent, dann Pool, dann alle Länder
    const need = ANSWERS_PER_QUESTION - 1;
    let source = pool.filter(
      (c) => c.continent === country.continent && c.name !== country.name
    );
    if (source.length < need) source = pool.filter((c) => c.name !== country.name);
    if (source.length < need) source = COUNTRIES.filter((c) => c.name !== country.name);
    const distractors = pickRandom(source, need);

    let prompt, display, displayClass, correct, options;

    if (mode === "capital") {
      prompt = "Wie heißt die Hauptstadt von";
      display = country.name + "?";
      displayClass = "";
      correct = country.capital;
      options = shuffle([correct, ...distractors.map((d) => d.capital)]);
    } else if (mode === "flag") {
      prompt = "Zu welchem Land gehört diese Flagge?";
      display = country.flag;
      displayClass = "flag";
      correct = country.name;
      options = shuffle([correct, ...distractors.map((d) => d.name)]);
    } else { // country (zur Hauptstadt das Land)
      prompt = "Zu welchem Land gehört diese Hauptstadt?";
      display = country.capital;
      displayClass = "";
      correct = country.name;
      options = shuffle([correct, ...distractors.map((d) => d.name)]);
    }

    return { country, mode, prompt, display, displayClass, correct, options };
  }

  function buildQuestions(settings) {
    const pool = buildPool(settings);
    if (pool.length === 0) return null;
    const chosen = pickRandom(pool, Math.min(QUESTIONS_PER_ROUND, pool.length));
    return chosen.map((c) => makeQuestion(c, pool, pickModeForQuestion(settings.mode)));
  }

  // ── Quiz-Rendering ─────────────────────────────────────
  function renderQuestion() {
    const q = state.questions[state.current];
    state.answered = false;

    $("#progress-text").textContent = `Frage ${state.current + 1}/${state.questions.length}`;
    $("#score-text").textContent = `Punkte: ${state.score}`;
    const progressPct = (state.current / state.questions.length) * 100;
    $("#progress-fill").style.width = `${progressPct}%`;

    const streakEl = $("#streak-badge");
    if (state.streak >= 2) {
      streakEl.classList.remove("hidden");
      $("#streak-value").textContent = state.streak;
    } else {
      streakEl.classList.add("hidden");
    }

    $("#question-prompt").textContent = q.prompt;
    const displayEl = $("#question-display");
    displayEl.className = "question-display " + (q.displayClass || "");
    displayEl.textContent = q.display;

    const grid = $("#answer-grid");
    grid.innerHTML = "";
    q.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.className = "answer-btn";
      btn.type = "button";
      btn.dataset.value = opt;
      btn.innerHTML = `<span class="key">${i + 1}</span><span>${escapeHtml(opt)}</span>`;
      btn.addEventListener("click", () => handleAnswer(opt, btn));
      grid.appendChild(btn);
    });

    $("#feedback").textContent = "";
    $("#feedback").className = "feedback";
    $("#btn-next").classList.add("hidden");
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[ch]));
  }

  function handleAnswer(chosen, btn) {
    if (state.answered) return;
    state.answered = true;

    const q = state.questions[state.current];
    const isCorrect = chosen === q.correct;

    $$(".answer-btn").forEach((b) => {
      b.disabled = true;
      if (b.dataset.value === q.correct) b.classList.add("correct");
      else if (b === btn) b.classList.add("wrong");
    });

    const fb = $("#feedback");
    if (isCorrect) {
      state.score++;
      state.streak++;
      state.bestStreak = Math.max(state.bestStreak, state.streak);
      fb.textContent = "✓ Richtig!";
      fb.className = "feedback correct";
    } else {
      state.streak = 0;
      fb.textContent = `✗ Richtig wäre: ${q.correct}`;
      fb.className = "feedback wrong";
    }

    state.review.push({
      question: q.prompt + " " + q.display,
      chosen,
      correct: q.correct,
      isCorrect,
    });

    $("#score-text").textContent = `Punkte: ${state.score}`;
    $("#btn-next").classList.remove("hidden");
    $("#btn-next").focus();
  }

  function nextQuestion() {
    state.current++;
    if (state.current >= state.questions.length) {
      showResult();
    } else {
      renderQuestion();
    }
  }

  // ── Result ─────────────────────────────────────────────
  function showResult() {
    const total = state.questions.length;
    const score = state.score;
    const pct = total === 0 ? 0 : Math.round((score / total) * 100);

    let emoji, title, message;
    if (pct === 100) {
      emoji = "🏆"; title = "Perfekt!"; message = "Alle Fragen richtig – du bist ein echter Weltenbummler!";
    } else if (pct >= 80) {
      emoji = "🎉"; title = "Ausgezeichnet!"; message = "Beeindruckendes Geografie-Wissen.";
    } else if (pct >= 60) {
      emoji = "👍"; title = "Gut gemacht!"; message = "Solide Leistung – mit ein bisschen Übung wird daraus Spitze.";
    } else if (pct >= 40) {
      emoji = "🤔"; title = "Geht so."; message = "Ein paar Treffer – da ist noch Luft nach oben.";
    } else {
      emoji = "🌍"; title = "Ein Anfang!"; message = "Kein Problem – Geografie lernt man durchs Ausprobieren.";
    }

    $("#result-emoji").textContent = emoji;
    $("#result-title").textContent = title;
    $("#result-score").textContent = `${score} / ${total}`;
    $("#result-message").textContent = message;
    $("#result-best-streak").textContent = state.bestStreak;
    $("#result-accuracy").textContent = `${pct}%`;

    // Highscore
    const currentHs = getHighscore();
    const isBetter =
      !currentHs ||
      score > currentHs.score ||
      (score === currentHs.score && total > currentHs.total);

    const hsBadge = $("#result-new-hs");
    if (isBetter && score > 0) {
      setHighscore(score, total, { mode: state.settings.mode });
      hsBadge.classList.remove("hidden");
    } else {
      hsBadge.classList.add("hidden");
    }

    // Review
    const review = $("#result-review");
    review.innerHTML = "";
    state.review.forEach((r, i) => {
      const item = document.createElement("div");
      item.className = "review-item " + (r.isCorrect ? "correct" : "wrong");
      item.innerHTML = `
        <div>
          <div class="review-q">${i + 1}. ${escapeHtml(r.question)}</div>
          ${
            r.isCorrect
              ? ""
              : `<div class="review-correct">Richtig: ${escapeHtml(r.correct)}</div>`
          }
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
    state.streak = 0;
    state.bestStreak = 0;
    state.review = [];
    renderQuestion();
    showScreen("quiz");
  }

  // ── Keyboard-Support ───────────────────────────────────
  function handleKeydown(e) {
    if (!screens.quiz.classList.contains("active")) return;

    if (!state.answered && ["1", "2", "3", "4"].includes(e.key)) {
      const idx = parseInt(e.key, 10) - 1;
      const btns = $$(".answer-btn");
      if (btns[idx]) {
        e.preventDefault();
        btns[idx].click();
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
    $("#btn-back").addEventListener("click", () => showScreen("start"));
    $("#btn-retry").addEventListener("click", startQuiz);
    $("#btn-home").addEventListener("click", () => {
      updateHighscoreDisplay();
      showScreen("start");
    });

    document.addEventListener("keydown", handleKeydown);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
