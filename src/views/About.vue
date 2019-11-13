<template>
  <div class="content">
    <div class="info">
      本软件由
      <el-button size="mini" type="text" @click="url('http://vuejs.org')"
        >Vue.js</el-button
      >、<el-button
        size="mini"
        type="text"
        @click="url('https://www.typescriptlang.org')"
        >TypeScript</el-button
      >、<el-button
        size="mini"
        type="text"
        @click="url('https://electronjs.org')"
        >Electron</el-button
      >、<el-button
        size="mini"
        type="text"
        @click="url('https://element.eleme.io')"
        >ElementUI</el-button
      >
      开发完成
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
const { shell } = require('electron');
@Component({})
export default class about extends Vue {
  url(url: string) {
    shell.openExternal(url);
  }
}
</script>
<style lang="scss" scoped>
.content {
  height: 100%;
  width: 80%;
  margin: 0 auto;
  .info {
    display: flex;
    justify-content: center;
  }
}
</style>
