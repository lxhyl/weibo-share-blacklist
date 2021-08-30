
// 注入js代码
function injectCustomJs(jsPath) {
	jsPath = jsPath
	var temp = document.createElement('script');
	temp.setAttribute('type', 'text/javascript');
	temp.src = chrome.extension.getURL(jsPath);
	document.head.appendChild(temp);
}
injectCustomJs("/src/block.js")

