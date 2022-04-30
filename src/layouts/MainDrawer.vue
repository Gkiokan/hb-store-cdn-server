<template lang="html">
  <q-drawer v-model="$root.drawerLeft" :width="300" elevated>
      <div class="absolute-full q-pa-md q-pl-lg column justify-between ">

          <q-img class="q-mb-md" src="/logo.png" />
          <q-img class="q-mx-auto q-mb-sm cursor-pointer" src="/kofi.svg" width="180px" @click="$root.open('https://ko-fi.com/gkiokan')" />

          <div class="q-mb-sm q-gutter-sm text-center">
              <q-btn round flat size="sm" icon="fab fa-github" @click="$root.open('https://github.com/Gkiokan/hb-store-cdn-server')" />
              <q-btn round flat size="sm" icon="fab fa-twitter" @click="$root.open('https://twitter.com/GkiokanSali')" />
              <q-btn round flat size="sm" icon="fab fa-instagram" @click="$root.open('https://www.instagram.com/gkiokan.sali/')" />
              <q-btn round flat size="sm" icon="link" @click="$root.open('https://pkg-zone.com')" />
          </div>

          <div class="q-mb-sm">
            <div class="text-bold">HB-Store CDN Server </div>
            Version {{ $root.version }} <br>
            Made by Gkiokan <br>
          </div>

          <q-space />

          <q-separator class="q-my-sm" v-if="false" />

          <div class="q-gutter-md">
              <div>
                  <div class="text-bold">HB-Store (ps4 app)</div>
                  Created by LightningMods
              </div>
              <div>
                  <div class="text-bold">PKG-Zone</div>
                  Official HB-Store <br>
                  Owned by LightningMods
              </div>
          </div>

          <q-separator class="q-my-md" />

          <div class="q-gutter-sm">
              <q-btn no-caps color="black" align="left" class="full-width" icon="link" label="Checkout Gkiokan.NET" @click="$root.open('https://pkg-zone.com')" />
              <q-btn no-caps color="black" align="left" class="full-width" icon="link" label="Checkout PKG-Zone.com" @click="$root.open('https://pkg-zone.com')" />
          </div>

          <q-separator class="q-my-md" />

          <div class="q-gutter-sm">
              <q-btn no-caps color="black" align="left" class="full-width" icon="support_agent" label="Get Help on PKG-Zone" @click="$root.open('https://discord.gg/YbQFRvRYDa')" />
              <q-btn no-caps color="indigo-13" align="left" class="full-width" icon="fab fa-discord" label="Join PKG-Zone Discord" @click="$root.open('https://discord.gg/CRv9gCwudS')" />
          </div>
      </div>
  </q-drawer>
</template>

<script>
export default {
    name: "MainDrawer"
}
</script>

<style lang="css" scoped>
</style>
