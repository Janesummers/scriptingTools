// ==UserScript==
// @name         JSummer - JavDB
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  try to take over the world!
// @author       You
// @match        https://javdb.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=javdb.com
// @resource customCSS https://chiens.cn/recordApi/message.css
// @require      https://chiens.cn/recordApi/message.min.js
// @require      https://chiens.cn/recordApi/jquery-3.1.1.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://chiens.cn/recordApi/javdbUserScript.js
// @updateURL https://chiens.cn/recordApi/javdbUserScript.js
// @connect      *
// ==/UserScript==

// @connect * 表示允许任何域名的跨域请求

const css = GM_getResourceText("customCSS");
GM_addStyle(css);
GM_addStyle(`
.movie-list .item a:visited {
  color: #d36141 !important;
}
.movie-list .box:visited .video-title {
  color: #d36141 !important;
}
.movie-list .item a:visited strong {
  color: inherit !important;
}
.video-title[checked] {
  font-weight: bold;
}
.movie-list {
  column-gap: 1rem;
  row-gap: 1rem;
}
.video-title[checked='0']::before,
.video-number[checked='0']::before,
.movie-panel-info .panel-block .value[checked='0']::before {
  content: '[未录入]';
}
.video-title[checked='1']::before,
.video-number[checked='1']::before,
.movie-panel-info .panel-block .value[checked='1']::before {
  content: '[已阅]';
}
.video-title[checked='2']::before,
.video-number[checked='2']::before,
.movie-panel-info .panel-block .value[checked='2']::before {
  content: '[未下]';
}
.video-title[checked='3']::before,
.video-number[checked='3']::before,
.movie-panel-info .panel-block .value[checked='3']::before {
  content: '[无码]';
}
.video-title[checked='4']::before,
.video-number[checked='4']::before,
.movie-panel-info .panel-block .value[checked='4']::before {
  content: '[无码未下]';
}
.video-title[checked='5']::before,
.video-number[checked='5']::before,
.movie-panel-info .panel-block .value[checked='5']::before {
  content: '[流出]';
}
.video-title[checked='6']::before,
.video-number[checked='6']::before,
.movie-panel-info .panel-block .value[checked='6']::before {
  content: '[流出未下]';
}
.video-title[checked='7']::before,
.video-number[checked='7']::before,
.movie-panel-info .panel-block .value[checked='7']::before {
  content: '[星级未下]';
}
.video-title[exits='1'],
.video-number[exits='1'] {
  color: #b58226 !important;
  text-decoration: underline !important;
}
.tile-images.tile-small {
  grid-template-columns: repeat(5,minmax(0,1fr));
  column-gap: 1rem;
  row-gap: 1rem;
}
.tile-images.tile-small .tile-item {
  display: flex;
  flex-direction: column;
}
.tile-images.tile-small .video-number {
  font-size: 1.2rem !important;
}
.tile-images.tile-small .video-title {
  font-size: 1rem !important;
  text-overflow: none !important;
  overflow: auto !important;
  white-space: normal !important;
}
div[data-controller="movie-tab"] li[data-movie-tab-target="listTab"] {
  display: none;
}
@media only screen and (max-width: 1024px) {
  .tile-images.tile-small {
    grid-template-columns: repeat(3,minmax(0,1fr));
  }
  .tile-images.tile-small .video-number {
    white-space: wrap !important;
    overflow: auto !important;
  }
  .video-number[checked]::before {
    display: block;
  }
}
`);

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

const numberExtraction = /([0-9A-Za-z][a-zA-Z0-9\_\-]+[0-9A-Za-z])|([n|k][0-9]+)/ig

let isChecking = false
let globalResult = {}
let globalHint = null
let isHandle = false

const homeList = ['/', '/search', '/series/', '/video_codes/', '/tags', '/makers/', '/publishers/', '/directors/', '/actors/', '/rankings/movies', '/rankings/fanza_award', '/uncensored', '/censored', '/anime']

function urlIncludes(list, url) {
  if (list.includes(url)) {
    return true
  }
  let exits = false
  list.map(item => {
    if (item !== '/' && url.indexOf(item) !== -1) {
      exits = true
    }
  })
  return exits
}

