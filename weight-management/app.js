(() => {
  'use strict';
  const plans = window.WEIGHT_PLANS;
  const weekdays = ['周一','周二','周三','周四','周五','周六','周日'];
  const mealNames = ['早餐','午餐','晚餐'];
  const energy = window.WEIGHT_ENERGY;
  const key = 'doctor-yang-weight-v1';
  const $ = id => document.getElementById(id);
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
  const dateValid = value => /^\d{4}-\d{2}-\d{2}$/.test(value) && !isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value && value <= today() && value >= '1900-01-01';
  let records = [];
  let planIndex = 0;
  let dayIndex = (new Date().getDay()+6)%7;
  let editingDate = null;
  let storageWarning = '';
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.some(r => !r || !dateValid(r.date) || typeof r.weight !== 'number' || r.weight < 20 || r.weight > 400)) throw new Error('Invalid records');
      records = [...new Map(parsed.map(r=>[r.date,{date:r.date,weight:r.weight}])).values()];
    }
  } catch (_) { storageWarning = '暂时无法读取本地记录，可能是浏览器限制或数据格式异常。新记录保存失败时会提示，请勿依赖未保存的数据。'; }
  function ingredientDetails(items) {
    return items.map(item=>`<li>${item.name} ${item.weight}${item.unit} × ${item.per100}÷100＝${item.kcal.toFixed(1)}千卡</li>`).join('');
  }
  function dailyEquation(day) {
    return `${day.meals.map((meal,i)=>`${mealNames[i]} ${meal.kcal}`).join(' ＋ ')} ＋ 加餐 ${day.extraKcal} ＝ ${day.total}千卡`;
  }
  function renderEnergy(plan,visibleDays) {
    const days=energy.days[plan.id];
    const sum=days.reduce((total,d)=>total+d.total,0);
    $('dailyEnergy').innerHTML=visibleDays.map(i=>`<p><strong>${weekdays[i]}合计约 ${days[i].total} 千卡</strong></p><p>${dailyEquation(days[i])}</p><p class="note">加餐：${days[i].extras.map(item=>`${item.name} ${item.weight}${item.unit}（约${Math.round(item.kcal)}千卡）`).join('；')}。${plan.id==='noodle'&&i===4?'本日早餐为豆浆，另补的牛奶已计入加餐。':'牛奶已计入早餐。'}</p>`).join('');
    $('energyCaption').textContent=`${plan.name} · 七日能量估算`;
    $('energyRows').innerHTML=days.map((d,i)=>`<tr><th scope="row">${weekdays[i]}</th>${d.meals.map(m=>`<td>${m.kcal}</td>`).join('')}<td>${d.extraKcal}</td><td><strong>${d.total}</strong></td></tr>`).join('');
    const totals=[0,1,2].map(i=>days.reduce((s,d)=>s+d.meals[i].kcal,0));
    const extras=days.reduce((s,d)=>s+d.extraKcal,0);
    $('energyFooter').innerHTML=`<tr><th scope="row">七天合计</th>${totals.map(n=>`<td>${n}</td>`).join('')}<td>${extras}</td><td>${sum}</td></tr><tr><th scope="row">每天平均</th><td colspan="4">${sum} ÷ 7</td><td>约${Math.round(sum/7)}</td></tr>`;
    $('weekEquation').textContent=`七天相加：${days.map(d=>d.total).join(' ＋ ')} ＝ ${sum}千卡；日均约 ${Math.round(sum/7)}千卡。`;
  }
  function renderMenus() {
    const plan = plans[planIndex];
    $('plans').innerHTML = plans.map((p,i)=>`<button type="button" data-plan="${i}" aria-pressed="${i===planIndex}"><strong>${p.name}</strong><small>${p.subtitle}</small></button>`).join('');
    $('days').innerHTML = weekdays.map((d,i)=>`<button type="button" data-day="${i}" aria-pressed="${i===dayIndex}" ${$('fullWeek').checked?'disabled':''}>${d}</button>`).join('');
    $('planTip').textContent = plan.tip;
    const days = $('fullWeek').checked ? [0,1,2,3,4,5,6] : [dayIndex];
    $('meals').innerHTML = days.map(day=>`<h3 class="day-heading">${weekdays[day]}</h3><div class="meal-grid">${plan.days[day].map((meal,col)=>{
      const [title,portion] = meal.split('|');
      const estimate=energy.days[plan.id][day].meals[col];
      return `<article class="meal"><img class="meal-image" src="assets/${plan.id}-${day}-${col}.jpg" alt="${title}配餐示意图" loading="lazy"><div class="meal-body"><span class="meal-kind">${mealNames[col]}</span><h3>${title}</h3><ul>${portion.split('；').map(p=>`<li>${p}</li>`).join('')}</ul><p class="meal-energy">本餐约 ${estimate.kcal} 千卡</p><details class="meal-calculation"><summary>查看本餐计算</summary><ul>${ingredientDetails(estimate.items)}</ul><p>以上相加后四舍五入：约${estimate.kcal}千卡。按示例食材、配方及用油估算。</p></details></div></article>`;
    }).join('')}</div>`).join('');
    renderEnergy(plan,days);
  }
  $('plans').addEventListener('click',e=>{ const b=e.target.closest('[data-plan]');if(b){planIndex=Number(b.dataset.plan);renderMenus();}});
  $('days').addEventListener('click',e=>{ const b=e.target.closest('[data-day]');if(b){dayIndex=Number(b.dataset.day);renderMenus();}});
  $('fullWeek').addEventListener('change',renderMenus);
  $('printMenu').addEventListener('click',()=>{ $('fullWeek').checked=true;renderMenus();window.print(); });
  $('date').value=today();$('date').max=today();$('date').min='1900-01-01';
  function save(next) {
    try { localStorage.setItem(key,JSON.stringify(next));records=next;return true; }
    catch (_) { $('status').textContent='保存失败：当前浏览器不允许存储或空间不足。本次更改尚未保存，请先导出已有记录。';return false; }
  }
  function drawChart(sorted) {
    if(sorted.length<2){$('chart').textContent=sorted.length?'已有1次记录，再记录一次就能看到趋势曲线。':'保存第一条体重记录，开始观察变化。';return;}
    const W=800,H=260,left=65,right=20,top=20,bottom=45;
    const weights=sorted.map(r=>r.weight),lo=Math.floor(Math.min(...weights)-1),hi=Math.ceil(Math.max(...weights)+1);
    const times=sorted.map(r=>Date.parse(r.date));
    const x=i=>left+(times[i]-times[0])/(times.at(-1)-times[0])*(W-left-right);
    const y=w=>top+(hi-w)/(hi-lo)*(H-top-bottom);
    let svg=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="从${sorted[0].date}到${sorted.at(-1).date}的体重变化，纵轴单位公斤">`;
    for(let i=0;i<5;i++){const value=lo+(hi-lo)*i/4;svg+=`<line x1="${left}" x2="${W-right}" y1="${y(value)}" y2="${y(value)}" stroke="#dce5e0"/><text x="${left-10}" y="${y(value)+5}" text-anchor="end" font-size="14" fill="#586862">${value.toFixed(1)}</text>`;}
    svg+=`<polyline points="${sorted.map((r,i)=>`${x(i)},${y(r.weight)}`).join(' ')}" fill="none" stroke="#20644f" stroke-width="3"/>`;
    sorted.forEach((r,i)=>{svg+=`<circle cx="${x(i)}" cy="${y(r.weight)}" r="5" fill="#246782"><title>${r.date}：${r.weight.toFixed(1)}公斤</title></circle>`;});
    svg+=`<text x="${left}" y="${H-12}" font-size="14" fill="#586862">${sorted[0].date}</text><text x="${W-right}" y="${H-12}" text-anchor="end" font-size="14" fill="#586862">${sorted.at(-1).date}</text></svg>`;
    $('chart').innerHTML=svg;
  }
  function renderRecords() {
    const sorted=[...records].sort((a,b)=>a.date.localeCompare(b.date));
    $('export').disabled=!sorted.length;
    $('stats').innerHTML=sorted.length?`<div class="stat"><span>最新体重</span><strong>${sorted.at(-1).weight.toFixed(1)} 公斤</strong></div><div class="stat"><span>较首次记录</span><strong>${(sorted.at(-1).weight-sorted[0].weight)>0?'+':''}${(sorted.at(-1).weight-sorted[0].weight).toFixed(1)} 公斤</strong></div><div class="stat"><span>累计记录</span><strong>${sorted.length} 次</strong></div>`:'';
    $('records').innerHTML=sorted.length?[...sorted].reverse().map(r=>`<tr><td>${r.date}</td><td>${r.weight.toFixed(1)}</td><td><button type="button" data-edit="${r.date}" aria-label="修改${r.date}记录">修改</button><button type="button" data-delete="${r.date}" aria-label="删除${r.date}记录">删除</button></td></tr>`).join(''):'<tr><td colspan="3">还没有称重记录。</td></tr>';
    drawChart(sorted);
    $('trendNote').textContent=sorted.length>1?'体重会受水分、盐分、排便等影响，请结合数周趋势判断，不必因单次波动减少饭量。':'';
  }
  $('weightForm').addEventListener('submit',e=>{
    e.preventDefault();const date=$('date').value,weight=Number($('weight').value);
    if(!dateValid(date)||!Number.isFinite(weight)||weight<20||weight>400){$('status').textContent='请填写有效日期（不晚于今天），以及20～400公斤内的体重。';return;}
    const rounded=Math.round(weight*10)/10;
    if(records.some(r=>r.date===date)&&!confirm('该日期已有记录，是否用本次体重替换？'))return;
    const next=records.filter(r=>r.date!==date&&r.date!==editingDate).concat({date,weight:rounded});
    if(save(next)){editingDate=null;$('weightForm').querySelector('button').textContent='保存记录';$('status').textContent=`已保存 ${date}：${rounded.toFixed(1)} 公斤。`;renderRecords();}
  });
  $('records').addEventListener('click',e=>{
    const edit=e.target.closest('[data-edit]'),del=e.target.closest('[data-delete]');
    if(edit){const r=records.find(r=>r.date===edit.dataset.edit);editingDate=r.date;$('date').value=r.date;$('weight').value=r.weight.toFixed(1);$('weightForm').querySelector('button').textContent='保存修改';$('weight').focus();$('status').textContent=`正在修改 ${r.date} 的记录。`;}
    if(del&&confirm('确定删除这次体重记录？')){if(save(records.filter(r=>r.date!==del.dataset.delete))){if(editingDate===del.dataset.delete){editingDate=null;$('weightForm').reset();$('date').value=today();$('weightForm').querySelector('button').textContent='保存记录';}$('status').textContent='记录已删除。';renderRecords();}}
  });
  $('export').addEventListener('click',()=>{
    const csv='\uFEFF日期,体重（公斤）\r\n'+[...records].sort((a,b)=>a.date.localeCompare(b.date)).map(r=>`${r.date},${r.weight.toFixed(1)}`).join('\r\n');
    const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`体重记录-${today()}.csv`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  $('foodEnergyRows').innerHTML=Object.values(energy.foods).map(([name,kcal])=>`<tr><td>${name}</td><td>${kcal}</td></tr>`).join('');
  renderMenus();renderRecords();if(storageWarning)$('status').textContent=storageWarning;
})();
