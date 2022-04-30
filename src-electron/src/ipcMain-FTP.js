import { app, ipcMain } from 'electron'
import ftp from './ftp'

ipcMain.handle('get-logs', (event, config, log) => {
    ftp.getLogs(JSON.parse(config), log)
})

ipcMain.handle('clean-logs', (event, config) => {
    ftp.cleanLogs(JSON.parse(config))
})


ipcMain.handle('get-settings', async (event, config) => {
    await ftp.getSettings(JSON.parse(config))
})

ipcMain.handle('update-settings', async (event, config) => {
    // await ftp.getSettings(JSON.parse(config))
    await ftp.updateSettings(JSON.parse(config))
})