document.addEventListener("visibilitychange", function() {
  var string = document.visibilityState
  if (string === 'visible') {   // 当页面由隐藏至显示时
    setTimeout(() => {
      if (urlIncludes(homeList, location.pathname)) {
        if (isHandle) return
        homePageListHandle()
      }
      if (location.pathname.indexOf('/v/') !== -1) {
        detailPageListHandle()
        magnetsHandle()
      }
    })
  }
});

window.onload = () => {
  if (document.visibilityState === 'visible') {
    if (document.body.clientWidth >= 1080) {
      document.documentElement.style.zoom = '1.4'
    }
    setTimeout(() => {
      if (urlIncludes(homeList, location.pathname)) {
        homePageListHandle()
      }
      if (location.pathname.indexOf('/v/') !== -1) {
        detailPageListHandle()
        magnetsHandle()
      }
    }, 1200)
  }
}

function homePageListHandle() {
  let avDetailBox = document.querySelector(".movie-list")
  let avDetailBoxChildren = avDetailBox.children;
  // let text = null;
  // if (document.querySelector(".section-title")) {
  //   text = document.querySelector(".section-title").innerText.match(numberExtraction);
  // }
  // text = text ? text[0] : "";
  let checkList = []
  for (let i = 0; i < avDetailBoxChildren.length; i++) {
      let x = avDetailBoxChildren[i].querySelector(".video-title").innerText.match(numberExtraction)[0];
      x = x.toUpperCase()
      avDetailBoxChildren[i].querySelector(".video-title").style.whiteSpace = 'normal'
      checkList.push(x)
  }
  checkDesignationHandle(checkList)
}

