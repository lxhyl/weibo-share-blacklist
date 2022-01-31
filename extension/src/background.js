
// array buffer to json
const ab2json = b => JSON.parse(String.fromCharCode.apply(null, new Uint8Array(b)))

let listId = null
chrome.storage.sync.get(["listId"], res => {
  if (Object.keys(res) === 0) return
  listId = res.listId
})


// 加入黑名单
function joinBlackList(data) {
  const url = 'http://114.132.210.203:5000/blacklist'
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(res => console.log(res))
}

// 拦截拉黑请求
function blockRequest(e) {
  if (!e.requestBody) return
  const body = ab2json(e.requestBody.raw[0].bytes)
  if (!body || !body.uid || !listId) return
  const data = {
    uid: body.uid,
    listId: listId
  }
  !body.FLAG && joinBlackList(data)
}

chrome.webRequest.onBeforeRequest.addListener(blockRequest,
  { urls: ["https://weibo.com/ajax/statuses/filterUser"] },
  ["blocking", "requestBody"]
)


// 拉黑
let lists = []
let listsLength = 0
let blockTimer
const blockResult = []
let successNum = 0, failedNum = 0
function blockById() {
  if (lists.length === 0) {
    clearInterval(blockTimer)
    return
  }
  const { uid } = lists.pop()
  fetch("https://weibo.com/ajax/statuses/filterUser", {
    method: "POST",
    body: JSON.stringify({
      follow: 1,
      interact: 1,
      status: 1,
      uid,
      FLAG: true
    })
  }).then(res => {
    if (res.status !== 200) {
      return Promise.resolve({})
    } else {
      return res.json()
    }
  })
    .then(res => {
      if (res.ok === 1) {
        successNum++
      } else {
        failedNum++
      }
      // 通知
      sendNtc()
    })
}

// 监听消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  sendResponse({ msg: 'res' })
  if (request.type === 'listData' && request?.lists?.length) {
    lists = request.lists
    listsLength = lists.length
    successNum = 0
    failedNum = 0
  }
  if (request.type === 'blockAll') {
    sendNtc()
    blockTimer = setInterval(blockById, 1000)
  }
})




function getCookie(cookie, name) {
  if (!cookie) return undefined
  const arrcookie = cookie.split("; ");
  for (let i = 0; i < arrcookie.length; i++) {
    const arr = arrcookie[i].split("=");
    if (arr[0] === name) {
      return arr[1];
    }
  }
  return undefined
}
function onBeforeSendHeaders(details) {
  if (details.url === 'https://weibo.com/ajax/statuses/filterUser') {
    const headers = details.requestHeaders
    const cookie = headers.find(item => item.name === 'Cookie')?.value
    // X-xsrf-token请求头鉴权
    const xrsfToken = getCookie(cookie, 'XSRF-TOKEN')
    headers.push(
      { name: 'Origin', value: 'https://weibo.com' },
      { name: "Referer", value: `https://weibo.com/` },
      { name: 'X-requested-with', value: 'XMLHttpRequest' },
      { name: 'Content-Type', value: 'application/json;charset=UTF-8' },
      { name: 'X-xsrf-token', value: xrsfToken }
    )
    return {
      requestHeaders: headers
    }
  }
}
// 拦截设置headers
chrome.webRequest.onBeforeSendHeaders.addListener(onBeforeSendHeaders, {
  urls: ['*://*/*']
}, [
  'blocking',
  'requestHeaders',
  'extraHeaders',
]);

// 拉黑结果通知
let noticId = null
function sendNtc() {
  const progress =  Math.floor((successNum + failedNum) / listsLength * 100)
  const options = {
    type: "progress",
    iconUrl: "/src/weibo.jpeg",
    title: '拉黑中,请稍等',
    message: `成功${successNum}个,失败${failedNum}个`,
    priority: 1,
    progress,
  }
  // 当前没有通知时新建，有时更新
  if (!noticId) {
    noticId = (Math.random() + 1).toString()
    chrome.notifications.create(noticId, options)
  } else {
    if(progress < 100){
      chrome.notifications.update(noticId, options)
    }else{
      chrome.notifications.update(noticId, {...options,title:'拉黑完成🎉'})
      noticId = null
    }
  }
}