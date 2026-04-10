(function () {
  const questions = window.MBTI_QUESTIONS || [];
  const profiles = window.MBTI_PERSONALITIES || {};
  const allTypes = Object.keys(profiles);

  if (!questions.length || !allTypes.length) {
    document.body.innerHTML = "<p style='padding:24px'>题库或人格数据加载失败，请检查文件。</p>";
    return;
  }

  const screens = {
    home: document.getElementById("home-screen"),
    quiz: document.getElementById("quiz-screen"),
    result: document.getElementById("result-screen")
  };

  const nicknameInput = document.getElementById("nickname-input");
  const startBtn = document.getElementById("start-btn");
  const moodPills = document.getElementById("mood-pills");

  const progressText = document.getElementById("progress-text");
  const progressFill = document.getElementById("progress-fill");
  const progressTrack = document.querySelector(".progress-track");
  const questionTitle = document.getElementById("question-title");
  const optionsWrap = document.getElementById("options-wrap");
  const encourageText = document.getElementById("encourage-text");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  const resultType = document.getElementById("result-type");
  const resultName = document.getElementById("result-name");
  const resultSummary = document.getElementById("result-summary");
  const dimensionBars = document.getElementById("dimension-bars");
  const strengthList = document.getElementById("strength-list");
  const blindList = document.getElementById("blind-list");
  const fitList = document.getElementById("fit-list");
  const growthList = document.getElementById("growth-list");

  const shareLinkInput = document.getElementById("share-link");
  const copyLinkBtn = document.getElementById("copy-link-btn");
  const copyTip = document.getElementById("copy-tip");

  const friendTypeSelect = document.getElementById("friend-type");
  const calcMatchBtn = document.getElementById("calc-match-btn");
  const matchOutput = document.getElementById("match-output");

  const restartBtn = document.getElementById("restart-btn");

  const encouragements = [
    "答得很真诚，继续保持。",
    "你离结果更近一步啦。",
    "这题很有代表性，选得不错。",
    "你的节奏很稳，继续。",
    "这份测试正在拼出你的独特轮廓。"
  ];

  const state = {
    mood: "sun",
    name: "",
    index: 0,
    answers: Array(questions.length).fill(null),
    startedAt: 0,
    currentType: ""
  };

  function showScreen(key) {
    Object.values(screens).forEach((node) => node.classList.remove("active"));
    screens[key].classList.add("active");
  }

  function applyMood(mood) {
    state.mood = mood;
    document.body.classList.remove("theme-sun", "theme-mint", "theme-sky");
    document.body.classList.add(`theme-${mood}`);
    moodPills.querySelectorAll(".pill").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.mood === mood);
    });
  }

  function renderQuestion() {
    const q = questions[state.index];
    if (!q) {
      return;
    }

    const answer = state.answers[state.index];
    const progressValue = state.index + 1;
    const progressRate = (progressValue / questions.length) * 100;

    progressText.textContent = `第 ${progressValue} / ${questions.length} 题`;
    progressFill.style.width = `${progressRate}%`;
    progressTrack.setAttribute("aria-valuenow", String(progressValue));

    questionTitle.textContent = q.text;

    optionsWrap.innerHTML = "";
    q.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn";
      btn.dataset.trait = opt.trait;
      btn.innerHTML = `<strong>${String.fromCharCode(65 + idx)}.</strong> ${opt.text}`;
      if (answer === opt.trait) {
        btn.classList.add("selected");
      }
      btn.addEventListener("click", () => {
        state.answers[state.index] = opt.trait;
        encourageText.textContent = encouragements[Math.floor(Math.random() * encouragements.length)];
        renderQuestion();
      });
      optionsWrap.appendChild(btn);
    });

    prevBtn.disabled = state.index === 0;
    nextBtn.textContent = state.index === questions.length - 1 ? "查看结果" : "下一题";
    nextBtn.disabled = !state.answers[state.index];
  }

  function calculateType() {
    const counts = {
      E: 0,
      I: 0,
      S: 0,
      N: 0,
      T: 0,
      F: 0,
      J: 0,
      P: 0
    };

    state.answers.forEach((trait) => {
      if (trait && counts[trait] !== undefined) {
        counts[trait] += 1;
      }
    });

    function pick(a, b) {
      if (counts[a] === counts[b]) {
        return a;
      }
      return counts[a] > counts[b] ? a : b;
    }

    const type = `${pick("E", "I")}${pick("S", "N")}${pick("T", "F")}${pick("J", "P")}`;

    const dimensions = [
      ["E", "I"],
      ["S", "N"],
      ["T", "F"],
      ["J", "P"]
    ];

    const breakdown = dimensions.map((pair) => {
      const left = pair[0];
      const right = pair[1];
      const total = counts[left] + counts[right];
      const leftPercent = total ? Math.round((counts[left] / total) * 100) : 50;
      const dominant = leftPercent >= 50 ? left : right;
      const dominantPercent = dominant === left ? leftPercent : 100 - leftPercent;
      return {
        label: `${left} / ${right}`,
        dominant,
        percent: dominantPercent
      };
    });

    return { type, counts, breakdown };
  }

  function renderList(node, arr) {
    node.innerHTML = "";
    arr.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      node.appendChild(li);
    });
  }

  function buildShareLink(type, name, mood) {
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    url.searchParams.set("type", type);
    if (name) {
      url.searchParams.set("name", name);
    }
    url.searchParams.set("mood", mood || "sun");
    return url.toString();
  }

  function renderDimensionBars(rows) {
    dimensionBars.innerHTML = "";
    rows.forEach((row) => {
      const div = document.createElement("div");
      div.className = "dimension-row";
      div.innerHTML = `
        <span>${row.label}</span>
        <div class="mini-track"><div class="mini-fill" style="width:${row.percent}%"></div></div>
        <strong>${row.dominant} ${row.percent}%</strong>
      `;
      dimensionBars.appendChild(div);
    });
  }

  function renderResult(data, fromShare) {
    const type = data.type;
    const profile = profiles[type] || profiles.ENFP;
    state.currentType = type;

    resultType.textContent = type;
    resultName.textContent = `${profile.name} · ${state.name || "你"}`;

    const spentSeconds = Math.max(1, Math.round((Date.now() - state.startedAt) / 1000));
    const timePart = fromShare ? "" : `你在 ${spentSeconds} 秒内完成了测试。`;
    resultSummary.textContent = `${timePart}${profile.summary}`;

    renderDimensionBars(data.breakdown);
    renderList(strengthList, profile.strengths);
    renderList(blindList, profile.blindSpots);
    renderList(fitList, profile.fit);
    renderList(growthList, profile.growth);

    shareLinkInput.value = buildShareLink(type, state.name, state.mood);
    copyTip.textContent = "把链接发给朋友，他们打开就能看到你的结果卡片。";
    matchOutput.textContent = "选一个朋友的人格类型，看看你们的组合风格。";

    showScreen("result");
  }

  function createPseudoBreakdown(type) {
    const letters = type.split("");
    const pairs = [
      ["E", "I"],
      ["S", "N"],
      ["T", "F"],
      ["J", "P"]
    ];

    return pairs.map((pair, idx) => {
      const dominant = letters[idx] || pair[0];
      return {
        label: `${pair[0]} / ${pair[1]}`,
        dominant,
        percent: 68
      };
    });
  }

  function countSharedLetters(a, b) {
    let shared = 0;
    for (let i = 0; i < 4; i += 1) {
      if (a[i] === b[i]) {
        shared += 1;
      }
    }
    return shared;
  }

  function calcMatch(typeA, typeB) {
    if (typeA === typeB) {
      return {
        score: 92,
        label: "高默契拍档",
        tip: "你们的决策方式和节奏高度一致，合作效率很高，记得留一点新鲜感。"
      };
    }

    const shared = countSharedLetters(typeA, typeB);
    let score = 45 + shared * 12;

    if (typeA[0] !== typeB[0]) {
      score += 4;
    }
    if (typeA[1] !== typeB[1]) {
      score += 3;
    }

    score = Math.max(35, Math.min(95, score));

    let label = "潜力组合";
    if (score >= 82) {
      label = "高默契拍档";
    } else if (score >= 68) {
      label = "互补搭子";
    } else if (score >= 52) {
      label = "可成长组合";
    }

    const tip =
      shared >= 3
        ? "你们天然同频，适合共创项目；分歧时用事实复盘能更快达成一致。"
        : "你们差异明显但有火花，提前约定沟通规则会让配合更顺畅。";

    return { score, label, tip };
  }

  function startQuiz() {
    state.name = (nicknameInput.value || "小可爱").trim() || "小可爱";
    state.index = 0;
    state.answers = Array(questions.length).fill(null);
    state.startedAt = Date.now();
    encourageText.textContent = "";
    showScreen("quiz");
    renderQuestion();
  }

  function goNext() {
    if (!state.answers[state.index]) {
      encourageText.textContent = "先选一个最贴近你的选项吧。";
      return;
    }

    if (state.index === questions.length - 1) {
      const result = calculateType();
      renderResult(result, false);
      return;
    }

    state.index += 1;
    renderQuestion();
  }

  function goPrev() {
    if (state.index === 0) {
      return;
    }
    state.index -= 1;
    renderQuestion();
  }

  function copyShareLink() {
    const text = shareLinkInput.value;
    if (!text) {
      return;
    }

    navigator.clipboard
      .writeText(text)
      .then(() => {
        copyTip.textContent = "链接已复制，快发给朋友吧。";
      })
      .catch(() => {
        shareLinkInput.select();
        copyTip.textContent = "自动复制失败，你可以手动复制输入框里的链接。";
      });
  }

  function initFriendTypes() {
    friendTypeSelect.innerHTML = "";
    allTypes.forEach((type) => {
      const option = document.createElement("option");
      option.value = type;
      option.textContent = `${type} · ${profiles[type].name}`;
      friendTypeSelect.appendChild(option);
    });
  }

  function bindEvents() {
    moodPills.querySelectorAll(".pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        applyMood(btn.dataset.mood);
      });
    });

    startBtn.addEventListener("click", startQuiz);
    nextBtn.addEventListener("click", goNext);
    prevBtn.addEventListener("click", goPrev);
    copyLinkBtn.addEventListener("click", copyShareLink);

    calcMatchBtn.addEventListener("click", () => {
      if (!state.currentType) {
        return;
      }
      const friendType = friendTypeSelect.value;
      const result = calcMatch(state.currentType, friendType);
      matchOutput.textContent = `${state.currentType} × ${friendType}：${result.score} 分（${result.label}）。${result.tip}`;
    });

    restartBtn.addEventListener("click", () => {
      showScreen("home");
      copyTip.textContent = "";
      matchOutput.textContent = "";
    });
  }

  function tryLoadShareResult() {
    const params = new URLSearchParams(window.location.search);
    const sharedType = (params.get("type") || "").toUpperCase();
    const sharedName = params.get("name") || "";
    const sharedMood = params.get("mood") || "sun";

    if (!profiles[sharedType]) {
      return false;
    }

    state.name = sharedName || "TA";
    state.startedAt = Date.now();
    applyMood(["sun", "mint", "sky"].includes(sharedMood) ? sharedMood : "sun");
    renderResult({ type: sharedType, breakdown: createPseudoBreakdown(sharedType) }, true);
    return true;
  }

  function init() {
    applyMood("sun");
    initFriendTypes();
    bindEvents();
    if (!tryLoadShareResult()) {
      showScreen("home");
    }
  }

  init();
})();
