import { ipcMain } from 'electron'
import server from './server'

ipcMain.handle('server-start', async(event, config) => {
    server.start(JSON.parse(config))
})

ipcMain.handle('server-restart', async(event, config) => {

})

ipcMain.handle('server-stop', async(event, config) => {

})

ipcMain.handle('server-scan', async(event, config) => {

})
