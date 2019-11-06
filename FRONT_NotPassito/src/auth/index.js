import store from '../store'
import { HTTP } from '../http-constants'

export default {
  user: {},
  login (creds) {
    HTTP.post('/connect', { user_email: creds.email, user_password: creds.password }, {}).then(response => {
      localStorage.setItem('currentUsr', response.results)
      console.log('CA PASSE')
      console.log(response.results)
      return true
    }).catch(
      function (error) {
        console.log(error)
        return false
      }
    )
  },
  logout () {
    localStorage.removeItem('todo')
    store.commit('name of mutations')
    this.user.authenticated = false
  }
}
