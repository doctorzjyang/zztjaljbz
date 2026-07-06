Page({
  openSixChannel() {
    wx.navigateTo({
      url: "/pages/six-channel/index"
    });
  },

  openTheory() {
    wx.navigateTo({
      url: "/pages/theory/index"
    });
  },

  openMedicines() {
    wx.navigateTo({
      url: "/pages/medicines/index"
    });
  }
});
