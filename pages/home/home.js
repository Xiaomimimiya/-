const app = getApp()
let searchKey = '' //搜索词
Page({
  data: {
    search_content: '',
    banner: [{
    }
    ],
  },
  //页面可见
  onShow() {
    this.getTopBanner(); //请求顶部轮播图
    this.getHotGood()
  },

  //轮播图点击事件
  swiper_click(e) {
    console.log(e);
  },

  // =====================九宫格点击事件===================
  getSearchKey(e) {
    searchKey = e.detail.value
  },

  //搜索点击事件
  goSearch() {
    wx.navigateTo({
      url: '/pages/newGood/newGood?searchKey=' + searchKey,
    })
  },

  // 返回顶部
  onPageScroll: function (e) {
    // console.log(e) 自己设置 滚动距离,200
    if (e.scrollTop > 600) {
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



  //   点击 x 取消搜索 按钮事件
  CancleSearch: function () {
    this.setData({
      search_content: ''
    })
  },

  //获取首页顶部轮播图
  getTopBanner() {
    wx.cloud.database().collection("lunbotu")
      .get()
      .then(res => {
        console.log("首页banner成功", res.data)
        if (res.data && res.data.length > 0) {
          //如果后台配置轮播图就用后台的，没有的话就用默认的
          this.setData({
            banner: res.data
          })
        }
      }).catch(res => {
        console.log("首页banner失败", res)
      })
  },

  //获取首页推荐位的商品
  getHotGood() {
    wx.cloud.callFunction({
      name: "getGoodList",
      data: {
        action: 'getHot'
      }
    }).then(res => {
      console.log("首页推荐商品数据", res.result)
      this.setData({
        goodList: res.result.data,
      })
    }).catch(res => {
      console.log("商品数据请求失败", res)
    })
  },
  //去商品详情页
  goDetail(e) {
    wx.navigateTo({
      url: '/pages/detail/detail?goodid=' + e.currentTarget.dataset.id
    })
  },
  goMore() {
    wx.showToast({
      icon: "none",
      title: '更多功能开发中，请期待',
    })
  }
})