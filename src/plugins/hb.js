import axios from 'axios'
import store from '~/store'
import semver from 'semver'

const hb = {
    data: {
        source: 'https://api.github.com/repos/LightningMods/PS4-Store/releases',
        files: [
            'homebrew.elf',
            'homebrew.elf.sig',
            'remote.md5',
            'store.prx',
            'store.prx.sig',
        ],
    },

    async getRelease(){
        let { data } = await axios.get(this.data.source)
        return data.length ? data[0] : false
    },

    getName(release=null){
        if(!release) return "NO_RELEASE_OBJECT"
        return release.name
    },

    getVersion(release=null){
        if(!release) return "NO_RELEASE_OBJECT"
        return release.tag_name
    },

    getAssets(release=null){
        if(!release) return "NO_RELEASE_OBJECT"
        let assets = release.assets
        let urls = []

        assets.map( f => {
            urls.push({
                name: f.name,
                progress: 0,
                url: f.browser_download_url
            })
        })

        return urls
    },

    checkVersion(currentVersion="0.00", version="0.00"){
        console.log("compare ", currentVersion, version)
        return this.compareVersion(currentVersion, version)
    },

    compareVersion(v1, v2) {
        const v1Parts = v1.split('.')
        const v2Parts = v2.split('.')
        const length = Math.max(v1Parts.length, v2Parts.length)
        for (let i = 0; i < length; i++) {
          const value = (parseInt(v1Parts[i]) || 0) - (parseInt(v2Parts[i]) || 0)
          if (value < 0) return -1
          if (value > 0) return 1
        }
        return 0
    },


}

export default hb
