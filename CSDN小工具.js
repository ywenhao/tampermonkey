// ==UserScript==
// @name         CSDN小工具
// @version      0.1
// @description  CSDN免登录复制页码代码，免关注展开文章
// @author       actions.win
// @match        https://blog.csdn.net/*/article/details/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// ==/UserScript==

(function() {
    'use strict';

    // 可复制启用
    document.querySelectorAll('code').forEach(v => {
        v.contentEditable = true
    })

    // 免关注展开
    var hide_article_box = document.querySelector('.hide-article-box');
    if (hide_article_box && hide_article_box.style.display !== 'none' ) {

        var article_content = document.getElementById("article_content");
        article_content.removeAttribute("style");

        var follow_text = document.querySelector('.follow-text');
        follow_text.parentElement.parentElement.removeChild(follow_text.parentElement);

        hide_article_box.parentElement.removeChild(hide_article_box);
    }

})();
