const getDom = id => document.getElementById(id)

const tip = getDom('tip')
const listIdInput = getDom("listIdInput")
const listIdButton = getDom('listIdButton')
const getListButton = getDom('getListButton')
const allUid = getDom('allUid')


//黑名单id
let listid = null



// 检查storage的listid
function checkStorageListId(){
   chrome.storage.sync.get(["listId"],res => {
     if(Object.keys(res) === 0) return
     tip.textContent = `当前黑名单ID:${res.listId}`
     listIdInput.value = res.listId
     listid = res.listId
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
  listid = value
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


function getBlaclList(){
  fetch(`http://114.132.210.203:5000/blacklist?listid=${listid}`,{
    method:"GET"
  }).then(res => res.json())
  .then(res => {
    if(res.code !== 200) return
    res = res.data
    let msg = ''
    // chrome.storage.sync.set({blockIds:res})
   
    if(res.length > 10) msg = `${JSON.stringify(res)}\n...`
    if(res.length <= 10) msg = JSON.stringify(res)
    if(res.length === 0) msg = '此列表暂无账号' 
     allUid.textContent = msg
    if(res.length){
      chrome.runtime.sendMessage({lists:res},r => console.log(r))
    }
  })
}
getListButton.addEventListener('click',getBlaclList)
