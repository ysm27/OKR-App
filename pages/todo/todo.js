import API from '../../global/request/api';
const app = getApp();

Page({
  data: {
    todoValue: '',
    todo: []
  },
  onLoad: function (options) {
    this.onShow();
  },
  onShow: function() {
    wx.request({
      url: API.todo,
      success: res => {
        let todo = res.data.todo.filter( item => {
          return item.state == 0
        })
        this.setData({
          todo
        })
      }
    })
  },
  addTodo: function(e) {
    let that = this;
    let storageUserInfo = wx.getStorageSync('userInfo');
    app.globalData.userInfo = storageUserInfo;
    let userId = app.globalData.userInfo.id;
    let value = e.detail.value;
    if(!value) {
      wx.showToast({
        title: '请输入你需要完成的事情',
        icon: 'none'
      })
    }else{
      that.setData({ 
        todoValue: value
      })
    }
    wx.request({
      url: API.todo,
      method: 'POST',
      data: {
        value: that.data.todoValue,
        user_id: userId,
      },
      success: res => {
        if(res.data.code === 200) {
          that.onShow();
          that.setData({ 
            todoValue: ''
          })
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  showActionSheet: function(e) {
    let id = e.currentTarget.dataset.id;
    let that = this;
    wx.showActionSheet({
      itemList: ['关联','完成','删除'],
      success(res) {
        switch(res.tapIndex) {
          case 0: 
            wx.navigateTo({
              url: '/pages/todo_keyresult/todo_keyresult?id=' + id
            })
            break;
          case 1: 
            that.handleCompleted(id);
            break;
          case 2: 
            that.handleDelete(id);
            break
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  handleCompleted: function(id) {
    let that = this;
    wx.request({
      url:  API.todo + '/' + id,
      method: 'PUT',
      data: {
        id: id,
        state: '1',
        completed_time: Date.now(),
      },
      success: res => {
        if(res.data.code === 200) {
          that.onShow();
          wx.showToast({
            title: '又完成一项啦~',
            icon: 'success'
          })
        }
      }
    })
  },
  handleDelete: function(id) {
    let that = this;
    wx.request({
      url: API.todo + '/' + id,
      method: 'DELETE',
      data: {
        id: id
      },
      success: res => {
        if(res.data.code === 200) {
          that.onShow();
          wx.showToast({
            title: res.data.message,
            icon: 'success'
          })
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  }
})