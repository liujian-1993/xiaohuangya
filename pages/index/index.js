//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    videoUrl: '',
    defaultUrl: 'http://v.douyin.com/aWcudQ/'
  },
  onLoad: function (e) {
    wx.showShareMenu({
      // 要求小程序返回分享目标信息
      withShareTicket: true
    });
  },
  /* 转发*/
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '抖音视频去水印下载，还有快手、陌陌、微博、知乎、等全网视频去水印下载，敬请期待',
      path: `pages/index/index`,
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
        var shareTickets = res.shareTickets;

      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow() {
    var t = this
    wx.getClipboardData({
      success: res => {
        var str = res.data.trim()
        if (str) {
          t.setData({
            defaultUrl: str
          })
        }
      }
    })
  },
  // mousuosuo_showSvPro(e) {
  //   var index = e.target.dataset.index
  //   var t = this
  //   switch (index) {
  //     case '0':
  //       t.showToast('分享->复制链接->粘贴链接->一键去水印')
  //       break
  //     case '1':
  //       t.showToast('原始视频自带水印，无法去除')
  //       break
  //     case '2':
  //       t.showToast('请先授权允许保存到相册')
  //       break
  //     default:
  //       break
  //   }
  // },
  mousuosuo_clear: function () {
    this.setData({
      defaultUrl: ''
    })
  },
  mousuosuo_input: function (t) {
    this.setData({
      defaultUrl: t.detail.value,
      videoUrl: t.detail.value
    })
  },
  getUserInfo: function (t) {
    var a = this
    if (null != app.globalData.userInfo) return 'mousousuo',
      a.oSubmit(), a.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: !0
      })
    wx.getUserInfo({
      success: function (o) {
        app.globalData.userInfo = t.detail.userInfo, a.setData({
          userInfo: t.detail.userInfo,
          hasUserInfo: !0
        })
      },
      fail: function () {
        a.showToast('未获取授权登录失败')
      }
    })
  },
  replaceReg: function (t) {
    var e = this, a = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g
    return t.replace(a, function (t) {
      e.setData({
        videoUrl: t
      })
    })
  },
  regUrl: function (t) {
    return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(t)
  },
  oSubmit: function () {
    var a = this
    this.replaceReg(a.data.defaultUrl), '' != a.data.videoUrl && a.regUrl(a.data.videoUrl) ? (wx.showLoading({
      title: '正在解析视频'
    }), wx.request({
      url: app.globalData.default,
      method: 'post',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        url: a.data.videoUrl
      },
      success: function (t) {
        wx.hideLoading(), t.data.msg ? (a.showToast('解析成功', 'success'), wx.setStorageSync('dataUrl', t.data.msg.video), app.globalData.videoSrc = t.data.message,
          wx.navigateTo({
            url: '../../pages/video/video?videoUrl=' + a.data.videoUrl
          })) : a.showToast('解析失败')
      },
      fail: function (t) {
        wx.hideLoading(), a.showToast('解析失败')
      }
    })) : this.showToast('请复制视频链接')
  },
  showToast: function (o) {
    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "none", n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1500
    wx.showToast({
      title: o,
      icon: t,
      duration: n
    })
  }
})
