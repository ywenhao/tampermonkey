// ==UserScript==
// @name         swagger ui 一键生成api
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  swagger ui generate api.
// @author       actions.win
// @match        https://petstore.swagger.io/*
// @match        *://*/swagger-ui*
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
    var titleDom = tag.querySelector('p') || tag.querySelector('.nostyle span')
    var docTitle = titleDom.innerText
    text += `/**\n * @description: ${docTitle}\n */\n\n`
    apiDoms.forEach((apiDom) => {
      var pathDom = apiDom.querySelector('.opblock-summary-path')
      var methodDom = apiDom.querySelector('.opblock-summary-method')
      var apiTitleDom = apiDom.querySelector('.opblock-summary-description')
      var path = pathDom.dataset.path
      var apiTitle = apiTitleDom.innerText
      var method = methodDom.innerText.toLowerCase()
      text += `/** ${apiTitle} */\n`

      var isClose = !apiDom.classList.contains('is-open')
      var toggleButton = apiDom.querySelector('.opblock-summary-control')
      isClose && toggleButton.click()
      var paramsDom = apiDom.querySelector('.parameters')
      var paramsIsBody =
        paramsDom && !!paramsDom.querySelector('tr[data-param-in="body"]')
      isClose && toggleButton.click()

      var params = paramsIsBody ? 'data' : 'params'
      var path2 = path.replaceAll(
        /\{.+?\}/g,
        ($1) => '${' + `${params + '.' + $1.replace('{', '')}`
      )
      var functionName = generateFunctionName(method, path, apiTitle)
      text += `export const ${functionName}: CommonAPI<'${path}', '${method}'> = (${params}) => defHttp.${method}(\`${path2}\`, { ${params} })\n\n`
    })
    return text
  }

  // 生成函数名
  function generateFunctionName(method, path, apiTitle) {
    var name = ''
    if (
      ['新增', '新建', '增加', '创建', '添加'].some((v) => apiTitle.includes(v))
    )
      name += 'add'
    else if (
      method === 'put' ||
      ['修改', '更新', '切换', '更改', '编辑', '重设'].some((v) =>
        apiTitle.includes(v)
      )
    )
      name += 'update'
    else name += method
    var titles = path
      .split('/')
      .filter((item) => item && !item.includes('{') && !/^v\d+$/.test(item))
      .flatMap((v) => v.split('-'))
      .flatMap((v) => v.split('_'))
      .filter(Boolean)
      .map((str) => str.replace(str[0], str[0].toUpperCase()))
    name += titles.join('')
    var condition = apiTitle.includes('列表')
    if (condition && !name.includes('List')) name += 'List'

    condition =
      ['详情', '详细信息'].some((v) => apiTitle.includes(v)) ||
      /^获取.*信息$/.test(apiTitle)
    if (condition && !name.includes('Detail')) name += 'Detail'

    condition = apiTitle.includes('批量') || path.includes('batch')
    if (condition && !name.includes('Batch')) name += 'Batch'

    condition = path.includes('{') && path.includes('id')
    if (condition) name += 'ById'
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

  function start() {
    var opblocksDoms = Array.from(
      document.querySelectorAll('.opblock-tag-section')
    )
    generateApiBtn(opblocksDoms)
  }

  function init() {
    var observer = new MutationObserver((entities) => {
      if (!entities.length) return
      var entity = entities.at(-1)
      if (!entity.addedNodes.length) return
      var addedNode = entity.addedNodes[0]
      var loaded = !addedNode.classList.contains('loading-container')
      loaded && start()
    })

    var containerDom = document.querySelector('.swagger-container .swagger-ui')
    observer.observe(containerDom, { childList: true })
  }

  var rootDom = document.getElementById('swagger-ui')
  var getContainerDom = () =>
    rootDom.querySelector('.swagger-container.swagger-ui')
  if (getContainerDom()) {
    init()
  } else {
    var rootObserver = new MutationObserver((entities) => {
      if (!entities.length) return
      var containerDom = getContainerDom()
      if (!containerDom) return
      init()
      rootObserver.disconnect()
    })
    rootObserver.observe(rootDom, { childList: true })
  }
})()
