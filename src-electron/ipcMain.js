import { BrowserWindow, app, ipcMain, dialog } from 'electron'
import { download } from 'electron-dl'

console.log("Register ipcMain Handler")

ipcMain.handle('open-dir', async (event, path) => {
    return dialog.showOpenDialog({ properties: ['openDirectory'] })
})

ipcMain.handle('getNetWorkInterfaces', async (event) => {
    let os = require('os');
    let ifaces = [];
    Object.keys(os.networkInterfaces()).forEach(function (ifname) {
      var alias = 0;
      os.networkInterfaces()[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
          return;
        }

        if (alias >= 1) {
          ifaces.push({
            title: `${ifname}-${alias}:${iface.address}`,
            ip: iface.address
          });
        } else {
          ifaces.push({
            title: `${ifname}: ${iface.address}`,
            ip: iface.address
          });
        }
        ++alias;
      });
    });
    return ifaces;
})

ipcMain.handle('download-server-binaries', async(event, file) => {
    console.log("Server assets to download", file)

    const win = BrowserWindow.getFocusedWindow();
    const path = app.getPath('userData') + '/bin'

    console.log("Server Binary Folder", path)

    console.log("Download file", file)
    // console.log(await download(win, url));
})
