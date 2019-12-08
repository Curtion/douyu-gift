import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
let Datastore = require('nedb'),
  db = new Datastore({ filename: 'path/to/config.json', autoload: true });
Vue.config.productionTip = false;

Vue.use(ElementUI);
db.insert({ close: false }, function(err: Error, res: any) {
  Vue.prototype.$id = res._id;
}); // 初始化存储
Vue.prototype.$db = db;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
