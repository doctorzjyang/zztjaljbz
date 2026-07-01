import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://olokwvgvuhlpylvgyaqr.supabase.co";
const SUPABASE_KEY = "sb_publishable_SoYx0Wp0iMqAaRJ99S-iOw_CL6kmWys";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const $ = id => document.getElementById(id);
const state = {
  user: null,
  children: [],
  selectedChildId: null,
  measurements: [],
  standards: { male: [], female: [] },
  lastReport: null
};

const percentileKeys = [
  ["p3", "P3", "#c55f45"],
  ["p10", "P10", "#d89b58"],
  ["p25", "P25", "#d9bd61"],
  ["p50", "P50", "#2f6f73"],
  ["p75", "P75", "#78a76d"],
  ["p90", "P90", "#5c88b4"],
  ["p97", "P97", "#705da8"]
];

function setMessage(text, tone = "warn") {
  ["authMessage", "appMessage"].forEach(id => {
    const node = $(id);
    if (!node) return;
    node.textContent = text || "";
    node.style.color = tone === "ok" ? "#1f6865" : "#a94831";
  });
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function fmt(n, digits = 1) {
  return Number.isFinite(n) ? Number(n).toFixed(digits) : "暂无";
}

function monthsBetween(start, end) {
  const a = new Date(start);
  const b = new Date(end);
  return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()) + (b.getDate() - a.getDate()) / 30.4375;
}

function ageLabel(months) {
  if (!Number.isFinite(months)) return "暂无";
  if (months < 24) return `${Math.max(0, Math.round(months))} 月`;
  return `${Math.floor(months / 12)} 岁 ${Math.round(months % 12)} 月`;
}

function parseAgeToMonths(value) {
  const text = String(value).replace(/\s/g, "");
  if (text === "0") return 0;
  if (text.includes("月")) return parseFloat(text);
  if (text.includes("岁")) return Math.round(parseFloat(text) * 12);
  return Math.round(parseFloat(text) * 12);
}

function normalizeStandards(rows) {
  return rows.map(row => ({
    month: parseAgeToMonths(row["年龄"]),
    sex: row["性别"],
    source: row.source || "",
    p3: Number(row["3rd"]),
    p10: Number(row["10 th"]),
    p25: Number(row["25th"]),
    p50: Number(row["50th"]),
    p75: Number(row["75th"]),
    p90: Number(row["90th"]),
    p97: Number(row["97 th"])
  })).sort((a, b) => a.month - b.month);
}

async function loadStandards() {
  const [boy, girl] = await Promise.all([
    fetch("./boy.json").then(r => r.json()),
    fetch("./girl.json").then(r => r.json())
  ]);
  state.standards.male = normalizeStandards(boy);
  state.standards.female = normalizeStandards(girl);
}

function chartSegment(months) {
  if (Number.isFinite(months) && months >= 84) {
    return { key: "school", label: "7岁及以上（年度标准）", xMin: 84, xMax: 216, tickStart: 7, tickEnd: 18, tickStep: 1 };
  }
  const startMonth = Number.isFinite(months) && months < 12 ? 0 : 12;
  return { key: "preschool", label: startMonth === 0 ? "0-7岁（月龄标准）" : "1-7岁（月龄标准）", xMin: startMonth, xMax: 84, tickStart: startMonth / 12, tickEnd: 7, tickStep: 1 };
}

function standardsForSegment(sex, segment) {
  const data = state.standards[sex] || [];
  return data.filter(item => {
    if (segment.key === "school") return item.month >= 84 && item.month <= 216;
    return item.month >= segment.xMin && item.month < 84;
  });
}

function interpolateStandard(sex, months) {
  const segment = chartSegment(months);
  const data = standardsForSegment(sex, segment);
  if (!data.length) return null;
  if (months <= data[0].month) return data[0];
  if (months >= data[data.length - 1].month) return data[data.length - 1];
  const next = data.find(item => item.month >= months);
  const prev = data[data.indexOf(next) - 1] || next;
  const ratio = (months - prev.month) / (next.month - prev.month || 1);
  const item = { month: months, sex };
  percentileKeys.forEach(([key]) => {
    item[key] = prev[key] + (next[key] - prev[key]) * ratio;
  });
  return item;
}

function percentileLevel(height, standard) {
  if (!standard || !Number.isFinite(height)) return { label: "暂无", band: "暂无", risk: "neutral" };
  const checks = [
    ["低于 P3", height < standard.p3, "high"],
    ["P3-P10", height < standard.p10, "watch"],
    ["P10-P25", height < standard.p25, "watch"],
    ["P25-P50", height < standard.p50, "normal"],
    ["P50-P75", height < standard.p75, "normal"],
    ["P75-P90", height < standard.p90, "normal"],
    ["P90-P97", height < standard.p97, "normal"],
    ["高于 P97", true, "normal"]
  ];
  const found = checks.find(([, ok]) => ok);
  const nearest = percentileKeys.reduce((best, [key, label]) => {
    const diff = Math.abs(height - standard[key]);
    return diff < best.diff ? { label, diff } : best;
  }, { label: "P50", diff: Infinity }).label;
  return { label: nearest, band: found[0], risk: found[2] };
}

