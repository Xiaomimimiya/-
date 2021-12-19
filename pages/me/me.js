
const app = getApp();
Page({
  // 页面的初始数据
  data: {
    isShowUserName: false,
    userInfo: null,
  },
  //获取用户信息
  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 获取用户个人信息
      success: (res) => {
        console.log("获取用户信息成功", res)
        let user = res.userInfo
        this.setData({
          isShowUserName: true,
          userInfo: user,
        })
        user.openid = app.globalData.openid;
        app._saveUserInfo(user);
      },
      fail: res => {
        console.log("获取用户信息失败", res)
      }
    })
  },
  // =======================点击事件处理=================
  //用户点击退出登录
  tuichu() {
    this.setData({
      isShowUserName: false,
      userInfo: null,
    })
    app._saveUserInfo(null);
  },
  clearStorage(){
      wx.clearStorage({
        success: (res) => {
            console.log(res)
            wx.showToast({
              icon:"none",
              title: '清理成功',
            })
        },
      })
  },

  onShow() {
    var user = app.globalData.userInfo;
    if (user && user.nickName) {
      this.setData({
        isShowUserName: true,
        userInfo: user,
      })
    }
  },
})