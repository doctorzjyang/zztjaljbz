const { syndromes, redFlags, questions } = require("./data");

const syndromeKeys = ["taiyang", "shaoyang", "yangming", "taiyin", "shaoyin", "jueyin"];

Page({
  data: {
    redFlags,
    questions,
    step: 0,
    total: questions.length,
    progress: Math.round(100 / questions.length),
    currentQuestion: questions[0],
    isFirstStep: true,
    nextText: questions.length === 1 ? "查看结果" : "下一步",
    answers: {},
    selectedMap: {},
    redFlagValues: [],
    redFlagMap: {},
    hasRedFlags: false,
    noEvidence: false,
    resultCardClass: "",
    showQuestion: true,
    result: null
  },

  onRedFlagChange(event) {
    const values = event.detail.value || [];
    const redFlagMap = {};
    values.forEach(id => { redFlagMap[id] = true; });
    this.setData({ redFlagValues: values, redFlagMap, hasRedFlags: values.length > 0 });
  },

  onQuestionChange(event) {
    const question = questions[this.data.step];
    let values = event.detail.value || [];
    const noneLabels = question.options.filter(item => item.none).map(item => item.label);
    const pickedNone = values.some(label => noneLabels.includes(label));
    if (pickedNone && values.length > 1) {
      values = [values[values.length - 1]];
      if (!noneLabels.includes(values[0])) values = values.filter(label => !noneLabels.includes(label));
    }
    const answers = { ...this.data.answers, [question.id]: values };
    this.setData({ answers, selectedMap: this.mapSelected(values) });
  },

  prevStep() {
    if (this.data.step <= 0) return;
    this.setStep(this.data.step - 1);
  },

  nextStep() {
    if (this.data.step >= questions.length - 1) {
      const result = this.buildResult();
      this.setData({
        result,
        resultCardClass: result.needsDoctor ? "card result-card result-warning" : "card result-card",
        noEvidence: result.evidence.length === 0,
        showQuestion: false
      });
      return;
    }
    this.setStep(this.data.step + 1);
  },

  setStep(step) {
    const currentQuestion = questions[step];
    const selected = this.data.answers[currentQuestion.id] || [];
    this.setData({
      step,
      currentQuestion,
      selectedMap: this.mapSelected(selected),
      progress: Math.round(((step + 1) / questions.length) * 100),
      isFirstStep: step === 0,
      nextText: step === questions.length - 1 ? "查看结果" : "下一步"
    });
  },

  mapSelected(values) {
    const selectedMap = {};
    values.forEach(value => { selectedMap[value] = true; });
    return selectedMap;
  },

  pickedOptions() {
    const picked = [];
    questions.forEach(question => {
      const selected = new Set(this.data.answers[question.id] || []);
      question.options.forEach(option => {
        if (selected.has(option.label) && !option.none) picked.push({ question, option });
      });
    });
    return picked;
  },

  calculate() {
    const scores = {};
    const evidence = [];
    syndromeKeys.forEach(key => { scores[key] = 0; });
    this.pickedOptions().forEach(({ option }) => {
      Object.keys(option.scores || {}).forEach(key => {
        scores[key] += option.scores[key];
      });
      if (option.evidence) evidence.push(option.evidence);
    });
    const ranked = syndromeKeys
      .map(key => ({ key, ...syndromes[key], score: scores[key] }))
      .sort((a, b) => b.score - a.score)
      .filter(item => item.score > 0);
    return { scores, ranked, evidence: Array.from(new Set(evidence)) };
  },

  buildResult() {
    const calc = this.calculate();
    const main = calc.ranked[0];
    const related = calc.ranked.slice(1).filter(item => item.score >= 2);
    const redFlagTexts = this.data.redFlagValues.map(id => {
      const item = redFlags.find(flag => flag.id === id);
      return item ? item.text : "";
    }).filter(Boolean);
    const serious = calc.scores.shaoyin >= 6 || calc.scores.jueyin >= 6;
    const needsDoctor = redFlagTexts.length > 0 || serious;
    const maxScore = Math.max(...syndromeKeys.map(key => calc.scores[key]), 1);
    const scoreList = syndromeKeys.map(key => ({
      key,
      name: syndromes[key].name,
      score: calc.scores[key],
      percent: Math.round((calc.scores[key] / maxScore) * 100)
    }));
    const title = main
      ? `主要倾向：${main.name}${related.length ? "；同时涉及：" + related.map(item => item.name).join("、") : ""}`
      : "暂未形成明确六经线索";
    const summary = main
      ? `${main.summary}${main.advice}`
      : "本次选择到的阳性症状较少，可继续观察体温、精神、饮食、二便、咳嗽痰象等变化。";
    const doctorReason = redFlagTexts.length
      ? redFlagTexts.join("；")
      : "少阴或厥阴风险线索较突出，建议由医生综合辨证。";
    const reportText = this.reportText({ title, calc, redFlagTexts, needsDoctor, doctorReason, main, related });
    return {
      title,
      summary,
      scoreList,
      evidence: calc.evidence.slice(0, 10),
      needsDoctor,
      doctorReason,
      reportText
    };
  },

  reportText({ title, calc, redFlagTexts, needsDoctor, doctorReason, main, related }) {
    const scoreText = syndromeKeys.map(key => `${syndromes[key].name}${calc.scores[key]}分`).join("，");
    const relatedText = related.length ? related.map(item => item.name).join("、") : "无明显伴随线索";
    const evidenceText = calc.evidence.length ? calc.evidence.slice(0, 10).map(item => `- ${item}`).join("\n") : "- 阳性线索较少。";
    return [
      "儿童外感六经线索评估摘要",
      "",
      `结果：${title}`,
      `主线索说明：${main ? main.summary : "暂未形成明确主线索。"}`,
      `伴随线索：${relatedText}`,
      `六经分数：${scoreText}`,
      "",
      "危险信号：",
      redFlagTexts.length ? redFlagTexts.map(item => `- ${item}`).join("\n") : "- 未勾选危险信号。",
      "",
      "判断依据：",
      evidenceText,
      "",
      needsDoctor ? `建议医生评估：${doctorReason}` : "建议：继续观察体温、精神、饮食、二便、咳嗽痰象变化。如病情加重或家长拿不准，请及时就医。",
      "",
      "说明：本摘要仅供健康记录和就医沟通参考，不能替代医生诊断、处方或治疗建议。"
    ].join("\n");
  },

  copyReport() {
    if (!this.data.result) return;
    wx.setClipboardData({
      data: this.data.result.reportText,
      success: () => wx.showToast({ title: "已复制", icon: "success" })
    });
  },

  restart() {
    this.setData({
      step: 0,
      progress: Math.round(100 / questions.length),
      currentQuestion: questions[0],
      isFirstStep: true,
      nextText: questions.length === 1 ? "查看结果" : "下一步",
      answers: {},
      selectedMap: {},
      noEvidence: false,
      resultCardClass: "",
      showQuestion: true,
      result: null
    });
  }
});
