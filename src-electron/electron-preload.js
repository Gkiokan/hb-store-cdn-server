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

import { contextBridge, remote } from 'electron'
import { ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('hb', {
    openBasePathDialog: () => ipcRenderer.invoke('open-dir'),
    getNetWorkInterfaces: () => ipcRenderer.invoke('getNetWorkInterfaces'),
    downloadServerBinaries: (f) => ipcRenderer.invoke('download-server-binaries', f),
    ipcRenderer: () =>  ipcRenderer,
})

contextBridge.exposeInMainWorld('ipc', {
    on: (channel, cb) => ipcRenderer.on(channel, cb),
})


contextBridge.exposeInMainWorld('server', {
    on: (channel, cb) => ipcRenderer.on(channel, cb),
    start: (server) => ipcRenderer.invoke('server-start', sever),
    restart: (server) => ipcRenderer.invoke('server-restart', server),
    stop: () => ipcRenderer.invoke('server-stop'),
    scan: (server) => ipcRenderer.invoke('server-scan', server),
})
