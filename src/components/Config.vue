<template lang="html">
<div class='config'>

    <div style="height: 15px" />

    <div class='q-gutter-y-md q-mb-md'>
        <div class='row q-col-gutter-md q-mb-md'>
            <div class='col-xs-8'>
                <q-input v-model="ip" outlined dense stack-label label="Local IP" _mask="###.###.###.###" v-if="false" />
                <q-select v-model="ip" :options="interfaces" outlined dense stack-label label="Local IP"
                          option-value="ip" option-label="title" emit-value map-options />
            </div>
            <div class='col-xs-4'>
                <q-input v-model="port" outlined dense stack-label label="Port" max-length="8" />
            </div>
        </div>

        <div class='row q-col-gutter-md'>
            <div class='col-xs-8'>
                <q-input v-model="ps4ip" outlined dense stack-label label="PS4 IP" _mask="###.###.###.###" />
            </div>
            <div class='col-xs-4'>
                <q-input v-model="ps4port" outlined dense stack-label label="PS4 FTP Port" max-length="8" />
            </div>
        </div>

        <q-separator class="q-my-md" />

        <q-input v-model="basePath" class="q-pr-none" outlined dense stack-label label="Base Folder Path">
          <slot name="append">
              <q-btn square flat class="q-pa-sm" color="white" icon="sync" size="sm" @click="$root.scanFolder()" :disabled="state != 'running'" />
              <q-btn square flat class="q-pa-sm" color="white" icon="folder" @click="openBasePathDialog" />
          </slot>
        </q-input>
    </div>

    <q-separator class="q-my-md" />

    <q-btn class="full-width q-mb-md" :color="getServerStateColor" :label="getServerStateLabel" />

    <div class='q-gutter-md space-around'>
        <q-btn outline icon="play_arrow" color="green-8" label="Start" @click="$root.startServer" :disable="startButtonState" />
        <q-btn outline icon="restart_alt" color="orange-8" label="Restart" @click="$root.restartServer" :disable="state != 'running'" />
        <q-btn outline icon="stop" color="red-8" label="Stop" @click="$root.stopServer" :disable="state != 'running'" />
    </div>

    <q-separator class="q-my-md" v-if="true" />

    <ServerBinaryDownload />

    <q-separator class="q-my-md" v-if="true" />

    <HBOperations />

</div>
</template>

<script>
// import { remote } from 'electron'
// import { app } from '@electron/remote'
import { get, sync } from 'vuex-pathify'
import path from 'path'

export default {
    name: 'Config',

    data(){ return {
        interfaces: [],
    }},

    watch: {
        basePath(){
          if(this.state == 'running')
            this.$root.scanFolder()
        }
    },

    computed: {
        state: get('server/state', false),
        ip: sync('server/ip', false),
        port: sync('server/port', false),
        ps4ip: sync('server/ps4ip', false),
        ps4port: sync('server/ps4port', false),
        basePath: sync('server/basePath', false),
        binaryVersion: sync('server/binaryVersion', false),

        getServerStateLabel(){
            if(this.state == 'running')
              return "Server is running"

            if(this.state == 'stopped')
              return "server is stopped"

            if(this.state == null)
              return "Start your server!"

            return "Server is hups, unknown?"
        },

        getServerStateColor(){
            if(this.state == 'running')
              return 'green'

            if(this.state == 'stopped')
              return 'orange'

            if(this.state == null)
              return 'black'

            return 'pink'
        },

        startButtonState(){
            if(this.state == null) return false
            if(this.state == 'stopped') return false
            return true
        },
    },

    mounted(){
        this.loadInterfaces()
    },

    methods: {
        async openBasePathDialog(){
            const path = await window.hb.openBasePathDialog()
            console.log("open base path dialog await fe", path)

            if(path && path.filePaths.length){
              let newBasePath = path.filePaths[0]
              this.$store.set('server/basePath', newBasePath)
              this.$root.addLogs(newBasePath + ' has been selected as basePath')
            }
        },

        async loadInterfaces(){
            this.interfaces = await window.hb.getNetWorkInterfaces()
        },

    }
}
</script>

<style lang="scss" scoped>
</style>
