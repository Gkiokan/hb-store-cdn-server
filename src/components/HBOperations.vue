<template lang="html">
<div class='hb-operations'>

  <div class="row q-col-gutter-md">
      <div>
      <q-btn-dropdown outline no-caps color="grey-6" label="HB-Store Logs">
          <q-list>
            <q-item clickable v-close-popup @click="getLogs">
              <q-item-section>
                  <q-item-label>Get Logs File from PS4</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="clearLogs">
              <q-item-section>
                <q-item-label>Clear Logs on PS4</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
      </q-btn-dropdown>
      </div>

      <div>
      <q-btn-dropdown outline no-caps color="grey-6" label="HB-Store Settings">
          <q-list>
            <q-item clickable v-close-popup @click="updateSettings">
              <q-item-section>
                  <q-item-label>Update CDN to me</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="restoreSettings">
              <q-item-section>
                <q-item-label>Restore CDN to pkg-zone.com</q-item-label>
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
        getLogs(){
            window.ftp.getLogs(JSON.stringify(this.server))
        },

        clearLogs(){
            window.ftp.cleanLogs(JSON.stringify(this.server))
        },

        updateSettings(){
            let cdn = 'http://' + this.ip + ':' + this.port
            window.ftp.updateSettings(JSON.stringify({ ...this.server, ...{ cdn } }))
        },

        restoreSettings(){
            let cdn = 'http://api.pkg-zone.com'
            window.ftp.updateSettings(JSON.stringify({ ...this.server, ...{ cdn } }))
        },
    }
}
</script>

<style lang="scss" scoped>
</style>
