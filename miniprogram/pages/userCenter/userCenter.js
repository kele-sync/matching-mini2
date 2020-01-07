//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    alreadyRegister: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onShow: function () {
    if (app.globalData.userInfo) {
      this.userInfoInit(app.globalData.userInfo)
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.userInfoInit(res.userInfo)
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            alreadyRegister: true
          })
        }
      })
    }
  },
  userInfoInit(userInfo) {
    const userBaseInfo = wx.getStorageSync('userBaseInfo');
    if (userBaseInfo) {
      const u = JSON.parse(userBaseInfo)
      this.setData({
        userInfo: {
          avatarUrl: u.iconLink,
          nickName: u.username
        },
        alreadyRegister: true
      })
    } else {
      this.setData({
        userInfo: userInfo,
        alreadyRegister: true
      })
    }
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      alreadyRegister: true
    })
  }
})
