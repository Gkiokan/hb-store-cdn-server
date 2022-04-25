import { app, ipcMain } from 'electron'
import ftp from './ftp'

ipcMain.handle('get-logs', (event, config) => {
    ftp.getLogs(JSON.parse(config))
})

ipcMain.handle('update-settings', (event, config) => {
    ftp.updateSettings(JSON.parse(config))
})

ipcMain.handle('restore-settings', (event, config) => {
    ftp.restoreSettings(JSON.parse(config))
})
