import { app, BrowserWindow } from 'electron'
import fs from 'fs'
import path from 'path'
import Database from 'better-sqlite3';

let db;

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
          let dir   = path.dirname(store)

          if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir);
          }

          try {
              fs.copyFileSync(clean, store)
              this.log("store.db has been renewed")
          }
          catch(e){
              this.error(e)
          }
      },

      instance(){
          const db = new Database(this.getStorePath())
          this.db = db

          return db
      },

      addAllItems(items){
          const db = this.instance()

          const insert = db.prepare("INSERT INTO homebrews (pid,id,name,desc,image,package,version,picpath,desc_1,desc_2,ReviewStars,Size,Author,apptype,pv,main_icon_path,main_menu_pic,releaseddate) VALUES (CAST(@pid AS INTEGER),@id,@name,@desc,@image,@package,@version,@picpath,@desc_1,@desc_2,@ReviewStars,@Size,@Author,@apptype,@pv,@main_icon_path,@main_menu_pic,@releaseddate)")

          const insertAll = db.transaction( items => {
              for (const item of items)
                insert.run(item)
          })

          insertAll(items)
      },


}
