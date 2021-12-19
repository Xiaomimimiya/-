Page({
  data: {
    notice: {},
    TabCur: 0,
    scrollLeft: 0,
    list: ["学校要闻", "综合新闻", "科研信息", "教学信息"],
    curName: ["学校要闻"]
  },
  onLoad(){
    let  that = this
    that.getNew(that.data.curName)
  },
  tabSelect(e) {
    let that = this
    var id = e.currentTarget.dataset.id;
    that.setData({
      TabCur: id,
      curName: that.data.list[id]
    })
    that.onLoad(that.data.curName)
  },
  getNew(data){
    let that = this
    wx.cloud.database().collection("noticeList")
      .where({
        type: data
      })
      .orderBy('date', 'desc')
      .get({
        success(res) {
          let result = res.data
          console.log(res);
          that.setData({
            notice: result
          })
        },
        fail(res) {
          console.log(res);
        }
      })
  },
  /**
 * 显示通知详情页
 */
  showNotice: function (e) {
    let flag = e.currentTarget.dataset.flag;
    console.log(flag)
    wx.navigateTo({
      url: '/pages/home/news_detail/news_detail?id=' + flag,
    })
  },

  // 返回顶部
  onPageScroll: function (e) {
    // console.log(e) 自己设置 滚动距离,200
    if (e.scrollTop > 200) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },

  //回到顶部
  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },

})