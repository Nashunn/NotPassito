<template>
    <div>
      <!-- Popup -->
      <popupDeleteLine>
        <template slot="body">Delete Line ?</template>
      </popupDeleteLine>
     <!-- End Popup -->
      <base-header type="gradient-blue" class="pb-6 pb-8 pt-5 pt-md-8"></base-header>
      <div class="mx-5">
        <div class="my-2">{{ title }}</div>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Name</th>
                <th class="text-left">User</th>
                <th class="text-left">Password</th>
                <th class="text-left">URL</th>
                <th class="text-left">Created</th>
                <th class="text-left">Modified</th>
                <th class="text-left">Expired</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr :key="pwd.passwd_id" v-for="pwd in pwds">
                <td>{{ pwd.passwd_name }}</td>
                <td>{{ pwd.passwd_user }}</td>
                <td>{{ pwd.passwd_value }}</td>
                <td>url.com</td>
                <td>xx/xx/xxxx</td>
                <td>xx/xx/xxxx</td>
                <td>xx/xx/xxxx</td>
                <td>
                  <v-btn @click="showModified()" class="bg-info text-white bold mx-1" small>Modifier</v-btn>
                  <v-btn @click="showDelete('IDItem')" class="bg-danger text-white bold mx-1" small>Supprimer</v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </div>
    </div>
</template>
<script>
import { EventBus } from '../event/eventBus'
import { HTTP } from '../http-constants'
import PopupDeleteLine from './Popup/PopupDeleteLine'

export default {
  name: 'base-nav',
  data () {
    return {
      pwds: []
    }
  },
  components: {
    PopupDeleteLine
  },
  props: {
    title: {
      type: String,
      default: 'Table name',
      description: 'Title of the table'
    }
  },
  mounted () {
    // Get pwds lines
    this.getPwds()
  },
  methods: {
    showDelete (id) {
      this.showPopup = true
      EventBus.$emit('showDeletePopup', { 'show': this.showPopup, 'id': id })
    },
    getPwds () {
      HTTP.get('').then(response => {
        this.pwds = response.data.result
      })
    }
  }
}
</script>
<style></style>
