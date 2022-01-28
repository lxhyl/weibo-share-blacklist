const getDom = id => document.getElementById(id)

const tip = getDom('tip')
const listIdInput = getDom("listIdInput")
const listIdButton = getDom('listIdButton')

// 检查storage的listid
function checkStorageListId(){
   chrome.storage.sync.get(["listId"],res => {
     if(Object.keys(res) === 0) return
     tip.textContent = `当前黑名单ID:${res.listId}`
     listIdInput.value = res.listId
   })
}
checkStorageListId()


listIdInput.addEventListener('input',e => {
   const value = e.target.value
   listIdButton.style.cursor = value && value.length > 3 ? "grab" : "not-allowed"
})
// 设置列表id
function setBlackList(){
  const value = listIdInput.value
  if(!value) return
  chrome.storage.sync.set({listId:value})
  tip.textContent = `当前黑名单ID:${value}`

  listIdButton.style.backgroundColor = '#67c23a'
  listIdButton.textContent = '成功'
  const timer = setTimeout(() => {
    listIdButton.style.backgroundColor = '#409eff'
    listIdButton.textContent = '确定'
    clearTimeout(timer)
  },1000)
}
listIdButton.addEventListener('click',setBlackList)
