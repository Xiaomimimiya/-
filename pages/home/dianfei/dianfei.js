// pages/home/dianfei/dianfei.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onLoad() {
  },
  copyLink: function () {
    var toCopy = 'http://10.200.1.155:8080/kdgl/login!reLogin.action'
    wx.setClipboardData({
      data: toCopy,
      success: res => {
        wx.showToast({
          icon: "none",
          title: '已复制电费查阅链接',
          duration: 1000,
        })
      }
    })
  },
})