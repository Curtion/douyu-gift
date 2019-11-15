<template>
  <div class="content">
    <div v-if="isLogin">已登陆</div>
    <div v-else class="nologin">
      <login />
    </div>
  </div>
</template>
<script lang="ts">
const { BrowserWindow } = require('electron').remote;
import { Vue, Component } from 'vue-property-decorator';
import login from '../components/nologin.vue';
@Component({
  components: {
    login
  }
})
export default class home extends Vue {
  get isLogin() {
    return this.$store.state.isLogin;
  }
}
</script>
<style lang="scss" scoped>
.content {
  height: 100%;
}
.nologin {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
