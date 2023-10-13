// ==UserScript==
// @name         JSummer - 糖心
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.txh016.com/*
// @match        https://txh016.com/*
// ==/UserScript==
sessionStorage.setItem('dialogAd', 'sonofbitch');
sessionStorage.setItem('noticeDialog', 'sonofbitch');
sessionStorage.setItem('splashAd', 'sonofbitch');


let sheet = style.sheet;
sheet.addRule('input', 'color: #6c6c6c !important;');