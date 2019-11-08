<template>
    <div class="main-content bg-default">
        <!-- Header -->
        <div class="header bg-gradient-success py-2 py-lg-1">
            <div class="container">
                <div class="header-body text-center mb-7">
                    <div class="row justify-content-center">
                        <div class="col-lg-5 col-md-6">
                            <div>
                                <img class='np-logo-navbar-mini py-2' :src="logo">
                            </div>
                            <h2 class="text-white np-title">Bienvenue !</h2>
                            <p class="text-lead text-white">
                                Accédez à vos mot de passe en un clin d'oeil 😉
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="separator separator-bottom separator-skew zindex-100">
                <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1"
                     xmlns="http://www.w3.org/2000/svg">
                    <polygon class="fill-default" points="2560 0 2560 100 0 100"></polygon>
                </svg>
            </div>
        </div>
        <!-- Page content -->
        <div class="container mt--8 pb-5">
            <slide-y-up-transition mode="out-in" origin="center top">
                <router-view></router-view>
            </slide-y-up-transition>
        </div>
        <!-- Footer -->
        <content-footer/>
    </div>
</template>
<script>
import ContentFooter from './ContentFooter.vue'
import auth from '../auth'
import router from '../router'
import { EventBus } from '../event/eventBus'
import { SlideYUpTransition } from 'vue2-transitions'

export default {
  name: 'auth-layout',
  components: {
    SlideYUpTransition,
    ContentFooter
  },
  props: {
    logo: {
      type: String,
      default: 'logo.png',
      description: 'Sidebar app logo'
    }
  },
  data () {
    return {
      year: new Date().getFullYear(),
      showMenu: false
    }
  },
  created () {
    this.checkAuth()

    EventBus.$on('connectActions', () => {
      this.checkAuth()
    })
  },
  methods: {
    checkAuth () {
      if (auth.checkAuth()) {
        router.push('/profile')
      }
    }
  }
}
</script>
<style>
</style>
