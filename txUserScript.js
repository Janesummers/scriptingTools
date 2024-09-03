// ==UserScript==
// @name         JSummer - 糖心 - 用户
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://*.txh049.com/user/*
// @match        https://txh049.com/user/*
// @resource     customCSS https://chiens.cn/recordApi/message.css
// @require      https://chiens.cn/recordApi/message.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @connect      *
// @downloadURL  https://chiens.cn/recordApi/txUserScript.js
// @updateURL    https://chiens.cn/recordApi/txUserScript.js
// ==/UserScript==

/* globals GM_addStyle, GM_getResourceText, GM_xmlhttpRequest, Qmsg */

// @connect * 表示允许任何域名的跨域请求

sessionStorage.setItem('dialogAd', 'sonofbitch');
sessionStorage.setItem('noticeDialog', 'sonofbitch');
sessionStorage.setItem('splashAd', 'sonofbitch');

const css = GM_getResourceText("customCSS");
GM_addStyle(css);
// GM_addStyle(`
// a[checked]::before {
//   content: '[已看]';
//   font-size: 23px;
// }
// `);

// let sheet = style.sheet;
// sheet.addRule('a:visited', 'color: #b58226 !important;');
// // sheet.addRule('#main a', 'font-size: 14px;font-weight: 800;');
// sheet.addRule('input', 'color: #6c6c6c !important;');
    
var style = document.createElement('style');
document.head.appendChild(style);
let sheet = style.sheet;
const cssList = [
  { label: 'div[checked]', value: 'color: #b58226 !important;' }
]
cssList.map(item => {
  if (sheet.insertRule) {
    sheet.insertRule(`${item.label} { ${item.value} }`);
  } else {
    sheet.addRule(`${item.label} { ${item.value} }`);
  }
})
let isRecord = false
let isLoading = false

console.log('等待脚本执行');

let codeList = []
let globalHint = null
let scrollHeight = 0;
let userCode = location.pathname.match(/(\d{2,})/)[0]

function initTitle () {
  console.log('909090');
  // document.querySelector('.video-info .title')
  // let title = pathname.includes('/video/detail') ? document.querySelector('.video-info .title') : document.querySelector('.nickname')
  let title = document.querySelector('.nickname')
  if (title && !document.title.includes(title.innerText.trim())) {
    document.title = `${title.innerText.trim()} -糖心`
    getListHandle()
    // document.querySelector('.my-swipe.ad.van-swipe').remove()
  } else {
    setTimeout(initTitle, 1000)
  }
}

function listHandle() {
  globalHint.close()
  globalHint = Qmsg.success("请求成功，等待页面加载完成", {autoClose: false, onClose: () => {  }});
  let child = document.querySelector('.video-list').querySelectorAll('.video-item')
  if (child.length > 0) {
    const box = document.querySelector('.video-list')
    box.addEventListener('DOMNodeInserted', function(){
      const currentHeight = document.getElementsByClassName('video-list')[0].scrollHeight;
      if (scrollHeight !== 0 && currentHeight > (scrollHeight + 50)) {
        getListHandle()
      }
    }, false);
      
    for (let i = 0; i < child.length; i++) {
      let item = child[i]
      // console.log('item', item.getAttribute('id'))
      item.querySelector('.aspect-ratio').setAttribute('title', item.querySelector('.info .title').innerText)
      item.querySelector('.aspect-ratio').addEventListener('click', function(){
        // console.log('123', this)
        // userCode = document.querySelector('.nav-content').href.match(/(\d{5,})/)
        recordText(this.getAttribute('title'))
        // if (this.querySelector('.info .title').getAttribute('checked')) {
                
        // } else {
        //     this.querySelector('.info .title').setAttribute('checked','')
        // }
      }, false)
      item.querySelector('.info .title').addEventListener('click', function(){
        // console.log('123', this)
        // userCode = document.querySelector('.nav-content').href.match(/(\d{5,})/)
        recordText(this.innerText)
        this.setAttribute('checked','1')
        // if (this.querySelector('.info .title').getAttribute('checked')) {
                
        // } else {
        //     this.querySelector('.info .title').setAttribute('checked','')
        // }
      }, false)
      // console.log('codeList', codeList);
      if (codeList.length) {
        const text = item.querySelector('.info .title').innerText
        if (codeList.includes(text)) {
              
          item.querySelector('.info .title').setAttribute('checked','')
        }
      }
    }
    globalHint.close()
    globalHint = Qmsg.success("处理完成", {autoClose: true, onClose: () => {  }});
    document.querySelector('.video-list').setAttribute('checkedList', '1')
    isLoading = false
    scrollHeight = document.querySelector('.video-list').scrollHeight
  } else {
    globalHint.close()
    if (document.querySelector('.van-list__finished-text .empty')) {
      globalHint = Qmsg.error("处理失败，未发布视频", {autoClose: true, onClose: () => {  }});
      return
    }
    globalHint = Qmsg.error("处理失败，未获得子元素", {autoClose: true, onClose: () => {  }});
    setTimeout(() => {
      listHandle()
    }, 1000);
  }
}

