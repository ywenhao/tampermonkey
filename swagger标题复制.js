// ==UserScript==
// @name         swagger ui 复制标题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  copy swagger ui title.
// @author       actions.win
// @match        https://petstore.swagger.io/*
// @match        http://*/swagger*
// @icon         https://petstore.swagger.io/favicon-32x32.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    function handleClick(e) {
        e.stopPropagation()
        var text = e.target.innerText;
        var copyDom = document.createElement('textarea');
        copyDom.setAttribute('readonly', 'readonly');
        copyDom.style.position = 'absolute';
        copyDom.style.left = '-9999px';
        copyDom.value = text;
        document.body.appendChild(copyDom);
        copyDom.select();
        document.execCommand('copy');
        copyDom.remove();
    }

    setTimeout(() => {
        var els = Array.from(document.querySelectorAll('.opblock-summary-description'));
        els.forEach(el => {
            el.style.marginRight = 'auto';
            el.style.maxWidth = 'max-content';
            el.style.cursor = 'copy';
            el.addEventListener('click', handleClick);
        })
    }, 500)
})();