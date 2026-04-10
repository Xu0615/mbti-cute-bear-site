(function () {
  const roleMeta = {
    yier: {
      id: "yier",
      label: "一二",
      fullName: "一二（女熊向）",
      intro:
        "白色小熊一二，黑耳朵、黑蝴蝶结、黑小脚，乐观又有点中二，信奉“常想一二，不思八九”。",
      avatar: "./yier.png",
      partner: "bubu"
    },
    bubu: {
      id: "bubu",
      label: "布布",
      fullName: "布布（男熊向）",
      intro:
        "棕色小熊布布，憨憨暖暖，行动派护航员，嘴上会逗，心里超会疼人。",
      avatar: "./bubu.png",
      partner: "yier"
    }
  };

  const yierTraits = {
    YQ: {
      short: "晴空外放",
      highlight: "见面三分钟就能把空气点热，尴尬场对你几乎无效。",
      habit: "约会时会主动起话头，还会顺手把气氛推到更热闹。",
      risk: "答应太快，容易把行程塞得过满，留白不足。",
      upgrade: "先问一句“你今天想慢一点吗？”再加节目，体验会更稳。",
      partner: "喜欢布布给即时互动，别让她一直单口相声。",
      couple: "和布布一起时，适合你开场、他收场，节奏最顺。",
      goodWith: ["BS", "BL", "BZ", "BR"]
    },
    YM: {
      short: "月雾慢热",
      highlight: "观察力高，能在细微表情里读懂对方今天的状态。",
      habit: "见面前会先在脑里过一遍场景，避免突兀。",
      risk: "想太周全才开口，容易错过最佳表达时机。",
      upgrade: "把“我在想”说出来一半，对方就会更懂你。",
      partner: "更偏好布布给稳定陪伴，不催促、不逼问。",
      couple: "和布布一起时，你负责细节温度，他负责安全边框。",
      goodWith: ["BH", "BW", "BX", "BG"]
    },
    YP: {
      short: "计划收束",
      highlight: "会把浪漫变成可执行清单，甜而不乱。",
      habit: "出门前会备好路线、时长和小预算。",
      risk: "对临时变更敏感，容易被“随机加戏”打断情绪。",
      upgrade: "给日程留20%空白，惊喜和稳定可以共存。",
      partner: "希望布布提前报备变更，不要只说“到时候看”。",
      couple: "你定骨架、他补灵感，是情侣协作最省吵模式。",
      goodWith: ["BH", "BW", "BG", "BL"]
    },
    YJ: {
      short: "即兴跳跃",
      highlight: "现场应变快，临时改计划也能玩出花样。",
      habit: "更看重当下心情，想到就做，执行爆发力强。",
      risk: "容易把收尾交给明天，拖出“可爱烂尾”。",
      upgrade: "每次即兴后补一个“落袋动作”，爽感会持续更久。",
      partner: "喜欢布布能跟上临场脑洞，不要只说“太突然”。",
      couple: "你负责让生活有惊喜，他负责帮惊喜落地。",
      goodWith: ["BS", "BL", "BR", "BX"]
    },
    YD: {
      short: "直甜开麦",
      highlight: "爱和不爱都很清晰，沟通效率高，误会留存少。",
      habit: "会直接说“我现在想抱抱你/我现在不开心”。",
      risk: "真诚过猛时，语气可能比本意更硬。",
      upgrade: "先给一句缓冲：“我在乎你，所以想说实话”。",
      partner: "希望布布别装听懂，听不懂就马上追问。",
      couple: "你把需求点亮，布布就能更准确地照顾到位。",
      goodWith: ["BZ", "BH", "BL", "BG"]
    },
    YR: {
      short: "软糯照顾",
      highlight: "情绪安抚能力强，会让人有“被接住”的安全感。",
      habit: "常用小动作表达爱，比如递纸巾、留小零食、记偏好。",
      risk: "容易把委屈压在心里，外表平静内里超负荷。",
      upgrade: "把“我也需要被照顾”列进关系规则里。",
      partner: "喜欢布布多给情绪回应，不要只给解决方案。",
      couple: "你是情绪软垫，布布是结构支架，搭配很稳。",
      goodWith: ["BX", "BR", "BW", "BS"]
    },
    YA: {
      short: "冒险扩张",
      highlight: "愿意探索新体验，能带伴侣走出日常惯性。",
      habit: "会突然提议“现在去看夜景/跨城吃早饭”。",
      risk: "刺激过量时，容易忽略身体和预算极限。",
      upgrade: "冒险前加“安全词”和止损点，快乐更可持续。",
      partner: "喜欢布布愿意“先出发再微调”，不要一上来就否。",
      couple: "你负责推开新地图，布布负责守住底线。",
      goodWith: ["BL", "BS", "BR", "BZ"]
    },
    YN: {
      short: "安巢打底",
      highlight: "擅长把平凡日子打理出安心感和秩序美。",
      habit: "会关注居家舒适度、作息和长期稳定投入。",
      risk: "对风险防得太严时，关系新鲜感会下降。",
      upgrade: "每周保留一个“可控小冒险窗口”。",
      partner: "希望布布尊重你对稳定感的需求，不要频繁失约。",
      couple: "你提供稳定母体，布布在其中制造恰到好处的火花。",
      goodWith: ["BW", "BH", "BG", "BX"]
    }
  };

  const bubuTraits = {
    BH: {
      short: "护航担当",
      highlight: "遇事先扛，行动上很快让人有依靠感。",
      habit: "会提前确认路线、天气、回家方案，安全优先。",
      risk: "容易一肩挑，累了也不说。",
      upgrade: "把“我也需要补能量”说出口，关系会更健康。",
      partner: "最适配一二的慢热与计划侧，能给她稳定底盘。",
      couple: "你把底线守住，她就敢大胆可爱。",
      goodWith: ["YM", "YP", "YD", "YN"]
    },
    BS: {
      short: "撒欢带动",
      highlight: "热场能力强，容易把对方从低电量状态里拉出来。",
      habit: "会用玩笑、表情和夸张动作把气氛抬起来。",
      risk: "玩心过头时，会忽略对方当下是否想安静。",
      upgrade: "先观察情绪信号，再决定热闹强度。",
      partner: "最适配一二外放或即兴侧，玩乐同频效率高。",
      couple: "你点火，她加糖，日常很容易发光。",
      goodWith: ["YQ", "YJ", "YR", "YA"]
    },
    BW: {
      short: "稳打执行",
      highlight: "不怕重复和琐碎，能把“说好”变成“做到”。",
      habit: "事情按优先级一件件推进，很少口号式承诺。",
      risk: "有时显得保守，容易错过窗口机会。",
      upgrade: "在稳中加入小试错，成长会更快。",
      partner: "适配一二的安巢/计划需求，最能提供可预期体验。",
      couple: "你负责落地，她负责让落地更有故事。",
      goodWith: ["YM", "YP", "YR", "YN"]
    },
    BL: {
      short: "灵策转向",
      highlight: "脑子快，擅长在变化里找新解法。",
      habit: "临场会迅速改路线，避免全盘卡死。",
      risk: "解释不足时，容易被误解成“不稳”。",
      upgrade: "改方案时顺手讲“为什么改”，信任会上升。",
      partner: "适配一二的冒险与即兴侧，一起开新地图效率极高。",
      couple: "你开捷径，她补灵感，组合会很有创造力。",
      goodWith: ["YQ", "YJ", "YD", "YA"]
    },
    BZ: {
      short: "憨直明示",
      highlight: "态度真，不爱拐弯，边界表达清楚。",
      habit: "会直接说“我现在在意这个”“我想这样做”。",
      risk: "措辞太直时，温度感可能掉线。",
      upgrade: "先肯定再表达立场，接受度会更高。",
      partner: "和一二直甜侧很合拍，沟通路径最短。",
      couple: "你给清晰，她给柔化，既快又不伤感情。",
      goodWith: ["YQ", "YD", "YA", "YP"]
    },
    BX: {
      short: "细腻聆听",
      highlight: "能听见弦外音，擅长在情绪还没爆发前接住。",
      habit: "会记对方小偏好，靠细节表达重视。",
      risk: "容易过度解读，反而增加焦虑。",
      upgrade: "确认式提问代替猜测，省掉内耗。",
      partner: "和一二软糯/慢热侧特别稳，情绪同频度高。",
      couple: "你负责接住，她负责表达，关系更松弛。",
      goodWith: ["YM", "YR", "YN", "YJ"]
    },
    BG: {
      short: "领航控盘",
      highlight: "大局感强，关键时刻能做决定并兜底。",
      habit: "关系里会主动提出规则和方向。",
      risk: "控盘欲过强时，对方会感到被安排。",
      upgrade: "把“共同决定”写进流程，控制感会转成安全感。",
      partner: "适配一二计划与直甜侧，执行协同度高。",
      couple: "你定航向，她加情绪色彩，推进很稳。",
      goodWith: ["YP", "YD", "YN", "YM"]
    },
    BR: {
      short: "松弛陪跑",
      highlight: "不急着赢，擅长把关系养在舒服节奏里。",
      habit: "会留白、会等人，不强推同一速度。",
      risk: "过度随和时，容易被误解成不上心。",
      upgrade: "关键节点主动给承诺，松弛不等于松散。",
      partner: "适配一二即兴与安抚侧，关系舒张有弹性。",
      couple: "你负责呼吸感，她负责小浪漫，长期幸福度高。",
      goodWith: ["YJ", "YR", "YA", "YQ"]
    }
  };

  const yierNames = {
    QPDA: "星火冲浪熊",
    QPDN: "闹钟棉花熊",
    QPRA: "暖贴探路熊",
    QPRN: "收纳糖霜熊",
    QJDA: "旋转烟花熊",
    QJDN: "夜市即兴熊",
    QJRA: "抱抱冒险熊",
    QJRN: "迷路奶糖熊",
    MPDA: "便签舰长熊",
    MPDN: "被窝总策熊",
    MPRA: "静水手帐熊",
    MPRN: "奶盖守屋熊",
    MJDA: "月光突击熊",
    MJDN: "雨滴慢煮熊",
    MJRA: "轻语流浪熊",
    MJRN: "云团安抚熊"
  };

  const bubuNames = {
    HWZG: "木盾队长熊",
    HWZR: "围裙守夜熊",
    HWXG: "暖炉调频熊",
    HWXR: "枕边维修熊",
    HLZG: "路书护航熊",
    HLZR: "咖啡补给熊",
    HLXG: "细节导航熊",
    HLXR: "软垫陪跑熊",
    SWZG: "热场硬糖熊",
    SWZR: "烧烤打趣熊",
    SWXG: "开心监听熊",
    SWXR: "慢炖逗哏熊",
    SLZG: "机灵突围熊",
    SLZR: "野营机修熊",
    SLXG: "共情探照熊",
    SLXR: "毛毯躺平熊"
  };

  const yierStories = {
    QPDA: "你会把约会做成“有流程的惊喜”，每一步都热闹且不失控。",
    QPDN: "你表面元气冲锋，内里却把生活收纳得柔软有序。",
    QPRA: "你擅长边冒险边照顾人，甜度和安全感一起给满。",
    QPRN: "你像会发光的收纳盒，热闹归热闹，日子始终井井有条。",
    QJDA: "你是现场灵感发动机，能把普通夜晚点成节日。",
    QJDN: "你爱即兴和烟火，但会在关键时刻把节奏拉回舒服区。",
    QJRA: "你是会拥抱人的小探险家，敢玩也敢照顾。",
    QJRN: "你像软糖导航员，迷路也不慌，总能把尴尬变可爱回忆。",
    MPDA: "你安静但有主心骨，计划一开，推进像小火车。",
    MPDN: "你是被窝里的战略家，慢热却极其靠谱。",
    MPRA: "你温柔地安排世界，细节里全是体贴。",
    MPRN: "你是关系里的稳定器，日常在你手里会自动降噪。",
    MJDA: "你平时安静，关键时刻会突然超勇敢。",
    MJDN: "你喜欢慢慢来，但心里一直有自己的自由路线。",
    MJRA: "你是低饱和浪漫派，轻声细语却能打动人。",
    MJRN: "你像云朵沙发，谁靠近你都会被温柔兜住。"
  };

  const bubuStories = {
    HWZG: "你是“可靠感”本体，关键时刻总能站在最前面。",
    HWZR: "你把爱藏在日常守护里，细水流长但非常稳。",
    HWXG: "你外表憨直，内里细腻，会把安稳做到极致。",
    HWXR: "你是慢节奏守护者，给人一种“有你就不慌”的底气。",
    HLZG: "你会护航，也会变阵，是能打硬仗的伴侣型选手。",
    HLZR: "你爱效率也爱松弛，能把生活打理得有条有趣。",
    HLXG: "你在变化中依旧照顾细节，属于高阶体贴派。",
    HLXR: "你像可移动安全屋，走到哪都能让人放松。",
    SWZG: "你热场快、行动快，像一颗会照顾人的硬糖。",
    SWZR: "你会逗、会扛、会陪，日常幸福感很高。",
    SWXG: "你看起来闹腾，其实很会听，情绪照护做得细。",
    SWXR: "你是快乐制造机，也是安静陪伴者，反差很迷人。",
    SLZG: "你脑子快又肯扛事，临场处理能力非常强。",
    SLZR: "你是野外和生活双修派，乱局里也能搞定细节。",
    SLXG: "你灵活又共情，懂节奏也懂情绪，是高配伴侣型。",
    SLXR: "你松弛但不散漫，舒服和可靠能同时存在。"
  };

  const yierDimensions = [
    { name: "社交温度", traits: ["YQ", "YM"], labels: ["晴空外放", "月雾慢热"] },
    { name: "节奏习惯", traits: ["YP", "YJ"], labels: ["计划收束", "即兴跳跃"] },
    { name: "表达口味", traits: ["YD", "YR"], labels: ["直甜开麦", "软糯照顾"] },
    { name: "生活地图", traits: ["YA", "YN"], labels: ["冒险扩张", "安巢打底"] }
  ];

  const bubuDimensions = [
    { name: "陪伴姿态", traits: ["BH", "BS"], labels: ["护航担当", "撒欢带动"] },
    { name: "做事脑回路", traits: ["BW", "BL"], labels: ["稳打执行", "灵策转向"] },
    { name: "情绪表达", traits: ["BZ", "BX"], labels: ["憨直明示", "细腻聆听"] },
    { name: "关系节拍", traits: ["BG", "BR"], labels: ["领航控盘", "松弛陪跑"] }
  ];

  const yierTraitToLetter = {
    YQ: "Q",
    YM: "M",
    YP: "P",
    YJ: "J",
    YD: "D",
    YR: "R",
    YA: "A",
    YN: "N"
  };

  const bubuTraitToLetter = {
    BH: "H",
    BS: "S",
    BW: "W",
    BL: "L",
    BZ: "Z",
    BX: "X",
    BG: "G",
    BR: "R"
  };

  const yierLetterToTrait = {
    Q: "YQ",
    M: "YM",
    P: "YP",
    J: "YJ",
    D: "YD",
    R: "YR",
    A: "YA",
    N: "YN"
  };

  const bubuLetterToTrait = {
    H: "BH",
    S: "BS",
    W: "BW",
    L: "BL",
    Z: "BZ",
    X: "BX",
    G: "BG",
    R: "BR"
  };

  function decodeByLetters(code, letterMap) {
    return code.split("").map((letter) => letterMap[letter]);
  }

  function buildProfiles(roleLabel, names, stories, traitLib, decodeFn) {
    const profiles = {};
    Object.keys(names).forEach((code) => {
      const traitKeys = decodeFn(code);
      const cards = traitKeys.map((k) => traitLib[k]);

      profiles[code] = {
        code,
        name: names[code],
        slogan: stories[code],
        summary: `${roleLabel}${names[code]}是「${cards
          .map((c) => c.short)
          .join(" × ")}」组合。你在关系里有鲜明风格，也很有专属记忆点。`,
        highlights: cards.map((c) => c.highlight),
        habits: cards.map((c) => c.habit),
        blindSpots: cards.map((c) => c.risk),
        growth: cards.map((c) => c.upgrade),
        coupleNotes: [cards[0].couple, cards[2].couple],
        partnerFocus: `${cards[0].partner} ${cards[1].partner} ${cards[2].partner}`,
        traitKeys
      };
    });
    return profiles;
  }

  const yierPack = {
    role: "yier",
    label: "一二",
    counterpart: "bubu",
    dimensions: yierDimensions,
    traitCards: yierTraits,
    traitToLetter: yierTraitToLetter,
    letterToTrait: yierLetterToTrait,
    profiles: buildProfiles(
      "一二·",
      yierNames,
      yierStories,
      yierTraits,
      (code) => decodeByLetters(code, yierLetterToTrait)
    )
  };

  const bubuPack = {
    role: "bubu",
    label: "布布",
    counterpart: "yier",
    dimensions: bubuDimensions,
    traitCards: bubuTraits,
    traitToLetter: bubuTraitToLetter,
    letterToTrait: bubuLetterToTrait,
    profiles: buildProfiles(
      "布布·",
      bubuNames,
      bubuStories,
      bubuTraits,
      (code) => decodeByLetters(code, bubuLetterToTrait)
    )
  };

  window.BEAR_ROLE_META = roleMeta;
  window.BEAR_PROFILE_PACK = {
    yier: yierPack,
    bubu: bubuPack
  };
})();
