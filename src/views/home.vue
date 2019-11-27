<template>
  <div class="home">
    <div class="login" v-if="isLogin">
      <user />
    </div>
    <div v-else class="nologin">
      <login />
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import login from '../components/nologin.vue';
import user from '../components/user.vue';
@Component({
  components: {
    login,
    user
  }
})
export default class home extends Vue {
  get isLogin() {
    return this.$store.state.isLogin;
  }
}
</script>
<style lang="scss" scoped>
.home {
  height: 100%;
}
.login {
  height: 100%;
}
.nologin {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
