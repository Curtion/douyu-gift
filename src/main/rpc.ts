import { ipcMain } from 'electron';
const AutoLaunch = require('auto-launch'); // 自动启动
let douyuAutoLauncher = new AutoLaunch({
  name: 'douyu-git',
  path: process.execPath
});
ipcMain.on('AutoLaunch', (event, arg) => {
  // 设置开启启动
  if (arg === 0) {
    douyuAutoLauncher
      .isEnabled()
      .then((isEnabled: boolean) => {
        if (!isEnabled) {
          event.returnValue = true;
          return;
        }
        douyuAutoLauncher.disable();
        event.returnValue = true;
      })
      .catch((err: Error) => {
        event.returnValue = err.toString();
      });
  }
  if (arg === 1) {
    douyuAutoLauncher
      .isEnabled()
      .then((isEnabled: boolean) => {
        if (isEnabled) {
          event.returnValue = true;
          return;
        }
        douyuAutoLauncher.enable();
        event.returnValue = true;
      })
      .catch((err: Error) => {
        event.returnValue = err.toString();
      });
  }
  if (arg === 3) {
    douyuAutoLauncher
      .isEnabled()
      .then((isEnabled: boolean) => {
        event.returnValue = isEnabled;
      })
      .catch((err: Error) => {
        event.returnValue = err.toString();
      });
  }
});
