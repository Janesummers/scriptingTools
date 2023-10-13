// ==UserScript==
// @name         JSummer - 糖心 - 用户（不发请求版）
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://*.txh016.com/user/*
// @match        https://txh016.com/user/*
// @resource customCSS https://chiens.cn/recordApi/message.css
// @resource source https://chiens.cn/recordApi/tx_log.json
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://chiens.cn/recordApi/txUserScriptNoRequest.js
// @updateURL https://chiens.cn/recordApi/txUserScriptNoRequest.js
// ==/UserScript==

let script = document.createElement('script');
script.type = 'text/javascript';
script.src = `https://chiens.cn/recordApi/message.min.js`;
document.body.appendChild(script);


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
window.isRecord = false
let isLoading = false

console.log('等待脚本执行');

let codeList = []
window.globalHint = null
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
  window.globalHint.close()
  window.globalHint = Qmsg.success("处理成功，等待页面加载完成", {autoClose: false, onClose: () => {  }});
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
      window.globalHint.close()
      window.globalHint = Qmsg.success("处理完成", {autoClose: true, onClose: () => {  }});
      document.querySelector('.video-list').setAttribute('checkedList', '1')
      isLoading = false
      scrollHeight = document.querySelector('.video-list').scrollHeight
    } else {
      window.globalHint.close()
      if (document.querySelector('.van-list__finished-text .empty')) {
        window.globalHint = Qmsg.error("处理失败，未发布视频", {autoClose: true, onClose: () => {  }});
        return
      }
      window.globalHint = Qmsg.error("处理失败，未获得子元素", {autoClose: true, onClose: () => {  }});
      setTimeout(() => {
        listHandle()
      }, 1000);
    }
}

function getListHandle() {
  if (isLoading) return
  isLoading = true
  window.globalHint = Qmsg.info(`正在处理文件`, {autoClose: false});
  let txUser = GM_getResourceText("source")
  if (txUser) {
    txUser = JSON.parse(txUser)
  }
  codeList = txUser[userCode] || []
  listHandle()
}

function recordText(title) {
  if (window.isRecord) return
  window.isRecord = true
  // let userCode = ''
  // let title = ''
  
  // if (document.querySelector('.nav-content')) {
  //   userCode = document.querySelector('.nav-content').href.match(/(\d{5,})/)
  // }
  // if (document.querySelector('.introduction .name')) {
  //   title = document.querySelector('.introduction .name').innerText
  // }

  window.globalHint = Qmsg.info("正在发请求", {autoClose: false});

  if (userCode && title !== '') {

    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML =
    `
      function handleSuccess() {
        hint.close()
        Qmsg.success("成功记录", {autoClose: true, onClose: () => { window.globalHint.close() }});
        window.isRecord = false
      };
    `;
    document.body.appendChild(script);


    script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://chiens.cn/recordApi/txLogInScript?userCode=${userCode}&title=${title}`;
    document.body.appendChild(script);
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