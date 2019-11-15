<template>
  <el-button size="mini" type="text" @click="login">登录账号？</el-button>
</template>
<script lang="ts">
const { BrowserWindow } = require('electron').remote;
import { Vue, Component } from 'vue-property-decorator';
interface windows {
  [propName: string]: any;
}
@Component({})
export default class home extends Vue {
  win: windows = {};
  get isLogin() {
    return this.$store.state.isLogin;
  }
  login() {
    this.$confirm(
      '是否打开斗鱼窗口进行登录？登录成功后请手动关闭窗口！',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
      .then(() => {
        this.win = new BrowserWindow({
          width: 1200,
          height: 800,
          webPreferences: {
            nodeIntegration: true,
            webSecurity: false
          },
          resizable: false
        });
        this.win.loadURL('https://www.douyu.com/directory');
        this.win.on('closed', () => {
          this.$store.dispatch('checkLogin');
        });
      })
      .catch(() => {});
  }
}
</script>
