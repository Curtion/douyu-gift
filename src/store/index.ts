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
    },
    gift: {
      num: 0, //荧光棒数量
      gif: '' // 荧光棒礼物图标地址
    },
    fans: [], // 粉丝牌数据,
    loading: false
  },
  mutations: {
    /**
     * 登录得状态
     *
     * @param {*} state
     * @param {boolean} status
     */
    login(state, status: boolean) {
      state.isLogin = status;
    },
    /**
     * 用户信息，手机号与等级
     *
     * @param {*} state
     * @param {*} { tel, level }
     */
    user(state, { tel, level }) {
      state.user.tel = tel;
      state.user.level = level;
    },
    /**
     * 查询荧光棒得数量
     *
     * @param {*} state
     * @param {*} number
     */
    gift(state, { num, gif }) {
      state.gift.num = num;
      state.gift.gif = gif;
    },
    fans(state, payload) {
      state.fans = payload;
    }
  },
  actions: {
    /**
     * 检测是否登录，在初始化软件时检测/或者关闭登录窗口时检测
     *
     * @param {*} { commit }
     */
    checkLogin({ commit }) {
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
    },
    /**
     * 获取荧光棒数量
     *
     * @param {*} { commit }
     */
    getgift({ commit }) {
      let params: FormData = new FormData();
      params.append('rid', '4120796');
      axios
        .post('https://www.douyu.com/member/prop/query', params, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(res => {
          let isOn: boolean = false;
          let index: number = 0;
          isOn = res.data.data.list.some((element: any, i: number) => {
            if (element.prop_id === 268) {
              index = i;
              return true;
            }
          });
          if (isOn) {
            commit('gift', {
              num: res.data.data.list[index].count,
              gif: res.data.data.list[index].gif
            });
          } else {
            commit('gift', { num: 0, git: '' });
          }
        });
    },
    getFansList({ commit, state }) {
      state.loading = true;
      axios
        .get('https://www.douyu.com/member/cp/getFansBadgeList')
        .then(res => {
          let table = res.data.match(/fans-badge-list">([\S\s]*?)<\/table>/)[1];
          let list = table.match(/<tr([\s\S]*?)<\/tr>/g);
          let arr: Array<Object> = [];
          list.slice(1).forEach((element: string) => {
            let obj: Fans = {
              name: '',
              intimacy: '',
              today: '',
              ranking: '',
              send: '',
              roomid: ''
            };
            (element.match(/<td([\s\S]*?)<\/td>/g) as Array<string>)
              .slice(1, 5)
              .forEach((val: string, index: number) => {
                obj.send = '';
                switch (index) {
                  case 0:
                    obj.name = val.replace(/<([\s\S]*?)>/g, '').trim();
                    val.match(/href="\/([\s\S]*?)"/);
                    obj.roomid = RegExp.$1;
                    break;
                  case 1:
                    obj.intimacy = val.replace(/<([\s\S]*?)>/g, '').trim();
                    break;
                  case 2:
                    obj.today = val.replace(/<([\s\S]*?)>/g, '').trim();
                    break;
                  case 3:
                    obj.ranking = val.replace(/<([\s\S]*?)>/g, '').trim();
                    break;
                  default:
                    break;
                }
              });
            arr.push(obj);
          });
          arr.forEach((ele: any) => {
            ele.send = Math.floor(100 / arr.length) + '%';
          });
          state.loading = false;
          commit('fans', arr);
        });
    }
  }
});
