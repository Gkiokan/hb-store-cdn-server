<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue'
import { sync } from 'vuex-pathify'

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
    },

    methods: {
        addEventListener(){
            window.ipc.on('error', this.showError)
        },

        showError(message){
            this.$q.notify({
                message,
                icon: 'warning',
                color: 'red'
            })
        },

        addLogs(message){
            console.log(message)
            this.logs.unshift({ time: Date.now(), message })
        },


    }
})
</script>
