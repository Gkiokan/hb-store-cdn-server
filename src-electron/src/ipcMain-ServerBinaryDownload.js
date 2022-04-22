import { BrowserWindow, app, ipcMain, dialog } from 'electron'
import { download } from 'electron-dl'

ipcMain.handle('download-server-binaries', async(event, file) => {
    console.log("Server assets to download", file)

    const win = BrowserWindow.getFocusedWindow();
    const path = app.getPath('userData') + '/bin'

    console.log("Server Binary Folder", path)
    console.log("Download file", file)

    try {
        await download(win, file, {
            directory: path,
            overwrite: true,
        })
    }
    catch (e) { alert(e);  console.error('(download)', e); }

    // console.log(await download(win, url));
})
