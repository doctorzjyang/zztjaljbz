const TYPES = [
  {
    id: "peace",
    name: "和平质",
    nature: "阴阳气血协调，生长状态相对平衡。",
    questions: [
      "发育、精神、睡眠、饮食、二便总体比较稳定",
      "面色润泽、两目有神、毛发皮肤状态较好",
      "活动耐受好，患病较少，气候变化时适应较好",
      "不容易过敏，呼吸、消化问题较少反复"
    ],
    diet: "饮食讲究均衡，主食、蔬菜、蛋白质、水果合理搭配，避免偏食挑食和盲目进补。",
    care: "保持规律作息、适度户外运动和稳定情绪，避免过劳、过逸或长期熬夜。"
  },
  {
    id: "allergic",
    name: "特禀质",
    nature: "先天禀赋偏敏，容易受风、食物、环境诱发过敏表现。",
    questions: [
      "有鼻痒、晨起喷嚏、流清涕或过敏性鼻炎表现",
      "容易湿疹、荨麻疹、皮肤瘙痒或食物过敏",
      "咽痒咳嗽、风吹后咳嗽，或有哮喘、喘息倾向",
      "家族中有鼻炎、哮喘、湿疹等过敏性疾病"
    ],
    diet: "记录并避开明确诱发食物，少吃辛辣刺激、海鲜虾蟹等可疑发物。可适当选择糙米、荞麦、柑橘类等清淡食物。",
    care: "减少尘螨、动物皮毛、花粉、油漆香精等刺激，床品定期清洗日晒，鼻炎咳喘反复者建议专科评估。"
  },
  {
    id: "qi",
    name: "气虚质",
    nature: "气分不足，常见肺脾气虚，表现为易疲倦、易汗、抵抗力偏弱。",
    questions: [
      "精神不足、容易疲倦、活动后气短或不愿动",
      "容易出汗，尤其活动后或睡觉时明显",
      "食欲不振，饭后腹胀，或大便偏稀夹不消化物",
      "反复感冒咳嗽，病后恢复较慢"
    ],
    diet: "饮食清淡易消化，避免过量生冷甜腻。可适当用山药、莲子、芡实、大枣、米粥、瘦肉等健脾益气食材。",
    care: "循序渐进增加户外活动，汗后及时擦干换衣。反复呼吸道感染、久咳或生长发育慢者建议面诊。"
  },
  {
    id: "blood",
    name: "血虚质",
    nature: "血分不足，荣养偏弱，常见面色、唇色、毛发、睡眠注意力方面表现。",
    questions: [
      "面色偏白或少华，眼睑、口唇颜色偏淡",
      "毛发偏稀、少光泽、易脱落，指甲甲床色淡",
      "容易头晕、乏力、心慌，久蹲起立不舒服",
      "睡眠不稳、多梦，学习注意力容易受影响"
    ],
    diet: "可适当增加鸡蛋、瘦肉、猪肝、红枣、龙眼肉等食材。若怀疑贫血，应做血常规等检查。",
    care: "保证睡眠和安静学习环境，避免久蹲突然起立。面色苍白明显或乏力心悸者建议就医排查。"
  },
  {
    id: "yin",
    name: "阴虚质",
    nature: "阴液不足、虚热偏显，容易出现干、热、烦、睡不安。",
    questions: [
      "口干、咽干、唇红，皮肤或毛发偏干",
      "手足心热、盗汗、睡眠浅或易醒",
      "形体偏瘦，容易烦躁、好动或注意力不集中",
      "大便偏干，舌红或舌苔少、花剥"
    ],
    diet: "少吃温燥辛辣、炒货、烧烤。可适当选择梨、藕、银耳、百合、桑椹、黑芝麻等滋润食物。",
    care: "减少熬夜和长时间看屏幕，营造安静环境。盗汗、长期便秘、反复咽干咳嗽者建议辨证调理。"
  },
  {
    id: "yang",
    name: "阳虚质",
    nature: "阳气不足，温煦和推动功能偏弱，常见怕冷、喜暖、便溏。",
    questions: [
      "怕冷、手足不温，喜欢热饮热食",
      "受凉或吃冷饮后容易腹痛、呕吐或腹泻",
      "精神不振、少言懒动，运动后容易头晕多汗",
      "小便清长或夜尿、遗尿，或生长发育偏慢"
    ],
    diet: "少吃生冷寒凉，注意足腹保暖。可适当选择温和熟食、山药、羊肉少量、桂圆等，具体温补需面诊辨证。",
    care: "保证睡眠，多晒太阳，运动以微微出汗为度。畏寒腹泻、遗尿或哮喘反复者建议就医。"
  },
  {
    id: "phlegm",
    name: "痰湿质",
    nature: "痰湿内蕴，常与甜腻饮食、运动不足、脾运失健相关。",
    questions: [
      "形体偏胖或腹部肥厚，肌肉松软",
      "头身困重、嗜睡、懒动，活动耐力差",
      "喉中有痰、胸闷，睡觉鼾声较明显",
      "喜欢甜食、油腻、烧烤，口中黏腻或大便偏溏"
    ],
    diet: "控制甜食、油腻、烧烤和夜宵，食宜八分饱。可多选杂粮、冬瓜、白萝卜、薏苡仁、赤小豆等。",
    care: "每天安排可坚持的运动，减少久坐久卧。鼾声明显、张口呼吸、肥胖或脂肪肝风险者建议评估。"
  },
  {
    id: "heat",
    name: "阳热质",
    nature: "阳热偏盛，功能亢旺，容易出现热、躁、干、便秘等表现。",
    questions: [
      "面色潮红、眼红眼屎多、口唇红而干",
      "急躁易怒、好动少宁、睡眠不安",
      "食欲好、口气重、喜冷饮",
      "大便干结臭秽、小便黄，咽红或容易口疮"
    ],
    diet: "少吃辛辣、油炸烧烤、羊肉牛肉、厚味甜腻。可适当选择梨、香蕉、莲藕、番茄、苦瓜等清润食物。",
    care: "保持环境安静、睡眠充足和每日排便。便秘口臭、反复咽痛发热或情绪亢奋明显者建议面诊。"
  }
];

