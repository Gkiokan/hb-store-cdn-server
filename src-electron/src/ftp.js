import { app, BrowserWindow, dialog } from 'electron'
import { download } from 'electron-dl'
import { Client } from 'basic-ftp'
import { ConfigIniParser } from 'config-ini-parser'
import path from 'path'
import fs from 'fs'

export default {
    ip: "",
    port: "",

    files: {
        loader: "/user/app/NPXS39041/logs/loader.log",
        log: "/user/app/NPXS39041/logs/log.txt",
        itemzflow: "/user/app/NPXS39041/logs/itemzflow.log",
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

    getLocalFile(file=null){
        return app.getPath('userData') + '/data/' + path.basename(file)
    },

    setConfig(config){
        this.ip       = config.ps4ip
        this.port     = config.ps4port
    },

    error(err=null){
        // deprecated
        // const win = BrowserWindow.getFocusedWindow();
        this.getWindow().webContents.send('error', err)
        this.log(err)
    },

    notify(msg=null){
        this.getWindow().webContents.send('notify', msg)
        this.log(msg)
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
            this.log("Connecting to ps4 though ftp " + this.ip + ':' + this.port)
            await client.access({
                host: this.ip,
                port: this.port,
                user: "anonymous",
                password: "anonymous",
                secureOptions: {
                    rejectUnauthorized: false,
                }
            })

            // client.trackProgress(info => {
            //     console.log("File", info.name)
            //     console.log("Type", info.type)
            //     console.log("Transferred", info.bytes)
            //     console.log("Transferred Overall", info.bytesOverall)
            // })
        }
        catch(err) {
            this.error(err)
        }

        return client
    },

    async download(target, source){
        let client = await this.getClient()
        let get = await client.downloadTo(target, source)
        client.close()
        return get
    },

    async upload(source, target){
        let client = await this.getClient()
        let get = await client.uploadFrom(source, target)
        client.close()
        return get
    },

    async getLogs(config){
        this.setConfig(config)
        this.log("Trying to get logs from HB-Store ")
        this.loading({ message: "Trying to get log.txt from HB-Store" })

        try {
            await this.download(this.getLocalFile(this.files.log), this.files.log)
        }
        catch(e){
            this.loading({ hide: true })
            this.error(e)
            return
        }

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

        await fs.copyFileSync(this.getLocalFile(this.files.log), targetLogFile.filePath)
        this.notify("HB-Store log.txt downloaded")
    },

    async cleanLogs(config){
        this.setConfig(config)
        this.loading({ message: "Cleaning HB-Store Logs"})

        try {
            await fs.writeFileSync(this.getLocalFile(this.files.log), "===== CLEARED LOGS ======\n")
        }
        catch(e){
            this.loading({ hide: true })
            return this.error(e)
        }

        try {
            this.upload(this.getLocalFile(this.files.log), this.files.log)
        }
        catch(e){
            this.loading({ hide: true })
            return this.error(e)
        }

        this.loading({ hide: true })
        this.notify("HB-Store has been cleared")
    },

    async getSettings(config){
        this.setConfig(config)
        this.loading({ message: "Loading settings.ini from PS4" })

        try {
            await this.download(this.getLocalFile(this.files.settings), this.files.settings)
        }
        catch(e){
            this.loading({ hide: true })
            this.error(e)
            throw e
        }

        this.loading({ hide: true })
    },

    async updateSettings(config){
        try {
            await this.getSettings(config)
        }
        catch(e){ console.log("ERORR IN GET CONFIG"); return }

        console.log("CONTINUE IN UPDATE SETTING")

        this.setConfig(config)
        this.loading({ message: "Updating Settings.ini "})

        let parser = new ConfigIniParser()
        let cdn    = config.cdn

        // load ini
        try {
            let ini    = await fs.readFileSync(this.getLocalFile(this.files.settings), 'utf8')
            parser.parse(ini)
        }
        catch(e){
            this.loading({ hide: true })
            return this.error("Error in reading settings.ini")
        }

        // update CDN
        parser.set('Settings', 'CDN', cdn)
        try {
            await fs.writeFileSync(this.getLocalFile(this.files.settings), parser.stringify())
        }
        catch(e){
            this.loading({ hide: true })
            return this.error(e)
        }

        // upload to ftp
        this.loading({ message: "Uploading new settings.ini to PS4"})
        try {
            await this.upload(this.getLocalFile(this.files.settings), this.files.settings)
        }
        catch(e){
            this.loading({ hide: true })
            return this.error(e)
        }

        this.loading({ hide: true })
        this.notify("Update HB-Store CDN to " + cdn)
    },


}
