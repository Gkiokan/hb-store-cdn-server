import { app, BrowserWindow } from 'electron'
import fs from 'fs'
import path from 'path'

export default {

      getWindow(){
          let win = BrowserWindow.getFocusedWindow();

          if(!win){
              let all = BrowserWindow.getAllWindows()
              win = all[0]
          }

          return win
      },

      error(err=null){
          this.getWindow().webContents.send('error', err)
          this.log(err)
      },

      log(msg=null){
          this.getWindow().webContents.send('log', msg)
          console.log("Server:: " + msg)
      },


      getCleanStorePath(){
          return path.resolve(__dirname, process.env.QUASAR_PUBLIC_FOLDER) + '/store.clean.db'
      },

      getStorePath(){
          return app.getPath('userData') + '/bin/store.db'
      },

      renewDB(){
          let clean = this.getCleanStorePath()
          let store = this.getStorePath()

          try {
              fs.copyFileSync(clean, store)
              this.log("store.db has been renewed")
          }
          catch(e){
              this.error(e)
          }
      },



}
