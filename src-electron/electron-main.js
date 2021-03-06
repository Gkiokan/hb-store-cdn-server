import { app, BrowserWindow, Menu, nativeTheme } from 'electron'
import path from 'path'
import os from 'os'
import electronDl from 'electron-dl'

// Initialise
import './src/ipcMain'
import './src/ipcMain-ServerBinaryDownload'
import './src/ipcMain-Server'
import './src/ipcMain-FTP'

// Initialise config
electronDl({
    directory: app.getPath('userData') + '/bin',
    overwrite: true,
})

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(path.join(app.getPath('userData'), 'DevTools Extensions'))
  }
}
catch (_) { }

let mainWindow

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 440,
    height: 600,
    useContentSize: true,
    frame: false,
    icon: path.join(__dirname, '/icons/icon.png'),
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        enableRemoteModule: true,
        // More info: /quasar-cli/developing-electron-apps/electron-preload-script
        preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
        allowRunningInsecureContent: false,
        sandbox: false,
    }
  })

  mainWindow.setMenu(null)
  mainWindow.loadURL(process.env.APP_URL)

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools()
  }
  else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools()
    })
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Menu.setApplicationMenu(null)
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
