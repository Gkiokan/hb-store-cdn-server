<template lang="html">
<div class='server_binaries'>

    <div class='row'>
        <div class='col'>
            <q-btn outline no-caps color="cyan" label="Check Server Binaries" :loading="isComplete == false && updateAvailable == true" @click="checkServerBinaries" />
        </div>
        <div>
            <q-btn flat size="md" class="q-mx-sm" icon="update" @click="forceRedownload" />
        </div>
        <div class='self-center text-right'>
            <div> Current Version {{ binaryVersion }} </div>
            <div v-if="updateAvailable && updateDone == false"><small> New Version {{ newUpdateAvailableVersion }} </small></div>
        </div>
    </div>

    <div v-if="updateAvailable && false">
        <div v-for="asset in assets">
            <q-linear-progress rounded size="20px" :value="asset.progress" color="accent" class="q-mt-sm">
                <div class="absolute-full flex flex-start items-center text-white q-pl-xs" style="font-size: 15px; line-height: 1;">
                    {{ asset.name }}
                </div>
            </q-linear-progress>
        </div>

        <q-btn outlined no-caps icon-right="done" size="xs" color="green" class="full-width q-pa-none q-mt-sm" label="Server Binaries updated"
              style="font-size: 14px; line-height: 1;" :loading="!isComplete" @click="updateAvailable = false" />
    </div>

</div>
</template>

<script>
import { get, sync } from 'vuex-pathify'

export default {
    name: 'ServerBinaryDownload',

    data(){ return {
        run: false,
        updateAvailable: false,
        updateDone: false,
        newUpdateAvailableVersion: "0.00",
    }},

    mounted(){
        this.addEventListener()
    },

    unmounted(){
        this.removeEventListener()
    },

    computed: {
        assets: sync('server/assets', false),
        binaryVersion: sync('server/binaryVersion', false),
        isComplete(){
            let done = this.assets.filter( f => f.progress == 1)
            let isDone = this.assets.length == done.length ? true : false

            if(isDone){
              this.updateServerBinariesComplete()
            }

            return isDone
        }
    },

    methods: {
        addEventListener(){
            console.log("Add Event Listener to Server Binaries Download Component")
            window.ipc.on('download-complete', this.downloadProgress)
            window.ipc.on('check-server-binaries', this.checkServerBinaries)
        },

        removeEventListener(){
            console.log("Remove Event Listener to Server Binaries Download Component")
            window.ipc.removeListener('download-complete', this.downloadProgress)
            window.ipc.removeListener('check-server-binaries', this.checkServerBinaries)
        },

        async checkServerBinaries(){
            let release = await this.$hb.getRelease()
            let version = this.$hb.getVersion(release)
            let assets  = this.$hb.getAssets(release)
            let name    = this.$hb.getName(release)

            console.log({ version, assets, name })

            let compare = this.$hb.checkVersion(this.binaryVersion, version)

            if(compare == 1)
              this.$q.notify({
                  message: "Your current Binary are higher then the release",
                  timeout: 200,
              })

            if(compare == 0)
              this.$q.notify({
                  message: "Your Server Binaries are up to date",
                  timeout: 200,
              })

            if(compare == -1){
              this.updateAvailable = true
              this.newUpdateAvailableVersion = version
              this.assets = assets
              this.$root.addLogs("New Server Binaries are available. Update in progress")
              this.$q.notify({
                  message: "New Server Binaries are available. Update in progress",
                  timeout: 200,
              })
              this.downloadServerBinaries()
            }
        },

        async forceRedownload(){
            this.run = false
            this.updateDone    = false

            let release = await this.$hb.getRelease()
            this.assets = this.$hb.getAssets(release)
            this.updateAvailable = true
            this.newUpdateAvailableVersion = this.$hb.getVersion(release)

            this.$root.addLogs("Force re-update Server Binaries to version " + this.newUpdateAvailableVersion)
            this.downloadServerBinaries()
        },

        downloadServerBinaries(){
            this.run = true
            this.updateAvailable = true
            this.updateDone = false
            this.assets.map( f => window.hb.downloadServerBinaries(f.url) )
        },

        downloadProgress(event, o){
            let find = this.assets.find( f => f.url == o.file)

            if(find){
                find.progress = o.item.percent
                // console.log(find.name + ' ' + o.item.percent)
            }
        },

        updateServerBinariesComplete(){
            if(this.run == false) return
            if(this.updateDone) return

            console.log("update binary service", this.binaryVersion, this.newUpdateAvailableVersion)

            this.run           = false
            this.updateDone    = true
            this.binaryVersion = this.newUpdateAvailableVersion

            this.$root.addLogs("Server Binaries has been updated to version " + this.newUpdateAvailableVersion)

            if(false)
            this.$q.notify({
                message: "Server Binaries has been updated.",
                color: "green",
                icon: "done",
                timeout: 500,
            })
        },


    }
}
</script>

<style lang="css" scoped>
</style>
