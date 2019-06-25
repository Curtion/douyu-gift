/**
 * url: https://www.douyu.com/member/prop/send
 * 参数:
 * prop_id: 5 // 礼物ID 荧光棒268
 * num: 1 // 数量
 * sid: 10612134 // cookie->acf_uid 用户ID
 * did: 68801681 // html-> $ROOM.owner_uid 房价所属者
 * rid: 1561677 // 房价ID号
 * dy: 94db2c1321323154645 // html->dy_did 用户权限
 * 需要携带cookie请求
 */
const { app, BrowserWindow, Menu, ipcMain, session } = require('electron')
// 本地文件数据库
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
db.defaults({
    send: [], // 需要发送的数据
    num: 0, //粉丝棒总数
    prop_id: 268,
    url: 'https://www.douyu.com/member/prop/send'
  }).write() // 数据库初始化

// 主窗口 + 登陆窗口
let win, login
// Menu.setApplicationMenu(null) // 顶部菜单栏
function createWindow () {
  win = new BrowserWindow({
    width: 1000, // 1240
    height: 500, // 720
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    },
    icon: __dirname + '/assest/logo.png',
    resizable: false
  })
  win.loadFile('main/index.html')
  // win.webContents.openDevTools({mode:'detach'}) // 打开开发者工具
  win.on('closed', () => {
    win = null
  })
  const filter = { // 获取背包礼物数量，此接口有referer验证
    urls: ['https://www.douyu.com/member/prop/query',]
  }
  session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    details.requestHeaders['referer'] = 'https://www.douyu.com/4120796'
    callback({ requestHeaders: details.requestHeaders })
  })
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => { // 重新激活时触发
  if (win === null) {
    createWindow()
  }
})

ipcMain.on('add',(event, arg)=> {
  const loginurl = 'https://passport.douyu.com/member/login'
  login = new BrowserWindow({
    width: 1240,
    height: 720,
    webPreferences: {
      nodeIntegration: false
    },
    icon: __dirname + '/assest/logo.png',
    resizable: false,
    parent: win, // win是主窗口
  })
  login.loadURL(loginurl)
  login.on('closed',()=>{
    login = null
    event.reply('loginres')
  })
})

ipcMain.on('getCookie',(event, arg)=> {
  session.defaultSession.cookies.get({ domain: 'douyu.com' })
  .then((cookies) => {
    event.reply('pushCookie', cookies)
  }).catch((error) => {
    event.reply('pushCookie', error)
  })
})