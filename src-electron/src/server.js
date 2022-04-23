import { app, BrowserWindow } from 'electron'

import express from 'express'
import http from 'http'
import fg from 'fast-glob'
import path from 'path'
import hb from './hb'
import db from './db'
import pkgInfo from 'ps4-pkg-info'
import md5File from 'md5-file'

export default {
    ip: null,
    port: null,
    basePath: null,
    files: [],
    host: {
        app: null,
        server: null,
        router: null,
    },

    getWindow(){
        let win = BrowserWindow.getFocusedWindow();

        if(!win){
            let all = BrowserWindow.getAllWindows()
            win = all[0]
        }

        return win
    },

    getBaseURI(){
        return 'http://' + this.ip + ':' + this.port + '/'
    },

    setConfig(config){
        this.ip       = config.ip
        this.port     = config.port
        this.basePath = config.basePath
    },

    error(err=null){
        // deprecated
        // const win = BrowserWindow.getFocusedWindow();
        this.getWindow().webContents.send('error', err)
        this.log(err)
    },

    log(msg=null){
        this.getWindow().webContents.send('log', msg)
        console.log("Server:: " + msg)
    },

    notify(msg=null){
        this.getWindow().webContents.send('notify', msg)
        this.log(msg)
    },

    sendFiles(){
        this.getWindow().webContents.send('server-files', this.files)
    },

    setState(state=null){
        this.getWindow().send('server-state', state)
        this.log("Set Server State to " + state)
    },

    addCORSHandler(){
        this.host.app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            // res.setHeader('Access-Control-Allow-Credentials', true);
            next()
        })
    },

    addRouterMiddleware(){
        this.host.app.use((req, res, next) => {
            this.host.router(req, res, next)
        })
    },

    createPaths(){
        this.log("Server is ready to create paths")
        db.renewDB()
        this.host.router = new express.Router()
        this.addHearthbeatEndpoint()
        this.addFilesFromBasePath()
    },

    addHearthbeatEndpoint(){
        this.log("Create Hearthbeat endpoint")
        this.host.router.get('/hb', function(request, response){
            response.status(200).json({
                remoteAddress: request.connection.remoteAddress,
                remotePort: request.connection.remotePort,
                localAddress: request.connection.localAddress,
                localPort: request.connection.localPort,
                message: "Hearthbeat of HB-Store CDN Server is working"
            })
        })

        // sample icon0.png
        this.host.router.get('/icon0.png', function(request, response){
            let image = path.resolve(__dirname, process.env.QUASAR_PUBLIC_FOLDER) + '/icon0.png'
            response.status(200).download(image, 'icon0.png')
        })

        // storage database
        this.host.router.get('/store.db', function(request, response){
            let store = db.getStorePath()
            response.status(200).download(store, 'store.db')
        })

        // check the storage checksum
        this.host.router.get('/api.php', function(request, response){
            if('db_check_hash' in request.query){
                let hash  = md5File.sync(db.getStorePath())
                response.status(200).json({
                    hash,
                    params: request.query,
                })
            }
        })

        // number of downloads?
        this.host.router.get('/download.php', function(request, response){
            response.status(200).json({
                number_of_downloads: "1337",
            })
        })

        // load server binaries
        for (const asset of ['homebrew.elf', 'homebrew.elf.sig', 'remote.md5'])
          this.host.router.get('/update/' + asset, function(request, response){
              let file = app.getPath('userData') + '/bin/' + asset
              response.status(200).download(file, asset)
          })
    },

    async addFilesFromBasePath(){
        this.log("Search for pkg files in basePath at " + this.basePath)
        let files = fg.sync([this.basePath + '/**/*.pkg'])
        this.log("Found " + files.length + " files in basePath")

        // loop for files and map the files to a file object
        let i = 1
        for (const file of files){
            try {
                let data = await pkgInfo.extract(file)
                                        .catch( e => {
                                            this.log("Error in PKG Extraction: "+ e + '; File: ' + file)
                                            throw e
                                        })

                let item = hb.createItem(data, file, i)
                    item = hb.addImages(item, this.getBaseURI())
                    item = this.addFileEndpoint(item)

                this.files.push(item)
                // console.log(item)
                i = i+1
            }
            catch(e){ console.log("Error in extracting sfo information", e) }
        }

        db.addAllItems(this.files)
        // console.log("=====================================")
        // console.log("patched file 0 ", this.files[0] )
        // console.log("=====================================")

        this.sendFiles()
    },

    addFileEndpoint(item){
        this.host.router.get(`/${item.patchedFilename}`, function(request, response){
            response.status(200).download(item.path, item.filename)
        })

        item.package = this.getBaseURI() + item.patchedFilename

        return item
    },

    createServer(){
        const app = express();
        this.host.app = app
        this.host.router = express.Router()
        this.log("Server created")
    },

    async start(config){
        this.setConfig(config)

        if(!this.host.app){
            this.createServer()
        }

        // console.log(this.ip, this.ip.length, this.port, this.port.length)
        if(this.ip.length == 0 || this.port.length == 0){
            this.error("Server cannot start. Please configure IP and Port")
            // this.$message({ type: 'warning', message: error });
            return
        }

        this.host.server = await this.host.app.listen(this.port, () => {
            this.notify('Server is running on ' + this.ip + ' at port ' + this.port)
            this.setState('running')

            this.addCORSHandler()
            this.addRouterMiddleware()
            this.createPaths()
        })
        .on('error', (e) => {
            // console.log({ ...e })
            this.setState('stopped')

            if(e.code === 'EADDRINUSE'){
              let error = "Port <b>" + this.port + "</b> is already in use. <br>Choose another port and restart the Server"
              this.error(error)
            }
            else {
              this.error('Error in listening on ' + this.ip + ' at port ' + this.port + ". Error: " + e.code)
            }
        })
    },

    async stop(){
        this.log('Closing Server')

        if(this.host.server)
          await this.host.server.close(() => {
              this.log('Server closed')
              this.setState('stopped')
          })
        else
          this.error("Server can not be closed. Server Object does't exist")
    },

    restart(config){
        this.log("Server restarting triggered")
        this.stop()
        this.start(config)
    },

}
