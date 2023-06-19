// ==UserScript==
// @name         swagger ui 复制标题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  copy swagger ui title.
// @author       actions.win
// @match        https://petstore.swagger.io/*
// @match        *://*/swagger*
// @icon         https://petstore.swagger.io/favicon-32x32.png
// @grant        none
// ==/UserScript==

;(function () {
  'use strict'
  function handleClick(e) {
    e.stopPropagation()
    var text = e.target.dataset.path || e.target.innerText
    var copyDom = document.createElement('textarea')
    copyDom.setAttribute('readonly', 'readonly')
    copyDom.style.position = 'absolute'
    copyDom.style.left = '-9999px'
    copyDom.value = text
    document.body.appendChild(copyDom)
    copyDom.select()
    document.execCommand('copy')
    copyDom.remove()
  }

  function start() {
    setTimeout(() => {
      var els = Array.from(
        document.querySelectorAll('.opblock-summary-description')
      )
      var paths = Array.from(document.querySelectorAll('.opblock-summary-path'))
      els.forEach((el) => {
        el.style.marginRight = 'auto'
        el.style.maxWidth = 'max-content'
        el.style.cursor = 'copy'
        el.addEventListener('click', handleClick)
      })
      paths.forEach((el) => {
        var a = el.querySelector('a')
        a.style.cursor = 'copy'
        el.addEventListener('click', handleClick)
      })
    }, 500)
  }

  start()
  setTimeout(() => {
    var select = document.querySelector('.topbar #select')
    select && select.addEventListener('change', start)
  }, 500)
})()
