// 以微博id作为黑名单列表名，如果未登录，则随机生成
function getUserWeiboId() {
  chrome.storage.sync.get(["listId"], res => {
    if (Object.keys(res).length > 0) return
    let id = localStorage.getItem("WBStoreTid")
    if (!id) id = Math.floor(Math.random() * 1000000000)
    chrome.storage.sync.set({ listId: id })
  })
}
getUserWeiboId()



function getCommentsTag() {
  const allATag = Array.from(document.querySelectorAll('a'))
  const commentsTag = allATag.filter(a => {
    // 是用户主页标签
    let flag = a.href.includes('https://weibo.com/u/') || a.href.includes('https://weibo.com/n/') 
    // 跳过头像
    flag = flag && (a.getElementsByTagName('img').length === 0)
    return flag
  })
  return commentsTag
}

function injectBolckButton() {
   const tags = getCommentsTag()
   tags.forEach(item => {
     if(item.WEIBO_BLOCK_FLAG) return
     item.WEIBO_BLOCK_FLAG = true
     const button = document.createElement('span')
     button.textContent = '拉黑'
     button.style.color = '#5E35B1'
     button.onclick = function(){
      const splitUrl = item.href.split('/')
      const uid = splitUrl[splitUrl.length - 1]
      chrome.runtime.sendMessage({type:'blockOne',uid})
     }
     item.appendChild(button)
   })
}
setInterval(injectBolckButton, 5000)