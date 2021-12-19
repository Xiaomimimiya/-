// pages/club/item/item.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        club: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        var id = options.id
        wx.showLoading({
            title: '加载中',
        })
        wx.cloud.database().collection("club")
            .doc(id)
            .get({
                success(res) {
                    console.log(res.data);
                    that.setData({
                        club: res.data,
                    })
                },
                fail(err) {
                    console.log("请求失败", err)
                }
            })
        wx.hideLoading()
    },

    copy: function (e) {
        let that=this;
        var copylink = that.data.club.phone
        wx.setClipboardData({
          data: copylink,
          success: res => {
            wx.showToast({
              icon:"none",
              title: '成功复制社团联系方式',
              duration: 1000,
            })
          }
        })
    }

})