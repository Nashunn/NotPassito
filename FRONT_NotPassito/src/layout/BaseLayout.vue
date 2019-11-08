<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <!-- Popup -->
    <popupNewTable>
      <template slot="body">New Table ?</template>
    </popupNewTable>
    <!-- End Popup -->

    <!-- Sidebar left -->
    <side-bar
      :background-color="sidebarBackground"
      short-title=""
      title=""
    >
      <template slot="links">
        <div :key="table.id" v-for="table in usr.tables">
          <sidebar-item-simple @click.native="redirectSelectedTable(table)"
            :name= table
            icon='ni ni-bullet-list-67 text-primary'
          />
        </div>
        <sidebar-item-simple @click.native="showNewTable()"
          name='Nouvelle table'
          icon='ni ni-fat-add text-red'
        />
      </template>
    </side-bar>
    <!-- End Sidebar left -->
    <!-- Main content with : navbar, our content loaded with router, footer -->
    <div class="main-content" :data="sidebarBackground">
      <!-- Navbar -->
      <dashboard-navbar></dashboard-navbar>
      <!-- End Navbar -->

      <div @click="toggleSidebar">
        <fade-transition :duration="200" origin="center top" mode="out-in">
          <!-- Our view loaded by router -->
          <router-view :key="$route.fullPath"></router-view>
        </fade-transition>
        <!-- Footer -->
        <content-footer v-if="!$route.meta.hideFooter"></content-footer>
        <!-- End Footer -->
      </div>
    </div>
  </div>
</template>
<script>
import DashboardNavbar from './DashboardNavbar.vue'
import ContentFooter from './ContentFooter.vue'
import popupNewTable from '../views/Popup/PopupNewTable'
import auth from '../auth'
import router from '../router'
import store from '../store'
import { EventBus } from '../event/eventBus'
import { FadeTransition } from 'vue2-transitions'

export default {
  components: {
    DashboardNavbar,
    ContentFooter,
    FadeTransition,
    popupNewTable
  },
  data () {
    return {
      usr: {},
      sidebarBackground: 'vue' // vue|blue|orange|green|red|primary
    }
  },
  mounted () {
    this.usr = store.state.usr
  },
  created () {
    this.checkAuth()
    EventBus.$on('disconnectActions', () => {
      this.checkAuth()
    })
  },
  methods: {
    toggleSidebar () {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false)
      }
    },
    showNewTable () {
      this.showPopup = true
      EventBus.$emit('showNewTablePopup', { 'show': this.showPopup })
    },
    checkAuth () {
      if (!auth.checkAuth()) {
        router.push('/login')
      }
    },
    redirectSelectedTable (table) {
      router.push('/tables/' + table)
    }
  }
}
</script>
<style lang="scss">
</style>
