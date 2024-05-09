// ==UserScript==
// @name         JSummer - 草榴（GET请求版）
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  try to take over the world!
// @author       You
// @match        https://*.t66y.com/*
// @match        https://t66y.com/*
// @resource     customCSS https://chiens.cn/recordApi/message.css
// @resource     source https://chiens.cn/recordApi/log.json
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL  https://chiens.cn/recordApi/userscriptNoRequest.js
// @updateURL    https://chiens.cn/recordApi/userscriptNoRequest.js
// ==/UserScript==

/* globals GM_addStyle, GM_getResourceText, Qmsg */

let messageScript = document.createElement('script');
messageScript.type = 'text/javascript';
messageScript.src = `https://chiens.cn/recordApi/message.min.js`;
messageScript.onload = function () {
  let tbody = document.getElementById('tbody')

  if (!tbody && location.pathname.indexOf('htm_mob') === -1) {
    tbody = document.querySelector('#main .t tbody')
  }

  console.log('tbody', tbody);
  if (tbody || location.pathname.indexOf('thread0806') !== -1) {
    if (window.isLoading) return
    window.isLoading = true
        
    window.globalHint = Qmsg.info("正在处理文件", {autoClose: true});

    let t66y = GM_getResourceText("source")
    if (t66y) {
      t66y = JSON.parse(t66y)
    }
    codeList = t66y || []
    listHandle()
  }

  if (location.pathname.indexOf('htm_data') !== -1 || location.pathname.indexOf('htm_mob') !== -1) {

    if (window.isRecord) return
    window.isRecord = true

    window.globalHint = Qmsg.info("正在发请求", {autoClose: true});

    let code = location.pathname.match(/(\d{5,})/)
    if (code) {
      code = code[0]
      console.log('发请求')
      let script2 = document.createElement('script');
      script2.type = 'text/javascript';
      script2.src = `https://chiens.cn/recordApi/log?code=${code}`;
      document.body.appendChild(script2);
    }
  }
}
document.body.appendChild(messageScript);

let script = document.createElement('script');
script.type = 'text/javascript';
script.innerHTML =
`
  function handleSuccess() {
    console.log(window.globalHint, '123')
    
    Qmsg.success("成功记录", {autoClose: true, onClose: () => { }});
    window.isRecord = false
  };
`;
document.body.appendChild(script);

const css = GM_getResourceText("customCSS");
GM_addStyle(css);
GM_addStyle(`
  a[checked]::before {
    content: '[已看]';
    font-size: 23px;
  }
`);


console.log('等待脚本执行');

let codeList = []
window.globalHint = null
window.isRecord = false
window.isLoading = false


var style = document.createElement('style');
document.head.appendChild(style);
let sheet = style.sheet;
if (sheet.insertRule) {
  sheet.insertRule(`
    a:visited {
      color: #b58226 !important;
    }
  `);
  sheet.insertRule(`
    a[checked] {
      color: #b58226 !important;
    }
  `);
  sheet.insertRule(`
    #main a {
      font-size: 14px;
      font-weight: 800;
    }
  `);
  sheet.insertRule(`
    #tbody .tal a[local] {
      color: #9126b5 !important;
    }
  `);
  sheet.insertRule(`
    #tbody .tr3 a[btn] {
      padding: 6px 14px;
      color: #3c3c3c !important;
    }
  `);
} else {
  sheet.addRule('a:visited', 'color: #b58226 !important;');
  sheet.addRule('a[checked]', 'color: #b58226 !important;');
  sheet.addRule('#main a', 'font-size: 14px;font-weight: 800;');
  sheet.addRule('#tbody .tal a[local]', 'color: #9126b5 !important;');
  sheet.addRule('#tbody .tr3 a[btn]', 'padding: 6px 14px;color: #3c3c3c !important;');
}

function listHandle() {
  let tbody = document.querySelector('#tbody')
  let child = []
  if (!tbody && location.pathname.indexOf('thread0806') === -1) {
    tbody = document.querySelector('#main .t tbody')
    child = tbody.querySelectorAll('.t_one')
  }
  if (!tbody && location.pathname.indexOf('thread0806') !== -1) {
    // tbody = document.querySelector('#main .t tbody')
    child = document.querySelectorAll('.t_one')
  }
    
  if (child.length > 0) {
    for (let i = 0; i < child.length; i++) {
      let item = child[i].querySelector('.tal a[id]')
      if (location.pathname.indexOf('thread0806') !== -1) {
        item = child[i].querySelector('a')
      }
      if (!item) {
        item = child[i].querySelector('th a')
      }
      if (item) {
        item.addEventListener('click', function(){
          // console.log('123', this)
          if (!this.getAttribute('checked')) {
            this.setAttribute('checked','1')
          }
        }, false)

        if (codeList.length) {
          let id = item.getAttribute('id')
          if (id) {
            id = id.replace(/[^\d]*(\d+)/, "$1")
          } else {
            id = item.getAttribute('href').match(/\d{5,}/)
            if (id) {
              id = id[0]
            }
          }
          if (id && codeList.includes(id)) {
            item.setAttribute('checked','1')
          }
        }
      }
    }
    window.isLoading = false
    window.globalHint = Qmsg.success("处理完成", {autoClose: true, onClose: () => {  }});
  } else {
    window.isLoading = false
    window.globalHint = Qmsg.success("未获取到节点", {autoClose: true, onClose: () => {  }});
  }
  // console.log('item', item.getAttribute('id'))
        
}