import util from '~/plugins/util'
import hb from '~/plugins/hb'

export default ({ app }) => {
    app.config.globalProperties.$hb = hb
    app.config.globalProperties.$util = util
}
