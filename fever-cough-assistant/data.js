const APP_DATA = {
  syndromes: {
    taiyang: {
      name: "太阳证",
      position: "表",
      summary: "邪在体表，常见怕冷怕风、鼻塞流涕、头痛身痛、咳嗽初起。",
      direction: "解表宣肺，表证未解时不宜单纯清里。"
    },
    shaoyang: {
      name: "少阳证",
      position: "半表半里",
      summary: "邪在半表半里，常见寒热往来、口苦咽干、胸胁不舒、烦躁或恶心。",
      direction: "和解少阳，疏解郁热。"
    },
    yangming: {
      name: "阳明证",
      position: "里热",
      summary: "里阳实热，常见口干、大便干、口气重、舌苔黄厚腻、黄痰、食积化热。",
      direction: "清里热，化痰热，通腑消积，兼顾津液。"
    },
    taiyin: {
      name: "太阴证",
      position: "里虚寒/痰湿",
      summary: "里阴虚寒或寒湿痰湿，常见大便稀、胃脘胀满、食欲差、畏寒肢冷、白痰多。",
      direction: "健脾化痰，温中和胃，慎用过寒过攻之品。"
    },
    shaoyin: {
      name: "少阴证",
      position: "表里俱虚",
      summary: "精神萎靡、畏寒明显、四肢冷、声音低弱、脉弱等，儿童不宜自行判断用药。",
      direction: "需医生辨证，不建议自行选择中成药。"
    },
    jueyin: {
      name: "厥阴证",
      position: "寒热错杂",
      summary: "上热下寒、寒热错杂、病情复杂或迁延反复，儿童不宜自行判断用药。",
      direction: "需医生辨证，不建议自行选择中成药。"
    }
  },
  redFlags: [
    { id: "age3m", text: "孩子小于3个月且体温达到或超过38℃" },
    { id: "breath", text: "呼吸困难、喘憋、口唇发紫或胸凹明显" },
    { id: "seizure", text: "出现抽搐、意识异常或难以唤醒" },
    { id: "spirit", text: "精神很差、持续嗜睡、明显烦躁无法安抚" },
    { id: "dehydration", text: "尿明显减少、口唇干、哭时少泪，怀疑脱水" },
    { id: "neck", text: "颈项强直、剧烈头痛、畏光或皮疹按压不褪色" },
    { id: "longFever", text: "高热反复、体温接近或超过40℃，或发热超过3天仍不缓解" }
  ],
  questions: [
    {
      id: "main",
      title: "这次主要想判断什么？",
      multi: true,
      options: [
        { label: "发热", tags: ["fever"] },
        { label: "咳嗽", tags: ["cough"] },
        { label: "发热并咳嗽", tags: ["fever", "cough"] }
      ]
    },
    {
      id: "surface",
      title: "有没有明显表证？",
      multi: true,
      options: [
        { label: "怕冷怕风", scores: { taiyang: 3 }, evidence: "怕冷怕风提示表证未解。" },
        { label: "流清鼻涕/鼻塞", scores: { taiyang: 2 }, evidence: "清涕鼻塞常见于太阳表证。" },
        { label: "头痛身痛", scores: { taiyang: 2 }, evidence: "头痛身痛提示邪在肌表。" },
        { label: "眼睑或面部浮肿", scores: { taiyang: 2 }, evidence: "眼睑或面部浮肿可见太阳表证中的风水表现。" },
        { label: "皮肤痒/湿疹样渗出", scores: { taiyang: 1 }, evidence: "皮肤瘙痒、粗糙或渗出也可作为太阳表部反应参考。" },
        { label: "出汗后稍舒服", scores: { taiyang: 1 }, evidence: "汗出后缓解，多与表证相关。" },
        { label: "没有这些情况", scores: {}, evidence: "", none: true }
      ]
    },
    {
      id: "shaoyang",
      title: "有没有半表半里的表现？",
      multi: true,
      options: [
        { label: "一阵冷一阵热", scores: { shaoyang: 3 }, evidence: "寒热往来是少阳证的重要线索。" },
        { label: "口苦/咽干", scores: { shaoyang: 2 }, evidence: "口苦咽干提示少阳郁热。" },
        { label: "胸胁不舒服", scores: { shaoyang: 2 }, evidence: "胸胁不舒符合少阳枢机不利。" },
        { label: "恶心想吐", scores: { shaoyang: 2, taiyin: 1 }, evidence: "恶心可见于少阳，也可兼脾胃不和。" },
        { label: "情绪烦躁", scores: { shaoyang: 1, yangming: 1 }, evidence: "烦躁可见少阳郁热或阳明里热。" },
        { label: "眼耳鼻咽喉红肿疼痛", scores: { shaoyang: 2, yangming: 1 }, evidence: "孔窍部位红肿疼痛可作为少阳实热上冲的参考，也常兼阳明热象。" },
        { label: "没有这些情况", scores: {}, evidence: "", none: true }
      ]
    },
    {
      id: "insideHeat",
      title: "有没有阳明里热、食积或痰热表现？",
      multi: true,
      options: [
        { label: "高热明显", scores: { yangming: 3 }, evidence: "高热明显提示里热偏盛。" },
        { label: "口干/口渴喜冷饮", scores: { yangming: 3 }, evidence: "口干、口渴喜冷饮是阳明里热的重要线索。" },
        { label: "咽红咽痛", scores: { yangming: 2, shaoyang: 1 }, evidence: "咽红咽痛提示热邪上扰。" },
        { label: "口气重", scores: { yangming: 3 }, evidence: "口气重常是胃府实热、食积腐化的表现，偏向阳明。" },
        { label: "大便干结", scores: { yangming: 3 }, evidence: "便干是阳明腑热或积滞的重要依据。" },
        { label: "积食/嗳腐/腹胀拒按", scores: { yangming: 3 }, evidence: "积食伴实热表现时属于阳明食积化热范畴。" },
        { label: "舌苔黄厚腻", scores: { yangming: 3 }, evidence: "舌苔黄厚腻提示湿热、痰热或食积化热内蕴，归阳明里实热方向。" },
        { label: "痰黄黏稠", scores: { yangming: 3 }, evidence: "痰黄黏稠提示里痰热，也属于阳明里热范畴。" },
        { label: "没有这些情况", scores: {}, evidence: "", none: true }
      ]
    },
    {
      id: "taiyin",
      title: "有没有脾胃虚弱或痰湿表现？",
      multi: true,
      options: [
        { label: "食欲差", scores: { taiyin: 2 }, evidence: "食欲差提示脾胃运化不足。" },
        { label: "胃脘或肚子胀满", scores: { taiyin: 2 }, evidence: "胃脘或腹部胀满可见太阴里虚寒、运化不利。" },
        { label: "大便稀/腹泻", scores: { taiyin: 3 }, evidence: "便稀腹泻提示太阴脾虚或寒湿。" },
        { label: "畏寒肢冷", scores: { taiyin: 2, shaoyin: 1 }, evidence: "畏寒肢冷提示里寒或阳气不足，需与阳明食积化热区分。" },
        { label: "舌苔白厚腻", scores: { taiyin: 2 }, evidence: "舌苔白厚腻偏寒湿痰湿，常见太阴运化不利。" },
        { label: "白痰多/清稀痰", scores: { taiyin: 2, taiyang: 1 }, evidence: "白痰清稀多偏寒湿或表寒。" },
        { label: "夜间咳嗽迁延", scores: { taiyin: 2 }, evidence: "夜咳迁延常与痰湿、脾虚或余邪有关。" },
        { label: "没有这些情况", scores: {}, evidence: "", none: true }
      ]
    },
    {
      id: "cough",
      title: "咳嗽痰象更接近哪种？",
      multi: true,
      options: [
        { label: "初起干咳或白痰", scores: { taiyang: 2 }, evidence: "咳嗽初起、干咳或白痰常先看太阳表证。" },
        { label: "黄痰黏稠", scores: { yangming: 3 }, evidence: "黄痰黏稠提示痰热壅肺。" },
        { label: "痰多不易咳出", scores: { yangming: 2, taiyin: 1 }, evidence: "痰多黏稠常需清热化痰，也要看脾胃。" },
        { label: "痰白量多", scores: { taiyin: 3 }, evidence: "痰白量多提示脾虚痰湿偏重。" },
        { label: "咳后想吐", scores: { shaoyang: 1, taiyin: 2 }, evidence: "咳后欲吐多与痰饮、胃气上逆相关。" },
        { label: "没有这些情况", scores: {}, evidence: "", none: true }
      ]
    },
    {
      id: "weakCold",
      title: "有没有明显虚寒或复杂表现？",
      multi: true,
      options: [
        { label: "精神萎靡、手脚冰凉", scores: { shaoyin: 5 }, evidence: "精神差伴四肢冷需警惕少阴类重证。" },
        { label: "低热但非常怕冷", scores: { shaoyin: 4 }, evidence: "低热畏寒且正气不足，不宜自行选药。" },
        { label: "鼻塞流涕但体质虚弱、脉弱或乏力", scores: { shaoyin: 4 }, evidence: "鼻塞流涕若伴体质虚弱、脉沉细无力，应警惕少阴表阴证。" },
        { label: "上热下寒、反复难辨", scores: { jueyin: 4 }, evidence: "寒热错杂、迁延反复需医生辨证。" },
        { label: "既有便干口气重，又有便稀畏寒肢冷", scores: { jueyin: 4, yangming: 1, taiyin: 1 }, evidence: "阳明里热与太阴里寒同时存在时，提示寒热错杂或厥阴方向，需医生辨证。" },
        { label: "没有这些情况", scores: {}, evidence: "", none: true }
      ]
    }
  ],
  ingredientEffects: {
    "麻黄": "宣肺平喘、发散风寒，含此类药物需注意儿童体质和剂量。",
    "桂枝": "解肌发表、温通营卫。",
    "葛根": "解肌退热、生津舒筋。",
    "柴胡": "和解少阳、疏解郁热。",
    "黄芩": "清热燥湿、清少阳肺热。",
    "石膏": "清气分实热、除烦止渴。",
    "金银花": "清热解毒、疏散风热。",
    "连翘": "清热解毒、透散郁热。",
    "薄荷": "疏散风热、利咽透邪。",
    "荆芥": "解表散风。",
    "防风": "祛风解表、胜湿止痛。",
    "紫苏叶": "解表散寒、理气和中。",
    "苦杏仁": "降肺气、止咳平喘。",
    "桔梗": "宣肺利咽、祛痰排脓。",
    "前胡": "降气化痰、宣散风热。",
    "半夏": "燥湿化痰、和胃降逆。",
    "法半夏": "燥湿化痰、和胃止呕。",
    "陈皮": "理气健脾、燥湿化痰。",
    "浙贝母": "清热化痰、散结止咳。",
    "川贝母": "润肺化痰、止咳。",
    "桑叶": "疏散风热、清肺润燥。",
    "桑白皮": "泻肺平喘、利水消肿。",
    "瓜蒌": "清热化痰、宽胸散结。",
    "鱼腥草": "清热解毒、清肺排痰。",
    "板蓝根": "清热解毒、利咽。",
    "大青叶": "清热解毒、凉血利咽。",
    "大黄": "通腑泄热，便稀或脾虚者慎用。",
    "槟榔": "行气消积、下气导滞。",
    "厚朴": "行气除满、燥湿消胀。",
    "莱菔子": "消食除胀、降气化痰。",
    "山楂": "消食化积。",
    "神曲": "消食和胃。",
    "麦芽": "消食健胃。",
    "甘草": "调和诸药、缓急止咳。",
    "黄芪": "益气固表。",
    "人参": "补益元气，外感实热明显时需谨慎。",
    "白术": "健脾燥湿。",
    "茯苓": "健脾渗湿、化痰。",
    "玄参": "清热凉血、滋阴利咽。",
    "地黄": "清热凉血、养阴。",
    "蒲公英": "清热解毒。",
    "青蒿": "清虚热、透伏热。",
    "蝉蜕": "疏风透疹、利咽止痉。",
    "罂粟壳": "强力敛肺止咳，儿童不可长期或随意使用，应遵医嘱。",
    "细辛": "温肺散寒，儿童使用需格外谨慎。",
    "附片": "温阳散寒，儿童不宜自行使用。",
    "羚羊角": "清热镇惊、平肝息风。",
    "人工牛黄": "清热解毒、化痰定惊。",
    "青礞石": "坠痰下气，体虚便稀者慎用。",
    "冰片": "开窍清热、利咽止痛。",
    "五味子": "敛肺止咳、生津，外邪未解痰多时慎用。"
  },
  feverMedicines: [
    { name: "荆防颗粒", syndromes: ["taiyang"], ingredients: ["荆芥", "防风", "羌活", "独活", "柴胡", "前胡", "川芎", "枳壳", "茯苓", "桔梗", "甘草"], suitable: "怕冷、头身痛、清涕、风寒表证偏重。", caution: "咽痛高热、口渴便干明显者不宜单独使用。" },
    { name: "葛根汤颗粒", syndromes: ["taiyang"], ingredients: ["葛根", "麻黄", "桂枝", "生姜", "甘草", "芍药", "大枣"], suitable: "太阳表实，怕冷、无汗、项背紧、身痛。", caution: "汗多、心悸、体虚或高热里热明显者慎用。" },
    { name: "小儿豉翘清热颗粒", syndromes: ["taiyang", "shaoyang", "yangming"], ingredients: ["连翘", "淡豆豉", "薄荷", "荆芥", "炒栀子", "大黄", "青蒿", "赤芍", "槟榔", "厚朴", "黄芩", "半夏", "柴胡", "甘草"], suitable: "发热、咽痛、烦躁、便干或积滞，三阳合病倾向。", caution: "大便稀、脾胃虚弱者慎用；表寒很重时需谨慎。" },
    { name: "小儿柴桂退热颗粒/口服液", syndromes: ["taiyang", "shaoyang"], ingredients: ["柴胡", "桂枝", "葛根", "浮萍", "黄芩", "白芍", "蝉蜕"], suitable: "发热伴怕冷、寒热往来、咽部不适，太阳少阳合病。", caution: "纯阳明高热便秘或明显腹泻者需重新辨证。" },
    { name: "小儿解表颗粒", syndromes: ["taiyang", "yangming"], ingredients: ["金银花", "连翘", "炒牛蒡子", "葛根", "荆芥穗", "紫苏叶", "防风", "蒲公英", "黄芩", "牛黄"], suitable: "外感初起兼咽红咽痛、轻度里热。", caution: "腹泻、食少、畏寒明显者慎用。" },
    { name: "儿感清口服液", syndromes: ["taiyang", "shaoyang", "taiyin"], ingredients: ["荆芥穗", "薄荷", "化橘红", "黄芩", "紫苏叶", "法半夏", "桔梗", "甘草"], suitable: "感冒发热兼痰多、咳嗽、恶心、食欲差。", caution: "高热便秘、黄痰黏稠突出者可能力度不足。" },
    { name: "双黄连口服液", syndromes: ["shaoyang", "yangming"], ingredients: ["金银花", "黄芩", "连翘"], suitable: "表证已轻或无表证，以咽痛、里热为主。", caution: "怕冷、清涕、身痛明显时不宜单独清里。" },
    { name: "芩香清解口服液", syndromes: ["shaoyang", "yangming"], ingredients: ["黄芩", "广藿香", "蝉蜕", "石膏", "葛根", "大黄", "芍药", "板蓝根", "桔梗", "玄参", "山豆根", "甘草"], suitable: "里热偏重、咽痛、高热、便干，少阳阳明合病。", caution: "药性偏寒凉，便稀、脾胃弱者慎用。" },
    { name: "小儿感冒宁糖浆", syndromes: ["taiyang", "yangming", "taiyin"], ingredients: ["薄荷", "荆芥穗", "苦杏仁", "牛蒡子", "黄芩", "桔梗", "前胡", "白芷", "炒栀子", "焦山楂", "焦神曲", "焦麦芽", "芦根", "金银花", "连翘"], suitable: "感冒夹滞，发热兼腹胀、口气、食积。", caution: "无积滞或大便偏稀者不宜盲用。" },
    { name: "小儿感冒退热糖浆", syndromes: ["taiyang", "yangming"], ingredients: ["板蓝根", "大青叶", "连翘", "桑枝", "荆芥", "防风", "紫苏叶"], suitable: "外感发热兼轻度热象，表里同治。", caution: "纯寒证或脾胃虚寒明显者慎用。" }
  ],
  coughMedicines: [
    { name: "小儿宝泰康颗粒", syndromes: ["shaoyang"], ingredients: ["连翘", "地黄", "滇柴胡", "玄参", "桑叶", "浙贝母", "蒲公英", "南板蓝根", "滇紫草", "桔梗", "莱菔子", "甘草"], suitable: "少阳郁热、咽红咳嗽。", caution: "便稀、脾胃虚寒者慎用。" },
    { name: "小儿咳喘宁口服液", syndromes: ["yangming"], ingredients: ["麻黄", "石膏", "苦杏仁", "桔梗", "百部", "罂粟壳", "甘草"], suitable: "痰热咳喘、咳嗽较剧。", caution: "含罂粟壳，不可长期或超量，儿童须遵医嘱。" },
    { name: "小儿黄金止咳颗粒", syndromes: ["shaoyang", "yangming"], ingredients: ["黄芩", "金荞麦", "蜜枇杷叶", "浙贝母", "虎杖", "甘草"], suitable: "咽部热象、黄痰或痰热咳嗽。", caution: "寒咳白痰、便稀者慎用。" },
    { name: "小儿咳嗽宁糖浆", syndromes: ["shaoyang", "yangming", "taiyin"], ingredients: ["桑叶", "桑白皮", "桔梗", "前胡", "焦神曲", "焦麦芽", "焦山楂", "黄芩", "枇杷叶", "瓜蒌", "浙贝母", "陈皮", "杏仁", "芦根", "牛蒡子"], suitable: "咳嗽兼积食、痰热或咽部热象。", caution: "大便稀、脾虚明显者慎用。" },
    { name: "小儿咳喘灵口服液/颗粒", syndromes: ["yangming"], ingredients: ["麻黄", "金银花", "苦杏仁", "板蓝根", "石膏", "甘草", "瓜蒌"], suitable: "肺热咳喘、黄痰、咽红。", caution: "怕冷清涕明显时不宜单独使用。" },
    { name: "宝咳宁颗粒", syndromes: ["taiyang", "yangming", "taiyin"], ingredients: ["紫苏叶", "桑叶", "前胡", "浙贝母", "麻黄", "桔梗", "制天南星", "陈皮", "炒苦杏仁", "黄芩", "青黛", "天花粉", "枳壳", "山楂", "甘草", "人工牛黄"], suitable: "表证兼痰热、食滞咳嗽。", caution: "成分层次多，体虚便稀者慎用。" },
    { name: "小儿肺咳颗粒", syndromes: ["taiyin"], ingredients: ["人参", "茯苓", "白术", "陈皮", "鸡内金", "大黄", "鳖甲", "地骨皮", "北沙参", "甘草", "青蒿", "麦冬", "桂枝", "干姜", "附片", "瓜蒌", "款冬花", "紫菀", "桑白皮", "胆南星", "黄芪", "枸杞子"], suitable: "迁延咳嗽、脾虚痰盛。", caution: "含附片等温阳药，儿童不宜自行长期使用。" },
    { name: "急支糖浆", syndromes: ["yangming"], ingredients: ["鱼腥草", "金荞麦", "四季青", "麻黄", "紫菀", "前胡", "枳壳", "甘草"], suitable: "急性痰热咳嗽、黄痰。", caution: "寒咳白痰或体虚者慎用。" },
    { name: "肺力咳合剂", syndromes: ["shaoyang", "yangming"], ingredients: ["黄芩", "前胡", "百部", "红花龙胆", "梧桐根", "白花蛇舌草", "红管药"], suitable: "郁热咳嗽、咽喉不适。", caution: "脾胃虚寒、便稀慎用。" },
    { name: "贝羚胶囊", syndromes: ["yangming"], ingredients: ["川贝母", "羚羊角", "猪去氧胆酸", "麝香", "沉香", "人工天竺黄", "青礞石", "硼砂"], suitable: "痰热惊烦类情况需医生判断。", caution: "儿童不建议自行使用。" },
    { name: "小儿肺热咳喘颗粒", syndromes: ["yangming"], ingredients: ["麻黄", "苦杏仁", "石膏", "甘草", "金银花", "连翘", "知母", "黄芩", "板蓝根", "麦冬", "鱼腥草"], suitable: "肺热咳喘、黄痰、口渴、咽红。", caution: "表寒明显或便稀者慎用。" },
    { name: "馥感啉口服液", syndromes: ["taiyin", "shaoyang"], ingredients: ["鬼针草", "野菊花", "西洋参", "黄芪", "板蓝根", "香菇", "浙贝母", "麻黄", "前胡", "甘草"], suitable: "迁延咳嗽、正气不足兼热象。", caution: "急性高热痰热重时需就医判断。" },
    { name: "羚贝止咳糖浆", syndromes: ["shaoyang", "taiyin"], ingredients: ["紫菀", "茯苓", "麻黄", "知母", "金银花", "陈皮", "半夏", "前胡", "远志", "平贝母", "罂粟壳", "山楂", "羚羊角"], suitable: "迁延咳嗽兼痰热。", caution: "含罂粟壳，不可长期使用，须遵医嘱。" },
    { name: "小儿麻甘颗粒", syndromes: ["yangming"], ingredients: ["麻黄", "黄芩", "桑白皮", "紫苏子", "苦杏仁", "地骨皮", "甘草", "石膏"], suitable: "肺热喘咳、黄痰。", caution: "寒咳、体虚多汗者慎用。" },
    { name: "金振口服液", syndromes: ["yangming"], ingredients: ["羚羊角", "平贝母", "大黄", "青礞石", "黄芩", "生石膏", "人工牛黄", "甘草"], suitable: "痰热闭肺、咳喘热重。", caution: "药性较猛，便稀、脾虚、低龄儿童需医生指导。" },
    { name: "宣肺止咳颗粒", syndromes: ["taiyang"], ingredients: ["麻黄", "竹叶防风", "西南黄芩", "桔梗", "芥子", "苦杏仁", "葶苈子", "马兰", "黄芪", "山药", "山楂", "甘草"], suitable: "太阳表证咳嗽、初起白痰。", caution: "痰热很重或便稀体虚者需辨证。" },
    { name: "小儿清肺化痰颗粒", syndromes: ["yangming"], ingredients: ["麻黄", "石膏", "苦杏仁", "前胡", "黄芩", "紫苏子", "葶苈子", "竹茹"], suitable: "黄痰黏稠、肺热咳嗽。", caution: "白痰清稀、怕冷明显时慎用。" },
    { name: "小儿清肺颗粒", syndromes: ["yangming", "taiyin"], ingredients: ["茯苓", "清半夏", "川贝母", "百部", "黄芩", "胆南星", "石膏", "沉香", "白前", "冰片"], suitable: "痰热夹痰湿咳嗽。", caution: "寒咳、胃寒者慎用。" },
    { name: "小儿定喘口服液", syndromes: ["yangming"], ingredients: ["麻黄", "苦杏仁", "莱菔子", "葶苈子", "紫苏子", "黄芩", "桑白皮", "石膏", "大青叶", "鱼腥草", "甘草"], suitable: "肺热咳喘、痰多气急。", caution: "喘憋明显先就医，不要用网页结果延误。" },
    { name: "小儿清热利肺口服液", syndromes: ["yangming"], ingredients: ["金银花", "连翘", "石膏", "麻黄", "苦杏仁", "牛蒡子", "射干", "瓜蒌皮", "浮海石", "葶苈子", "车前子"], suitable: "肺热黄痰、咽痛、痰黏。", caution: "大便稀、表寒重者慎用。" },
    { name: "小儿荆杏止咳颗粒", syndromes: ["taiyang", "shaoyang"], ingredients: ["荆芥", "矮地茶", "麻黄", "苦杏仁", "黄芩", "前胡", "法半夏", "浮石", "蝉蜕", "陈皮", "紫草", "甘草"], suitable: "外感咳嗽兼少阳郁热。", caution: "纯里热或脾虚便稀需重辨。" },
    { name: "黄龙止咳颗粒", syndromes: ["taiyin"], ingredients: ["黄芪", "地龙", "淫羊藿", "桔梗", "射干", "鱼腥草", "麻黄", "山楂", "葶苈子"], suitable: "迁延咳嗽、正虚痰阻。", caution: "含补益与宣降药，急性高热不宜自行使用。" },
    { name: "儿童清肺丸", syndromes: ["taiyang", "taiyin"], ingredients: ["麻黄", "苦杏仁", "石膏", "甘草", "桑白皮", "瓜蒌皮", "黄芩", "板蓝根", "橘红", "法半夏", "紫苏子", "葶苈子", "浙贝母", "紫苏叶", "细辛", "薄荷", "枇杷叶", "白前", "前胡", "石菖蒲", "天花粉", "青礞石"], suitable: "风寒束表兼痰多咳嗽。", caution: "含细辛、麻黄等，儿童使用需严格按说明或遵医嘱。" },
    { name: "清宣止咳颗粒", syndromes: ["shaoyang", "taiyang"], ingredients: ["桑叶", "薄荷", "苦杏仁", "桔梗", "白芍", "枳壳", "陈皮", "紫菀", "甘草"], suitable: "风热或郁热初起咳嗽、咽痒。", caution: "痰热壅盛或寒湿白痰多时可能不足。" },
    { name: "四季抗病毒口服液", syndromes: ["taiyang", "shaoyang"], ingredients: ["鱼腥草", "桔梗", "桑叶", "连翘", "薄荷", "紫苏叶", "苦杏仁", "菊花", "甘草"], suitable: "外感咳嗽兼咽痛热象。", caution: "脾虚便稀或寒象明显者慎用。" },
    { name: "小儿清热止咳口服液", syndromes: ["yangming"], ingredients: ["麻黄", "苦杏仁", "石膏", "甘草", "黄芩", "板蓝根", "北豆根"], suitable: "肺热咳嗽、咽痛黄痰。", caution: "白痰清稀、畏寒明显者慎用。" },
    { name: "京都念慈菴蜜炼川贝枇杷膏", syndromes: ["taiyin"], ingredients: ["川贝母", "枇杷叶", "南沙参", "茯苓", "化橘红", "桔梗", "法半夏", "五味子", "瓜蒌子", "款冬花", "远志", "苦杏仁", "生姜", "甘草", "杏仁水", "薄荷脑"], suitable: "燥咳、久咳、咽喉不适。", caution: "痰多黄稠、表证未解时慎用，避免滋腻恋邪。" }
  ]
};
