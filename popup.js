


const xhr = new XMLHttpRequest()

let listData = []
let success = 0
let failed = 0


getList.onclick = function () {
  // const url = 'http://127.0.0.1:6105/get-block-list'
  const url = 'https://zhangpengfan.xyz:6105/get-block-list'
  info.textContent = '获取中...'
  xhr.open('GET', url)
  xhr.send()
  xhr.onreadystatechange = function () {
    let data
    try {
      data = JSON.parse(xhr.responseText)
    } catch {}
    info.textContent = data
    if (data && data.code == 200) {
      listData = data.data
      let str = ''
      for(let i =0;i<listData.length;i++){
        str = `${str}\n\r{uid:${listData[i].uid}}`
      }
      info.textContent = str
    }
  }
}

const BASE_URl = 'https://weibo.com/aj/filter/block?ajwvr=6'
function blockById(id) {
  if (!id || id.length !== 10) return
  xhr.open("POST", BASE_URl, true)
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
  const data = `uid=${id}&filter_type=1&status=1&interact=1&follow=1`
  xhr.send(data)
  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4 || xhr.status != 200) return
    let data = ''
    try {
      data = JSON.parse(xhr.responseText)
    } catch (err) { }
    if (data.code == 100000) {
      const msg = `拉黑用户${id}成功`
      const p = document.createElement('p')
      p.textContent = msg
      info.appendChild(p) 
    } else {
      const msg = `拉黑用户${id}失败`
      const p = document.createElement('p')
      p.textContent = msg
      info.appendChild(p) 
    }
  }
}
asycBlock.onclick = function(){
  chrome.tabs.query({
    active: true,
    currentWindow: true
}, (tabs) => {
    let message = {
      action:'blockAll',
      data:listData
    }
    chrome.tabs.sendMessage(tabs[0].id, message, res => {
        console.log('popup=>content')
        console.log(res)
    })
})
}
