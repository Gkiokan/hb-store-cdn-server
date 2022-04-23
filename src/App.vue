<template>
  <router-view />
</template>

<script>
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
        state: sync('server/state', false),
        files: sync('server/files', false),
        app: get('app', false),
    },

    methods: {
        startUpReset(){
            this.updateServerState(null, null)
            this.updateServerFiles(null, [])
        },

        addEventListener(){
            window.ipc.on('error', (_, msg) => this.showError(msg))
            window.ipc.on('log', (_, log) => this.addLogs(log))
            window.ipc.on('notify', (_, msg) => this.notify(msg))

            window.ipc.on('server-state', this.updateServerState)
            window.ipc.on('server-files', this.updateServerFiles)

            this.$store.subscribe(this.storeSubscriber)
        },

        storeSubscriber(mutation, state){
            localStorage.setItem('store', JSON.stringify(state));
        },

        updateServerState(_, state){
            this.state = state
        },

        updateServerFiles(_, files){
            this.files = files
        },

        showError(message){
            console.log("Show Error", message)
            this.$q.notify({
                message,
                icon: 'warning',
                color: 'red'
            })
        },

        notify(message){
            console.log("Notify", message)
            this.$q.notify({
                message,
                icon: 'done',
                color: 'green'
            })
        },

        addLogs(message){
            console.log(message)
            this.logs.unshift({ time: Date.now(), message })
        },

        startServer(){
            if(!this.server.ip)
                return this.showError("Please select your Local IP first")

            if(!this.server.port)
                return this.showError("Please set a port")

            window.server.start(JSON.stringify(this.server))
        },

        restartServer(){
            if(!this.server.ip)
                return this.showError("Please select your Local IP first")

            if(!this.server.port)
                return this.showError("Please set a port")

            window.server.restart(JSON.stringify(this.server))
        },

        stopServer(){
            window.server.stop()
        },

    }
})
</script>
