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
  { id: "longFever", text: "发热超过3天仍不缓解" }
];

const questions = [
  {
    id: "chief",
    title: "0. 主诉：这次最主要的问题是什么？",
    options: [
      { label: "发热", scores: { taiyang: 1, yangming: 1 }, evidence: "发热需结合冷热、汗出、口渴、大便等线索分表里寒热。" },
      { label: "咳嗽", scores: { taiyang: 1 }, evidence: "咳嗽初起常先看太阳表证，也要结合痰色痰量判断里热或痰湿。" },
     
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

const medicines = [
  { name: "荆防颗粒", syndromes: ["taiyang", "shaoyang"], ingredients: ["荆芥", "防风", "羌活", "独活", "柴胡", "前胡", "川芎", "枳壳", "茯苓", "桔梗", "甘草"], effect: "发汗解表，散风祛湿，宣肺化痰。", suitable: "风寒夹湿外感，怕冷身痛、鼻塞清涕、咳嗽白痰。", caution: "咽红口渴、黄痰便干等里热明显者慎用。" },
  { name: "葛根汤颗粒", syndromes: ["taiyang"], ingredients: ["葛根", "麻黄", "桂枝", "生姜", "甘草", "芍药", "大枣"], effect: "发汗解表，升津舒筋。", suitable: "怕冷、无汗、头项身痛、清涕等太阳表实线索。", caution: "汗多、心悸、体虚或里热明显者慎用。" },
  { name: "风寒感冒颗粒", syndromes: ["taiyang"], ingredients: ["麻黄", "葛根", "紫苏叶", "防风", "桂枝", "白芷", "陈皮", "苦杏仁", "桔梗", "甘草", "干姜"], effect: "解表发汗，疏风散寒。", suitable: "风寒表证，发热怕冷、鼻塞流清涕、咳嗽轻。", caution: "咽红口渴、黄痰便干或里热偏重者慎用。" },
  { name: "感冒清热颗粒", syndromes: ["taiyang", "yangming"], ingredients: ["荆芥穗", "薄荷", "防风", "柴胡", "紫苏叶", "葛根", "桔梗", "苦杏仁", "白芷", "苦地丁", "芦根"], effect: "疏风散寒，解表清热。", suitable: "外感表证兼轻微热象，发热、怕冷、鼻涕清黄交替。", caution: "纯风寒或纯里热都需重新判断。" },
  { name: "小儿豉翘清热颗粒", syndromes: ["taiyang", "shaoyang", "yangming"], ingredients: ["连翘", "淡豆豉", "薄荷", "荆芥", "炒栀子", "大黄", "青蒿", "赤芍", "槟榔", "厚朴", "黄芩", "半夏", "柴胡", "甘草"], effect: "疏风解表，清热导滞。", suitable: "发热、咽痛、烦躁、便干或积滞，三阳合病线索。", caution: "大便稀、脾胃弱、怕冷清涕重者慎用。" },
  { name: "小儿柴桂退热颗粒/口服液", syndromes: ["taiyang", "shaoyang"], ingredients: ["柴胡", "桂枝", "葛根", "浮萍", "黄芩", "白芍", "蝉蜕"], effect: "发汗解表，清里退热。", suitable: "发热伴怕冷、寒热往来、咽部不适等太阳少阳线索。", caution: "高热便秘、腹泻明显或精神差时需医生判断。" },
  { name: "小儿解表颗粒", syndromes: ["taiyang", "shaoyang", "yangming"], ingredients: ["金银花", "连翘", "炒牛蒡子", "葛根", "荆芥穗", "紫苏叶", "防风", "蒲公英", "黄芩", "牛黄"], effect: "宣肺解表，清热解毒。", suitable: "小儿外感发热，咽红咽痛、鼻塞、咳嗽兼热象。", caution: "寒象明显、清稀白痰、大便稀者慎用。" },
  { name: "儿感清口服液", syndromes: ["taiyang", "shaoyang", "taiyin"], ingredients: ["荆芥穗", "薄荷", "化橘红", "黄芩", "紫苏叶", "法半夏", "桔梗", "甘草"], effect: "解表清热，宣肺化痰。", suitable: "感冒发热兼痰多、咳嗽、恶心、食欲差。", caution: "高热便秘、黄痰黏稠突出者可能力度不足。" },
  { name: "双黄连口服液", syndromes: ["taiyang", "shaoyang", "yangming"], ingredients: ["金银花", "黄芩", "连翘"], effect: "疏风解表，清热解毒。", suitable: "风热外感，发热、咽痛、口干、热象偏明显。", caution: "怕冷清涕、白痰、便稀或脾胃虚寒者慎用。" },
  { name: "银翘解毒颗粒", syndromes: ["taiyang", "yangming"], ingredients: ["金银花", "连翘", "薄荷", "荆芥", "淡豆豉", "牛蒡子", "桔梗", "淡竹叶", "甘草"], effect: "疏风解表，清热解毒。", suitable: "风热外感，发热、咽红咽痛、舌红苔薄黄。", caution: "怕冷重、清涕白痰、无汗表寒明显者慎用。" },
  { name: "蓝芩口服液", syndromes: ["shaoyang", "yangming"], ingredients: ["板蓝根", "黄芩", "栀子", "黄柏", "胖大海"], effect: "清热解毒，利咽消肿。", suitable: "咽红咽痛、口干咽干、里热或少阳郁热偏重。", caution: "偏寒凉，腹泻、腹痛、脾胃虚寒者慎用。" },
  { name: "蒲地蓝口服液", syndromes: ["shaoyang", "yangming"], ingredients: ["蒲公英", "苦地丁", "板蓝根", "黄芩"], effect: "清热解毒，抗炎消肿。", suitable: "咽喉红肿疼痛、热毒偏盛、发热兼咽部热象。", caution: "偏寒凉，腹泻、食少、寒象明显者慎用。" },
  { name: "芩香清解口服液", syndromes: ["shaoyang", "yangming"], ingredients: ["黄芩", "广藿香", "蝉蜕", "石膏", "葛根", "大黄", "芍药", "板蓝根", "桔梗", "玄参", "山豆根", "甘草"], effect: "清热解毒，疏风透表，利咽退热。", suitable: "高热、咽痛、口渴、便干，少阳阳明合病线索。", caution: "药性偏寒凉，便稀、脾胃弱者慎用。" },
  { name: "连花清瘟胶囊", syndromes: ["taiyang", "shaoyang", "yangming"], ingredients: ["连翘", "金银花", "炙麻黄", "炒苦杏仁", "石膏", "板蓝根", "绵马贯众", "鱼腥草", "广藿香", "大黄", "红景天", "薄荷脑", "甘草"], effect: "清瘟解毒，宣肺泄热。", suitable: "流感样外感属热毒袭肺，发热或高热、肌肉酸痛、咳嗽咽痛。", caution: "含麻黄、大黄，儿童须按说明或遵医嘱；风寒白痰便稀者慎用。" },
  { name: "小儿感冒宁糖浆", syndromes: ["taiyang", "yangming", "taiyin"], ingredients: ["薄荷", "荆芥穗", "苦杏仁", "牛蒡子", "黄芩", "桔梗", "前胡", "白芷", "炒栀子", "焦山楂", "焦神曲", "焦麦芽", "芦根", "金银花", "连翘"], effect: "疏风解表，清热止咳，消食导滞。", suitable: "感冒夹滞，发热咳嗽兼腹胀、口气、食积。", caution: "无积滞或大便偏稀者不宜盲用。" },
  { name: "四磨汤口服液", syndromes: ["yangming"], ingredients: ["木香", "枳壳", "乌药", "槟榔"], effect: "顺气降逆，消积止痛。", suitable: "食积气滞，口臭、腹胀腹痛、大便硬或臭稀。", caution: "体虚气弱、清稀腹泻或无积滞者慎用。" },
  { name: "通宣理肺颗粒", syndromes: ["taiyang", "taiyin"], ingredients: ["紫苏叶", "前胡", "桔梗", "苦杏仁", "麻黄", "甘草", "陈皮", "半夏", "茯苓", "枳壳", "黄芩"], effect: "解表散寒，宣肺止嗽。", suitable: "风寒束表兼痰湿，鼻塞流涕、头痛无汗、咳嗽白痰。", caution: "含麻黄，里热黄痰便干时不宜单独使用。" },
  { name: "小青龙颗粒", syndromes: ["taiyang", "taiyin"], ingredients: ["麻黄", "桂枝", "白芍", "干姜", "细辛", "炙甘草", "法半夏", "五味子"], effect: "解表化饮，止咳平喘。", suitable: "外寒内饮，怕冷、清涕、白痰清稀、咳嗽痰多。", caution: "含麻黄、细辛，儿童需按说明或遵医嘱；黄痰咽红里热者慎用。" },
  { name: "二陈丸", syndromes: ["taiyin"], ingredients: ["陈皮", "半夏", "茯苓", "甘草"], effect: "燥湿化痰，理气和胃。", suitable: "太阴痰湿，咳嗽痰白、痰多、腹胀、恶心。", caution: "黄痰黏稠、咽红口渴等痰热明显者慎用。" },
  { name: "橘红痰咳颗粒", syndromes: ["taiyin"], ingredients: ["化橘红", "百部", "苦杏仁", "茯苓", "半夏", "五味子", "甘草"], effect: "理肺祛痰，止咳平喘。", suitable: "痰湿咳嗽，痰多、白痰或痰鸣。", caution: "痰黄黏稠、发热咽红等痰热偏重者需重辨。" },
  { name: "小儿宝泰康颗粒", syndromes: ["shaoyang", "yangming"], ingredients: ["连翘", "地黄", "滇柴胡", "玄参", "桑叶", "浙贝母", "蒲公英", "南板蓝根", "滇紫草", "桔梗", "莱菔子", "甘草"], effect: "清热解表，止咳化痰。", suitable: "少阳郁热、咽红咳嗽、痰热或风热线索。", caution: "便稀、脾胃虚寒者慎用。" },
  { name: "小儿咳喘宁口服液", syndromes: ["yangming"], ingredients: ["麻黄", "石膏", "苦杏仁", "桔梗", "百部", "罂粟壳", "甘草"], effect: "宣肺清热，止咳平喘。", suitable: "痰热咳喘、咳嗽较剧、喘促线索。", caution: "含罂粟壳，不可长期或超量，儿童须遵医嘱。" },
  { name: "小儿黄金止咳颗粒", syndromes: ["shaoyang", "yangming"], ingredients: ["黄芩", "金荞麦", "蜜枇杷叶", "浙贝母", "虎杖", "甘草"], effect: "清热宣肺，化痰止咳。", suitable: "咽部热象、黄痰或痰热咳嗽。", caution: "寒咳白痰、便稀者慎用。" },
  { name: "小儿咳嗽宁糖浆", syndromes: ["shaoyang", "yangming", "taiyin"], ingredients: ["桑叶", "桑白皮", "桔梗", "前胡", "焦神曲", "焦麦芽", "焦山楂", "黄芩", "枇杷叶", "瓜蒌", "浙贝母", "陈皮", "杏仁", "芦根", "牛蒡子"], effect: "宣肺止咳，清热化痰，消食和中。", suitable: "咳嗽兼积食、痰热或咽部热象。", caution: "大便稀、脾虚明显者慎用。" },
  { name: "小儿咳喘灵口服液", syndromes: ["taiyang", "yangming"], ingredients: ["麻黄", "金银花", "苦杏仁", "板蓝根", "石膏", "甘草", "瓜蒌"], effect: "宣肺清热，止咳平喘。", suitable: "外感发热、咳嗽喘促，兼痰热或咽部热象。", caution: "寒咳白痰、便稀体虚者慎用；含麻黄。" },
  { name: "小儿咳喘灵颗粒", syndromes: ["taiyang", "yangming"], ingredients: ["麻黄", "石膏", "苦杏仁", "瓜蒌", "板蓝根", "金银花", "甘草"], effect: "宣肺清热，止咳平喘。", suitable: "发热咳喘、黄痰或肺热线索。", caution: "寒咳白痰、畏寒明显者慎用；含麻黄。" },
  { name: "宝咳宁颗粒", syndromes: ["taiyang", "yangming", "taiyin"], ingredients: ["紫苏叶", "桑叶", "前胡", "浙贝母", "麻黄", "桔梗", "制天南星", "陈皮", "炒苦杏仁", "黄芩", "青黛", "天花粉", "枳壳", "山楂", "甘草", "人工牛黄"], effect: "清热解表，止嗽化痰。", suitable: "表证兼痰热、食滞咳嗽。", caution: "成分层次多，体虚便稀者慎用。" },
  { name: "小儿肺咳颗粒", syndromes: ["taiyin", "yangming"], ingredients: ["人参", "茯苓", "白术", "陈皮", "鸡内金", "酒大黄", "鳖甲", "地骨皮", "北沙参", "炙甘草", "青蒿", "麦冬", "桂枝", "干姜", "淡附片", "瓜蒌", "款冬花", "紫菀", "桑白皮", "胆南星", "黄芪", "枸杞子"], effect: "健脾益肺，止咳平喘，化痰清热。", suitable: "迁延咳嗽、脾虚痰盛、正虚夹痰热线索。", caution: "含淡附片等温阳药，儿童不宜自行长期使用。" },
  { name: "小儿消积止咳口服液", syndromes: ["yangming", "taiyin"], ingredients: ["山楂", "槟榔", "枳实", "枇杷叶", "瓜蒌", "莱菔子", "葶苈子", "桔梗", "连翘", "蝉蜕"], effect: "清热肃肺，消积止咳。", suitable: "食积咳嗽，夜咳重、痰鸣、腹胀、口臭。", caution: "体虚、肺虚久咳、大便溏薄者慎用；低龄儿童按说明或遵医嘱。" },
  { name: "急支糖浆", syndromes: ["yangming"], ingredients: ["鱼腥草", "金荞麦", "四季青", "麻黄", "紫菀", "前胡", "枳壳", "甘草"], effect: "清热化痰，宣肺止咳。", suitable: "急性痰热咳嗽、黄痰、咳嗽较重。", caution: "寒咳白痰或体虚者慎用。" },
  { name: "肺力咳合剂", syndromes: ["shaoyang", "yangming"], ingredients: ["黄芩", "前胡", "百部", "红花龙胆", "梧桐根", "白花蛇舌草", "红管药"], effect: "清热解毒，镇咳祛痰。", suitable: "郁热咳嗽、咽喉不适、痰热偏重。", caution: "脾胃虚寒、便稀者慎用。" },
  { name: "贝羚胶囊", syndromes: ["yangming", "jueyin"], ingredients: ["川贝母", "羚羊角", "猪去氧胆酸", "麝香", "沉香", "人工天竺黄", "青礞石", "硼砂"], effect: "清热化痰，镇惊开窍。", suitable: "痰热壅盛、咳喘痰鸣兼烦躁惊惕等复杂线索。", caution: "成分特殊，儿童须医生指导，不建议自行使用。" },
  { name: "小儿肺热咳喘颗粒", syndromes: ["yangming", "taiyang"], ingredients: ["麻黄", "苦杏仁", "石膏", "甘草", "金银花", "连翘", "知母", "黄芩", "板蓝根", "麦冬", "鱼腥草"], effect: "清热解毒，宣肺止咳，化痰平喘。", suitable: "肺热咳喘、发热、黄痰、咽痛。", caution: "寒咳白痰、便稀、畏寒明显者慎用；含麻黄。" },
  { name: "馥感啉口服液", syndromes: ["taiyin", "shaoyang"], ingredients: ["鬼针草", "野菊花", "西洋参", "黄芪", "板蓝根", "香菇", "浙贝母", "麻黄", "前胡", "甘草"], effect: "清热解毒，止咳平喘，益气扶正。", suitable: "迁延咳嗽、正气不足兼热象。", caution: "急性高热痰热重时需就医判断。" },
  { name: "羚贝止咳糖浆", syndromes: ["shaoyang", "taiyin", "yangming"], ingredients: ["紫菀", "茯苓", "麻黄", "知母", "金银花", "陈皮", "半夏", "前胡", "远志", "平贝母", "罂粟壳", "山楂", "羚羊角"], effect: "宣肺化痰，清热止咳。", suitable: "迁延咳嗽兼痰热、痰湿。", caution: "含罂粟壳，不可长期使用，须遵医嘱。" },
  { name: "小儿麻甘颗粒", syndromes: ["yangming", "taiyang"], ingredients: ["麻黄", "黄芩", "桑白皮", "紫苏子", "苦杏仁", "地骨皮", "甘草", "石膏"], effect: "平喘止咳，利咽祛痰。", suitable: "肺热咳喘、痰黄、喘促。", caution: "含麻黄，寒咳白痰、心悸或体虚者慎用。" },
  { name: "金振口服液", syndromes: ["yangming"], ingredients: ["羚羊角", "平贝母", "大黄", "青礞石", "黄芩", "生石膏", "人工牛黄", "甘草"], effect: "清热解毒，祛痰止咳。", suitable: "痰热闭肺、咳喘热重、痰黄黏稠。", caution: "药性较猛，便稀、脾虚、低龄儿童需医生指导。" },
  { name: "宣肺止咳颗粒", syndromes: ["taiyang", "yangming"], ingredients: ["麻黄", "竹叶防风", "西南黄芩", "桔梗", "芥子", "苦杏仁", "葶苈子", "马兰", "黄芪", "山药", "山楂", "甘草"], effect: "宣肺解表，清热化痰，止咳平喘。", suitable: "太阳表证咳嗽、初起白痰或外感咳嗽。", caution: "痰热很重或便稀体虚者需辨证。" },
  { name: "小儿清肺化痰颗粒", syndromes: ["yangming"], ingredients: ["麻黄", "石膏", "苦杏仁", "前胡", "黄芩", "炒紫苏子", "葶苈子", "竹茹"], effect: "清热化痰，止咳平喘。", suitable: "黄痰黏稠、肺热咳嗽、咽痛热象。", caution: "白痰清稀、畏寒明显者慎用。" },
  { name: "小儿清肺颗粒", syndromes: ["yangming", "taiyin"], ingredients: ["茯苓", "清半夏", "川贝母", "百部", "黄芩", "胆南星", "石膏", "沉香", "白前", "冰片"], effect: "清肺化痰，止咳平喘。", suitable: "痰热夹痰湿咳嗽。", caution: "寒咳、胃寒、便稀者慎用。" },
  { name: "小儿定喘口服液", syndromes: ["yangming"], ingredients: ["麻黄", "炒苦杏仁", "莱菔子", "葶苈子", "紫苏子", "黄芩", "桑白皮", "石膏", "大青叶", "鱼腥草", "甘草"], effect: "清热化痰，宣肺定喘。", suitable: "肺热咳喘、痰多气急、黄痰。", caution: "寒咳白痰、体虚或心悸者慎用；含麻黄。" },
  { name: "小儿清热利肺口服液", syndromes: ["yangming", "taiyang"], ingredients: ["金银花", "连翘", "石膏", "麻黄", "苦杏仁", "炒牛蒡子", "射干", "瓜蒌皮", "浮海石", "炒葶苈子", "盐炙车前子"], effect: "清热解毒，宣肺止咳，利肺化痰。", suitable: "发热咳嗽、咽痛、黄痰、肺热明显。", caution: "寒咳白痰、便稀体虚者慎用；含麻黄。" },
  { name: "小儿荆杏止咳颗粒", syndromes: ["taiyang", "shaoyang"], ingredients: ["荆芥", "矮地茶", "蜜麻黄", "苦杏仁", "黄芩", "前胡", "法半夏", "浮石", "蝉蜕", "陈皮", "紫草", "甘草"], effect: "疏风宣肺，清热化痰，止咳。", suitable: "外感咳嗽兼少阳郁热。", caution: "纯里热或脾虚便稀需重辨；含蜜麻黄。" },
  { name: "黄龙止咳颗粒", syndromes: ["taiyin", "yangming"], ingredients: ["黄芪", "地龙", "淫羊藿", "桔梗", "射干", "鱼腥草", "炙麻黄", "山楂", "葶苈子"], effect: "益气补肾，清肺止咳。", suitable: "迁延咳嗽、正虚痰阻兼热象。", caution: "含补益与宣降药，急性高热不宜自行使用。" },
  { name: "儿童清肺丸", syndromes: ["taiyang", "taiyin", "yangming"], ingredients: ["麻黄", "苦杏仁", "石膏", "甘草", "蜜桑白皮", "瓜蒌皮", "黄芩", "板蓝根", "橘红", "法半夏", "炒紫苏子", "葶苈子", "浙贝母", "紫苏叶", "细辛", "薄荷", "蜜枇杷叶", "白前", "前胡", "石菖蒲", "天花粉", "煅青礞石"], effect: "清肺化痰，止嗽定喘。", suitable: "风寒束表兼痰多咳嗽或寒热错杂咳嗽线索。", caution: "含细辛、麻黄等，儿童使用需严格按说明或遵医嘱。" },
  { name: "清宣止咳颗粒", syndromes: ["shaoyang", "taiyang"], ingredients: ["桑叶", "薄荷", "苦杏仁", "桔梗", "白芍", "枳壳", "陈皮", "紫菀", "甘草"], effect: "疏风清热，宣肺止咳。", suitable: "风热或郁热初起咳嗽、咽痒。", caution: "痰热壅盛或寒湿白痰多时可能不足。" },
  { name: "四季抗病毒口服液", syndromes: ["taiyang", "shaoyang"], ingredients: ["鱼腥草", "桔梗", "桑叶", "连翘", "薄荷", "紫苏叶", "苦杏仁", "菊花", "甘草"], effect: "清热解毒，消炎退热。", suitable: "外感咳嗽兼咽痛热象。", caution: "脾虚便稀或寒象明显者慎用。" },
  { name: "小儿清热止咳口服液", syndromes: ["yangming"], ingredients: ["麻黄", "炒苦杏仁", "石膏", "甘草", "黄芩", "板蓝根", "北豆根"], effect: "清热宣肺，平喘利咽。", suitable: "肺热咳嗽、咽痛黄痰。", caution: "白痰清稀、畏寒明显者慎用；含麻黄。" },
  { name: "肺宁口服液", syndromes: ["yangming"], ingredients: ["返魂草"], effect: "清热祛痰，止咳。", suitable: "肺热咳嗽、痰多、咽部热象。", caution: "寒咳白痰、脾胃虚寒者慎用。" },
  { name: "祛痰灵口服液", syndromes: ["yangming"], ingredients: ["鲜竹沥", "鱼腥草"], effect: "清肺化痰，止咳。", suitable: "痰热壅肺，咳嗽痰多、痰黏厚或稠黄。", caution: "寒咳白痰、便溏、脾胃虚寒者慎用。" },
  { name: "蛇胆川贝枇杷膏", syndromes: ["shaoyang", "yangming"], ingredients: ["蛇胆汁", "川贝母", "枇杷叶", "桔梗", "水半夏", "薄荷脑"], effect: "润肺止咳，祛痰定喘。", suitable: "咳嗽咽痒、痰热或咽部热象兼痰黏不爽。", caution: "寒咳白痰清稀、便稀或脾胃虚寒者慎用。" },
  { name: "牛黄蛇胆川贝液", syndromes: ["shaoyang", "yangming"], ingredients: ["人工牛黄", "川贝母", "蛇胆汁", "薄荷脑"], effect: "清热化痰，止咳。", suitable: "痰热咳嗽、咽喉不适、黄痰或热象较明显。", caution: "偏寒凉，寒咳白痰、腹泻或脾胃虚寒者慎用。" },
  { name: "京都念慈菴蜜炼川贝枇杷膏", syndromes: ["shaoyang", "yangming", "taiyin"], ingredients: ["川贝母", "枇杷叶", "南沙参", "茯苓", "化橘红", "桔梗", "法半夏", "五味子", "瓜蒌子", "款冬花", "远志", "苦杏仁", "生姜", "甘草", "杏仁水", "薄荷脑"], effect: "润肺化痰，止咳平喘，护咽利咽。", suitable: "咳嗽咽痒、痰黏不爽、久咳或咽部不适。", caution: "含糖膏方，寒湿痰多、便稀、糖代谢异常者需谨慎。" }
];

module.exports = {
  syndromes,
  redFlags,
  questions,
  medicines
};
