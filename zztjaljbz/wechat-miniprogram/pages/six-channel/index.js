const { syndromes, redFlags, questions, medicines } = require("./data");

const syndromeKeys = ["taiyang", "shaoyang", "yangming", "taiyin", "shaoyin", "jueyin"];
const riskNotice = "若出现上述任一信号，建议及时就医。本次仍可导出症状记录，但不做普通居家观察建议。";
const riskList = redFlags.map((item, index) => ({ ...item, no: index + 1 }));

function syndromeLabel(keys) {
  return keys.map(key => syndromes[key] ? syndromes[key].name : key).join("、");
}

function withMedicineText(med) {
  return {
    ...med,
    ingredientsText: med.ingredients.join("、"),
    syndromesText: syndromeLabel(med.syndromes)
  };
}

Page({
  data: {
    redFlags: riskList,
    questions,
    step: 0,
    total: questions.length,
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

  medicineAdvice(calc, needsDoctor) {
    if (needsDoctor) {
      return {
        hasMedicineAdvice: false,
        note: "已出现危险信号或复杂风险线索，不生成中成药建议，请优先医生评估。",
        list: []
      };
    }
    const active = calc.ranked
      .filter(item => item.score >= 2 && item.key !== "shaoyin" && item.key !== "jueyin")
      .map(item => item.key);
    if (!active.length) {
      return {
        hasMedicineAdvice: false,
        note: "当前线索不足，暂不生成中成药建议。",
        list: []
      };
    }
    const mainKey = calc.ranked[0] ? calc.ranked[0].key : "";
    const list = medicines.map(med => {
      const hit = med.syndromes.filter(key => active.includes(key)).length;
      const mainBonus = med.syndromes.includes(mainKey) ? 3 : 0;
      const multiBonus = med.syndromes.length > 1 && hit > 1 ? 2 : 0;
      return withMedicineText({ ...med, score: hit * 2 + mainBonus + multiBonus });
    }).filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    return {
      hasMedicineAdvice: list.length > 0,
      note: "以下为可与医生或执业药师沟通的中成药方向，不包含剂量和疗程，儿童用药请以说明书、医生或药师意见为准。",
      list
    };
  },

  buildResult() {
    const calc = this.calculate();
    const main = calc.ranked[0];
    const related = calc.ranked.slice(1).filter(item => item.score >= 2);
    const serious = calc.scores.shaoyin >= 6 || calc.scores.jueyin >= 6;
    const needsDoctor = serious;
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
    const doctorReason = "少阴或厥阴风险线索较突出，建议由医生综合辨证。";
    const medicineAdvice = this.medicineAdvice(calc, needsDoctor);
    const reportText = this.reportText({ title, calc, needsDoctor, doctorReason, main, related, medicineAdvice });
    return {
      title,
      summary,
      scoreList,
      evidence: calc.evidence.slice(0, 10),
      needsDoctor,
      doctorReason,
      medicineAdvice,
      reportText
    };
  },

  reportText({ title, calc, needsDoctor, doctorReason, main, related, medicineAdvice }) {
    const scoreText = syndromeKeys.map(key => `${syndromes[key].name}${calc.scores[key]}分`).join("，");
    const relatedText = related.length ? related.map(item => item.name).join("、") : "无明显伴随线索";
    const evidenceText = calc.evidence.length ? calc.evidence.slice(0, 10).map(item => `- ${item}`).join("\n") : "- 阳性线索较少。";
    const medicineText = medicineAdvice.list.length
      ? medicineAdvice.list.map(item => [
        `- ${item.name}`,
        `  归经：${item.syndromesText}`,
        `  组成：${item.ingredientsText}`,
        `  功效：${item.effect}`,
        `  适合线索：${item.suitable}`,
        `  注意事项：${item.caution}`
      ].join("\n")).join("\n")
      : `- ${medicineAdvice.note}`;
    return [
      "儿童外感六经线索评估摘要",
      "",
      `结果：${title}`,
      `主线索说明：${main ? main.summary : "暂未形成明确主线索。"}`,
      `伴随线索：${relatedText}`,
      `六经分数：${scoreText}`,
      "",
      "危险信号：",
      `- ${riskNotice}`,
      "",
      "判断依据：",
      evidenceText,
      "",
      "中成药参考建议：",
      medicineText,
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
