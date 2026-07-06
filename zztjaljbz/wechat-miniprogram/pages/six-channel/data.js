const syndromes = {
  taiyang: {
    name: "太阳线索",
    position: "表",
    summary: "常见怕冷怕风、鼻塞流清涕、头痛身痛、咳嗽初起。",
    advice: "提示表证较明显，重点记录怕冷、汗出、鼻涕和咳嗽变化。"
  },
  shaoyang: {
    name: "少阳线索",
    position: "半表半里",
    summary: "常见寒热往来、口苦咽干、胸胁不舒、烦躁或恶心。",
    advice: "提示枢机不利或郁热，需要结合咽喉、恶心和冷热变化判断。"
  },
  yangming: {
    name: "阳明线索",
    position: "里热/食积/痰热",
    summary: "常见口渴、大便干、口气重、黄痰、舌苔黄厚腻。",
    advice: "提示里热、食积或痰热较突出，需关注体温、大便和精神状态。"
  },
  taiyin: {
    name: "太阴线索",
    position: "脾胃/痰湿/虚寒",
    summary: "常见食欲差、大便稀、腹胀、畏寒、白痰多。",
    advice: "提示脾胃和痰湿线索明显，需关注饮食、腹部和大便变化。"
  },
  shaoyin: {
    name: "少阴风险线索",
    position: "正气不足",
    summary: "常见精神差、嗜睡、畏寒明显、四肢冷、声音低弱。",
    advice: "儿童出现这类线索时不建议自行处理，建议医生评估。"
  },
  jueyin: {
    name: "厥阴复杂线索",
    position: "寒热错杂",
    summary: "可见上热下寒、寒热错杂、病程迁延或表现反复。",
    advice: "寒热错杂不适合简单归类，建议医生综合辨证。"
  }
};

const redFlags = [
  { id: "age3m", text: "小于3个月且体温达到或超过38℃" },
  { id: "breath", text: "呼吸困难、喘憋、口唇发紫或胸凹明显" },
  { id: "seizure", text: "抽搐、意识异常或难以唤醒" },
  { id: "spirit", text: "精神很差、持续嗜睡、明显烦躁无法安抚" },
  { id: "dehydration", text: "尿明显减少、口唇干、哭时少泪，怀疑脱水" },
  { id: "neck", text: "颈项强直、剧烈头痛、畏光或皮疹按压不褪色" },
  { id: "longFever", text: "高热接近或超过40℃，或发热超过3天仍不缓解" }
];

