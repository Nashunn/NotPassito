import store from '../store'
import { EventBus } from '../event/eventBus'
import { HTTP } from '../http-constants'

export default {
  user: {},

  login (creds) {
    HTTP.post('/connect', { user_email: creds.email, user_password: creds.password }, {}
    ).then(async response => {
      // Fill user
      this.user.id = response.data[0].user_id
      this.user.firstname = response.data[0].user_firstname
      this.user.lastname = response.data[0].user_lastname
      this.user.email = response.data[0].user_email
      this.user.authenticated = true
      this.user.tables = []

      // Get tables of users
      response.data.forEach(function (e) {
        this.user.tables.push(e.table_name)
      }, this)

      await store.commit('instanceUser', this.user)
      await EventBus.$emit('connectActions')
      return true
    }).catch(
      function (error) {
        console.log(error)
        return false
      }
    )
  },

  checkAuth () {
    return store.state.usr.authenticated
  },

  // Waiting for signup, delete

  logout () {
    store.commit('destroyUser')
    EventBus.$emit('disconnectActions')
    this.user.authenticated = false
  }
}
