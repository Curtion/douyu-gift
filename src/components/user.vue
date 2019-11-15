<template>
  <div class="user">
    <header class="header">
      <div class="userinfo">
        <span>手机：{{ user.tel.slice(-11) }}</span>
        <img :src="user.level" alt="账号等级" />
      </div>
      <div>
        <el-button type="info" size="mini">注销/切换账号</el-button>
      </div>
    </header>
    <main class="main"></main>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import axios from 'axios';
@Component({})
export default class user extends Vue {
  params: FormData = new FormData();
  get user() {
    return this.$store.state.user;
  }
  created() {
    this.params.append('rid', '4120796');
    axios
      .post('https://www.douyu.com/member/prop/query', this.params, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(res => console.log(res.data));
    axios.get('https://www.douyu.com/member/cp/getFansBadgeList').then(res => {
      console.log(res.data);
    });
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
}
.main {
  height: calc(100% - 46px);
}
</style>
