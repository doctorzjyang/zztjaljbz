(() => {
  const days=['周一','周二','周三','周四','周五','周六','周日'];
  const schedules=[
    {name:'低强度 · 起步',who:'平时很少运动、体能较弱者的起步参考；按耐受延长适应期。',feel:'能轻松说话、唱歌，呼吸变化较小。',example:'平地慢走、轻松骑固定自行车。以个人感觉为准，不用追同样步速。',minutes:[15,15,0,15,15,15,0],resistance:[1,0,0,1,0,0,0],activity:'轻松步行',strength:'轻负荷抗阻约15分钟，每动作先1组，必要时从更少动作、次数开始。',summary:'低强度有氧75分钟/周 ＋ 抗阻2次/周',note:'这是起步量，低强度75分钟不能当作中等强度150分钟。适应后逐步延长时间，再提高到个人的中等强度。'},
    {name:'中等强度 · 基础',who:'已能耐受连续30分钟中等强度活动的普通成人。',feel:'呼吸加快，能说话，但唱歌费力；自觉费力约5～6分（满分10分）。',example:'快走、平地骑车、水中步行、低冲击操。选择实际达到中等强度的活动。',minutes:[30,30,30,0,30,30,0],resistance:[1,0,1,0,1,0,0],activity:'快走或同等强度有氧',strength:'抗阻约20分钟，每动作1组起，按耐受逐渐增加。',summary:'中等强度有氧150分钟/周 ＋ 抗阻3次/周',note:'30分钟也可拆成当天两段15分钟或三段10分钟；只累计实际达到中等强度的时间，热身和抗阻不重复计入。'},
    {name:'高强度 · 进阶',who:'已有稳定运动基础，经医生或运动专业人员评估适合高强度运动的成人。',feel:'呼吸明显加快，通常说几个字就需换气；自觉费力约7～8分，不是全力冲刺。',example:'较高阻力固定自行车、熟练者连续游泳等低冲击活动；实际强度随体能而异。',minutes:[25,0,25,0,0,25,0],resistance:[0,1,0,0,1,0,0],activity:'经评估适合的高强度有氧',strength:'抗阻约20～30分钟，按已有能力完成，不为追求强度牺牲动作质量。',summary:'高强度有氧75分钟/周 ＋ 抗阻2次/周',note:'成人一般健康建议中，75分钟高强度约相当于150分钟中等强度的有氧运动量，不代表每个人减重效果相同。初学者不直接选此档；不安排全力冲刺或高强度间歇训练。'}
  ];
  const $=id=>document.getElementById(id);
  function render(index){
    const s=schedules[index];
    $('exerciseModes').innerHTML=schedules.map((p,i)=>`<button type="button" data-exercise="${i}" aria-pressed="${i===index}">${p.name}</button>`).join('');
    $('exerciseDescription').innerHTML=`<p><strong>适合谁：</strong>${s.who}</p><p><strong>怎样判断强度：</strong>${s.feel}</p><p><strong>可选运动：</strong>${s.example}</p>`;
    $('exerciseRows').innerHTML=days.map((day,i)=>`<tr><th scope="row">${day}</th><td>${s.minutes[i]?`${s.activity} ${s.minutes[i]}分钟`:'恢复日，可轻松活动'}</td><td>${s.resistance[i]?s.strength:'不安排本套抗阻训练'}</td></tr>`).join('');
    $('exerciseTotal').textContent=s.summary;
    $('exerciseNote').textContent=s.note;
  }
  $('exerciseModes').addEventListener('click',e=>{const b=e.target.closest('[data-exercise]');if(b)render(Number(b.dataset.exercise));});
  render(1);
})();
