import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { Message } from 'element-ui';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin: false,
    user: {
      tel: '', // 手机号
      level: '' // 等级img地址
    }
  },
  mutations: {
    login(state, status: boolean) {
      state.isLogin = status;
    },
    user(state, { tel, level }) {
      state.user.tel = tel;
      state.user.level = level;
    }
  },
  actions: {
    checkLogin({ commit, state }) {
      axios
        .get('https://www.douyu.com/member/cp/cp_rpc_ajax')
        .then(res => {
          if (typeof res.data === 'object') {
            commit('login', true);
            commit('user', {
              tel: res.data.info.mobile_phone,
              level: res.data.exp_info.current.pic_url
            });
          } else {
            commit('login', false);
          }
        })
        .catch(err => {
          Message({
            type: 'error',
            message: err
          });
        });
    }
  }
});
