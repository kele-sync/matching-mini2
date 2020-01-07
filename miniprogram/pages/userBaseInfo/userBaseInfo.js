// miniprogram/pages/userBaseInfo/userBaseInfo.js
const app = getApp()
const db = wx.cloud.database();
Page({
  data: {
    //个人信息
    iconLink: '',
    username: '',
    gender: '',
    birthday: '',
    homeland: '',
    apartment: '',
    height: '',
    weight: '',
    imageList: [],
    //控制显示面板
    genderPanel: {
      show: false,
      items: ['男', '女'],
      target: "gender"
    },
    birthdayPanel: {
      show: false,
      target: "birthday",
      defaultTime: new Date(1993, 2, 20).getTime(),
      maxDate: new Date().getTime(),
    },
    homelandPanel: {
      show: false,
      target: 'homeland'
    },
    areaList: {},
    apartmentPanel: {
      show: false,
      target: 'apartment'
    },
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
  },
  onLoad: function () {
    this.getAreaList();
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
        birthday: u.birthday,
        homeland: u.homeland,
        apartment: u.apartment,
        imageList: u.imageList,
        height: u.height,
        weight: u.weight,
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
    wx.showLoading({
      title: '资料保存中',
    });
    const u = this.data;
    const user = {
      iconLink: u.iconLink,
      username: u.username,
      gender: u.gender,
      birthday: u.birthday,
      homeland: u.homeland,
      apartment: u.apartment,
      height: u.height,
      weight: u.weight,
      imageList: u.imageList,
    };

    db.collection('userBaseInfo').doc(app.globalData.userId).set({
      data: user, success: res => {
        //保存成功就tmd刷新缓存中的userInfo
        wx.setStorageSync('userBaseInfo', JSON.stringify(user));
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
          icon: 'fail',
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
      count: 9, // 可以指定来源是相册还是相机，默认二者都有
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
  chooseImage: function (e) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],
      count: 9, // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        wx.showLoading({
          title: '上传中',
        })
        const imagePaths = res.tempFilePaths;
        let uploads = [];
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        for (let index = 0; index < imagePaths.length; index++) {
          const filePath = imagePaths[index];
          const cloudPath = 'userImg/' + app.globalData.userInfo.nickName + '/' + filePath.match(/\w+\.[^.]+?$/)[0]
          uploads[index] = new Promise((resolve, reject) => {
            wx.cloud.uploadFile({
              cloudPath,
              filePath,
              success: res => {
                resolve(res.fileID)
              },
              fail: e => {
                reject(e)
              },
              complete: () => {
                wx.hideLoading()
              }
            })
          });
        }
        Promise.all(uploads).then((result) => {
          this.setData({
            imageList: [...this.data.imageList, ...result]
          })

        }).catch((err) => {
          wx.showToast({
            icon: 'fail',
            title: '上传失败',
            duration: 2000
          })
        });

      }
    });
  },
  getAreaList() {
    wx.request({
      url: 'https://616c-alice-dc9701-1258866920.tcb.qcloud.la/projectState/datacenter/areaList.json?sign=3e2892d76cc3168f7bce1690c188a374&t=1565440496',
      success: response => {
        this.setData({
          areaList: response.data.data
        });
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
  birthdayConfirm(e) {
    const date = new Date(e.detail);
    this.setData({
      birthday: date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate(),
      ['birthdayPanel.show']: false
    })
  },
  handleAreaConfirm(e) {
    const type = e.currentTarget.dataset.id;
    const data = e.detail.values;
    this.setData({
      [this.data[type].target]: data.map(i => i.name).join('/'),
      [type + ".show"]: false
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
  }
})