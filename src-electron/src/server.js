import { app } from 'electron'

import express from 'express'
import http from 'http'

export default {
    ip: null,
    port: null,
    basePath: null,
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

    error(err){
        const win = BrowserWindow.getFocusedWindow();
        win.webContents.send('error', err)
        this.log(msg)
    },

    log(msg){
        const win = BrowserWindow.getFocusedWindow();
        win.webContents.send('error', msg)
        console.log("Server:: " + msg)
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
        this.host.router = new express.Router()
        // this.addHearthbeatEndpoint()
        // this.addFilesFromBasePath()
        this.log("Server is ready to create paths")
    },

    async startServer(config){
        this.setConfig(config)

        // console.log(this.ip, this.ip.length, this.port, this.port.length)
        if(this.ip.length == 0 || this.port.length == 0){
            this.error("Server cannot start. Please configure IP and Port")
            // this.$message({ type: 'warning', message: error });
            return
        }

        this.host.server = await this.host.app.listen(this.port, () => {
            this.$store.dispatch('server/addLog', 'Server is running on port ' + this.ip + ' at port ' + this.port)
            this.$store.dispatch('server/setStatus', 'running')
            this.addCORSHandler()
            this.addRouterMiddleware()
            this.createPaths()
        })
        .on('error', (e) => {
            // console.log({ ...e })
            if(e.errno === 'EADDRINUSE'){
              let error = "Port " + this.port + " is already in use. Choose another one and restart the Server"
              this.error(error)
            }
            else {
              this.error('Error in listening on ' + this.ip + ' at port ' + this.port + ". Error: " + e.errno)
            }
        })
    },

}
