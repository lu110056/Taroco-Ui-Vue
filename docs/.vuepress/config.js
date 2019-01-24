module.exports = {
  title: 'Hello Taroco',
  description: '微服务开发脚手架',
  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
  ],
  serviceWorker: true,
  markdown: {
    lineNumbers: true
  },
  port: 7777,
  themeConfig: {
    repo: 'liuht777/Taroco-Ui-Vue',
    editLinks: true,
    docsDir: 'docs',
    sidebarDepth: 2,
    displayAllHeaders: true,
    locales: {
      '/': {
        // 多语言下拉菜单的标题
        selectText: '选择语言',
        // 该语言在下拉菜单中的标签
        label: '简体中文',
        // 编辑链接文字
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: '上次更新',
        // Service Worker 的配置
        serviceWorker: {
          updatePopup: {
            message: "发现新内容可用.",
            buttonText: "刷新"
          }
        },
        nav: [
          { text: '首页', link: '/' },
          { text: '指南', link: '/guide/' },
          { text: 'Github', 
            items: [
              { text: '后端', link: 'https://github.com/liuht777/Taroco' },
              { text: '前端', link: 'https://github.com/liuht777/Taroco-Ui-Vue' },
            ],
          }
        ],
        sidebar: {
          '/guide/': [
            {
              title: '快速上手',
              collapsable: false,
              children: [
                'base/start'
              ]
            },
          ],
        }
      }
    }
  }
}