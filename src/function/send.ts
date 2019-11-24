import store from '../store/index';
import axios from 'axios';
const { session } = require('electron').remote;
import { Message } from 'element-ui';
interface DyAndsid {
  dy: string;
  sid: string;
}
async function init() {
  let DySid = await getDyAndsid();
  const sid = (DySid as DyAndsid).sid;
  const dy = (DySid as DyAndsid).dy;
  for (let item of store.state.fans) {
    await pushGift({
      prop: 268,
      rid: (item as Fans).roomid,
      num: Math.floor(
        store.state.gift.num * Number.parseInt((item as Fans).send) * 0.01
      ),
      sid,
      dy
    });
  }
  return true;
}
function getDyAndsid() {
  return new Promise((resolve, reject) => {
    (session.defaultSession as Electron.Session).cookies
      .get({ domain: 'douyu.com' })
      .then(cookies => {
        let arr: DyAndsid = {
          dy: '',
          sid: ''
        };
        cookies.forEach(item => {
          if (item.name === 'dy_did') {
            arr.dy = item.value;
          }
          if (item.name === 'acf_uid') {
            arr.sid = item.value;
          }
        });
        resolve(arr);
      })
      .catch(error => {
        reject(error);
      });
  });
}
function getDidAndRid(roomid: string) {
  return new Promise((resolve, reject) => {
    axios.get('https://www.douyu.com/' + roomid).then(res => {
      let did = res.data.match(/owner_uid =(.*?);/)[1].trim();
      if (did !== undefined) {
        resolve(did);
      } else {
        reject('did获取错误');
      }
    });
  });
}
function pushGift(payload: any) {
  return new Promise((resolve, reject) => {
    getDidAndRid(payload.rid).then((did: any) => {
      setTimeout(() => {
        Message('开始请求' + payload.rid + '房间');
        let data = new FormData();
        data.append('rid', payload.rid);
        data.append('prop_id', payload.prop);
        data.append('num', payload.num);
        data.append('sid', payload.sid);
        data.append('did', did);
        data.append('dy', payload.dy);
        axios.post('https://www.douyu.com/member/prop/send', data);
        resolve();
      }, 3000);
    });
  });
}
export default init;
