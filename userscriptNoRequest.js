// ==UserScript==
// @name         JSummer - 草榴（GET请求版）
// @namespace    http://tampermonkey.net/
// @version      1.15
// @description  try to take over the world!
// @author       You
// @match        https://*.t66y.com/*
// @match        https://t66y.com/*
// @resource customCSS https://chiens.cn/recordApi/message.css
// @resource source https://chiens.cn/recordApi/log.json
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://chiens.cn/recordApi/userscriptNoRequest.js
// @updateURL https://chiens.cn/recordApi/userscriptNoRequest.js
// ==/UserScript==

let messageScript = document.createElement('script');
messageScript.type = 'text/javascript';
messageScript.src = `https://chiens.cn/recordApi/message.min.js`;
document.body.appendChild(messageScript);

messageScript.onload = function() {

}

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
sheet.addRule('a:visited', 'color: #b58226 !important;');
sheet.addRule('a[checked]', 'color: #b58226 !important;');
sheet.addRule('#main a', 'font-size: 14px;font-weight: 800;');
sheet.addRule('#tbody .tal a[local]', 'color: #9126b5 !important;');
sheet.addRule('#tbody .tr3 a[btn]', 'padding: 6px 14px;color: #3c3c3c !important;');

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
                    if (this.getAttribute('checked')) {

                    } else {
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

window.onload = function () {
    
    let tbody = document.getElementById('tbody')

    if (!tbody && location.pathname.indexOf('htm_mob') === -1) {
        tbody = document.querySelector('#main .t tbody')
    }

    console.log('tbody', tbody);
    if (tbody || location.pathname.indexOf('thread0806') !== -1) {

        // let tr2_td = document.createElement('td')
        // tr2_td.style.width = '100px'
        // tr2_td.innerText = '操作'
        // document.querySelector('#ajaxtable .tr2').appendChild(tr2_td)

        

        if (window.isLoading) return
        window.isLoading = true
        
        window.globalHint = Qmsg.info("正在处理文件", {autoClose: false});

        let t66y = GM_getResourceText("source")
        if (t66y) {
          t66y = JSON.parse(t66y)
        }
        codeList = t66y || []
        listHandle()

        // GM_xmlhttpRequest({
        //     method: "post",
        //     url: "https://chiens.cn/recordApi/getLog",
        //     headers: {
        //         "Content-Type": "application/x-www-form-urlencoded"
        //     },

        //     onload: function(req){

        //         const result = JSON.parse(req.response)
        //         if (req.readyState === 4 && req.status === 200 && result.code === 'ok') {
        //             const list = result.data.message === '' ? result.data.message : JSON.parse(result.data.message)
        //             codeList = list || []
        //             console.log('ddsss', list)
        //             window.globalHint.close()
        //             window.globalHint = Qmsg.success("请求成功，等待页面加载完成", {autoClose: false, onClose: () => {  }});
                    
        //             listHandle()
        //         }
        //     },
        //     onerror: function(response){
        //         window.globalHint.close()
        //         Qmsg.error("请求失败", {autoClose: true });
        //     }
        // });




//         let child = document.querySelector('#tbody').querySelectorAll('.t_one')
//         //console.log('---', child)
//         for (let i = 0; i < child.length; i++) {
//             let item = child[i].querySelector('.tal a[id]')



// //             item.parentElement.addEventListener('click', function(){
// //                 console.log('123', this)
// //            }, false)

//             //console.log('a', item.parentElement)

//             let td = `<td><a href="${item.getAttribute('href') + '?traceless=1'}" target="_blank" btn="1">无痕</a></td>`
//             let line = child[i].innerHTML
//             child[i].innerHTML = line += td

//             child[i].querySelector('.tal a[id]>div') ? child[i].querySelector('.tal a[id]>div').style.width = '790px' : null
//             child[i].querySelector('.tal').style.whiteSpace = 'normal'
//             child[i].querySelector('.tal .subleft') ? child[i].querySelector('.tal .subleft').style.whiteSpace = 'normal' : null

//             let urls = localStorage.getItem('urls')
//             if (urls === null) {
//                 urls = []
//             } else {
//                 urls = JSON.parse(urls)
//             }
//             if (urls.includes(item.pathname)) {
//                 item.setAttribute('local', '1')
//             }
//             item.onclick = function () {
//                 item.setAttribute('local', '1')
//                 // item.style.color = '#9126b5 !important'
//                 let urls = localStorage.getItem('urls')
//                 if (urls === null) {
//                     urls = []
//                 } else {
//                     urls = JSON.parse(urls)
//                 }
//                 console.log('duuds', urls)
//                 if (item.pathname.includes('htm_data')) {
//                     if (!urls.includes(item.pathname)) {
//                         urls.push(item.pathname)
//                     }
//                 } else {
//                     let text = item.pathname.slice(1).match(/\d+/)[0]
//                     let url = `/htm_data/${new Date().getFullYear().toString().slice(2)}${new Date().getMonth() + 1}/${item.baseURI.match(/\??=\d+/)[0].slice(1)}/${text}.html`
//                     if (!urls.includes(url)) {
//                         urls.push(url)
//                     }
//                 }
//                 console.log('duuds1232323', urls)
//                 localStorage.setItem('urls', JSON.stringify(urls))
//             }
//         }
    } else {
       
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



    // console.log('codeList', codeList)

    // console.log('11', document.getElementById('tbody').getElementsByClassName('tal')[0].children[0])

    //             document.getElementById('tbody').getElementsByClassName('tal')[0].getElementsByTagName('a')[0].addEventListener('click', function(){
    //                 console.log('123', this)
    //             })
}

// if (document.querySelector('#ajaxtable')) {
//     document.querySelector('#ajaxtable').querySelector('.tr2 td[title="以“最後發表”顺序排列"]').style.width = '135px'
// }