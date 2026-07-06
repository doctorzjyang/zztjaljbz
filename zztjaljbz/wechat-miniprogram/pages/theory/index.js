const { syndromes } = require("../six-channel/data");

Page({
  data: {
    intro: [
      "六经辨证可以理解为观察病邪所在层次、寒热虚实和孩子自身反应强弱。",
      "儿童发热咳嗽变化快，先排查危险信号，再看冷热、汗出、二便、饮食、精神、鼻咽咳痰等线索。",
      "本页只做中医儿科科普和就医沟通参考，不能替代医生诊断。"
    ],
    modelIntro: "可以把身体想成一座城堡。发热不是单纯的温度数字，而是守军和外来病邪交战时产生的反应。六经辨证要先看战场在哪里，再看孩子自身还有多少抵抗力。",
    modelImage: "/assets/six-channel-castle-model.jpg",
    castleParts: [
      { name: "城墙", body: "体表、皮肤、肌肉、关节", meaning: "邪气还在外面，多看怕冷、汗出、鼻涕、身痛。" },
      { name: "夹层通道", body: "半表半里、胸腹之间的枢纽", meaning: "邪气卡在进退之间，多看寒热往来、口苦、恶心、咽干。" },
      { name: "城堡内部", body: "胃肠、脏腑、痰热或食积", meaning: "邪气进入里面，多看口渴、便干、口臭、黄痰、腹胀。" },
      { name: "守军", body: "正气、阳气、津液和恢复能力", meaning: "精神、手脚温度、汗出后状态，决定能不能继续攻邪。" },
      { name: "敌军", body: "风寒、风热、痰湿、食积、寒热错杂", meaning: "不同邪气位置不同，处理方向也不同。" }
    ],
    modelQuestions: [
      { title: "战火在哪里？", text: "在城墙就是太阳，在夹层就是少阳，在城里就是阳明或太阴；如果内外虚弱或寒热错杂，就要想到少阴、厥阴。" },
      { title: "守军还有多少力气？", text: "同样发热，精神好、能喝能玩，与精神差、嗜睡、手脚冷，处理方向完全不同。" },
      { title: "寒热是单一还是混杂？", text: "单纯怕冷清涕和单纯口渴便干不一样；上面热、下面冷，或便干便稀交替，则不能简单清热或温里。" }
    ],
    modelExamples: [
      { title: "发热怕冷、无汗、身痛", text: "更像城墙外作战，太阳表证线索突出，治疗方向常从解表宣肺理解。" },
      { title: "高热口渴、大汗、便干", text: "更像城内热势明显，阳明里热线索突出，治疗方向常从清里热、护津液、通腑理解。" },
      { title: "低热反复、口腔热象、腹泻手脚凉", text: "更像一边有热、一边有寒，厥阴寒热错杂线索突出，应交给医生综合辨证。" }
    ],
    channels: [
      { key: "taiyang", title: syndromes.taiyang.name, position: syndromes.taiyang.position, summary: syndromes.taiyang.summary, treatment: "常见思路是解表宣肺。若怕冷、清涕、身痛等表证仍明显，不宜只盯着清里热。", feverCough: "发热初起、怕冷怕风、鼻塞清涕、咳嗽初起常先看太阳。" },
      { key: "shaoyang", title: syndromes.shaoyang.name, position: syndromes.shaoyang.position, summary: syndromes.shaoyang.summary, treatment: "常见思路是和解少阳、疏解郁热。少阳在半表半里，处理上要避免单纯发汗或攻下。", feverCough: "发热反复、寒热往来、咽干口苦、恶心或烦躁时要留意少阳。" },
      { key: "yangming", title: syndromes.yangming.name, position: syndromes.yangming.position, summary: syndromes.yangming.summary, treatment: "常见思路是清里热、化痰热、通腑消积，同时注意津液。", feverCough: "高热、口渴、便干口臭、黄痰黏痰、舌苔黄厚时多看阳明。" },
      { key: "taiyin", title: syndromes.taiyin.name, position: syndromes.taiyin.position, summary: syndromes.taiyin.summary, treatment: "常见思路是健脾化痰、温中和胃，慎用过寒过攻。", feverCough: "食欲差、腹胀、大便稀、白痰多、遇冷加重时多看太阴。" },
      { key: "shaoyin", title: syndromes.shaoyin.name, position: syndromes.shaoyin.position, summary: syndromes.shaoyin.summary, treatment: "少阴提示正气不足或病情较深，儿童不适合自行判断处理。", feverCough: "精神差、嗜睡、声音低弱、畏寒肢冷时建议医生评估。" },
      { key: "jueyin", title: syndromes.jueyin.name, position: syndromes.jueyin.position, summary: syndromes.jueyin.summary, treatment: "厥阴常见寒热错杂，需要综合判断，不能简单清热或温里。", feverCough: "上热下寒、表现反复、病程迁延时应由医生辨证。" }
    ]
  },

  previewModelImage() {
    wx.previewImage({
      urls: [this.data.modelImage],
      current: this.data.modelImage
    });
  }
});
