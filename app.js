(function () {
  const roleMeta = window.BEAR_ROLE_META || {};
  const profilePack = window.BEAR_PROFILE_PACK || {};
  const questionBank = window.BEAR_QUESTIONS || {};

  if (!roleMeta.yier || !roleMeta.bubu || !profilePack.yier || !profilePack.bubu) {
    document.body.innerHTML = "<p style='padding:24px'>角色或熊格数据加载失败，请检查 data 文件。</p>";
    return;
  }

  const screens = {
    entry: document.getElementById("entry-screen"),
    quiz: document.getElementById("quiz-screen"),
    result: document.getElementById("result-screen")
  };

  const roleCards = document.querySelectorAll(".role-card");

  const nicknameInput = document.getElementById("nickname-input");
  const startBtn = document.getElementById("start-btn");
  const entryTip = document.getElementById("entry-tip");

  const quizRoleAvatar = document.getElementById("quiz-role-avatar");
  const quizPartnerAvatar = document.getElementById("quiz-partner-avatar");
  const quizRoleName = document.getElementById("quiz-role-name");
  const quizPartnerName = document.getElementById("quiz-partner-name");

  const progressText = document.getElementById("progress-text");
  const progressFill = document.getElementById("progress-fill");
  const progressTrack = document.querySelector(".progress-track");
  const questionPair = document.getElementById("question-pair");
  const questionTitle = document.getElementById("question-title");
  const optionsWrap = document.getElementById("options-wrap");
  const encourageText = document.getElementById("encourage-text");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  const resultRoleAvatar = document.getElementById("result-role-avatar");
  const resultPartnerAvatar = document.getElementById("result-partner-avatar");
  const resultType = document.getElementById("result-type");
  const resultName = document.getElementById("result-name");
  const resultSlogan = document.getElementById("result-slogan");
  const resultSummary = document.getElementById("result-summary");
  const dimensionBars = document.getElementById("dimension-bars");
  const highlightList = document.getElementById("highlight-list");
  const habitList = document.getElementById("habit-list");
  const blindList = document.getElementById("blind-list");
  const growthList = document.getElementById("growth-list");
  const partnerFocus = document.getElementById("partner-focus");
  const coupleList = document.getElementById("couple-list");

  const partnerTypeSelect = document.getElementById("partner-type");
  const calcMatchBtn = document.getElementById("calc-match-btn");
  const matchOutput = document.getElementById("match-output");

  const shareLink = document.getElementById("share-link");
  const copyLinkBtn = document.getElementById("copy-link-btn");
  const copyTip = document.getElementById("copy-tip");
  const restartBtn = document.getElementById("restart-btn");

  const encouragementPool = [
    "这一题很关键，你选得很有个人风格。",
    "熊格画像正在成型，继续保持真实作答。",
    "这个选择会影响你和TA的互动节拍。",
    "很棒，继续按照直觉和习惯来选。",
    "马上就能看到你的专属熊格了。"
  ];

  const state = {
    role: "",
    name: "",
    index: 0,
    questions: [],
    answers: [],
    scores: {},
    votes: {},
    startedAt: 0,
    currentCode: ""
  };

  function showScreen(key) {
    Object.values(screens).forEach((node) => node.classList.remove("active"));
    screens[key].classList.add("active");
  }

  function hashText(text) {
    let h = 0;
    for (let i = 0; i < text.length; i += 1) {
      h = (h * 31 + text.charCodeAt(i)) % 100000;
    }
    return h;
  }

  function setRole(role) {
    if (!roleMeta[role]) {
      return;
    }

    state.role = role;
    document.body.classList.remove("role-yier", "role-bubu");
    document.body.classList.add(`role-${role}`);

    roleCards.forEach((card) => {
      card.classList.toggle("active", card.dataset.role === role);
    });

    const label = roleMeta[role].fullName;
    entryTip.textContent = `已选择：${label}。接下来将进入该角色专属题库。`;
  }

  function getPack(role) {
    return profilePack[role];
  }

  function getPartnerRole(role) {
    return roleMeta[role].partner;
  }

  function initializeScoreBucket(role) {
    const pack = getPack(role);
    const scores = {};
    const votes = {};

    Object.keys(pack.traitCards).forEach((trait) => {
      scores[trait] = 0;
      votes[trait] = 0;
    });

    return { scores, votes };
  }

  function setupQuizBanner(role) {
    const partnerRole = getPartnerRole(role);
    quizRoleAvatar.src = roleMeta[role].avatar;
    quizRoleAvatar.alt = `${roleMeta[role].label}头像`;
    quizPartnerAvatar.src = roleMeta[partnerRole].avatar;
    quizPartnerAvatar.alt = `${roleMeta[partnerRole].label}头像`;
    quizRoleName.textContent = roleMeta[role].fullName;
    quizPartnerName.textContent = roleMeta[partnerRole].fullName;
  }

  function startQuiz() {
    if (!state.role) {
      entryTip.textContent = "请先选择角色：你是一二还是布布。";
      return;
    }

    const questions = questionBank[state.role] || [];
    if (!questions.length) {
      entryTip.textContent = "题库未加载，请检查 data/questions.js。";
      return;
    }

    state.name = (nicknameInput.value || "小熊").trim() || "小熊";
    state.questions = questions;
    state.answers = Array(questions.length).fill(null);
    state.index = 0;

    const buckets = initializeScoreBucket(state.role);
    state.scores = buckets.scores;
    state.votes = buckets.votes;
    state.startedAt = Date.now();
    state.currentCode = "";

    setupQuizBanner(state.role);
    encourageText.textContent = "";
    showScreen("quiz");
    renderQuestion();
  }

  function findDimensionByPair(role, pair) {
    const pack = getPack(role);
    return pack.dimensions.find(
      (dim) => dim.traits[0] === pair[0] && dim.traits[1] === pair[1]
    );
  }

  function renderQuestion() {
    const q = state.questions[state.index];
    if (!q) {
      return;
    }

    const picked = state.answers[state.index];
    const progress = state.index + 1;
    const total = state.questions.length;

    progressText.textContent = `第 ${progress} / ${total} 题`;
    progressFill.style.width = `${(progress / total) * 100}%`;
    progressTrack.setAttribute("aria-valuenow", String(progress));

    const dim = findDimensionByPair(state.role, q.pair);
    questionPair.textContent = dim
      ? `${dim.name} · ${dim.labels[0]} vs ${dim.labels[1]}`
      : "情侣熊格核心题";
    questionTitle.textContent = q.text;

    optionsWrap.innerHTML = "";

    q.options.forEach((opt, i) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "option-btn";
      button.dataset.label = String.fromCharCode(65 + i);
      button.innerHTML = opt.text;
      if (picked === i) {
        button.classList.add("selected");
      }

      button.addEventListener("click", () => {
        state.answers[state.index] = i;
        encourageText.textContent =
          encouragementPool[Math.floor(Math.random() * encouragementPool.length)];
        renderQuestion();
      });

      optionsWrap.appendChild(button);
    });

    prevBtn.disabled = state.index === 0;
    nextBtn.disabled = state.answers[state.index] === null;
    nextBtn.textContent = state.index === total - 1 ? "查看熊格结果" : "下一题";
  }

  function computeScores() {
    const buckets = initializeScoreBucket(state.role);
    state.scores = buckets.scores;
    state.votes = buckets.votes;

    state.questions.forEach((q, idx) => {
      const pickedIndex = state.answers[idx];
      if (pickedIndex === null || pickedIndex === undefined) {
        return;
      }

      const option = q.options[pickedIndex];
      const w = option.weight || 1;
      const trait = option.trait;

      if (state.scores[trait] !== undefined) {
        state.scores[trait] += w;
        state.votes[trait] += 1;
      }

      if (option.bonus && state.scores[option.bonus] !== undefined) {
        state.scores[option.bonus] += 1;
      }
    });
  }

  function chooseTrait(a, b, seed) {
    const as = state.scores[a] || 0;
    const bs = state.scores[b] || 0;

    if (as !== bs) {
      return as > bs ? a : b;
    }

    const av = state.votes[a] || 0;
    const bv = state.votes[b] || 0;
    if (av !== bv) {
      return av > bv ? a : b;
    }

    return seed % 2 === 0 ? a : b;
  }

  function deriveResult() {
    const pack = getPack(state.role);
    const seed = hashText(`${state.name}-${state.role}-${state.answers.join("")}`);

    const breakdown = [];
    let code = "";

    pack.dimensions.forEach((dim, i) => {
      const left = dim.traits[0];
      const right = dim.traits[1];
      const dominant = chooseTrait(left, right, seed + i * 17);
      const other = dominant === left ? right : left;

      const ds = state.scores[dominant] || 0;
      const os = state.scores[other] || 0;
      const total = ds + os;
      const percent = total > 0 ? Math.round((ds / total) * 100) : 50;

      code += pack.traitToLetter[dominant] || "?";
      breakdown.push({
        dimName: dim.name,
        dominantTrait: dominant,
        dominantLabel: pack.traitCards[dominant].short,
        pairLabel: `${dim.labels[0]} / ${dim.labels[1]}`,
        percent
      });
    });

    const profile = pack.profiles[code] || pack.profiles[Object.keys(pack.profiles)[0]];
    state.currentCode = profile.code;

    return {
      code: profile.code,
      profile,
      breakdown
    };
  }

  function listRender(node, arr) {
    node.innerHTML = "";
    arr.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      node.appendChild(li);
    });
  }

  function renderBreakdown(rows) {
    dimensionBars.innerHTML = "";
    rows.forEach((row) => {
      const item = document.createElement("div");
      item.className = "dimension-row";
      item.innerHTML = `
        <span>${row.dimName}</span>
        <div class="mini-track"><span class="mini-fill" style="width:${row.percent}%"></span></div>
        <strong>${row.dominantLabel} ${row.percent}%</strong>
      `;
      dimensionBars.appendChild(item);
    });
  }

  function buildShareLink(role, type, name) {
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    url.searchParams.set("role", role);
    url.searchParams.set("type", type);
    if (name) {
      url.searchParams.set("name", name);
    }
    return url.toString();
  }

  function fillPartnerTypeSelect() {
    const partnerRole = getPartnerRole(state.role);
    const partnerPack = getPack(partnerRole);

    const entries = Object.keys(partnerPack.profiles)
      .sort()
      .map((code) => ({ code, profile: partnerPack.profiles[code] }));

    partnerTypeSelect.innerHTML = "";
    entries.forEach((entry) => {
      const option = document.createElement("option");
      option.value = entry.code;
      option.textContent = `${entry.code} · ${entry.profile.name}`;
      partnerTypeSelect.appendChild(option);
    });
  }

  function renderResultView(result, fromShare) {
    const role = state.role;
    const partnerRole = getPartnerRole(role);

    resultRoleAvatar.src = roleMeta[role].avatar;
    resultRoleAvatar.alt = `${roleMeta[role].label}头像`;
    resultPartnerAvatar.src = roleMeta[partnerRole].avatar;
    resultPartnerAvatar.alt = `${roleMeta[partnerRole].label}头像`;

    const profile = result.profile;
    resultType.textContent = `${roleMeta[role].label} · ${profile.code}`;
    resultName.textContent = profile.name;
    resultSlogan.textContent = profile.slogan;

    const seconds = Math.max(1, Math.round((Date.now() - state.startedAt) / 1000));
    const timePrefix = fromShare ? "" : `你用了 ${seconds} 秒完成该角色测评。`;
    resultSummary.textContent = `${timePrefix}${profile.summary}`;

    renderBreakdown(result.breakdown);
    listRender(highlightList, profile.highlights);
    listRender(habitList, profile.habits);
    listRender(blindList, profile.blindSpots);
    listRender(growthList, profile.growth);
    listRender(coupleList, profile.coupleNotes);

    partnerFocus.textContent = profile.partnerFocus;

    fillPartnerTypeSelect();

    shareLink.value = buildShareLink(state.role, profile.code, state.name);
    copyTip.textContent = "把这个链接发给TA，打开后可直接看到你的熊格卡。";
    matchOutput.textContent = "选择对方熊格，看看你们的互动匹配度。";

    showScreen("result");
  }

  function pseudoBreakdownFromCode(role, code) {
    const pack = getPack(role);
    const traits = pack.profiles[code].traitKeys;

    return pack.dimensions.map((dim, idx) => ({
      dimName: dim.name,
      dominantTrait: traits[idx],
      dominantLabel: pack.traitCards[traits[idx]].short,
      pairLabel: `${dim.labels[0]} / ${dim.labels[1]}`,
      percent: 68
    }));
  }

  function scoreMatch(myProfile, partnerProfile, role) {
    const myPack = getPack(role);
    const partnerRole = getPartnerRole(role);
    const partnerPack = getPack(partnerRole);

    let score = 36;

    myProfile.traitKeys.forEach((myTrait) => {
      const card = myPack.traitCards[myTrait];
      const hit = partnerProfile.traitKeys.some((pt) => card.goodWith.includes(pt));
      score += hit ? 14 : 7;
    });

    const myCore = myProfile.traitKeys[1];
    const partnerCore = partnerProfile.traitKeys[1];
    if (myPack.traitCards[myCore].goodWith.includes(partnerCore)) {
      score += 6;
    }

    score = Math.max(45, Math.min(98, score));

    let label = "甜感潜力组";
    if (score >= 90) {
      label = "超黏高糖组";
    } else if (score >= 82) {
      label = "稳甜同频组";
    } else if (score >= 72) {
      label = "互补发光组";
    } else if (score >= 62) {
      label = "可磨合成长组";
    }

    const tip =
      score >= 82
        ? "你们一个点火一个护航，甜度与稳定度都在线。"
        : score >= 72
        ? "差异是你们的创意来源，提前讲清边界会更顺。"
        : "建议先建立固定沟通仪式，再慢慢放大甜蜜玩法。";

    return { score, label, tip, partnerRoleLabel: partnerPack.label };
  }

  function onNext() {
    if (state.answers[state.index] === null) {
      encourageText.textContent = "先选一个最像你的选项，再继续喔。";
      return;
    }

    if (state.index === state.questions.length - 1) {
      computeScores();
      const result = deriveResult();
      renderResultView(result, false);
      return;
    }

    state.index += 1;
    renderQuestion();
  }

  function onPrev() {
    if (state.index === 0) {
      return;
    }
    state.index -= 1;
    renderQuestion();
  }

  function copyShareLink() {
    const text = shareLink.value;
    if (!text) {
      return;
    }

    navigator.clipboard
      .writeText(text)
      .then(() => {
        copyTip.textContent = "链接已复制，可以发给任何人直接查看你的熊格卡。";
      })
      .catch(() => {
        shareLink.select();
        copyTip.textContent = "自动复制失败，请手动复制上面的链接。";
      });
  }

  function calculatePartnerMatch() {
    const role = state.role;
    const myPack = getPack(role);
    const myProfile = myPack.profiles[state.currentCode];
    if (!myProfile) {
      return;
    }

    const partnerRole = getPartnerRole(role);
    const partnerPack = getPack(partnerRole);
    const partnerCode = partnerTypeSelect.value;
    const partnerProfile = partnerPack.profiles[partnerCode];
    if (!partnerProfile) {
      return;
    }

    const result = scoreMatch(myProfile, partnerProfile, role);
    matchOutput.textContent = `${roleMeta[role].label} ${myProfile.name} × ${result.partnerRoleLabel} ${partnerProfile.name}：${result.score} 分（${result.label}）。${result.tip}`;
  }

  function restartToEntry() {
    showScreen("entry");
    copyTip.textContent = "";
    matchOutput.textContent = "";
  }

  function tryLoadSharedResult() {
    const params = new URLSearchParams(window.location.search);
    const role = params.get("role");
    const type = (params.get("type") || "").toUpperCase();
    const name = params.get("name") || "";

    if (!roleMeta[role]) {
      return false;
    }

    const pack = getPack(role);
    const profile = pack.profiles[type];
    if (!profile) {
      return false;
    }

    setRole(role);
    state.role = role;
    state.name = name || `${roleMeta[role].label}小熊`;
    state.startedAt = Date.now();
    state.currentCode = type;

    const result = {
      code: type,
      profile,
      breakdown: pseudoBreakdownFromCode(role, type)
    };

    renderResultView(result, true);
    return true;
  }

  function bindEvents() {
    roleCards.forEach((card) => {
      card.addEventListener("click", () => {
        setRole(card.dataset.role);
      });
    });

    startBtn.addEventListener("click", startQuiz);
    nextBtn.addEventListener("click", onNext);
    prevBtn.addEventListener("click", onPrev);
    copyLinkBtn.addEventListener("click", copyShareLink);
    calcMatchBtn.addEventListener("click", calculatePartnerMatch);
    restartBtn.addEventListener("click", restartToEntry);
  }

  function init() {
    bindEvents();
    setRole("yier");

    if (!tryLoadSharedResult()) {
      showScreen("entry");
    }
  }

  init();
})();
