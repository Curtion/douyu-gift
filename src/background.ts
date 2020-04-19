'use strict';
import { app, protocol, BrowserWindow } from 'electron';
import electron from 'electron';
import { createProtocol, installVueDevtools } from 'vue-cli-plugin-electron-builder/lib';
import './main/rpc.ts'; // rpc订阅
require('electron-referer')('https://www.douyu.com/');
// 兼容多平台
const platform = process.platform === 'win32' ? '\\' : '/';
const path = require('path');
const isDevelopment = process.env.NODE_ENV !== 'production';
let Datastore = require('nedb');
let paths = process.execPath.split(platform);
paths.pop();
let db = new Datastore({
  filename: path.join(paths.join(platform), '/config.db'),
  autoload: true
});
(global as any).db = db;
let win: BrowserWindow | null;
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }]);

function createWindow() {
  electron.Menu.setApplicationMenu(null);
  win = new BrowserWindow({
    width: 800,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    },
    resizable: false
  });
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    win.loadURL('app://./index.html');
  }
  win.on('closed', () => {
    win = null;
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    await installVueDevtools();
  }
  createWindow();
});

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
