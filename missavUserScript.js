// ==UserScript==
// @name         JSummer - missav
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       You
// @match        https://missav.com/*
// @match        https://thisav.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=missav.com
// @resource     customCSS https://chiens.cn/recordApi/message.css
// @resource     customMissAvCSS https://chiens.cn/recordApi/missAv.css
// @require      https://chiens.cn/recordApi/message.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL  https://chiens.cn/recordApi/missavUserScript.js
// @updateURL    https://chiens.cn/recordApi/missavUserScript.js
// @connect      *
// ==/UserScript==

// @connect * 表示允许任何域名的跨域请求

/* globals GM_addStyle, GM_getResourceText, GM_xmlhttpRequest, Qmsg */

const css = GM_getResourceText("customCSS");
const customMissAvCSS = GM_getResourceText("customMissAvCSS")
GM_addStyle(css);
GM_addStyle(customMissAvCSS);

/*
  0：未录入
  1：已阅
  2：未下
  3：无码
  4：无码未下
  5：流出
  6：流出未下
  7：星级未下
*/

const numberExtraction = /([0-9A-Za-z][a-zA-Z0-9_-]+[0-9A-Za-z])|([n|k][0-9]+)/ig

let isChecking = false
let globalResult = {}
let globalHint = null
let isHandle = false

// 判断是否是dm后面加数字的路径
// const reg = /(?<=\/)dm\d+\//

const homeList = ['/', '/genres/VR']
const skip = ['/actresses', '/genres', '/makers', '/dm15/madou', '/dm3/twav', '/dm1/furuke', '/actresses/search', '/actresses/ranking']
// const classificationList = ['/uncensored-leak', '/fc2', '/heyzo', '/tokyohot', '/1pondo', '/caribbeancom', '/caribbeancompr', '/10musume', '/pacopacomama', '/gachinco', '/xxxav', '/marriedslash', '/naughty4610', '/naughty0930', '/siro', '/luxu', '/gana', '/maan', '/scute', '/ara', '/new', '/release', '/genres/VR', '/today-hot', '/weekly-hot', '/monthly-hot', '/chinese-subtitle']

function urlIncludes(url) {
  if (url === '/') return true
  if (homeList.includes(url)) {
    return true
  }
  if (skip.includes('url')) return false
  // return reg.test(url)
  // let exits = false
  // list.map(item => {
  //   if (item !== '/' && url.indexOf(item) !== -1) {
  //     exits = true
  //   }
  // })
  // return exits
}

document.addEventListener("visibilitychange", function() {
  var string = document.visibilityState
  if (string === 'visible') {
    if (urlIncludes(location.pathname)) {
      if (isHandle) return
      homePageListHandle()
    }
    if (location.pathname !== '/' && !skip.includes(location.pathname) && !urlIncludes(location.pathname)) {
      if (isHandle) return
      detailPageListHandle()
    }
    // if (location.pathname === '/articles') {

    // }
    // if (reg.test(url)) {
    //   console.log('在这');
    // }
  }
});

window.onload = () => {
  if (document.visibilityState === 'visible') {
    if (urlIncludes(location.pathname)) {
      homePageListHandle()
    }
    if (location.pathname !== '/' && !skip.includes(location.pathname) && !urlIncludes(location.pathname)) {
      detailPageListHandle()
    }
    // if (location.pathname === '/articles') {

    // }
  }
}

