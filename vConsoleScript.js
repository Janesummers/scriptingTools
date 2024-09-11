// ==UserScript==
// @name         JSummer - vConsole
// @name:cn      vConsole
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  【使用前先看介绍/有问题可反馈】手机浏览器控制台 (vConsole)：在移动端手机浏览器中插入 vConsole 从而调用控制台，使用 via 浏览器进入该页面可添加脚本
// @author       You
// @grant        GM_addStyle
// @match        https://*.t66y.com/*
// @match        https://t66y.com/*
// @match        http://wcsntz.swj.wuch.gov.cn:9987/*
// @match        http://10.12.120.11:8080/#/*
// @match        https://*.txh049.com/*
// @match        https://txh049.com/*
// @match        https://javdb.com/*
// @downloadURL  https://chiens.cn/recordApi/vConsoleScript.js
// @updateURL    https://chiens.cn/recordApi/vConsoleScript.js
// ==/UserScript==

/* globals GM_addStyle */

GM_addStyle(`
.icon-locate {
  bottom: 130px !important;
}
`)

let script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://chiens.cn/recordApi/vconsole.min.js';
document.body.appendChild(script);
script = document.createElement('script');
script.type = 'text/javascript';
script.innerHTML =
    `
        (function wait() {
            try {
                var vc = new VConsole();
                console.log('vConsole has been created.');
            } catch {
                setTimeout(wait, 50);
            };
        })();
    `;
document.body.appendChild(script);