<template>
    <div>
      <!-- Popup -->
      <popupDeleteLine>
        <template slot="body">Delete Line ? </template>
      </popupDeleteLine>
      <popupModifyLine>
        <template slot="body">Modify Line ? </template>
      </popupModifyLine>
      <popupAddPassword>
        <template slot="body">Add New Password ? </template>
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
        <div class="my-2">{{ title }}</div>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Titre</th>
                <th class="text-left">Utilisateur</th>
                <th class="text-left">Mot de passe</th>
                <th class="text-left">URL</th>
                <th class="text-left">Créé</th>
                <th class="text-left">Modifié</th>
                <th class="text-left">Expiré</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr :key="pwd.passwd_id" v-for="pwd in pwds">
                <td>{{ pwd.passwd_name }}</td>
                <td>{{ pwd.passwd_user }}</td>
                <td>{{ showPwd ? pwd.passwd_value : '***********' }}</td>
                <td>pwd.passwd_url</td>
                <td>pwd.passwd_created</td>
                <td>pwd.passwd_modified</td>
                <td>pwd.passwd_expired</td>
                <td>
                  <v-btn @click="showModified('IDItem')" class="bg-info text-white bold mx-1" small>Modifier</v-btn>
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
import PopupModifyLine from './Popup/PopupModifyLine'
import PopupAddPassword from './Popup/PopupAddPassword'

export default {
  name: 'base-nav',
  data () {
    return {
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
      EventBus.$emit('showDeleteLinePopup', { 'show': this.showPopup, 'id': id })
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
    getPwds () {
      HTTP.get('').then(response => {
        this.pwds = response.data.result
      })
    }
  }
}
</script>
<style></style>
