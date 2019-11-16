/**
 * url: https://www.douyu.com/member/prop/send
 * 参数:
 * prop_id: 5 // 礼物ID 荧光棒268
 * num: 1 // 数量
 * sid: 10612134 // cookie->acf_uid 用户ID
 * did: 68801681 // html-> $ROOM.owner_uid 房价所属者
 * rid: 1561677 // 房间ID号
 * dy: 94db2c1321323154645 // html->dy_did 用户权限
 * 需要携带cookie请求
 */
const {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  session,
  dialog
} = require('electron');
// 本地文件数据库
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
db.defaults({
  send: [], // 需要发送的数据
  num: 0, //粉丝棒总数，用于计算平均分配
  prop_id: 268, // 荧光棒ID
  fsnum: 0, // 粉丝牌数量,用于判断当前赠送是否完成
  date: '', // 上次签到时间
  sid: 0 // 用户ID
}).write(); // 数据库初始化

// 主窗口 + 登陆窗口
let win, login, loadly;
Menu.setApplicationMenu(null); // 顶部菜单栏
function createWindow() {
  win = new BrowserWindow({
    width: 1000, // 1240
    height: 500, // 720
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    },
    icon: __dirname + '/assest/logo.png',
    resizable: false
  });
  win.loadFile('main/index.html');
  // win.webContents.openDevTools({mode:'detach'}) // 打开开发者工具
  win.on('closed', () => {
    win = null;
  });
  const filter = {
    // 获取背包礼物数量+赠送礼物，此接口有referer验证
    urls: [
      'https://www.douyu.com/member/prop/query',
      'https://www.douyu.com/member/prop/send'
    ]
  };
  session.defaultSession.webRequest.onBeforeSendHeaders(
    filter,
    (details, callback) => {
      details.requestHeaders['referer'] = 'https://www.douyu.com/';
      callback({ requestHeaders: details.requestHeaders });
    }
  );
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  // 重新激活时触发
  if (win === null) {
    createWindow();
  }
});

ipcMain.on('add', (event, arg) => {
  const loginurl = 'https://passport.douyu.com/member/login';
  login = new BrowserWindow({
    width: 1240,
    height: 720,
    webPreferences: {
      nodeIntegration: false
    },
    icon: __dirname + '/assest/logo.png',
    resizable: false,
    parent: win // win是主窗口
  });
  login.loadURL(loginurl);
  dialog.showMessageBox({
    title: '提示',
    message: '请在登录后手动关闭窗口，程序自动加载信息。'
  });
  login.on('closed', () => {
    login = null;
    event.reply('loginres');
  });
});

ipcMain.on('getCookie', (event, arg) => {
  session.defaultSession.cookies
    .get({ domain: 'douyu.com' })
    .then(cookies => {
      event.reply('pushCookie', cookies);
    })
    .catch(error => {
      console.log(error);
    });
});

ipcMain.on('quit', (event, arg) => {
  app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) });
  app.exit(0);
});
