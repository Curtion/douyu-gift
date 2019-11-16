<template>
  <div class="content">
    <div v-if="isLogin" class="login">
      <div class="box-card">
        <span>设置：</span>
        <el-checkbox v-model="run">开机启动</el-checkbox>
        <el-checkbox v-model="close" :disabled="!run"
          >任务完成后自动关闭</el-checkbox
        >
      </div>
      <main class="main">
        <el-scrollbar class="scrollbar">
          <el-table :data="fans" style="width: 100%">
            <el-table-column prop="name" label="主播" align="center">
            </el-table-column>
            <el-table-column prop="intimacy" label="亲密值" align="center">
            </el-table-column>
            <el-table-column prop="ranking" label="排名" align="center">
            </el-table-column>
            <el-table-column label="赠送比例" align="center">
              <template slot="header">
                <span>赠送比例</span>
                <i
                  class="el-icon-question"
                  title="默认平均分配，注意比例一定要等于100%。自动赠送时数量均向下取整。"
                ></i>
              </template>
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.send"
                  size="mini"
                  placeholder="输入赠送比例"
                  style="width:60%;"
                  :disabled="true"
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
      </main>
    </div>
    <div v-else class="nologin">
      <login />
    </div>
  </div>
</template>
<script lang="ts">
const { BrowserWindow } = require('electron').remote;
import { Vue, Component, Watch } from 'vue-property-decorator';
import login from '../components/nologin.vue';
@Component({
  components: {
    login
  }
})
export default class home extends Vue {
  run: boolean = false;
  close: boolean = false;
  get isLogin() {
    return this.$store.state.isLogin;
  }
  get fans() {
    return this.$store.state.fans;
  }
  @Watch('run')
  onChangeValue(newval: boolean, oldval: boolean) {
    if (newval === false) {
      this.close = false;
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  height: 100%;
}
.login {
  height: 100%;
  .box-card {
    height: 40px;
    box-sizing: border-box;
    padding: 0 20px;
    border-bottom: 1px #ccc solid;
    display: flex;
    align-items: center;
  }
}
.nologin {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.main {
  .scrollbar /deep/ {
    height: calc(100vh - 40px);
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
}
</style>