function targetHeight(child) {
  const father = Number(child?.father_height);
  const mother = Number(child?.mother_height);
  if (!father || !mother) return null;
  const value = child.sex === "male" ? (father + mother + 13) / 2 : (father + mother - 13) / 2;
  return {
    value,
    low: value - 6,
    high: value + 6,
    formula: child.sex === "male"
      ? `(${father} + ${mother} + 13) / 2 = ${fmt(value)} cm`
      : `(${father} + ${mother} - 13) / 2 = ${fmt(value)} cm`
  };
}

function sortedMeasurements() {
  return [...state.measurements].sort((a, b) => new Date(a.measured_at) - new Date(b.measured_at));
}

function latestMeasurement() {
  return sortedMeasurements().at(-1) || null;
}

function growthVelocity(monthsWindow) {
  const list = sortedMeasurements();
  const latest = list.at(-1);
  if (!latest) return null;
  const latestDate = new Date(latest.measured_at);
  const targetDate = new Date(latestDate);
  targetDate.setMonth(targetDate.getMonth() - monthsWindow);
  const baseline = [...list].reverse().find(item => new Date(item.measured_at) <= targetDate) || list[0];
  if (!baseline || baseline.id === latest.id) return null;
  const months = monthsBetween(baseline.measured_at, latest.measured_at);
  if (months <= 0) return null;
  const gain = Number(latest.height_cm) - Number(baseline.height_cm);
  return { gain, annualized: gain / months * 12, months };
}

function boolField(child, key) {
  return child?.[key] === true || child?.[key] === "true";
}

function velocityReference(months, sex, child) {
  const pubertyStarted = child ? hasPubertySigns(child) : false;
  if (months < 12) return { label: "1岁内", expected: "约20-25 cm/年", slowBelow: 18 };
  if (months < 24) return { label: "1-2岁", expected: "约10-12 cm/年", slowBelow: 9 };
  if (months < 36) return { label: "2-3岁", expected: "约7-8 cm/年", slowBelow: 6 };
  if (pubertyStarted) return { label: "青春期", expected: sex === "male" ? "男孩峰速约10-12 cm/年" : "女孩峰速约8-10 cm/年", slowBelow: 6 };
  return { label: "4岁至青春前", expected: "约5-7 cm/年", slowBelow: months < 72 ? 5 : (sex === "male" ? 4 : 4.5) };
}

function velocityStatus(report) {
  const speed = report?.v12 || report?.v6 || report?.v3;
  if (!report || !speed) return { label: "记录不足", risk: "neutral", text: "至少需要两次间隔较久的测量，才能判断生长速度。" };
  const ref = velocityReference(report.months, report.child.sex, report.child);
  const slow = speed.annualized < ref.slowBelow;
  return {
    label: slow ? "偏慢" : "可接受",
    risk: slow ? "high" : "normal",
    text: `${ref.label}参考：${ref.expected}；当前约${fmt(speed.annualized)} cm/年。`
  };
}

function hasPubertySigns(child) {
  return ["puberty_breast", "puberty_menarche", "puberty_testis", "puberty_voice", "puberty_pubic_hair"].some(key => boolField(child, key));
}

function boneAgeInfo(report) {
  const child = report?.child;
  const boneAge = Number(child?.bone_age_years);
  if (!boolField(child, "bone_age_checked") || !Number.isFinite(boneAge)) {
    return { label: "未填写", risk: "neutral", text: "未填写骨龄结果。若身高偏低、长速慢或青春期异常，可考虑拍骨龄评估剩余生长潜力。" };
  }
  const ageYears = report.months / 12;
  const diff = boneAge - ageYears;
  if (diff >= 1) return { label: `提前${fmt(diff)}岁`, risk: diff >= 2 ? "high" : "watch", text: "骨龄提前提示骨骼成熟偏快，需结合青春期、肥胖、性早熟和终身高风险评估。" };
  if (diff <= -1) return { label: `落后${fmt(Math.abs(diff))}岁`, risk: Math.abs(diff) >= 2 ? "watch" : "neutral", text: "骨龄落后可见于体质性晚长，也可见于甲状腺、生长激素或慢性疾病影响，需要结合长速判断。" };
  return { label: "接近实际年龄", risk: "normal", text: "骨龄与实际年龄接近，继续结合身高水平、生长速度和青春期节律随访。" };
}

