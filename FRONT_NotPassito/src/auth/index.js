import store from './../store'
import { EventBusModal } from '../events/'
import { HTTP } from '../HTTP'

export default {
  user: {},
  login (context, creds, redirect, isProd) {
    HTTP.post((isProd ? '/producer' : '') + '/login', { email: creds.email, password: creds.password }, {}).then(async response => {
      localStorage.setItem('todo', response.todo)
      await this.getAccount(isProd)
      EventBusModal.$emit('todo', response.todo)
      return true
    }).catch(function (error) {
      console.log(error)
      EventBusModal.$emit('todo', true)
      return false
    })
  },
  logout () {
    localStorage.removeItem('todo')
    store.commit('name of mutations')
    this.user.authenticated = false
  }
}
