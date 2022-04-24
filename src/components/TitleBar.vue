<template lang="html">
  <div class="bg-black q-mb-xs rounded-borders titleBar">
      <div class='row'>
          <div class="q-pl-sm self-center text-weight-bold draggable">
              HB-Store CDN Server
          </div>
          <q-space class="draggable" />
          <div class='q-pr-sm'>
              <q-btn round size="sm" icon="power_settings_new" @click="closeApplication" />
          </div>
      </div>
  </div>
</template>

<script>
export default {
    name: "TitleBar",

    methods: {
        closeApplication(){
            this.$q.dialog({
                dark: true,
                title: "Quit application?",
                message: "This will stop the Server"
            }).onOk( () => {
                window.hb.closeApplication()
            })
        }
    }
}
</script>

<style lang="css" scoped>
</style>
