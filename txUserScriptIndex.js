// ==UserScript==
// @name         JSummer - 糖心
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        https://*.txh049.com/*
// @match        https://txh049.com/*
// @connect      *
// @downloadURL  https://chiens.cn/recordApi/txUserScriptIndex.js
// @updateURL    https://chiens.cn/recordApi/txUserScriptIndex.js
// ==/UserScript==

sessionStorage.setItem('dialogAd', 'sonofbitch');
sessionStorage.setItem('noticeDialog', 'sonofbitch');
sessionStorage.setItem('splashAd', 'sonofbitch');
sessionStorage.setItem('appAd', 'sonofbitch');

var style = document.createElement('style');
let sheet = style.sheet;
const cssList = [
  { label: 'input', value: 'color: #6c6c6c !important;' }
]
cssList.map(item => {
  if (sheet.insertRule) {
    sheet.insertRule(`${item.label} { ${item.value} }`);
  } else {
    sheet.addRule(`${item.label} { ${item.value} }`);
  }
})

// document.querySelectorAll('.video-items')
// video-item