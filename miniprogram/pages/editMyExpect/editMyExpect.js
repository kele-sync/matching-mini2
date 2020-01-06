// pages/myhope/myhope.js
const app = getApp()
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: { 
    isNewHope:true,
    minAge:'',
    maxAge:'',
    minHeight:'',
    maxHeight:'',
    eduShow: false,
    education: '',
    areaList:[],
    salaryShow: false,
    salary: '',
    area:'',
    job:'',
    salaryColumns: [ "2000以上", "5000以上", "10000以上", "20000以上", "50000元以上", "无要求"],
    eduColumns: ["高中以上", '专科以上', "本科以上", "研究生以上", "博士以上",'无要求'],
    describe:''
  },
  getHopeData() {
    db.collection('hopes').where({
      _openid: app.globalData.userId
    }).get({
      success: res => {
        console.log(res)
        if (res.data.length > 0) {
          let info=res.data[0]
          this.setData({
            isNewHope: false,
            minAge: info.minAge,
            maxAge: info.maxAge,
            minHeight: info.minHeight,
            maxHeight: info.maxHeight,
            education: info.education,
            area: info.area,
            job:info.job,
            salary: info.salary,
            describe: info.describe 
          })
        }
      }
    })

  },
  onLoad: function (options) {
    this.getAreaList();
    this.getHopeData()
  },
  saveHopeData(){
    wx.showLoading({
      title: '资料提交中',
    })
    let info=this.data;
    let sendData={
      minAge:info.minAge,
      maxAge:info.maxAge,
      minHeight:info.minHeight,
      maxHeight:info.maxHeight,
      education:info.education,
      job:info.job,
      area:info.area,
      salary:info.salary,
      describe:info.describe 
    }
    if (this.data.isNewHope) {
      this.setData({
        isNewHope: false
      })
      db.collection('hopes').add({
        data: sendData,
        success: res => {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          })
          console.log(res)
        },
        fail: err => {
          wx.showToast({
            title: '保存失败',
            icon: 'fail',
            duration: 1000
          })
        },
        complete: res => {
          wx.hideLoading()
        }
      })
    }else{
      wx.cloud.callFunction({
        name: 'updateHope',
        data: sendData,
        success: res => {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          })
          console.log(res)
        },
        fail: err => {
          wx.showToast({
            title: '保存失败',
            icon: 'fail',
            duration: 1000
          })
        },
        complete: res => {
          wx.hideLoading()
        }
      })

    }
  },
  inputDescribe(e) {
    this.setData({
      describe: e.detail
    })
  },
  confirmSalary(e) {

    this.setData({
      salaryShow: false,
      salary: e.detail.value
    })
  },
  cancelSalary() {
    this.setData({
      salaryShow: false
    })
  },
  selectSalary() {
    this.setData({
      salaryShow: true
    })
  },
  checkArea(e) {
    let data = ""
    e.detail.values.forEach(e => {
      data += e.name + '/'
    })

    this.setData({
      areaShow: false,
      area: data
    })
  },
  closeArea() {
    this.setData({
      areaShow: false
    })
  },
  selectArea() {
    this.setData({
      areaShow: true
    })
  },
  getAreaList() {
    let self = this;
    wx.request({
      url: 'https://616c-alice-dc9701-1258866920.tcb.qcloud.la/projectState/datacenter/areaList.json?sign=3e2892d76cc3168f7bce1690c188a374&t=1565440496',
      success: response => {
        self.setData({
          areaList: response.data.data
        });
      }
    });
  },
  inputMinHeight(e){ 
      this.setData({
        minHeight: e.detail
      }) 
  },
  inputMaxHeight(e) {
    this.setData({
      maxHeight: e.detail
    })
  },
  inputMinAge(e) {
    this.setData({
      minAge: e.detail
    })
  },
  inputJob(e) {
    this.setData({
      job: e.detail
    })
  },

  inputMaxAge(e) {
    this.setData({
      maxAge: e.detail
    })
  },
  selectEducation() {
    this.setData({
      eduShow: true
    })
  },
  cancelEdu() {
    this.setData({
      eduShow: false
    })
  },
  confirmEdu(e) { 
    this.setData({
      eduShow: false,
      education: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})