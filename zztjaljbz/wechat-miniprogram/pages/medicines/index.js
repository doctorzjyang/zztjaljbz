const { syndromes, medicines } = require("../six-channel/data");

function syndromeLabel(keys) {
  return keys.map(key => syndromes[key] ? syndromes[key].name : key).join("、");
}

const herbProfiles = {
  麻黄: { syndromes: ["taiyang", "yangming"], role: "发汗解表、宣肺平喘。偏太阳表寒；与石膏、黄芩等同用时也可用于阳明痰热、肺热咳喘。" },
  桂枝: { syndromes: ["taiyang", "shaoyin"], role: "解肌发表、温通阳气。偏太阳营卫不和；虚寒、阳气不足时也可从少阴思路理解。" },
  葛根: { syndromes: ["taiyang", "yangming"], role: "解肌发表、生津舒项。常用于太阳表证兼项背不舒，也可兼顾阳明津液不足。" },
  柴胡: { syndromes: ["shaoyang"], role: "和解少阳、疏解郁热。常用于寒热往来、胸胁不舒、咽干口苦等半表半里线索。" },
  黄芩: { syndromes: ["shaoyang", "yangming"], role: "清少阳郁热、清肺胃里热。咽痛、黄痰、烦热时常见，但需辨寒热虚实。" },
  石膏: { syndromes: ["yangming"], role: "清阳明气分热。常用于高热、口渴、汗出、烦热或肺胃热盛。" },
  生石膏: { syndromes: ["yangming"], role: "清阳明气分热。常用于高热、口渴、汗出、烦热或肺胃热盛。" },
  大黄: { syndromes: ["yangming"], role: "通腑泄热、导滞。偏阳明里实、便干、腹胀、食积热结线索。" },
  酒大黄: { syndromes: ["yangming"], role: "通腑泄热、导滞。偏阳明里实、便干、腹胀、食积热结线索。" },
  半夏: { syndromes: ["shaoyang", "taiyin"], role: "降逆化痰、和胃止呕。少阳恶心、太阴痰湿咳嗽中都常见。" },
  法半夏: { syndromes: ["shaoyang", "taiyin"], role: "降逆化痰、和胃止呕。少阳恶心、太阴痰湿咳嗽中都常见。" },
  清半夏: { syndromes: ["shaoyang", "taiyin"], role: "降逆化痰、和胃止呕。少阳恶心、太阴痰湿咳嗽中都常见。" },
  水半夏: { syndromes: ["shaoyang", "taiyin"], role: "化痰降逆、和中。多从太阴痰湿、少阳胃气上逆理解。" },
  甘草: { syndromes: ["taiyin", "shaoyin"], role: "调和诸药、益气和中、缓急。常从太阴脾胃和少阴正气不足角度理解。" },
  炙甘草: { syndromes: ["taiyin", "shaoyin"], role: "益气和中、调和诸药。偏太阴虚弱、少阴正气不足时常见。" },
  干姜: { syndromes: ["taiyin", "shaoyin"], role: "温中散寒、回阳助阳。偏太阴里寒和少阴阳虚线索。" },
  细辛: { syndromes: ["taiyang", "shaoyin"], role: "散寒通窍、温肺化饮。可见于太阳表寒，也常与少阴寒化相关。" },
  白芍: { syndromes: ["taiyang", "jueyin"], role: "养阴和营、缓急止痛。太阳营卫不和、厥阴寒热错杂方中常见。" },
  芍药: { syndromes: ["taiyang", "jueyin"], role: "养阴和营、缓急止痛。太阳营卫不和、厥阴寒热错杂方中常见。" },
  连翘: { syndromes: ["yangming", "shaoyang"], role: "清热解毒、疏散郁热。咽痛、热毒、少阳郁热或阳明热象中常见。" },
  金银花: { syndromes: ["yangming"], role: "清热解毒、疏散风热。偏阳明热毒、咽痛、黄痰热象。" },
  板蓝根: { syndromes: ["yangming"], role: "清热解毒、利咽。偏阳明热毒、咽喉红痛线索。" },
  南板蓝根: { syndromes: ["yangming"], role: "清热解毒、利咽。偏阳明热毒、咽喉红痛线索。" },
  蒲公英: { syndromes: ["yangming"], role: "清热解毒、消肿散结。偏阳明热毒、咽喉红肿。" },
  苦地丁: { syndromes: ["yangming"], role: "清热解毒。偏阳明热毒、咽喉肿痛。" },
  栀子: { syndromes: ["yangming"], role: "清热除烦、利湿。偏阳明郁热、烦热、咽痛口苦等。" },
  炒栀子: { syndromes: ["yangming"], role: "清热除烦、利湿。偏阳明郁热、烦热、咽痛口苦等。" },
  黄柏: { syndromes: ["yangming"], role: "清热燥湿。偏里热湿热线索。" },
  知母: { syndromes: ["yangming"], role: "清热滋阴。常用于阳明热盛、津液受伤。" },
  桔梗: { syndromes: ["taiyang", "shaoyang"], role: "宣肺利咽、载药上行。咽喉、肺系症状中常用，可帮助表层和半表半里上焦宣通。" },
  前胡: { syndromes: ["shaoyang", "taiyin"], role: "降气化痰、疏风清肺。咳嗽痰多、胸膈不利时常见。" },
  陈皮: { syndromes: ["taiyin"], role: "理气健脾、燥湿化痰。偏太阴痰湿、食积、腹胀咳痰。" },
  化橘红: { syndromes: ["taiyin"], role: "理气燥湿、化痰止咳。偏太阴痰湿咳嗽。" },
  橘红: { syndromes: ["taiyin"], role: "理气燥湿、化痰止咳。偏太阴痰湿咳嗽。" },
  茯苓: { syndromes: ["taiyin"], role: "健脾渗湿、化饮。偏太阴水湿、痰饮、食欲差。" },
  白术: { syndromes: ["taiyin"], role: "健脾燥湿。偏太阴脾虚湿盛。" },
  苦杏仁: { syndromes: ["taiyang", "taiyin"], role: "降气止咳平喘。外感咳嗽可从太阳肺气不宣理解，痰湿咳嗽可兼太阴。" },
  炒苦杏仁: { syndromes: ["taiyang", "taiyin"], role: "降气止咳平喘。外感咳嗽可从太阳肺气不宣理解，痰湿咳嗽可兼太阴。" },
  杏仁: { syndromes: ["taiyang", "taiyin"], role: "降气止咳平喘。外感咳嗽可从太阳肺气不宣理解，痰湿咳嗽可兼太阴。" },
  枇杷叶: { syndromes: ["taiyin", "yangming"], role: "清肺降逆、化痰止咳。痰湿咳嗽偏太阴，黄痰热咳可兼阳明。" },
  蜜枇杷叶: { syndromes: ["taiyin", "yangming"], role: "清肺降逆、化痰止咳。痰湿咳嗽偏太阴，黄痰热咳可兼阳明。" },
  川贝母: { syndromes: ["taiyin", "yangming"], role: "润肺化痰、清热止咳。痰热或燥咳常见，需结合寒热判断。" },
  浙贝母: { syndromes: ["yangming", "taiyin"], role: "清热化痰、散结。偏痰热、黄痰、咽喉不利。" },
  平贝母: { syndromes: ["taiyin", "yangming"], role: "清肺化痰、止咳。痰热或痰湿咳嗽中常见。" },
  瓜蒌: { syndromes: ["yangming", "taiyin"], role: "清热化痰、宽胸。偏痰热咳嗽、胸膈不利。" },
  瓜蒌皮: { syndromes: ["yangming", "taiyin"], role: "清热化痰、宽胸。偏痰热咳嗽、胸膈不利。" },
  薄荷: { syndromes: ["taiyang", "shaoyang"], role: "疏散风热、利咽透邪。表层风热和少阳郁热咽干中常见。" },
  荆芥: { syndromes: ["taiyang"], role: "疏风解表。偏太阳表证，风寒风热初起均可见配伍。" },
  荆芥穗: { syndromes: ["taiyang"], role: "疏风解表。偏太阳表证，风寒风热初起均可见配伍。" },
  防风: { syndromes: ["taiyang"], role: "祛风解表、胜湿止痛。偏太阳表证、身痛头痛。" },
  羌活: { syndromes: ["taiyang"], role: "散寒祛风、胜湿止痛。偏太阳表寒身痛。" },
  独活: { syndromes: ["taiyang", "shaoyin"], role: "祛风散寒、除湿止痛。表寒身痛可从太阳，深部寒湿可兼少阴。" },
  紫苏叶: { syndromes: ["taiyang", "taiyin"], role: "解表散寒、行气和胃。表寒兼胃气不和、咳嗽痰湿中常见。" },
  桑叶: { syndromes: ["taiyang", "yangming"], role: "疏风清热、清肺润燥。表层风热和肺热咳嗽中常见。" },
  葶苈子: { syndromes: ["yangming", "taiyin"], role: "泻肺降气、化痰平喘。痰热壅肺或痰饮气逆时常见。" },
  莱菔子: { syndromes: ["taiyin", "yangming"], role: "消食化痰、降气。食积痰多偏太阴，积滞化热可兼阳明。" },
  山楂: { syndromes: ["taiyin", "yangming"], role: "消食化积。偏太阴食积，食积化热可兼阳明。" },
  炒山楂: { syndromes: ["taiyin", "yangming"], role: "消食化积。偏太阴食积，食积化热可兼阳明。" },
  焦山楂: { syndromes: ["taiyin", "yangming"], role: "消食化积。偏太阴食积，食积化热可兼阳明。" },
  焦麦芽: { syndromes: ["taiyin"], role: "健脾消食。偏太阴食积、胃纳差。" },
  "六神曲（焦）": { syndromes: ["taiyin"], role: "健脾消食、和胃。偏太阴食积、胃纳差。" },
  人参: { syndromes: ["taiyin", "shaoyin"], role: "益气扶正。偏太阴气虚、少阴正气不足。" },
  黄芪: { syndromes: ["taiyin", "shaoyin"], role: "补气扶正、固表。偏太阴气虚、少阴正气不足。" },
  西洋参: { syndromes: ["shaoyin", "taiyin"], role: "益气养阴。偏正气不足、津液受伤。" },
  地黄: { syndromes: ["shaoyin"], role: "养阴补虚。偏少阴阴液不足、虚热线索需医生辨证。" },
  麦冬: { syndromes: ["shaoyin", "yangming"], role: "养阴生津、润肺。津液不足、热伤津时常见。" },
  附片: { syndromes: ["shaoyin"], role: "温阳救逆。属少阴寒化重要药，儿童必须医生指导。" },
  淡附片: { syndromes: ["shaoyin"], role: "温阳救逆。属少阴寒化重要药，儿童必须医生指导。" },
  羚羊角: { syndromes: ["yangming", "jueyin"], role: "清热息风。高热惊惕、热极动风等复杂情况应医生判断。" },
  人工牛黄: { syndromes: ["yangming", "jueyin"], role: "清热解毒、化痰开窍。热毒痰热或惊惕线索需谨慎使用。" },
  牛黄: { syndromes: ["yangming", "jueyin"], role: "清热解毒、化痰开窍。热毒痰热或惊惕线索需谨慎使用。" },
  蛇胆汁: { syndromes: ["yangming"], role: "清肺化痰。偏痰热咳嗽、黄痰热象。" },
  青黛: { syndromes: ["yangming", "jueyin"], role: "清热解毒、凉肝。偏热毒或风热较重线索。" },
  青礞石: { syndromes: ["yangming", "jueyin"], role: "坠痰下气。痰热壅盛、惊痰等复杂情况需医生指导。" },
  煅青礞石: { syndromes: ["yangming", "jueyin"], role: "坠痰下气。痰热壅盛、惊痰等复杂情况需医生指导。" }
};

