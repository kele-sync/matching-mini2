// miniprogram/pages/cpQuestion/cpQuestion.js
const app = getApp()
const db = wx.cloud.database();
Page({
  data: {
    experience: '',
    plan: "",
    hobby: "",
    expect: '',
    whoAmI: ''
  },
  onLoad: function (options) {
    this.pageInit()
  },
  pageInit() {
    db.collection('cpQuestion').where({
      _openid: app.globalData.userId
    }).get({
      success: res => {
        const [u] = res.data;
        this.setData({
          experience: u.experience,
          plan: u.plan,
          hobby: u.hobby,
          expect: u.expect,
          whoAmI: u.whoAmI
        })
      }
    })
  },
  commonInput(e) {
    console.log(e)
    this.setData({
      [e.currentTarget.dataset.id]: e.detail
    });
  },
  saveUserData() {
    wx.showLoading({
      title: '资料保存中',
    });
    const u = this.data;
    const data = {
      experience: u.experience,
      plan: u.plan,
      hobby: u.hobby,
      expect: u.expect,
      whoAmI: u.whoAmI
    };
    db.collection('cpQuestion').doc(app.globalData.userId).set({
      data,
      success: res => {
        wx.showToast({
          title: "问卷保存成功",
          icon: "success",
          duration: 2000,
          success: () => {
            wx.navigateBack()
          }
        })
      }
    })

  },
})