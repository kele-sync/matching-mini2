// miniprogram/pages/myinfo/myinfo.js
const app = getApp()
const db = wx.cloud.database();
const cities = require('../../utils/cities');


Page({
  data: {
    phone: '',
    job: '',
    birthday: '',
    location: '',
    education: '',
    school: '',
    height: '',
    weight: '',
    photos: [],
    yearlySalary: '',
    houseSituation: '',
    carSituation: '',
    birthdayPanel: {
      show: false,
      target: "birthday",
      defaultDate: new Date(1993, 0, 0).getTime(),
      maxDate: new Date().getTime(),
      minDate: new Date(1970, 0, 0).getTime()
    },
    locationPanel: {
      show: false,
      cities: cities,
      target: 'location'
    },
    educationPanel: {
      show: false,
      target: "education",
      columns: ["高中", '专科', "本科", "研究生", "博士及以上"],
    },
    yearlyPanel: {
      show: false,
      target: 'yearlySalary',
      columns: ['<8万', '8~15万', '15~25万', '25~50万', '50~100万', '>100万']
    },
    housePanel: {
      show: false,
      target: 'houseSituation',
      columns: ["已购住房", "独自租房", "与人合租", "与父母同住", "需要时购置", "暂且保密"]
    },
    carPanel: {
      show: false,
      columns: ["暂未购车", "已经购车", "暂且保密"],
      target: 'carSituation'
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
  saveUserData() {
    wx.showLoading({
      title: '资料保存中',
    });
    const u = this.data;
    const data = {
      phone: u.phone,
      job: u.job,
      birthday: u.birthday,
      location: u.location,
      education: u.education,
      school: u.school,
      height: u.height,
      weight: u.weight,
      photos: u.photos,
      yearlySalary: u.yearlySalary,
      houseSituation: u.houseSituation,
      carSituation: u.carSituation
    };
    db.collection('userDetailInfo').doc(app.globalData.userId).set({
      data,
      success: res => {
        wx.setStorageSync('userDetailInfo', JSON.stringify(data));
        wx.showToast({
          title: "保存成功",
          icon: "success",
          duration: 2000,
          success: () => {
            wx.navigateBack()
          }
        })
      },
      fail: err => {
        wx.showToast({
          title: "保存失败",
          icon: "none",
          duration: 2000
        })
      }
    })
  },
  commonConfirm(e) {
    const panelName = e.currentTarget.dataset.id;
    this.setData({
      [this.data[panelName].target]: e.detail.value,
      [panelName + '.show']: false
    })
  },
  deleteImage(e) {
    const photos = [...this.data.photos].splice(e.detail.index, 1)
    this.setData({
      photos
    })
  },
  uploadToCloud(e) {
    const photos = e.detail.file;
    if (!photos.length) {
      wx.showToast({ title: '请选择图片', icon: 'none' });
    } else {
      console.log(photos);

      const uploadTasks = photos.map((file) => this.uploadFilePromise(file));
      Promise.all(uploadTasks)
        .then(data => {
          wx.showToast({ title: '上传成功', icon: 'none' });
          const newPhotos = data.map(item => {
            return {
              url: item.fileID, isImage: true
            }
          });
          this.setData({ photos: newPhotos });
        })
        .catch(e => {
          wx.showToast({ title: '上传失败', icon: 'none' });
          console.log(e);
        });
    }
  },

  uploadFilePromise(chooseResult) {
    return wx.cloud.uploadFile({
      cloudPath: 'userImg/' + app.globalData.userInfo.nickName + '/' + chooseResult.path.match(/\w+\.[^.]+?$/)[0],
      filePath: chooseResult.path
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
            photos: [...this.data.photos, ...result]
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
  onLoad: function () {
    this.userInfoInit()
  },
  userInfoInit() {
    const detailInfo = wx.getStorageSync('userDetailInfo');
    if (detailInfo) {
      const u = JSON.parse(detailInfo);
      this.setData({
        phone: u.phone,
        job: u.job,
        birthday: u.birthday,
        location: u.location,
        education: u.education,
        school: u.school,
        height: u.height,
        weight: u.weight,
        photos: u.photos,
        yearlySalary: u.yearlySalary,
        houseSituation: u.houseSituation,
        carSituation: u.carSituation
      })
    }
  },

  commonInputVal(e) {
    console.log(e)
    this.setData({
      [e.currentTarget.dataset.id]: e.detail.value
    });
  },
  commonInput(e) {
    console.log(e)
    this.setData({
      [e.currentTarget.dataset.id]: e.detail
    });
  },
  commonInputNumber(e) {
    console.log(e)
    this.setData({
      [e.currentTarget.dataset.id]: +e.detail
    });
  },
  callPanel(e) {
    const str = e.currentTarget.dataset.id + '.show'
    this.setData({
      [str]: e.currentTarget.dataset.value
    })
  },
  birthdayConfirm(e) {
    const date = new Date(e.detail);
    this.setData({
      birthday: date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate(),
      ['birthdayPanel.show']: false
    })
  },
  locationConfirm(e) {
    const city = e.detail.values.map(i => i.name);
    this.setData({
      location: city.join('/'),
      'locationPanel.show': false
    });
  },

})