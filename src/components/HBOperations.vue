<template lang="html">
<div class='hb-operations'>

  <div class="q-gutter-md">
      <q-btn outline no-caps color="grey-6" label="Get Logs" @click="getLogs" />
      <q-btn outline no-caps color="grey-6" label="Update" @click="updateSettings" />
      <q-btn outline no-caps color="grey-6" label="Restore" @click="restoreSettings" />
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

        updateSettings(){
            window.ftp.updateSettings(JSON.stringify(this.server))
        },

        restoreSettings(){
            window.ftp.restoreSettings(JSON.stringify(this.server))
        },
    }
}
</script>

<style lang="scss" scoped>
</style>
