import API from '../../global/request/api'

Page({
  data: {
    objective: '',
    keyresult: [],
    objective_id: '',
    newKr: [],
    deleteId: []
  },
  onLoad: function (options) {
    this.getData(options.id);
    this.setData({
      objective_id: options.id
    })
  },
  getData: function (id) {
    let that = this;
    wx.request({
      url: API.okr + '/single?id=' + id,
      success: res => {
        if(res.data.code === 200) {
          that.setData({
            objective: res.data.objective,
            keyresult: res.data.keyresult
          })
        }
      }
    })
  },
   // 失焦获取objective
   getObjective: function (e) {
    let obj = this.data.objective;
    let value = e.detail.value;
    obj.value = value
    this.setData({
      objective: obj
    })
  },
  // 失焦获取 keyresult的 id 和 value,判断 id = 0时，将value放到 newKr里
  getKeyresult: function(e) {
    let krValue = e.detail.value;
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    let kr = this.data.keyresult;
    kr[index].value = krValue;
    this.setData({
      keyresult: kr
    })
    if(id == 0) {
      let value = { value: krValue };
      let newKr = this.data.newKr;
      newKr[index] = value;
      this.setData({
        newKr
      })
    }
  },
  // 点击新增 kr,给其添加 id = 0
  handleAddKr: function() {
    let keyresult = this.data.keyresult;
    keyresult.push({id: 0, value: ''});
    let newKr = this.data.newKr;
    newKr.push({ value: '' });
    this.setData({
      keyresult,
      newKr
    })
  },
  // 删除 kr,并获取其 id
  handleDeleteKr: function(e) {
    let index = e.currentTarget.dataset.index;
    let kr = this.data.keyresult;
    let id = kr[index].id;
    let deleteId = this.data.deleteId;
    deleteId.push(id);
    kr.splice(index,1);
    this.setData({
      deleteId,
      keyresult: kr
    })
  },
  handleSave: function() {
    this.handleSaveObj();
    this.handleSaveKr();
    wx.showToast({
      title: '编辑成功～',
      icon: 'success'
    })
    wx.navigateBack({
      delta: 1
    })
  },
  handleSaveObj: function() {
    let objective = this.data.objective;
    let id = this.data.objective_id;
    if(!objective.value) {
      wx.showToast({
        title: '不能保存空值哟～',
        icon: 'none'
      })
      return
    }
    wx.request({
      url: API.okr + '/' + id,
      method: 'PUT',
      data: {
        objective
      }
    })
  },
  // 保存所有的 kr
  handleSaveKr: function() {
    let objective_id = this.data.objective_id;
    let keyresult = this.data.keyresult;
    let value = keyresult.some(data => {
      return data.value == ''
    })
    if(value) {
      wx.showToast({
        title: '不能新增空值哟～',
        icon: 'none'
      })
      return
    }
    keyresult.forEach(data => {
      let id = data.id;
      // 保存新增的 kr
      if(id == 0 ) {
        wx.request({
          url: API.keyresult,
          method: 'POST',
          data: {
            objective_id,
            value: data.value
          },
        })
      }else{
        //  保存编辑的 kr 
        wx.request({
          url: API.keyresult + '/' + id,
          method: 'PUT',
          data: {
            value: data.value
          }
        })
      }
    })
    // 删除 kr
    let deleteId = this.data.deleteId;
    if(deleteId) {
      deleteId.forEach( data => {
        let id = data;
        wx.request({
          url: API.keyresult + '/' + id,
          method: 'DELETE',
          data: {
            id
          }
        })
      })
    }
  }
})