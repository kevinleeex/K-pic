/* eslint-disable no-unused-vars */
const {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  shell,
  Menu,
  Tray
} = require('electron')
const os = require('os')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const storage = require('electron-json-storage')
const {autoUpdater} = require('electron-updater')
const {download} = require('electron-dl')
const {control} = require('./control')
const {uploader} = require('./uploader')
let tray
let window
let settingWin
let contextMenu
let manualUpdate

const productionDev = false
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

const storagePath = path.join(os.homedir(), 'k-pic')
if (!fs.existsSync(storagePath)) {
  fs.mkdirSync(storagePath)
}
storage.setDataPath(storagePath)

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

const setURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/#/setting`
  : `file://${__dirname}/index.html#setting` // this is a trick to write the url

// Hide the app in dock on Mac
app.dock.hide()
app.on('ready', () => {
  manualUpdate = false
  createTray()
  createWindow()
  if (process.env.NODE_ENV !== 'development') {
    // autoUpdater.checkForUpdatesAndNotify()
    autoUpdater.checkForUpdates()
  }
})

// Quit the app when the window is closed
app.on('window-all-closed', () => {
  app.quit()
})

// define vars
const logo = `${__static}/img/kpicTemplate.png`

const createTray = () => {
  tray = new Tray(logo)
  // tray.setContextMenu(contextMenu)
  contextMenu = Menu.buildFromTemplate([{
    label: 'Quit',
    click: () => {
      app.quit()
    }
  }])
  tray.on('right-click', function (event) {
    console.info('right-click tray')
    toggleMenu()
  })
  tray.on('drop-files', function (event, files) {
    console.info(JSON.stringify(files))
    window.webContents.send('tray-drops', files)
    // event.sender.send('tray-drops', files)
  })
  tray.on('double-click', toggleWindow)
  tray.on('click', function (event) {
    console.info('click tray')
    toggleWindow()

    // Show devtools when command clicked
    // if (window.isVisible() && process.defaultApp && event.metaKey) {
    //   window.openDevTools({
    //     mode: 'detach'
    //   })
    // }
  })
}

const getWindowPosition = () => {
  const windowBounds = window.getBounds()
  const trayBounds = tray.getBounds()
  // Center window horizontally below the tray icon
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))
  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4)
  return {
    x: x,
    y: y
  }
}

const createWindow = () => {
  window = new BrowserWindow({
    width: 360,
    height: 480,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    alwaysOnTop: true,
    transparent: true,
    webPreferences: {
      // Prevents renderer process code from not running when window is
      // hidden
      backgroundThrottling: false
    }
  })
  // load the user interface
  if (productionDev) {
    window.webContents.openDevTools()
  }
  window.loadURL(winURL)
}

const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide()
  } else {
    showWindow()
  }
}

const toggleMenu = () => {
  tray.popUpContextMenu(contextMenu)
}

