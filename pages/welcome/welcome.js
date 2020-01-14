import API from '../../global/request/api';

Page({
  login: function(e) {
    const app = getApp();
    let storageUserInfo = wx.getStorageSync('userInfo');
    if(storageUserInfo){
      app.globalData.userInfo = storageUserInfo;
      wx.switchTab({
        url: '/pages/todo/todo',
      })
      return
    }
    let userInfo = e.detail.userInfo;
    wx.login({
      success: res => {
        if(res.code) {
          wx.request({
            url: API.login,
            method: "POST",
            data: {
              code: res.code,
              userInfo
            },
            success: res => {
              let info = res.data.userInfo;
              wx.setStorageSync('userInfo', info);
              app.globalData.userInfo = info;
              wx.switchTab({
                url: '/pages/todo/todo',
              })
            }
          })
        }else{
          console.log('登录失败' + res.errMsg)
        }
      }
    })
    if (this.userInfoReadyCallback) {
      this.userInfoReadyCallback(res)
    }
  }
})