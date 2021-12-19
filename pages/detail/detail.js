const app = getApp()
let db = wx.cloud.database()
let goodId = ''
Page({
  data: {
    cartList: [],
    totalPrice: 0,
    totalNum: 0,

    animationData: {},
    animationMask: {},
    maskVisual: "hidden",
    maskFlag: true,
    attention: 0

  },
  onLoad(opt) {
    goodId = opt.goodid
    console.log('商品id', goodId)
    this.getGoodDetail()
    this.getCommentList();
  },
  getCommentList() {
    wx.cloud.callFunction({
      name: 'getPinglun',
      data: {
        goodId: goodId
      }
    }).then(res => {
      console.log("查询评论结果", res)
      if (res && res.result && res.result.data) {
        let dataList = res.result.data;
        this.setData({
          list: dataList
        })
      } else {
        this.setData({
          list: []
        })
      }
    }).catch(res => {
      console.log("查询评论失败", res)
    })
  },


  getGoodDetail() {

    let cartList = wx.getStorageSync('cart') || [];

    db.collection('goods').doc(goodId).get()
      .then(res => {
        console.log('获取商品详情成功', res)
        let good = res.data

        good.quantity = 0;
        cartList.forEach(cart => {
          if (cart._id == good._id) {
            good.quantity = cart.quantity ? cart.quantity : 0;
          }
        })
        this.setData({
          cartList: cartList,
          good: good,

        })
        this.getTotalPrice()
      })
      .catch(res => {
        console.log('获取商品详情失败', res)
      })
  },


  minusCount(e) {
    let good = e.currentTarget.dataset.item;
    let cartList = wx.getStorageSync('cart') || [];

    if (good.quantity && good.quantity > 0) {
      good.quantity -= 1;
    } else {
      good.quantity = 0;
    }
    if (cartList.length > 0) {
      cartList.forEach(cart => {
        if (cart._id == good._id) {
          cart.quantity ? cart.quantity -= 1 : 0
          if (cart.quantity <= 0) {

            this.removeByValue(cartList, good._id)
          }
          if (cartList.length <= 0) {
            this.setData({
              cartList: [],
              totalNum: 0,
              totalPrice: 0,
            })
          }
          try {
            wx.setStorageSync('cart', cartList)
          } catch (e) {
            console.log(e)
          }
        }
      })
    }
    this.setData({
      cartList: cartList,
      good: good
    })
    this.getTotalPrice();
  },

  removeByValue(array, id) {
    for (var i = 0; i < array.length; i++) {
      if (array[i]._id == id) {
        array.splice(i, 1);
        break;
      }
    }
  },
  copyPhone(e) {
    // 大坑 复制时 不能 复制字符串
    var result = e.currentTarget.dataset.data.toString()
    wx.setClipboardData({
      data: result,
      success(res) {
        wx.getClipboardData({
          success(res) {
            wx.showToast({
              icon: "none",
              title: '成功复制联系方式',
            })
          }
        })
      }
    })
  },
  // 轮播图点击放大保存 =====>功能暂未实现
  // previewImage(e){
  //   console.log(e);
  //   var that = this;
  //   var current = e.target.dataset.src;
  //   var imgList = e.target.dataset.list
  //   console.log(123, e, imgList, current)
  //   //图片预览
  //   wx.previewImage({
  //     current: current, // 当前显示图片的http链接
  //     urls: imgList // 需要预览的图片http链接列表
  //   })
  // },

  addCount(e) {
    let good = e.currentTarget.dataset.item;
    console.log("添加good", e)
    console.log("添加good", good)
    let cartList = wx.getStorageSync('cart') || [];
    let f = false;

    if (good.quantity >= good.num) {
      wx.showToast({
        icon: 'none',
        title: '超过库存数量',
      })
      return;
    }
    good.quantity += 1;


    if (cartList.length > 0) {

      cartList.forEach(cart => {
        if (cart._id == good._id) {
          cart.quantity += 1;
          f = true;
          try {
            wx.setStorageSync('cart', cartList)
          } catch (e) {
            console.log(e)
          }
        }
      })
      if (!f) {
        cartList.push(good);
      }
    } else {
      cartList.push(good);
    }
    try {
      wx.setStorageSync('cart', cartList)
    } catch (e) {
      console.log(e)
    }
    this.setData({
      cartList: cartList,
      good: good
    })
    this.getTotalPrice();
  },



  getTotalPrice() {
    var cartList = this.data.cartList;
    var totalP = 0;
    var totalN = 0
    for (var i in cartList) {
      totalP += cartList[i].quantity * cartList[i].price;
      totalN += cartList[i].quantity
    }
    this.setData({
      cartList: cartList,
      totalNum: totalN,

      totalPrice: totalP
    });
  },

  cleanList() {
    let good = this.data.good
    good.quantity = 0
    try {
      wx.setStorageSync('cart', "")
    } catch (e) {
      console.log(e)
    }
    this.setData({
      good: good,
      cartList: [],
      totalNum: 0,
      totalPrice: 0,
    })
    this.cascadeDismiss()
  },

  deleteOne(e) {
    let good = this.data.good
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let arr = wx.getStorageSync('cart')
    if (good._id == id) {
      good.quantity = 0;
    }
    arr.splice(index, 1);
    if (arr.length <= 0) {
      this.setData({
        good: good,
        cartList: [],
        totalNum: 0,
        totalPrice: 0,
      })
      this.cascadeDismiss()
    }
    try {
      wx.setStorageSync('cart', arr)
    } catch (e) {
      console.log(e)
    }
    this.setData({
      cartList: arr,
      good: good
    })
    this.getTotalPrice()
  },

  cascadeToggle() {
    var that = this;
    var arr = this.data.cartList
    if (arr.length > 0) {
      if (that.data.maskVisual == "hidden") {
        that.cascadePopup()
      } else {
        that.cascadeDismiss()
      }
    } else {
      that.cascadeDismiss()
    }
  },
  cascadePopup() {
    var that = this;
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-in-out',
      delay: 0
    });
    that.animation = animation;
    animation.translate(0, -285).step();
    that.setData({
      animationData: that.animation.export(),
    });
    var animationMask = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear',
    });
    that.animationMask = animationMask;
    animationMask.opacity(0.8).step();
    that.setData({
      animationMask: that.animationMask.export(),
      maskVisual: "show",
      maskFlag: false,
    });
  },

  cascadeDismiss() {
    var that = this

    that.animation.translate(0, 285).step();
    that.setData({
      animationData: that.animation.export()
    });

    that.animationMask.opacity(0).step();
    that.setData({
      animationMask: that.animationMask.export(),
    });

    that.setData({
      maskVisual: "hidden",
      maskFlag: true
    });
  },

  gotoOrder: function () {
    var arr = wx.getStorageSync('cart') || [];
    if (!arr || arr.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请选择商品'
      })
      return;
    }

    let userInfo = app.globalData.userInfo;
    if (!userInfo || !userInfo.nickName) {
      this.showLoginView()
      return;
    }
    wx.navigateTo({
      url: '/pages/pay/pay'
    })
  },


  showLoginView() {
    this.setData({
      isShowAddressSetting: true
    })
  },

  closeLoginView() {
    this.setData({
      isShowAddressSetting: false
    })
  },

  goLogin() {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        console.log("获取用户信息成功", res)
        let user = res.userInfo
        this.setData({
          isShowAddressSetting: false
        })
        user.openid = app.globalData.openid;
        app._saveUserInfo(user);
        wx.navigateTo({
          url: '/pages/pay/pay'
        })
      },
      fail: res => {
        console.log("获取用户信息失败", res)
      }
    })
  },

  previewImg(event) {
    let index = event.currentTarget.dataset.index
    wx.previewImage({
      current: this.data.good.img[index],
      urls: this.data.good.img
    })
  }
})