const SCALE = [
  { label: "没有", value: 0 },
  { label: "偶尔", value: 1 },
  { label: "经常", value: 2 },
  { label: "明显", value: 3 }
];

const $ = id => document.getElementById(id);

function renderQuestions() {
  $("questionList").innerHTML = TYPES.map(type => `
    <article class="type-card">
      <header>
        <h3>${type.name}</h3>
        <small>${type.nature}</small>
      </header>
      ${type.questions.map((question, index) => `
        <div class="question">
          <p>${question}</p>
          <div class="scale" role="radiogroup" aria-label="${type.name}-${index + 1}">
            ${SCALE.map(option => `
              <label>
                <input type="radio" name="${type.id}-${index}" value="${option.value}" ${option.value === 0 ? "checked" : ""}>
                ${option.label}
              </label>
            `).join("")}
          </div>
        </div>
      `).join("")}
    </article>
  `).join("");
}

function collectScores() {
  return TYPES.map(type => {
    const score = type.questions.reduce((sum, _, index) => {
      const checked = document.querySelector(`input[name="${type.id}-${index}"]:checked`);
      return sum + Number(checked?.value || 0);
    }, 0);
    return { ...type, score, max: type.questions.length * 3 };
  }).sort((a, b) => b.score - a.score);
}

function levelText(item) {
  const ratio = item.score / item.max;
  if (item.id === "peace") return ratio >= .7 ? "基础状态较平衡" : "平衡状态不足";
  if (ratio >= .67) return "倾向明显";
  if (ratio >= .42) return "有一定倾向";
  if (ratio >= .2) return "轻度提示";
  return "不明显";
}

