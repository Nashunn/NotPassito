<template>
    <div>
      <!-- Popup -->
      <popupDeleteLine>
        <template slot="body">
          <div>Êtes-vous sûr de vouloir supprimer la ligne ? </div>
        </template>
      </popupDeleteLine>
      <popupModifyLine>
        <template slot="body">Modify Line ? </template>
      </popupModifyLine>
      <popupAddPassword>
        <template slot="body" :table= currentTable>
          <div class="mb-3">Ajouter un mot de passe</div>
        </template>
      </popupAddPassword>
     <!-- End Popup -->
      <base-header type="gradient-blue" class="pb-6 pb-8 pt-5 pt-md-8"></base-header>
      <div class="mx-5 my-2">
        <div>
           <v-btn @click="showAddPassword()" class="bg-green text-white bold mx-1" small>Ajouter</v-btn>
           <v-btn @click="passwordHideOrShow()" class="bg-info text-white bold mx-1" small>Cacher/Visible</v-btn>
        </div>
      </div>

      <div class="mx-5">
        <div class="my-2">{{ currentTable }}</div>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Titre</th>
                <th class="text-left">Utilisateur</th>
                <th class="text-left">Mot de passe</th>
                <th class="text-left">URL</th>
                <th class="text-left">Sécurité</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr :key="pwd.passwd_id" v-for="pwd in pwds">
                <td>{{ pwd.passwd_name }}</td>
                <td>{{ pwd.passwd_user }}</td>
                <td>{{ showPwd ? pwd.passwd_value : '***********' }}</td>
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
import PopupAddPassword from './Popup/PopupAddPassword'

export default {
  name: 'base-nav',
  data () {
    return {
      usr: {},
      currentTable: 'Table name',
      pwds: [],
      showPwd: false
    }
  },
  components: {
    PopupDeleteLine,
    PopupModifyLine,
    PopupAddPassword
  },
  props: {
  },
  mounted () {
    // Get user
    this.usr = store.state.usr
    // Get current table
    this.currentTable = this.$route.params.tablename
    // Get pwds lines
    this.getPwds(this.currentTable)
  },
  methods: {
    showDelete (id) {
      this.showPopup = true
      EventBus.$emit('showDeleteLinePopup', { 'show': this.showPopup, 'id': id, 'tablename': this.currentTable })
    },
    showModified (id) {
      this.showPopup = true
      EventBus.$emit('showModifyLinePopup', { 'show': this.showPopup, 'id': id })
    },
    showAddPassword () {
      this.showPopup = true
      EventBus.$emit('showAddPassword', { 'show': this.showPopup })
    },
    passwordHideOrShow () {
      this.showPwd = !this.showPwd
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
