// pages/club/club.js
Page({
    data: {
        list: [],
        search: '',
        values: "",
        category: [{
            id: 0,
            name: "全部分类",
        }, {
            id: 1,
            name: "文化艺术",
        },
        {
            id: 2,
            name: "科技创新",
        },
        {
            id: 3,
            name: "文娱体育",
        },
        {
            id: 4,
            name: "公益服务",
        }],
        cid: 0,
    },

    onLoad: function (options) {
        this.getList()
    },
    // 获取数据
    getList() {
        let that = this
        wx.cloud.database().collection("club")
            .get({
                success(res) {
                    console.log(res);
                    that.setData({
                        list: res.data
                    })
                },
                fail(res) {
                    console.log(res);
                }
            })
    },

    // 获取输入的搜索内容
    searchInput: function (e) {
        this.setData({
            search: e.detail.value
        })
    },
    //   搜索社团方法
    search: function (e) {
        const db = wx.cloud.database();
        let that = this
        db.collection("club")
            .where({
                name: db.RegExp({
                    regexp: that.data.search,
                    options: "i"
                })
            }).get({
                success(res) {
                    console.log(res);
                    that.setData({
                        list: res.data
                    })
                }
            })

    },
    // 选择
    selectCategory: function (e) {
        let select = e.detail.value

        let value = this.data.category[select].name

        this.setData({
            cid: select,
            values: value
        })
        if (this.data.cid == 0) {
            this.getList()
        } else {
            this.getCludList()
        }
    },
    // 设置函数来进行列表选择
    getCludList() {
        let that = this
        wx.cloud.database().collection("club")
            .where({
                category: that.data.values
            })
            .get({
                success(res) {
                    console.log(res.data);
                    that.setData({
                        list: res.data
                    })
                }
            })
    },
    // 展示社团详情
    showItem:function(e){
        let id = e.currentTarget.dataset.index
        wx.navigateTo({
            url: '/pages/club/item/item?id=' + id,
          })
      },
})