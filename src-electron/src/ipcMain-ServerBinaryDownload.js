import { BrowserWindow, app, ipcMain, dialog } from 'electron'
import { download } from 'electron-dl'
import fs from 'fs'
import path from 'path'
import extract from 'extract-zip'

console.assert = () => {};

ipcMain.handle('download-server-binaries', async(event, file) => {
    console.log("Server assets to download", file)

    // const win = BrowserWindow.getFocusedWindow();
    let win = BrowserWindow.getFocusedWindow();

    if(!win){
        let all = BrowserWindow.getAllWindows()
        win = all[0]
    }

    const binPath = app.getPath('userData') + '/bin'

    if (!fs.existsSync(binPath)){
        fs.mkdirSync(binPath);
    }

    console.log("Server Binary Folder", binPath)
    console.log("Download file", file)

    try {
        await download(win, file, {
            directory: binPath,
            overwrite: true,
            onProgress: o => win.webContents.send('download-complete', { file, item: o }),
            errorMessage: e => alert(e),
        })

        console.log("File should be downloaded " + file)

        // Post downlaod process 
        if( file.includes('.zip')){
            console.log("Found a zip file to extract at " + file)

            let filename = path.basename(file)
            let filePath = binPath + '/' + filename

            console.log({ filename, filePath, binPath })

            try {
                console.log("[....] Extracting " + filename)
                extract(filePath, { dir: binPath })
                console.log("[done] Extracting " + filename)
            }
            catch(e){
                console.log("Error Extracting file " + filename)
            }
        }
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
