// miniprogram/pages/myinfo/myinfo.js
const app = getApp()
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isNewUser:true,
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
  saveUserData() {
    wx.showLoading({
      title: '资料保存中',
    })
    let info = this.data;
    let sendData = {
      username: info.username,
      profession: info.profession,
      birthDay: info.birthDay,
      area: info.area,
      localArea: info.localArea,
      gender: info.gender,
      education: info.education,
      school: info.school,
      height: info.height,
      weight: info.weight,
      imageList: info.imageList,
      salary: info.salary,
      room: info.room,
      car: info.car,
    }
    if (this.data.isNewUser) {
      this.setData({
        isNewUser: false
      })
      db.collection('users').add({
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
        complete:res=>{
          wx.hideLoading()
        }
      })
    }else{
      wx.cloud.callFunction({
        name:'updateUser',
        data:sendData,
        success:res=>{
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          })
          console.log(res)
        },
        fail:err=>{
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
  onLoad: function (options) {
    this.getAreaList(); 
    if (app.globalData.userInfo) {
      this.setData({
        gender: app.globalData.userInfo.gender.toString()
      })
    }
    this.getUserData()
  
  },
  getUserData(){
    db.collection('users').where({
      _openid: app.globalData.userId
    }).get({
      success:res=>{
        if(res.data.length>0){
          let info = res.data[0]
          this.setData({
            isNewUser:false,
            username: info.username,
            profession: info.profession,
            birthDay: info.birthDay,
            area: info.area,
            localArea: info.localArea,
            gender: info.gender,
            education: info.education,
            school: info.school,
            height: info.height,
            weight: info.weight,
            imageList: info.imageList,
            salary: info.salary,
            room: info.room,
            car: info.car
          })
        }
      }
    })
     
  },

  deleteImg(e) {
    let index = e.currentTarget.dataset.index;
    let data = this.data.imageList;
    data.splice(index, 1)
    this.setData({
      imageList: data
    })

  },
  chooseImage: function (e) {
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
              imageList: that.data.imageList.concat(res.fileID)
            });
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      }
    });
  },
  previewImage(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.imageList // 需要预览的图片http链接列表
    });
  },
  selectSalary() {
    this.setData({
      salaryShow: true
    })
  },
  selectEducation() {
    this.setData({
      eduShow: true
    })
  },
  inputSchool(e) {
    this.setData({
      school: e.detail
    })
  },
  inputHeight(e) {
    this.setData({
      height: e.detail
    })
  },
  inputWeight(e) {
    this.setData({
      weight: e.detail
    })
  },
  cancelEdu() {
    this.setData({
      eduShow: false
    })
  },
  cancelSalary() {
    this.setData({
      salaryShow: false
    })
  },
  selectRoom() {
    this.setData({
      roomShow: true
    })
  },
  cancelRoom() {
    this.setData({
      roomShow: false
    })
  },
  confirmRoom(e) {

    this.setData({
      roomShow: false,
      room: e.detail.value
    })
  },
  selectCar() {
    this.setData({
      carShow: true
    })
  },
  cancelCar() {
    this.setData({
      carShow: false
    })
  },
  confirmCar(e) {

    this.setData({
      carShow: false,
      car: e.detail.value
    })
  },
  confirmEdu(e) {

    this.setData({
      eduShow: false,
      education: e.detail.value
    })
  },
  confirmSalary(e) {

    this.setData({
      salaryShow: false,
      salary: e.detail.value
    })
  },
  checkGender(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      gender: name
    });
  },

  checkLocalArea(e) {
    let data = ""
    e.detail.values.forEach(e => {
      data += e.name + '/'
    })
    this.setData({
      localAreaShow: false,
      localArea: data
    })
  },
  closeLocalArea() {
    this.setData({
      localAreaShow: false
    })
  },
  selectLocalArea() {
    this.setData({
      localAreaShow: true
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
  closeDate() {
    this.setData({
      timeShow: false,
    })
  },
  confirmDate(e) {
    let date = new Date(e.detail)
    this.setData({
      timeShow: false,
      currentDate: e.detail,
      birthDay: date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
    })
  },
  selectTime() {
    this.setData({
      timeShow: true
    })
  },
  inputName(e) {
    this.setData({
      username: e.detail
    })
  },
  inputProfession(e) {
    this.setData({
      profession: e.detail
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


  onShow() {

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