/*
 * @Description:
 * @Author: Tsingwong
 * @Date: 2022-01-20 14:13:25
 * @LastEditors: Tsingwong
 * @LastEditTime: 2022-01-20 15:54:59
 */

window.utils = (function () {
  let listeners = {}

  let tinyevent = {
    on: function (eventName, cb) {
      if (!listeners[eventName]) {
        listeners[eventName] = []
      }
      listeners[eventName].push(cb)
    },
    off: function (eventName, cb) {
      if (!listeners[eventName]) {
        return
      }
      listeners[eventName] = listeners[eventName].filter((listener) => listener !== cb)
    },
    trigger: function (eventName, data) {
      if (!listeners[eventName]) {
        return
      }
      listeners[eventName].forEach((listener) => {
        listener(data)
      })
    },
  }

  let insertMsg = (ulId, text) => {
    let li = document.createElement("li")
    li.innerText = text
    document.getElementById(ulId).appendChild(li)
  }

  let fetchMsg = (url, conf = {}) => {
    let xhr = new XMLHttpRequest()

    let defer = {}
    defer.p = new Promise((r, j) => {
      defer.r = r
      defer.j = j
    })

    xhr.addEventListener("readystatechange", (e) => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        console.log(xhr.responseText)
        let data = JSON.parse(xhr.responseText)
        defer.r(data)
      }
    })

    xhr.addEventListener("error", (e) => {
      console.log("error")
      console.log(e)
      defer.j(e)
    })
    xhr.addEventListener("abort", (e) => {
      console.log("abort")
      console.log(e)
      defer.j(e)
    })

    conf.timeout && (xhr.timeout = conf.timeout)

    xhr.open("POST", url, true)
    xhr.send()

    return defer.p
  }

  return {
    tinyevent,
    insertMsg,
    fetchMsg,
  }
})()
