module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        publish: ['github'],
        appId: 'com.3gxk.app',
        productName: '斗鱼续牌工具', //项目名
        copyright: 'Copyright © 2014-2019', //版权信息
        directories: {
          output: './dist' //输出文件路径
        },
        win: {
          //win相关配置
          icon: './src/assets/home.ico', //图标，当前图标在根目录下，注意这里有两个坑
          target: [
            {
              target: 'nsis', //利用nsis制作安装程序
              arch: [
                'x64' //64位
              ]
            }
          ]
        },
        nsis: {
          oneClick: false, // 是否一键安装
          allowElevation: true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
          allowToChangeInstallationDirectory: true, // 允许修改安装目录
          installerIcon: './src/assets/home.ico', // 安装图标
          uninstallerIcon: './src/assets/home.ico', //卸载图标
          installerHeaderIcon: './src/assets/home.ico', // 安装时头部图标
          createDesktopShortcut: true, // 创建桌面图标
          createStartMenuShortcut: true, // 创建开始菜单图标
          shortcutName: '斗鱼续牌工具' // 图标名称
        }
      }
    }
  }
};
