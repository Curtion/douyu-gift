<template>
  <div id="app">
    <el-container>
      <el-aside id="aside" width="20%">
        <ul>
          <li :class="{ isActive: Active === 'home' }" @click="push('')">
            <i class="el-icon-s-home"></i><span class="name">首页</span>
          </li>
          <li
            :class="{ isActive: Active === 'config' }"
            @click="push('config')"
          >
            <i class="el-icon-s-tools"></i><span class="name">任务配置</span>
          </li>
          <li :class="{ isActive: Active === 'about' }" @click="push('about')">
            <i class="el-icon-info"></i><span class="name">关于我</span>
          </li>
        </ul>
      </el-aside>
      <el-container>
        <el-main id="main"> <router-view /> </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component({})
export default class App extends Vue {
  get Active() {
    return this.$route.name;
  }
  push(name: string) {
    if (this.$route.path !== '/' + name) {
      this.$router.push(`/${name}`);
    }
  }
}
</script>

<style lang="scss">
$hover: rgba(0, 0, 0, 0.08);
body {
  margin: 0;
  padding: 0;
}
#aside {
  height: 100vh;
  border-right: 1px rgba(236, 172, 172, 0.5) solid;
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      height: 40px;
      font-size: 16px;
      line-height: 40px;
      position: relative;
      cursor: pointer;
      padding-left: 10px;
      user-select: none;
      &:hover {
        background-color: $hover;
        opacity: 0.8;
      }
      .name {
        margin-left: 8px;
      }
    }
  }
}
.isActive {
  background-color: $hover;
  opacity: 0.8;
}
#main {
  height: 100vh;
}
#app {
  height: 100vh;
}
</style>
