const { ipcRenderer } = require('electron')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
window.onload = () => {
  checkLoginStatus().then(() => {
    
  }).catch((err) => {
    console.log(err)
  })
  let loginBtn = document.getElementsByClassName('btn-login')[0];
  loginBtn.addEventListener('click', () => {
    ipcRenderer.send('add') // 打开登陆窗口
  })
  ipcRenderer.once('loginres', (event, res)=> { // 登陆后的回调
    let logininfo = document.querySelector('.userinfo');
  })
}

function checkLoginStatus() {
  // https://www.douyu.com/member/cp/cp_rpc_ajax
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
      if (xhr.readyState==4 && xhr.status==200) {
        console.log(xhr.responseText)
        try {
          let user = JSON.parse(xhr.responseText)
          resolve()
        } catch (err) {
          reject()
        }
      }
    }
    xhr.open('GET', 'https://msg.douyu.com/v3/login/getusersig', true)
    xhr.send()
  })
}