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
  {
    id: "breath",
    text: "呼吸很费力：喘得明显、胸口或肋骨下面一吸一凹、鼻翼扇动、说话或哭声明显费力、嘴唇发紫。"
  },
  {
    id: "spirit",
    text: "精神状态明显不对：叫不醒、一直想睡、眼神发呆、反应很慢，或退烧后精神仍很差。"
  },
  {
    id: "seizure",
    text: "抽搐或意识异常：抽搐、翻白眼、意识不清、说胡话，或持续烦躁哭闹、怎么哄都不行。"
  },
  {
    id: "dehydration",
    text: "喝不进水或明显脱水：尿很少、半天不尿、嘴唇很干、哭时没眼泪、喝水就吐、精神越来越差。"
  },
  {
    id: "age3m",
    text: "3个月以内宝宝体温达到或超过38℃。"
  },
  {
    id: "worse",
    text: "病情反复或加重：本来好转又突然加重，退烧后仍精神差，高热持续不退，咳嗽越来越重或喘起来。"
  }
];

const questions = [
  {
    id: "cold_heat",
    title: "1. 怕冷还是怕热？",
    options: [
      {
        label: "发热时明显怕冷，想盖被子",
        scores: {
          taiyang: 3
        },
        evidence: "发热时明显怕冷、想盖被子，多提示外邪在表，偏太阳表寒。",
        note: "多提示：太阳/表寒。"
      },
      {
        label: "发热时怕风，但会微微出汗",
        scores: {
          taiyang: 2
        },
        evidence: "发热怕风、微微出汗，多提示表证偏虚，仍偏太阳。",
        note: "多提示：太阳/表虚。"
      },
      {
        label: "一会儿冷，一会儿热，体温反复",
        scores: {
          shaoyang: 3
        },
        evidence: "冷热交替、体温反复，多提示邪在半表半里，偏少阳。",
        note: "多提示：少阳/半表半里。"
      },
      {
        label: "不怕冷，反而怕热、踢被子",
        scores: {
          yangming: 3
        },
        evidence: "不怕冷、怕热踢被，多提示里热，偏阳明。",
        note: "多提示：阳明/里热。"
      },
      {
        label: "很怕冷、手脚凉，孩子状态也不好",
        scores: {
          shaoyin: 4,
          taiyin: 1
        },
        evidence: "很怕冷、手脚凉且状态不好，需谨慎，建议医生评估。",
        note: "建议医生评估。"
      },
      {
        label: "没有明显冷热偏向",
        none: true,
        scores: {},
        note: "这一页没有明显符合项。"
      }
    ]
  },
  {
    id: "sweat",
    title: "2. 出汗情况",
    options: [
      {
        label: "发热时不怎么出汗，皮肤偏干",
        scores: {
          taiyang: 3
        },
        evidence: "发热时无汗、皮肤偏干，多提示外邪在表、毛孔闭住，偏太阳表寒。",
        note: "多提示：太阳/表寒。"
      },
      {
        label: "会出汗，出汗后舒服一点，但仍怕风",
        scores: {
          taiyang: 2
        },
        evidence: "有汗、汗后稍舒服但仍怕风，多提示表证偏虚，仍偏太阳。",
        note: "多提示：太阳/表虚。"
      },
      {
        label: "汗很多，身上很热，口渴明显",
        scores: {
          yangming: 3
        },
        evidence: "汗多、身热、口渴明显，多提示里热偏重，偏阳明。",
        note: "多提示：阳明/里热。"
      },
      {
        label: "只有头上汗多，身上汗不多",
        scores: {
          shaoyang: 2,
          yangming: 1
        },
        evidence: "头汗明显、身上汗不多，可见热郁不畅，可能偏少阳或阳明。",
        note: "可见于：少阳/阳明。"
      },
      {
        label: "出冷汗，手脚凉，精神也差",
        scores: {
          shaoyin: 4
        },
        evidence: "冷汗、手脚凉、精神差要谨慎，建议医生评估。",
        note: "建议医生评估。"
      },
      {
        label: "出汗不明显或不确定",
        none: true,
        scores: {},
        note: "这一页没有明显符合项。"
      }
    ]
  },
  {
    id: "eat_drink",
    title: "3. 吃喝情况",
    options: [
      {
        label: "不想吃，还恶心或想吐",
        scores: {
          shaoyang: 3
        },
        evidence: "不想吃、恶心或想吐，多提示半表半里不和，偏少阳。",
        note: "多提示：少阳/半表半里。"
      },
      {
        label: "胃口差，吃一点就胀",
        scores: {
          taiyin: 3
        },
        evidence: "胃口差、吃一点就胀，多提示脾胃弱，偏太阴。",
        note: "多提示：太阴/脾胃弱。"
      },
      {
        label: "口臭、肚子胀，发病前吃多了",
        scores: {
          yangming: 2,
          taiyin: 1
        },
        evidence: "口臭、腹胀、发病前吃多，多提示食积化热，偏阳明或太阴积滞。",
        note: "多提示：阳明/食积化热。"
      },
      {
        label: "很口渴，喜欢喝凉水",
        scores: {
          yangming: 3
        },
        evidence: "口渴明显、喜欢凉水，多提示里热，偏阳明。",
        note: "多提示：阳明/里热。"
      },
      {
        label: "不太渴，或喜欢喝温水",
        scores: {
          taiyin: 2
        },
        evidence: "不太渴或喜欢温水，多提示偏寒或脾胃弱，偏太阴。",
        note: "多提示：太阴/偏寒。"
      },
      {
        label: "想喝水，但喝了容易恶心或吐",
        scores: {
          taiyin: 3
        },
        evidence: "想喝水但喝后恶心或吐，多提示水饮停在胃里，偏太阴水饮。",
        note: "多提示：太阴/水饮。"
      },
      {
        label: "吃喝基本正常",
        none: true,
        scores: {},
        note: "这一页没有明显符合项。"
      }
    ]
  },
  {
    id: "stool_urine",
    title: "4. 大小便情况",
    options: [
      {
        label: "大便干、臭，几天不解",
        scores: {
          yangming: 3
        },
        evidence: "大便干臭、几天不解，多提示里热或积滞，偏阳明。",
        note: "多提示：阳明/里热积滞。"
      },
      {
        label: "大便臭，肚子胀，屁也臭",
        scores: {
          yangming: 2,
          taiyin: 1
        },
        evidence: "大便臭、腹胀、屁臭，多提示食积化热，偏阳明或太阴积滞。",
        note: "多提示：阳明/食积化热。"
      },
      {
        label: "大便稀，不太臭，或有不消化食物",
        scores: {
          taiyin: 3
        },
        evidence: "大便稀、不太臭或有不消化食物，多提示脾胃虚弱，偏太阴。",
        note: "多提示：太阴/脾胃弱。"
      },
      {
        label: "腹泻黄臭，肛门红或说屁股疼",
        scores: {
          yangming: 3
        },
        evidence: "腹泻黄臭、肛门红热，多提示湿热或里热，偏阳明。",
        note: "多提示：阳明/湿热。"
      },
      {
        label: "小便黄、少、味重",
        scores: {
          yangming: 2
        },
        evidence: "小便黄少味重，多提示热重或津液不足，偏阳明。",
        note: "多提示：阳明/里热伤津。"
      },
      {
        label: "小便清长、量多",
        scores: {
          taiyin: 1,
          shaoyin: 1
        },
        evidence: "小便清长量多，多提示偏寒或阳气不足，偏太阴或少阴。",
        note: "多提示：太阴/偏寒。"
      },
      {
        label: "大小便基本正常",
        none: true,
        scores: {},
        note: "这一页没有明显符合项。"
      }
    ]
  },
  {
    id: "sleep_temp",
    title: "5. 睡觉和温差",
    options: [
      {
        label: "睡觉踢被子、翻来覆去",
        scores: {
          yangming: 2
        },
        evidence: "睡觉踢被、翻来覆去，多提示里热或胃肠不和，偏阳明。",
        note: "多提示：阳明/里热。"
      },
      {
        label: "睡觉磨牙、趴睡，伴口臭或肚子胀",
        scores: {
          yangming: 2,
          taiyin: 1
        },
        evidence: "磨牙、趴睡伴口臭腹胀，多提示食积化热，偏阳明或太阴积滞。",
        note: "多提示：阳明/食积化热。"
      },
      {
        label: "蜷缩睡、喜欢盖被，肚子怕凉",
        scores: {
          taiyin: 3
        },
        evidence: "蜷缩睡、喜盖被、肚子怕凉，多提示偏寒或脾胃虚寒，偏太阴。",
        note: "多提示：太阴/虚寒。"
      },
      {
        label: "手心比手背热，肚子比后背热",
        scores: {
          yangming: 2
        },
        evidence: "手心热、肚子热，多提示里热或食积热，偏阳明。",
        note: "多提示：阳明/里热。"
      },
      {
        label: "夜里咳嗽明显，躺下更咳",
        scores: {
          taiyin: 3
        },
        evidence: "夜里咳明显、躺下更咳，多提示痰饮上扰，偏太阴。",
        note: "多提示：太阴/痰饮。"
      },
      {
        label: "睡觉和温差没有明显异常",
        none: true,
        scores: {},
        note: "这一页没有明显符合项。"
      }
    ]
  },
  {
    id: "nose_throat",
    title: "6. 鼻涕咽喉",
    options: [
      {
        label: "清鼻涕、打喷嚏、鼻塞，怕冷怕风",
        tags: [
          "cough"
        ],
        scores: {
          taiyang: 3
        },
        evidence: "清涕、喷嚏、鼻塞、怕冷怕风，多提示外邪在表，偏太阳表寒。",
        note: "多提示：太阳/表寒。"
      },
      {
        label: "黄鼻涕、鼻塞重，口气也重",
        tags: [
          "cough"
        ],
        scores: {
          yangming: 2
        },
        evidence: "黄涕、鼻塞重、口气重，多提示热象，偏阳明。",
        note: "多提示：阳明/热象。"
      },
      {
        label: "咽痒、干咳，鼻涕清或鼻塞",
        tags: [
          "cough"
        ],
        scores: {
          taiyang: 2
        },
        evidence: "咽痒干咳、清涕或鼻塞，多提示表邪影响咽喉和肺，偏太阳。",
        note: "多提示：太阳/表证。"
      },
      {
        label: "扁桃体红肿或化脓，高热、口渴、便干",
        tags: [
          "fever"
        ],
        scores: {
          yangming: 4
        },
        evidence: "扁桃体红肿或化脓，伴高热口渴便干，多提示里热较重，偏阳明。",
        note: "多提示：阳明/里热较重。"
      },
      {
        label: "咽喉不太红，痰白清稀，怕冷",
        tags: [
          "cough"
        ],
        scores: {
          taiyang: 1,
          taiyin: 2
        },
        evidence: "咽喉不太红、白稀痰、怕冷，多提示寒象，偏太阳或太阴。",
        note: "多提示：太阳/太阴寒象。"
      },
      {
        label: "鼻涕咽喉没有明显异常",
        none: true,
        scores: {},
        note: "这一页没有明显符合项。"
      }
    ]
  },
  {
    id: "cough",
    title: "7. 咳嗽痰",
    options: [
      {
        label: "刚开始咳，咳声清亮，或干咳咽痒，伴清鼻涕、怕冷",
        tags: [
          "cough"
        ],
        scores: {
          taiyang: 3
        },
        evidence: "初咳清亮或干咳咽痒，伴清涕怕冷，多提示外邪在表，偏太阳表寒。",
        note: "多提示：太阳/表寒。"
      },
      {
        label: "痰多、白稀，喉咙呼噜响",
        tags: [
          "cough"
        ],
        scores: {
          taiyin: 3
        },
        evidence: "痰多白稀、喉中痰鸣，多提示痰湿或寒饮，偏太阴。",
        note: "多提示：太阴/痰湿寒饮。"
      },
      {
        label: "遇冷咳加重，清晨或后半夜明显",
        tags: [
          "cough"
        ],
        scores: {
          taiyang: 1,
          taiyin: 2
        },
        evidence: "遇冷咳、清晨或后半夜咳，多提示寒饮或表寒未解，偏太阳或太阴。",
        note: "多提示：太阳/太阴寒象。"
      },
      {
        label: "黄痰、黏痰，咳出来费劲",
        tags: [
          "cough"
        ],
        scores: {
          yangming: 3
        },
        evidence: "黄黏痰、难咳，多提示痰热，偏阳明。",
        note: "多提示：阳明/痰热。"
      },
      {
        label: "夜里咳明显，伴口臭、肚子胀或便干",
        tags: [
          "cough"
        ],
        scores: {
          yangming: 2,
          taiyin: 1
        },
        evidence: "夜咳伴口臭腹胀或便干，多提示食积化热上扰，偏阳明或太阴积滞。",
        note: "多提示：阳明/食积咳。"
      },
      {
        label: "咳嗽久不愈，痰多，胃口差，大便稀",
        tags: [
          "cough"
        ],
        scores: {
          taiyin: 3
        },
        evidence: "久咳痰多、胃口差、大便稀，多提示脾虚生痰，偏太阴。",
        note: "多提示：太阴/脾虚生痰。"
      },
      {
        label: "咳嗽痰不明显",
        none: true,
        scores: {},
        note: "这一页没有明显符合项。"
      }
    ]
  },
  {
    id: "constitution",
    title: "8. 既往体质",
    options: [
      {
        label: "平时容易感冒，一动就出汗",
        scores: {
          taiyang: 2,
          taiyin: 1
        },
        evidence: "平时易感冒、动则汗出，多提示表虚、卫外不稳，偏太阳表虚或太阴虚。",
        note: "多提示：太阳表虚/太阴虚。"
      },
      {
        label: "平时反复咳嗽，痰多，胃口差",
        tags: [
          "cough"
        ],
        scores: {
          taiyin: 3
        },
        evidence: "反复咳嗽、痰多、胃口差，多提示脾虚生痰，偏太阴。",
        note: "多提示：太阴/脾虚生痰。"
      },
      {
        label: "有鼻炎、清鼻涕，遇冷容易咳",
        tags: [
          "cough"
        ],
        scores: {
          taiyang: 2,
          taiyin: 2
        },
        evidence: "鼻炎清涕、遇冷咳，多提示表寒夹痰饮，偏太阳或太阴。",
        note: "多提示：太阳/太阴寒饮。"
      },
      {
        label: "平时口臭、手心热、磨牙、大便偏干",
        scores: {
          yangming: 3
        },
        evidence: "平时口臭、手心热、磨牙或大便偏干，多提示积热或胃肠热，偏阳明。",
        note: "多提示：阳明/积热。符合其中几项即可选择。"
      },
      {
        label: "经常扁桃体红肿、咽痛、高热",
        scores: {
          yangming: 3
        },
        evidence: "经常扁桃体红肿、咽痛、高热，多提示咽喉热象明显，偏阳明。",
        note: "多提示：阳明/咽喉热象。"
      },
      {
        label: "吃寒凉药后容易腹泻、胃口差、咳嗽拖长",
        scores: {
          taiyin: 3
        },
        evidence: "寒凉药后腹泻、胃口差或咳嗽拖长，多提示脾胃偏弱，偏太阴。",
        note: "多提示：太阴/脾胃弱。"
      },
      {
        label: "没有明显既往体质线索",
        none: true,
        scores: {},
        note: "体质背景不明显，本次以当前症状为主。"
      }
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
