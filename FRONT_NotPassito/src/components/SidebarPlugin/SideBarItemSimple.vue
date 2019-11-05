<template>
    <li class="nav-item">
      <router-link class="nav-link" to="#">
        <template>
            <i :class="icon"></i>
            <span class="nav-link-text">{{ name }}</span>
        </template>
      </router-link>
    </li>
</template>
<script>
export default {
  name: 'sidebar-item-simple',
  props: {
    name: {
      type: String,
      default: 'Undefined'
    },
    icon: {
      type: String,
      default: 'ni ni-bold-right'
    }
  },
  inject: {
    autoClose: {
      default: true
    }
  },
  data () {
    return {
      children: [],
      collapsed: true
    }
  },
  methods: {
    linkClick () {
      if (
        this.autoClose &&
          this.$sidebar &&
          this.$sidebar.showSidebar === true
      ) {
        this.$sidebar.displaySidebar(false)
      }
    }
  }
}
</script>
