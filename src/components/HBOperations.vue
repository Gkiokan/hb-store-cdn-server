<template lang="html">
<div class='hb-operations'>

  <div class="row q-col-gutter-md">
      <div>
      <q-btn-dropdown outline no-caps color="grey-6" label="HB-Store Logs">
          <q-list>
            <q-item clickable v-close-popup @click="getLogs('log')">
              <q-item-section>
                  <q-item-label> <q-icon class="q-mr-sm" name="far fa-file-alt" /> Get store.log</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="getLogs('loader')">
              <q-item-section>
                  <q-item-label> <q-icon class="q-mr-sm" name="far fa-file-alt" /> Get loader.log </q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="getLogs('itemzflow')">
              <q-item-section>
                  <q-item-label> <q-icon class="q-mr-sm" name="far fa-file-alt" /> Get itemzflow.log </q-item-label>
              </q-item-section>
            </q-item>

            <q-separator inset />

            <q-item clickable v-close-popup @click="clearLogs">
              <q-item-section>
                <q-item-label> <q-icon class="q-mr-sm" name="fas fa-eraser" /> Clear store.log on PS4</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
      </q-btn-dropdown>
      </div>

      <div>
      <q-btn-dropdown outline no-caps color="grey-6" label="HB-Store Settings">
          <q-list>
            <q-item clickable v-close-popup @click="updateSettings">
              <q-item-section avatar>
                  <q-img src="hbcdn.png" />
              </q-item-section>
              <q-item-section>
                  <q-item-label>Update CDN to <b>My Server</b></q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="restoreSettings">
              <q-item-section avatar>
                  <q-img src="hbglobal.png" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Restore CDN to <b>pkg-zone.com</b></q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
      </q-btn-dropdown>
      </div>
  </div>

</div>
</template>

<script>
import { get, sync } from 'vuex-pathify'

export default {
    name: 'HBOperations',

    computed: {
        server: get('server', false),
        ip: sync('server/ip', false),
        port: sync('server/port', false),
        ps4ip: sync('server/ps4ip', false),
        ps4port: sync('server/ps4port', false),
    },

    methods: {
        getLogs(log='log'){
            window.ftp.getLogs(JSON.stringify(this.server), log)
        },

        clearLogs(){
            window.ftp.cleanLogs(JSON.stringify(this.server))
        },

        validateBefore(){
            if(!this.ps4ip)
              return this.$root.showError("Please input your PS4 IP")

            if(!this.ps4port)
              return this.$root.showError("Please input your PS4 FTP Port")

            return false
        },

        updateSettings(){
            if(this.validateBefore() !== false) return

            let cdn = 'http://' + this.ip + ':' + this.port
            window.ftp.updateSettings(JSON.stringify({ ...this.server, ...{ cdn } }))
        },

        restoreSettings(){
            if(this.validateBefore() !== false) return

            let cdn = 'http://api.pkg-zone.com'
            window.ftp.updateSettings(JSON.stringify({ ...this.server, ...{ cdn } }))
        },
    }
}
</script>

<style lang="scss" scoped>
</style>
