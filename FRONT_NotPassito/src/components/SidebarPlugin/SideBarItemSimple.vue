<template>
    <li class="nav-item">
      <div class="nav-link np-clicker">
        <template>
            <i :class="icon"></i>
            <span class="nav-link-text">{{ name }}</span>
        </template>
      </div>
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
