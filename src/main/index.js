const {
  app,
  BrowserWindow,
  ipcMain,
  Tray
} = require('electron')

let tray
let window
let settingWin

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

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

const logo = `${__static}/img/icon.png`
const createTray = () => {
  tray = new Tray(logo)
  tray.on('right-click', toggleMenu)
  tray.on('double-click', toggleWindow)
  tray.on('click', function (event) {
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
    width: 380,
    height: 450,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: true,
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

  // Hide the window when it loses focus
  // window.on('blur', () => {
  //
  // })
}

const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide()
  } else {
    showWindow()
  }
}

const toggleMenu = () => {
}

function openWindow (url) {
  const win = new BrowserWindow({
    height: 500,
    width: 350,
    title: 'K-Pic',
    useContentSize: true,
    transparent: false,
    frame: false,
    darkTheme: true,
    backgroundColor: '#FFFFFFFF'
  })

  win.loadURL(url)

  win.on('closed', () => {
    settingWin = null
  })

  return win
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

ipcMain.on('open-setting-win', (event, url) => {
  if (settingWin) {
    settingWin.focus()
  } else {
    settingWin = openWindow(url)
  }
})

ipcMain.on('close-setting-win', (event) => {
  settingWin.close()
})
