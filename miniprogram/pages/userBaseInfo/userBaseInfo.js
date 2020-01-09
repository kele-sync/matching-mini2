// miniprogram/pages/userBaseInfo/userBaseInfo.js
const app = getApp()
const db = wx.cloud.database();
Page({
  data: {
    //个人信息
    iconLink: '',
    username: '',
    gender: '',
    accept: false,
    isPush: false,
    //控制显示面板
    genderPanel: {
      show: false,
      items: ['男', '女'],
      target: "gender"
    }
  },
  onLoad: function () {
    this.initUserInfo();
  },
  initUserInfo() {
    const userInfo = wx.getStorageSync('userBaseInfo');
    if (userInfo) {
      const u = JSON.parse(userInfo);
      this.setData({
        iconLink: u.iconLink,
        username: u.username,
        gender: u.gender,
        accept: u.accept,
        isPush: u.isPush
      })
    } else {
      const u = app.globalData.userInfo;
      this.setData({
        iconLink: u.avatarUrl,
        username: u.nickName,
        gender: u.gender ? "男" : "女",
        apartment: u.province + '/' + u.city,
      })
    }
  },
  saveUserData() {
    if (!this.data.username) {
      return wx.showToast({
        title: '昵称不能为空',
        icon: 'none',
        duration: 2000,
      });
    }
    wx.showLoading({
      title: '资料保存中',
    });
    const u = this.data;
    const data = {
      iconLink: u.iconLink,
      username: u.username,
      gender: u.gender,
      accept: u.accept,
      isPush: u.isPush,
    };
    db.collection('userBaseInfo').doc(app.globalData.userId).set({
      data,
      success: res => {
        //保存成功就tmd刷新缓存中的userInfo
        wx.setStorageSync('userBaseInfo', JSON.stringify(data));
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000,
          success: () => {
            wx.navigateBack()
          }
        });
      },
      fail: err => {
        wx.showToast({
          title: '保存失败',
          icon: 'none',
          duration: 2000
        })
      },
    })
  },
  updateIcon() {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],
      count: 1, // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths[0]
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        const cloudPath = 'userImg/' + app.globalData.userInfo.nickName + '/' + filePath.match(/\w+\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            that.setData({
              iconLink: res.fileID
            });
          },
          fail: e => {
            wx.showToast({
              icon: 'none',
              title: '上传失败',
              duration: 2000
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      }
    });
  },

  callPanel(e) {
    const str = e.currentTarget.dataset.id + '.show'
    this.setData({
      [str]: e.currentTarget.dataset.value
    })
  },
  panelConfirm(e) {
    const type = e.currentTarget.dataset.id;
    this.setData({
      [type + '.show']: false,   //固定关闭panel
      [this.data[type].target]: e.detail.value  //根据panel的target设置数据
    })
  },

  commonInput(e) {
    this.setData({
      [e.currentTarget.dataset.id]: e.detail.value
    });
  },
  commonInputVal(e) {
    this.setData({
      [e.currentTarget.dataset.id]: e.detail
    });
  },
})