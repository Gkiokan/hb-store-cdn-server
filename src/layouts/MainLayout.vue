<template>
<q-layout view="lHh Lpr lFf">
    <q-header class="q-pa-sm bg-transparent">
        <q-toolbar flat class="bg-dark text-white rounded-borders">
            <q-btn flat label="PKG-Zone" v-if="1" />
            <q-space />

            <q-tabs v-model="$root.tab" shrink stretch>
              <q-tab name="config" label="Config" />
              <q-tab name="files" label="Files" />
              <q-tab name="logs" label="Logs" />
            </q-tabs>
        </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
</q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',

})
</script>
