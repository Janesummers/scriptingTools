// ==UserScript==
// @name         JSummer-YouTube
// @namespace    http://tampermonkey.net/
// @version      1.45
// @description  try to take over the world!
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @resource     customCSS https://chiens.cn/recordApi/css/message.css
// @resource     customYoutubeCSS https://chiens.cn/recordApi/youtube.css
// @require      https://chiens.cn/recordApi/js/message.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @connect      *
// @downloadURL  https://chiens.cn/recordApi/youtubeUserScript.js
// @updateURL    https://chiens.cn/recordApi/youtubeUserScript.js
// ==/UserScript==

/* globals GM_addStyle, GM_getResourceText, GM_xmlhttpRequest, Qmsg */
// @connect * 表示允许任何域名的跨域请求

// const newElement = document.createElement('div');
// var innerHTMLText = 'Traduci';
// 'use strict';
// newElement.innerHTML = DOMPurify.sanitize(innerHTMLText, {RETURN_TRUSTED_TYPE: true});
// document.body.appendChild(newElement);
const css = GM_getResourceText("customCSS");
const customYoutubeCSS = GM_getResourceText("customYoutubeCSS");
GM_addStyle(css);
GM_addStyle(customYoutubeCSS);

// let isHidden = false

const skipUrls = ['/live_chat_replay']

document.addEventListener("visibilitychange", function() {
  var string = document.visibilityState
  console.log(string)
  if (string === 'hidden') {
    // isHidden = true
  }
  if (string === 'visible') {
    // isHidden = false
    if (!skipUrls.includes(location.pathname)) {
      getData()
    }
  }
});

let codeList = []
let globalHint = null
// 首页视频列表高度
let homePageListHeight = 0
// 作者页面视频标签列表高度
let authorVideoTagsPageListHeight = 0
// 查看视频详情页面右侧列表高度
let viewPageListHeight = 0
let isRecord = false
let isChecked = false
// let isHandlePlayList = false
// let insertTime = new Date().getTime()
// let timer = null
let search = ''
// 首页列表
let homeContents = null
// 作者页面视频标签列表
let authorVideoTagsContents = null
// 详情页右侧列表
let itemsContents = null

let resizeObserver;

var style = document.createElement('style');
document.head.appendChild(style);
let sheet = style.sheet;
const cssList = [
  { label: '.title a:visited', value: 'color: #d34141 !important;' },
  { label: '.metadata a.ytd-compact-video-renderer h3.ytd-compact-video-renderer[checked]', value: 'color: #d36141 !important;' },
  { label: 'div#dismissible.ytd-rich-grid-media #video-title[checked]', value: 'color: #d36141 !important;' },
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
  if (!skipUrls.includes(location.pathname)) {
    if (document.visibilityState === 'visible') {
      getData()
      console.log('dsdsds0-------');
    }
  }
}

function watchElementChange(el, callback) {
  if (!el) return
  resizeObserver = new ResizeObserver((entries) =>
    // console.log('Body height changed:', entries[0].target.clientHeight)
    callback && callback(entries)
  );
  return resizeObserver;
}

