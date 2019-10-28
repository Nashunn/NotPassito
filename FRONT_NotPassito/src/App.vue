<template>
  <div id="app">
    <notifications></notifications>
    <!-- Popup here -->
      <!-- Delete line popup -->
      <popupDeleteLine></popupDeleteLine>
      <!-- Create table popup -->
    <!-- Popup End -->
    <router-view/>
  </div>
</template>

<script>
import PopupDeleteLine from './views/Popup/PopupDeleteLine'

export default {
  name: 'App',
  components: {
    PopupDeleteLine
  }
}
</script>
