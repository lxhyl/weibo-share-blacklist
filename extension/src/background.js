// array buffer to json
const ab2json = b => JSON.parse(String.fromCharCode.apply(null, new Uint8Array(b)))

let listId = null
chrome.storage.sync.get(["listId"],res => {
  if(Object.keys(res) === 0) return
  listId = res.listId
})


function blockRequest(e){
  const body = ab2json(e.requestBody.raw[0].bytes)
  if(!body || !body.uid || !listId) return
  const data = {
    uid:body.uid,
    listId:listId
  }
  joinBlackList(data)
}

chrome.webRequest.onBeforeRequest.addListener(blockRequest,
  {urls:["https://weibo.com/ajax/statuses/filterUser"]}, 
  ["blocking","requestBody"]
);


function joinBlackList(data){
  console.log(data)
  // fetch()
}