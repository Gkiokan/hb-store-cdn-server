import { ipcMain, dialog } from 'electron'

console.log("Register ipcMain Handler")

ipcMain.handle('open-dir', async (event, path) => {
    return dialog.showOpenDialog({ properties: ['openDirectory'] })
})
