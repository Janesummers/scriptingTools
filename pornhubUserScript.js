// ==UserScript==
// @name         Jsummer-pornhub
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  try to take over the world!
// @author       You
// @match        https://cn.pornhub.com/*
// @match        https://www.pornhub.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pornhub.com
// @resource     customCSS https://chiens.cn/recordApi/css/message.css
// @resource     customPornhubCSS https://chiens.cn/recordApi/pornhub.css
// @require      https://chiens.cn/recordApi/js/message.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @connect      *
// @downloadURL  https://chiens.cn/recordApi/pornhubUserScript.js
// @updateURL    https://chiens.cn/recordApi/pornhubUserScript.js
// ==/UserScript==

// @connect * 表示允许任何域名的跨域请求

/* globals GM_addStyle, GM_getResourceText, GM_xmlhttpRequest, Qmsg */

const css = GM_getResourceText("customCSS");
const customPornhubCSS = GM_getResourceText("customPornhubCSS");
GM_addStyle(css);
GM_addStyle(customPornhubCSS);

// let isHidden = false

document.addEventListener("visibilitychange", function() {
  var string = document.visibilityState
  console.log(string)
  if (string === 'hidden') {  // 当页面由前端运行在后端时，出发此代码
    // isHidden = true
  }
  if (string === 'visible') {   // 当页面由隐藏至显示时
    // isHidden = false
    if (location.pathname.indexOf('/pornstars') === -1) {
      getData()
    }
  }
});

let codeList = []
let globalHint = null
let recommendedVideosHeight = 0
let relatedVideosCenterHeight = 0
let competitionVideosCenterHeight = 0
let isRecord = false
let isChecked = false
let isHandlePlayList = false
// let insertTime = new Date().getTime()
let timer = null
let resizeObserver;

var style = document.createElement('style');
document.head.appendChild(style);
let sheet = style.sheet;
const cssList = [
  { label: '.title a:visited', value: 'color: #d34141 !important;' },
  { label: '.title a[checked]', value: 'color: #d36141 !important;' },
]
cssList.map(item => {
  if (sheet.insertRule) {
    sheet.insertRule(`${item.label} { ${item.value} }`);
  } else {
    sheet.addRule(`${item.label} { ${item.value} }`);
  }
})

console.log('等待脚本执行');

window.onload = () => {
  if (location.pathname.indexOf('/pornstars') === -1) {
    if (document.visibilityState === 'visible') {
      getData()
    }
  }
}

function watchElementChange(el, callback) {
  if (!el) return
  resizeObserver = new ResizeObserver((entries) =>
    // console.log('Body height changed:', entries[0].target.clientHeight)
    callback && callback(entries)
  );
  resizeObserver.observe(el);
}

