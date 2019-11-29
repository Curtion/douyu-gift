<template>
  <div class="content">
    <div>
      <div class="info">
        开源地址：<span
          size="mini"
          type="text"
          @click="url('https://github.com/Curtion/douyu-gift')"
          >https://github.com/Curtion/douyu-gift</span
        >
      </div>
      <div class="info">
        作者：Curtion；博客：<span
          size="mini"
          type="text"
          @click="url('https://blog.3gxk.net')"
          >https://blog.3gxk.net</span
        >
      </div>
      <div class="info">
        软件由
        <span size="mini" type="text" @click="url('http://vuejs.org')"
          >Vue.js</span
        >、<span
          size="mini"
          type="text"
          @click="url('https://typescriptlang.org')"
          >TypeScript</span
        >、<span size="mini" type="text" @click="url('https://electronjs.org')"
          >Electron</span
        >、<span
          size="mini"
          type="text"
          @click="url('https://element.eleme.io')"
          >ElementUI</span
        >驱动
      </div>
      <div class="info">
        本软件仅用于学习交流，请勿用于非法用途。
      </div>
      <div class="info">
        <span
          size="mini"
          type="text"
          @click="url('https://blog.3gxk.net/about.html')"
          >捐赠我</span
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
const { shell } = require('electron');
@Component({})
export default class about extends Vue {
  url(url: string) {
    this.$confirm('是否打开浏览器？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        shell.openExternal(url);
      })
      .catch(() => {});
  }
}
</script>
<style lang="scss" scoped>
.content {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .info {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    span {
      color: rgb(36, 199, 228);
      cursor: pointer;
    }
  }
}
</style>