function pubertyInfo(report) {
  const child = report?.child;
  if (!child) return { label: "暂无", risk: "neutral", text: "暂无青春期记录。" };
  const age = report.months / 12;
  const started = hasPubertySigns(child);
  const femaleEarly = child.sex === "female" && started && age < 8;
  const maleEarly = child.sex === "male" && started && age < 9;
  const femaleLate = child.sex === "female" && !boolField(child, "puberty_breast") && age >= 13;
  const maleLate = child.sex === "male" && !boolField(child, "puberty_testis") && age >= 14;
  const menarcheEarly = child.sex === "female" && boolField(child, "puberty_menarche") && age < 10;
  if (femaleEarly || maleEarly || menarcheEarly) {
    return { label: "偏早", risk: "high", text: "青春期启动偏早，短期可能长得快，但骨龄可能加速，需关注终身高风险并建议专科评估。" };
  }
  if (femaleLate || maleLate) {
    return { label: "偏晚", risk: "watch", text: "青春期启动偏晚，可见体质性晚长，也需结合骨龄、长速和内分泌评估。" };
  }
  if (started) return { label: "已启动", risk: "normal", text: "已记录青春期发育线索，建议同步关注骨龄和生长速度变化。" };
  return { label: "未见明显启动", risk: "normal", text: "暂未记录青春期发育线索，按年龄继续随访。" };
}

function lifestyleScore(child) {
  if (!child) return { score: 0, label: "暂无", tips: ["请先填写生活方式信息。"] };
  let score = 0;
  const tips = [];
  const sleep = Number(child.sleep_hours);
  if (Number.isFinite(sleep)) {
    if (sleep >= 9) score += 25;
    else if (sleep >= 8) { score += 17; tips.push("夜间睡眠略少，建议优先固定入睡时间。"); }
    else { score += 8; tips.push("夜间睡眠不足，是长高支持中的重要短板。"); }
  } else tips.push("未填写睡眠时长。");
  const exercise = Number(child.exercise_days);
  if (Number.isFinite(exercise)) {
    if (exercise >= 5) score += 20;
    else if (exercise >= 3) { score += 13; tips.push("运动频率一般，建议逐步接近每周5天以上。"); }
    else { score += 6; tips.push("运动偏少，建议增加户外活动和中高强度运动。"); }
  } else tips.push("未填写运动频率。");
  if (child.milk_protein === "good") score += 20;
  else if (child.milk_protein === "partial") { score += 12; tips.push("奶类/蛋白摄入偶尔不足，可优化早餐和晚餐蛋白。"); }
  else if (child.milk_protein === "low") { score += 4; tips.push("奶类/蛋白摄入偏少，建议先做饮食结构调整。"); }
  else tips.push("未填写奶量/蛋白摄入。");
  if (child.picky_eating === "no") score += 10;
  else if (child.picky_eating === "mild") { score += 6; tips.push("有挑食，建议记录3天饮食再做调整。"); }
  else if (child.picky_eating === "severe") { score += 2; tips.push("明显挑食会影响营养质量，建议重点干预。"); }
  const burden = [boolField(child, "constipation"), boolField(child, "rhinitis_adenoid"), boolField(child, "recurrent_infections")].filter(Boolean).length;
  score += Math.max(0, 10 - burden * 3);
  if (boolField(child, "constipation")) tips.push("便秘/大便不规律可能提示脾胃运化和饮食结构需要调整。");
  if (boolField(child, "rhinitis_adenoid")) tips.push("鼻炎、腺样体或打鼾会影响夜间睡眠质量，建议关注。");
  if (boolField(child, "recurrent_infections")) tips.push("反复感染会增加慢性炎症负担，可能影响生长节律。");
  const screen = Number(child.screen_hours);
  if (Number.isFinite(screen)) {
    if (screen <= 1) score += 15;
    else if (screen <= 2) { score += 10; tips.push("屏幕时间略多，避免挤占运动和睡眠。"); }
    else { score += 4; tips.push("屏幕时间偏多，建议优先减少睡前屏幕。"); }
  } else tips.push("未填写屏幕时间。");
  const label = score >= 80 ? "较好" : score >= 60 ? "可改善" : "短板较多";
  return { score: Math.round(score), label, tips: tips.slice(0, 5) };
}

function weightInfo(report) {
  const weight = Number(report?.latest?.weight_kg);
  if (!report || !Number.isFinite(weight)) return { label: "未填写", risk: "neutral", text: "未填写体重，无法把身高和体重一起判断。" };
  const bmi = weight / Math.pow(report.height / 100, 2);
  const age = report.months / 12;
  let low = 14;
  let high = 20;
  if (age < 3) { low = 13.5; high = 19; }
  else if (age < 7) { low = 13.5; high = 18.5; }
  else if (age < 13) { low = 14; high = 22; }
  else { low = 16; high = 24; }
  if (bmi < low) return { label: `偏低 BMI ${fmt(bmi)}`, risk: "watch", text: "身高慢且体重偏低时，要关注营养摄入、吸收不良和慢性炎症。" };
  if (bmi > high) return { label: `偏高 BMI ${fmt(bmi)}`, risk: "watch", text: "身高慢且体重偏高时，要关注内分泌、睡眠、运动不足和性早熟风险。" };
  return { label: `BMI ${fmt(bmi)}`, risk: "normal", text: "体重与身高粗略匹配。BMI仅作简易提醒，不能替代儿童BMI百分位评价。" };
}

function percentileIndex(band) {
  return ["低于 P3", "P3-P10", "P10-P25", "P25-P50", "P50-P75", "P75-P90", "P90-P97", "高于 P97"].indexOf(band);
}