function record() {
  console.log('准备记录');
  if (isRecord) return
  isRecord = true
  let code = new URLSearchParams(location.search).get("v")
  if (!code) {
    code = new URL(location.search).searchParams.get("v")
  }
  console.log('准备记录2', code);
  if (code) {
    console.log('发请求')
    GM_xmlhttpRequest({
      method: "post",
      url: "https://chiens.cn/recordApi/youtubeLog",
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
          if (document.querySelector(".watch-active-metadata #above-the-fold #title h1.ytd-watch-metadata")) {
            document.querySelector(".watch-active-metadata #above-the-fold #title h1.ytd-watch-metadata").setAttribute('checked', '1')
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

/**
 * @description: 获取已记录列表
 * @return {*}
 */
function getData() {
  if (isChecked) return
  if (codeList && codeList.length) {
    if (!skipUrls.includes(location.pathname)) {
      globalHint = Qmsg.success("获取本地数据成功，等待处理", {autoClose: false, onClose: () => {  }});
      handleData()
    }
  } else {
    globalHint = Qmsg.info("正在获取数据", {autoClose: false});
    GM_xmlhttpRequest({
      method: "post",
      url: "https://chiens.cn/recordApi/getYoutubeLog",
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
          handleData()
        }
      },
      onerror: function(response){
        globalHint.close()
        console.log('失败', response);
        Qmsg.error("获取数据请求失败", {autoClose: true });
      }
    });
  }
}

/**
 * @description: 处理页面数据
 * @return {*}
 */
let detailTimer = null
function handleData() {
  // 视频详情页面处理
  if (location.pathname.indexOf('/watch') !== -1) {
    console.log('开始处理视频详情页面');
    let code = new URLSearchParams(location.search).get("v")
    search = location.search
    // if (!code) {
    //   code = new URL(location.search).searchParams.get("viewkey")
    // }

    viewPageListHandle()
    console.log('code', code, codeList, codeList.includes(code));
    if (codeList.includes(code)) {
      console.log('已在okk', document.querySelector(".watch-active-metadata #above-the-fold #title h1.ytd-watch-metadata"));
      if (document.querySelector(".watch-active-metadata #above-the-fold #title h1.ytd-watch-metadata")) {
        document.querySelector(".watch-active-metadata #above-the-fold #title h1.ytd-watch-metadata").setAttribute('oldChecked', '1')
      } else {
        detailTimer = setInterval(() => {
          console.log('再次尝试');
          if (document.querySelector(".watch-active-metadata #above-the-fold #title h1.ytd-watch-metadata")) {
            document.querySelector(".watch-active-metadata #above-the-fold #title h1.ytd-watch-metadata").setAttribute('oldChecked', '1')
            console.log('重试完成');
            clearInterval(detailTimer)
            detailTimer = null
          }
        }, 1000);
      }
      isChecked = true
    } else {
      console.log('jiu');
      record()
    }
  }
  // 首页处理
  if (location.pathname === '/') {
    console.log('开始处理首页');

    setTimeout(() => {
      const list = document.querySelectorAll("div#dismissible.ytd-rich-grid-media")
      console.log('list', list);
      list.forEach(item => {
        let code = new URLSearchParams(item.querySelector('a#thumbnail').search).get("v")
        if (codeList.includes(code)) {
          item.querySelector('#video-title').setAttribute('checked', '1')
        }
      })
      homePageListHandle()
    }, 500);

    // document.querySelectorAll("div#dismissible.ytd-rich-grid-media")

    

  }

  // 作者页面视频标签处理
  if (/(?<=\/videos)$/.test(location.pathname)) {
    console.log('开始处理作者页面视频标签处理');
    const box = document.querySelector('#contents')
    if (box) {
      let children = box.querySelectorAll('a#video-title-link')
      if (children && children.length) {
        children.forEach(item => {
          let code = new URLSearchParams(item.search).get("v")
          if (codeList.includes(code)) {
            item.querySelector('#video-title').setAttribute('checked', '1')
          }
        })
        isChecked = true

        if (authorVideoTagsContents) {
          console.log('authorVideoTagsContents - 已存在，无需再次监听');
        } else {
          authorVideoTagsContents = watchElementChange(box, (entries) => {
            var newHeight = entries[0].target.scrollHeight;
            console.log('newHeight !== authorVideoTagsPageListHeight', newHeight, authorVideoTagsPageListHeight);
            if (newHeight !== authorVideoTagsPageListHeight) {
              authorVideoTagsPageListHeight = newHeight;
              const list = entries[0].target.querySelectorAll("div#dismissible.ytd-rich-grid-media")
              list.forEach(item => {
                let code = new URLSearchParams(item.querySelector('a#thumbnail').search).get("v")
                if (codeList.includes(code)) {
                  item.querySelector('#video-title').setAttribute('checked', '1')
                }
              })
              console.log('authorVideoTagsContents - 处理完成');
              Qmsg.success("authorVideoTagsContents - 处理完成", {autoClose: true, onClose: () => {  }});
            }
          })
          authorVideoTagsContents.observe(box)
        }
      }
      
      globalHint.close()
      globalHint = Qmsg.success("作者页面 - 处理完成", {autoClose: true, onClose: () => {  }});
    }
  }

  
  
}

/**
 * @description: 监听首页视频列表数据更新
 * @return {*}
 */
function homePageListHandle() {
  const box = document.querySelector("div#contents.ytd-rich-grid-renderer")
  if (box) {
    if (homeContents) {
      console.log('homeContents - 已存在，无需再次监听');
    } else {
      homeContents = watchElementChange(box, (entries) => {
        var newHeight = entries[0].target.scrollHeight;
        console.log('newHeight !== homePageListHeight', newHeight, homePageListHeight);
        if (newHeight !== homePageListHeight) {
          homePageListHeight = newHeight;
          const list = entries[0].target.querySelectorAll("div#dismissible.ytd-rich-grid-media")
          list.forEach(item => {
            let code = new URLSearchParams(item.querySelector('a#thumbnail').search).get("v")
            if (codeList.includes(code)) {
              item.querySelector('#video-title').setAttribute('checked', '1')
            }
          })
          console.log('homeContents - 处理完成');
          Qmsg.success("homeContents - 处理完成", {autoClose: true, onClose: () => {  }});
        }
      })
      homeContents.observe(box)
    }
  }
  console.log('homePageListHandle - 处理完成');
  globalHint.close()
  globalHint = Qmsg.success("homePageListHandle - 处理完成", {autoClose: true, onClose: () => {  }});
}

/**
 * @description: 视频详情页面右侧列表增加监听
 * @return {*}
 */
function viewPageListHandle() {
  if (document.querySelector("#items #contents")) {
    const box = document.querySelector("#items #contents")
    if (itemsContents) {
      console.log('itemsContents - 已存在，无需再次监听');
    } else {
      itemsContents = watchElementChange(box, (entries) => {
        var newHeight = entries[0].target.scrollHeight;
        if (location.search !== search) {
          search = location.search
          console.log('变化了');
          isRecord = false
          isChecked = false
          getData()
        }
        if (newHeight !== viewPageListHeight) {
          viewPageListHeight = newHeight;
          const list = entries[0].target.querySelectorAll('#dismissible')
          list.forEach(item => {
            let code = new URLSearchParams(item.querySelector('a#thumbnail').search).get("v")
            // if (!code) {
            //   code = new URL(item.querySelector('a#thumbnail').search).searchParams.get("viewkey")
            // }
            // if (item.querySelector('.watchedVideoText') || item.querySelector('.watchedVideo')) {
            //   item.querySelector('.title a').setAttribute('checked', '1')
            // }
            if (codeList.includes(code)) {
              item.querySelector('.metadata a.ytd-compact-video-renderer h3.ytd-compact-video-renderer').setAttribute('checked', '1')
            }
          })
          console.log('itemsContents - 处理完成');
          Qmsg.success("itemsContents - 处理完成", {autoClose: true, onClose: () => {  }});
        }
      })
      itemsContents.observe(box)
    }
  }
  
  console.log('viewPageListHandle - 处理完成');
  globalHint.close()
  globalHint = Qmsg.success("viewPageListHandle - 处理完成", {autoClose: true, onClose: () => {  }});
}
