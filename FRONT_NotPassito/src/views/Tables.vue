<template>
    <div>
      <!-- Popup -->
      <popupDeleteLine>
        <template slot="body">Delete Line ? </template>
      </popupDeleteLine>
      <popupModifyLine>
        <template slot="body">Modify Line ? </template>
      </popupModifyLine>
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
                <th class="text-left">Level</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr :key="pwd.passwd_id" v-for="pwd in pwds">
                <td>{{ pwd.passwd_name }}</td>
                <td>{{ pwd.passwd_user }}</td>
                <td>{{ pwd.passwd_value }}</td>
                <td>url.com</td>
                <td>{{ pwd.passwd_level }}</td>
                <td>
                  <v-btn @click="showModified(pwd.passwd_id)" class="bg-info text-white bold mx-1" small>Modifier</v-btn>
                  <v-btn @click="showDelete(pwd.passwd_id)" class="bg-danger text-white bold mx-1" small>Supprimer</v-btn>
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
import store from '../store'
import PopupDeleteLine from './Popup/PopupDeleteLine'
import PopupModifyLine from './Popup/PopupModifyLine'

export default {
  name: 'base-nav',
  data () {
    return {
      usr: {},
      pwds: []
    }
  },
  components: {
    PopupDeleteLine,
    PopupModifyLine
  },
  props: {
    title: {
      type: String,
      default: 'Table name',
      description: 'Title of the table'
    }
  },
  mounted () {
    this.usr = store.state.usr
    // Get pwds lines
    this.getPwds(this.$route.params.tablename)
  },
  methods: {
    showDelete (id) {
      this.showPopup = true
      EventBus.$emit('showDeleteLinePopup', { 'show': this.showPopup, 'id': id })
    },
    showModified (id) {
      this.showPopup = true
      EventBus.$emit('showModifyLinePopup', { 'show': this.showPopup, 'id': id })
    },
    getPwds (tablename) {
      HTTP.get('/user/' + this.usr.id + '/' + tablename + '/show').then(response => {
        this.pwds = response.data
      })
    }
  }
}
</script>
<style></style>