function curveDropInfo(report) {
  const child = report?.child;
  const list = sortedMeasurements();
  if (!child || list.length < 2) return { dropped: false, text: "至少需要两次记录才能判断曲线是否下移。" };
  const levels = list.map(item => {
    const months = monthsBetween(child.birth_date, item.measured_at);
    const standard = interpolateStandard(child.sex, months);
    return percentileIndex(percentileLevel(Number(item.height_cm), standard).band);
  }).filter(index => index >= 0);
  if (levels.length < 2) return { dropped: false, text: "记录不足。" };
  const dropped = levels.at(-1) <= levels[0] - 2 || (levels.length >= 3 && levels.at(-1) < levels.at(-2) && levels.at(-2) < levels.at(-3));
  return { dropped, text: dropped ? "身高百分位区间出现连续或明显下移，建议专科评估。" : "暂未见明显连续下穿百分位。" };
}

function redFlags(report) {
  if (!report) return [];
  const flags = [];
  const velocity = velocityStatus(report);
  const bone = boneAgeInfo(report);
  const puberty = pubertyInfo(report);
  const lifestyle = lifestyleScore(report.child);
  const weight = weightInfo(report);
  const curve = curveDropInfo(report);
  if (report.level.risk === "high") flags.push("当前身高低于 P3。");
  if (curve.dropped) flags.push(curve.text);
  if (velocity.risk === "high") flags.push(`生长速度偏慢：${velocity.text}`);
  if (report.target && report.height < report.standard.p10 && report.target.value >= report.standard.p50) flags.push("遗传靶身高不低，但当前身高明显偏低。");
  if (bone.risk === "high") flags.push(`骨龄异常：${bone.label}。`);
  if (puberty.risk === "high") flags.push(`青春期发育${puberty.label}。`);
  if (weight.risk === "watch" && velocity.risk === "high") flags.push(`身高增长慢且体重${weight.label.includes("偏低") ? "偏低" : "偏高"}：${weight.text}`);
  if (lifestyle.score < 60) flags.push("长高支持指数偏低，生活方式短板较多。");
  return flags;
}

function currentReport() {
  const child = state.children.find(item => item.id === state.selectedChildId);
  const latest = latestMeasurement();
  if (!child || !latest) return null;
  const months = monthsBetween(child.birth_date, latest.measured_at);
  const standard = interpolateStandard(child.sex, months);
  const height = Number(latest.height_cm);
  const level = percentileLevel(height, standard);
  const target = targetHeight(child);
  const v3 = growthVelocity(3);
  const v6 = growthVelocity(6);
  const v12 = growthVelocity(12);
  const report = { child, latest, months, standard, height, level, target, v3, v6, v12 };
  report.velocity = velocityStatus(report);
  report.boneAge = boneAgeInfo(report);
  report.puberty = pubertyInfo(report);
  report.lifestyle = lifestyleScore(child);
  report.weight = weightInfo(report);
  report.curveDrop = curveDropInfo(report);
  report.redFlags = redFlags(report);
  return report;
}

async function refreshSession() {
  const { data } = await supabase.auth.getSession();
  state.user = data.session?.user || null;
  renderAuth();
  if (state.user) await loadChildren();
}

function renderAuth() {
  const logged = Boolean(state.user);
  $("authState").textContent = logged ? `已登录：${state.user.email}` : "未登录";
  $("reloadDataBtn").classList.toggle("hidden", !logged);
  $("logoutBtn").classList.toggle("hidden", !logged);
  $("authPanel").classList.toggle("hidden", logged);
  $("workspace").classList.toggle("hidden", !logged);
}

async function loadChildren() {
  const { data, error } = await supabase
    .from("children")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) {
    setMessage(`读取档案失败：${error.message}`);
    return;
  }
  state.children = data || [];
  if (!state.selectedChildId && state.children.length) state.selectedChildId = state.children[0].id;
  renderChildren();
  await loadMeasurements();
}

async function loadMeasurements() {
  if (!state.selectedChildId) {
    state.measurements = [];
    renderAll();
    return;
  }
  const { data, error } = await supabase
    .from("measurements")
    .select("*")
    .eq("child_id", state.selectedChildId)
    .order("measured_at", { ascending: true });
  if (error) {
    setMessage(`读取测量记录失败：${error.message}`);
    return;
  }
  state.measurements = data || [];
  renderAll();
}

function renderChildren() {
  const wrap = $("childrenList");
  if (!state.children.length) {
    wrap.innerHTML = `<p class="muted">还没有孩子档案，请先添加。</p>`;
    return;
  }
  wrap.innerHTML = state.children.map(child => `
    <button class="child-item ${child.id === state.selectedChildId ? "active" : ""}" data-child-id="${child.id}" type="button">
      <strong>${child.nickname}</strong>
      <span>${child.sex === "male" ? "男孩" : "女孩"} · ${child.birth_date}</span>
    </button>
  `).join("");
}

