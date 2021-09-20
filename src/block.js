
// 获取用户名dom
function getUsers() {
  let user = document.getElementsByTagName('a')
  const regUID = /weibo\.com\/u\/[0-9]{10}/
  const regName = /\/n\/\.{0,}/
  user = Array.from(user).filter(element => {
    return regUID.test(element.href) 
    // || regName.test(element.href)) // 是评论a标签
    && element.innerHTML.indexOf("img") === -1 // 不是头像  
    && element.children.length === 0 // 是评论而不是博主
  })
  return user
}

// 弹窗提示
const messageList = new Set()
function message(msg = "提示") {
  const p = document.createElement('p')
  p.textContent = msg
  p.style.position = 'fixed'
  p.style.top = `${40 + messageList.size * 50}px`
  p.style.left = "50%"
  p.style.transform = 'translateX(-50%)';
  p.style.background = "#37474F"
  p.style.color = "#FAFAFA"
  p.style.zIndex = 9999999
  p.style.padding = "10px"
  document.body.appendChild(p)
  messageList.add(p)
  let timer = setTimeout(() => {
    document.body.removeChild(p)
    messageList.delete(p)
    clearTimeout(timer)
  }, 1500)
}

// 注入拉黑按钮
function makeButton(el) {
  const button = document.createElement("span")
  if (el.textContent.indexOf('拉黑') === -1) {
    button.textContent = "拉黑"
    button.style.color = '#6A1B9A'
    el.appendChild(button)
    button.onclick = function (e) {
      e.stopPropagation()
      e.preventDefault()
      const items = el.href.split("/")
      const id = items[items.length - 1]
      if(/\/u\//.test(el.href)){
        blockById(id) 
      }
    }
  }
}

const BASE_URl = 'https://weibo.com/aj/filter/block?ajwvr=6'
const xhr = new XMLHttpRequest()

// 拉黑
function blockById(id, type) {
  id = id.toString()
  if(!id) return
  xhr.open("POST", BASE_URl, true)
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
  let data = `uid=${id}&filter_type=1&status=1&interact=1&follow=1`
  xhr.send(data)
  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4 || xhr.status != 200) return
    console.log("接收请求")
    let data = ''
    try {
      data = JSON.parse(xhr.responseText)
    } catch (err) { }
    if (data.code == 100000) {
      const msg = decodeURI(`拉黑用户${id}成功`)
      message(msg)
      // 同步id
      if (type !== 'noAsync') {
        syncBlockId(id)
      }
    } else {
      const msg = decodeURI(`拉黑用户${id}失败`)
      message(msg)
    }
  }
}


// 同步id至数据库
function syncBlockId(id) {
  console.log('1')
  // const url = 'http://127.0.0.1:6105/sync-uid'
  const url = 'https://zhangpengfan.xyz:5000/sync-uid'
  xhr.open("GET", `${url}?uid=${id}`)
  xhr.send()
  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4 || xhr.status != 200) return
    let data
    try {
      data = JSON.parse(xhr.responseText)
    } catch { }
    if (data.code === 200) {
      message(`${data.msg}`)
    } else {
      message(`${data.msg}`)
    }
  }
}

let timer = setInterval(() => {
  getUsers().forEach(element => {
    makeButton(element)
  });
}, 5000)