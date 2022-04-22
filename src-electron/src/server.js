import { app, BrowserWindow } from 'electron'

import express from 'express'
import http from 'http'
import fg from 'fast-glob'
import pkgInfo from 'ps4-pkg-info'

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

    setConfig(config){
        this.ip       = config.ip
        this.port     = config.port
        this.basePath = config.basePath
    },

    error(err=null){
        const win = BrowserWindow.getFocusedWindow();
        win.webContents.send('error', err)
        this.log(err)
    },

    log(msg=null){
        const win = BrowserWindow.getFocusedWindow();
        win.webContents.send('log', msg)
        console.log("Server:: " + msg)
    },

    notify(msg=null){
        const win = BrowserWindow.getFocusedWindow();
        win.webContents.send('notify', msg)
        this.log(msg)
    },

    sendFiles(){
        const win = BrowserWindow.getFocusedWindow();
        win.webContents.send('server-files', this.files)
    },

    setState(state=null){
        const win = BrowserWindow.getFocusedWindow();
        win.webContents.send('server-state', state)
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
    },

    addFilesFromBasePath(){
        this.log("Search for pkg files in basePath at " + this.basePath)
        let files = fg.sync([this.basePath + '/**/*.pkg'])
        this.log("Found " + files.length + " files in basePath")

        let patchedFiles = []
        console.log(files)

        files.forEach( (file) => {

              pkgInfo.extract(file)
                  .then( data => {
                      console.log("mapping file " + file)
                      console.log(data)
                      // patchedFiles.push(data)
                      this.files.push(data)
                  })
                  .catch( e => console.log(e) )
        })

        console.log("=====================================")
        console.log("patched file 0 ", this.files[0] )
        console.log("=====================================")

        this.sendFiles()
    },

    addFileEndpoint(file){
        this.host.router.get(`/${file.patchedFilename}`, function(request, response){
            response.status(200).download(file.path, file.name)
        })

        file.url = 'http://' + this.ip + ':' + this.port + '/' + file.patchedFilename

        return file
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

            if(e.errno === 'EADDRINUSE'){
              let error = "Port " + this.port + " is already in use. Choose another one and restart the Server"
              this.error(error)
            }
            else {
              this.error('Error in listening on ' + this.ip + ' at port ' + this.port + ". Error: " + e.errno)
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