function record(keyCode) {
  if (isRecord) return
  isRecord = true
  let code = ''
  if (!keyCode) {
    code = new URLSearchParams(location.search).get("viewkey")
    if (!code) {
      code = new URL(location.search).searchParams.get("viewkey")
    }
  } else {
    code = keyCode
  }
  if (code) {
    console.log('发请求')
    GM_xmlhttpRequest({
      method: "post",
      url: "https://chiens.cn/recordApi/pornhubLog",
      data: `code=${code}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },

      onload: function(req){
        console.log('dd', req)
        const result = JSON.parse(req.response)
        if (req.readyState === 4 && req.status === 200 && result.code === 'ok') {
          console.log("记录成功");
          Qmsg.success("成功记录", {autoClose: true, onClose: () => {  }});
          if (document.querySelector('.video-wrapper .title .inlineFree')) {
            document.querySelector('.video-wrapper .title .inlineFree').setAttribute('checked', '1')
          } else if (document.querySelector('.vcVideoTitle')) {
            document.querySelector('.vcVideoTitle').setAttribute('checked', '1')
          }
          isRecord = false
          isChecked = true
        }
      },
      onerror: function(){
        Qmsg.error("记录失败", {autoClose: true });
        isRecord = false
      }
    });
  }
  // const query = location.search.match(/q=(.*)/)[1];console.log(query);
}

function getData() {
  if (location.pathname.indexOf('/contest_hub') !== -1 && location.pathname.indexOf('/contest_hub/viewers_choice') === -1) {
    return
  }
  if (isChecked) return
  if (codeList && codeList.length) {
    if (location.pathname.indexOf('view_video') !== -1) {
      globalHint = Qmsg.success("获取本地数据成功，等待处理", {autoClose: false, onClose: () => {  }});
      viewPageListHandle()
    }
  } else {
    globalHint = Qmsg.info("正在获取数据", {autoClose: false});
    GM_xmlhttpRequest({
      method: "post",
      url: "https://chiens.cn/recordApi/getPornhubLog",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },

      onload: function(req){

        const result = JSON.parse(req.response)
        if (req.readyState === 4 && req.status === 200 && result.code === 'ok') {
          const list = result.data.message === '' ? result.data.message : JSON.parse(result.data.message)
          codeList = list || []
          console.log('ddsss', list)
          globalHint.close()
          globalHint = Qmsg.success("获取数据成功，等待处理", {autoClose: false, onClose: () => {  }});
          // 视频详情页面处理
          if (location.pathname.indexOf('view_video') !== -1) {
            console.log('开始处理');
            let code = new URLSearchParams(location.search).get("viewkey")
            if (!code) {
              code = new URL(location.search).searchParams.get("viewkey")
            }
            console.log('dsds');
            viewPageListHandle()
            console.log('code', code, codeList);
            if (codeList.includes(code)) {
              if (document.querySelector('.video-wrapper .title .inlineFree')) {
                document.querySelector('.video-wrapper .title .inlineFree').setAttribute('oldChecked', '1')
              }
              isChecked = true
            } else {
              console.log('jiu');
              record()
            }
          }
          if (location.pathname.indexOf('/model/') !== -1) {
            console.log('开始处理');
            modelListHandle()
          }
          if (location.pathname.indexOf('/channels/') !== -1) {
            console.log('开始处理');
            channelListHandle()
          }
          if (location.pathname.indexOf('/video/search') !== -1) {
            searchVideoListHandle()
          }
          if (location.pathname.indexOf('/video/search') === -1 && location.pathname.indexOf('/videos') === -1 && (location.pathname.indexOf('/video') !== -1 || location.pathname.indexOf('/categories') !== -1)) {
            typeVideoListHandle()
          }
          if (location.pathname === '/') {
            homePageListHandle()
          }
          if (location.pathname.indexOf('/contest_hub/viewers_choice') !== -1) {
            competitionPageListHandle()
          }
          if (location.pathname.indexOf('/playlist') !== -1) {
            const box = document.querySelector('#videoPlaylist')
            box.addEventListener('DOMNodeInserted', function(e){
              if (e.target.tagName === 'DIV') {
                clearTimeout(timer)
                timer = null
                timer = setTimeout(playListHandle, 500)
              }
            }, false);
            playListHandle()
          }
          if (location.pathname.indexOf('/pornstar') !== -1) {
            pornStarListHandle()
          }
          // listHandle()
        }
      },
      onerror: function(){
        globalHint.close()
        Qmsg.error("获取数据请求失败", {autoClose: true });
      }
    });
  }
}

function listHandle(box, callback) {
  if (box) {
    let list = box.querySelectorAll('.pcVideoListItem')
    list.forEach(item => { 
      let code = new URLSearchParams(item.querySelector('.title a').href).get("viewkey")
      if (!code) {
        code = new URL(item.querySelector('.title a').href).searchParams.get("viewkey")
      }
      if (item.querySelector('.watchedVideoText') || item.querySelector('.watchedVideo') || codeList.includes(code)) {
        item.querySelector('.title a').setAttribute('checked', '1')
        if (item.querySelector('.watchedVideoText')) {
          item.querySelector('.watchedVideoText').innerHTML = ''
          item.querySelector('.watchedVideoText').innerText = `已观看 - for record`
        } else {
          const node = document.createElement('div')
          node.className = 'watchedVideoText'
          node.innerText = '已观看 - for record'
          item.querySelector('.phimage a').appendChild(node)
        }

      }
      if (item.querySelector('.bg-spice-badge')) {
        item.remove()
      }
    })
    callback && callback()
  }
}

function viewPageListHandle() {
  if (document.querySelector('#recommendedVideos')) {
    const box = document.querySelector('#recommendedVideos')
    recommendedVideosHeight = box.offsetHeight
    watchElementChange(box, (entries) => {
      var newHeight = entries[0].target.scrollHeight;
      if (newHeight !== relatedVideosCenterHeight) {
        relatedVideosCenterHeight = newHeight;
        const list = entries[0].target.querySelectorAll('.pcVideoListItem')
        list.forEach(item => {
          let code = new URLSearchParams(item.querySelector('.title a').href).get("viewkey")
          if (!code) {
            code = new URL(item.querySelector('.title a').href).searchParams.get("viewkey")
          }
          if (item.querySelector('.watchedVideoText') || item.querySelector('.watchedVideo')) {
            item.querySelector('.title a').setAttribute('checked', '1')
          }
          if (codeList.includes(code)) {
            item.querySelector('.title a').setAttribute('checked', '1')
          }
        })
      }
    })
    listHandle(box)
  }
  if (document.querySelector('#relatedVideosCenter')) {
    const box = document.querySelector('#relatedVideosCenter')
    relatedVideosCenterHeight = box.scrollHeight
    watchElementChange(box, (entries) => {
      var newHeight = entries[0].target.scrollHeight;
      if (newHeight !== relatedVideosCenterHeight) {
        relatedVideosCenterHeight = newHeight;
        const list = entries[0].target.querySelectorAll('.pcVideoListItem')
        list.forEach(item => {
          let code = new URLSearchParams(item.querySelector('.thumbnail-info-wrapper .title a').href).get("viewkey")
          if (!code) {
            code = new URL(item.querySelector('.thumbnail-info-wrapper .title a').href).searchParams.get("viewkey")
          }
          if (item.querySelector('.watchedVideoText') || item.querySelector('.watchedVideo')) {
            item.querySelector('.thumbnail-info-wrapper .title a').setAttribute('checked', '1')
          }
          if (codeList.includes(code)) {
            item.querySelector('.thumbnail-info-wrapper .title a').setAttribute('checked', '1')
          }
        })
      }
    })
    listHandle(box)
  }
  setTimeout(() => {
    if (document.querySelector('#carouselSection')) {
      const box = document.querySelector('#carouselSection')
      let list = box.querySelectorAll('li')
      list.forEach(item => { 
        let code = new URLSearchParams(item.querySelector('a').href).get("viewkey")
        if (!code) {
          code = new URL(item.querySelector('a').href).searchParams.get("viewkey")
        }
        console.log('活动', code);
        if (item.querySelector('.watchedVideoText') || item.querySelector('.watchedVideo') || codeList.includes(code)) {
          item.querySelector('a').setAttribute('checked', '1')
          if (item.querySelector('.watchedVideoText')) {
            item.querySelector('.watchedVideoText').innerHTML = ''
            item.querySelector('.watchedVideoText').innerText = `已观看 - for record`
          } else {
            const node = document.createElement('div')
            node.className = 'watchedVideoText'
            node.innerText = '已观看 - for record'
            item.querySelector('.phimage a').appendChild(node)
          }

        }
      })
    }
  }, 500);
  
  console.log('viewPageListHandle - 处理完成');
  globalHint.close()
  globalHint = Qmsg.success("viewPageListHandle - 处理完成", {autoClose: true, onClose: () => {  }});
}

function modelListHandle() {
  if (document.querySelector('#modelMostRecentVideosSection')) {
    const box = document.querySelector('#modelMostRecentVideosSection')
    listHandle(box)
  }
  if (document.querySelector('#mostRecentVideosSection')) {
    const box = document.querySelector('#mostRecentVideosSection')
    listHandle(box)
  }
  console.log('modelListHandle - 处理完成');
  globalHint.close()
  globalHint = Qmsg.success("modelListHandle - 处理完成", {autoClose: true, onClose: () => {  }});
}

function channelListHandle() {
  if (document.querySelector('#showAllChanelVideos')) {
    const box = document.querySelector('#showAllChanelVideos')
    listHandle(box)
  }
  if (document.querySelector('#moreData')) {
    const box = document.querySelector('#moreData')
    listHandle(box)
  }
  console.log('channelListHandle - 处理完成');
  globalHint.close()
  globalHint = Qmsg.success("channelListHandle - 处理完成", {autoClose: true, onClose: () => {  }});
}

function searchVideoListHandle() {
  if (document.querySelector('#videoSearchResult')) {
    const box = document.querySelector('#videoSearchResult')
    listHandle(box)
  }
  // if (document.querySelector('#moreData')) {
  //   box = document.querySelector('#moreData')
  // }
  console.log('searchVideoListHandle - 处理完成');
  globalHint.close()
  globalHint = Qmsg.success("searchVideoListHandle - 处理完成", {autoClose: true, onClose: () => {  }});
}

function homePageListHandle() {
  if (document.querySelector('#singleFeedSection')) {
    const box = document.querySelector('#singleFeedSection')
    listHandle(box)
  }
  // if (document.querySelector('#moreData')) {
  //   box = document.querySelector('#moreData')
  // }
  console.log('homePageListHandle - 处理完成');
  globalHint.close()
  globalHint = Qmsg.success("homePageListHandle - 处理完成", {autoClose: true, onClose: () => {  }});
}

function competitionPageListHandle() {
  // 处理参赛列表
  if (document.querySelector('.videos-morepad')) {
    const box = document.querySelector('.videos-morepad')
    competitionVideosCenterHeight = box.offsetHeight
    watchElementChange(box, (entries) => {
      var newHeight = entries[0].target.scrollHeight;
      if (newHeight !== competitionVideosCenterHeight) {
        competitionVideosCenterHeight = newHeight;
        const list = document.querySelectorAll('.videos-morepad .videoEntry')
        for (let index = 0; index < list.length; index++) {
          const element = list[index];
          if (element.querySelector('.thumbnail-info-wrapper')) {
            element.querySelector('.thumbnail-info-wrapper').style.display = 'block'
          }
          if (element.querySelector('a.fade.linkVideoThumb')) {
            let playerUrl = element.querySelector('a.fade.linkVideoThumb').getAttribute('data-related-url')
            if (playerUrl) {
              playerUrl = `https://www.pornhub.com${playerUrl}`
              let code = new URLSearchParams(playerUrl).get("vkey")
              if (!code) {
                code = new URL(playerUrl).searchParams.get("vkey")
              }
              if (code) {
                if (codeList.includes(code)) {
                  if (element.querySelector('.thumbnail-info-wrapper .title')) {
                    element.querySelector('.thumbnail-info-wrapper .title').setAttribute('checked', '1')
                  }
                }
              }
            }
          }
        }
        console.log('competitionPageListHandle - 处理完成');
        globalHint.close()
        globalHint = Qmsg.success("competitionPageListHandle - 处理完成", {autoClose: true, onClose: () => {  }});
        isChecked = true
      }
    })
    const list = document.querySelectorAll('.videos-morepad .videoEntry')
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      if (element.querySelector('.thumbnail-info-wrapper')) {
        element.querySelector('.thumbnail-info-wrapper').style.display = 'block'
      }
      if (element.querySelector('a.fade.linkVideoThumb')) {
        let playerUrl = element.querySelector('a.fade.linkVideoThumb').getAttribute('data-related-url')
        if (playerUrl) {
          playerUrl = `https://www.pornhub.com${playerUrl}`
          let code = new URLSearchParams(playerUrl).get("vkey")
          if (!code) {
            code = new URL(playerUrl).searchParams.get("vkey")
          }
          if (code) {
            if (codeList.includes(code)) {
              if (element.querySelector('.thumbnail-info-wrapper .title')) {
                element.querySelector('.thumbnail-info-wrapper .title').setAttribute('checked', '1')
              }
            }
          }
        }
      }
    }
    console.log('competitionPageListHandle - 处理完成');
    globalHint.close()
    globalHint = Qmsg.success("competitionPageListHandle - 处理完成", {autoClose: true, onClose: () => {  }});
  }
  // 处理播放视频
  if (document.querySelector('.playerFlvContainer')) {
    let playerId = document.querySelector('.playerFlvContainer').id
    if (playerId) {
      playerId = playerId.replace('playerDiv', 'flashvars')
      const info = eval(playerId)
      if (info.link_url) {
        let code = new URLSearchParams(info.link_url).get("viewkey")
        if (!code) {
          code = new URL(info.link_url).searchParams.get("viewkey")
        }
        if (code) {
          if (codeList.includes(code)) {
            if (document.querySelector('.vcVideoTitle')) {
              document.querySelector('.vcVideoTitle').setAttribute('oldChecked', '1')
            }
            console.log('competitionPageListHandle - 处理完成');
            globalHint.close()
            globalHint = Qmsg.success("competitionPageListHandle - 处理完成", {autoClose: true, onClose: () => {  }});
            isChecked = true
          } else {
            record(code)
          }
        }
        // const box = document.querySelector('#singleFeedSection')
        // listHandle(box)
      }
    }
  }
}

