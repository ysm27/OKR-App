import API from'../../global/request/api';

Page({
  data: {
    objective: []
  },
  onLoad: function() {
    this.onShow();
  },
  onShow: function() {
    let that = this;
    wx.request({
      url: API.okr,
      success: res => {
        if(res.data.code === 200) {
          that.setData({
            objective: res.data.objective
          })
        }
      }
    })
  },
  showActionSheet: function(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    wx.showActionSheet({
      itemList: ['查看', '编辑', '已完成', '删除'],
      success(res) {
        switch(res.tapIndex) {
          case 0:
            wx.navigateTo({
              url: '/pages/okr_detail/okr_detail?id=' + id,
            })
            break;
          case 1:
            wx.navigateTo({
              url: '/pages/okr_edit/okr_edit?id=' + id,
            })
            break;
          case 2:
            that.handleState(id)
            break;
          case 3:
            that.handleDelete(id)
            break;
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  // 标记为已完成
  handleState: function(id) {
    let that = this;
    wx.request({
      url: API.okr + '?id=' + id,
      method: 'PUT',
      data: {
        state: '1'
      },
      success: res => {
        if(res.data.code === 200) {
          let state = 'objective.state';
          that.setData({
            [state]: res.data.ObjState 
          })
          that.onShow()
        }
      }
    })
  },
  // 删除 okr
  handleDelete: function(id) {
    wx.request({
      url: API.okr + '/' + id,
      method: 'DELETE',
      data: {
        id
      },
      success: res => {
        if(res.data.code === 200) {
          wx.showToast({
            title: '删除成功～',
            icon: 'success'
          })
          this.onShow()
        }
      }
    })
  }
})