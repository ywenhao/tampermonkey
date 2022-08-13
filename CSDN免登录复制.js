// ==UserScript==
// @name         CSDN免登录复制
// @version      0.1
// @description  CSDN免登录复制页码代码
// @author       actions.win
// @match        https://blog.csdn.net/*/article/details/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll('code').forEach(v => {
        v.contentEditable = true
    })
})();
