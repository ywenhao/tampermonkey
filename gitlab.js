// ==UserScript==
// @name         gitlab修正clone地址
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  gitlab修正clone地址
// @author       actions.win
// @match        http://192.168.2.253/*
// @match        http://gitlab.test.com/*
// @icon         https://i.vimeocdn.com/portrait/72670399_60x60?subrect=69%2C60%2C307%2C298&r=cover
// @grant        none
// ==/UserScript==

;(function () {
  'use strict'
  var sshInput = document.querySelector('input#ssh_project_clone')
  if (!sshInput) return
  var value = sshInput.value.replace('com:', 'com:2223/')
  sshInput.value = `ssh://${value}`
})()
