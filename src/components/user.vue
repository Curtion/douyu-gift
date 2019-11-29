<template>
  <div class="user">
    <header class="header">
      <div class="userinfo">
        <span>手机：{{ user.tel.slice(-11) }}</span>
        <img :src="user.level" alt="账号等级" />
      </div>
      <div>
        <span v-if="gift.num !== 0" class="gift"
          ><img
            :src="gift.gif"
            alt="荧光棒"
            height="16"
            style="margin-right:5px;"
          />剩余：{{ gift.num }}</span
        >
        <span v-else>
          <el-tag type="success" size="mini">任务已完成</el-tag>
        </span>
      </div>
      <div>
        <el-button type="info" size="mini">切换账号</el-button>
      </div>
    </header>
    <el-alert
      :title="info.title"
      :type="info.type"
      v-if="info.show"
      :closable="false"
      center
      show-icon
    >
    </el-alert>
    <main class="main">
      <el-scrollbar class="scrollbar">
        <el-table :data="fans" style="width: 100%">
          <el-table-column prop="name" label="主播" align="center">
          </el-table-column>
          <el-table-column prop="intimacy" label="亲密值" align="center">
          </el-table-column>
          <el-table-column prop="today" label="今日亲密度" align="center">
          </el-table-column>
          <el-table-column prop="ranking" label="排名" align="center">
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </main>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import init from '../function/send';
interface alertInfo {
  title: string;
  type: string;
  show: boolean;
}
@Component({})
export default class user extends Vue {
  info: alertInfo = {
    title: '',
    type: 'info',
    show: false
  };
  get user() {
    return this.$store.state.user;
  }
  get gift() {
    return this.$store.state.gift;
  }
  get fans() {
    return this.$store.state.fans;
  }
  upData() {
    this.$store
      .dispatch('getgift')
      .then(() => {
        return this.$store.dispatch('getFansList');
      })
      .then(() => {
        if (this.gift.num > 0) {
          let i = 4;
          let timer = setInterval(() => {
            i--;
            this.info.title = `${i}秒后开始赠送...`;
            this.info.show = true;
            if (i === 1) {
              this.info.show = false;
              clearInterval(timer);
              init().then(res => {
                if (res) {
                  this.upData();
                }
              });
            }
          }, 1000);
        }
      })
      .catch(() => {});
  }
  created() {
    this.upData();
  }
}
</script>
<style lang="scss" scoped>
.user {
  height: 100%;
  padding: 0px;
}
.header {
  height: 45px;
  border-bottom: 1px #ccc solid;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .userinfo {
    display: flex;
    align-items: center;
    span {
      margin-right: 10px;
    }
  }
  .gift {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.main {
  .scrollbar /deep/ {
    height: calc(100vh - 46px);
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
}
</style>
