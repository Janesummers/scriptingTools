// ==UserScript==
// @name         JSummer - JavDB
// @namespace    http://tampermonkey.net/
// @version      2.72
// @description  try to take over the world!
// @author       You
// @match        https://javdb.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=javdb.com
// @resource customCSS https://chiens.cn/recordApi/css/message.css
// @require      https://chiens.cn/recordApi/js/message.min.js
// @require      https://chiens.cn/recordApi/js/jquery-3.1.1.min.js
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
.movie-list .item > a > div.meta {
  color: #d83030 !important;
  font-size: 1rem !important;
  font-weight: bold;
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
.video-title[checked='8']::before,
.video-number[checked='8']::before,
.movie-panel-info .panel-block .value[checked='8']::before {
  content: '[PikPak]';
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
.record-code {
  cursor: pointer;
  margin-left: 20px;
}
.record-jav {
  cursor: pointer;
  margin-left: 20px;
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
  8：PikPak
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
  Qmsg.success(`页面回来ok-${string}`, {autoClose: true });
  if (string === 'visible') {   // 当页面由隐藏至显示时
    Qmsg.success("重新显示页面", {autoClose: true }); 
    setTimeout(() => {
      if (urlIncludes(homeList, location.pathname)) {
        if (isHandle) return
        Qmsg.success("首页", {autoClose: true });
        homePageListHandle()
      }
      if (location.pathname.indexOf('/v/') !== -1 && !document.querySelector(".video-meta-panel").querySelector(".movie-panel-info .panel-block .value[checked]")) {
        Qmsg.success("详情页面", {autoClose: true });
        detailPageListHandle()
        magnetsHandle()
      }
    })
  }
});

if (document.body.clientWidth >= 1080) {
  document.documentElement.style.zoom = '1.4'
}

window.onload = () => {
  Qmsg.success(`页面加载ok-${document.visibilityState}`, {autoClose: true });
  if (document.visibilityState === 'visible') {
    Qmsg.success("加载完成", {autoClose: true });
    setTimeout(() => {
      if (urlIncludes(homeList, location.pathname)) {
        Qmsg.success("首页", {autoClose: true });
        homePageListHandle()
      }
      if (location.pathname.indexOf('/v/') !== -1 && !document.querySelector(".video-meta-panel").querySelector(".movie-panel-info .panel-block .value[checked]")) {
        Qmsg.success("详情页面", {autoClose: true });
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
  checkRecordHandle()
  let checkList = []
  for (let i = 0; i < avDetailBoxChildren.length; i++) {
      let x = avDetailBoxChildren[i].querySelector(".video-title").innerText.match(numberExtraction)[0];
      x = x.toUpperCase()
      avDetailBoxChildren[i].querySelector(".video-title").style.whiteSpace = 'normal'
      checkList.push(x)
  }
  checkDesignationHandle(checkList)
}

function checkRecordHandle() {
  let text = ''
  let textList = []
  let target = null
  let parent = null
  let code = ''
  let pathname = location.pathname.split('/').filter(item => item)
  let type = pathname[0]
  switch (type) {
    case 'series':
      if (document.querySelector('.section-name')) {
        target = document.querySelector('.section-name')
      }
      if (document.querySelector('.section-title .title')) {
        parent = document.querySelector('.section-title .title')
      }
      break;
    case 'actors':
      if (document.querySelector('.actor-section-name')) {
        target = document.querySelector('.actor-section-name')
      }
      if (document.querySelector('.section-title .title')) {
        parent = document.querySelector('.section-title .title')
      }
      break;
    case 'directors':
      if (document.querySelector('.section-name')) {
        target = document.querySelector('.section-name')
      }
      if (document.querySelector('.section-title .title')) {
        parent = document.querySelector('.section-title .title')
      }
      break;
    case 'video_codes':
      if (document.querySelector('.section-name')) {
        target = document.querySelector('.section-name')
      }
      if (document.querySelector('.section-title .title')) {
        parent = document.querySelector('.section-title .title')
      }
      break;
    case 'makers':
      if (document.querySelector('.section-name')) {
        target = document.querySelector('.section-name')
      }
      if (document.querySelector('.section-title .title')) {
        parent = document.querySelector('.section-title .title')
      }
      break;
    case 'publishers':
      if (document.querySelector('.section-name')) {
        target = document.querySelector('.section-name')
      }
      if (document.querySelector('.section-title')) {
        parent = document.querySelector('.section-title')
      }
      break;
    case 'search':
      if (document.querySelector('.section-title')) {
        parent = document.querySelector('.section-title')
      }
      break;
    case 'tags':
      if (document.querySelectorAll('div.tag.is-info')) {
        parent = document.querySelectorAll('div.tag.is-info')
      }
      break;
      

  
      
    default:
      break;
  }
  let data = ''
  if (parent) {
    switch (type) {
      case 'search':
        text = new URLSearchParams(location.search).get('q')
        code = new URLSearchParams(location.search).get('q')
        data = `type=${type}&code=${code}&title=${text}&params=${encodeURIComponent(location.search)}`
        break;
      case 'tags':
        textList = []
        for (let i = 0; i < parent.length; i++) {
          if (!['含磁鏈', '含字幕'].includes(parent[i].innerText)) {
            textList.push(parent[i].innerText)
          }
        }
        text = textList.join('、')
        code = encodeURIComponent(location.search)
        data = `type=${type}&code=${code}&title=${text}&params=${encodeURIComponent(location.search)}`
        break;
      default:
        if (target) {
          text = target.innerText
          code = pathname[1]
          data = `type=${type}&code=${code}&title=${text}`
        }
        break;
    }


    let btn = document.createElement('span')
    btn.className = 'record-jav'
    btn.innerText = '记录Jav'
    btn.addEventListener('click', () => {
      GM_xmlhttpRequest({
        method: "post",
        url: "https://chiens.cn/recordApi/javRecordLog",
        data,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },

        onload: function(req){
          console.log('jav-record', req)
          const result = JSON.parse(req.response)
          if (req.readyState === 4 && req.status === 200 && result.code === 'ok') {
            Qmsg.success("JAV记录成功", {autoClose: true});
          }
        },
        onerror: function(response){
          Qmsg.error("JAV记录失败", {autoClose: true });
        }
      })
    })
    parent.appendChild(btn)
  }
  
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

function listHandle() {
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
    if (t != "" && !document.querySelector(".video-meta-panel").querySelector(".movie-panel-info .panel-block .value[checked]")) {
      t = t.toUpperCase()
      document.querySelector(".video-meta-panel").querySelector(".movie-panel-info .panel-block .value").setAttribute('checked', globalResult[t]);
      if (['0', '2', '4', '6', '7', '8'].includes(globalResult[t])) {
        let btn = document.createElement('span')
        btn.className = 'record-code'
        btn.innerText = '记录'
        btn.addEventListener('click', () => {
          GM_xmlhttpRequest({
            method: "post",
            url: "https://chiens.cn/recordApi/updateDesignationLog",
            data: `code=${t}&type=1`,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },

            onload: function(req){
              console.log('dd', req)
              const result = JSON.parse(req.response)
              if (req.readyState === 4 && req.status === 200 && result.code === 'ok') {
                Qmsg.success("记录成功", {autoClose: true});
                document.querySelector(".video-meta-panel").querySelector(".movie-panel-info .panel-block .value").setAttribute('checked', '1');
              }
            },
            onerror: function(response){
              Qmsg.error("记录失败", {autoClose: true });
            }
          })
        })
        document.querySelector(".video-meta-panel").querySelector(".movie-panel-info .panel-block").appendChild(btn)
      }
      if (['0', '2', '4', '6', '7'].includes(globalResult[t])) {
        let btn = document.createElement('span')
        btn.className = 'record-code'
        btn.innerText = 'PikPak'
        btn.addEventListener('click', () => {
          Qmsg.success("record", {autoClose: true});
            GM_xmlhttpRequest({
              method: "post",
              url: "https://chiens.cn/recordApi/updateDesignationLog",
              data: `code=${t}&type=7`,
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              },

              onload: function(req){
                console.log('dd', req)
                const result = JSON.parse(req.response)
                if (req.readyState === 4 && req.status === 200 && result.code === 'ok') {
                  Qmsg.success("记录PikPak成功", {autoClose: true});
                  document.querySelector(".video-meta-panel").querySelector(".movie-panel-info .panel-block .value").setAttribute('checked', '8');
                }
              },
              onerror: function(response){
                Qmsg.error("记录PikPak失败", {autoClose: true });
              }
            })
          
        })
        document.querySelector(".video-meta-panel").querySelector(".movie-panel-info .panel-block").appendChild(btn)
      }
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
                let data = result.data
                if (data) {
                  data = `${encodeURIComponent(result.data)}\n(${encodeURIComponent(text)})`
                } else {
                  data = `(${encodeURIComponent(text)})`
                }
                GM_xmlhttpRequest({
                  method: "post",
                  url: "https://chiens.cn/getText/write?id=oabyy",
                  data: `data=${data}`,
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