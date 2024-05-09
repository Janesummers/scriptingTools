// ==UserScript==
// @name         JSummer - 糖心 - 详情
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://*.txh041.com/movie/detail/*
// @match        https://txh041.com/movie/detail/*
// @resource     customCSS https://chiens.cn/recordApi/message.css
// @require      https://chiens.cn/recordApi/message.min.js
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
sheet.addRule('div[checked]', 'color: #b58226 !important;');

console.log('等待详情脚本执行');

// let codeList = []
let globalHint = null
// let scrollHeight = 0;

function recordText() {
  let userCode = ''
  let title = ''
  
  if (document.querySelector('.nav-content')) {
    userCode = document.querySelector('.nav-content').href.match(/(\d{5,})/)
  }
  if (document.querySelector('.video-info .control')) {
    userCode = document.querySelector('.video-info .control>a').href.match(/(\d{5,})/)
  }
  if (document.querySelector('.introduction .name')) {
    title = document.querySelector('.introduction .name').innerText
  }
  if (document.querySelector('.video-info .info-actions .title')) {
    title = document.querySelector('.video-info .info-actions .title').innerText
  }
  if (userCode && title !== '') {
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

recordText()
