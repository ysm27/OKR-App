import API from "../../global/request/api";

Page({
  data: {
    objective_id: '',
    objective: '',
    krData: [],
    kr_id: ''
  },
  onLoad: function (options) {
    let id = options.id;
    this.setData({objective_id: id})
    this.getData(id);
  },
  onShow: function() {
  },
  getData: function (id) {
    let that = this;
    wx.request({
      url: API.okr + '/single?id=' + id,
      success: res => {
        if(res.data.code === 200) {
          that.setData({
            objective: res.data.objective,
            krData: res.data.krData,
          })
        }
      }
    })
  },
  showActionSheet: function(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    this.setData({ kr_id: id })
    wx.showActionSheet({
      itemList: ['标记', '删除'],
      success(res) {
        switch (res.tapIndex) {
          case 0:
            that.handleCompleted(id)
            break
          case 1: 
            that.handleDelete(id)
            break
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  handleCompleted: function(id) {
    let objective_id = this.data.objective_id;
    wx.request({
      url: API.keyresult + '?id=' + id,
      method: 'PUT',
      data: {
        state: '1'
      },
      success: res => {
        if(res.data.code == 200) {
          this.getData(objective_id)
        }
      }
    })
  },
  handleDelete: function(id) {
    let objective_id = this.data.objective_id;
    wx.request({
      url: API.keyresult + '/' + id,
      method: 'DELETE',
      success: res => {
        if(res.data.code == 200) {
          this.getData(objective_id)
        }
      }
    })
  }
})