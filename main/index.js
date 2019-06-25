const { ipcRenderer } = require('electron')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
window.onload = () => {
  checkLogin();
  ipcRenderer.once('loginres', (event, res)=> { // 登陆后的回调
    checkLogin();
  })
}

function checkLogin() { // 登录后执行的操作
  let logininfo = document.querySelector('.userinfo');
  let userdata = document.querySelector('.userdata');
  userdata.innerHTML = '<div class="data"></div><div class="num"></div>'
  logininfo.innerHTML = `<span>账号信息加载中</span>
  <div class="pswp__preloader__icn">
    <div class="pswp__preloader__cut">
      <div class="pswp__preloader__donut"></div>
    </div>
  </div>`
  checkLoginStatus().then((phone) => { // 登录成功
    logininfo.innerHTML = `<div style="display: flex; justify-content: space-between; width: 100%"><div>账号:${phone.slice(5, 16)}&nbsp;&nbsp;
    <button class="am-btn am-btn-primary am-btn-xs am-round btn-restart">刷新数据
    </button></div>
    <button class="am-btn am-btn-warning am-btn-xs am-round btn-logout">退出账号
    </button></div>
    `
    let loginBtn = document.getElementsByClassName('btn-restart')[0];
    loginBtn.addEventListener('click', () => { // 刷新按钮
      checkLogin();
    })
    let logoutBtn = document.getElementsByClassName('btn-logout')[0];
    logoutBtn.addEventListener('click', () => { // 退出按钮
      const xhr = new XMLHttpRequest()
      xhr.onreadystatechange = () => {
        if (xhr.readyState==4 && xhr.status==200) {
          try {
            checkLogin();
          } catch (err) {
            alert(err)
          }
        }
      }
      xhr.open('GET', 'https://passport.douyu.com/sso/logout?client_id=1', true)
      xhr.send()
    })
    restart(); // 获得数据信息
  }).catch(() => { // 登录失败
    logininfo.innerHTML = '<button type="button" class="am-btn am-btn-success am-btn-sm btn-login">登陆账号</button>'
    let loginBtn = document.getElementsByClassName('btn-login')[0];
    loginBtn.addEventListener('click', () => {
      ipcRenderer.send('add') // 打开登陆窗口
    })
  })
}

function restart() { // 获得数据信息
  let data = document.querySelector('.data');
  let num = document.querySelector('.num');
  getProp().then((res) => {
    res = JSON.parse(res)
    if(res.data.list.length === 0) {
      data.innerHTML = '没有检测到背包中的荧光棒，如果你今日已经赠送，请明日再启动软件!'
      return
    }
    let lwdata = '';
    for(let i = 0; i < res.data.list.length; i++) {
      if(res.data.list[i].prop_id === 268) {
        db.set('num', res.data.total_num).write()
        lwdata = `<li style="height: 50px; display: flex; align-items: center;">
        <div style="display: flex; justify-content: space-between; width: 100%;">
          <div><img src="${res.data.list[i].gif}" height="30">&nbsp;&nbsp;${res.data.list[i].name}</div>
          <span class="am-badge am-badge-success" style="line-height: 22px; margin-right: 20px;">${res.data.list[i].count}个</span>
        </div>
       </li>`
       break
      } else {
        data.innerHTML = '今日荧光棒已赠送'
      }
    }
    data.innerHTML = `<ul class="am-list am-list-border am-list-striped">${lwdata}</ul>`
  }).catch(() => {
    data.innerHTML = '请检查你的网络..'
  })
  getFansBadgeList().then((res) => {
    res = stringToDom(res)
    let list = res.querySelector('.fans-badge-list')
    let number = db.get('num').value()
    let avg = Math.floor(number/(list.rows.length-1))
    let difference = 0 // 差值
    let newavg = 0 //新值
    if(avg * (list.rows.length - 1) !== number) {
      difference = number - avg * (list.rows.length - 1)
      if (difference !== 0) {
        newavg = avg + 1
      }
    }
    let data = ''
    ipcRenderer.on('pushCookie', (event, res)=> { // 获得cookie后的回调
      for(let i = 1; i < list.rows.length; i++) {
        let level = list.rows[i].cells[0].querySelector('.fans-badge-icon').getAttribute('data-ui-level')
        let roomid = list.rows[i].cells[1].querySelector('.anchor--name').getAttribute('href').slice(1)
        let name = list.rows[i].cells[1].querySelector('.anchor--name').innerHTML
        let exp = list.rows[i].cells[2].innerHTML.replace(/^\s+|\s+$/g,"")
        let nowjy = list.rows[i].cells[3].querySelector('span').innerHTML
        let ranking = list.rows[i].cells[4].innerHTML.replace(/^\s+|\s+$/g,"")
        data += `<tr>
                <td>${name}</td>
                <td>${roomid}</td>
                <td>${level}</td>
                <td>${exp}</td>
                <td>${nowjy}</td>
                <td>${ranking}</td>
                <td contenteditable="true" class="am-active">${difference === 0 ? avg: newavg}</td>
                </tr>`
        if(difference === 0) {
          getSendinfo({
            roomid: roomid,
            avg: avg,
            name: name,
            cookie: res
          })
        }else {
          getSendinfo({
            roomid: roomid,
            avg: newavg,
            name: name,
            cookie: res
          })
          difference--
        }
      }
      num.innerHTML = `<table class="am-table am-table-bordered am-table-radius am-table-centered">
                      <thead style="background-color: #F5F5F5;">
                        <tr>
                          <td>主播</td>
                          <td>房间号</td>
                          <td>等级</td>
                          <td>经验</td>
                          <td>今日亲密度</td>
                          <td>排名</td>
                          <td>每日赠送</td>
                        </tr>
                      </thead>
                      <tbody>
                      ${data}
                      </body>
                      </table>`
    })
    ipcRenderer.send('getCookie') // 开始获得cookie
  })
}

