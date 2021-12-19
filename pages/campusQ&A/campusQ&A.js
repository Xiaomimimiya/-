// miniprogram/pages/campusQ&A/CampusQ&A.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      QAlist:[],
      answercontent:[]
     
    
      //     Q: "学校的心理咨询室在哪？",
      //     A: "明德楼，预约电话：58139093。"
   
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      let that = this
      wx.cloud.database().collection("question")
      .get({
        success(res){
          
          that.setData({
            QAlist:res.data
          })     

        },
        fail(res){
          console.log(res);
        }
      })


    },
    
  })