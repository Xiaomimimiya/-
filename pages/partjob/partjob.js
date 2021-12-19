// pages/partjob/partjob.js
import { openArticle } from "../../utils/commen"

Page({

    /**
     * 页面的初始数据
     */
    data: {
        joblist:[],
        newDateTime:Date.parse(new Date())
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getjibList()
    },
    
   
    getjibList(){
        let that = this
        wx.cloud.database().collection("partjob")
        .orderBy("sendtime","desc")
        .get({
            success(res){
                let data = res.data;
                that.setData({
                    joblist:data
                })

            },
            fail(res){
                console.log(res);
            }
        })
    },
    copyToClipboard: function (e) {
        wx.setClipboardData({
          //准备复制的数据
          data: e.currentTarget.dataset.data,
          success: function (res) {
            wx.showToast({
              title: '成功复制联系方式',
            });
          }
        });
      },
    
    release() {
        openArticle('http://mp.weixin.qq.com/s?__biz=Mzg3NTcyMDAzOQ==&mid=2247483680&idx=1&sn=d979061b3d25d26e7044065285321e01&chksm=cf3c7d28f84bf43ecf95eda883368384860ce87e3ed10cdcf944fbb4adc3547ebd30ad36d087#rd')
    }
})