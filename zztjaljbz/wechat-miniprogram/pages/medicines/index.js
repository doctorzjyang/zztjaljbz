const { syndromes, medicines } = require("../six-channel/data");

function syndromeLabel(keys) {
  return keys.map(key => syndromes[key] ? syndromes[key].name : key).join("、");
}

const medicineList = medicines.map(item => ({
  ...item,
  ingredientsText: item.ingredients.join("、"),
  syndromesText: syndromeLabel(item.syndromes)
}));

Page({
  data: {
    keyword: "",
    totalCount: medicineList.length,
    filteredCount: medicineList.length,
    noResults: false,
    medicines: medicineList
  },

  onSearchInput(event) {
    const keyword = (event.detail.value || "").trim();
    const lower = keyword.toLowerCase();
    const filtered = lower
      ? medicineList.filter(item => [
        item.name,
        item.ingredientsText,
        item.effect,
        item.syndromesText,
        item.suitable,
        item.caution
      ].join(" ").toLowerCase().includes(lower))
      : medicineList;
    this.setData({
      keyword,
      medicines: filtered,
      filteredCount: filtered.length,
      noResults: filtered.length === 0
    });
  },

  clearSearch() {
    this.setData({
      keyword: "",
      medicines: medicineList,
      filteredCount: medicineList.length,
      noResults: false
    });
  }
});