function homePageListHandle() {
  // let avDetailBox = document.querySelector(".movie-list")
  // let avDetailBoxChildren = avDetailBox.children;
  // let text = null;
  // if (document.querySelector(".section-title")) {
  //   text = document.querySelector(".section-title").innerText.match(numberExtraction);
  // }
  // text = text ? text[0] : "";
  setTimeout(() => {
    let list = document.querySelectorAll('.text-sm.text-nord4.truncate a[x-text], .text-sm.text-nord4.truncate a[alt]')
    let checkList = []
    let isDone = list[0].pathname.split('/').pop()
    if (isDone === 'undefined') {
      homePageListHandle()
    } else {
      for (let i = 0; i < list.length; i++) {
        list[i].href = list[i].href.replace(/(?=#).+/, '').replace(/.+(?<=com)/, '')
        let code = list[i].pathname.split('/').pop().replace('-uncensored-leak', '').toUpperCase()
        code = code.replace('FC2-PPV', 'FC2')
        let x = code.match(numberExtraction)[0];
        checkList.push(x)
      }
      checkDesignationHandle(checkList)
    }
  }, 1000);
}

function checkDesignationHandle(code) {
  if (isChecking) return
  isChecking = true
  if (JSON.stringify(globalResult) === '{}') {
    globalHint = Qmsg.info("正在获取数据", {autoClose: false});
    GM_xmlhttpRequest({
      method: "post",
      url: "https://chiens.cn/recordApi/checkDesignationLog",
      data: `code=${code}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },

      onload: function(req){
        // console.log('dd', req)
        const result = JSON.parse(req.response)
        if (req.readyState === 4 && req.status === 200 && result.code === 'ok') {
          const list = result.data.message
          globalResult = list
          console.log('globalResult', globalResult);
          isChecking = false
          globalHint.close()
          globalHint = Qmsg.success("获取数据成功，等待处理", {autoClose: false, onClose: () => {  }});
          listHandle()
        }
      },
      onerror: function(){
        Qmsg.error("获取失败", {autoClose: true });
        isChecking = false
      }
    });
  } else {
    globalHint = Qmsg.success("获取本地数据成功，等待处理", {autoClose: false, onClose: () => {  }});
    listHandle()
  }
}

function listHandle () {
  if (urlIncludes(location.pathname)) {
    // let avDetailBox = document.querySelector(".movie-list")
    // let avDetailBoxChildren = avDetailBox.children;
    let list = document.querySelectorAll('.text-sm.text-nord4.truncate a[x-text], .text-sm.text-nord4.truncate a[alt]')
    if (list.length <= 0) {
      setTimeout(() => {
        listHandle()
      }, 1000);
    } else {
      for (let i = 0; i < list.length; i++) {

        let code = list[i].pathname.split('/').pop().replace('-uncensored-leak', '').toUpperCase()
        code = code.replace('FC2-PPV', 'FC2')
        let x = code.match(numberExtraction)[0];
        const text = list[i].innerText.replace('FC2-PPV', 'FC2')
        if (text.indexOf(x) === -1) {
          list[i].innerText = ` ${x} ${text}`
        }
        list[i].setAttribute('checked', globalResult[x] || '0')
        if (globalResult[x] && globalResult[x] !== '0') {
          list[i].setAttribute('exits', '1')
        }
      }
      globalHint.close()
      globalHint = Qmsg.success("首页列表数据 - 处理完成", {autoClose: true, onClose: () => {  }});
    }
  }
  if (location.pathname !== '/' && !skip.includes(location.pathname) && !urlIncludes(location.pathname)) {
    let list = document.querySelectorAll('div.rounded')
    for (let i = 0; i < list.length; i++) {
      // list[i].querySelector("a[alt]").href = list[i].querySelector("a[alt]").href.replace(/(?=#).+/, '').replace(/.+(?<=com)/, '')
      if (list[i].parentNode.querySelector("a[x-text]")) {
        list[i].parentNode.querySelector("a[x-text]").href = list[i].parentNode.querySelector("a[x-text]").href.replace(/(?=#).+/, '').replace(/.+(?<=com)/, '')
      }
      if (list[i].parentNode.querySelector("a[x-text]")) {
        list[i].parentNode.querySelector("a[x-text]").href = list[i].parentNode.querySelector("a[x-text]").href.replace(/(?=#).+/, '').replace(/.+(?<=com)/, '')
      } else {
        if (list[i].parentNode.parentNode.parentNode.querySelector("a[x-text]")) {
          list[i].parentNode.parentNode.parentNode.querySelector("a[x-text]").href = list[i].parentNode.parentNode.parentNode.querySelector("a[x-text]").href.replace(/(?=#).+/, '').replace(/.+(?<=com)/, '')
        }
      }
      let code = list[i].querySelector("a[alt]").pathname.split('/').pop().replace('-uncensored-leak', '').toUpperCase()
      code = code.replace('FC2-PPV', 'FC2')
      let x = code.match(numberExtraction)
      if (x) {
        x = x[0]
        if (list[i].parentElement.querySelector('div.text-sm')) {
          let text = list[i].parentElement.querySelector('div.text-sm a').innerText.toUpperCase()
          text = text.replace('FC2-PPV', 'FC2')
          if (text.indexOf(x) === -1) {
            list[i].parentElement.querySelector('div.text-sm a').innerText =` ${x} ${text}`
          }
          list[i].parentElement.querySelector('div.text-sm').setAttribute('checked', globalResult[x] || '0')
        } else {
          let text = list[i].parentElement.parentElement.parentElement.querySelector('div.text-sm a').innerText.toUpperCase()
          text = text.replace('FC2-PPV', 'FC2')
          if (text.indexOf(x) === -1) {
            list[i].parentElement.parentElement.parentElement.querySelector('div.text-sm a').innerText = ` ${x} ${text}`
          }
          list[i].parentElement.parentElement.parentElement.querySelector('div.text-sm').setAttribute('checked', globalResult[x] || '0')
        }
        if (globalResult[x] && globalResult[x] !== '0') {
          if (list[i].parentElement.querySelector('div.text-sm')) {
            let text = list[i].parentElement.querySelector('div.text-sm a').innerText.toUpperCase()
            text = text.replace('FC2-PPV', 'FC2')
            if (text.indexOf(x) === -1) {
              list[i].parentElement.querySelector('div.text-sm a').innerText = ` ${x} ${text}`
            }
            list[i].parentElement.querySelector('div.text-sm').setAttribute('exits', '1')
          } else {
            let text = list[i].parentElement.parentElement.parentElement.querySelector('div.text-sm a').innerText.toUpperCase()
            text = text.replace('FC2-PPV', 'FC2')
            if (text.indexOf(x) === -1) {
              list[i].parentElement.parentElement.parentElement.querySelector('div.text-sm a').innerText = ` ${x} ${text}`
            }
            list[i].parentElement.parentElement.parentElement.querySelector('div.text-sm').setAttribute('exits', '1')
          }
        }
      }
      
    }
    
    let t = document.querySelector('h1.text-base').innerText.toUpperCase()
    t = t.replace('FC2-PPV', 'FC2')
    t = t.match(numberExtraction);
    t = t ? t[0] : "";
    if (t != "") {
      document.querySelector('h1.text-base').setAttribute('checked', globalResult[t]);
    }

    globalHint.close()
    globalHint = Qmsg.success("详情页数据 - 处理完成", {autoClose: true, onClose: () => {  }});
  }
  // if (location.pathname === '/articles') {

  // }
  isHandle = true
}


// 详情页
function detailPageListHandle() {
  setTimeout(() => {
    let code = location.pathname.split('/').pop().replace('-uncensored-leak', '').toUpperCase()
    code = code.replace('FC2-PPV', 'FC2')
    let t = code.match(numberExtraction);
    t = t ? t[0] : "";
    let checkList = []
    if (t !== '') {
      checkList.push(t)
    }
    let list = document.querySelectorAll('div.rounded')
    for (let i = 0; i < list.length; i++) {
      if (document.querySelectorAll('div.rounded')[i].parentNode.parentNode.parentNode) {
        if (document.querySelectorAll('div.rounded')[i].parentNode.parentNode.parentNode.querySelector("a[x-text]")) {
          document.querySelectorAll('div.rounded')[i].parentNode.parentNode.parentNode.querySelector("a[x-text]").href = document.querySelectorAll('div.rounded')[i].parentNode.parentNode.parentNode.querySelector("a[x-text]").href.replace(/(?=#).+/, '').replace(/.+(?<=com)/, '')
        }
      }
      let code = list[i].querySelector("a[alt]").pathname.split('/').pop().replace('-uncensored-leak', '').toUpperCase()
      code = code.replace('FC2-PPV', 'FC2')
      let x = code.match(numberExtraction)
      if (x) {
        x = x[0]
        checkList.push(x)
      }
    }
    checkDesignationHandle(checkList)
  }, 1000);
}