function getListHandle() {
  if (isLoading) return
  isLoading = true
  globalHint = Qmsg.info("正在发请求", {autoClose: false});
  // if (codeList.length > 0) {
  //   listHandle()
  //   return
  // }
  GM_xmlhttpRequest({
    method: "post",
    url: "https://chiens.cn/recordApi/getTxLog",
    data: `userCode=${userCode}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },

    onload: (req) => {

      const result = JSON.parse(req.response)
      if (req.readyState === 4 && req.status === 200 && result.code === 'ok') {
        const list = result.data.message
        codeList = list || []
        console.log('ddsss', list)
        listHandle()
      }
    },
    onerror: () => {
      globalHint.close()
      isLoading = false
      Qmsg.error("请求失败", {autoClose: true });
    }
  });
}

function recordText(title) {
  if (isRecord) return
  isRecord = true
  // let userCode = ''
  // let title = ''
  
  // if (document.querySelector('.nav-content')) {
  //   userCode = document.querySelector('.nav-content').href.match(/(\d{5,})/)
  // }
  // if (document.querySelector('.introduction .name')) {
  //   title = document.querySelector('.introduction .name').innerText
  // }
  if (userCode && title !== '') {
    console.log('发请求')
    globalHint = Qmsg.info("正在发请求", {autoClose: false});
    GM_xmlhttpRequest({
      method: "post",
      url: "https://chiens.cn/recordApi/txLog",
      data: `userCode=${userCode}&title=${title}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      onload: function(req){
        console.log('dd', req)
        const result = JSON.parse(req.response)
        if (req.readyState === 4 && req.status === 200 && result.code === 'ok') {
          console.log("记录成功");
          //hint.close()
          Qmsg.success("成功记录", {autoClose: true, onClose: () => { globalHint.close() }});
          isRecord = false
          // let text = localStorage.getItem('codeLog')
          // if (result.message) {
          //     if (text) {
          //         localStorage.setItem('codeLog', `${text},${code}`)
          //     } else {
          //         console.log('11', result.message)
          //         localStorage.setItem('codeLog', result.message)
          //     }
          // }
        }
      },
      onerror: function(){
        Qmsg.error("请求失败", {autoClose: true });
      }
    });
  } else {
    // setTimeout(recordText, 1000)
  }
}

function handleScroll () {
  if (location.pathname.indexOf('/user') !== -1) {
    if (!document.querySelector('.video-list').getAttribute('checkedList')) {
      document.querySelector('.video-list').setAttribute('checkedList', '1')
      getListHandle()
    }
  }
  // const currentHeight = document.getElementsByClassName('video-list')[0].scrollHeight;
  // if (currentHeight > (scrollHeight + 50)) {
  //   getListHandle()
  // }
  // console.log('【滚动条高度】', scrollHeight);
  /*scrollTop + ch = sh*/
}
window.addEventListener('scroll', handleScroll, false)

initTitle()
