import API from '../../global/request/api';

Page({
  data: {
    okrList: [],
    todo_id: '',
  },
  onLoad: function (options) {
    this.setData({ todo_id: options.id })
  },
  onShow: function() {
    wx.request({
      url: API.okr,
      success: res => {
        // 获取筛选的 objective.id
        let objective = res.data.objective.filter(data => {
          return data.state == 0
        });

        objective.forEach(data => {
          wx.request({
            url: API.okr + '/keyresult',
            method: 'POST',
            data: {
              id: data.id
            },
            success: res =>{
              let okrItem = { objective: res.data.objective, keyresult: res.data.keyresult};
              let okrList = this.data.okrList;
              okrList.push(okrItem);
              this.setData({
                okrList
              })
            }
          })
        })
      }
    })
  },
  handleActive: function(e) {
    let kr_id = e.currentTarget.dataset.id;
    let todo_id = this.data.todo_id;
    wx.request({
      url: API.todo_keyresult,
      method: 'POST',
      data: {
        kr_id,
        todo_id
      },
      success: res => {
        wx.navigateBack({
          delta: 1
        })
      }
    })
  }
})