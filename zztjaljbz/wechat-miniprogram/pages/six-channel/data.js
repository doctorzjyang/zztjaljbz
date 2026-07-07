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
    id: "course",
    title: "0. 主诉与病程：这次病是怎么开始的？",
    options: [
      { label: "起病急，先怕冷、流清涕、喷嚏或咳嗽", scores: { taiyang: 3 }, evidence: "起病急并先见怕冷清涕，提示太阳病初起。", note: "可能意味着：邪气在表。可能经：太阳。属性：阳证、表证，多偏寒。" },
      { label: "先高热、咽红、口渴、便干或尿黄", scores: { yangming: 3, shaoyang: 1 }, evidence: "先高热并有口渴便干，提示阳明或少阳阳明热象。", note: "可能意味着：热邪较快入里。可能经：阳明或少阳阳明。属性：阳证、里热。" },
      { label: "发热退而复起，时轻时重，伴恶心或不想吃", scores: { shaoyang: 3 }, evidence: "退而复热、不欲食、恶心提示少阳枢机不利。", note: "可能意味着：邪在进退之间。可能经：少阳。属性：阳证、半表半里。" },
      { label: "咳嗽反复日久，痰多白稀，胃口差或便溏", scores: { taiyin: 3 }, evidence: "久咳白稀痰、纳差便溏提示太阴痰饮。", note: "可能意味着：脾胃运化弱，痰饮内生。可能经：太阴。属性：阴证、里虚寒、痰饮。" },
      { label: "发热不高但精神很差、嗜睡、四肢凉", scores: { shaoyin: 4 }, evidence: "体温不高但精神差和肢冷，需要警惕少阴风险。", note: "可能意味着：正气不足或病情较重。可能经：少阴。属性：阴证、虚寒、需谨慎。" },
      { label: "暂时不清楚起病过程", none: true, scores: {}, note: "这一项不参与计分；可继续根据后面能观察到的表现判断。" }
    ]
  },
  {
    id: "spirit",
    title: "1. 精神状态：先定阴阳",
    options: [
      { label: "发热时烦躁，但退热后能玩、能吃、能交流", scores: { taiyang: 1, shaoyang: 1, yangming: 1 }, evidence: "退热后能玩能交流，提示正气尚足，多属阳证。", note: "可能意味着：孩子反应力尚可。可能经：太阳、少阳、阳明。属性：阳证。" },
      { label: "高热烦躁、面红、翻滚、踢被、口渴", scores: { yangming: 3, shaoyang: 1 }, evidence: "高热烦躁、口渴踢被提示里热偏盛。", note: "可能意味着：热扰明显。可能经：阳明或少阳阳明。属性：阳证、里热。" },
      { label: "不哭不闹、嗜睡、蜷卧、反应差", scores: { shaoyin: 4, taiyin: 1 }, evidence: "嗜睡、反应差提示阴证或病重信号。", note: "可能意味着：正气不足或病情较深。可能经：少阴、太阴，或需排重症。属性：阴证、虚寒倾向。" },
      { label: "发热不高，但精神明显比平时差", scores: { shaoyin: 4 }, evidence: "发热不高但精神差，不能只看体温，需警惕少阴。", note: "可能意味着：体温数字不高但状态危险。可能经：少阴。属性：阴证、虚寒或病重倾向。" },
      { label: "哭闹尖锐、烦躁难安、咽痛明显", scores: { shaoyang: 2, yangming: 2 }, evidence: "烦躁难安伴咽痛，多提示热证或痛证。", note: "可能意味着：郁热或里热刺激。可能经：少阳、阳明。属性：阳证、热证。" },
      { label: "精神基本和平时差不多", none: true, scores: {}, note: "暂未见明显阴阳偏向，继续看寒热、汗、二便和咳痰。" }
    ]
  },
  {
    id: "cold_heat",
    title: "2. 寒热：怕冷、怕风，还是怕热？",
    options: [
      { label: "发热同时明显怕冷，盖被也不缓解", scores: { taiyang: 4 }, evidence: "发热恶寒明显提示太阳伤寒表实寒。", note: "可能意味着：寒邪束表。可能经：太阳伤寒。属性：阳证、表证、寒、偏实。" },
      { label: "发热怕风，微微出汗，吹风不舒服", scores: { taiyang: 3 }, evidence: "发热怕风有汗提示太阳中风、营卫不和。", note: "可能意味着：表虚、营卫不和。可能经：太阳中风。属性：阳证、表证、偏虚。" },
      { label: "一阵冷一阵热，发热反复起伏", scores: { shaoyang: 4 }, evidence: "寒热往来提示少阳半表半里。", note: "可能意味着：邪在进退之间。可能经：少阳。属性：阳证、半表半里。" },
      { label: "只热不冷，反而怕热、踢被", scores: { yangming: 4 }, evidence: "但热不寒、怕热踢被提示阳明里热。", note: "可能意味着：邪热入里。可能经：阳明。属性：阳证、里热。" },
      { label: "怕冷明显，精神差，四肢凉，发热不高", scores: { shaoyin: 4, taiyin: 2 }, evidence: "畏寒肢冷伴精神差提示阴证或虚寒。", note: "可能意味着：阳气不足。可能经：少阴或太阴。属性：阴证、寒证、虚证。" },
      { label: "冷热不明显", none: true, scores: {}, note: "这一项线索不明显，可继续看汗、温差和二便。" }
    ]
  },
  {
    id: "sweat",
    title: "3. 汗：出汗吗？怎么出？",
    options: [
      { label: "无汗、皮肤干、怕冷、身痛", scores: { taiyang: 4 }, evidence: "无汗怕冷身痛提示太阳伤寒表实。", note: "可能意味着：毛窍不开，寒邪闭表。可能经：太阳伤寒。属性：表实寒。" },
      { label: "有汗、怕风、发热", scores: { taiyang: 3 }, evidence: "有汗怕风发热提示太阳中风表虚。", note: "可能意味着：营卫不和。可能经：太阳中风。属性：表虚。" },
      { label: "大汗出、口渴、烦躁、热不退", scores: { yangming: 4 }, evidence: "大汗烦渴热不退提示阳明里热。", note: "可能意味着：里热迫津外泄。可能经：阳明。属性：里实热。" },
      { label: "头汗明显，身上少汗，咽红口苦", scores: { shaoyang: 3, yangming: 1 }, evidence: "头汗、咽红口苦提示郁热不畅或少阳阳明。", note: "可能意味着：枢机不利、郁热上蒸。可能经：少阳或少阳阳明。属性：半表半里热。" },
      { label: "汗出而手脚冷、精神差", scores: { shaoyin: 4 }, evidence: "汗出肢冷伴精神差提示少阴风险。", note: "可能意味着：阳气虚衰。可能经：少阴。属性：阴证、虚寒。" },
      { label: "睡中汗多，平素易汗，反复感冒", scores: { taiyang: 2, taiyin: 1 }, evidence: "平素易汗反复感冒提示卫外不固或脾虚。", note: "可能意味着：表虚或脾虚。可能经：太阳表虚、太阴虚。属性：虚证。" },
      { label: "汗出不明显", none: true, scores: {}, note: "暂未见明显汗出线索。" }
    ]
  },
  {
    id: "temperature",
    title: "4. 温差：摸额头、后背、肚子、手心手背、脚心脚背",
    options: [
      { label: "手背热于手心，后背热明显，伴怕冷清涕", scores: { taiyang: 3 }, evidence: "手背后背热兼怕冷清涕，多提示表证。", note: "可能意味着：邪在体表。可能经：太阳。属性：阳证、表证。" },
      { label: "手心比手背烫，肚子比后背烫", scores: { yangming: 3 }, evidence: "手心腹部热提示里热、食积热或阳明热。", note: "可能意味着：中焦或里部有热。可能经：阳明或太阴积滞化热。属性：里热。" },
      { label: "全身灼热，口渴，大便干，尿黄", scores: { yangming: 4 }, evidence: "灼热口渴便干尿黄提示阳明里热明显。", note: "可能意味着：里热伤津。可能经：阳明。属性：阳证、里热。" },
      { label: "身上热但手脚凉，伴怕冷无汗", scores: { taiyang: 3 }, evidence: "身热肢凉伴怕冷无汗，可见表闭阳郁。", note: "可能意味着：表闭，阳气被郁。可能经：太阳伤寒。属性：表寒偏实。" },
      { label: "身上热但手脚厥冷，精神差", scores: { shaoyin: 4, jueyin: 2 }, evidence: "身热肢厥伴精神差，需警惕阴证或复杂重症。", note: "可能意味着：阴证、热深厥深或病情较重。可能经：少阴、厥阴，或需及时评估。" },
      { label: "腹部偏凉，喜按喜暖，便溏", scores: { taiyin: 4 }, evidence: "腹凉喜暖便溏提示太阴中焦虚寒。", note: "可能意味着：脾胃阳气不足。可能经：太阴。属性：里虚寒。" },
      { label: "初摸不热，久按热明显，身体困重", scores: { taiyin: 2, yangming: 1 }, evidence: "久按热、困重可见湿遏热伏。", note: "可能意味着：湿邪困阻，热伏不透。可能经：太阴湿热或湿温倾向。属性：里、湿热或湿滞。" },
      { label: "没有明显温差", none: true, scores: {}, note: "温差线索不明显，继续结合吃喝拉撒睡判断。" }
    ]
  },
  {
    id: "eat",
    title: "5. 吃：食欲如何？",
    options: [
      { label: "食欲明显减退，胃口差", scores: { taiyin: 2, shaoyang: 1 }, evidence: "食欲减退可见脾胃受邪或中焦虚弱，也可见少阳不和。", note: "可能意味着：脾胃运化受影响。可能经：太阴、少阳均可。属性：需结合寒热。" },
      { label: "不想吃，恶心，甚至想吐", scores: { shaoyang: 3 }, evidence: "不欲食恶心欲吐提示少阳胆胃不和。", note: "可能意味着：邪在半表半里，胆胃不和。可能经：少阳。属性：半表半里阳证。" },
      { label: "能吃但口臭、腹胀、大便臭", scores: { yangming: 3, taiyin: 1 }, evidence: "口臭腹胀便臭提示食积化热或里有实滞。", note: "可能意味着：食积、胃肠有热。可能经：阳明或太阴积滞化热。属性：里实热。" },
      { label: "吃了还饿，口渴喜冷", scores: { yangming: 4 }, evidence: "消谷善饥、口渴喜冷提示阳明胃热。", note: "可能意味着：胃热明显。可能经：阳明。属性：里热实。" },
      { label: "吃一点就胀，便溏，腹部喜暖", scores: { taiyin: 4 }, evidence: "食少腹胀便溏喜暖提示太阴脾虚寒。", note: "可能意味着：运化差、中焦虚寒。可能经：太阴。属性：里虚寒。" },
      { label: "发病前明显吃撑、肉食零食冷饮较多", scores: { taiyin: 2, yangming: 2, taiyang: 1 }, evidence: "吃撑后发热咳嗽提示食积夹外感或积滞化热。", note: "可能意味着：外感与中焦积滞同在。可能经：太阳夹太阴/阳明。属性：表里同病。" },
      { label: "食欲基本正常", none: true, scores: {}, note: "吃的方面暂未见明显偏向。" }
    ]
  },
  {
    id: "drink",
    title: "6. 喝：口渴吗？喜欢喝什么？",
    options: [
      { label: "大渴，喜欢冷饮，喝很多", scores: { yangming: 4 }, evidence: "大渴喜冷是阳明里热伤津的重要线索。", note: "可能意味着：里热伤津。可能经：阳明。属性：里热实。" },
      { label: "口干咽干，但喝不多，伴恶心不欲食", scores: { shaoyang: 3 }, evidence: "咽干但饮不多伴恶心，提示少阳不和。", note: "可能意味着：津液输布不利、枢机不利。可能经：少阳。属性：半表半里热。" },
      { label: "不渴，不主动喝水", scores: { taiyin: 2, taiyang: 1 }, evidence: "不渴可见里寒或表证未入里。", note: "可能意味着：寒象或热不明显。可能经：太阴或太阳。属性：寒证或表证。" },
      { label: "喜欢热饮，喝温水舒服", scores: { taiyin: 3 }, evidence: "喜热饮提示中焦虚寒。", note: "可能意味着：胃肠偏寒。可能经：太阴。属性：里虚寒。" },
      { label: "渴但喝水后恶心、欲吐，或水在胃里晃", scores: { taiyin: 3 }, evidence: "饮后欲吐或水声提示水饮内停。", note: "可能意味着：水饮不化。可能经：太阴水饮。属性：里寒饮。" },
      { label: "嘴唇干裂、口臭、尿黄、便干", scores: { yangming: 4 }, evidence: "唇干口臭尿黄便干提示里热较重。", note: "可能意味着：热盛伤津。可能经：阳明。属性：里热伤津。" },
      { label: "喝水没有明显异常", none: true, scores: {}, note: "饮水线索暂不明显。" }
    ]
  },
  {
    id: "stool",
    title: "7. 拉：大便是判断阳明与太阴的关键",
    options: [
      { label: "大便干结、数日不解、臭秽", scores: { yangming: 4 }, evidence: "便干臭秽提示阳明腑实或里实热。", note: "可能意味着：腑气不通，里有实热。可能经：阳明。属性：里实热。" },
      { label: "大便干，伴口臭、腹胀、手心热", scores: { yangming: 3, taiyin: 1 }, evidence: "便干口臭腹胀手心热提示食积化热。", note: "可能意味着：积滞化热。可能经：阳明或太阴积滞化热。属性：里热夹滞。" },
      { label: "大便稀溏、不臭或味轻", scores: { taiyin: 4 }, evidence: "便溏味轻提示太阴脾阳不足。", note: "可能意味着：脾阳不足、运化差。可能经：太阴。属性：里虚寒。" },
      { label: "完谷不化，吃什么拉什么", scores: { taiyin: 3, shaoyin: 2 }, evidence: "完谷不化提示虚寒较重。", note: "可能意味着：中下焦虚寒。可能经：太阴或少阴。属性：里虚寒。" },
      { label: "腹泻黄臭、肛门灼热", scores: { yangming: 3, shaoyang: 1 }, evidence: "黄臭腹泻、肛门灼热提示热利。", note: "可能意味着：里热或湿热。可能经：阳明或少阳阳明。属性：里热。" },
      { label: "腹痛拒按，腹胀硬", scores: { yangming: 3 }, evidence: "腹痛拒按、胀硬偏实证、热结或积滞。", note: "可能意味着：实证或积滞。可能经：阳明。属性：里实。" },
      { label: "腹痛喜按喜暖，按揉后舒服", scores: { taiyin: 3 }, evidence: "腹痛喜按喜暖提示太阴虚寒。", note: "可能意味着：虚寒腹痛。可能经：太阴。属性：里虚寒。" },
      { label: "大便基本正常", none: true, scores: {}, note: "大便暂未提供明显阳明或太阴线索。" }
    ]
  },
  {
    id: "urine",
    title: "8. 撒：小便看津液与寒热",
    options: [
      { label: "尿黄、尿少、味重", scores: { yangming: 2, shaoyang: 1 }, evidence: "尿黄短少味重常与热盛伤津有关。", note: "可能意味着：津液被热耗。可能经：阳明或少阳。属性：里热。" },
      { label: "尿少伴口渴、嘴干、皮肤干", scores: { yangming: 3 }, evidence: "尿少口渴嘴干提示津液受伤。", note: "可能意味着：热盛伤津或水分不足。可能经：阳明。属性：里热伤津。" },
      { label: "小便清长、量多", scores: { taiyin: 2, shaoyin: 2 }, evidence: "尿清长量多偏里寒阳虚。", note: "可能意味着：寒象、阳气不足。可能经：太阴、少阴。属性：里虚寒。" },
      { label: "小便不利，伴口渴但水入即吐", scores: { taiyin: 3, taiyang: 1 }, evidence: "水入即吐、小便不利提示水饮不化。", note: "可能意味着：水饮停留。可能经：太阴水饮或太阳蓄水。属性：水饮证。" },
      { label: "发热中尿明显减少，精神差", scores: { shaoyin: 3, yangming: 1 }, evidence: "发热中尿少伴精神差需警惕脱水或重症。", note: "可能意味着：不宜只按六经居家判断。属性：需及时评估。" },
      { label: "小便正常", none: true, scores: {}, note: "小便暂未见明显寒热津液线索。" }
    ]
  },
  {
    id: "sleep",
    title: "9. 睡：睡姿和睡眠质量",
    options: [
      { label: "踢被、翻滚、烦躁、磨牙", scores: { yangming: 3, shaoyang: 1 }, evidence: "踢被翻滚磨牙提示里热或胃不和。", note: "可能意味着：热扰或积热。可能经：阳明或少阳阳明。属性：里热。" },
      { label: "趴睡、撅屁股睡，伴口臭便干", scores: { yangming: 3, taiyin: 1 }, evidence: "趴睡伴口臭便干提示中焦积滞化热。", note: "可能意味着：胃肠不和、积滞化热。可能经：阳明/太阴积滞化热。属性：里实热或湿热。" },
      { label: "趴睡、蜷缩、腹部怕凉、便溏", scores: { taiyin: 4 }, evidence: "蜷缩腹凉便溏提示太阴虚寒。", note: "可能意味着：腹部虚寒、喜温。可能经：太阴。属性：里虚寒。" },
      { label: "嗜睡、叫醒困难、四肢凉", scores: { shaoyin: 4 }, evidence: "嗜睡叫醒困难伴肢冷提示少阴风险。", note: "可能意味着：阴证或病重。可能经：少阴。属性：虚寒、病重。" },
      { label: "夜咳明显，痰声重，躺下加重", scores: { taiyin: 4 }, evidence: "夜咳痰声重、躺下加重提示痰饮上泛。", note: "可能意味着：寒饮或痰湿上扰。可能经：太阴水饮。属性：里寒饮。" },
      { label: "后半夜或清晨遇冷咳", scores: { taiyin: 2, taiyang: 2 }, evidence: "清晨遇冷咳提示寒饮或表寒未解。", note: "可能意味着：寒饮、肺气不宣。可能经：太阴/太阳。属性：寒证。" },
      { label: "睡中烦热、口干、咽红", scores: { shaoyang: 2, yangming: 2 }, evidence: "睡中烦热口干咽红提示热扰。", note: "可能意味着：郁热或里热。可能经：少阳或阳明。属性：热证。" },
      { label: "睡眠基本正常", none: true, scores: {}, note: "睡眠暂未见明显寒热虚实偏向。" }
    ]
  },
  {
    id: "nose_throat",
    title: "10. 鼻咽：鼻涕、咽喉、扁桃体",
    options: [
      { label: "清涕、喷嚏、鼻塞、怕风怕冷", scores: { taiyang: 4 }, evidence: "清涕喷嚏鼻塞怕冷提示太阳表寒。", note: "可能意味着：外邪在表。可能经：太阳。属性：表寒。" },
      { label: "黄涕、鼻塞重、口臭", scores: { yangming: 3, shaoyang: 1 }, evidence: "黄涕口臭提示表邪化热或里热上蒸。", note: "可能意味着：热象明显。可能经：阳明或少阳。属性：里热。" },
      { label: "咽痒、干咳、清涕", scores: { taiyang: 3 }, evidence: "咽痒干咳清涕提示表邪束肺。", note: "可能意味着：肺气被表邪束住。可能经：太阳。属性：表证。" },
      { label: "咽红、咽痛、发热反复、不欲食", scores: { shaoyang: 3, yangming: 1 }, evidence: "咽红咽痛伴反复热和不欲食提示少阳郁热。", note: "可能意味着：邪在少阳或热郁。可能经：少阳。属性：半表半里热。" },
      { label: "扁桃体红肿化脓、高热、口渴、便干", scores: { yangming: 4, shaoyang: 1 }, evidence: "化脓高热口渴便干提示里热炽盛。", note: "可能意味着：热毒或里热较盛。可能经：阳明，常兼少阳。属性：里实热。" },
      { label: "咽不红或淡红，痰白清稀，怕冷", scores: { taiyang: 2, taiyin: 2 }, evidence: "咽淡、白稀痰、怕冷提示寒证或表寒。", note: "可能意味着：寒象为主。可能经：太阳/太阴。属性：寒证。" },
      { label: "鼻咽没有明显异常", none: true, scores: {}, note: "鼻咽线索暂不明显。" }
    ]
  },
  {
    id: "cough",
    title: "11. 咳嗽专项：怎么咳？有没有痰？",
    options: [
      { label: "初起咳嗽，咳声清亮，伴怕冷清涕", scores: { taiyang: 4 }, evidence: "初起清亮咳伴怕冷清涕提示表邪犯肺。", note: "可能意味着：外邪在表，肺气不宣。可能经：太阳。属性：表寒。" },
      { label: "干咳、咽痒、鼻塞、无明显黄痰", scores: { taiyang: 3 }, evidence: "干咳咽痒鼻塞多为表证或津液未布。", note: "可能意味着：表邪束肺。可能经：太阳。属性：表证为主。" },
      { label: "咳声重浊，痰多白稀，躺下加重", scores: { taiyin: 4 }, evidence: "痰多白稀躺下重提示寒饮上犯于肺。", note: "可能意味着：寒饮痰湿上扰。可能经：太阴水饮。属性：里寒饮。" },
      { label: "痰白稀，遇冷加重，清晨明显", scores: { taiyin: 3, taiyang: 2 }, evidence: "白稀痰遇冷清晨重提示太阳夹太阴。", note: "可能意味着：表寒未解兼里有寒饮。可能经：太阳夹太阴。属性：表寒兼里寒。" },
      { label: "黄痰、黏稠、难咳，咽红口渴", scores: { yangming: 4 }, evidence: "黄稠痰难咳咽红口渴提示阳明肺热。", note: "可能意味着：热邪炼液成痰。可能经：阳明肺热。属性：里热。" },
      { label: "咳嗽阵作，面红，咽干，恶心不欲食", scores: { shaoyang: 4 }, evidence: "阵咳伴咽干恶心不欲食提示少阳气机不利。", note: "可能意味着：枢机不利、气机上逆。可能经：少阳。属性：半表半里热。" },
      { label: "夜咳明显，伴口臭、腹胀、便干", scores: { yangming: 3, taiyin: 1 }, evidence: "夜咳伴口臭腹胀便干提示胃热食积痰热上扰。", note: "可能意味着：中焦积热上扰于肺。可能经：阳明/太阴积滞化热。属性：里实热。" },
      { label: "咳嗽久不愈，痰多，食欲差，便溏", scores: { taiyin: 4 }, evidence: "久咳痰多纳差便溏提示太阴脾虚生痰。", note: "可能意味着：脾虚生痰。可能经：太阴。属性：里虚寒。" },
      { label: "喘鸣、胸闷、呼吸费力", scores: { shaoyin: 3, yangming: 1 }, evidence: "喘鸣胸闷呼吸费力不宜只按普通咳嗽处理。", note: "可能意味着：需要先排呼吸困难。属性：先排急危，再辨六经。" },
      { label: "咳嗽不明显", none: true, scores: {}, note: "咳嗽线索暂不明显。" }
    ]
  },
  {
    id: "shaoyang_special",
    title: "12. 少阳专项：有没有半表半里的表现？",
    options: [
      { label: "寒热往来，一阵冷一阵热", scores: { shaoyang: 4 }, evidence: "寒热往来是少阳核心线索。", note: "可能意味着：正邪在半表半里交争。可能经：少阳。属性：半表半里。" },
      { label: "发热反复，退而复起", scores: { shaoyang: 3 }, evidence: "发热退而复起提示少阳枢机不利。", note: "可能意味着：邪未外解也未入实里。可能经：少阳。属性：半表半里。" },
      { label: "不欲食、恶心、干呕", scores: { shaoyang: 4 }, evidence: "不欲食恶心干呕提示少阳胆胃不和。", note: "可能意味着：胆胃不和。可能经：少阳。属性：半表半里阳证。" },
      { label: "咽干、咽红、口苦、烦躁", scores: { shaoyang: 3, yangming: 1 }, evidence: "咽干口苦烦躁提示少阳郁热。", note: "可能意味着：郁热在上焦。可能经：少阳。属性：半表半里热。" },
      { label: "咳嗽阵作、胸胁不舒或不让抱紧", scores: { shaoyang: 3 }, evidence: "阵咳、胸胁不舒或拒抱紧提示少阳气机不利。", note: "可能意味着：气机上逆作咳。可能经：少阳。属性：半表半里。" },
      { label: "少阳表现同时有便干、口臭、手心热", scores: { shaoyang: 2, yangming: 3 }, evidence: "少阳线索合并便干口臭手心热，提示少阳阳明合病。", note: "可能意味着：半表半里兼里热。可能经：少阳阳明。属性：半表半里兼里热。" },
      { label: "少阳表现同时有便溏、痰白、食少", scores: { shaoyang: 2, taiyin: 3 }, evidence: "少阳线索合并便溏白痰食少，提示少阳太阴合病。", note: "可能意味着：半表半里兼里虚寒。可能经：少阳太阴。属性：半表半里兼里虚寒。" },
      { label: "没有明显少阳表现", none: true, scores: {}, note: "少阳专项暂未见明显线索。" }
    ]
  },
  {
    id: "abdomen",
    title: "13. 腹部：肚子胀不胀？按着舒服吗？",
    options: [
      { label: "腹胀、拒按、口臭、便干", scores: { yangming: 4 }, evidence: "腹胀拒按口臭便干提示阳明里实。", note: "可能意味着：积滞、热结或里实。可能经：阳明。属性：里实热。" },
      { label: "腹胀但喜按，吃少便溏", scores: { taiyin: 4 }, evidence: "腹胀喜按、食少便溏提示太阴脾虚。", note: "可能意味着：脾虚运化差。可能经：太阴。属性：里虚寒。" },
      { label: "腹部热于后背，手心热", scores: { yangming: 3 }, evidence: "腹热手心热提示中焦有热。", note: "可能意味着：胃肠热或积热。可能经：阳明或积滞化热。属性：里热。" },
      { label: "腹部凉，喜热敷，趴睡", scores: { taiyin: 4 }, evidence: "腹凉喜热敷趴睡提示中焦虚寒。", note: "可能意味着：中焦虚寒。可能经：太阴。属性：里虚寒。" },
      { label: "胃中有水声，痰多白稀，躺下咳", scores: { taiyin: 4 }, evidence: "水声、白稀痰、躺下咳提示太阴水饮。", note: "可能意味着：水饮内停。可能经：太阴水饮。属性：里寒饮。" },
      { label: "肋下不适、拒碰两胁，伴恶心发热反复", scores: { shaoyang: 4 }, evidence: "胁下不适、恶心、反复热提示少阳枢机不利。", note: "可能意味着：半表半里气机不利。可能经：少阳。属性：半表半里。" },
      { label: "腹部没有明显异常", none: true, scores: {}, note: "腹部线索暂不明显。" }
    ]
  },
  {
    id: "tongue_face",
    title: "14. 舌象与面色：只作辅助，不单独定证",
    options: [
      { label: "舌淡、苔白滑，痰白稀，便溏", scores: { taiyin: 4 }, evidence: "舌淡苔白滑、白稀痰便溏提示寒湿水饮。", note: "可能意味着：寒湿或水饮。可能经：太阴。属性：里虚寒或寒饮。" },
      { label: "舌红、苔黄，口渴尿黄", scores: { yangming: 4 }, evidence: "舌红苔黄、口渴尿黄提示阳明里热。", note: "可能意味着：里热明显。可能经：阳明。属性：里热。" },
      { label: "苔黄腻，口臭，腹胀", scores: { yangming: 3, taiyin: 1 }, evidence: "苔黄腻口臭腹胀提示湿热或食积化热。", note: "可能意味着：湿热或食积。可能经：阳明/太阴积滞化热。属性：里热夹湿滞。" },
      { label: "苔薄白，清涕怕冷", scores: { taiyang: 3 }, evidence: "苔薄白、清涕怕冷提示太阳表证。", note: "可能意味着：外邪在表。可能经：太阳。属性：表证。" },
      { label: "舌红少苔，干咳少痰，唇干", scores: { yangming: 2, shaoyin: 2 }, evidence: "舌红少苔、干咳唇干提示津液受伤。", note: "可能意味着：热伤津或久咳伤津。可能经：阳明热伤津或少阴热化。属性：热、津伤。" },
      { label: "面色苍白、口周发青、四肢冷、精神差", scores: { shaoyin: 4 }, evidence: "面白口周青、肢冷精神差提示少阴风险或病重。", note: "可能意味着：阴证或病情较重。可能经：少阴。属性：虚寒、需谨慎。" },
      { label: "暂时看不清舌象面色", none: true, scores: {}, note: "舌象容易受饮食影响，不能单独定证。" }
    ]
  },
  {
    id: "constitution",
    title: "15. 既往体质与用药反应",
    options: [
      { label: "反复外感，动则汗出，平时容易感冒", scores: { taiyang: 2, taiyin: 1 }, evidence: "反复外感、动则汗出提示太阳表虚或卫外不固。", note: "可能意味着：表虚、卫外不固。可能经：太阳表虚，也可兼太阴虚。属性：虚证。" },
      { label: "反复咳嗽、痰多、食欲差、便溏", scores: { taiyin: 4 }, evidence: "久咳痰多纳差便溏提示太阴脾虚生痰。", note: "可能意味着：脾虚痰湿体质。可能经：太阴。属性：里虚寒、痰湿。" },
      { label: "反复扁桃体红肿、咽痛、高热", scores: { shaoyang: 2, yangming: 3 }, evidence: "反复咽扁桃体热象提示少阳/阳明郁热体质倾向。", note: "可能意味着：郁热或里热容易上扰咽喉。可能经：少阳/阳明。属性：热证。" },
      { label: "长期鼻炎、清涕、遇冷咳", scores: { taiyang: 2, taiyin: 3 }, evidence: "鼻炎清涕遇冷咳提示太阳表寒夹太阴寒饮。", note: "可能意味着：表寒与寒饮同在。可能经：太阳夹太阴。属性：表寒兼里寒饮。" },
      { label: "平时手心热、口臭、磨牙、便干", scores: { yangming: 4 }, evidence: "手心热口臭磨牙便干提示阳明或食积化热。", note: "可能意味着：积热或胃肠热。可能经：阳明。属性：里热或食积化热。" },
      { label: "退烧后精神仍差、四肢凉", scores: { shaoyin: 4 }, evidence: "退热后精神差肢冷提示阴证或正气受损。", note: "可能意味着：不能只看体温下降。可能经：少阴。属性：阴证、虚寒、需谨慎。" },
      { label: "寒凉药后胃口差、便溏、痰多、咳嗽拖长", scores: { taiyin: 4 }, evidence: "寒凉药后便溏痰多提示太阴受伤、寒饮加重。", note: "可能意味着：脾胃阳气受损。可能经：太阴。属性：里虚寒、痰饮。" },
      { label: "温散药后咽痛、便干、烦躁加重", scores: { yangming: 3, shaoyang: 1 }, evidence: "温散后咽痛便干烦躁加重提示里热未辨或助热。", note: "可能意味着：热象被推动。可能经：阳明或少阳阳明。属性：里热。" },
      { label: "没有明显既往体质线索", none: true, scores: {}, note: "体质线索暂不明显，本次仍以当前症状为主。" }
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
  { name: "小儿解表颗粒", syndromes: ["taiyang", "yangming"], ingredients: ["金银花", "连翘", "炒牛蒡子", "葛根", "荆芥穗", "紫苏叶", "防风", "蒲公英", "黄芩", "牛黄"], effect: "宣肺解表，清热解毒。", suitable: "小儿外感发热，咽红咽痛、鼻塞、咳嗽兼热象。", caution: "寒象明显、清稀白痰、大便稀者慎用。" },
  { name: "儿感清口服液", syndromes: ["taiyang", "shaoyang", "taiyin"], ingredients: ["荆芥穗", "薄荷", "化橘红", "黄芩", "紫苏叶", "法半夏", "桔梗", "甘草"], effect: "解表清热，宣肺化痰。", suitable: "感冒发热兼痰多、咳嗽、恶心、食欲差。", caution: "高热便秘、黄痰黏稠突出者可能力度不足。" },
  { name: "双黄连口服液", syndromes: ["yangming"], ingredients: ["金银花", "黄芩", "连翘"], effect: "疏风解表，清热解毒。", suitable: "风热外感，发热、咽痛、口干、热象偏明显。", caution: "怕冷清涕、白痰、便稀或脾胃虚寒者慎用。" },
  { name: "银翘解毒颗粒", syndromes: ["taiyang", "yangming"], ingredients: ["金银花", "连翘", "薄荷", "荆芥", "淡豆豉", "牛蒡子", "桔梗", "淡竹叶", "甘草"], effect: "疏风解表，清热解毒。", suitable: "风热外感，发热、咽红咽痛、舌红苔薄黄。", caution: "怕冷重、清涕白痰、无汗表寒明显者慎用。" },
  { name: "蓝芩口服液", syndromes: ["yangming"], ingredients: ["板蓝根", "黄芩", "栀子", "黄柏", "胖大海"], effect: "清热解毒，利咽消肿。", suitable: "咽红咽痛、口干咽干、里热或少阳郁热偏重。", caution: "偏寒凉，腹泻、腹痛、脾胃虚寒者慎用。" },
  { name: "蒲地蓝口服液", syndromes: ["yangming"], ingredients: ["蒲公英", "苦地丁", "板蓝根", "黄芩"], effect: "清热解毒，抗炎消肿。", suitable: "咽喉红肿疼痛、热毒偏盛、发热兼咽部热象。", caution: "偏寒凉，腹泻、食少、寒象明显者慎用。" },
  { name: "芩香清解口服液", syndromes: ["shaoyang", "yangming"], ingredients: ["黄芩", "广藿香", "蝉蜕", "石膏", "葛根", "大黄", "芍药", "板蓝根", "桔梗", "玄参", "山豆根", "甘草"], effect: "清热解毒，疏风透表，利咽退热。", suitable: "高热、咽痛、口渴、便干，少阳阳明合病线索。", caution: "药性偏寒凉，便稀、脾胃弱者慎用。" },
  { name: "连花清瘟胶囊", syndromes: ["taiyang", "yangming"], ingredients: ["连翘", "金银花", "炙麻黄", "炒苦杏仁", "石膏", "板蓝根", "绵马贯众", "鱼腥草", "广藿香", "大黄", "红景天", "薄荷脑", "甘草"], effect: "清瘟解毒，宣肺泄热。", suitable: "流感样外感属热毒袭肺，发热或高热、肌肉酸痛、咳嗽咽痛。", caution: "含麻黄、大黄，儿童须按说明或遵医嘱；风寒白痰便稀者慎用。" },
  { name: "小儿感冒宁糖浆", syndromes: ["taiyang", "yangming", "taiyin"], ingredients: ["薄荷", "荆芥穗", "苦杏仁", "牛蒡子", "黄芩", "桔梗", "前胡", "白芷", "炒栀子", "焦山楂", "焦神曲", "焦麦芽", "芦根", "金银花", "连翘"], effect: "疏风解表，清热止咳，消食导滞。", suitable: "感冒夹滞，发热咳嗽兼腹胀、口气、食积。", caution: "无积滞或大便偏稀者不宜盲用。" },
  { name: "四磨汤口服液", syndromes: ["yangming"], ingredients: ["木香", "枳壳", "乌药", "槟榔"], effect: "顺气降逆，消积止痛。", suitable: "食积气滞，口臭、腹胀腹痛、大便硬或臭稀。", caution: "体虚气弱、清稀腹泻或无积滞者慎用。" },
  { name: "通宣理肺颗粒", syndromes: ["taiyang", "taiyin"], ingredients: ["紫苏叶", "前胡", "桔梗", "苦杏仁", "麻黄", "甘草", "陈皮", "半夏", "茯苓", "枳壳", "黄芩"], effect: "解表散寒，宣肺止嗽。", suitable: "风寒束表兼痰湿，鼻塞流涕、头痛无汗、咳嗽白痰。", caution: "含麻黄，里热黄痰便干时不宜单独使用。" },
  { name: "小青龙颗粒", syndromes: ["taiyang", "taiyin"], ingredients: ["麻黄", "桂枝", "白芍", "干姜", "细辛", "炙甘草", "法半夏", "五味子"], effect: "解表化饮，止咳平喘。", suitable: "外寒内饮，怕冷、清涕、白痰清稀、咳嗽痰多。", caution: "含麻黄、细辛，儿童需按说明或遵医嘱；黄痰咽红里热者慎用。" },
  { name: "二陈丸", syndromes: ["taiyin"], ingredients: ["陈皮", "半夏", "茯苓", "甘草"], effect: "燥湿化痰，理气和胃。", suitable: "太阴痰湿，咳嗽痰白、痰多、腹胀、恶心。", caution: "黄痰黏稠、咽红口渴等痰热明显者慎用。" },
  { name: "橘红痰咳颗粒", syndromes: ["taiyin"], ingredients: ["化橘红", "百部", "苦杏仁", "茯苓", "半夏", "五味子", "甘草"], effect: "理肺祛痰，止咳平喘。", suitable: "痰湿咳嗽，痰多、白痰或痰鸣。", caution: "痰黄黏稠、发热咽红等痰热偏重者需重辨。" },
  { name: "小儿宝泰康颗粒", syndromes: ["shaoyang", "yangming"], ingredients: ["连翘", "地黄", "滇柴胡", "玄参", "桑叶", "浙贝母", "蒲公英", "南板蓝根", "滇紫草", "桔梗", "莱菔子", "甘草"], effect: "清热解表，止咳化痰。", suitable: "少阳郁热、咽红咳嗽、痰热或风热线索。", caution: "便稀、脾胃虚寒者慎用。" },
  { name: "小儿咳喘宁口服液", syndromes: ["taiyang", "yangming"], ingredients: ["麻黄", "石膏", "苦杏仁", "桔梗", "百部", "罂粟壳", "甘草"], effect: "宣肺清热，止咳平喘。", suitable: "痰热咳喘、咳嗽较剧、喘促线索。", caution: "含罂粟壳，不可长期或超量，儿童须遵医嘱。" },
  { name: "小儿黄金止咳颗粒", syndromes: ["yangming"], ingredients: ["黄芩", "金荞麦", "蜜枇杷叶", "浙贝母", "虎杖", "甘草"], effect: "清热宣肺，化痰止咳。", suitable: "咽部热象、黄痰或痰热咳嗽。", caution: "寒咳白痰、便稀者慎用。" },
  { name: "小儿咳嗽宁糖浆", syndromes: ["yangming", "taiyin"], ingredients: ["桑叶", "桑白皮", "桔梗", "前胡", "焦神曲", "焦麦芽", "焦山楂", "黄芩", "枇杷叶", "瓜蒌", "浙贝母", "陈皮", "杏仁", "芦根", "牛蒡子"], effect: "宣肺止咳，清热化痰，消食和中。", suitable: "咳嗽兼积食、痰热或咽部热象。", caution: "大便稀、脾虚明显者慎用。" },
  { name: "小儿咳喘灵口服液", syndromes: ["taiyang", "yangming"], ingredients: ["麻黄", "金银花", "苦杏仁", "板蓝根", "石膏", "甘草", "瓜蒌"], effect: "宣肺清热，止咳平喘。", suitable: "外感发热、咳嗽喘促，兼痰热或咽部热象。", caution: "寒咳白痰、便稀体虚者慎用；含麻黄。" },
  { name: "小儿咳喘灵颗粒", syndromes: ["taiyang", "yangming"], ingredients: ["麻黄", "石膏", "苦杏仁", "瓜蒌", "板蓝根", "金银花", "甘草"], effect: "宣肺清热，止咳平喘。", suitable: "发热咳喘、黄痰或肺热线索。", caution: "寒咳白痰、畏寒明显者慎用；含麻黄。" },
  { name: "宝咳宁颗粒", syndromes: ["taiyang", "yangming", "taiyin"], ingredients: ["紫苏叶", "桑叶", "前胡", "浙贝母", "麻黄", "桔梗", "制天南星", "陈皮", "炒苦杏仁", "黄芩", "青黛", "天花粉", "枳壳", "山楂", "甘草", "人工牛黄"], effect: "清热解表，止嗽化痰。", suitable: "表证兼痰热、食滞咳嗽。", caution: "成分层次多，体虚便稀者慎用。" },
  { name: "小儿肺咳颗粒", syndromes: ["taiyin", "yangming"], ingredients: ["人参", "茯苓", "白术", "陈皮", "鸡内金", "酒大黄", "鳖甲", "地骨皮", "北沙参", "炙甘草", "青蒿", "麦冬", "桂枝", "干姜", "淡附片", "瓜蒌", "款冬花", "紫菀", "桑白皮", "胆南星", "黄芪", "枸杞子"], effect: "健脾益肺，止咳平喘，化痰清热。", suitable: "迁延咳嗽、脾虚痰盛、正虚夹痰热线索。", caution: "含淡附片等温阳药，儿童不宜自行长期使用。" },
  { name: "小儿消积止咳口服液", syndromes: ["yangming", "taiyin"], ingredients: ["山楂", "槟榔", "枳实", "枇杷叶", "瓜蒌", "莱菔子", "葶苈子", "桔梗", "连翘", "蝉蜕"], effect: "清热肃肺，消积止咳。", suitable: "食积咳嗽，夜咳重、痰鸣、腹胀、口臭。", caution: "体虚、肺虚久咳、大便溏薄者慎用；低龄儿童按说明或遵医嘱。" },
  { name: "急支糖浆", syndromes: ["yangming"], ingredients: ["鱼腥草", "金荞麦", "四季青", "麻黄", "紫菀", "前胡", "枳壳", "甘草"], effect: "清热化痰，宣肺止咳。", suitable: "急性痰热咳嗽、黄痰、咳嗽较重。", caution: "寒咳白痰或体虚者慎用。" },
  { name: "肺力咳合剂", syndromes: ["yangming"], ingredients: ["黄芩", "前胡", "百部", "红花龙胆", "梧桐根", "白花蛇舌草", "红管药"], effect: "清热解毒，镇咳祛痰。", suitable: "郁热咳嗽、咽喉不适、痰热偏重。", caution: "脾胃虚寒、便稀者慎用。" },
  { name: "贝羚胶囊", syndromes: ["yangming", "jueyin"], ingredients: ["川贝母", "羚羊角", "猪去氧胆酸", "麝香", "沉香", "人工天竺黄", "青礞石", "硼砂"], effect: "清热化痰，镇惊开窍。", suitable: "痰热壅盛、咳喘痰鸣兼烦躁惊惕等复杂线索。", caution: "成分特殊，儿童须医生指导，不建议自行使用。" },
  { name: "小儿肺热咳喘颗粒", syndromes: ["yangming", "taiyang"], ingredients: ["麻黄", "苦杏仁", "石膏", "甘草", "金银花", "连翘", "知母", "黄芩", "板蓝根", "麦冬", "鱼腥草"], effect: "清热解毒，宣肺止咳，化痰平喘。", suitable: "肺热咳喘、发热、黄痰、咽痛。", caution: "寒咳白痰、便稀、畏寒明显者慎用；含麻黄。" },
  { name: "馥感啉口服液", syndromes: ["taiyin", "yangming"], ingredients: ["鬼针草", "野菊花", "西洋参", "黄芪", "板蓝根", "香菇", "浙贝母", "麻黄", "前胡", "甘草"], effect: "清热解毒，止咳平喘，益气扶正。", suitable: "迁延咳嗽、正气不足兼热象。", caution: "急性高热痰热重时需就医判断。" },
  { name: "羚贝止咳糖浆", syndromes: ["taiyin", "yangming"], ingredients: ["紫菀", "茯苓", "麻黄", "知母", "金银花", "陈皮", "半夏", "前胡", "远志", "平贝母", "罂粟壳", "山楂", "羚羊角"], effect: "宣肺化痰，清热止咳。", suitable: "迁延咳嗽兼痰热、痰湿。", caution: "含罂粟壳，不可长期使用，须遵医嘱。" },
  { name: "小儿麻甘颗粒", syndromes: ["yangming", "taiyang"], ingredients: ["麻黄", "黄芩", "桑白皮", "紫苏子", "苦杏仁", "地骨皮", "甘草", "石膏"], effect: "平喘止咳，利咽祛痰。", suitable: "肺热咳喘、痰黄、喘促。", caution: "含麻黄，寒咳白痰、心悸或体虚者慎用。" },
  { name: "金振口服液", syndromes: ["yangming"], ingredients: ["羚羊角", "平贝母", "大黄", "青礞石", "黄芩", "生石膏", "人工牛黄", "甘草"], effect: "清热解毒，祛痰止咳。", suitable: "痰热闭肺、咳喘热重、痰黄黏稠。", caution: "药性较猛，便稀、脾虚、低龄儿童需医生指导。" },
  { name: "小儿宣肺止咳颗粒", syndromes: ["taiyang", "yangming", "taiyin"], ingredients: ["麻黄", "竹叶防风", "西南黄芩", "桔梗", "芥子", "苦杏仁", "葶苈子", "马兰", "黄芪", "山药", "山楂", "甘草"], effect: "宣肺解表，清热化痰，止咳平喘。", suitable: "太阳表证咳嗽、初起白痰或外感咳嗽。", caution: "痰热很重或便稀体虚者需辨证。" },
  { name: "小儿清肺化痰颗粒", syndromes: ["taiyang", "yangming"], ingredients: ["麻黄", "石膏", "苦杏仁", "前胡", "黄芩", "炒紫苏子", "葶苈子", "竹茹"], effect: "清热化痰，止咳平喘。", suitable: "黄痰黏稠、肺热咳嗽、咽痛热象。", caution: "白痰清稀、畏寒明显者慎用。" },
  { name: "小儿清肺颗粒", syndromes: ["yangming", "taiyin"], ingredients: ["茯苓", "清半夏", "川贝母", "百部", "黄芩", "胆南星", "石膏", "沉香", "白前", "冰片"], effect: "清肺化痰，止咳平喘。", suitable: "痰热夹痰湿咳嗽。", caution: "寒咳、胃寒、便稀者慎用。" },
  { name: "小儿定喘口服液", syndromes: ["taiyin", "yangming"], ingredients: ["麻黄", "炒苦杏仁", "莱菔子", "葶苈子", "紫苏子", "黄芩", "桑白皮", "石膏", "大青叶", "鱼腥草", "甘草"], effect: "清热化痰，宣肺定喘。", suitable: "肺热咳喘、痰多气急、黄痰。", caution: "寒咳白痰、体虚或心悸者慎用；含麻黄。" },
  { name: "小儿清热利肺口服液", syndromes: ["yangming", "taiyang"], ingredients: ["金银花", "连翘", "石膏", "麻黄", "苦杏仁", "炒牛蒡子", "射干", "瓜蒌皮", "浮海石", "炒葶苈子", "盐炙车前子"], effect: "清热解毒，宣肺止咳，利肺化痰。", suitable: "发热咳嗽、咽痛、黄痰、肺热明显。", caution: "寒咳白痰、便稀体虚者慎用；含麻黄。" },
  { name: "小儿荆杏止咳颗粒", syndromes: ["taiyang", "yangming"], ingredients: ["荆芥", "矮地茶", "蜜麻黄", "苦杏仁", "黄芩", "前胡", "法半夏", "浮石", "蝉蜕", "陈皮", "紫草", "甘草"], effect: "疏风宣肺，清热化痰，止咳。", suitable: "外感咳嗽兼少阳郁热。", caution: "纯里热或脾虚便稀需重辨；含蜜麻黄。" },
  { name: "黄龙止咳颗粒", syndromes: ["taiyang", "taiyin", "yangming"], ingredients: ["黄芪", "地龙", "淫羊藿", "桔梗", "射干", "鱼腥草", "炙麻黄", "山楂", "葶苈子"], effect: "益气补肾，清肺止咳。", suitable: "迁延咳嗽、正虚痰阻兼热象。", caution: "含补益与宣降药，急性高热不宜自行使用。" },
  { name: "儿童清肺丸", syndromes: ["taiyang", "taiyin", "yangming"], ingredients: ["麻黄", "苦杏仁", "石膏", "甘草", "蜜桑白皮", "瓜蒌皮", "黄芩", "板蓝根", "橘红", "法半夏", "炒紫苏子", "葶苈子", "浙贝母", "紫苏叶", "细辛", "薄荷", "蜜枇杷叶", "白前", "前胡", "石菖蒲", "天花粉", "煅青礞石"], effect: "清肺化痰，止嗽定喘。", suitable: "风寒束表兼痰多咳嗽或寒热错杂咳嗽线索。", caution: "含细辛、麻黄等，儿童使用需严格按说明或遵医嘱。" },
  { name: "清宣止咳颗粒", syndromes: ["taiyang", "taiyin"], ingredients: ["桑叶", "薄荷", "苦杏仁", "桔梗", "白芍", "枳壳", "陈皮", "紫菀", "甘草"], effect: "疏风清热，宣肺止咳。", suitable: "风热或郁热初起咳嗽、咽痒。", caution: "痰热壅盛或寒湿白痰多时可能不足。" },
  { name: "四季抗病毒口服液", syndromes: ["taiyang", "yangming"], ingredients: ["鱼腥草", "桔梗", "桑叶", "连翘", "薄荷", "紫苏叶", "苦杏仁", "菊花", "甘草"], effect: "清热解毒，消炎退热。", suitable: "外感咳嗽兼咽痛热象。", caution: "脾虚便稀或寒象明显者慎用。" },
  { name: "小儿清热止咳口服液", syndromes: ["taiyang", "yangming"], ingredients: ["麻黄", "炒苦杏仁", "石膏", "甘草", "黄芩", "板蓝根", "北豆根"], effect: "清热宣肺，平喘利咽。", suitable: "肺热咳嗽、咽痛黄痰。", caution: "白痰清稀、畏寒明显者慎用；含麻黄。" },
  { name: "肺宁口服液", syndromes: ["yangming"], ingredients: ["返魂草"], effect: "清热祛痰，止咳。", suitable: "肺热咳嗽、痰多、咽部热象。", caution: "寒咳白痰、脾胃虚寒者慎用。" },
  { name: "祛痰灵口服液", syndromes: ["yangming"], ingredients: ["鲜竹沥", "鱼腥草"], effect: "清肺化痰，止咳。", suitable: "痰热壅肺，咳嗽痰多、痰黏厚或稠黄。", caution: "寒咳白痰、便溏、脾胃虚寒者慎用。" },
  { name: "蛇胆川贝枇杷膏", syndromes: ["yangming"], ingredients: ["蛇胆汁", "川贝母", "枇杷叶", "桔梗", "水半夏", "薄荷脑"], effect: "润肺止咳，祛痰定喘。", suitable: "咳嗽咽痒、痰热或咽部热象兼痰黏不爽。", caution: "寒咳白痰清稀、便稀或脾胃虚寒者慎用。" },
  { name: "牛黄蛇胆川贝液", syndromes: ["yangming"], ingredients: ["人工牛黄", "川贝母", "蛇胆汁", "薄荷脑"], effect: "清热化痰，止咳。", suitable: "痰热咳嗽、咽喉不适、黄痰或热象较明显。", caution: "偏寒凉，寒咳白痰、腹泻或脾胃虚寒者慎用。" },
  { name: "京都念慈菴蜜炼川贝枇杷膏", syndromes: ["yangming", "taiyin"], ingredients: ["川贝母", "枇杷叶", "南沙参", "茯苓", "化橘红", "桔梗", "法半夏", "五味子", "瓜蒌子", "款冬花", "远志", "苦杏仁", "生姜", "甘草", "杏仁水", "薄荷脑"], effect: "润肺化痰，止咳平喘，护咽利咽。", suitable: "咳嗽咽痒、痰黏不爽、久咳或咽部不适。", caution: "含糖膏方，寒湿痰多、便稀、糖代谢异常者需谨慎。" }
];

module.exports = {
  syndromes,
  redFlags,
  questions,
  medicines
};
