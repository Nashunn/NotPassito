<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <!-- Sidebar left -->
    <side-bar
      :background-color="sidebarBackground"
      short-title="NotPassito"
      title="NotPassito"
    >
      <template slot="links">
        <sidebar-item
          :link="{
            name: 'Table exemple',
            icon: 'ni ni-bullet-list-67 text-primary',
            path: '/tables'
          }"
        />
        <sidebar-item :link="{name: 'Nouvelle table', icon: 'ni ni-fat-add text-red', path: '/addTables'}"/>
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
          <router-view></router-view>
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
import { FadeTransition } from 'vue2-transitions'

export default {
  components: {
    DashboardNavbar,
    ContentFooter,
    FadeTransition
  },
  data () {
    return {
      sidebarBackground: 'vue' // vue|blue|orange|green|red|primary
    }
  },
  methods: {
    toggleSidebar () {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false)
      }
    }
  }
}
</script>
<style lang="scss">
</style>
