import axios from 'axios'

export const HTTP = axios.create({
  baseURL: 'https://notpassito.glitch.me:4000'
})
