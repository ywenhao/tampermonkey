// ==UserScript==
// @name         swagger ui 一键生成api
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  swagger ui generate api.
// @author       actions.win
// @match        https://petstore.swagger.io/*
// @match        *://*/swagger*
// @icon         https://petstore.swagger.io/favicon-32x32.png
// @grant        none
// ==/UserScript==

;(function () {
  'use strict'

  // 生成api
  function generateApi(el) {
    var tag = el.querySelector('.opblock-tag')
    var apiDoms = Array.from(el.querySelectorAll('.opblock'))
    // 过滤弃用的api
    apiDoms = apiDoms.filter(
      (apiDom) => !apiDom.classList.contains('opblock-deprecated')
    )
    var text = ''
    var docTitle = tag.querySelector('p').innerText
    text += `/**\n * @description: ${docTitle}\n */\n\n`
    apiDoms.forEach((apiDom) => {
      var pathDom = apiDom.querySelector('.opblock-summary-path')
      var methodDom = apiDom.querySelector('.opblock-summary-method')
      var apiTitleDom = apiDom.querySelector('.opblock-summary-description')
      var path = pathDom.dataset.path
      var apiTitle = apiTitleDom.innerText
      var method = methodDom.innerText.toLowerCase()
      text += `/** ${apiTitle} */\n`
      var params = method === 'get' ? 'params' : 'data'
      var path2 = path.replace(
        /\{(.*)\}/,
        ($1, $2) => '${' + `${params + '.' + $2}` + '}'
      )
      var functionName = generateFunctionName(method, path, apiTitle)
      text += `export const ${functionName}: CommonAPI<'${path}', '${method}'> = (${params}) => defHttp.${method}(\`${path2}\`, { ${params} })\n\n`
    })
    return text
  }

  // 生成函数名
  function generateFunctionName(method, path, apiTitle) {
    var name = ''
    name += method
    var titles = path
      .split('/')
      .filter((item) => item && !item.includes('{'))
      .map((str) => str.replace(str[0], str[0].toUpperCase()))
    name += titles.join('')
    if (apiTitle.includes('列表')) name += 'List'
    if (apiTitle.includes('详情') || apiTitle.includes('详细信息'))
      name += 'Detail'
    if (apiTitle.includes('批量') || path.includes('batch')) name += 'Batch'
    if (path.includes('{') && path.includes('id')) name += 'ById'
    name += 'Api'
    return name
  }

  function handleClick(el) {
    var text = generateApi(el)
    var copyDom = document.createElement('textarea')
    copyDom.setAttribute('readonly', 'readonly')
    copyDom.style.position = 'absolute'
    copyDom.style.left = '-9999px'
    copyDom.value = text
    document.body.appendChild(copyDom)
    copyDom.select()
    document.execCommand('copy')
    copyDom.remove()
    alert('复制成功')
  }

  // 生成api按钮
  function generateApiBtn(doms) {
    doms.forEach((el) => {
      var tag = el.querySelector('.opblock-tag')
      tag.style.position = 'relative'
      var button = document.createElement('button')
      button.classList.add('btn')
      button.style.position = 'absolute'
      button.style.right = '400px'
      button.style.top = '50%'
      button.style.transform = 'translateY(-50%)'
      button.innerText = '生成api'
      tag.appendChild(button)
      button.addEventListener('click', (e) => {
        e.stopPropagation()
        handleClick(el)
      })
    })
  }

  setTimeout(() => {
    var opblocksDoms = Array.from(
      document.querySelectorAll('.opblock-tag-section')
    )
    generateApiBtn(opblocksDoms)
  }, 500)
})()