function checkDesignationHandle(code) {
  if (isChecking) return
  isChecking = true
  console.log('code.toString()', code.toString());
  if (JSON.stringify(globalResult) === '{}') {
    globalHint = Qmsg.info("正在获取数据", {autoClose: false});
    GM_xmlhttpRequest({
        method: "post",
        url: "https://chiens.cn/recordApi/checkDesignationLog",
        data: `code=${code.toString()}`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },

        onload: function(req){
          console.log('dd', req)
          const result = JSON.parse(req.response)
          if (req.readyState === 4 && req.status === 200 && result.code === 'ok') {
            const list = result.data.message
            console.log('list', list);
            globalResult = list
            isChecking = false
            globalHint.close()
            globalHint = Qmsg.success("获取数据成功，等待处理", {autoClose: false, onClose: () => {  }});
            listHandle()
          }
        },
        onerror: function(response){
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
  if (urlIncludes(homeList, location.pathname)) {
    let avDetailBox = document.querySelector(".movie-list")
    let avDetailBoxChildren = avDetailBox.children;
    for (let i = 0; i < avDetailBoxChildren.length; i++) {
      let x = avDetailBoxChildren[i].querySelector(".video-title").innerText.match(numberExtraction)[0];
      x = x.toUpperCase()
      avDetailBoxChildren[i].querySelector(".video-title").setAttribute('checked', globalResult[x] || '0')
      if (globalResult[x] && globalResult[x] !== '0') {
        avDetailBoxChildren[i].querySelector(".video-title").setAttribute('exits', '1')
      }
    }
    globalHint.close()
    globalHint = Qmsg.success("列表数据 - 处理完成", {autoClose: true, onClose: () => {  }});
  }
  if (location.pathname.indexOf('/v/') !== -1) {
    let avDetailBox = document.querySelectorAll(".tile-images.tile-small")
    for (let k = 0; k < avDetailBox.length; k++) {
      let avDetailBoxChildren = avDetailBox[k].children;
      for (let i = 0; i < avDetailBoxChildren.length; i++) {
        let x = avDetailBoxChildren[i].innerText.match(numberExtraction)[0]
        x = x.toUpperCase()
        avDetailBoxChildren[i].querySelector(".video-number").setAttribute('checked', globalResult[x] || '0')
        if (globalResult[x] && globalResult[x] !== '0') {
          avDetailBoxChildren[i].querySelector(".video-number").setAttribute('exits', '1')
        }
      }
    }
    let t = document.querySelector(".video-meta-panel").querySelector(".movie-panel-info .panel-block").innerText.match(numberExtraction);
    t = t ? t[0] : "";
    if (t != "") {
      t = t.toUpperCase()
      document.querySelector(".video-meta-panel").querySelector(".movie-panel-info .panel-block .value").setAttribute('checked', globalResult[t]);
    }
    globalHint.close()
    globalHint = Qmsg.success("详情页数据 - 处理完成", {autoClose: true, onClose: () => {  }});
  }
  isHandle = true
}


// 详情页
function detailPageListHandle() {
  let t = document.querySelector(".video-meta-panel").querySelector(".movie-panel-info .panel-block").innerText.match(numberExtraction);
  t = t ? t[0] : "";
  let checkList = []
  if (t !== '') {
    t = t.toUpperCase()
    checkList.push(t)
  }
  let avDetailBox = document.querySelectorAll(".tile-images.tile-small")
  
  for (let k = 0; k < avDetailBox.length; k++) {
    let avDetailBoxChildren = avDetailBox[k].children;
    for (let i = 0; i < avDetailBoxChildren.length; i++) {
      let x = avDetailBoxChildren[i].innerText.match(numberExtraction)[0]
      x = x.toUpperCase()
      checkList.push(x)
    }
  }
  console.log('checkList', checkList);
  checkDesignationHandle(checkList)
}

// 详情页种子
function magnetsHandle() {
  if (!document.querySelector('#magnets-content').getAttribute('check')) {
    let child = document.querySelector('#magnets-content').querySelectorAll('.columns.item')
    for (let i = 0; i < child.length; i++) {
      let btn = document.createElement('div') 
      btn.className = 'js-custom-btn-magnets'
      btn.innerText = 'Go'
      btn.style.width = '60px'
      btn.style.height = '30px'
      btn.style.fontSize = '16px'
      btn.style.textAlign = 'center'
      btn.style.lineHeight = '30px'
      btn.style.backgroundColor = 'rgb(25, 137, 250)'
      btn.style.borderRadius = '2px'
      btn.style.cursor = 'pointer'
      btn.style.color = '#fff'
      btn.addEventListener('click', () => {
        Qmsg.success("okk", {autoClose: true});
        let text = child[i].querySelector('.copy-to-clipboard').getAttribute('data-clipboard-text')
        if (text) {
          // Qmsg.success(text, {autoClose: false});
          GM_xmlhttpRequest({
            method: "get",
            url: "https://chiens.cn/getText/oabyy",
            data: '',
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function(req){
              // console.log('dd', req)
              const result = JSON.parse(req.response)
              if (req.readyState === 4 && req.status === 200 && result.code === 'ok') {
                // console.log('okk', result.data)
                GM_xmlhttpRequest({
                  method: "post",
                  url: "https://chiens.cn/getText/write?id=oabyy",
                  data: `data=(${encodeURIComponent(result.data)})\n${encodeURIComponent(text)})`,
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  onload: function(req2){
                    console.log('dd', req2)
                    // Qmsg.success("即将拷贝成功", {autoClose: true});
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

      })
      let box = document.createElement('div') 
      box.className = 'buttons column'
      box.appendChild(btn)
      child[i].appendChild(box)
    }

    document.querySelector('#magnets-content').setAttribute('check', '1')
  }
}

if (document.querySelector(".moj-content")) {
  $(".moj-content")[0].remove()
}

if ($(".video-meta-panel").length <= 0) return
let list = $(".video-panel .tile-small .tile-item");
if ($(".preview-video-container") && $("#preview-video")) {
  $(".preview-video-container").hide()
  $(".preview-video-container").parent().css("display", "block")
  if ($("#preview-video source").attr("src") != "") {
    $("#preview-video").css({"display": "block", "width": "100%"})
    if ($("#preview-video")[0]) {
      $("#preview-video")[0].play()
    }
  }
}