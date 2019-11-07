import store from '../store'
import router from '../router'
import { HTTP } from '../http-constants'

export default {
  // TODO : replace after back is done
  // user: {},
  user: {
    user_id: 1,
    user_firstname: 'adonis',
    user_lastname: 'lebg',
    user_email: 'adonis@lebg.com',
    user_password: 'testNegro',
    table_name: 'network'
  },

  login (creds) {
    HTTP.post('/connect', { user_email: creds.email, user_password: creds.password }, {}
    ).then(response => {
      localStorage.setItem('currentUsr', response.results)
      console.log(response.results)
      return true
    }).catch(
      function (error) {
        console.log(error)
        return false
      }
    )

    store.commit('instanceUser', this.user)
    localStorage.setItem('currentUsr', this.user)
    router.push('/')
  },

  logout () {
    localStorage.removeItem('todo')
    store.commit('name of mutations')
    this.user.authenticated = false
  }
}
