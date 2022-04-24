<template>
<q-layout view="lHh Lpr lFf">
    <q-header class="q-pa-sm bg-transparent">
        <q-toolbar flat class="bg-dark text-white rounded-borders q-header-top">
            <q-btn flat label="PKG-Zone" v-if="1" />
            <q-space />

            <q-tabs v-model="$root.tab" shrink stretch>
              <q-tab name="config" label="Config" />
              <q-tab name="files" label="Files" />
              <q-tab name="logs" label="Logs" />
            </q-tabs>
        </q-toolbar>

        <div class="cdn" :class="{ active : server.state == 'running'}">
            Use this as CDN: {{ getCDNAdress }}
        </div>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-black text-grey-5 q-px-md q-py-xs">
        Made by Gkiokan | <small> Exclusive for HB-Store </small>
    </q-footer>
</q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { get } from 'vuex-pathify'

export default defineComponent({
  name: 'MainLayout',

  computed: {
      server: get('server', false),
      getCDNAdress(){
          if(this.server.port != 80)
            return 'http://' + this.server.ip + ':' + this.server.port

          return 'http://' + this.server.ip
      }
  }
})
</script>

<style lang="scss" scoped>
.q-header-top {
    position: relative;
    z-index: 5;
}

.cdn {
    position: absolute; z-index: 1;
    left: 8px; right: 8px; bottom: 20px;

    display: flex;
    align-items: flex-end;
    justify-content: center;

    height: 30px;
    padding-bottom: 3px;

    background: green;
    border-radius: 0 0 4px 4px;

    line-height: 1;
    font-size: 14px;
    font-family: verdana;

    transition: all .3s;

    &.active {
        bottom: -12px;
    }
}
</style>