function typeVideoListHandle() {
  if (document.querySelector('#videoCategory')) {
    const box = document.querySelector('#videoCategory')
    listHandle(box)
  } else if (document.querySelector('#incategoryVideos')) {
    const box = document.querySelector('#incategoryVideos')
    listHandle(box)
  }
  // if (document.querySelector('#moreData')) {
  //   box = document.querySelector('#moreData')
  // }
  console.log('typeVideoListHandle - 处理完成');
  globalHint.close()
  globalHint = Qmsg.success("typeVideoListHandle - 处理完成", {autoClose: true, onClose: () => {  }});
}

function playListHandle() {
  if (isHandlePlayList) return
  isHandlePlayList = true
  if (document.querySelector('#videoPlaylist')) {
    const box = document.querySelector('#videoPlaylist')
    listHandle(box, () => {
      isHandlePlayList = false
    })
  }
  // if (document.querySelector('#moreData')) {
  //   box = document.querySelector('#moreData')
  // }
  console.log('playListHandle - 处理完成');
  globalHint.close()
  globalHint = Qmsg.success("playListHandle - 处理完成", {autoClose: true, onClose: () => {  }});
}

function pornStarListHandle() {
  if (document.querySelector('#claimedUploadedVideoSection')) {
    const box = document.querySelector('#claimedUploadedVideoSection')
    listHandle(box)
  }
  if (document.querySelector('#claimedRecentVideoSection')) {
    const box = document.querySelector('#claimedRecentVideoSection')
    listHandle(box)
  }
  if (document.querySelector('#mostRecentVideosSection')) {
    const box = document.querySelector('#mostRecentVideosSection')
    listHandle(box)
  }
  if (document.querySelector('#uploadedVideosSection')) {
    const box = document.querySelector('#uploadedVideosSection')
    listHandle(box)
  }
  if (document.querySelector('#moreData')) {
    const box = document.querySelector('#moreData')
    listHandle(box)
  }
  
  console.log('pornStarListHandle - 处理完成');
  globalHint.close()
  globalHint = Qmsg.success("pornStarListHandle - 处理完成", {autoClose: true, onClose: () => {  }});
}