// ==UserScript==
// @name         JSummer - 糖心 - 详情（GET请求版）
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        https://*.txh049.com/movie/detail/*
// @match        https://txh049.com/movie/detail/*
// @resource     customCSS https://chiens.cn/recordApi/message.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-end
// @downloadURL  https://chiens.cn/recordApi/txUserScriptNoRequest2.js
// @updateURL    https://chiens.cn/recordApi/txUserScriptNoRequest2.js
// ==/UserScript==

/* globals GM_addStyle, GM_getResourceText, Qmsg */

let messageScript = document.createElement('script');
messageScript.type = 'text/javascript';
messageScript.src = `https://chiens.cn/recordApi/message.min.js`;
document.body.appendChild(messageScript);

let script = document.createElement('script');
script.type = 'text/javascript';
script.innerHTML =
`
  function handleSuccess() {
    window.globalHint.close()
    Qmsg.success("成功记录", {autoClose: true, onClose: () => { window.globalHint.close() }});
  };
`;
document.body.appendChild(script);


sessionStorage.setItem('dialogAd', 'sonofbitch');
sessionStorage.setItem('noticeDialog', 'sonofbitch');
sessionStorage.setItem('splashAd', 'sonofbitch');

const css = GM_getResourceText("customCSS");
GM_addStyle(css);
    
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

window.globalHint = null

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
    window.globalHint = Qmsg.info("正在发请求", {autoClose: false});

    let script2 = document.createElement('script');
    script2.type = 'text/javascript';
    script2.src = `https://chiens.cn/recordApi/txLog?userCode=${userCode}&title=${title}`;
    document.body.appendChild(script2);
  } else {
    setTimeout(recordText, 1000)
  }
}

recordText()
