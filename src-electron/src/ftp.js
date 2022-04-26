import { app, BrowserWindow, dialog } from 'electron'
import { download } from 'electron-dl'
import { Client } from 'basic-ftp'
import path from 'path'
import fs from 'fs'

export default {
    ip: "",
    port: "",

    files: {
        localLog: "",
        log: "/user/app/NPXS39041/logs/log.txt",
        settings: "/user/app/NPXS39041/settings.ini",
    },

    getWindow(){
        let win = BrowserWindow.getFocusedWindow();

        if(!win){
            let all = BrowserWindow.getAllWindows()
            win = all[0]
        }

        return win
    },

    setConfig(config){
        this.ip       = config.ps4ip
        this.port     = config.ps4port
        this.files.localLog = app.getPath('userData') + '/data/' + path.basename(this.files.log)
    },

    error(err=null){
        // deprecated
        // const win = BrowserWindow.getFocusedWindow();
        this.getWindow().webContents.send('error', err)
        this.log(err)
    },

    log(msg=null){
        this.getWindow().webContents.send('log', msg)
        console.log("FTP:: " + msg)
    },

    loading(msg=null){
        this.getWindow().webContents.send('loading', msg)
        console.log("Loading:: " + JSON.stringify(msg))
    },

    async getClient(){
        const client = new Client(1000)
        client.ftp.verbose = true

        try {
            await client.access({
                host: this.ip,
                port: this.port,
                user: "anonymous",
                password: "anonymous",
                secureOptions: {
                    rejectUnauthorized: false,
                }
            })

            client.trackProgress(info => {
                console.log("File", info.name)
                console.log("Type", info.type)
                console.log("Transferred", info.bytes)
                console.log("Transferred Overall", info.bytesOverall)
            })
        }
        catch(err) {
            this.error(err)
        }

        return client
    },

    async getLogs(config){
        this.setConfig(config)
        this.log("Trying to get logs from hb-store ")
        this.loading({ message: "Connecting to the PS4 though FTP" })

        let client = await this.getClient()
        await client.downloadTo(this.files.localLog, this.files.log)
        client.close()

        this.log("got log.txt, let's save it to the user space")
        this.loading({ message: "Loading log.txt, where should we save it?" })

        let win = this.getWindow()
        let targetLogFile = await dialog.showSaveDialog(win, {
            title: "Save HB-Store logs.txt ",
            defaultPath: "*/log.txt",
            buttonLabel: "Save HB-Store Log",
            filters: [
                { name: "HB-Store Log.txt", extensions: ['txt'] }
            ]
        })

        this.loading({ hide: true })
        if(targetLogFile.canceled) return

        await fs.copyFileSync(this.files.localLog, targetLogFile.filePath)
        this.log("HB-Store log.txt downloaded")
    },

    updateSettings(config){
        this.setConfig(config)

        this.log("Update settings.ini of hb-store")
    },

    restoreSettings(config){
        this.setConfig(config)

        this.log("Restore settings.ini of hb-store")
    }

}
