// ==UserScript==
// @name         JSummer - 草榴
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.t66y.com/*
// @match        https://t66y.com/*
// @match        *://cl.6387x.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=t66y.com
// @resource customCSS https://chiens.cn/recordApi/message.css
// @require      https://chiens.cn/recordApi/message.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==
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
sheet.addRule('a:visited', 'color: #b58226 !important;');
sheet.addRule('a[checked]', 'color: #b58226 !important;');
sheet.addRule('#main a', 'font-size: 14px;font-weight: 800;');
sheet.addRule('#tbody .tal a[local]', 'color: #9126b5 !important;');
sheet.addRule('#tbody .tr3 a[btn]', 'padding: 6px 14px;color: #3c3c3c !important;');

console.log('等待脚本执行');

let codeList = []
let globalHint = null
let isRecord = false
let isLoading = false

if (location.pathname.indexOf('htm_data') !== -1 || location.pathname.indexOf('htm_data') !== -1) {

    if (isRecord) return
    isRecord = true

    const hint = Qmsg.info("正在发请求", {autoClose: false});

    let code = location.pathname.match(/(\d{5,})/)
    if (code) {
        code = code[0]
        console.log('发请求')
        GM_xmlhttpRequest({
            method: "post",
            url: "https://chiens.cn/recordApi/log",
            data: `code=${code}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },

            onload: function(req){
                console.log('dd', req)
                const result = JSON.parse(req.response)
                if (req.readyState === 4 && req.status === 200 && result.code === 'ok') {
                    console.log("记录成功");
                    //hint.close()
                    Qmsg.success("成功记录", {autoClose: true, onClose: () => { hint.close() }});
                    isRecord = false
                }
            },
            onerror: function(response){
               Qmsg.error("请求失败", {autoClose: true });
            }
        });
    }
}

function listHandle() {
    let tbody = document.querySelector('#tbody')
    if (!tbody) {
        tbody = document.querySelector('#main .t tbody')
    }
    let child = tbody.querySelectorAll('.t_one')
    for (let i = 0; i < child.length; i++) {
        let item = child[i].querySelector('.tal a[id]')
        if (!item) {
            item = child[i].querySelector('th a')
        }
        // console.log('item', item.getAttribute('id'))
        item.addEventListener('click', function(){
            // console.log('123', this)
            if (this.getAttribute('checked')) {

            } else {
                this.setAttribute('checked','')
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
                item.setAttribute('checked','')
            }
        }
    }
    isLoading = false
    globalHint.close()
    globalHint = Qmsg.success("处理完成", {autoClose: true, onClose: () => {  }});
}

window.onload = function () {
    
    let tbody = document.getElementById('tbody')

    if (!tbody && location.pathname.indexOf('htm_mob') === -1) {
        tbody = document.querySelector('#main .t tbody')
    }

    console.log('tbody', tbody);
    if (tbody) {
        console.log('123232')

        // let tr2_td = document.createElement('td')
        // tr2_td.style.width = '100px'
        // tr2_td.innerText = '操作'
        // document.querySelector('#ajaxtable .tr2').appendChild(tr2_td)

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
            onerror: function(response){
                globalHint.close()
                Qmsg.error("请求失败", {autoClose: true });
            }
        });




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



    // console.log('codeList', codeList)

    // console.log('11', document.getElementById('tbody').getElementsByClassName('tal')[0].children[0])

    //             document.getElementById('tbody').getElementsByClassName('tal')[0].getElementsByTagName('a')[0].addEventListener('click', function(){
    //                 console.log('123', this)
    //             })
}

if (document.querySelector('#ajaxtable')) {
    document.querySelector('#ajaxtable').querySelector('.tr2 td[title="以“最後發表”顺序排列"]').style.width = '135px'
}