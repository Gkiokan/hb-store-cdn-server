<template>
<q-page padding>
    <q-tab-panels v-model="$root.tab" animated class="bg-transparent panel-wrapper"
                  transition-prev="slide-down" transition-next="slide-up">
        <q-tab-panel class="q-pt-sm" name="config">
            <Config />
        </q-tab-panel>

        <q-tab-panel class="q-pt-sm" name="files">
            <Files />
        </q-tab-panel>

        <q-tab-panel class="q-pt-sm" name="logs">
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
