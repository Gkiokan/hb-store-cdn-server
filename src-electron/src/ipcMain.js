import { BrowserWindow, app, ipcMain, dialog } from 'electron'
import { download } from 'electron-dl'

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
