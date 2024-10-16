// ==UserScript==
// @name         JSummer - 糖心 - 详情
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        https://*.txh049.com/movie/detail/*
// @match        https://txh049.com/movie/detail/*
// @resource     customCSS https://chiens.cn/recordApi/css/message.css
// @require      https://chiens.cn/recordApi/js/message.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @connect      *
// @downloadURL  https://chiens.cn/recordApi/txUserScript2.js
// @updateURL    https://chiens.cn/recordApi/txUserScript2.js
// ==/UserScript==

// @connect * 表示允许任何域名的跨域请求

/* globals GM_addStyle, GM_getResourceText, GM_xmlhttpRequest, Qmsg */

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

console.log('等待详情脚本执行');

// let codeList = []
let globalHint = null
// let scrollHeight = 0;

function recordText() {
  let userCode = ''
  let title = ''
  // Qmsg.success("1", {autoClose: true});
  if (document.querySelector('.nav-content')) {
    userCode = document.querySelector('.nav-content').href.match(/(\d{4,})/)
  }
  // Qmsg.success("2", {autoClose: true});
  if (document.querySelector('.video-info .control')) {
    userCode = document.querySelector('.video-info .control>a').href.match(/(\d{4,})/)
  }
  // Qmsg.success("3", {autoClose: true});
  if (document.querySelector('.introduction .name')) {
    title = document.querySelector('.introduction .name').innerText
  }
  // Qmsg.success("4", {autoClose: true});
  if (document.querySelector('.video-info .info-actions .title')) {
    title = document.querySelector('.video-info .info-actions .title').innerText
  }
  // Qmsg.success(`5-${userCode}-${title}`, {autoClose: true});
  if (userCode && title !== '') {
    // customBtn()
    setTimeout(async () => {
      getDataHandle()
    }, 900);
    // Qmsg.info(`userCode-${userCode}`, {autoClose: false});
    userCode = userCode[0]
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
    setTimeout(recordText, 1000)
  }
}

function customBtn() {
  let btn = document.createElement('div')
  btn.class = 'js-custom-btn'
  btn.innerText = '获取数据'
  btn.style.width = '120px'
  btn.style.height = '40px'
  btn.style.fontSize = '20px'
  btn.style.textAlign = 'center'
  btn.style.lineHeight = '40px'
  btn.style.backgroundColor = 'rgb(25, 137, 250)'
  btn.style.borderRadius = '6px'
  btn.style.position = 'fixed'
  btn.style.left = '20px'
  btn.style.bottom = '100px'
  btn.style.zIndex = '2000'
  btn.style.cursor = 'pointer'
  btn.addEventListener('click', () => {
    getDataHandle()
  })
  document.body.appendChild(btn)
}

function getDataHandle() {
  // let test = document.querySelector('.ybd_video_slide_d_ownItem_btn') ? document.querySelector('.ybd_video_slide_d_ownItem_btn').getAttribute('data-ourl') : document.querySelector('.ybd_video_slide_d_ownItem_copybtn').getAttribute('data-ourl')
  let test = document.querySelector('.vjs-tech').getAttribute('src')
  let test2 = document.querySelector('.introduction .name') ? document.querySelector('.introduction .name').innerText : document.querySelector('.info-actions .info .title').innerText
  let test3 = document.querySelector('.nav-content .info .username') ? document.querySelector('.nav-content .info .username').innerText : document.querySelector('.video-info .info .nickname').innerText
  Qmsg.info(`${test3}-${test}-${test2}`, {autoClose: true});
  // await navigator.clipboard.writeText(test)
  Qmsg.success("准备拷贝", {autoClose: true});
  // Qmsg.success(`body-${document.querySelector('body')}`, {autoClose: true});
  // let aaa = document.querySelector('.vjs-tech').getAttribute('src')
  
  GM_xmlhttpRequest({
    method: "get",
    url: "https://chiens.cn/getText/1O37c",
    data: '',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    onload: function(req){
      console.log('dd', req)
      const result = JSON.parse(req.response)
      if (req.readyState === 4 && req.status === 200 && result.code === 'ok') {
        GM_xmlhttpRequest({
          method: "post",
          url: "https://chiens.cn/getText/write?id=1O37c",
          data: `data=${result.data}\n\n${window.origin}${test}\n【${test3.trim()}】${test2}`,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          onload: function(req2){
            console.log('dd', req2)
            Qmsg.success("即将拷贝成功", {autoClose: true});
            const result2 = JSON.parse(req2.response)
            if (req2.readyState === 4 && req2.status === 200 && result2.code === 'ok') {
              //hint.close()
              Qmsg.success("拷贝成功", {autoClose: true});
            }
          },
          onerror: function(){
            Qmsg.error("拷贝失败", {autoClose: true });
          }
        });
      }
    },
    onerror: function(){
      Qmsg.error("拷贝失败", {autoClose: true });
    }
  });
}

recordText()
