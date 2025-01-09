# 搭建自己的专属 邮箱搜索引擎

1. 创建一个谷歌账号

2. https://myaccount.google.com/security  -> 开启两步验证

3. https://myaccount.google.com/apppasswords -> 创建 App 专用密码

4. Gmail -> 设置 -> 转发和POP/IMAP -> 启用 IMAP

5. Clone 这个Repo, 并开启 Actions

6. https://github.com/hello-world-1989/url-to-pdf/settings/secrets/actions

  添加 Repository secrets -> APP_PASSWORD 为刚刚设置的 App 专用密码， 16位，不包含空格
  添加 Repository variables -> FROM 为 你的邮箱地址，例如 test@gmail.com



# 使用方法

发送邮件到你的邮箱 或 测试演示邮箱 yirong.fang24@gmail.com

主题为 搜索李宜雪或者一个https://开头的网址， 例如 https://www.rfi.fr/cn/

20分钟后，将收到搜索结果邮件， 点击结果中的链接并复制 

例https://zh.wikipedia.org/wiki/李宜雪

以链接作为主题再次发送邮件， 将获得 网址页面
