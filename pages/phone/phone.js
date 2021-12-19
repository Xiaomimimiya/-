// pages/phone/phone.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        loading: true,
        search: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getList()
    },
    // 获取数据
    getList() {
        let that = this
        wx.cloud.database().collection("phone")
            .get({
                success(res) {
                    that.setData({
                        list: res.data
                    })
                },
                fail(res) {
                    console.log(res);
                }
            })
    },
    // 查找电话
    search: function (e) {
        const db = wx.cloud.database();
        let that = this
        let val = e.detail.value
        db.collection("phone")
        .where({
                name: db.RegExp({
                    regexp: val,
                    options: "i"
                })
            }) .get({
                success(res) {
                    console.log(res);
                    that.setData({
                        list:res.data
                    })
                }
        })
    },
    // 打电话
    call: function (e) {
        console.log(e);
        let phone = e.currentTarget.dataset.phone
        console.log(phone);
        if (phone == '') {
            app.msg("电话号码为空，无法拨打")
            return
        }
        wx.makePhoneCall({
            phoneNumber: phone
        })
    },
    // 复制电话
    copy: function (e) {
        let phone = e.currentTarget.dataset.phone
        wx.setClipboardData({
            data: phone
        })
    }

})