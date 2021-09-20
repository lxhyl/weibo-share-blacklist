
// 注入js代码
function injectCustomJs(jsPath) {
	jsPath = jsPath
	var temp = document.createElement('script');
	temp.setAttribute('type', 'text/javascript');
	temp.src = chrome.extension.getURL(jsPath);
	document.head.appendChild(temp);
}

function injectCSS(cssPath){
  const link = document.createElement('link')
  link.href = chrome.extension.getURL(cssPath)
  document.head.appendChild(link)
}
injectCustomJs("/src/block.js")
// injectCSS("/style/inject.css")


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	sendResponse("111")
  console.log(request.data)
  const list = request.data
  let timerInject = null
  function block() {
    const item = list.pop()
    const uid = item ? item.uid : null
    if (!uid) {
      clearInterval(timerInject)
      return
    }
    blockById(uid, 'noAsync')
  }  
  timerInject = setInterval(block, 1500);
})