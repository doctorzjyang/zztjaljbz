(function () {
  const matrix = document.getElementById("medicineMatrix");
  const syndromeOrder = ["taiyang", "shaoyang", "yangming", "taiyin", "shaoyin", "jueyin"];
  const strokeSorter = new Intl.Collator("zh-Hans-u-co-stroke", { sensitivity: "base" });

  function allMedicines() {
    const map = new Map();
    [...APP_DATA.feverMedicines, ...APP_DATA.coughMedicines].forEach(med => {
      if (!map.has(med.name)) map.set(med.name, med);
    });
    return [...map.values()];
  }

  function syndromeNames(med) {
    return med.syndromes.map(key => APP_DATA.syndromes[key]?.name || key).join(" / ");
  }

  function renderIngredients(med) {
    return med.ingredients.map(name => {
      const effect = APP_DATA.ingredientEffects[name] || "需结合方中配伍理解其作用。";
      return `<li><strong>${name}</strong><span>${effect}</span></li>`;
    }).join("");
  }

  function medicineCard(med) {
    return `
      <article class="medicine-card">
        <div class="medicine-title-row">
          <h3>${med.name}</h3>
          <span>${syndromeNames(med)}</span>
        </div>
        <p><strong>功效/适用方向：</strong>${med.suitable}</p>
        <p><strong>组成：</strong>${med.ingredients.join("、")}</p>
        <details>
          <summary>查看成分说明</summary>
          <ul class="ingredient-list">${renderIngredients(med)}</ul>
        </details>
        <p class="caution"><strong>注意：</strong>${med.caution}</p>
      </article>
    `;
  }

  function render() {
    const meds = allMedicines();
    matrix.innerHTML = syndromeOrder.map(key => {
      const syndrome = APP_DATA.syndromes[key];
      const group = meds
        .filter(med => med.syndromes.includes(key))
        .sort((a, b) => strokeSorter.compare(a.name, b.name));
      return `
        <section class="panel medicine-section">
          <div class="panel-head">
            <p class="eyebrow">${syndrome.position}</p>
            <h2>${syndrome.name}</h2>
            <p class="muted">${syndrome.direction}</p>
          </div>
          ${group.length
            ? `<div class="medicine-list">${group.map(medicineCard).join("")}</div>`
            : `<p class="muted">当前药品库暂无此经药物。少阴、厥阴线索通常建议医生辨证，不在网页中推荐自行用药。</p>`
          }
        </section>
      `;
    }).join("");
  }

  render();
})();
