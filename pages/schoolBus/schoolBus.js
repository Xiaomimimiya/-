Page({
    data: {
        start: null,
        startvalue: "",
        selectDate: {},
        todayDate: {},
        end: null,
        endvalue: "",
        picker: [
            '东校区', '白云校区', '赤岗教师村', '南校区', '北校区', '西校区'],
        list: [],
        hasBus: 0,
        scrollTopNum: 0,
        noBus: 1,   // 判断有没有车  1默认有 0没有 
        week:""
    },

    onLoad() {
        this.getTime()
        this.getBusData()
        
    },
    // 选择起点
    PickerStart(e) {
        var index = e.detail.value
        var startpick = this.data.picker[index]
        this.setData({
            start: index,
            startvalue: startpick,
        })
        console.log(this.data.startvalue);
    },
    // 选择终点
    PickerEnd(e) {
        var index = e.detail.value
        var endpick = this.data.picker[index]
        this.setData({
            end: index,
            endvalue: endpick
        })
        console.log(this.data.endvalue);

    },

    // 数据校车获取
    getBusData() {
        let that = this
        wx.cloud.database().collection("allBusLine")
            .where({
                startSite: this.data.startvalue,
                endSite: this.data.endvalue
            })
            .orderBy("_createTime","asc")
            .get({
                success(res) {
                    let result = res.data;
                    if (result.length!=0) {
                        console.log(result);
                        that.setData({
                            list: result,
                            hasBus: 1
                        })
                    } else {
                        that.setData({
                            hasBus:0
                        })
                    }
                },
                fail(err) {
                    console.log("请求失败", err)
                }
            })
    },
    /**
     * 监听页面到达顶部
     */
    ScrollToTop: function () {
        this.setData({
            scrollTopNum: 0
        })
    },
    /**
      * 点击查询按钮
      */
    check() {
        this.getBusData();
        var that = this
        if (that.data.startvalue == that.data.endvalue) {
            wx.showToast({
                icon: "none",
                title: '您所选择的路线暂时没有校车！',
            })
        }
    },
    /**
      * 点击复制按钮
      */

    copyPhone: function (e) {
        // 大坑 复制时 不能 复制字符串
        var result = e.currentTarget.dataset.data.toString()
        wx.setClipboardData({
            data: result,
            success(res) {
                wx.getClipboardData({
                    success(res) {
                        wx.showToast({
                            icon: "none",
                            title: '成功复制司机电话',
                        })
                    }
                })
            }
        })
    },
    // 获取当前时间
    getTime() {
        let nowDate = new Date()
        this.setData({
            selectDate: {
                year: nowDate.getFullYear(),
                month: (nowDate.getMonth() + 1) < 9 ? ("0" + (nowDate.getMonth() + 1)) : (nowDate.getMonth() + 1),
                day: nowDate.getDate() < 9 ? ("0" + nowDate.getDate()) : nowDate.getDate(),
                hour: nowDate.getHours(),
                minutes: nowDate.getMinutes(),
                week: this.transToWeek(nowDate.getDay()),
                weekZN: "今天",
                dateZN: (nowDate.getMonth() + 1) + "月" + nowDate.getDate() + "日"
            }
        })
        this.setData({
            todayDate: JSON.parse(JSON.stringify(this.data.selectDate)) //深拷贝对象
        })
    },
    // 转换星期几
    transToWeek(week) {
        switch (week) {
            case 1:
                return "星期一";
            case 2:
                return "星期二";
            case 3:
                return "星期三";
            case 4:
                return "星期四";
            case 5:
                return "星期五";
            case 6:
                return "星期六";
            case 0:
                return "星期日";
        }
      }


})