function fillChildForm() {
  const child = state.children.find(item => item.id === state.selectedChildId);
  $("childId").value = child?.id || "";
  $("nickname").value = child?.nickname || "";
  $("sex").value = child?.sex || "male";
  $("birthDate").value = child?.birth_date || "";
  $("fatherHeight").value = child?.father_height || "";
  $("motherHeight").value = child?.mother_height || "";
  $("boneAgeChecked").value = boolField(child, "bone_age_checked") ? "true" : "false";
  $("boneAgeYears").value = child?.bone_age_years || "";
  $("pubertyBreast").checked = boolField(child, "puberty_breast");
  $("pubertyMenarche").checked = boolField(child, "puberty_menarche");
  $("pubertyTestis").checked = boolField(child, "puberty_testis");
  $("pubertyVoice").checked = boolField(child, "puberty_voice");
  $("pubertyPubicHair").checked = boolField(child, "puberty_pubic_hair");
  $("sleepHours").value = child?.sleep_hours || "";
  $("exerciseDays").value = child?.exercise_days ?? "";
  $("milkProtein").value = child?.milk_protein || "";
  $("pickyEating").value = child?.picky_eating || "";
  $("constipation").checked = boolField(child, "constipation");
  $("rhinitisAdenoid").checked = boolField(child, "rhinitis_adenoid");
  $("recurrentInfections").checked = boolField(child, "recurrent_infections");
  $("screenHours").value = child?.screen_hours || "";
  $("measuredAt").value = today();
}

function renderSummary(report) {
  if (!report) {
    $("summaryCards").innerHTML = `<div class="summary-card"><span>提示</span><strong>请先添加档案和身高记录</strong><small>保存后自动生成曲线和建议。</small></div>`;
    return;
  }
  const targetText = report.target ? `${fmt(report.target.value)} cm` : "待填写";
  const speed = report.v12 || report.v6 || report.v3;
  const redFlagText = report.redFlags.length ? `${report.redFlags.length}项` : "暂无";
  $("summaryCards").innerHTML = `
    <div class="summary-card"><span>当前年龄</span><strong>${ageLabel(report.months)}</strong><small>${report.latest.measured_at}</small></div>
    <div class="summary-card"><span>当前身高</span><strong>${fmt(report.height)} cm</strong><small>${report.level.band}，接近 ${report.level.label}</small></div>
    <div class="summary-card"><span>遗传靶身高</span><strong>${targetText}</strong><small>${report.target ? `${fmt(report.target.low)}-${fmt(report.target.high)} cm` : "填写父母身高后计算"}</small></div>
    <div class="summary-card"><span>年化生长速度</span><strong>${speed ? `${fmt(speed.annualized)} cm/年` : "暂无"}</strong><small>${speed ? `近 ${fmt(speed.months)} 月增长 ${fmt(speed.gain)} cm` : "至少需要两次记录"}</small></div>
    <div class="summary-card ${report.redFlags.length ? "warning" : ""}"><span>红旗提示</span><strong>${redFlagText}</strong><small>${report.redFlags.length ? "建议专科评估" : "继续规律随访"}</small></div>
    <div class="summary-card"><span>骨龄</span><strong>${report.boneAge.label}</strong><small>${report.boneAge.text}</small></div>
    <div class="summary-card"><span>青春期</span><strong>${report.puberty.label}</strong><small>${report.puberty.text}</small></div>
    <div class="summary-card"><span>长高支持指数</span><strong>${report.lifestyle.score}分</strong><small>${report.lifestyle.label}；${report.weight.label}</small></div>
  `;
}

function renderAdvice(report) {
  if (!report) {
    $("adviceBox").innerHTML = "";
    return;
  }
  const items = [];
  if (report.redFlags.length) {
    items.push(["warning", `红旗提示：${report.redFlags.join(" ")} 建议专科评估，重点结合骨龄、青春期、甲状腺、IGF-1、慢性炎症和营养吸收情况。`]);
  }
  if (report.level.risk === "high") {
    items.push(["warning", "当前身高低于 P3，建议尽早到专科评估，结合出生史、营养、睡眠、慢性疾病、骨龄和内分泌情况综合判断。"]);
  } else if (report.level.risk === "watch") {
    items.push(["warning", "当前身高处于偏低或中下区间，建议 3 个月复测一次，关注曲线是否继续下移。"]);
  } else {
    items.push(["normal", "当前身高在常见参考范围内，建议保持规律睡眠、足量运动、均衡营养，并持续记录趋势。"]);
  }
  const speed = report.v12 || report.v6 || report.v3;
  if (report.velocity.risk === "high") {
    items.push(["warning", `分年龄生长速度判断：${report.velocity.text} 若连续偏慢，建议进一步评估骨龄、甲状腺、维生素D、慢性炎症或青春发育情况。`]);
  } else if (speed) {
    items.push(["normal", `分年龄生长速度判断：${report.velocity.text}`]);
  }
  if (report.target && report.height < report.standard.p10 && report.target.value >= report.standard.p50) {
    items.push(["warning", "遗传靶身高不低，但当前身高偏低，建议重点关注骨龄、青春期启动时间、睡眠和长期鼻炎腺样体等影响因素。"]);
  }
  items.push([report.boneAge.risk === "high" ? "warning" : "normal", `骨龄提示：${report.boneAge.text}`]);
  items.push([report.puberty.risk === "high" ? "warning" : "normal", `青春期提示：${report.puberty.text}`]);
  items.push([report.weight.risk === "watch" ? "warning" : "normal", `体重一起看：${report.weight.text}`]);
  if (report.lifestyle.tips.length) {
    items.push([report.lifestyle.score < 60 ? "warning" : "normal", `生活方式建议：${report.lifestyle.tips.join(" ")}`]);
  }
  items.push(["normal", "复测提醒：建议固定同一时间、同一身高尺、脱鞋测量。下一次复测可安排在 3 个月后。"]);
  $("adviceBox").innerHTML = items.map(([tone, text]) => `<div class="advice-item ${tone === "warning" ? "warning" : ""}">${text}</div>`).join("");
}

