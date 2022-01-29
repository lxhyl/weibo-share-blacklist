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


