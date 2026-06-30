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
      id: "chief",
      title: "0. 主诉：这次最主要的问题是什么？",
      multi: true,
      options: [
        { label: "发热", tags: ["fever"], scores: { taiyang: 1, yangming: 1 }, evidence: "发热需继续结合冷热、汗出、口渴、大便等线索分表里寒热。" },
        { label: "咳嗽", tags: ["cough"], scores: { taiyang: 1 }, evidence: "咳嗽初起常先看太阳表证，也要结合痰色痰量判断里热或痰湿。" },
        { label: "喘息/气急", tags: ["cough"], scores: { taiyang: 1, yangming: 1 }, evidence: "喘息可见表邪束肺或痰热壅肺，若喘憋明显应先就医。" },
        { label: "鼻塞、流涕、喷嚏", tags: ["cough"], scores: { taiyang: 2 }, evidence: "鼻塞流涕喷嚏提示邪在体表、肺卫不宣。" },
        { label: "咽痛、声嘶、疱疹或扁桃体问题", tags: ["fever", "cough"], scores: { shaoyang: 1, yangming: 2 }, evidence: "咽喉红肿疼痛、疱疹、化脓多提示热象，常需辨少阳与阳明。" },
        { label: "呕吐、腹痛或腹泻", scores: { taiyin: 2, shaoyang: 1 }, evidence: "呕吐腹痛腹泻需重点看脾胃太阴，也可能夹少阳枢机不利。" },
        { label: "便秘、口臭或积食", scores: { yangming: 3 }, evidence: "便秘口臭积食偏向阳明里热或食积化热。" },
        { label: "头痛、颈项痛、身痛", scores: { taiyang: 2 }, evidence: "头痛、颈项痛、身痛常提示太阳表证。" }
      ]
    },
    {
      id: "eat",
      title: "1. 吃：食欲、口味和胃部反应",
      multi: true,
      options: [
        { label: "食欲差、不想吃", scores: { taiyin: 2, shaoyang: 1 }, evidence: "食欲差提示脾胃运化不足，也可见少阳不和。" },
        { label: "食量大、容易饿", scores: { yangming: 2 }, evidence: "食量大、容易饥饿可作为阳明胃热参考。" },
        { label: "饿但不想吃", scores: { jueyin: 2 }, evidence: "饥不欲食提示寒热错杂方向，需结合上下寒热判断。" },
        { label: "恶心、干呕或咳后想吐", scores: { shaoyang: 2, taiyin: 1 }, evidence: "恶心欲吐可见少阳不和，也可兼痰饮或脾胃不和。" },
        { label: "嗳气、反酸、烧心", scores: { jueyin: 2, shaoyang: 1 }, evidence: "嗳气反酸烧心常提示气机上逆或寒热错杂。" },
        { label: "吃凉的容易肚子不舒服", scores: { taiyin: 2 }, evidence: "遇凉加重偏太阴虚寒、脾胃阳气不足。" },
        { label: "没有明显异常", scores: {}, evidence: "", none: true }
      ]
    },
    {
      id: "drink",
      title: "2. 喝：口渴、口苦、咽干",
      multi: true,
      options: [
        { label: "不太渴或喜欢热饮", scores: { taiyin: 1, shaoyin: 1 }, evidence: "不渴或喜热饮偏寒象，需结合精神和四肢温度判断。" },
        { label: "口渴明显、喜欢冷饮", scores: { yangming: 3 }, evidence: "口渴喜冷饮是阳明里热的重要线索。" },
        { label: "口苦", scores: { shaoyang: 3, jueyin: 1 }, evidence: "口苦多提示少阳郁热；若兼手足冷、腹泻等，要考虑寒热错杂。" },
        { label: "咽干、口干", scores: { shaoyang: 2, shaoyin: 1 }, evidence: "咽干口干可见少阳郁热，也可能提示阴液不足。" },
        { label: "口渴但喝不多或喝了不解渴", scores: { jueyin: 2, yangming: 1 }, evidence: "口渴而饮水不多或不解渴，需警惕寒热错杂或津液输布不利。" },
        { label: "没有明显异常", scores: {}, evidence: "", none: true }
      ]
    },
    {
      id: "stool",
      title: "3. 拉：大便情况",
      multi: true,
      options: [
        { label: "大便干硬、两三天不解或排便费力", scores: { yangming: 3 }, evidence: "大便干硬是阳明腑热或积滞的重要依据。" },
        { label: "大便臭味很重或肛门灼热", scores: { yangming: 3 }, evidence: "臭味重、灼热感提示里热、湿热或食积化热。" },
        { label: "大便稀、味道不大或夹不消化食物", scores: { taiyin: 3 }, evidence: "便稀味轻、不消化偏太阴脾虚寒湿。" },
        { label: "腹胀腹痛，喜欢揉按或热敷", scores: { taiyin: 2 }, evidence: "腹痛喜温喜按偏虚寒，常从太阴考虑。" },
        { label: "腹胀腹痛，拒按或按着更难受", scores: { yangming: 2 }, evidence: "腹胀拒按偏实证、积滞或里热。" },
        { label: "便干口臭和便稀怕冷交替出现", scores: { jueyin: 3, yangming: 1, taiyin: 1 }, evidence: "寒热表现交替出现，提示厥阴寒热错杂方向。" },
        { label: "大便基本正常", scores: {}, evidence: "", none: true }
      ]
    },
    {
      id: "urine",
      title: "4. 撒：小便情况",
      multi: true,
      options: [
        { label: "小便黄、味重", scores: { yangming: 2 }, evidence: "小便黄味重常与里热或津液不足相关。" },
        { label: "小便清长", scores: { shaoyin: 2, taiyin: 1 }, evidence: "小便清长偏寒象，需结合精神、畏寒和四肢温度。" },
        { label: "小便明显减少", scores: { yangming: 1 }, evidence: "小便明显减少需留意脱水风险，若伴口唇干、精神差应及时就医。" },
        { label: "小便正常", scores: {}, evidence: "", none: true }
      ]
    },
    {
      id: "sleep_spirit",
      title: "5. 睡：睡眠和精神状态",
      multi: true,
      options: [
        { label: "精神尚可，但烦躁、哭闹或坐卧不安", scores: { yangming: 2, shaoyang: 1 }, evidence: "烦躁坐卧不安可见阳明热扰，也可兼少阳郁热。" },
        { label: "睡不安、翻滚、趴睡、撅屁股睡或磨牙", scores: { yangming: 2, taiyin: 1 }, evidence: "睡不安、趴睡、磨牙常与食积化热或脾胃不和有关。" },
        { label: "精神差、嗜睡、声音低弱", scores: { shaoyin: 4 }, evidence: "精神差、嗜睡、声音低弱是少阴类风险线索，不建议自行选药。" },
        { label: "心烦失眠、手足心热", scores: { shaoyin: 2, yangming: 1 }, evidence: "心烦失眠、手足心热提示热扰或阴液不足方向。" },
        { label: "咳嗽或喘息影响睡眠", tags: ["cough"], scores: { taiyang: 1, yangming: 1, taiyin: 1 }, evidence: "夜间咳喘需结合痰色、痰量和寒热判断表证、痰热或痰湿。" },
        { label: "睡眠和精神基本正常", scores: {}, evidence: "", none: true }
      ]
    },
    {
      id: "sweat",
      title: "6. 汗：出汗情况",
      multi: true,
      options: [
        { label: "无汗或很少出汗", scores: { taiyang: 2 }, evidence: "发热怕冷而无汗偏太阳伤寒表实方向。" },
        { label: "出汗后怕风，汗出后稍舒服", scores: { taiyang: 2 }, evidence: "汗出怕风、汗后稍缓偏太阳中风表虚方向。" },
        { label: "汗多、皮肤热或汗黏", scores: { yangming: 3 }, evidence: "汗多皮肤热、汗黏偏阳明里热。" },
        { label: "冷汗、虚汗或汗出后更没精神", scores: { shaoyin: 3 }, evidence: "冷汗虚汗伴精神差提示正气不足，不宜自行发汗。" },
        { label: "汗出不明显", scores: {}, evidence: "", none: true }
      ]
    },
    {
      id: "cold_heat",
      title: "7. 冷热：怕冷、怕热和寒热往来",
      multi: true,
      options: [
        { label: "怕冷怕风明显", scores: { taiyang: 3 }, evidence: "怕冷怕风是太阳表证核心线索之一。" },
        { label: "发热轻，但非常怕冷、精神差", scores: { shaoyin: 4 }, evidence: "发热轻而畏寒重、精神差需警惕少阴方向。" },
        { label: "怕热、面红或高热明显", scores: { yangming: 3 }, evidence: "怕热、高热、面红偏阳明里热。" },
        { label: "一阵冷一阵热", scores: { shaoyang: 3 }, evidence: "寒热往来是少阳病的重要判断点。" },
        { label: "冷热不明显", scores: {}, evidence: "", none: true }
      ]
    },
    {
      id: "temperature",
      title: "8. 温差：手脚、肚皮和上下寒热",
      multi: true,
      options: [
        { label: "手脚心烫、肚皮烫", scores: { yangming: 2 }, evidence: "手足心热、腹部热可见里热或食积化热。" },
        { label: "手脚凉、小腿凉", scores: { shaoyin: 2, taiyin: 1 }, evidence: "手脚凉、小腿凉偏寒象，需结合精神状态。" },
        { label: "上面热：口苦口渴咽痛；下面冷：腹泻或手脚冷", scores: { jueyin: 4 }, evidence: "上热下寒是厥阴寒热错杂的重要线索。" },
        { label: "手足心热、口干咽燥", scores: { shaoyin: 2, yangming: 1 }, evidence: "手足心热、口干咽燥可作为热化或阴液不足参考。" },
        { label: "没有明显温差", scores: {}, evidence: "", none: true }
      ]
    },
    {
      id: "cough",
      title: "9. 其它：鼻、咽、咳、痰",
      multi: true,
      options: [
        { label: "清鼻涕、喷嚏、鼻塞", tags: ["cough"], scores: { taiyang: 3 }, evidence: "清涕喷嚏鼻塞常提示太阳表证。" },
        { label: "黄鼻涕、鼻甲红肿或鼻涕黏稠", tags: ["cough"], scores: { yangming: 2, shaoyang: 1 }, evidence: "黄涕黏稠或鼻部红肿偏热象，可见阳明或少阳。" },
        { label: "白痰、清稀痰", tags: ["cough"], scores: { taiyin: 2, taiyang: 1 }, evidence: "白痰清稀多偏寒湿或表寒。" },
        { label: "黄痰、黏痰、不易咳出", tags: ["cough"], scores: { yangming: 3 }, evidence: "黄痰黏稠提示痰热壅肺。" },
        { label: "咽痛、疱疹、扁桃体红肿或化脓", tags: ["fever", "cough"], scores: { yangming: 3, shaoyang: 1 }, evidence: "咽喉红肿、疱疹、化脓多属热象，需辨阳明与少阳。" },
        { label: "声嘶、咽干", tags: ["cough"], scores: { shaoyang: 2, yangming: 1 }, evidence: "声嘶咽干常提示少阳郁热或上焦热象。" },
        { label: "咳喘明显", tags: ["cough"], scores: { taiyang: 1, yangming: 2 }, evidence: "咳喘需辨表邪束肺与痰热壅肺；若喘憋明显应及时就医。" },
        { label: "没有这些情况", scores: {}, evidence: "", none: true }
      ]
    },
    {
      id: "tongue_history",
      title: "10. 病史/舌象：可观察到的辅助线索",
      multi: true,
      options: [
        { label: "舌淡红、苔薄白", scores: { taiyang: 1 }, evidence: "舌淡红、苔薄白常可见于外感表证初起。" },
        { label: "舌红、苔薄黄", scores: { yangming: 2, shaoyang: 1 }, evidence: "舌红苔薄黄提示热象初显，需结合咽痛、口渴、大便判断。" },
        { label: "舌红、苔黄厚干或黄厚腻", scores: { yangming: 3 }, evidence: "舌红苔黄厚干或黄厚腻偏阳明里热、食积、痰热。" },
        { label: "舌淡白、苔白厚湿润", scores: { taiyin: 3 }, evidence: "舌淡白、苔白厚湿润偏太阴寒湿或痰湿。" },
        { label: "舌红少苔，口干咽燥", scores: { shaoyin: 2 }, evidence: "舌红少苔、口干咽燥提示热化或阴液不足方向。" },
        { label: "舌苔黄白相间，病情反复难辨", scores: { jueyin: 3 }, evidence: "黄白相间、寒热难辨可作为厥阴寒热错杂参考。" },
        { label: "反复感冒、体质弱、病程迁延", scores: { taiyin: 1, shaoyin: 2 }, evidence: "反复感冒、体质弱、迁延不愈需关注太阴脾虚和少阴正虚。" },
        { label: "没有观察到或不确定", scores: {}, evidence: "", none: true }
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
    "栀子": "清热泻火、除烦利湿。",
    "炒栀子": "清热泻火，炒后苦寒之性相对缓和。",
    "黄柏": "清热燥湿、泻火解毒。",
    "胖大海": "清肺利咽、润肠通便，便稀者需谨慎。",
    "苦地丁": "清热解毒、消肿散结。",
    "大黄": "通腑泄热，便稀或脾虚者慎用。",
    "槟榔": "行气消积、下气导滞。",
    "厚朴": "行气除满、燥湿消胀。",
    "莱菔子": "消食除胀、降气化痰。",
    "山楂": "消食化积。",
    "神曲": "消食和胃。",
    "麦芽": "消食健胃。",
    "甘草": "调和诸药、缓急止咳。",
    "炙甘草": "益气和中、调和诸药，兼能缓急止咳。",
    "白芍": "养血敛阴、柔肝缓急。",
    "干姜": "温中散寒、温肺化饮。",
    "蛇胆汁": "清热化痰、止咳平喘，儿童使用应按说明或遵医嘱。",
    "水半夏": "燥湿化痰、降逆止呕，需按成药说明规范使用。",
    "薄荷脑": "疏风清利咽喉、芳香通窍。",
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
    "五味子": "敛肺止咳、生津，外邪未解痰多时慎用。",
    "炙麻黄": "宣肺平喘、发散表邪，炮制后相对缓和，儿童需注意剂量和体质。",
    "炒苦杏仁": "降肺气、止咳平喘，儿童应按说明或遵医嘱使用。",
    "绵马贯众": "清热解毒，常用于时疫热毒类配伍。",
    "广藿香": "芳香化湿、和中止呕，兼可解表。",
    "红景天": "益气活血，方中用于扶正兼顾气机。",
    "鲜竹沥": "清热化痰、滑利痰液，偏寒凉，便溏或脾胃虚寒者慎用。"
  },
  feverMedicines: [
    { name: "荆防颗粒", syndromes: ["taiyang"], ingredients: ["荆芥", "防风", "羌活", "独活", "柴胡", "前胡", "川芎", "枳壳", "茯苓", "桔梗", "甘草"], suitable: "怕冷、头身痛、清涕、风寒表证偏重。", caution: "咽痛高热、口渴便干明显者不宜单独使用。" },
    { name: "葛根汤颗粒", syndromes: ["taiyang"], ingredients: ["葛根", "麻黄", "桂枝", "生姜", "甘草", "芍药", "大枣"], suitable: "太阳表实，怕冷、无汗、项背紧、身痛。", caution: "汗多、心悸、体虚或高热里热明显者慎用。" },
    { name: "小儿豉翘清热颗粒", syndromes: ["taiyang", "shaoyang", "yangming"], ingredients: ["连翘", "淡豆豉", "薄荷", "荆芥", "炒栀子", "大黄", "青蒿", "赤芍", "槟榔", "厚朴", "黄芩", "半夏", "柴胡", "甘草"], suitable: "发热、咽痛、烦躁、便干或积滞，三阳合病倾向。", caution: "大便稀、脾胃虚弱者慎用；表寒很重时需谨慎。" },
    { name: "小儿柴桂退热颗粒/口服液", syndromes: ["taiyang", "shaoyang"], ingredients: ["柴胡", "桂枝", "葛根", "浮萍", "黄芩", "白芍", "蝉蜕"], suitable: "发热伴怕冷、寒热往来、咽部不适，太阳少阳合病。", caution: "纯阳明高热便秘或明显腹泻者需重新辨证。" },
    { name: "小儿解表颗粒", syndromes: ["taiyang", "yangming"], ingredients: ["金银花", "连翘", "炒牛蒡子", "葛根", "荆芥穗", "紫苏叶", "防风", "蒲公英", "黄芩", "牛黄"], suitable: "外感初起兼咽红咽痛、轻度里热。", caution: "腹泻、食少、畏寒明显者慎用。" },
    { name: "儿感清口服液", syndromes: ["taiyang", "shaoyang", "taiyin"], ingredients: ["荆芥穗", "薄荷", "化橘红", "黄芩", "紫苏叶", "法半夏", "桔梗", "甘草"], suitable: "感冒发热兼痰多、咳嗽、恶心、食欲差。", caution: "高热便秘、黄痰黏稠突出者可能力度不足。" },
    { name: "双黄连口服液", syndromes: ["shaoyang", "yangming"], ingredients: ["金银花", "黄芩", "连翘"], suitable: "表证已轻或无表证，以咽痛、里热为主。", caution: "怕冷、清涕、身痛明显时不宜单独清里。" },
    { name: "蓝芩口服液", syndromes: ["shaoyang", "yangming"], ingredients: ["板蓝根", "黄芩", "栀子", "黄柏", "胖大海"], suitable: "咽红咽痛、口干咽干、里热或少阳郁热偏重。", caution: "药性偏寒凉，便稀、腹痛、脾胃虚寒或怕冷清涕明显者慎用。" },
    { name: "蒲地蓝口服液", syndromes: ["shaoyang", "yangming"], ingredients: ["蒲公英", "苦地丁", "板蓝根", "黄芩"], suitable: "咽喉红肿疼痛、热毒偏盛、发热兼咽部热象。", caution: "偏寒凉，腹泻、食少、脾胃虚寒或寒象明显者慎用。" },
    { name: "连花清瘟胶囊", syndromes: ["taiyang", "yangming", "shaoyang"], ingredients: ["连翘", "金银花", "炙麻黄", "炒苦杏仁", "石膏", "板蓝根", "绵马贯众", "鱼腥草", "广藿香", "大黄", "红景天", "薄荷脑", "甘草"], suitable: "流感样外感属热毒袭肺，发热或高热、恶寒、肌肉酸痛、鼻塞流涕、咳嗽、咽干咽痛、苔黄或黄腻。", caution: "风寒感冒、怕冷清涕白痰明显、便稀或脾胃虚寒者慎用；含炙麻黄、大黄，儿童须按说明或遵医嘱。" },
    { name: "芩香清解口服液", syndromes: ["shaoyang", "yangming"], ingredients: ["黄芩", "广藿香", "蝉蜕", "石膏", "葛根", "大黄", "芍药", "板蓝根", "桔梗", "玄参", "山豆根", "甘草"], suitable: "里热偏重、咽痛、高热、便干，少阳阳明合病。", caution: "药性偏寒凉，便稀、脾胃弱者慎用。" },
    { name: "小儿感冒宁糖浆", syndromes: ["taiyang", "yangming", "taiyin"], ingredients: ["薄荷", "荆芥穗", "苦杏仁", "牛蒡子", "黄芩", "桔梗", "前胡", "白芷", "炒栀子", "焦山楂", "焦神曲", "焦麦芽", "芦根", "金银花", "连翘"], suitable: "感冒夹滞，发热兼腹胀、口气、食积。", caution: "无积滞或大便偏稀者不宜盲用。" },
    { name: "小儿感冒退热糖浆", syndromes: ["taiyang", "yangming"], ingredients: ["板蓝根", "大青叶", "连翘", "桑枝", "荆芥", "防风", "紫苏叶"], suitable: "外感发热兼轻度热象，表里同治。", caution: "纯寒证或脾胃虚寒明显者慎用。" }
  ],
  coughMedicines: [
    { name: "小青龙颗粒", syndromes: ["taiyang", "taiyin"], ingredients: ["麻黄", "桂枝", "白芍", "干姜", "细辛", "炙甘草", "法半夏", "五味子"], suitable: "外寒内饮、怕冷清涕、白痰清稀、咳喘初起偏寒饮。", caution: "含麻黄、细辛，儿童需严格按说明或遵医嘱；黄痰、咽红高热、口渴便干明显者不宜盲用。" },
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
    { name: "蛇胆川贝枇杷膏", syndromes: ["shaoyang", "yangming"], ingredients: ["蛇胆汁", "川贝母", "枇杷叶", "桔梗", "水半夏", "薄荷脑"], suitable: "咳嗽咽痒、痰热或咽部热象兼痰黏不爽。", caution: "偏清润化痰，寒咳白痰清稀、便稀或脾胃虚寒者慎用。" },
    { name: "牛黄蛇胆川贝液", syndromes: ["shaoyang", "yangming"], ingredients: ["人工牛黄", "川贝母", "蛇胆汁", "薄荷脑"], suitable: "痰热咳嗽、咽喉不适、黄痰或热象较明显。", caution: "药性偏寒凉，寒咳白痰、腹泻或脾胃虚寒者慎用；儿童按说明或遵医嘱。" },
    { name: "祛痰灵口服液", syndromes: ["yangming"], ingredients: ["鲜竹沥", "鱼腥草"], suitable: "痰热壅肺，咳嗽痰多、痰黏厚或稠黄、咯吐不爽。", caution: "偏清肺化痰，寒咳白痰清稀、便溏、脾胃虚寒或低龄儿童需谨慎，按说明或遵医嘱。" },
    { name: "京都念慈菴蜜炼川贝枇杷膏", syndromes: ["taiyin"], ingredients: ["川贝母", "枇杷叶", "南沙参", "茯苓", "化橘红", "桔梗", "法半夏", "五味子", "瓜蒌子", "款冬花", "远志", "苦杏仁", "生姜", "甘草", "杏仁水", "薄荷脑"], suitable: "燥咳、久咳、咽喉不适。", caution: "痰多黄稠、表证未解时慎用，避免滋腻恋邪。" }
  ]
};
