// ==UserScript==
// @name         JSummer - 草榴
// @namespace    http://tampermonkey.net/
// @version      1.34
// @description  try to take over the world!
// @author       You
// @match        https://*.t66y.com/*
// @match        https://t66y.com/*
// @match        *://cl.6387x.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=t66y.com
// @resource     customCSS https://chiens.cn/recordApi/message.css
// @require      https://chiens.cn/recordApi/message.min.js
// @require      https://chiens.cn/recordApi/jquery-1.12.4.min.js
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

// “加亮今日帖子”、“移除viidii跳转”、“图片自动缩放”、“种子链接转磁力链”、“预览整页图片”、“游客站内搜索”、“返回顶部”等功能！
;(function() {
    'use strict';

    var helper = {
        addCss: function(css) {
          var style = document.createElement('style');
          style.type = 'text/css';
          style.appendChild(document.createTextNode(css));
          document.getElementsByTagName('head')[0].appendChild(style);
        },
        addScript: function(js) {
          var script = document.createElement('script');
          script.type = 'text/javascript';
          script.appendChild(document.createTextNode(js));
          document.body.appendChild(script);
        },
        getCss: function(src) {
          var link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = src;
          document.getElementsByTagName('head')[0].appendChild(link);
        },
        getScript: function(src, onload) {
          var script = document.createElement('script');
          script.type = 'text/javascript';
          script.onload = onload;
          script.src = src;
          document.body.appendChild(script);
        },
        timeFormat: function(data, format) { // eg:data=new Data() eg:format="yyyy-MM-dd hh:mm:ss";
          var o = {
            'M+': data.getMonth() + 1,
            'd+': data.getDate(),
            'h+': data.getHours(),
            'm+': data.getMinutes(),
            's+': data.getSeconds(),
            'q+': Math.floor((data.getMonth() + 3) / 3),
            'S': data.getMilliseconds()
          };
          if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (data.getFullYear() + '').substr(4 - RegExp.$1.length));
          }
          for (var k in o) {
            if (new RegExp('(' + k + ')').test(format)) {
              format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
            }
          }
          return format;
        },
        hash: function(url) {
          var hash = url.split('hash=');
          return hash[1].substring(3);
        },
        inurl: function(str) {
          var url = document.location.href;
          return url.indexOf(str) >= 0;
        }
    };

    /*-------------------------------------------------------------------------------------------------------------------------------------------*/

    var t66y = function() {
      if (helper.inurl('/thread')) {
        // 高亮今天发表的帖子
        helper.addCss('.newTag{border-bottom:1px dotted red; color:red !important}.newPost{color:#ff5722; background:#fafff4;}.newPost a[target=_blank]{color:#5656ff;}');
        var today = new Date();
        today = helper.timeFormat(today, 'yyyy-MM-dd');
        $('tr.tr3').each(function() {
          var isToday = $(this).children('td').eq(2).find('div.f10').text();
          if (isToday === today) {
            $(this).find('td:first').children().html('NEW').addClass('newTag');
            $(this).addClass('newPost');
          }
        });
      }

      /*-------------------------------------------------------------------------------------------------------------------------------------------*/

      if (helper.inurl('/htm_data/')) {
        // 移除图片viidii跳转 & 图片自动缩放
        var imgList = new Array(0);
        var maxWidth = parseInt($("div#main").width() - 200) + 'px';
        $('img,input[type=image]').each(function() {
            if (typeof($(this).attr('onclick')) != "undefined") {
              $(this).attr('onclick', 'window.open(this.src);').css('max-width', maxWidth);
              imgList.push($(this).attr('src'));
            }
        });

        // 移除a标签viidii跳转
        $("a[href*=\'.viidii.\']").each(function() {
          var href = $(this).attr('href');
          var newHref = href.replace('http://www.viidii.com/?', '').replace('http://www.viidii.info/?', '').replace(/______/g, '.').replace(/&z/g, '');
          $(this).attr('href', newHref);
        });

        // 种子链接转磁力链
        var torLink = $("a[href*=\'?hash\=\']");
        if( torLink.length > 0 ){
          var tmpNode = '<summary>本页共有 ' + torLink.length + ' 个磁力链！<a id="magnet" target="_blank" href="magnet:?xt=urn:btih:' + helper.hash(torLink[0].href) + '">磁力下载</a></summary>';
          torLink.each(function() {
            var torrent = $(this).attr('href');
            var hash = helper.hash(torrent);
            var magnet = 'magnet:?xt=urn:btih:' + hash;
            tmpNode += '<p><a target="_blank" href="' + magnet + '">【 磁力链:　' + magnet + ' 】</a></p>';
          });
          $('body').append('<div id="jsummer-top-info" style="position:fixed;top:0px;background:#def7d4;width:100%;padding:4px;text-align:center;"><details>' + tmpNode + '</details></div>');

          setTimeout(() => {
            let btn = document.createElement('span') 
            btn.className = 'js-custom-btn-magnets'
            btn.innerText = '【Go】'
            btn.style.width = '60px'
            btn.style.height = '30px'
            btn.style.fontSize = '16px'
            btn.style.textAlign = 'center'
            btn.style.lineHeight = '30px'
            btn.style.borderRadius = '2px'
            btn.style.cursor = 'pointer'
            btn.style.color = '#2f5fa1'
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

            let box = document.querySelector("#jsummer-top-info summary")
            box.appendChild(btn)



          }, 800);
        }

        if (imgList.length > 0) {
          ImageView(imgList);
        }
      }

      /*-------------------------------------------------------------------------------------------------------------------------------------------*/

      // 预处理整页图片
      function ImageView(imgList) {
        // helper.getCss('//cdn.jsdelivr.net/lightgallery/1.3.7/css/lightgallery.min.css');
        // helper.getScript('//cdn.jsdelivr.net/picturefill/2.3.1/picturefill.min.js');
        // helper.getScript('//cdn.jsdelivr.net/lightgallery/1.3.7/js/lightgallery.min.js');
        // helper.getScript('//cdn.jsdelivr.net/g/lg-fullscreen,lg-thumbnail,lg-autoplay,lg-zoom');
        // helper.getScript('//cdn.jsdelivr.net/mousewheel/3.1.13/jquery.mousewheel.min.js');

        helper.getCss('https://chiens.cn/recordApi/lightgallery-1.3.7.min.css');
        helper.getScript('https://chiens.cn/recordApi/picturefill-2.3.1.min.js');
        helper.getScript('https://chiens.cn/recordApi/lightgallery-1.3.7.min.js');
        helper.getScript('https://chiens.cn/recordApi/lg-fullscreen,lg-thumbnail,lg-autoplay,lg-zoom.js');
        helper.getScript('https://chiens.cn/recordApi/jquery.mousewheel-3.1.13.min.js');

        helper.addCss('#viewer{max-width:1280px;margin:auto;display:none}#viewer > ul{margin-bottom:0;padding:0}#viewer > ul > li{float:left;margin-bottom:15px;margin-right:15px;width:240px;list-style-type:none}#viewer > ul > li a{border:3px solid #FFF;border-radius:3px;display:block;overflow:hidden;position:relative;float:left}#viewer > ul > li a > img{transition:transform .3s ease 0s;transform:scale3d(1, 1, 1);height:200px;width:240px}#viewer > ul > li a:hover > img{transform:scale3d(1.1, 1.1, 1.1);opacity:.9}');
        $('div#main').before('<div id="viewer"><ul id="lightgallery" class="list-unstyled row"></ul></div>');

        var lightGallery = $('#lightgallery');
        $.each(imgList, function(i, n) {
          i++;
          lightGallery.append('<li data-src="' + n + '" data-sub-html="<h4>Image' + i + '</h4><p>' + n + '</p>"><a href=""><img class="img-responsive" src="' + n + '"></a></li>');
        });

        helper.addCss('.viewer{position:fixed; top:7px; right:7px; cursor:pointer;}');
        helper.addScript('function Viewer(){ $("#lightgallery").lightGallery(); $("div#viewer,div#main,div#footer").fadeToggle(300); }');
        $('body').append('<img src="https://chiens.cn/recordApi/icon/preview-icon.png" class="viewer" onclick="Viewer()" title="预览整页图片">');
      }

      /*-------------------------------------------------------------------------------------------------------------------------------------------*/

      // 返回顶部
      $('body').append('<img src="https://chiens.cn/recordApi/icon/return-top.png" onclick="$(body).animate({scrollTop:0},300);" style="position:fixed; bottom:20px; right:10px; cursor:pointer;}" title="返回顶部">');

      /*-------------------------------------------------------------------------------------------------------------------------------------------*/

      // 游客站内搜索
      $(function() {
        helper.addScript('(function(){var cx = "017632740523370213667:kcbl-j-fmok";var gcse = document.createElement("script");gcse.type = "text/javascript";gcse.async = true;gcse.src = "https://cse.google.com/cse.js?cx=" + cx;var s = document.getElementsByTagName("script")[0];s.parentNode.insertBefore(gcse, s);})();');
        helper.addCss('.gsrch{width:400px;float:right;margin:15px -25px 0 0;}.gsc-control-cse {background-color:#0f7884 !important;border:0 !important;padding:0 !important;}');
        $('.banner').append('<div class="gsrch"><gcse:search></gcse:search></div>');
      });
    };

    /*-------------------------------------------------------------------------------------------------------------------------------------------*/

    helper.getScript('https://chiens.cn/recordApi/jquery-1.12.4.min.js', t66y);

})();