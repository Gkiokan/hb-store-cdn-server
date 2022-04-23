import fs from 'fs'
import pkgInfo from 'ps4-pkg-info'
import path from 'path'

export default {
    files: [],

    createItem(data, file){
        // let patchedFilename = item.name.replace(/[^a-zA-Z0-9-_.]/g, '')
        let patchedFilename = (file.charAt(0) == "/") ? file.substr(1).replace(/[^a-zA-Z0-9-_./]/g, '') : file.replace(/[^a-zA-Z0-9-_./]/g, '')
        let stats = fs.lstatSync(file)
        let size = this.formatBytes(stats.size, 2)

        let item = {
          "id": data.TITLE_ID,
          "name": data.TITLE,
          "desc": "",
          "image": "__image",
          "package": "__package",
          "version": data.APP_VER,
          "picpath": "/user/app/NPXS39041/storedata/" + data.TITLE_ID + ".png",
          "desc_1": "",
          "desc_2": "",
          "ReviewStars": "Custom Rating",
          "Size": size,
          "Author": "HB-Store CDN",
          "apptype": "HB Game",
          "pv": "5.05+",
          "main_icon_path": "__image",
          "main_menu_pic": "/user/app/NPXS39041/storedata/" + data.TITLE_ID + ".png",
          "releaseddate": "2019-04-30",
          path: file,
          filename: path.basename(file),
          patchedFilename,
        }

        return item
    },

    addImages(data=null, base){
        let id    = data.id
        let image = base + 'icon0.png'

        if(data==null)
          data = this.item

        data.image = image
        data.main_icon_path = image

        return data
    },

    formatBytes(bytes, decimals=2, k=1000) {
        if (bytes === 0) return '0 Bytes';

        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },

}
