(function () {
  const SUPABASE_URL = "https://frugibobukmwcawwrtho.supabase.co";
  const SUPABASE_KEY = "sb_publishable_BLVRdzvA_ROqJf4XFANumw_tX7webdl";

  const recordsList = document.getElementById("recordsList");
  const recordStatus = document.getElementById("recordStatus");
  const refreshRecordsBtn = document.getElementById("refreshRecordsBtn");
  const exportCsvBtn = document.getElementById("exportCsvBtn");
  const limitSelect = document.getElementById("limitSelect");
  let currentRows = [];

  function formatTime(value) {
    return new Date(value).toLocaleString("zh-CN", { hour12: false });
  }

  function scoreText(scores = {}) {
    return Object.entries(scores)
      .map(([key, score]) => `${APP_DATA.syndromes[key]?.name || key}${score}`)
      .join("；");
  }

  function symptomText(symptoms = []) {
    return symptoms
      .map(item => `${item.question}：${(item.selected || []).join("、")}`)
      .join("\n");
  }

  function medicineText(medicines = []) {
    return medicines.length ? medicines.join("、") : "无";
  }

  function renderRows(rows) {
    if (!rows.length) {
      recordsList.innerHTML = `<p class="muted">暂无记录。</p>`;
      return;
    }
    recordsList.innerHTML = rows.map(row => `
      <article class="record-card">
        <header>
          <strong>${formatTime(row.created_at)}</strong>
          <span>#${row.id}</span>
        </header>
        <p><strong>辨证结论：</strong>${row.diagnosis}</p>
        <p><strong>推荐药物：</strong>${medicineText(row.medicines)}</p>
        <p><strong>六经分数：</strong>${scoreText(row.scores)}</p>
        <details>
          <summary>查看症状选择</summary>
          <pre>${symptomText(row.symptoms)}</pre>
        </details>
      </article>
    `).join("");
  }

  async function loadRecords() {
    const limit = Number(limitSelect.value || 100);
    recordStatus.textContent = "正在读取 Supabase 数据。";
    recordsList.innerHTML = "";
    try {
      const url = `${SUPABASE_URL}/rest/v1/consult_records?select=*&order=created_at.desc&limit=${limit}`;
      const response = await fetch(url, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      });
      if (!response.ok) throw new Error(await response.text());
      currentRows = await response.json();
      recordStatus.textContent = `已读取 ${currentRows.length} 条记录。`;
      renderRows(currentRows);
    } catch (error) {
      currentRows = [];
      recordStatus.textContent = "读取失败。当前 RLS 可能没有开放 SELECT 权限。";
      recordsList.innerHTML = `
        <div class="notice danger">
          <strong>无法查询数据</strong>
          <p>请确认 Supabase 的 consult_records 表已设置安全的 SELECT 策略。你目前给出的 SQL 只允许匿名 insert，前端页面不能读取。</p>
          <p>不建议直接开放 anon 全表 select 到公网；更安全的做法是使用 Supabase 登录账号后，只给你的账号读取权限。</p>
        </div>
      `;
      console.warn("读取问诊记录失败", error);
    }
  }

  function csvEscape(value) {
    return `"${String(value ?? "").replace(/"/g, '""')}"`;
  }

  function exportCsv() {
    if (!currentRows.length) return;
    const header = ["id", "created_at", "diagnosis", "medicines", "scores", "symptoms"];
    const lines = [
      header.join(","),
      ...currentRows.map(row => [
        row.id,
        formatTime(row.created_at),
        row.diagnosis,
        medicineText(row.medicines),
        scoreText(row.scores),
        symptomText(row.symptoms)
      ].map(csvEscape).join(","))
    ];
    const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `发热咳嗽问诊记录-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  refreshRecordsBtn.addEventListener("click", loadRecords);
  limitSelect.addEventListener("change", loadRecords);
  exportCsvBtn.addEventListener("click", exportCsv);
  loadRecords();
})();
