import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
const db = require('electron').remote.getGlobal('db');
Vue.config.productionTip = false;
Vue.use(ElementUI);

db.findOne({}, (err: Error, res: any) => {
  if (res === null) {
    db.insert({ close: false }, function(err: Error, ress: any) {
      Vue.prototype.$id = ress._id;
    }); // 初始化存储
  } else {
    Vue.prototype.$id = res._id;
  }
});
Vue.prototype.$db = db;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
