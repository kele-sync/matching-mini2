// miniprogram/pages/myinfo/myinfo.js
const app = getApp()
const db = wx.cloud.database();

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
      defaultTime: new Date().getTime(),
      maxDate: new Date().getTime(),
    },





    isNewUser: true,
    username: '',
    profession: '',
    timeShow: false,
    birthDay: '',
    currentDate: new Date(1993, 1, 20).getTime(),
    maxDate: new Date().getTime(),
    areaList: {},
    area: '',
    localArea: '',
    areaShow: false,
    localAreaShow: false,
    gender: "1",
    eduShow: false,
    education: '',
    eduColumns: ["高中", '专科', "本科", "研究生", "博士"],
    school: '',
    height: '',
    weight: '',
    salaryShow: false,
    salary: '',
    salaryColumns: ['2000元以下', "2000~5000元", "5000~10000元", "10000~20000元", "20000~50000元", "50000元以上", "暂且保密"],
    roomShow: false,
    room: '',
    roomColumns: ["已购住房", "独自租房", "与人合租", "与父母同住", "需要时购置", "暂且保密"],
    carShow: false,
    car: '',
    carColumns: ["暂未购车", "已经购车", "暂且保密"],
    imageList: [],
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
  },

  onLoad: function (options) {
    this.getAreaList();
    if (app.globalData.userInfo) {
      this.setData({
        gender: app.globalData.userInfo.gender.toString()
      })
    }
    this.getUserData()

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
})