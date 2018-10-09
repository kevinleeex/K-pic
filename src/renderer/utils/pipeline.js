import {ipcRenderer} from 'electron'

export const sender = {
  openSetting () {
    ipcRenderer.send('open-setting-win', `${window.location.origin}/#/setting`)
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
    ipcRenderer.send('upload', arg)
  }
}

export const reciever = {
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
  }
}

export function showWin (isShow) {
  if (isShow) {
    sender.openSetting()
  } else {
    sender.closeSetting()
  }
}