function getProp() { // 礼物查询
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
      if (xhr.readyState==4 && xhr.status==200) {
        try {
          resolve(xhr.responseText)
        } catch (err) {
          reject(err)
        }
      }
    }
    xhr.open('POST', 'https://www.douyu.com/member/prop/query', true)
    let data = new FormData();
    data.append("rid", 4120796);
    xhr.send(data)
  })
}

function getFansBadgeList() { // 获得粉丝牌
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
      if (xhr.readyState==4 && xhr.status==200) {
        try {
          resolve(xhr.responseText)
        } catch (err) {
          reject(err)
        }
      }
    }
    xhr.open('get', 'https://www.douyu.com/member/cp/getFansBadgeList', true)
    xhr.send()
  })
}

function checkLoginStatus() { // 检测是否登录
  // https://www.douyu.com/member/cp/cp_rpc_ajax
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
      if (xhr.readyState==4 && xhr.status==200) {
        try {
          let user = JSON.parse(xhr.responseText)
          resolve(user.info.mobile_phone)
        } catch (err) {
          reject(err)
        }
      }
    }
    xhr.open('GET', 'https://www.douyu.com/member/cp/cp_rpc_ajax', true)
    xhr.send()
  })
}

function getSendinfo(obj) {
  $.blockUI({ message: `等待${obj.name}的房间信息载入...` })
  getRoomidInfo(obj.roomid).then((res) => {
    let dy_did, acf_uid;
    for(let i = 0; i < obj.cookie.length; i++) {
      if(obj.cookie[i].name === 'dy_did') {
        dy_did = obj.cookie[i].value
      }
      if(obj.cookie[i].name === 'acf_uid') {
        acf_uid = obj.cookie[i].value
      }
    }
    let did = res.match(/owner_uid =(.*?);/)[1]
    let sendInfo = {
      num: obj.avg,
      sid: acf_uid,
      did: did,
      rid: obj.roomid,
      dy: dy_did
    }
    db.get('send').push(sendInfo).write()
    $.unblockUI()
  }).catch((err) => {
    alert("信息载入错误..." + err)
    $.unblockUI();
  })
}

function getRoomidInfo(roomid) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
      if (xhr.readyState==4 && xhr.status==200) {
        try {
          resolve(xhr.responseText)
        } catch (err) {
          reject(err)
        }
      }
    }
    xhr.open('GET', 'https://www.douyu.com/' + roomid, true)
    xhr.send()
  })
}

function stringToDom(txt) { // 字符串转dom
  var obj = document.createElement("div"); 
  obj.innerHTML = txt; 
  return obj; 
}