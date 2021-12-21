import store from '../store/index'
import axios from 'axios'
const { session } = require('electron').remote
import { Message } from 'element-ui'
const log = require('electron-log')
interface DyAndsid {
  dy: string
  sid: string
}
async function init(fans: any) {
  log.info('开始赠送')
  let DySid = await getDyAndsid()
  const sid = (DySid as DyAndsid).sid
  const dy = (DySid as DyAndsid).dy
  let Remaining = store.state.gift.num // 剩余数量
  log.info('sid获取成功:' + sid)
  log.info('dy获取成功:' + dy)
  for (let [index, item] of fans.entries()) {
    let num = Math.floor(store.state.gift.num * Number.parseInt((item as Fans).send) * 0.01)
    if (index === fans.length - 1) {
      // 最后一次全部赠送，防止分配不均
      num = Remaining
    }
    let gift = {
      prop: 268,
      rid: (item as Fans).roomid,
      num,
      sid,
      dy
    }
    await pushGift(gift)
    Remaining = Remaining - num
  }
  return true
}
function getDyAndsid() {
  return new Promise((resolve, reject) => {
    ;(session.defaultSession as Electron.Session).cookies
      .get({ domain: 'douyu.com' })
      .then(cookies => {
        let arr: DyAndsid = {
          dy: '',
          sid: ''
        }
        cookies.forEach(item => {
          if (item.name === 'dy_did') {
            arr.dy = item.value
          }
          if (item.name === 'acf_uid') {
            arr.sid = item.value
          }
        })
        resolve(arr)
      })
      .catch(error => {
        log.warn('sid、dy获取失败')
        reject(error)
      })
  })
}
function getDidAndRid(roomid: string) {
  return new Promise((resolve, reject) => {
    log.info('获取"' + roomid + '"房间获取did值开始')
    axios.get('https://www.douyu.com/' + roomid).then(res => {
      let rid = res.data.match(/\$ROOM\.room_id =(.*?);/)[1].trim()
      let did = res.data.match(/owner_uid =(.*?);/)[1].trim()
      if (did !== undefined) {
        log.info('获取"' + roomid + '"房间获取did值结束，成功:' + did)
        resolve([did, rid !== undefined ? rid : roomid])
      } else {
        log.warn('获取"' + roomid + '"房间获取did值结束，失败')
        reject('did获取错误')
      }
    })
  })
}
function pushGift(payload: any) {
  return new Promise<void>((resolve, reject) => {
    getDidAndRid(payload.rid).then((DidAndRid: any) => {
      const [did, rid] = DidAndRid
      setTimeout(() => {
        log.info('赠送"' + rid + '"房间开始，数量：' + payload.num)
        Message('开始请求' + rid + '房间')
        let data = new FormData()
        data.append('rid', rid)
        data.append('prop_id', payload.prop)
        data.append('num', payload.num)
        data.append('sid', payload.sid)
        data.append('did', did)
        data.append('dy', payload.dy)
        axios
          .post('https://www.douyu.com/member/prop/send', data)
          .then((res: any) => {
            log.info('赠送"' + payload.rid + '"房间结束，赠送结果:' + JSON.stringify(res.data))
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      }, 3000)
    })
  })
}
export default init
