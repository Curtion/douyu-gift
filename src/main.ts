import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
const db = require('electron').remote.getGlobal('db');
Vue.config.productionTip = false;
Vue.use(ElementUI);

Vue.prototype.$db = db;
const vm = new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate() {
    db.find({}, (err: Error, res: any) => {
      if (res.length === 0) {
        db.insert({}, function(err: Error, ress: any) {
          Vue.prototype.$id = ress._id;
        }); // 初始化存储
      } else {
        Vue.prototype.$id = res[0]._id;
      }
    });
  }
}).$mount('#app');
export default vm;
