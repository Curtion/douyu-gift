<template>
  <div class="content">
    <div v-if="isLogin" class="login">
      <div class="box-card">
        <span>
          <span>设置：</span>
          <el-checkbox v-model="run" @change="onRunChange">开机启动</el-checkbox>
          <el-checkbox v-model="close">任务完成后自动关闭</el-checkbox>
          <el-checkbox v-model="timing" @change="onTimingChange">定时运行</el-checkbox><span style="font-size: 12px">{{ runtime }}</span>
        </span>
        <span>
          <el-button size="mini" type="text" @click="updateFans">更新数据</el-button>
        </span>
      </div>
      <main class="main">
        <el-scrollbar class="scrollbar">
          <el-table :data="fans" style="width: 100%">
            <el-table-column prop="name" label="主播" align="center"></el-table-column>
            <el-table-column prop="roomid" label="房间号" align="center"></el-table-column>
            <el-table-column label="赠送比例" align="center" width="160">
              <template slot="header">
                <span>赠送比例</span>
                <i class="el-icon-question" title="默认平均分配，注意比例一定要等于100%。自动赠送时数量均向下取整。"></i>
              </template>
              <template slot-scope="scope">
                <el-input v-model="scope.row.send" size="mini" placeholder="赠送比例" style="width: 60%" @change="onChange"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
      </main>
    </div>
    <div v-else class="nologin">
      <login />
    </div>
    <el-dialog title="选择时间" :visible.sync="timingValueShow" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      选择时间：<el-time-picker v-model="timingValue" placeholder="选择每日执行时间"> </el-time-picker>
      <span slot="footer" class="dialog-footer">
        <el-button-group>
          <el-button @click="timingClose">取 消</el-button>
          <el-button type="primary" @click="timingOk">确 定</el-button>
        </el-button-group>
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts">
const { BrowserWindow } = require('electron').remote
const { ipcRenderer } = require('electron')
import { Vue, Component, Watch } from 'vue-property-decorator'
const math = require('mathjs')
import login from '../components/nologin.vue'
const CronJob = require('cron').CronJob
@Component({
  components: {
    login
  }
})
export default class home extends Vue {
  run: boolean = false
  close: boolean = false
  timing: boolean = false
  timingValue: any = null
  timingValueShow: boolean = false
  runtime: string = ''
  get isLogin() {
    return this.$store.state.isLogin
  }
  get fans() {
    return this.$store.state.fans
  }
  onRunChange(val: boolean) {
    // 自动启动按钮
    const status = ipcRenderer.sendSync('AutoLaunch', Number(val))
    if (status !== true) {
      this.$message(status)
    }
  }
  onChange(val: string) {
    // 配置赠送比列
    let strip = (num: number, precision = 12) => {
      return +parseFloat(num.toPrecision(precision))
    }
    if (!/(.*)%/.test(val)) {
      this.$message('格式不正确')
    } else {
      let count = 0
      this.fans.forEach((element: any) => {
        count = math.add(math.multiply(Number(element.send.split('%')[0]), 0.01), count)
      })
      count = strip(count)
      if (count !== 1) {
        this.$message('百分比合计不为100%')
      } else {
        this.$store.dispatch('saveNumberConfig', this.fans).then(() => {
          this.$message({
            type: 'success',
            message: '配置成功'
          })
        })
      }
    }
  }
  updateFans() {
    // 更新粉丝牌数据
    this.$store.dispatch('getFansList')
  }
  timingClose() {
    this.timingValueShow = false
    this.timing = false
    this.timingValue = null
    this.runtime = ''
    this.$db.set('runtime', null)
    if (this.$auto !== null) {
      this.$auto.stop()
    }
  }
  timingOk() {
    if (this.timingValue === null) {
      this.$message({
        type: 'error',
        message: '请选择时间'
      })
      return
    }
    let h = this.timingValue.getHours()
    let m = this.timingValue.getMinutes()
    let s = this.timingValue.getSeconds()
    this.$db.set('runtime', h + ':' + m + ':' + s)
    this.runtime = h + ':' + m + ':' + s
    this.timingValueShow = false
    setTimeout(() => {
      this.$router.push('/')
    })
  }
  onTimingChange(val: boolean) {
    if (val === true) {
      this.timingValueShow = true
    }
  }
  @Watch('timing')
  onTimingChangeWatch(newval: boolean) {
    // 监听定时设置按钮
    this.$db.set('timing', newval)
    if (newval === true) {
      this.close = false
    } else {
      this.timingClose()
    }
  }
  @Watch('close')
  onCloseChangeWatch(newval: boolean) {
    // 监听自动关闭按钮
    this.$db.set('close', newval)
    if (newval === true) {
      this.timing = false
    }
  }
  created() {
    let status = ipcRenderer.sendSync('AutoLaunch', 3)
    if (typeof status === 'boolean') {
      this.run = status
    } else {
      this.$message(status)
    }
    this.close = this.$db.get('close')
    this.timing = this.$db.get('timing')
    this.runtime = this.$db.get('runtime')
    let fans = this.$db.get('fans')
    if (!fans) {
      this.updateFans()
    } else {
      this.$store.commit('fans', JSON.parse(JSON.stringify(fans)))
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
    justify-content: space-between;
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
