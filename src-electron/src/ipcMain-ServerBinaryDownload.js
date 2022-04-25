import { BrowserWindow, app, ipcMain, dialog } from 'electron'
import { download } from 'electron-dl'
import fs from 'fs'

ipcMain.handle('download-server-binaries', async(event, file) => {
    console.log("Server assets to download", file)

    // const win = BrowserWindow.getFocusedWindow();
    let win = BrowserWindow.getFocusedWindow();

    if(!win){
        let all = BrowserWindow.getAllWindows()
        win = all[0]
    }

    const path = app.getPath('userData') + '/bin'

    if (!fs.existsSync(path)){
        fs.mkdirSync(path);
    }

    console.log("Server Binary Folder", path)
    console.log("Download file", file)

    try {
        await download(win, file, {
            directory: path,
            overwrite: true,
            onProgress: o => win.webContents.send('download-complete', { file, item: o }),
            errorMessage: e => alert(e),
        })
    }
    catch (e) { alert(e);  console.error('(download)', e); }

    // console.log(await download(win, url));
})


ipcMain.handle('trigger-check-server-binaries', () => {
    let win = BrowserWindow.getFocusedWindow();

    if(!win){
        let all = BrowserWindow.getAllWindows()
        win = all[0]
    }

    win.webContents.send('check-server-binaries')
})
