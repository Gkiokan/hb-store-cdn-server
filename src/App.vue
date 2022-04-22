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

    created(){
        this.$q.dark.set(true)
        this.addEventListener()
    },

    computed: {
        logs: sync('app/logs', false),
        server: get('server', false),
        app: get('app', false),
    },

    methods: {
        addEventListener(){
            window.ipc.on('error', (_, msg) => this.showError(msg))
            window.ipc.on('log', (_, log) => this.addLogs(log))
            window.ipc.on('notify', (_, msg) => this.notify(msg))
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
            if(!this.server.ip){
                return this.showError("Please select your Local IP first")
            }
            window.server.start(JSON.stringify(this.server))
        },

        restartServer(){

        },

        stopServer(){

        },

    }
})
</script>
