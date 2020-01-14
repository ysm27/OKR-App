import API from '../../global/request/api';
const app = getApp();

Page({
  data: {
    objective: '',
    keyresult: ['']
  },
  // 失焦获取objective
  getObjective: function (e) {
    let value = e.detail.value;
    this.setData({
      objective: value
    })
  },
  // 失焦获取keyresult
  getKeyresult: function(e) {
    let value = e.detail.value;
    let index = e.currentTarget.dataset.index;
    let kr = this.data.keyresult;
    kr[index] = value;
    this.setData({
      keyresult: kr
    })
  },
  handleAddKr: function() {
    let kr = this.data.keyresult;
    kr.push('');
    this.setData({
      keyresult: kr
    })
  },
  handleDeleteKr: function(e) {
    let index = e.currentTarget.dataset.index;
    let kr = this.data.keyresult;
    kr.splice(index,1);
    this.setData({
      keyresult: kr
    })
  },
  handleAddOkr: function() {
    let that = this;
    let storageUserInfo = wx.getStorageSync('userInfo');
    app.globalData.userInfo = storageUserInfo;
    let user_id = app.globalData.userInfo.id;
    let objective = that.data.objective;
    let keyresult = that.data.keyresult;
    let value = keyresult.some(data => {
      return data == ''
    })
    if(value || !objective) {
      wx.showToast({
        title: '不能新增空值哟～',
        icon: 'none'
      })
      return
    }
    wx.request({
      url: API.okr,
      method: 'POST',
      data: {
        user_id: user_id,
        objective: objective,
        keyresult: keyresult
      },
      success: res => {
        if(res.data.code == 200) {
          wx.showToast({
            title: '添加成功～',
            icon: 'success'
          })
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  }
})