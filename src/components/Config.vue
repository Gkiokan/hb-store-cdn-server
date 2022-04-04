<template lang="html">
<div class='config'>

    <div class="text-h4">Config</div>
    <div style="height: 15px" />

    <div class='q-gutter-y-md q-mb-md'>
      <q-input outlined dense stack-label label="Local IP" />
      <q-input outlined dense stack-label label="Folder Path" />
    </div>

    <div class='q-gutter-md'>
        <q-btn outline color="green-8" label="Start" />
        <q-btn outline color="orange-8" label="Restart" />
        <q-btn outline color="red-8" label="Stop" />
    </div>

    <q-separator class="q-my-md" v-if="false" />

</div>
</template>

<script>
export default {
    name: 'Config',
}
</script>

<style lang="scss" scoped>
</style>
