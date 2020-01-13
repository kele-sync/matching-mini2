//app.js
let db;
App({
  onLaunch: function () {
    // 获取用户信息
    wx.cloud.init(
    { traceUser: true,}
    );
    db = wx.cloud.database()
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框 
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    this.getUserId()
  },
  getUserInfo(_openid) {
    db.collection('userBaseInfo').where({
      _openid
    }).get({
      success: res => {
        const [userInfo] = res.data;
        if (userInfo) {
          //如果有userInfo,就tmd保存在storage中
          wx.setStorageSync('userBaseInfo', JSON.stringify(userInfo));
        }
      }
    });
    db.collection('userDetailInfo').where({
      _openid
    }).get({
      success: res => {
        const [detailInfo] = res.data;
        if (detailInfo) {
          //如果有detailInfo,就tmd保存在storage中
          wx.setStorageSync('userDetailInfo', JSON.stringify(detailInfo));
        }
      }
    });
    db.collection('userExpect').where({
      _openid
    }).get({
      success: res => {
        const [userExpect] = res.data;
        if (userExpect) {
          //如果有userExpect,就tmd保存在storage中
          wx.setStorageSync('userExpect', JSON.stringify(userExpect));
        }
      }
    });

  },
  getUserId() {
    let self = this;
    wx.cloud.callFunction({
      name: 'login',
      success: res => {
        self.globalData.userId = res.result.openid;
        this.getUserInfo(res.result.openid);
      },
    })
  },
  globalData: {
    userInfo: null,
    userId: undefined,
  }
})