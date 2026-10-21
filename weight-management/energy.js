// Energy estimates use the explicit ingredient assumptions below, not image size.
(() => {
  const foods = {
    rice:['米饭（熟）',116], bun:['馒头（成品）',223], corn:['玉米可食部',112],
    oats:['燕麦（干）',389], grain:['杂粮（干，示例平均值）',350], potato:['红薯',86],
    bread:['全麦面包（成品，示例值）',246], egg:['鸡蛋可食部',144], milk:['纯牛奶（每100毫升）',54],
    soyMilk:['无糖豆浆（每100毫升，示例值）',31], fish:['鱼净肉（以鲈鱼估算）',105],
    catfish:['昂刺鱼净肉（示例值）',124], chicken:['鸡肉（去皮）',133], leg:['鸡腿净肉（去皮）',146],
    pork:['瘦猪肉',143], beef:['瘦牛肉',106], shrimp:['虾仁',93], tofu:['豆腐（示例值）',81],
    driedTofu:['香干（示例值）',140], edamame:['毛豆仁',131], greens:['绿叶青菜（示例平均值）',20],
    mushroom:['鲜香菇',26], winterMelon:['冬瓜',12], waterBamboo:['茭白',26], cucumber:['黄瓜',16],
    cabbage:['白菜',17], broccoli:['西兰花',34], tomato:['番茄',20], celery:['芹菜',16],
    cauliflower:['花菜',23], spinach:['菠菜',28], fungi:['鲜菌菇（示例平均值）',26],
    noodles:['面条（干）',350], flour:['面粉（干）',350], mustard:['雪菜（示例值）',25],
    fruit:['完整水果（以苹果估算）',52], oil:['烹调油',900]
  };
  const b = (food,weight) => [[food,weight],['egg',50],['milk',250]];
  const r = (...parts) => [['rice',125],...parts];
  const wonton = [['flour',50],['pork',60],['greens',70],['greens',200],['tofu',100]];
  const dumpling = [['flour',65],['pork',60],['greens',80],['tofu',100],['greens',200]];
  // Row order follows data.js: seven days, three meals per day.
  const recipes = {
    home:[
      [b('bun',60),r(['fish',120],['greens',250]),r(['chicken',100],['mushroom',50],['winterMelon',200])],
      [b('corn',150),r(['pork',100],['waterBamboo',100],['cucumber',150]),r(['shrimp',100],['tofu',100],['cabbage',250])],
      [b('oats',40),r(['leg',120],['broccoli',250]),r(['egg',50],['driedTofu',60],['tomato',100],['greens',150])],
      [b('potato',150),r(['catfish',120],['greens',250]),[['rice',100],['chicken',100],['edamame',50],['winterMelon',250]]],
      [b('grain',40),r(['shrimp',80],['egg',50],['greens',250]),r(['beef',100],['celery',100],['cauliflower',150])],
      [b('bread',60),r(['pork',100],['spinach',250]),r(['fish',80],['tofu',100],['greens',250])],
      [b('corn',150),r(['beef',100],['greens',250]),r(['shrimp',80],['egg',50],['winterMelon',250])]
    ],
    office:[
      [b('bun',60),r(['fish',120],['greens',250]),r(['chicken',80],['driedTofu',60],['greens',250])],
      [b('corn',150),r(['egg',50],['tofu',150],['tomato',100],['greens',150]),[['noodles',65],['chicken',100],['greens',250]]],
      [b('oats',40),r(['leg',120],['winterMelon',125],['cauliflower',125]),r(['shrimp',120],['cucumber',250])],
      [b('bread',60),r(['beef',100],['greens',250]),wonton],
      [b('bun',60),r(['fish',120],['greens',150],['fungi',100]),r(['pork',60],['tofu',150],['cabbage',250])],
      [b('potato',150),r(['chicken',100],['waterBamboo',100],['greens',150]),r(['fish',120],['cauliflower',250])],
      [b('grain',40),r(['shrimp',80],['egg',50],['greens',250]),r(['pork',100],['broccoli',250])]
    ],
    noodle:[
      [b('bun',60),[['noodles',65],['chicken',100],['greens',250]],r(['fish',120],['greens',250])],
      [b('corn',150),wonton,r(['chicken',100],['fungi',100],['cucumber',150])],
      [b('bread',60),[['noodles',65],['beef',100],['greens',250]],r(['shrimp',120],['winterMelon',250])],
      [b('potato',150),r(['leg',120],['greens',250]),dumpling],
      [[['flour',45],['pork',40],['soyMilk',250]],r(['fish',120],['greens',250]),r(['pork',60],['tofu',150],['cabbage',250])],
      [[['flour',40],['pork',30],['greens',20],['egg',50],['milk',250]],[['flour',65],['chicken',60],['greens',80],['greens',200],['tofu',100]],r(['shrimp',80],['egg',50],['winterMelon',250])],
      [b('bun',60),[['noodles',65],['pork',100],['mustard',15],['greens',250]],r(['fish',120],['greens',250])]
    ]
  };
  function ingredient([id,weight]) {
    if(!foods[id] || !Number.isFinite(weight)) throw new Error('Invalid nutrition ingredient');
    return {id,name:foods[id][0],weight,unit:['milk','soyMilk'].includes(id)?'毫升':'克',per100:foods[id][1],kcal:weight*foods[id][1]/100};
  }
  const result = {};
  for(const [id,days] of Object.entries(recipes)) {
    result[id]=days.map((meals,day)=>{
      const shengjian=id==='noodle'&&day===4;
      const oils=shengjian?[5,7,8]:[0,10,10];
      const mealResults=meals.map((parts,m)=>{
        const items=[...parts,...(oils[m]?[['oil',oils[m]]]:[])].map(ingredient);
        return {items,kcal:Math.round(items.reduce((sum,item)=>sum+item.kcal,0))};
      });
      const extras=[['fruit',200],...(shengjian?[['milk',250]]:[])].map(ingredient);
      const extraKcal=Math.round(extras.reduce((sum,item)=>sum+item.kcal,0));
      return {meals:mealResults,extras,extraKcal,total:mealResults.reduce((sum,m)=>sum+m.kcal,0)+extraKcal};
    });
  }
  window.WEIGHT_ENERGY={days:result,foods};
})();
