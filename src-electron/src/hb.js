import fs from 'fs'
import pkgInfo from 'ps4-pkg-info'

export default {
    files: [],

    createItem(data, file){
        // let patchedFilename = item.name.replace(/[^a-zA-Z0-9-_.]/g, '')
        let stats = fs.lstatSync(file)
        let size = this.formatBytes(stats.size, 2)

        let item = {
          "id": data.TITLE_ID,
          "name": data.TITLE,
          "desc": "__desc",
          "image": "__image",
          "package": "http://api.staging.pkg-zone.com/detail/BBFF12362",
          "version": data.APP_VER,
          "picpath": "/user/app/NPXS39041/storedata/hb_store_cdn_sample.png",
          "desc_1": "",
          "desc_2": "",
          "ReviewStars": "0/5 Rating",
          "Size": size,
          "Author": "HB-Store CDN",
          "apptype": "HB Game",
          "pv": "5.05+",
          "main_icon_path": "__image",
          "main_menu_pic": "/user/app/NPXS39041/storedata/"+ data.TITLE_ID +".png",
          "releaseddate": "2019-04-30",
          file,
        }

        return item
    },

    formatBytes(bytes, decimals=2, k=1000) {
        if (bytes === 0) return '0 Bytes';

        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },

}
