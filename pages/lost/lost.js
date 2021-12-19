const app = getApp()
import { openArticle } from "../../utils/commen"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        customBar: app.globalData.customBar,
        loading: false,
        list: [],
        detailIndex: 0,
        isShow: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function (options) {
        this.getList()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        app.share('点击查看失物招领列表')
    },

    getList() {
        let that = this
        wx.cloud.database().collection("lost")
            .orderBy("time", "desc")
            .get({
                success(res) {
                    var data = res.data
                    console.log(data);
                    that.setData({
                        loading: true,
                        list: data
                    })
                },
                fail(err) {
                    console.log("请求失败", err)
                }
            })

    },
    // 点击查看详情
    viewItem: function (e) {
        let index = e.currentTarget.dataset.index
        this.setData({
            detailIndex: index,
            showDetail: true
        })
    },
    // 隐藏详情
    hideModal: function () {
        this.setData({
            showDetail: false
        })
    },

    release() {
        openArticle('http://mp.weixin.qq.com/s?__biz=Mzg3NTcyMDAzOQ==&mid=2247483680&idx=1&sn=d979061b3d25d26e7044065285321e01&chksm=cf3c7d28f84bf43ecf95eda883368384860ce87e3ed10cdcf944fbb4adc3547ebd30ad36d087#rd')
    }
})