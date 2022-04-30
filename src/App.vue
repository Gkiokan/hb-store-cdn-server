<template>
  <router-view />
</template>

<script>
import { QSpinnerBox } from 'quasar'
import { defineComponent } from 'vue'
import { get, sync } from 'vuex-pathify'

export default defineComponent({
    name: 'App',

    data(){ return {
        tab: 'config',
    }},

    beforeCreate() {
        this.$store.commit('initialiseStore');
    },

    created(){
        this.$q.dark.set(true)
        this.addEventListener()
        this.startUpReset()
    },

    computed: {
        logs: sync('app/logs', false),
        server: get('server', false),
        ps4ip: sync('server/ps4ip', false),
        state: sync('server/state', false),
        files: sync('server/files', false),
        app: get('app', false),
    },

    methods: {
        startUpReset(){
            this.updateServerState(null, null)
            this.updateServerFiles(null, [])
            // this.state = 'stopped'
            this.logs = []
        },

        addEventListener(){
            console.log("Register app events")
            window.ipc.on('error', (_, msg) => this.showError(msg))
            window.ipc.on('log', (_, log) => this.addLogs(log))
            window.ipc.on('notify', (_, msg) => this.notify(msg))
            window.ipc.on('loading', (_, loading) => this.loading(loading))

            window.ipc.on('server-state', this.updateServerState)
            window.ipc.on('server-files', this.updateServerFiles)

            window.ipc.on('update-ps4-ip', this.updatePS4IP)

            this.$store.subscribe(this.storeSubscriber)
        },

        loading(o){
            // console.log(o)
            if(o.hide)
              return this.$q.loading.hide()

            o.spinner = QSpinnerBox
            this.$q.loading.show(o)
        },

        storeSubscriber(mutation, state){
            // console.log(mutation)
            localStorage.setItem('store', JSON.stringify(state));
        },

        updateServerState(_, state){
            this.state = state
        },

        updateServerFiles(_, files){
            this.files = files
        },

        updatePS4IP(_, ip=''){
            this.addLogs("Request from ps4 ip " + ip)

            if(!this.ps4ip)
              this.$q.dialog({
                  title: "Found a PS4!",
                  message: "Your ps4 HB-Store just connected, wanna add it's IP?",
                  dark: true,
                  cancel: {
                      flat: true,
                      color: 'black',
                      textColor: 'white',
                      label: "No, leave my PS4 IP"
                  },
                  ok: {
                      flat: true,
                      label: "Yea sure, add it!",
                      color: 'transparent',
                      textColor: 'green',
                      icon: 'done',
                  },

              }).onOk( () => {
                  this.ps4ip = ip
              })
        },

        showError(message){
            console.log("Show Error", message)
            this.$q.notify({
                message,
                html: true,
                icon: 'warning',
                color: 'red',
                timeout: 2200,
            })
        },

        notify(message){
            console.log("Notify", message)
            this.$q.notify({
                message,
                icon: 'done',
                color: 'green',
                timeout: 800,
            })
        },

        addLogs(message){
            console.log(message)
            this.logs.unshift({ time: Date.now(), message })
        },

        validateBeforeServerStart(){
            if(!this.server.ip)
                return this.showError("Please select your Host IP first")

            if(!this.server.port)
                return this.showError("Please set a port")

            if(!this.server.basePath)
                return this.showError("Please add a base Path")

            if(this.server.binaryVersion == "0.00"){
                window.ipc.checkServerBinaries()
                return this.notify("Server Binaries not up2date. Checking them right now.")
            }

            return false
        },

        startServer(){
            if(this.validateBeforeServerStart() !== false) return

            if(this.state == 'running')
                return this.notify("Server is already running")

            window.server.start(JSON.stringify(this.server))
        },

        restartServer(){
            if(this.validateBeforeServerStart() !== false) return
            if(this.state == 'stopped' || this.state == null)
              return this.startServer()

            window.server.restart(JSON.stringify(this.server))
        },

        stopServer(){
            window.server.stop()
        },

        scanFolder(){
            window.server.scan(JSON.stringify(this.server))
        },

        open(url){
            window.ipc.open(url)
        }

    }
})
</script>
