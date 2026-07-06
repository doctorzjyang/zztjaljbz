const { syndromes } = require("../six-channel/data");

Page({
  data: {
    intro: [
      "六经辨证可以理解为观察病邪所在层次、寒热虚实和孩子自身反应强弱。",
      "儿童发热咳嗽变化快，先排查危险信号，再看冷热、汗出、二便、饮食、精神、鼻咽咳痰等线索。",
      "本页只做中医儿科科普和就医沟通参考，不能替代医生诊断。"
    ],
    channels: [
      { key: "taiyang", title: syndromes.taiyang.name, position: syndromes.taiyang.position, summary: syndromes.taiyang.summary, treatment: "常见思路是解表宣肺。若怕冷、清涕、身痛等表证仍明显，不宜只盯着清里热。", feverCough: "发热初起、怕冷怕风、鼻塞清涕、咳嗽初起常先看太阳。" },
      { key: "shaoyang", title: syndromes.shaoyang.name, position: syndromes.shaoyang.position, summary: syndromes.shaoyang.summary, treatment: "常见思路是和解少阳、疏解郁热。少阳在半表半里，处理上要避免单纯发汗或攻下。", feverCough: "发热反复、寒热往来、咽干口苦、恶心或烦躁时要留意少阳。" },
      { key: "yangming", title: syndromes.yangming.name, position: syndromes.yangming.position, summary: syndromes.yangming.summary, treatment: "常见思路是清里热、化痰热、通腑消积，同时注意津液。", feverCough: "高热、口渴、便干口臭、黄痰黏痰、舌苔黄厚时多看阳明。" },
      { key: "taiyin", title: syndromes.taiyin.name, position: syndromes.taiyin.position, summary: syndromes.taiyin.summary, treatment: "常见思路是健脾化痰、温中和胃，慎用过寒过攻。", feverCough: "食欲差、腹胀、大便稀、白痰多、遇冷加重时多看太阴。" },
      { key: "shaoyin", title: syndromes.shaoyin.name, position: syndromes.shaoyin.position, summary: syndromes.shaoyin.summary, treatment: "少阴提示正气不足或病情较深，儿童不适合自行判断处理。", feverCough: "精神差、嗜睡、声音低弱、畏寒肢冷时建议医生评估。" },
      { key: "jueyin", title: syndromes.jueyin.name, position: syndromes.jueyin.position, summary: syndromes.jueyin.summary, treatment: "厥阴常见寒热错杂，需要综合判断，不能简单清热或温里。", feverCough: "上热下寒、表现反复、病程迁延时应由医生辨证。" }
    ]
  }
});
