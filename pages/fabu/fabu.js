
let app = getApp();
Page({
  data: {
    array: ["书籍", '日用品', '电脑', '手机', '学习用品', '考研资料', '自行车', '电子产品', '化妆品', '其他'],
    index: 0,
    imgList: [],
    fileIDs: [],
  },
  //选择商品类型
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value
    })
  },

  //选择图片
  ChooseImage() {
    wx.chooseImage({
      count: 8 - this.data.imgList.length, //默认9,我们这里最多选择8张
      sizeType: ['compressed'], //可以指定是原图还是压缩图，这里用压缩
      sourceType: ['album', 'camera'], //从相册选择
      success: (res) => {
        console.log("选择图片成功", res)
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
        console.log("路径", this.data.imgList)
      }
    });
  },
  //删除图片
  DeleteImg(e) {
    wx.showModal({
      title: '要删除这张照片吗？',
      content: '',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })


  },

  //上传数据
  publish(e) {
    console.log(e.detail.value)
    let good = e.detail.value
    if (!good.name) {
      wx.showToast({
        icon: "none",
        title: '请填写商品名'
      })
      return
    }
    if (!good.price || good.price <= 0) {
      wx.showToast({
        icon: "none",
        title: '请填写价格'
      })
      return
    }
    if (!good.num || good.num <= 0) {
      wx.showToast({
        icon: "none",
        title: '请填写数量'
      })
      return
    }
    if (!good.content || good.content.length < 6) {
      wx.showToast({
        icon: "none",
        title: '描述必须大于6个字'
      })
      return
    }
    //图片相关
    let imgList = this.data.imgList
    if (!imgList || imgList.length < 1) {
      wx.showToast({
        icon: "none",
        title: '请选择图片'
      })
      return
    }
    wx.showLoading({
      title: '发布中...',
    })

    const promiseArr = []
    //一张张上传 遍历临时的图片数组
    for (let i = 0; i < this.data.imgList.length; i++) {
      let filePath = this.data.imgList[i]
      // 正则表达式，获取文件扩展名
      let suffix = /\.[^\.]+$/.exec(filePath)[0];

      promiseArr.push(new Promise((reslove, reject) => {
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + suffix,
          filePath: filePath, // 上传文件路径
        }).then(res => {
          // get resource ID
          console.log("上传结果", res.fileID)
          this.setData({
            fileIDs: this.data.fileIDs.concat(res.fileID)
          })
          reslove()
        }).catch(error => {
          console.log("上传失败", error)
        })
      }))
    }
    //所有图片都上传成功后
    let db = wx.cloud.database()
    Promise.all(promiseArr).then(res => {
      db.collection('goods').add({
        data: {
          content: good.content,
          num: parseInt(good.num),
          price: parseInt(good.price),
          name: good.name,
          type: good.type, //类型
          img: this.data.fileIDs,
          address: good.address,
          Contact: good.Contact,
          status: '上架',
          tuijian: false, //是否确定让商品上推荐位
          _createTime: new Date().getTime() //创建的时间
        },
        success: res => {
          wx.hideLoading()
          wx.showToast({
            title: '发布成功',
          })
          //清空数据
         this.setData({
          imgList: [],
          fileIDs: [],
         })
          console.log('发布成功', res)
          wx.navigateTo({
            url: '/pages/newGood/newGood',
          })
        
        },
        fail: err => {
          wx.hideLoading()
          wx.showToast({
            icon: 'none',
            title: '网络不给力....'
          })
          console.error('发布失败', err)
        }
      })
    })
  },

})