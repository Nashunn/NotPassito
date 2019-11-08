<template>
    <base-nav class="navbar-top navbar-dark"
              id="navbar-main"
              :show-toggle-button="false"
              expand>
        <div class="form-group mb-0 mr-3 d-none d-md-flex ml-lg-auto">
        </div>
        <ul class="navbar-nav align-items-center d-none d-md-flex">
            <li class="nav-item dropdown">
                <base-dropdown class="nav-link pr-0">
                    <div class="media align-items-center" slot="title">
                      <span class="avatar avatar-sm rounded-circle">
                        <img alt="Image placeholder" src="img/np/user.png">
                      </span>
                      <div class="media-body ml-2 d-none d-lg-block">
                          <span class="mb-0 text-sm font-weight-bold">{{usr.firstname}} {{usr.lastname}}</span>
                      </div>
                    </div>

                    <template>
                        <div class=" dropdown-header noti-title">
                            <h6 class="text-overflow m-0">Welcome!</h6>
                        </div>
                        <router-link to="/profile" class="dropdown-item">
                            <i class="ni ni-single-02"></i>
                            <span>My profile</span>
                        </router-link>
                        <div class="dropdown-divider"></div>
                        <div @click="logoutUser()" class="dropdown-item">
                            <i class="ni ni-user-run"></i>
                            <span>Logout</span>
                        </div>
                    </template>
                </base-dropdown>
            </li>
        </ul>
    </base-nav>
</template>
<script>
import store from '../store'
import auth from '../auth'
import { EventBus } from '../event/eventBus'

export default {
  name: 'dashboard-navbar',
  data () {
    return {
      activeNotifications: false,
      showMenu: false,
      searchQuery: '',
      credentials: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    toggleSidebar () {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar)
    },
    hideSidebar () {
      this.$sidebar.displaySidebar(false)
    },
    toggleMenu () {
      this.showMenu = !this.showMenu
    },
    logoutUser () {
      auth.logout()
      EventBus.$emit('disconnectActions')
    }
  },
  computed: {
    usr: function () {
      return store.state.usr
    }
  }
}
</script>
