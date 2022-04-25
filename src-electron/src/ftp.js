import { app, BrowserWindow } from 'electron'

export default {
    ip: "",
    port: "",

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

    getLogs(config){
        this.setConfig(config)

        this.log("Trying to get logs from hb-store ")
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