const questions = [
  {
    id: "chief",
    title: "0. 主诉：这次最主要的问题是什么？",
    options: [
      { label: "发热", scores: { taiyang: 1, yangming: 1 }, evidence: "发热需结合冷热、汗出、口渴、大便等线索分表里寒热。" },
      { label: "咳嗽", scores: { taiyang: 1 }, evidence: "咳嗽初起常先看太阳表证，也要结合痰色痰量判断里热或痰湿。" },
      { label: "喘息/气急", scores: { taiyang: 1, yangming: 1 }, evidence: "喘息可见表邪束肺或痰热壅肺，若喘憋明显应先就医。" },
      { label: "鼻塞、流涕、喷嚏", scores: { taiyang: 2 }, evidence: "鼻塞流涕喷嚏提示邪在体表、肺卫不宣。" },
      { label: "咽痛、声嘶、疱疹或扁桃体问题", scores: { shaoyang: 1, yangming: 2 }, evidence: "咽喉红肿疼痛、疱疹、化脓多提示热象。" },
      { label: "呕吐、腹痛或腹泻", scores: { taiyin: 2, shaoyang: 1 }, evidence: "呕吐腹痛腹泻需重点看脾胃太阴，也可能夹少阳枢机不利。" },
      { label: "便秘、口臭或积食", scores: { yangming: 3 }, evidence: "便秘口臭积食偏向阳明里热或食积化热。" },
      { label: "头痛、颈项痛、身痛", scores: { taiyang: 2 }, evidence: "头痛、颈项痛、身痛常提示太阳表证。" }
    ]
  },
  {
    id: "eat",
    title: "1. 吃：食欲、口味和胃部反应",
    options: [
      { label: "食欲差、不想吃", scores: { taiyin: 2, shaoyang: 1 }, evidence: "食欲差提示脾胃运化不足，也可见少阳不和。" },
      { label: "食量大、容易饿", scores: { yangming: 2 }, evidence: "食量大、容易饥饿可作为阳明胃热参考。" },
      { label: "饿但不想吃", scores: { jueyin: 2 }, evidence: "饥不欲食提示寒热错杂方向。" },
      { label: "恶心、干呕或咳后想吐", scores: { shaoyang: 2, taiyin: 1 }, evidence: "恶心欲吐可见少阳不和，也可兼痰饮或脾胃不和。" },
      { label: "吃凉的容易肚子不舒服", scores: { taiyin: 2 }, evidence: "遇凉加重偏太阴虚寒、脾胃阳气不足。" },
      { label: "没有明显异常", none: true, scores: {} }
    ]
  },
  {
    id: "drink",
    title: "2. 喝：口渴、口苦、咽干",
    options: [
      { label: "不太渴或喜欢热饮", scores: { taiyin: 1, shaoyin: 1 }, evidence: "不渴或喜热饮偏寒象，需结合精神和四肢温度判断。" },
      { label: "口渴明显、喜欢冷饮", scores: { yangming: 3 }, evidence: "口渴喜冷饮是阳明里热的重要线索。" },
      { label: "口苦", scores: { shaoyang: 3, jueyin: 1 }, evidence: "口苦多提示少阳郁热。" },
      { label: "咽干、口干", scores: { shaoyang: 2, shaoyin: 1 }, evidence: "咽干口干可见少阳郁热，也可能提示阴液不足。" },
      { label: "口渴但喝不多或喝了不解渴", scores: { jueyin: 2, yangming: 1 }, evidence: "口渴而饮水不多需警惕寒热错杂或津液输布不利。" },
      { label: "没有明显异常", none: true, scores: {} }
    ]
  },
  {
    id: "stool",
    title: "3. 拉：大便情况",
    options: [
      { label: "大便干硬、两三天不解或排便费力", scores: { yangming: 3 }, evidence: "大便干硬是阳明腑热或积滞的重要依据。" },
      { label: "大便臭味很重或肛门灼热", scores: { yangming: 3 }, evidence: "臭味重、灼热感提示里热、湿热或食积化热。" },
      { label: "大便稀、味道不大或夹不消化食物", scores: { taiyin: 3 }, evidence: "便稀味轻、不消化偏太阴脾虚寒湿。" },
      { label: "腹胀腹痛，喜欢揉按或热敷", scores: { taiyin: 2 }, evidence: "腹痛喜温喜按偏虚寒，常从太阴考虑。" },
      { label: "腹胀腹痛，拒按或按着更难受", scores: { yangming: 2 }, evidence: "腹胀拒按偏实证、积滞或里热。" },
      { label: "便干口臭和便稀怕冷交替出现", scores: { jueyin: 3, yangming: 1, taiyin: 1 }, evidence: "寒热表现交替出现，提示厥阴寒热错杂方向。" },
      { label: "大便基本正常", none: true, scores: {} }
    ]
  },
  {
    id: "urine",
    title: "4. 撒：小便情况",
    options: [
      { label: "小便黄、味重", scores: { yangming: 2 }, evidence: "小便黄味重常与里热或津液不足相关。" },
      { label: "小便清长", scores: { shaoyin: 2, taiyin: 1 }, evidence: "小便清长偏寒象，需结合精神、畏寒和四肢温度。" },
      { label: "小便明显减少", scores: { yangming: 1 }, evidence: "小便明显减少需留意脱水风险。" },
      { label: "小便正常", none: true, scores: {} }
    ]
  },
  {
    id: "sleep",
    title: "5. 睡：睡眠和精神状态",
    options: [
      { label: "精神尚可，但烦躁、哭闹或坐卧不安", scores: { yangming: 2, shaoyang: 1 }, evidence: "烦躁坐卧不安可见阳明热扰，也可兼少阳郁热。" },
      { label: "睡不安、翻滚、趴睡、磨牙", scores: { yangming: 2, taiyin: 1 }, evidence: "睡不安、趴睡、磨牙常与食积化热或脾胃不和有关。" },
      { label: "精神差、嗜睡、声音低弱", scores: { shaoyin: 4 }, evidence: "精神差、嗜睡、声音低弱是少阴类风险线索。" },
      { label: "心烦失眠、手足心热", scores: { shaoyin: 2, yangming: 1 }, evidence: "心烦失眠、手足心热提示热扰或阴液不足方向。" },
      { label: "咳嗽或喘息影响睡眠", scores: { taiyang: 1, yangming: 1, taiyin: 1 }, evidence: "夜间咳喘需结合痰色、痰量和寒热判断。" },
      { label: "睡眠和精神基本正常", none: true, scores: {} }
    ]
  },
  {
    id: "sweat",
    title: "6. 汗：出汗情况",
    options: [
      { label: "无汗或很少出汗", scores: { taiyang: 2 }, evidence: "发热怕冷而无汗偏太阳伤寒表实方向。" },
      { label: "出汗后怕风，汗出后稍舒服", scores: { taiyang: 2 }, evidence: "汗出怕风、汗后稍缓偏太阳中风表虚方向。" },
      { label: "汗多、皮肤热或汗黏", scores: { yangming: 3 }, evidence: "汗多皮肤热、汗黏偏阳明里热。" },
      { label: "冷汗、虚汗或汗出后更没精神", scores: { shaoyin: 3 }, evidence: "冷汗虚汗伴精神差提示正气不足。" },
      { label: "汗出不明显", none: true, scores: {} }
    ]
  },
  {
    id: "cold_heat",
    title: "7. 冷热：怕冷、怕热和寒热往来",
    options: [
      { label: "怕冷怕风明显", scores: { taiyang: 3 }, evidence: "怕冷怕风是太阳表证核心线索之一。" },
      { label: "发热轻，但非常怕冷、精神差", scores: { shaoyin: 4 }, evidence: "发热轻而畏寒重、精神差需警惕少阴方向。" },
      { label: "怕热、面红或高热明显", scores: { yangming: 3 }, evidence: "怕热、高热、面红偏阳明里热。" },
      { label: "一阵冷一阵热", scores: { shaoyang: 3 }, evidence: "寒热往来是少阳病的重要判断点。" },
      { label: "冷热不明显", none: true, scores: {} }
    ]
  },
  {
    id: "temperature",
    title: "8. 温差：手脚、肚皮和上下寒热",
    options: [
      { label: "手脚心烫、肚皮烫", scores: { yangming: 2 }, evidence: "手足心热、腹部热可见里热或食积化热。" },
      { label: "手脚凉、小腿凉", scores: { shaoyin: 2, taiyin: 1 }, evidence: "手脚凉、小腿凉偏寒象，需结合精神状态。" },
      { label: "上面热：口苦口渴咽痛；下面冷：腹泻或手脚冷", scores: { jueyin: 4 }, evidence: "上热下寒是厥阴寒热错杂的重要线索。" },
      { label: "手足心热、口干咽燥", scores: { shaoyin: 2, yangming: 1 }, evidence: "手足心热、口干咽燥可作为热化或阴液不足参考。" },
      { label: "没有明显温差", none: true, scores: {} }
    ]
  },
  {
    id: "cough",
    title: "9. 鼻、咽、咳、痰",
    options: [
      { label: "清鼻涕、喷嚏、鼻塞", scores: { taiyang: 3 }, evidence: "清涕喷嚏鼻塞常提示太阳表证。" },
      { label: "黄鼻涕、鼻涕黏稠", scores: { yangming: 2, shaoyang: 1 }, evidence: "黄涕黏稠偏热象，可见阳明或少阳。" },
      { label: "白痰、清稀痰", scores: { taiyin: 2, taiyang: 1 }, evidence: "白痰清稀多偏寒湿或表寒。" },
      { label: "黄痰、黏痰、不易咳出", scores: { yangming: 3 }, evidence: "黄痰黏稠提示痰热壅肺。" },
      { label: "咽痛、疱疹、扁桃体红肿或化脓", scores: { yangming: 3, shaoyang: 1 }, evidence: "咽喉红肿、疱疹、化脓多属热象。" },
      { label: "声嘶、咽干", scores: { shaoyang: 2, yangming: 1 }, evidence: "声嘶咽干常提示少阳郁热或上焦热象。" },
      { label: "咳喘明显", scores: { taiyang: 1, yangming: 2 }, evidence: "咳喘需辨表邪束肺与痰热壅肺；若喘憋明显应及时就医。" },
      { label: "没有这些情况", none: true, scores: {} }
    ]
  },
  {
    id: "tongue",
    title: "10. 病史/舌象：可观察到的辅助线索",
    options: [
      { label: "舌淡红、苔薄白", scores: { taiyang: 1 }, evidence: "舌淡红、苔薄白常可见于外感表证初起。" },
      { label: "舌红、苔薄黄", scores: { yangming: 2, shaoyang: 1 }, evidence: "舌红苔薄黄提示热象初显。" },
      { label: "舌红、苔黄厚干或黄厚腻", scores: { yangming: 3 }, evidence: "舌红苔黄厚干或黄厚腻偏阳明里热、食积、痰热。" },
      { label: "舌淡白、苔白厚湿润", scores: { taiyin: 3 }, evidence: "舌淡白、苔白厚湿润偏太阴寒湿或痰湿。" },
      { label: "舌红少苔，口干咽燥", scores: { shaoyin: 2 }, evidence: "舌红少苔、口干咽燥提示热化或阴液不足方向。" },
      { label: "病情迁延反复，冷热表现混杂", scores: { jueyin: 3 }, evidence: "迁延反复且寒热混杂，需要医生综合辨证。" },
      { label: "暂时看不清/没有记录", none: true, scores: {} }
    ]
  }
];

module.exports = {
  syndromes,
  redFlags,
  questions
};
