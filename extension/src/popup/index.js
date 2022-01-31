const getDom = id => document.getElementById(id)

const tip = getDom('tip')
const listIdInput = getDom("listIdInput")
const listIdButton = getDom('listIdButton')
const getListButton = getDom('getListButton')
const allUid = getDom('allUid')
const blockallButton = getDom('blockallButton')

//黑名单id
let listid = null
let lists = []


// 检查storage的listid
function checkStorageListId() {
  chrome.storage.sync.get(["listId"], res => {
    if (Object.keys(res) === 0) return
    tip.textContent = `当前黑名单ID:${res.listId}`
    listIdInput.value = res.listId
    listid = res.listId
  })
}
checkStorageListId()


listIdInput.addEventListener('input', e => {
  const value = e.target.value
  listIdButton.style.cursor = value && value.length > 3 ? "grab" : "not-allowed"
})
// 设置列表id
function setBlackList() {
  const value = listIdInput.value
  if (!value) return
  chrome.storage.sync.set({ listId: value })
  listid = value
  tip.textContent = `当前黑名单ID:${value}`

  listIdButton.style.backgroundColor = '#67c23a'
  listIdButton.textContent = '成功'
  const timer = setTimeout(() => {
    listIdButton.style.backgroundColor = '#409eff'
    listIdButton.textContent = '确定'
    clearTimeout(timer)
  }, 1000)
}
listIdButton.addEventListener('click', setBlackList)


function getBlaclList() {
  fetch(`http://114.132.210.203:5000/blacklist?listid=${listid}`, {
    method: "GET"
  }).then(res => res.json())
    .then(res => {
      if (res.code !== 200) return
      res = res.data
      let msg = ''
      if (res.length > 10) msg = `${JSON.stringify(res.slice(0,10))}\n...等共${res.length}只狗`
      if (res.length <= 10) msg = JSON.stringify(res)
      if (res.length === 0) msg = '此列表暂无账号'
      allUid.textContent = msg
      if (res.length) {
        lists = res
        chrome.runtime.sendMessage({ type: 'listData', lists: res }, r => console.log(r))
      }
    })
}
getListButton.addEventListener('click', getBlaclList)


blockallButton.addEventListener('click',function(){
  if(!lists || lists.length === 0){
    allUid.textContent = '请先拉取列表或列表无用户'
    return
  }
  allUid.textContent = '拉黑中,请勿关闭浏览器，拉黑完成将会弹出通知...'
  chrome.runtime.sendMessage({ type: 'blockAll'}, r => console.log(r))
})

