import {ipcRenderer} from 'electron'

export const sender = {
  openSetting () {
    ipcRenderer.send('open-setting-win')
  },
  closeSetting () {
    ipcRenderer.send('close-setting-win')
  },
  loadConfig () {
    ipcRenderer.send('load-config')
  },
  saveConfig (arg) {
    ipcRenderer.send('save-config', arg)
  },
  notify (arg) {
    ipcRenderer.send('notify', arg)
  },
  upload (arg) {
    ipcRenderer.send('file-upload', arg)
  },
  copy2clipboard (arg) {
    ipcRenderer.send('copy-clipboard', arg)
  },
  simUpload (arg) {
    ipcRenderer.send('sim-upload', arg)
  },
  checkUpdate () {
    ipcRenderer.send('check-update')
  }
}

export const reciever = {
  resCopy (callback) {
    ipcRenderer.on('on-copied', (event, arg) => {
      callback(arg)
    })
  },
  getConfig (callback) {
    ipcRenderer.on('on-load', (event, arg) => {
      callback(arg)
    })
  },
  resSaveConfig (callback) {
    ipcRenderer.on('on-save', (event, arg) => {
      callback(arg)
    })
  },
  resUpload (callback) {
    ipcRenderer.on('on-upload', (event, arg) => {
      callback(arg)
    })
  },
  resLog (callback) {
    ipcRenderer.on('on-log', (event, arg) => {
      callback(arg)
    })
  },
  resTrayDrops (callback) {
    ipcRenderer.on('tray-drops', (event, arg) => {
      console.info('resTrayDrops')
      callback(arg)
    })
  }
}

export function showWin (isShow) {
  if (isShow) {
    sender.openSetting()
  } else {
    sender.closeSetting()
  }
}
