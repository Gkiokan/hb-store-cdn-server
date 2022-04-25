<template lang="html">
<div class='logs'>

    <div style="height: 15px" />

    Logs, latest on top<br>
    <br>

    <div class="q-mb-md" v-for="log in logs">
        <b>{{ log.time }} </b> <br>
        <div v-html="log.message" />
    </div>

</div>
</template>

<script>
import { sync } from 'vuex-pathify'

export default {
    name: 'Logs',

    computed: {
        logs: sync('app/logs', false),
    }
}
</script>

<style lang="scss" scoped>
</style>