function buildReport(scores) {
  const imbalance = scores.filter(item => item.id !== "peace");
  const peace = scores.find(item => item.id === "peace");
  const top = imbalance[0];
  const mixed = imbalance.filter(item => item.id !== top.id && item.score >= 5).slice(0, 2);
  const lowSignal = top.score <= 2 && peace.score < 9;
  const isPeace = lowSignal || (peace.score >= 9 && top.score <= 4);
  const primary = isPeace ? peace : top;
  const primaryName = lowSignal ? "暂无明显偏颇" : primary.name;
  const primaryLevel = lowSignal ? "建议补充观察" : levelText(primary);
  const concern = $("concern").value;
  const childName = $("childName").value.trim() || "孩子";
  const childSex = $("childSex").value;
  const childAge = $("childAge").value.trim() || "未填写";
  const secondary = isPeace ? [] : mixed;
  const adviceItems = [
    primary,
    ...secondary
  ];
  const visitTips = [];

  if (top.score >= 8) visitTips.push(`${top.name}表现较集中，若已经影响睡眠、饮食、生长或反复发病，建议带记录就诊评估。`);
  if (["allergic", "qi"].includes(top.id)) visitTips.push("反复咳嗽、鼻炎、喘息、湿疹或感冒频繁时，建议结合肺脾功能、过敏因素和生活环境综合判断。");
  if (["phlegm", "heat"].includes(top.id)) visitTips.push("若合并肥胖、鼾声、便秘、口臭或睡眠不安，应关注饮食结构、运动量和腺样体/鼻炎等因素。");
  if (!visitTips.length) visitTips.push("当前结果以日常调护为主，建议 1-3 个月后复评，观察体质倾向是否变化。");

  const lines = [
    `儿童体质评估报告`,
    `姓名/昵称：${childName}`,
    `性别：${childSex}`,
    `年龄：${childAge}`,
    `关注问题：${concern}`,
    `主要体质倾向：${primaryName}（${primaryLevel}，${primary.score}/${primary.max}分）`,
    secondary.length ? `可能兼夹体质：${secondary.map(item => `${item.name}${item.score}分`).join("、")}` : `可能兼夹体质：暂不明显`,
    `体质说明：${primary.nature}`,
    `饮食建议：${primary.diet}`,
    `起居调护：${primary.care}`,
    `就诊提示：${visitTips.join(" ")}`,
    `说明：本评估依据儿童体质八分法相关表现整理，用于健康管理与就诊沟通参考，不能替代医生面诊。`
  ];

  return { primary, primaryName, primaryLevel, secondary, scores, adviceItems, visitTips, lines, childName, childSex, childAge, concern };
}

function renderScoreRows(scores) {
  const max = Math.max(...scores.map(item => item.score), 1);
  return scores.map(item => `
    <div class="score-row">
      <strong>${item.name}</strong>
      <span class="score-track"><span class="score-fill" style="width:${Math.round(item.score / max * 100)}%"></span></span>
      <span>${item.score}分</span>
    </div>
  `).join("");
}

function renderResult(report) {
  $("emptyResult").classList.add("hidden");
  const secondaryText = report.secondary.length
    ? report.secondary.map(item => item.name).join("、")
    : "暂不明显";

  $("reportContent").classList.remove("hidden");
  $("reportContent").innerHTML = `
    <div class="result-summary">
      <div class="summary-card">
        <span>主要倾向</span>
        <strong>${report.primaryName}</strong>
        <small>${report.primaryLevel}，${report.primary.score}/${report.primary.max}分</small>
      </div>
      <div class="summary-card">
        <span>可能兼夹</span>
        <strong>${secondaryText}</strong>
        <small>儿童体质可兼夹，也会随生活和疾病状态变化。</small>
      </div>
      <div class="summary-card">
        <span>关注问题</span>
        <strong>${report.concern}</strong>
        <small>${report.childName}，${report.childSex}，${report.childAge}</small>
      </div>
    </div>

    <section class="panel-lite">
      <h3>各体质得分</h3>
      <div class="score-list">${renderScoreRows(report.scores)}</div>
    </section>

    <section class="panel-lite">
      <h3>饮食调护建议</h3>
      <div class="advice-list">
        ${report.adviceItems.map(item => `
          <article class="advice-card">
            <strong>${item.name}</strong>
            <p>${item.diet}</p>
            <p>${item.care}</p>
          </article>
        `).join("")}
        <article class="advice-card warning">
          <strong>就诊提示</strong>
          <p>${report.visitTips.join(" ")}</p>
        </article>
      </div>
    </section>

    <section class="panel-lite">
      <h3>报告文本</h3>
      <div class="report-text" id="reportText">${report.lines.join("\n")}</div>
    </section>
  `;
}

function handleSubmit(event) {
  event.preventDefault();
  const scores = collectScores();
  const report = buildReport(scores);
  renderResult(report);
  location.hash = "result";
}

async function copyReport() {
  const text = $("reportText")?.innerText;
  if (!text) return;
  await navigator.clipboard.writeText(text);
  const button = $("copyReportBtn");
  button.textContent = "已复制";
  window.setTimeout(() => { button.textContent = "复制报告"; }, 1200);
}

function resetForm() {
  $("assessmentForm").reset();
  document.querySelectorAll('.scale input[value="0"]').forEach(input => { input.checked = true; });
  $("reportContent").classList.add("hidden");
  $("emptyResult").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

renderQuestions();
$("assessmentForm").addEventListener("submit", handleSubmit);
$("resetBtn").addEventListener("click", resetForm);
$("copyReportBtn").addEventListener("click", copyReport);
$("printBtn").addEventListener("click", () => window.print());
