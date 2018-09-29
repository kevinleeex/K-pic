import {ipcRenderer} from 'electron'
// import {session} from '@/utils/storage'

export const sender = {
  openSetting () {
    let a = `${window.location.origin}/setting`
    console.info(a)
    ipcRenderer.send('open-setting-win', `${window.location.origin}/#/setting`)
  },
  closeSetting () {
    ipcRenderer.send('close-setting-win')
  }
}

export function showWin (isShow) {
  if (isShow) {
    sender.openSetting()
  } else {
    sender.closeSetting()
  }
}