function chartScale(report) {
  const child = report?.child;
  const latestMonths = report?.months;
  const segment = chartSegment(latestMonths);
  const standards = child ? standardsForSegment(child.sex, segment) : standardsForSegment("male", segment);
  const allPoints = sortedMeasurements().map(m => ({
    month: child ? monthsBetween(child.birth_date, m.measured_at) : 0,
    height: Number(m.height_cm)
  }));
  const points = allPoints.filter(point => point.month >= segment.xMin && point.month <= segment.xMax);
  const xs = [...standards.map(s => s.month), ...points.map(p => p.month), segment.xMin, segment.xMax];
  const ys = [...standards.flatMap(s => percentileKeys.map(([key]) => s[key])), ...points.map(p => p.height)];
  const yMin = ys.length ? Math.floor((Math.min(...ys) - 3) / 5) * 5 : 45;
  const yMax = ys.length ? Math.ceil((Math.max(...ys) + 3) / 5) * 5 : 185;
  return {
    xMin: segment.xMin,
    xMax: segment.xMax,
    yMin,
    yMax,
    standards,
    points,
    segment
  };
}

function drawChart(report) {
  const canvas = $("growthChart");
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);

  const pad = { l: 58, r: 24, t: 28, b: 48 };
  const scale = chartScale(report);
  const x = m => pad.l + (m - scale.xMin) / (scale.xMax - scale.xMin) * (w - pad.l - pad.r);
  const y = cm => h - pad.b - (cm - scale.yMin) / (scale.yMax - scale.yMin) * (h - pad.t - pad.b);

  ctx.fillStyle = "#3f5f61";
  ctx.font = "15px Microsoft YaHei, sans-serif";
  ctx.fillText(scale.segment.label, pad.l, 20);

  ctx.strokeStyle = "#eee6dc";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#716a60";
  ctx.font = "14px Microsoft YaHei, sans-serif";
  for (let age = scale.segment.tickStart; age <= scale.segment.tickEnd; age += scale.segment.tickStep) {
    const px = x(age * 12);
    ctx.beginPath();
    ctx.moveTo(px, pad.t);
    ctx.lineTo(px, h - pad.b);
    ctx.stroke();
    ctx.fillText(`${age}岁`, px - 13, h - 18);
  }
  for (let cm = scale.yMin; cm <= scale.yMax; cm += 5) {
    const py = y(cm);
    ctx.beginPath();
    ctx.moveTo(pad.l, py);
    ctx.lineTo(w - pad.r, py);
    ctx.stroke();
    ctx.fillText(`${fmt(cm)}cm`, 12, py + 4);
  }

  percentileKeys.forEach(([key, label, color]) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = key === "p50" ? 3 : 1.6;
    ctx.beginPath();
    scale.standards.forEach((row, index) => {
      const px = x(row.month);
      const py = y(row[key]);
      if (index === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();
    const last = scale.standards.at(-1);
    ctx.fillStyle = color;
    ctx.fillText(label, x(last.month) - 30, y(last[key]) - 4);
  });

  if (scale.points.length) {
    ctx.strokeStyle = "#111";
    ctx.fillStyle = "#111";
    ctx.lineWidth = 3;
    ctx.beginPath();
    scale.points.forEach((point, index) => {
      const px = x(point.month);
      const py = y(point.height);
      if (index === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();
    scale.points.forEach(point => {
      ctx.beginPath();
      ctx.arc(x(point.month), y(point.height), 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "13px Microsoft YaHei, sans-serif";
      ctx.fillText(`${fmt(point.height)}cm`, x(point.month) + 8, y(point.height) - 8);
    });
  }
}

function renderRecords(report) {
  const list = sortedMeasurements();
  if (!list.length) {
    $("measurementsTable").innerHTML = `<p class="muted">暂无测量记录。</p>`;
    return;
  }
  const child = report?.child || state.children.find(item => item.id === state.selectedChildId);
  $("measurementsTable").innerHTML = `
    <table>
      <thead><tr><th>日期</th><th>年龄</th><th>身高</th><th>体重</th><th>水平</th><th>备注</th><th></th></tr></thead>
      <tbody>
        ${list.map(item => {
          const months = child ? monthsBetween(child.birth_date, item.measured_at) : 0;
          const standard = child ? interpolateStandard(child.sex, months) : null;
          const level = percentileLevel(Number(item.height_cm), standard);
          return `<tr>
            <td>${item.measured_at}</td>
            <td>${ageLabel(months)}</td>
            <td>${fmt(Number(item.height_cm))} cm</td>
            <td>${item.weight_kg ? `${fmt(Number(item.weight_kg))} kg` : "未填"}</td>
            <td>${level.band}</td>
            <td>${item.note || ""}</td>
            <td><button class="button subtle" data-delete-measurement="${item.id}" type="button">删除</button></td>
          </tr>`;
        }).join("")}
      </tbody>
    </table>
  `;
}

function renderAll() {
  fillChildForm();
  const report = currentReport();
  state.lastReport = report;
  renderSummary(report);
  renderAdvice(report);
  renderRecords(report);
  drawChart(report);
}

function checkboxValue(id) {
  return $(id).checked;
}

async function saveChild(event) {
  event.preventDefault();
  const payload = {
    user_id: state.user.id,
    nickname: $("nickname").value.trim(),
    sex: $("sex").value,
    birth_date: $("birthDate").value,
    father_height: $("fatherHeight").value || null,
    mother_height: $("motherHeight").value || null,
    bone_age_checked: $("boneAgeChecked").value === "true",
    bone_age_years: $("boneAgeYears").value || null,
    puberty_breast: checkboxValue("pubertyBreast"),
    puberty_menarche: checkboxValue("pubertyMenarche"),
    puberty_testis: checkboxValue("pubertyTestis"),
    puberty_voice: checkboxValue("pubertyVoice"),
    puberty_pubic_hair: checkboxValue("pubertyPubicHair"),
    sleep_hours: $("sleepHours").value || null,
    exercise_days: $("exerciseDays").value || null,
    milk_protein: $("milkProtein").value || null,
    picky_eating: $("pickyEating").value || null,
    constipation: checkboxValue("constipation"),
    rhinitis_adenoid: checkboxValue("rhinitisAdenoid"),
    recurrent_infections: checkboxValue("recurrentInfections"),
    screen_hours: $("screenHours").value || null
  };
  const id = $("childId").value;
  const query = id
    ? supabase.from("children").update(payload).eq("id", id).select().single()
    : supabase.from("children").insert(payload).select().single();
  const { data, error } = await query;
  if (error) {
    console.error("save child failed", error);
    return setMessage(`保存档案失败：${error.message}`);
  }
  if (!data?.id) return setMessage("保存档案没有返回数据库记录，请检查 Supabase 表权限或 RLS 策略。");
  state.selectedChildId = data.id;
  await loadChildren();
  setMessage(`档案已保存，数据库记录 ID：${data.id}`, "ok");
}

async function saveMeasurement(event) {
  event.preventDefault();
  if (!state.selectedChildId) return setMessage("请先选择或创建孩子档案。");
  const payload = {
    user_id: state.user.id,
    child_id: state.selectedChildId,
    measured_at: $("measuredAt").value,
    height_cm: $("heightCm").value,
    weight_kg: $("weightKg").value || null,
    note: $("note").value.trim() || null
  };
  const { data, error } = await supabase.from("measurements").insert(payload).select().single();
  if (error) {
    console.error("save measurement failed", error);
    return setMessage(`保存测量失败：${error.message}`);
  }
  if (!data?.id) return setMessage("保存测量没有返回数据库记录，请检查 Supabase 表权限或 RLS 策略。");
  $("heightCm").value = "";
  $("weightKg").value = "";
  $("note").value = "";
  await loadMeasurements();
  setMessage(`测量记录已保存，数据库记录 ID：${data.id}`, "ok");
}

async function deleteMeasurement(id) {
  const { error } = await supabase.from("measurements").delete().eq("id", id);
  if (error) return setMessage(`删除失败：${error.message}`);
  await loadMeasurements();
}

function reminderText() {
  const report = state.lastReport;
  const child = report?.child;
  const latest = report?.latest;
  if (!child || !latest) return "请先添加孩子档案和测量记录。";
  const next = new Date(latest.measured_at);
  next.setMonth(next.getMonth() + 3);
  return `${child.nickname} 身高复测提醒：上次测量 ${latest.measured_at}，身高 ${fmt(Number(latest.height_cm))} cm。建议 ${next.toISOString().slice(0, 10)} 左右复测，固定同一时间、同一身高尺、脱鞋测量。`;
}

async function copyReminder() {
  const text = reminderText();
  await navigator.clipboard.writeText(text);
  setMessage("复测提醒文案已复制。", "ok");
}

function downloadReport() {
  const report = state.lastReport;
  if (!report) return setMessage("请先添加孩子档案和测量记录。");
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1900;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fffdf8";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#174d4b";
  ctx.font = "bold 54px Microsoft YaHei, sans-serif";
  ctx.fillText("儿童身高评估报告", 70, 110);
  ctx.fillStyle = "#25231f";
  ctx.font = "34px Microsoft YaHei, sans-serif";
  const speedText = [
    `近3月：${report.v3 ? `${fmt(report.v3.annualized)} cm/年` : "记录不足"}`,
    `近6月：${report.v6 ? `${fmt(report.v6.annualized)} cm/年` : "记录不足"}`,
    `近12月：${report.v12 ? `${fmt(report.v12.annualized)} cm/年` : "记录不足"}`
  ].join("    ");
  const evaluationText = report.redFlags.length ? "建议骨龄/内分泌等专科评估" : "暂无强红旗，建议规律复测";
  const lifestyleText = report.lifestyle.tips.length ? report.lifestyle.tips.slice(0, 3).join(" ") : "继续保持规律睡眠、运动和均衡饮食。";
  const lines = [
    `姓名：${report.child.nickname}    性别：${report.child.sex === "male" ? "男孩" : "女孩"}`,
    `年龄：${ageLabel(report.months)}    测量日期：${report.latest.measured_at}`,
    `当前身高：${fmt(report.height)} cm    水平：${report.level.band}，接近 ${report.level.label}`,
    `遗传靶身高：${report.target ? `${fmt(report.target.value)} cm（${fmt(report.target.low)}-${fmt(report.target.high)} cm）` : "未填写父母身高"}`,
    `计算依据：${report.target ? report.target.formula : "填写父母身高后自动计算"}`,
    `生长速度：${speedText}`,
    `骨龄：${report.boneAge.label}    青春期：${report.puberty.label}`,
    `体重：${report.weight.label}    长高支持指数：${report.lifestyle.score}分（${report.lifestyle.label}）`,
    `评估建议：${evaluationText}`
  ];
  lines.forEach((line, index) => ctx.fillText(line, 70, 190 + index * 52));
  ctx.drawImage($("growthChart"), 70, 690, 940, 500);
  ctx.fillStyle = "#716a60";
  ctx.font = "30px Microsoft YaHei, sans-serif";
  wrapText(ctx, `红旗提示：${report.redFlags.length ? report.redFlags.join(" ") : "暂无。"} 生活方式建议：${lifestyleText}`, 70, 1250, 930, 44);
  wrapText(ctx, $("adviceBox").innerText || "建议持续记录身高趋势。", 70, 1430, 930, 42);
  ctx.font = "24px Microsoft YaHei, sans-serif";
  ctx.fillText("本报告仅供学习与就医沟通参考，不能替代医生诊断。", 70, 1830);
  const link = document.createElement("a");
  link.download = `${report.child.nickname}-身高评估报告.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const chars = text.replace(/\s+/g, " ").split("");
  let line = "";
  chars.forEach(ch => {
    const test = line + ch;
    if (ctx.measureText(test).width > maxWidth) {
      ctx.fillText(line, x, y);
      line = ch;
      y += lineHeight;
    } else {
      line = test;
    }
  });
  if (line) ctx.fillText(line, x, y);
}

function bindEvents() {
  $("authForm").addEventListener("submit", async event => {
    event.preventDefault();
    const mode = event.submitter.value;
    const email = $("email").value.trim();
    const password = $("password").value;
    const fn = mode === "signup" ? supabase.auth.signUp : supabase.auth.signInWithPassword;
    const { error } = await fn.call(supabase.auth, { email, password });
    if (error) return setMessage(error.message);
    setMessage(mode === "signup" ? "注册成功。若开启邮箱确认，请先查收邮件。" : "登录成功。", "ok");
    await refreshSession();
  });
  $("resetPasswordBtn").addEventListener("click", async () => {
    const email = $("email").value.trim();
    if (!email) return setMessage("请先填写邮箱。");
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: location.href });
    setMessage(error ? error.message : "找回密码邮件已发送。", error ? "warn" : "ok");
  });
  $("logoutBtn").addEventListener("click", async () => {
    await supabase.auth.signOut();
    state.user = null;
    state.children = [];
    state.measurements = [];
    state.selectedChildId = null;
    renderAuth();
  });
  $("reloadDataBtn").addEventListener("click", async () => {
    setMessage("正在重新读取 Supabase 数据...", "ok");
    await loadChildren();
    setMessage("已重新读取数据。", "ok");
  });
  $("childForm").addEventListener("submit", saveChild);
  $("measurementForm").addEventListener("submit", saveMeasurement);
  $("childrenList").addEventListener("click", async event => {
    const button = event.target.closest("[data-child-id]");
    if (!button) return;
    state.selectedChildId = button.dataset.childId;
    renderChildren();
    await loadMeasurements();
  });
  $("measurementsTable").addEventListener("click", event => {
    const button = event.target.closest("[data-delete-measurement]");
    if (button) deleteMeasurement(button.dataset.deleteMeasurement);
  });
  $("copyReminderBtn").addEventListener("click", copyReminder);
  $("downloadReportBtn").addEventListener("click", downloadReport);
}

async function init() {
  $("measuredAt").value = today();
  bindEvents();
  await loadStandards();
  await refreshSession();
  if (!state.user) drawChart(null);
}

init().catch(error => setMessage(error.message));
