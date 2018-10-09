/* eslint-disable no-unused-vars */
const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  Tray
} = require('electron')
const os = require('os')
const path = require('path')
const storage = require('electron-json-storage')
const {control} = require('./control')
const {uploader} = require('./uploader')
let tray
let window
let settingWin
let contextMenu
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

const storagePath = path.join(os.homedir(), 'k-pic')
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
  createTray()
  createWindow()
})

// Quit the app when the window is closed
app.on('window-all-closed', () => {
  app.quit()
})

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
  tray.on('double-click', toggleWindow)
  tray.on('click', function (event) {
    console.info('click tray')
    toggleWindow()

    // Show devtools when command clicked
    if (window.isVisible() && process.defaultApp && event.metaKey) {
      window.openDevTools({
        mode: 'detach'
      })
    }
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
    height: 480,
    width: 850,
    title: 'K-Pic',
    show: false,
    useContentSize: true,
    alwaysOnTop: true,
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

  return settingWin
}

const showWindow = () => {
  const position = getWindowPosition()
  window.setPosition(position.x, position.y, false)
  window.show()
  window.focus()
}

ipcMain.on('show-window', () => {
  showWindow()
})

ipcMain.on('open-setting-win', (event) => {
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
