import API from '../../global/request/api';

Page({
  data: {
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
          return item.state == 1
        })
        this.setData({
          todo
        })
      }
    })
  },
  showActionSheet: function(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    wx.showActionSheet({
      itemList: ['未完成', '删除'],
      success: res => {
        switch (res.tapIndex) {
          case 0:
            that.handleState(id)
            break;
          case 1:
            that.handleDelete(id)
            break;
        }  
      }
    })
  },
  handleState: function(id) {
    let that = this;
    wx.request({
      url:  API.todo + '?id=' + id,
      method: 'PUT',
      data: {
        id: id,
        state: '0',
      },
      success: res => {
        if(res.data.code === 200) {
          that.onShow();
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