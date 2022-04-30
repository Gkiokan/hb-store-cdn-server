/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 */

import { contextBridge } from 'electron'
import { ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('hb', {
    openBasePathDialog: () => ipcRenderer.invoke('open-dir'),
    getNetWorkInterfaces: () => ipcRenderer.invoke('getNetWorkInterfaces'),
    downloadServerBinaries: (f) => ipcRenderer.invoke('download-server-binaries', f),
    closeApplication: () => ipcRenderer.invoke('closeApplication'),
})

contextBridge.exposeInMainWorld('ipc', {
    on: (channel, cb) => ipcRenderer.on(channel, cb),
    open: (url) => ipcRenderer.invoke('open-url', url),
    removeListener: (channel, cb) => ipcRenderer.removeAllListeners(channel),
    checkServerBinaries: (ch, cb) => ipcRenderer.invoke('trigger-check-server-binaries')
})

contextBridge.exposeInMainWorld('server', {
    start: (server) => ipcRenderer.invoke('server-start', server),
    restart: (server) => ipcRenderer.invoke('server-restart', server),
    stop: () => ipcRenderer.invoke('server-stop'),
    scan: (server) => ipcRenderer.invoke('server-scan', server),
})

contextBridge.exposeInMainWorld('ftp', {
    getLogs: (server) => ipcRenderer.invoke('get-logs', server),
    cleanLogs: (server) => ipcRenderer.invoke('clean-logs', server),
    getSettings: (server) => ipcRenderer.invoke('get-settings', server),
    updateSettings: (server) => ipcRenderer.invoke('update-settings', server),
    restoreSettings: (server) => ipcRenderer.invoke('restore-settings', server),
})