const openWindow = (url) => {
  settingWin = new BrowserWindow({
    height: 530,
    width: 850,
    title: 'K-Pic',
    show: false,
    useContentSize: true,
    alwaysOnTop: false,
    transparent: false,
    frame: false,
    darkTheme: true,
    backgroundColor: '#FFFFFFFF',
    webPreferences: {
      // Prevents renderer process code from not running when window is
      // hidden
      backgroundThrottling: false
    }
  })

  settingWin.loadURL(url)
  settingWin.once('ready-to-show', () => {
    settingWin.show()
  })

  settingWin.on('closed', () => {
    settingWin = null
  })

  let template = [{
    label: 'Application',
    submenu: [
      {label: 'About Application', selector: 'orderFrontStandardAboutPanel:'},
      {type: 'separator'},
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: function () {
          app.quit()
        }
      }
    ]
  }, {
    label: 'Edit',
    submenu: [
      {label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:'},
      {label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:'},
      {type: 'separator'},
      {label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:'},
      {label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:'},
      {label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:'},
      {label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:'}
    ]
  }
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))

  return settingWin
}

const showWindow = () => {
  const position = getWindowPosition()
  window.setPosition(position.x, position.y, false)
  window.show()
  window.focus()
}

// update section
function computeSHA (file) {
  if (fs.existsSync(file)) {
    let buffer = fs.readFileSync(file)
    let fsHash = crypto.createHash('sha512')
    fsHash.update(buffer)
    let sha512 = fsHash.digest('hex')
    console.info(sha512)
    return sha512
  } else {
    return 'File does not exist.'
  }
}

function updateNow (info) {
  console.info('updateNow')
  app.dock.show()
  let suffix = ''
  if (process.platform === 'darwin') {
    suffix = '.dmg'
    sendMessage(suffix)
  }
  const remoteBase = 'http://github.com/kevinleeex/K-pic/releases/download/v' + info.version
  const remoteFileName = 'k-pic-' + info.version + suffix
  const remoteFile = path.join(remoteBase, remoteFileName)

  // local
  const localPackageBase = path.join(storagePath, 'tmp')
  if (!fs.existsSync(localPackageBase)) {
    fs.rmdirSync(localPackageBase)
    fs.mkdirSync(localPackageBase)
  }
  const localFileName = 'update' + suffix
  const localFile = path.join(localPackageBase, localFileName)

  sendMessage({remoteFile: remoteFile, localFile: localFile})
  const config = {
    directory: localPackageBase,
    filename: localFileName,
    onProgress: (progress) => {
      console.log(progress * 100 + '%')
      sendMessage('Cur progress: %s %' + progress * 100)
    },
    onStarted: (item) => {
      sendMessage('Started download')
    }
  }

  sendMessage('Start download')
  download(BrowserWindow.getFocusedWindow(), remoteFile, config).then(() => dialog.showMessageBox({
    title: '下载完成',
    message: '下载完成，点击更新到: v' + info.version,
    detail: 'Click quit and install (manually)...'
  }, () => {
    manualUpdate = false
    shell.openItem(localFile)
  })).catch(console.error)
}

function sendMessage (log) {
  window.webContents.send('on-log', log)
}

function updateSets () {
  console.info('App starting...')
  autoUpdater.on('checking-for-update', () => {
    console.info('checking for update')
  })
  autoUpdater.on('update-available', (info) => {
    dialog.showMessageBox({
      type: 'info',
      title: '[K-pic]发现可用更新',
      message: '[K-pic]发现可用更新, 是否下载?(Update now?)',
      detail: '发布时间: [' + info.releaseDate + '] ' + '版本: v' + info.version + ', \n' + (info.releaseNotes).replace(/<(?:.|\n)*?>/gm, ''),
      buttons: ['是(Y)', '否(N)']
    }, (buttonIndex) => {
      if (buttonIndex === 0) {
        updateNow(info)
        // shell.openExternal(releaseBase + info.version)
        // autoUpdater.downloadUpdate()
      } else {
        app.dock.hide()
      }
    })
  })
  autoUpdater.on('update-not-available', (info) => {
    if (manualUpdate) {
      dialog.showMessageBox({title: '当前是最新版本', message: '当前是最新版本: v' + info.version, detail: 'Up to date'}, () => {
        manualUpdate = false
      })
    }
  })
}

updateSets()
// end update section

// listen request
ipcMain.on('show-window', () => {
  showWindow()
})

ipcMain.on('open-setting-win', (event) => {
  // Create the Application's main menu
  if (settingWin) {
    settingWin.focus()
  } else {
    settingWin = openWindow(setURL)
  }
})

ipcMain.on('close-setting-win', (event) => {
  settingWin.close()
})

ipcMain.on('load-config', (event) => {
  control.loadConfig(event)
})

ipcMain.on('save-config', (event, arg) => {
  control.saveConfig(event, arg)
  window.webContents.reload() // reload the content after update the config
})

ipcMain.on('notify', (event, arg) => {
  control.notify(event, arg)
})

ipcMain.on('file-upload', (event, arg) => {
  console.info('Start upload with', JSON.stringify(arg))
  uploader.upload(event, arg)
})

ipcMain.on('sim-upload', (event, arg) => {
  console.info('Start upload with', JSON.stringify(arg))
  uploader.simUpload(event, arg)
})

ipcMain.on('check-update', (event) => {
  if (process.env.NODE_ENV !== 'development' || productionDev === true) {
    manualUpdate = true
    // updateNow()
    autoUpdater.checkForUpdates()
  }
})

ipcMain.on('copy-clipboard', (event, arg) => {
  uploader.copy2clipboard(event, arg)
})
