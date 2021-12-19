// pages/home/news_detail/news_detail.js
Page({


    data: {
        notice:[],
        contentInfo:[]
    },
    onLoad: function (options) {
        let that = this
        var id = options.id
        wx.showLoading({
            title: '加载中',
        })
        wx.cloud.database().collection("noticeList")
            .doc(id)
            .get({
                success(res) {
                    var contents = res.data.content
    
                    that.setData({
                        notice: res.data,
                        contentInfo:contents
                    })
        
                },
                fail(err) {
                    console.log("请求失败", err)
                }
            })
        wx.hideLoading()
        
       
    },
    // 复制新闻原链接
    copyLink:function(){
        let that=this;
        var copylink = that.data.notice.link
        wx.setClipboardData({
          data: copylink,
          success: res => {
            wx.showToast({
              icon:"none",
              title: '成功复制新闻原链接',
              duration: 1000,
            })
          }
        })
      },
    
})