/**
 * url: https://www.douyu.com/member/prop/send
 * 参数:
 * prop_id: 5 // 礼物ID 荧光棒268
 * num: 1 // 数量
 * sid: 10612134 // cookie->acf_uid 用户ID
 * did: 68801681 // html-> $ROOM.owner_uid 房价所属者
 * rid: 1561677 // 房价ID号
 * dy: 94db2c1d4df3a7466ff9b44100001501 // html->dy_did 用户权限
 * 需要携带cookie请求
 * _ga=GA1.2.14737062.1543924012; dy_did=c26ca0428d6e2b202cd7c45a00071501; smidV2=2018120218224773efc5bb86312046d983c4bf3f551d2b00c351fb1748b84d0; acf_did=c26ca0428d6e2b202cd7c45a00071501; acf_uid=10612134; acf_username=auto_ziE8D4IkAq; acf_nickname=Curtion; acf_ltkid=60538976; acf_auth=197akkNwdq%2BrlkdrhA216dwI72uoavF5QQq%2BzmDfExXJDf4PvaSaLUR1vMBWjhXcuWCggIsXstnYQ0XfQrVLSpU1ZNlIFvrmNIWy%2B%2BOTO1B%2FA83PA7%2FPlffScDWPlw; wan_auth37wan=8a1eb521e064225aD5rO0RzXzm7eW3Ft2RLLv8tGfEOOwbFAFOTMO9fYEtDNPdoqXeXIKTTaa1mNkx2DcfJR9kXFgqifSDZFc11yqO1lizgLZ7zcYA; acf_own_room=1; acf_groupid=1; acf_phonestatus=1; acf_ct=0; acf_biz=1; acf_stk=359dd1b967a45a1c; acf_avatar=//apic.douyucdn.cn/upload/avanew/face/201609/29/21/c05a9e07acee676a8f1480c877f618f7_; PHPSESSID=bhtq2k0uoegu0qe88ufh3pa9i0; Hm_lvt_e99aee90ec1b2106afe7ec3b199020a7=1560777683,1560865469,1560941947,1561043662; Hm_lpvt_e99aee90ec1b2106afe7ec3b199020a7=1561045114; acf_ccn=b29a47bfed58116cbd0ada686e5f69da
 */
const { app, BrowserWindow, Menu, ipcMain, session } = require('electron')
// 本地文件数据库
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
db.defaults({
    user: '', // 用户名
    send: [], // 需要发送的数据
    prop_id: 268, // 礼物ID 荧光棒268
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