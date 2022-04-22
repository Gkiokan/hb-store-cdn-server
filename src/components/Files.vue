<template lang="html">
<div class='files'>

    <div class="text-h4" v-if="false">Files</div>
    <div style="height: 15px" />

    <div v-if="files.length == 0">
        List of local serving files will be here ...
    </div>


    <div v-for="file in files">
        <!-- {{ getFileName(file) }} -->
        <pre>{{ file }}</pre>
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
    }
}
</script>

<style lang="scss" scoped>
</style>
