<template>
<q-layout view="hHh Lpr lff">
    <q-header class="q-pa-sm bg-transparent">

        <TitleBar />

        <q-toolbar flat class="bg-dark text-white rounded-borders q-header-top">
            <q-btn flat icon="menu" _label="PKG-Zone" @click="drawerLeft = !drawerLeft" />
            <q-space />

            <q-tabs v-model="$root.tab" shrink stretch>
                <q-tab name="config" label="Config" />
                <q-tab name="files" label="Files" />
                <q-tab name="logs" label="Logs" />
            </q-tabs>

            <q-btn round class="q-ml-md cursor-pointer" size="sm" icon="power_settings_new" v-if="showCloseButtonNextToTabs" />
        </q-toolbar>

        <div class="cdn" :class="{ active : server.state == 'running'}">
            Use this as CDN: {{ getCDNAdress }}
        </div>
    </q-header>

    <q-drawer v-model="drawerLeft" :width="300" elevated>
        <div class="absolute-full q-pa-md q-pl-lg column justify-between ">
            <div> Item </div>
            <q-space />

            <q-separator class="q-my-md" />

            <div class="q-gutter-md">
                <div>
                    <div class="text-bold">HB-Store (ps4 app)</div>
                    Created by LightningMods
                </div>
                <div>
                    <div class="text-bold">PKG-Zone</div>
                    Official HB-Store <br>
                    owned by LightningMods
                </div>
            </div>

            <q-separator class="q-my-md" />

            <div class="q-gutter-sm">
                <q-btn no-caps color="black" align="left" class="full-width" icon="link" label="Checkout PKG-Zone.com" @click="$root.open('https://pkg-zone.com')" />
                <q-btn no-caps color="black" align="left" class="full-width" icon="support_agent" label="Get Help on PKG-Zone" @click="$root.open('https://discord.gg/YbQFRvRYDa')" />
                <q-btn no-caps color="black" align="left" class="full-width" icon="fab fa-discord" label="Join PKG-Zone Discord" @click="$root.open('https://discord.gg/CRv9gCwudS')" />
            </div>
        </div>
    </q-drawer>


    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-black text-grey-5 q-px-md q-py-xs">
        <div class='row'>
          <div class='col' style="font-size: 13px">
            Made by Gkiokan | <small> Exclusive for HB-Store </small>
          </div>
          <div>
              v{{ version }}
          </div>
        </div>
    </q-footer>
</q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { get } from 'vuex-pathify'

export default defineComponent({
  name: 'MainLayout',

  data(){ return {
      drawerLeft: false,
      version: process.env.version,
      showCloseButtonNextToTabs: false,
  }},

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

    opacity: 0;
    height: 30px;
    padding-bottom: 3px;

    background: green;
    border-radius: 0 0 4px 4px;

    line-height: 1;
    font-size: 14px;
    font-family: verdana;

    transition: all .3s;

    &.active {
        opacity: 1;
        bottom: -12px;
    }
}
</style>
