// ==UserScript==
// @name         JSummer - 草榴
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  try to take over the world!
// @author       You
// @match        https://*.t66y.com/*
// @match        https://t66y.com/*
// @match        *://cl.6387x.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=t66y.com
// @resource     customCSS https://chiens.cn/recordApi/message.css
// @require      https://chiens.cn/recordApi/message.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL  https://chiens.cn/recordApi/userscript.js
// @updateURL    https://chiens.cn/recordApi/userscript.js
// ==/UserScript==

/* globals GM_addStyle, GM_getResourceText, GM_xmlhttpRequest, Qmsg */

const css = GM_getResourceText("customCSS");
GM_addStyle(css);
GM_addStyle(`
a[checked]::before {
  content: '[已看]';
  font-size: 23px;
}
`);


var style = document.createElement('style');
document.head.appendChild(style);
let sheet = style.sheet;
const cssList = [
  { label: 'a:visited', value: 'color: #b58226 !important;' },
  { label: 'a[checked]', value: 'color: #b58226 !important;' },
  { label: '#main a', value: 'font-size: 14px;font-weight: 800;' },
  { label: '#tbody .tal a[local]', value: 'color: #9126b5 !important;' },
  { label: '#tbody .tr3 a[btn]', value: 'padding: 6px 14px;color: #3c3c3c !important;' },
]
cssList.map(item => {
  if (sheet.insertRule) {
    sheet.insertRule(`${item.label} { ${item.value} }`);
  } else {
    sheet.addRule(`${item.label} { ${item.value} }`);
  }
})

console.log('等待脚本执行');

let codeList = []
let globalHint = null
let isRecord = false
let isLoading = false
// 详情页路由
const detailRouterPathList = ['/htm_data', '/htm_mob', '/read.php']

// 获取当前页面路由
function getCurrentPagePath() {
  return location.pathname.match(/\/[^/]+/)
}

// 视频详情页
if (location.pathname) {
  let path = getCurrentPagePath()
  path = path.length && path[0]
  console.log('path', path);
  if (detailRouterPathList.includes(path)) {
    getCodeHandle()
  }
}

/**
 * @description: 获取详情页番号code
 * @return {*}
 */
function getCodeHandle() {
  location.pathname
  let code = location.pathname.match(/(\d{5,})/)
  if (code) {
    code = code[0]
  }
  if (!code && location.search) {
    let code = new URLSearchParams(location.search).get("tid")
    if (!code) {
      code = new URL(location.href).searchParams.get("tid")
    }
  }

  if (code) {
    recordHandle(code)
  }
}

/**
 * @description: 记录番号
 * @param {*} code 番号code
 * @return {*}
 */
function recordHandle(code) {
  if (isRecord) return
  isRecord = true
  const hint = Qmsg.info("正在发请求", {autoClose: false});
  console.log('发请求')
  GM_xmlhttpRequest({
    method: "post",
    url: "https://chiens.cn/recordApi/log",
    data: `code=${code}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },

    onload: function(req){
      const result = JSON.parse(req.response)
      if (req.readyState === 4 && req.status === 200 && result.code === 'ok') {
        console.log("记录成功");
        //hint.close()
        Qmsg.success("成功记录", {autoClose: true, onClose: () => { hint.close() }});
        // isRecord = false
      }
    },
    onerror: function(){
      Qmsg.error("请求失败", {autoClose: true });
    }
  });
}

function listHandle() {
  let tbody = document.querySelector('#tbody')
  let child = []
  if (!tbody && location.pathname.indexOf('thread0806') === -1) {
    tbody = document.querySelector('#main .t tbody')
    child = tbody.querySelectorAll('.t_one')
  }
  if (tbody && location.pathname.indexOf('thread0806') !== -1) {
    // tbody = document.querySelector('#main .t tbody')
    child = document.querySelectorAll('.t_one')
  }
  if (tbody && location.pathname.indexOf('/user/') !== -1) {
    // tbody = document.querySelector('#main .t tbody')
    child = document.querySelectorAll('.t_one')
  }
  console.log('child', child);
    
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
          if (!this.getAttribute('checked')) {
            this.setAttribute('checked','1')
          }
        }, false)
        console.log('codeList', codeList);
        if (codeList.length) {
          let id = item.getAttribute('id')
          console.log('dsd', id);
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
    isLoading = false
    globalHint.close()
    globalHint = Qmsg.success("处理完成", {autoClose: true, onClose: () => {  }});
  } else {
    isLoading = false
    globalHint.close()
    globalHint = Qmsg.success("未获取到节点", {autoClose: true, onClose: () => {  }});
  }
  // console.log('item', item.getAttribute('id'))
        
}

// 处理列表页
// if ()

function getContainer() {
  detailRouterPathList.includes(path)
}

if (document.body.clientWidth >= 1080) {
  document.documentElement.style.zoom = '1.3'
}

window.onload = function () {
    
  let tbody = document.getElementById('tbody')

  if (!tbody && location.pathname.indexOf('htm_mob') === -1) {
    tbody = document.querySelector('#main .t tbody')
  }


  if ((tbody || location.pathname.indexOf('thread0806') !== -1) && location.pathname.indexOf('htm_data') === -1) {

    globalHint = Qmsg.info("正在发请求", {autoClose: false});

    if (isLoading) return
    isLoading = true

    GM_xmlhttpRequest({
      method: "post",
      url: "https://chiens.cn/recordApi/getLog",
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
          globalHint = Qmsg.success("请求成功，等待页面加载完成", {autoClose: false, onClose: () => {  }});
                    
          listHandle()
        }
      },
      onerror: function(){
        globalHint.close()
        Qmsg.error("请求失败", {autoClose: true });
      }
    });
  }
}