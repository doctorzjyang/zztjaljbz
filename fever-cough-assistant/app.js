(function () {
  const SUPABASE_URL = "https://frugibobukmwcawwrtho.supabase.co";
  const SUPABASE_KEY = "sb_publishable_BLVRdzvA_ROqJf4XFANumw_tX7webdl";

  const state = {
    step: 0,
    answers: {},
    redFlags: new Set(),
    lastSavedSignature: ""
  };

  const redFlagList = document.getElementById("redFlagList");
  const startBtn = document.getElementById("startBtn");
  const quiz = document.getElementById("quiz");
  const result = document.getElementById("result");
  const questionTitle = document.getElementById("questionTitle");
  const questionHint = document.getElementById("questionHint");
  const options = document.getElementById("options");
  const progressText = document.getElementById("progressText");
  const progressBar = document.getElementById("progressBar");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  let lastReportText = "";

  function initRedFlags() {
    redFlagList.innerHTML = APP_DATA.redFlags.map(item => `
      <div class="risk-item">
        <span>${item.text}</span>
      </div>
    `).join("");
  }

  function selectedFor(questionId) {
    return state.answers[questionId] || [];
  }

  function renderQuestion() {
    const question = APP_DATA.questions[state.step];
    const total = APP_DATA.questions.length;
    questionTitle.textContent = question.title;
    questionHint.textContent = state.step === 0
      ? "按资料中的“0+10问诊”先记录主诉，再从吃喝拉撒睡汗冷热等线索判断六经。"
      : "可选择一个或多个最符合孩子情况的选项；如果没有对应情况，直接点击下一步，或选择“没有明显异常/没有这些情况”。";
    progressText.textContent = `${state.step + 1} / ${total}`;
    progressBar.style.width = `${((state.step + 1) / total) * 100}%`;
    prevBtn.disabled = state.step === 0;
    nextBtn.textContent = state.step === total - 1 ? "查看结果" : "下一步";

    const chosen = new Set(selectedFor(question.id));
    options.innerHTML = question.options.map((option, index) => {
      const id = `${question.id}_${index}`;
      const checked = chosen.has(option.label) ? "checked" : "";
      return `
        <label class="option-card" for="${id}">
          <input id="${id}" type="${question.multi ? "checkbox" : "radio"}" name="${question.id}" value="${option.label}" data-none="${option.none ? "true" : "false"}" ${checked}>
          <span>${option.label}</span>
        </label>
      `;
    }).join("");
  }

  options.addEventListener("change", event => {
    const input = event.target;
    if (!input.matches("input")) return;
    const all = [...options.querySelectorAll("input")];
    if (input.dataset.none === "true" && input.checked) {
      all.forEach(item => {
        if (item !== input) item.checked = false;
      });
      return;
    }
    if (input.checked) {
      all.forEach(item => {
        if (item.dataset.none === "true") item.checked = false;
      });
    }
  });

  function saveCurrentAnswer() {
    const question = APP_DATA.questions[state.step];
    const checked = [...options.querySelectorAll("input:checked")].map(input => input.value);
    state.answers[question.id] = checked;
  }

  function getSelectedOptions() {
    const picked = [];
    APP_DATA.questions.forEach(question => {
      const selected = new Set(state.answers[question.id] || []);
      question.options.forEach(option => {
        if (selected.has(option.label)) picked.push({ question, option });
      });
    });
    return picked;
  }

  function calculate() {
    const scores = { taiyang: 0, shaoyang: 0, yangming: 0, taiyin: 0, shaoyin: 0, jueyin: 0 };
    const evidence = [];
    const tags = new Set();

    getSelectedOptions().forEach(({ option }) => {
      if (option.tags) option.tags.forEach(tag => tags.add(tag));
      if (option.scores) {
        Object.entries(option.scores).forEach(([key, value]) => {
          scores[key] += value;
        });
      }
      if (option.evidence) evidence.push(option.evidence);
    });

    const ranked = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .filter(([, score]) => score > 0);
    const hasResult = ranked.length > 0;
    const main = ranked[0] || [null, 0];
    const companions = ranked.slice(1);
    const serious = scores.shaoyin >= 6 || scores.jueyin >= 6;
    return { scores, ranked, main, companions, evidence, tags, serious, hasResult };
  }

  function medicinePool(tags) {
    const selectedText = getSelectedOptions().map(({ option }) => option.label).join("、");
    const coughAnswers = selectedFor("cough");
    const hasSpecificCough = coughAnswers.some(label => !/没有/.test(label)) || /咳|喘|痰|鼻|咽|声嘶/.test(selectedText);
    const hasFever = tags.has("fever") || (!tags.has("fever") && !tags.has("cough"));
    const hasCough = tags.has("cough") || hasSpecificCough;
    return [
      ...(hasFever ? APP_DATA.feverMedicines : []),
      ...(hasCough ? APP_DATA.coughMedicines : [])
    ];
  }

  function matchMedicines(calc) {
    if (!calc.hasResult) return [];
    const active = calc.ranked
      .filter(([key]) => key !== "shaoyin" && key !== "jueyin")
      .map(([key]) => key);
    const mainKey = calc.main[0];
    const selectedText = getSelectedOptions().map(({ option }) => option.label).join("、");
    const foodHeat = /积食|口气重|舌苔黄厚腻|大便干/.test(selectedText);
    const meds = medicinePool(calc.tags).map(med => {
      const hit = med.syndromes.filter(s => active.includes(s)).length;
      const mainBonus = med.syndromes.includes(mainKey) ? 3 : 0;
      const multiBonus = med.syndromes.length > 1 && hit > 1 ? 2 : 0;
      const exactBonus = hit === med.syndromes.length ? 1 : 0;
      const medText = `${med.name}${med.suitable}${med.ingredients.join("")}`;
      const foodBonus = foodHeat && /积|大黄|槟榔|厚朴|山楂|神曲|麦芽|莱菔子/.test(medText) ? 5 : 0;
      return { med, score: hit * 2 + mainBonus + multiBonus + exactBonus + foodBonus };
    }).filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(item => item.med);
    return meds;
  }

  function explainIngredients(ingredients) {
    return ingredients.slice(0, 10).map(name => {
      const effect = APP_DATA.ingredientEffects[name] || "需结合方中配伍理解其作用。";
      return `<li><strong>${name}</strong><span>${effect}</span></li>`;
    }).join("");
  }

  function activeSyndromes(calc) {
    return calc.ranked
      .filter(([key]) => key !== "shaoyin" && key !== "jueyin")
      .map(([key]) => key);
  }

  function treatmentPrinciples(calc) {
    if (!calc.hasResult) return [];
    const active = activeSyndromes(calc);
    const has = key => active.includes(key);
    const items = [];

    if (has("taiyang")) {
      items.push({
        title: "太阳证：解表为先",
        text: "以辛温解表、宣散表邪为原则。若仍有怕冷、清涕、身痛等表证，不宜单纯使用苦寒清里药，以免表邪郁闭。若已大汗、明显乏力或津液受伤，不宜再单纯发汗。"
      });
    }
    if (has("shaoyang")) {
      items.push({
        title: "少阳证：和解少阳",
        text: "以和解少阳、调和枢机为原则。少阳邪在半表半里，忌单纯发汗、催吐或攻下；若寒饮、水饮内停明显，清少阳药也需谨慎。"
      });
    }
    if (has("yangming")) {
      items.push({
        title: "阳明证：清热或通腑消积",
        text: "以清里热、化痰热、通腑消积为原则。口干、大便干、口气重、舌苔黄厚腻、积食化热等偏阳明；若便秘来自气血阴阳亏虚，不可盲目攻下。"
      });
    }
    if (has("taiyin")) {
      items.push({
        title: "太阴证：温中健脾",
        text: "以温中散寒、健脾化痰为原则。大便稀、畏寒肢冷、舌苔白厚腻时，慎用清热解毒、苦寒或攻下药，以免损伤脾阳。"
      });
    }

    if (has("taiyang") && has("shaoyang") && has("yangming")) {
      items.push({
        title: "三阳合病：三阳合治，分清主次",
        text: "太阳、少阳、阳明同时有证时，应兼顾解表、和解、清里，通常不宜只盯一个症状单向用药；若某一经证特别突出，再按轻重缓急调整主次。"
      });
    } else {
      if (has("taiyang") && has("shaoyang")) {
        items.push({
          title: "太阳少阳合病：解表兼和解",
          text: "既有表证又有少阳证时，原则是和解少阳兼顾解表，不宜只发汗或只清里。"
        });
      }
      if (has("taiyang") && has("yangming")) {
        items.push({
          title: "太阳阳明合病：表里双解",
          text: "既有表证又有里热、食积或痰热时，原则是解表清里；一般先解表或表里同治，只有里证极重时才优先处理里证。"
        });
      }
      if (has("shaoyang") && has("yangming")) {
        items.push({
          title: "少阳阳明合病：和解兼清里",
          text: "口苦、寒热往来与口干、便干、黄痰、食积化热并见时，原则是和解少阳并兼清阳明里热。"
        });
      }
      if (has("shaoyang") && has("taiyin")) {
        items.push({
          title: "少阳太阴合病：清疏与温化并行",
          text: "少阳郁热与太阴寒湿、脾虚同见时，不宜单清热或单温里，应兼顾清疏少阳与温化太阴，并建议医生辨证。"
        });
      }
      if (has("yangming") && has("taiyin")) {
        items.push({
          title: "阳明太阴并见：辨清寒热虚实",
          text: "若既有口气重、便干、苔黄腻，又有便稀、畏寒肢冷，需要警惕寒热错杂；不宜单纯清热或单纯温里。"
        });
      }
    }

    if (calc.ranked.some(([key]) => key === "shaoyin")) {
      items.push({
        title: "少阴线索：不自行发汗",
        text: "若出现精神差、畏寒明显、体质虚弱等少阴线索，不宜单纯强力发汗，应由医生判断是否需要助阳发表。"
      });
    }
    if (calc.ranked.some(([key]) => key === "jueyin")) {
      items.push({
        title: "厥阴线索：寒热错杂需医生辨证",
        text: "若寒热错杂、上热下寒或阳明太阴并见，不可单清热或单温里，需医生综合辨证。"
      });
    }

    return items;
  }

  function principleHtml(principles) {
    if (!principles.length) return `<p class="muted">当前依据不足，暂不生成选药原则。</p>`;
    return `<ul class="principle-list">${principles.map(item => `
      <li><strong>${item.title}</strong><span>${item.text}</span></li>
    `).join("")}</ul>`;
  }

  function answerSummaryLines() {
    const lines = [];
    APP_DATA.questions.forEach(question => {
      const selected = state.answers[question.id] || [];
      if (selected.length) lines.push(`${question.title}：${selected.join("、")}`);
    });
    return lines;
  }

  function symptomPayload() {
    return APP_DATA.questions.map(question => ({
      questionId: question.id,
      question: question.title,
      selected: state.answers[question.id] || []
    })).filter(item => item.selected.length);
  }

  function diagnosisText(calc, main, relatedNames, redFlagTexts) {
    if (redFlagTexts.length) return "勾选危险信号，建议及时就医，本工具不生成用药推荐。";
    if (calc.serious) return "出现少阴/厥阴相关线索，不建议自行选药，需医生辨证。";
    if (!calc.hasResult) return "暂未形成明确六经辨证结果。";
    return `主证：${main.name}${relatedNames.length ? "；涉及：" + relatedNames.join("、") : ""}`;
  }

  async function saveConsultRecord(calc, meds, diagnosis) {
    const payload = {
      symptoms: symptomPayload(),
      scores: calc.scores,
      diagnosis,
      medicines: meds.map(med => med.name)
    };
    const signature = JSON.stringify(payload);
    if (state.lastSavedSignature === signature) return;
    state.lastSavedSignature = signature;

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/consult_records`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(await response.text());
      setExportStatus("脱敏问诊记录已保存。");
    } catch (error) {
      console.warn("脱敏问诊记录保存失败", error);
      setExportStatus("脱敏问诊记录暂未保存成功，不影响本次页面结果。");
    }
  }

  function buildReportText(calc, meds, main, relatedNames, redFlagTexts, principles) {
    const title = "小儿发热咳嗽六经辨证问诊摘要";
    const syndromeTitle = calc.hasResult
      ? `${main.name}${relatedNames.length ? "；涉及：" + relatedNames.join("、") : ""}`
      : "暂未形成明确六经辨证结果";
    const lines = [
      title,
      `生成时间：${new Date().toLocaleString("zh-CN")}`,
      "",
      "一、问诊结果汇总",
      ...(answerSummaryLines().length ? answerSummaryLines() : ["未记录具体症状选项。"]),
      "",
      "二、系统辨证结果",
      `辨证倾向：${calc.hasResult ? "主证 " : ""}${syndromeTitle}`,
      `判断方向：${calc.hasResult ? main.summary : "本次未选择到足够的阳性症状，无法形成明确证候倾向。"}`,
      `处理思路：${calc.hasResult ? main.direction : "建议继续观察体温、精神、饮食、二便、咳嗽痰象等变化；如有不适或病情变化，请咨询医生。"}`,
      `分值参考：${Object.entries(calc.scores).map(([key, score]) => `${APP_DATA.syndromes[key].name}${score}`).join("；")}`,
      "",
      "三、命中依据",
      ...(calc.evidence.length ? calc.evidence.slice(0, 10).map(item => `- ${item}`) : ["- 未选择到可用于辨证的阳性症状。"]),
      "",
      "四、选药原则与禁忌",
      ...(principles.length ? principles.map(item => `- ${item.title}：${item.text}`) : ["- 当前依据不足，暂不生成选药原则。"]),
      "",
      "五、药物参考（仅供医生/药师判断方向，不含剂量建议）"
    ];

    if (!calc.hasResult) {
      lines.push("当前依据不足，不生成药物推荐。");
    } else if (redFlagTexts.length || calc.serious) {
      lines.push("当前结果提示需医生辨证或及时就医，本工具不生成药物推荐。");
    } else if (meds.length) {
      meds.forEach((med, index) => {
        lines.push(`${index + 1}. ${med.name}`);
        lines.push(`   对应方向：${med.syndromes.map(s => APP_DATA.syndromes[s].name).join(" / ")}`);
        lines.push(`   组成：${med.ingredients.join("、")}`);
        lines.push(`   注意：${med.caution}`);
      });
    } else {
      lines.push("当前未匹配到合适的药物参考。");
    }

    lines.push("");
    lines.push("六、安全提示");
    lines.push("本报告由网页问诊工具根据症状选择自动生成，仅供就医沟通参考，不能替代医生诊断。儿童具体用药、剂量和疗程请遵医嘱或咨询执业药师。");
    lines.push("中成药多来自古代经方或老中医有效经验方，在临床上经过实践检验；但具体到每个患者，体质、病程、兼夹证和用药禁忌各有特点，因此仍需在医师指导下使用，必要时由医生开具更个性化的中药方。");
    return lines.join("\n");
  }

  function encodeCaseState() {
    const raw = JSON.stringify({ answers: state.answers });
    return btoa(unescape(encodeURIComponent(raw)));
  }

  function decodeCaseState(value) {
    return JSON.parse(decodeURIComponent(escape(atob(value))));
  }

  function shareUrl() {
    const url = new URL(window.location.href);
    url.searchParams.set("case", encodeCaseState());
    url.hash = "result";
    return url.toString();
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch (error) {
        // Fall through to the textarea fallback below.
      }
    }
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  function downloadTextReport() {
    const blob = new Blob([lastReportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `小儿发热咳嗽问诊摘要-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function setExportStatus(message) {
    const status = document.getElementById("exportStatus");
    if (status) status.textContent = message;
  }

  function renderResult() {
    const calc = calculate();
    const meds = matchMedicines(calc);
    const mainKey = calc.main[0];
    const main = calc.hasResult ? APP_DATA.syndromes[mainKey] : null;
    const relatedNames = calc.companions
      .filter(([key]) => key !== "shaoyin" && key !== "jueyin")
      .map(([key]) => APP_DATA.syndromes[key].name);
    const redFlagTexts = APP_DATA.redFlags
      .filter(item => state.redFlags.has(item.id))
      .map(item => item.text);
    const principles = treatmentPrinciples(calc);
    const diagnosis = diagnosisText(calc, main, relatedNames, redFlagTexts);
    lastReportText = buildReportText(calc, meds, main, relatedNames, redFlagTexts, principles);

    let warning = "";
    if (redFlagTexts.length) {
      warning = `
        <section class="notice danger">
          <strong>建议及时就医</strong>
          <p>你勾选了危险信号：${redFlagTexts.join("；")}。本次不提供中成药推荐，请优先就医。</p>
        </section>
      `;
    } else if (calc.serious) {
      warning = `
        <section class="notice danger">
          <strong>不建议自行选药</strong>
          <p>结果出现少阴/厥阴相关线索。儿童少阴、厥阴证病机复杂，请由医生辨证处理。</p>
        </section>
      `;
    }

    const medicineHtml = (calc.hasResult && !redFlagTexts.length && !calc.serious && meds.length)
      ? meds.map(med => `
        <article class="medicine-card">
          <div>
            <h3>${med.name}</h3>
            <p class="tagline">${med.syndromes.map(s => APP_DATA.syndromes[s].name).join(" / ")}</p>
          </div>
          <p><strong>适合方向：</strong>${med.suitable}</p>
          <p><strong>组成：</strong>${med.ingredients.join("、")}</p>
          <details>
            <summary>查看主要成分作用</summary>
            <ul class="ingredient-list">${explainIngredients(med.ingredients)}</ul>
          </details>
          <p class="caution"><strong>注意：</strong>${med.caution}</p>
        </article>
      `).join("")
      : `<p class="muted">当前结果不生成药品推荐。</p>`;

    result.className = "";
    result.innerHTML = `
      ${warning}
      <section class="panel result-panel">
        <div class="panel-head">
          <p class="eyebrow">辨证结果</p>
          <h2>${calc.hasResult ? `主证：${main.name}${relatedNames.length ? "；涉及：" + relatedNames.join("、") : ""}` : "暂未形成明确六经辨证结果"}</h2>
        </div>
        <p class="muted">${calc.hasResult ? "说明：分值最高者作为主证；其他有分证候表示本次症状已涉及该方向，选药时应一并参考，符合“有是证用是药”。" : "说明：本次没有选择到可用于辨证的阳性症状，因此不强行归入太阳、少阳、阳明或太阴，也不生成药物推荐。"}</p>
        <div class="score-grid">
          ${Object.entries(APP_DATA.syndromes).map(([key, value]) => `
            <div>
              <span>${value.name}</span>
              <strong>${calc.scores[key]}</strong>
            </div>
          `).join("")}
        </div>
        <p><strong>判断方向：</strong>${calc.hasResult ? main.summary : "依据不足，暂不判断具体六经证型。"}</p>
        <p><strong>处理思路：</strong>${calc.hasResult ? main.direction : "继续观察孩子精神、体温、饮食、二便、咳嗽痰象等变化；如出现不适、病情变化或家长拿不准，请咨询医生。"}</p>
        <div class="evidence">
          <strong>命中依据</strong>
          <ul>${calc.evidence.length ? calc.evidence.slice(0, 8).map(item => `<li>${item}</li>`).join("") : "<li>未选择到可用于辨证的阳性症状。</li>"}</ul>
        </div>
      </section>

      <section class="panel">
        <div class="panel-head">
          <p class="eyebrow">药物参考</p>
          <h2>可参考的中成药方向</h2>
          <p class="muted">以下原则用于约束药物选择，只使用当前数据库中的中成药，不额外推荐数据库外药物。</p>
        </div>
        <div class="principle-box">
          <strong>选药原则与禁忌</strong>
          ${principleHtml(principles)}
        </div>
        <div class="medicine-list">${medicineHtml}</div>
      </section>

      <section class="panel export-panel">
        <div class="panel-head">
          <p class="eyebrow">导出给医生</p>
          <h2>问诊摘要与辨证参考</h2>
          <p class="muted">导出内容包含问诊选择、辨证结果、命中依据、参考药名和组成，不包含剂量建议。</p>
        </div>
        <div class="export-actions">
          <button class="button primary" type="button" data-export="copy-report">复制问诊摘要</button>
          <button class="button" type="button" data-export="download-report">下载文本报告</button>
          <button class="button" type="button" data-export="copy-link">复制复现链接</button>
        </div>
        <p id="exportStatus" class="muted export-status">正在保存脱敏问诊记录。复现链接包含本次症状选择，不含姓名、电话、住址、身份证、生日等个人信息。</p>
      </section>

      <section class="notice">
        <strong>再次提醒</strong>
        <p>请按药品说明书年龄剂量使用，并咨询医生或执业药师。若病情加重、发热不退、喘憋或精神变差，请及时就医。</p>
        <p>中成药多来自古代经方或老中医有效经验方，在临床上经过实践检验；但具体到每个患者，体质、病程、兼夹证和用药禁忌各有特点，因此仍需在医师指导下使用，必要时由医生开具更个性化的中药方。</p>
      </section>
    `;
    saveConsultRecord(calc, meds, diagnosis);
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  startBtn.addEventListener("click", () => {
    quiz.classList.remove("hidden");
    renderQuestion();
    quiz.scrollIntoView({ behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    saveCurrentAnswer();
    if (state.step < APP_DATA.questions.length - 1) {
      state.step += 1;
      renderQuestion();
    } else {
      renderResult();
    }
  });

  prevBtn.addEventListener("click", () => {
    saveCurrentAnswer();
    if (state.step > 0) {
      state.step -= 1;
      renderQuestion();
    }
  });

  result.addEventListener("click", async event => {
    const button = event.target.closest("[data-export]");
    if (!button) return;
    try {
      if (button.dataset.export === "copy-report") {
        await copyText(lastReportText);
        setExportStatus("已复制问诊摘要，可直接粘贴发给医生或药师。");
      } else if (button.dataset.export === "download-report") {
        downloadTextReport();
        setExportStatus("已生成文本报告下载。");
      } else if (button.dataset.export === "copy-link") {
        await copyText(shareUrl());
        setExportStatus("已复制复现链接。提醒：本地 127.0.0.1 链接只能在本机或同一部署环境打开。");
      }
    } catch (error) {
      setExportStatus("导出失败，请重试或使用浏览器复制页面内容。");
    }
  });

  initRedFlags();
  try {
    const sharedCase = new URLSearchParams(window.location.search).get("case");
    if (sharedCase) {
      const decoded = decodeCaseState(sharedCase);
      state.answers = decoded.answers || {};
      quiz.classList.remove("hidden");
      renderQuestion();
      renderResult();
    }
  } catch (error) {
    console.warn("无法读取复现链接", error);
  }
})();
