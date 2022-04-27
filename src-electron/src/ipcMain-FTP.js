import { app, ipcMain } from 'electron'
import ftp from './ftp'

ipcMain.handle('get-logs', (event, config) => {
    ftp.getLogs(JSON.parse(config))
})

ipcMain.handle('clean-logs', (event, config) => {
    ftp.cleanLogs(JSON.parse(config))
})


ipcMain.handle('get-settings', async (event, config) => {
    await ftp.getSettings(JSON.parse(config))
})

ipcMain.handle('update-settings', async (event, config) => {
    await ftp.getSettings(JSON.parse(config))
    await ftp.updateSettings(JSON.parse(config))
})

ipcMain.handle('restore-settings', (event, config) => {
    ftp.restoreSettings(JSON.parse(config))
})
