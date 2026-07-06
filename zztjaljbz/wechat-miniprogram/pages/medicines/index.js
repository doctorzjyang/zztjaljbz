const { syndromes, medicines } = require("../six-channel/data");

function syndromeLabel(keys) {
  return keys.map(key => syndromes[key] ? syndromes[key].name : key).join("、");
}

Page({
  data: {
    medicines: medicines.map(item => ({
      ...item,
      ingredientsText: item.ingredients.join("、"),
      syndromesText: syndromeLabel(item.syndromes)
    }))
  }
});
