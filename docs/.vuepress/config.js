module.exports = {
  port: 7777,
  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
  ],
  markdown: {
    lineNumbers: true
  },
  locales: {
    '/': {
      lang: 'zh-CN',
      title: 'Hello Taroco',
      description: '微服务开发脚手架'
    }
  },
  themeConfig: {
    docsRepo: 'liuht777/Taroco-Ui-Vue',
    editLinks: true,
    docsDir: 'docs',
    sidebarDepth: 2,
    locales: {
      '/': {
        selectText: '选择语言',
        label: '简体中文',
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: '上次更新',
        nav: [
          { text: '首页', link: '/' },
          { text: '指南', items: [
            { text: '介绍', link: '/guide/introduction/' },
            { text: '快速上手', link: '/guide/faststart/' }
          ]},
          { text: 'Github', 
            items: [
              { text: '后端', link: 'https://github.com/liuht777/Taroco' },
              { text: '前端', link: 'https://github.com/liuht777/Taroco-Ui-Vue' },
            ],
          }
        ],
        sidebar: {
          '/guide/introduction/': [
            {
              collapsable: false,
              children: [
                ''
              ]
            }
          ],
          '/guide/faststart/': [
            {
              collapsable: false,
              children: [
                ''
              ]
            }
          ],
        }
      }
    }
  }
}