function herbProfile(name) {
  const profile = herbProfiles[name] || {
    syndromes: ["taiyin", "yangming"],
    role: "需结合所在方剂、剂量和配伍判断。按胡希恕六经思路，单味药不能脱离寒热、表里、虚实和整体方证单独定用。"
  };
  return {
    name,
    syndromesText: syndromeLabel(profile.syndromes),
    role: profile.role
  };
}

const medicineList = medicines.map(item => ({
  ...item,
  ingredientsText: item.ingredients.join("、"),
  ingredientItems: item.ingredients.map(herbProfile),
  syndromesText: syndromeLabel(item.syndromes)
}));

const channelFilters = [
  { key: "taiyang", name: "太阳" },
  { key: "shaoyang", name: "少阳" },
  { key: "yangming", name: "阳明" },
  { key: "taiyin", name: "太阴" },
  { key: "shaoyin", name: "少阴" },
  { key: "jueyin", name: "厥阴" }
];

function filterMedicines(keyword, activeChannels) {
  const lower = (keyword || "").trim().toLowerCase();
  const selected = activeChannels || [];
  return medicineList.filter(item => {
    const keywordMatched = lower
      ? [
        item.name,
        item.ingredientsText,
        item.effect,
        item.syndromesText,
        item.suitable,
        item.caution
      ].join(" ").toLowerCase().includes(lower)
      : true;
    const channelMatched = selected.length
      ? selected.some(key => item.syndromes.includes(key))
      : true;
    return keywordMatched && channelMatched;
  });
}

