<template lang="html">
<div class='config'>

    <div class="text-h4">Config</div>
    <div style="height: 15px" />

    <div class='q-gutter-y-md q-mb-md'>
      <div class='row q-col-gutter-md'>
          <div class='col-xs-8'>
              <q-input v-model="ip" outlined dense stack-label label="Local IP" _mask="###.###.###.###" v-if="false" />
              <q-select v-model="ip" :options="interfaces" outlined dense stack-label label="Local IP"
                        option-value="ip" option-label="title" emit-value map-options />
          </div>
          <div class='col-xs-4'>
              <q-input v-model="port" outlined dense stack-label label="Port" max-length="8" />
          </div>
      </div>

      <q-input v-model="basePath" class="q-pr-none" outlined dense stack-label label="Base Folder Path">
        <slot name="append">
            <q-btn square flat class="q-pa-sm" color="white" icon="sync" size="sm" />
            <q-btn square flat class="q-pa-sm" color="white" icon="folder" @click="openBasePathDialog" />
        </slot>
      </q-input>
    </div>

    <div class='q-gutter-md'>
        <q-btn outline color="green-8" label="Start" />
        <q-btn outline color="orange-8" label="Restart" />
        <q-btn outline color="red-8" label="Stop" />
    </div>

    <q-separator class="q-my-md" v-if="true" />

    <div class='row'>
        <div class='col'>
            <q-btn outline no-caps color="cyan" label="Check Server Binaries" @click="checkServerBinaries" />
        </div>
        <div class='' v-if="updateAvailable">
            <q-btn size="md" class="q-mx-sm" icon="download" />
        </div>
        <div class='self-center text-right'>
            Current Version {{ binaryVersion }}
        </div>
    </div>

    <pre>{{ ip }}:{{ port }}</pre>
    <pre>{{ basePath }}</pre>
    <pre>{{ interfaces }}</pre>

</div>
</template>

<script>
// import { remote } from 'electron'
// import { app } from '@electron/remote'
import { get, sync } from 'vuex-pathify'

export default {
    name: 'Config',

    data(){ return {
        interfaces: [],
        updateAvailable: false,
    }},

    computed: {
        ip: sync('server/ip', false),
        port: sync('server/port', false),
        basePath: sync('server/basePath', false),
        binaryVersion: get('server/binaryVersion', false),
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
              console.log(newBasePath + ' has been selected as basePath')
            }

        },

        async loadInterfaces(){
            this.interfaces = await window.hb.getNetWorkInterfaces()
        },


        async checkServerBinaries(){
            let release = await this.$hb.getRelease()
            let version = this.$hb.getVersion(release)
            let assets  = this.$hb.getAssets(release)
            let name    = this.$hb.getName(release)

            console.log({ version, assets, name })

            let compare = this.$hb.checkVersion(version)

            if(compare == 1)
              this.$q.notify("Your current Binary are higher then the release")

            if(compare == 0)
              this.$q.notify("You are on the current binary version")

            if(compare == -1){
              this.updateAvailable = true
              this.$q.notify("New Server Binaries are available. Please update")
            }
        },

    }
}
</script>

<style lang="scss" scoped>
</style>
