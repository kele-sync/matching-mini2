//index.js
//获取应用实例
const moment = require('../../utils/moment.min.js')
const app = getApp();
const db = wx.cloud.database();
const _ = db.command


Page({
  data: {
    time: 0,
    myExpect: {},
    myBaseData: {},
  },
  onLoad: function () {
    this.initUserInfo();
    this.start()
  },
  initUserInfo() {
    const userExpect = wx.getStorageSync('userExpect');
    const userBaseInfo = wx.getStorageSync('userBaseInfo');
    if (userExpect) {
      this.setData({
        myExpect: JSON.parse(userExpect)
      })
    };
    if (userBaseInfo) {
      this.setData({
        myBaseData: JSON.parse(userBaseInfo)
      })
    };
    db.collection('userDetailInfo').where({
      height: _.gt(parseInt(this.data.myExpect.height) - 1).and(_.lt(parseInt(this.data.myExpect.height) + 3))
    }).get().then((result) => {
      console.log(result);

    }).catch((err) => {

    });
    console.log(this.data);
  },
  start() {
    const endTime = moment().add(7, 'days').format()
    const diff = moment(endTime).diff(moment())
    this.setData({
      time: diff
    });
  }
})
