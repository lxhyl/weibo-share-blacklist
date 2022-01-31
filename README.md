微博共享拉黑chrome插件,施工中...🚧-🚧-🚧
[github](https://github.com/lxhyl/weibo-share-blacklist).[readme](https://lxhyl.cn/weibo-share-blacklist/)

# 安装

* [下载extension.zip](https://github.com/lxhyl/weibo-share-blacklist/raw/master/extension.zip)插件。  
* chrome 更多工具 => 扩展程序 => 打开开发者模式 => 加载已解压的扩展程序  
* 右上角将插件固定
 
# 使用  

点击插件，可以自定义云黑名单id(默认为微博id). 可以和几个好友共用一个黑名单id（所谓共享黑名单）   

插件会自动拦截拉黑接口，并将拉黑的人加入云黑名单.  
点击拉取，会获取此黑名单中的所有账号，点击拉黑后会将此列表的账户全部拉黑，为防止微博服务器限制，所以一秒拉黑一个。

# tips   

如未显示进度通知,可能是无通知权限。解决方案:
* 系统通知设置给予chrome通知权限  
* chrome地址栏输入`chrome://flags`,搜索`Enable system notifications`,选项设置为`Disabled`。然后重启浏览器。


# todos  

* ~~云黑名单添加与获取~~
* ~~拦截拉黑接口~~
* ~~拉黑黑名单所有账号~~
* ~~拉黑进度通知~~   
* 微博评论注入拉黑按钮    
* 导出云黑名单
