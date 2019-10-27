import '@/assets/vendor/nucleo/css/nucleo.css'
import '@/assets/scss/argon.scss'
import 'vuetify/dist/vuetify.min.css'
import 'vuetify/dist/vuetify.css'
import globalComponents from './globalComponents'
import globalDirectives from './globalDirectives'
import SidebarPlugin from '@/components/SidebarPlugin/index'
import NotificationPlugin from '@/components/NotificationPlugin/index'
import Vuetify from 'vuetify'

export default {
  install (Vue) {
    Vue.use(globalComponents)
    Vue.use(globalDirectives)
    Vue.use(SidebarPlugin)
    Vue.use(NotificationPlugin)
    Vue.use(Vuetify)
  }
}
