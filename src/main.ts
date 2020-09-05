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
Vue.prototype.$auto = null;
const vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

export default vm;
