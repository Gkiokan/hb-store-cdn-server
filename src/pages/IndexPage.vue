<template>
<q-page padding>
    <q-tab-panels v-model="$root.tab" animated class="bg-transparent"
                  transition-prev="slide-down" transition-next="slide-up">
        <q-tab-panel class="q-pa-none" name="config">
            <Config />
        </q-tab-panel>

        <q-tab-panel class="q-pa-none" name="files">
            <Files />
        </q-tab-panel>

        <q-tab-panel class="q-pa-none" name="logs">
            <Logs />
        </q-tab-panel>
    </q-tab-panels>

</q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexPage',

  data(){ return {
      tab: 'config',
  }}

})
</script>
