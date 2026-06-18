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
  $("authMessage").textContent = text || "";
  $("authMessage").style.color = tone === "ok" ? "#1f6865" : "#a94831";
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

function interpolateStandard(sex, months) {
  const data = state.standards[sex] || [];
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
  return { child, latest, months, standard, height, level, target, v3, v6, v12 };
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
  $("measuredAt").value = today();
}

function renderSummary(report) {
  if (!report) {
    $("summaryCards").innerHTML = `<div class="summary-card"><span>提示</span><strong>请先添加档案和身高记录</strong><small>保存后自动生成曲线和建议。</small></div>`;
    return;
  }
  const targetText = report.target ? `${fmt(report.target.value)} cm` : "待填写";
  const speed = report.v12 || report.v6 || report.v3;
  $("summaryCards").innerHTML = `
    <div class="summary-card"><span>当前年龄</span><strong>${ageLabel(report.months)}</strong><small>${report.latest.measured_at}</small></div>
    <div class="summary-card"><span>当前身高</span><strong>${fmt(report.height)} cm</strong><small>${report.level.band}，接近 ${report.level.label}</small></div>
    <div class="summary-card"><span>遗传靶身高</span><strong>${targetText}</strong><small>${report.target ? `${fmt(report.target.low)}-${fmt(report.target.high)} cm` : "填写父母身高后计算"}</small></div>
    <div class="summary-card"><span>年化生长速度</span><strong>${speed ? `${fmt(speed.annualized)} cm/年` : "暂无"}</strong><small>${speed ? `近 ${fmt(speed.months)} 月增长 ${fmt(speed.gain)} cm` : "至少需要两次记录"}</small></div>
  `;
}

function renderAdvice(report) {
  if (!report) {
    $("adviceBox").innerHTML = "";
    return;
  }
  const items = [];
  if (report.level.risk === "high") {
    items.push(["warning", "当前身高低于 P3，建议尽早到专科评估，结合出生史、营养、睡眠、慢性疾病、骨龄和内分泌情况综合判断。"]);
  } else if (report.level.risk === "watch") {
    items.push(["warning", "当前身高处于偏低或中下区间，建议 3 个月复测一次，关注曲线是否继续下移。"]);
  } else {
    items.push(["normal", "当前身高在常见参考范围内，建议保持规律睡眠、足量运动、均衡营养，并持续记录趋势。"]);
  }
  const speed = report.v12 || report.v6;
  if (speed && speed.annualized < 4.5 && report.months > 36) {
    items.push(["warning", "近阶段年化生长速度偏慢，若持续不足，建议进一步评估骨龄、甲状腺、维生素D、慢性炎症或青春发育情况。"]);
  }
  if (report.target && report.height < report.standard.p10 && report.target.value >= report.standard.p50) {
    items.push(["warning", "遗传靶身高不低，但当前身高偏低，建议重点关注骨龄、青春期启动时间、睡眠和长期鼻炎腺样体等影响因素。"]);
  }
  items.push(["normal", "复测提醒：建议固定同一时间、同一身高尺、脱鞋测量。下一次复测可安排在 3 个月后。"]);
  $("adviceBox").innerHTML = items.map(([tone, text]) => `<div class="advice-item ${tone === "warning" ? "warning" : ""}">${text}</div>`).join("");
}

function chartScale(report) {
  const child = report?.child;
  const standards = child ? state.standards[child.sex] : state.standards.male;
  const points = sortedMeasurements().map(m => ({
    month: child ? monthsBetween(child.birth_date, m.measured_at) : 0,
    height: Number(m.height_cm)
  }));
  const xs = [...standards.map(s => s.month), ...points.map(p => p.month)];
  const ys = [...standards.flatMap(s => percentileKeys.map(([key]) => s[key])), ...points.map(p => p.height)];
  return {
    xMin: Math.max(0, Math.min(...xs, 0)),
    xMax: Math.min(216, Math.max(...xs, 216)),
    yMin: Math.floor(Math.min(...ys, 45) / 5) * 5,
    yMax: Math.ceil(Math.max(...ys, 185) / 5) * 5,
    standards,
    points
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

  ctx.strokeStyle = "#eee6dc";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#716a60";
  ctx.font = "14px Microsoft YaHei, sans-serif";
  for (let age = 0; age <= 18; age += 2) {
    const px = x(age * 12);
    ctx.beginPath();
    ctx.moveTo(px, pad.t);
    ctx.lineTo(px, h - pad.b);
    ctx.stroke();
    ctx.fillText(`${age}岁`, px - 13, h - 18);
  }
  for (let cm = scale.yMin; cm <= scale.yMax; cm += 10) {
    const py = y(cm);
    ctx.beginPath();
    ctx.moveTo(pad.l, py);
    ctx.lineTo(w - pad.r, py);
    ctx.stroke();
    ctx.fillText(`${cm}`, 18, py + 4);
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

async function saveChild(event) {
  event.preventDefault();
  const payload = {
    user_id: state.user.id,
    nickname: $("nickname").value.trim(),
    sex: $("sex").value,
    birth_date: $("birthDate").value,
    father_height: $("fatherHeight").value || null,
    mother_height: $("motherHeight").value || null
  };
  const id = $("childId").value;
  const query = id
    ? supabase.from("children").update(payload).eq("id", id)
    : supabase.from("children").insert(payload).select().single();
  const { data, error } = await query;
  if (error) return setMessage(`保存档案失败：${error.message}`);
  if (!id && data) state.selectedChildId = data.id;
  await loadChildren();
  setMessage("档案已保存。", "ok");
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
  const { error } = await supabase.from("measurements").insert(payload);
  if (error) return setMessage(`保存测量失败：${error.message}`);
  $("heightCm").value = "";
  $("weightKg").value = "";
  $("note").value = "";
  await loadMeasurements();
  setMessage("测量记录已保存。", "ok");
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
  canvas.height = 1600;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fffdf8";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#174d4b";
  ctx.font = "bold 54px Microsoft YaHei, sans-serif";
  ctx.fillText("儿童身高评估报告", 70, 110);
  ctx.fillStyle = "#25231f";
  ctx.font = "34px Microsoft YaHei, sans-serif";
  const lines = [
    `姓名：${report.child.nickname}    性别：${report.child.sex === "male" ? "男孩" : "女孩"}`,
    `年龄：${ageLabel(report.months)}    测量日期：${report.latest.measured_at}`,
    `当前身高：${fmt(report.height)} cm    水平：${report.level.band}，接近 ${report.level.label}`,
    `遗传靶身高：${report.target ? `${fmt(report.target.value)} cm（${fmt(report.target.low)}-${fmt(report.target.high)} cm）` : "未填写父母身高"}`,
    `计算依据：${report.target ? report.target.formula : "填写父母身高后自动计算"}`,
    `生长速度：${report.v12 ? `${fmt(report.v12.annualized)} cm/年` : report.v6 ? `${fmt(report.v6.annualized)} cm/年` : "记录不足"}`
  ];
  lines.forEach((line, index) => ctx.fillText(line, 70, 190 + index * 56));
  ctx.drawImage($("growthChart"), 70, 560, 940, 500);
  ctx.fillStyle = "#716a60";
  ctx.font = "30px Microsoft YaHei, sans-serif";
  wrapText(ctx, $("adviceBox").innerText || "建议持续记录身高趋势。", 70, 1110, 930, 44);
  ctx.font = "24px Microsoft YaHei, sans-serif";
  ctx.fillText("本报告仅供学习与就医沟通参考，不能替代医生诊断。", 70, 1530);
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
