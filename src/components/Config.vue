<template lang="html">
<div class='config'>

    <div class="text-h4">Config</div>
    <div style="height: 15px" />

    <div class='q-gutter-y-md q-mb-md'>
      <div class='row q-col-gutter-md'>
          <div class='col-xs-8'>
              <q-input v-model="ip" outlined dense stack-label label="Local IP" mask="###.###.###.###" />
          </div>
          <div class='col-xs-4'>
              <q-input v-model="port" outlined dense stack-label label="Port" max-length="8" />
          </div>
      </div>

      <q-input v-model="basePath" class="q-pr-none" outlined dense stack-label label="Base Folder Path" readonly>
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

    <q-separator class="q-my-md" v-if="false" />

    <pre>{{ ip }}:{{ port }}</pre>
    <pre>{{ basePath }}</pre>

</div>
</template>

<script>
// import { remote } from 'electron'
// import { app } from '@electron/remote'

import { get, sync } from 'vuex-pathify'

export default {
    name: 'Config',

    data(){ return {

    }},

    computed: {
        ip: sync('server/ip', false),
        port: sync('server/port', false),
        basePath: sync('server/basePath', false),
    },

    methods: {
        async openBasePathDialog(){
            // deprecated since v9
            // let path = remote.dialog.showOpenDialog({ properties: ['openDirectory'] })

            const path = await window.hb.openBasePathDialog()
            console.log("open base path dialog await fe", path)

            if(path && path.filePaths.length){
              let newBasePath = path.filePaths[0]
              this.$store.set('server/basePath', newBasePath)
              console.log(newBasePath + ' has been selected as basePath')
            }

        },
    }
}
</script>

<style lang="scss" scoped>
</style>
