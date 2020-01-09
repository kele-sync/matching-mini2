// pages/myhope/myhope.js
const app = getApp()
const db = wx.cloud.database();
const cities = require('../../utils/cities');

Page({
  data: {
    height: '',
    weight: '',
    age: '',
    job: '',
    education: '',
    location: '',
    yearlySalary: '',
    myDescribe: '',
    educationPanel: {
      show: false,
      target: 'education',
      columns: ["高中以上", "大专以上", "本科以上", "研究生以上", "博士以上", "无要求"]
    },
    locationPanel: {
      show: false,
      cities: cities
    },
    yearlyPanel: {
      show: false,
      target: 'yearlySalary',
      columns: ['<8万', '8~15万', '15~25万', '25~50万', '50~100万', '>100万']
    },
  },
  pageDataInit() {
    const userExpect = wx.getStorageSync('userExpect');
    if (userExpect) {
      const u = JSON.parse(userExpect);
      this.setData({
        height: u.height,
        weight: u.weight,
        age: u.age,
        job: u.job,
        education: u.education,
        location: u.location,
        yearlySalary: u.yearlySalary,
        myDescribe: u.myDescribe,
      })
    }
  },
  saveHopeData() {
    wx.showLoading({
      title: '资料保存中',
    });
    const u = this.data;
    const data = {
      height: u.height,
      weight: u.weight,
      age: u.age,
      job: u.job,
      education: u.education,
      location: u.location,
      yearlySalary: u.yearlySalary,
      myDescribe: u.myDescribe,
    };
    db.collection('userExpect').doc(app.globalData.userId).set({
      data,
      success: res => {
        wx.setStorageSync('userExpect', JSON.stringify(data));
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
  locationConfirm(e) {
    const city = e.detail.values.map(i => i.name);
    this.setData({
      location: city.join('/'),
      'locationPanel.show': false
    });
  },
  commonConfirm(e) {
    const panelName = e.currentTarget.dataset.id;
    this.setData({
      [this.data[panelName].target]: e.detail.value,
      [panelName + '.show']: false
    })
  },
  callPanel(e) {
    const str = e.currentTarget.dataset.id + '.show'
    this.setData({
      [str]: e.currentTarget.dataset.value
    })
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
    this.setData({
      [e.currentTarget.dataset.id]: +e.detail
    });
  },
  onLoad: function () {
    this.pageDataInit();
  }
})