function channelMap(keys) {
  const map = {};
  keys.forEach(key => { map[key] = true; });
  return map;
}

Page({
  data: {
    keyword: "",
    channelFilters,
    activeChannels: [],
    activeChannelMap: {},
    totalCount: medicineList.length,
    filteredCount: medicineList.length,
    noResults: false,
    medicines: medicineList
  },

  onSearchInput(event) {
    const keyword = (event.detail.value || "").trim();
    const filtered = filterMedicines(keyword, this.data.activeChannels);
    this.setData({
      keyword,
      medicines: filtered,
      filteredCount: filtered.length,
      noResults: filtered.length === 0
    });
  },

  clearSearch() {
    const filtered = filterMedicines("", this.data.activeChannels);
    this.setData({
      keyword: "",
      medicines: filtered,
      filteredCount: filtered.length,
      noResults: filtered.length === 0
    });
  },

  toggleChannel(event) {
    const key = event.currentTarget.dataset.key;
    const active = this.data.activeChannels.includes(key)
      ? this.data.activeChannels.filter(item => item !== key)
      : [...this.data.activeChannels, key];
    const filtered = filterMedicines(this.data.keyword, active);
    this.setData({
      activeChannels: active,
      activeChannelMap: channelMap(active),
      medicines: filtered,
      filteredCount: filtered.length,
      noResults: filtered.length === 0
    });
  },

  clearChannels() {
    const filtered = filterMedicines(this.data.keyword, []);
    this.setData({
      activeChannels: [],
      activeChannelMap: {},
      medicines: filtered,
      filteredCount: filtered.length,
      noResults: filtered.length === 0
    });
  },

  showHerbInfo(event) {
    const { name, syndromes: syndromesText, role } = event.currentTarget.dataset;
    wx.showModal({
      title: name,
      content: `按胡希恕六经思路常归：${syndromesText}\n\n常见作用：${role}\n\n说明：单味药要放在方剂配伍、剂量、体质和病程里理解，不能作为自行用药依据。`,
      showCancel: false,
      confirmText: "知道了"
    });
  }
});
