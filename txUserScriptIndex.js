// ==UserScript==
// @name         JSummer - 糖心
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.txh041.com/*
// @match        https://txh041.com/*
// ==/UserScript==

sessionStorage.setItem('dialogAd', 'sonofbitch');
sessionStorage.setItem('noticeDialog', 'sonofbitch');
sessionStorage.setItem('splashAd', 'sonofbitch');

var style = document.createElement('style');
let sheet = style.sheet;
if (sheet.insertRule) {
  sheet.insertRule(`
    input {
      color: #6c6c6c !important;
    }
  `);
} else {
  sheet.addRule('input', 'color: #6c6c6c !important;'); 
}

// document.querySelectorAll('.video-items')
// video-item