<template lang="html">
<div class='files'>

    <div style="height: 15px" />

    <div class="q-px-md q-mb-lg">
        <div v-if="files.length == 0">
            List of local serving files will be here ...
        </div>
        <div v-else>
            Found {{ files.length }} files
        </div>
    </div>


    <div class="q-mb-md item" v-for="item in files">
        <!-- {{ getFileName(file) }} -->
        <div class='row q-col-gutter-md q-px-md'>
            <div class=''>
                <img :src="item.icon0" style="width: 100px; height: 100px" />
            </div>
            <div class='col'>
                {{ item.id }} <q-chip outline square class="q-mb-sm" size="xs" color="cyan" v-if="isBackport(item.filename)"> Is Backport </q-chip> <br>
                <div class="text-bold">{{ item.name }} </div>
                Version: {{ item.version }} <br>
                Size: {{ item.Size }} <br>
                {{ item.package }}
            </div>
        </div>
    </div>

</div>
</template>

<script>
import { get } from 'vuex-pathify'
import path from 'path'

export default {
    name: 'Files',

    computed: {
        files: get('server/files', false),
    },

    methods: {
        getFileName(file){
            return path.basename(file)
        },

        isBackport(filename){
            let value = filename.toLowerCase()
            return value.includes('5.05') || value.includes('6.') || value.includes('backport')
        }
    }
}
</script>

<style lang="scss" scoped>
.item {
  &:nth-child(odd) {
      background: #151515;
  }
}
</style>
