import axios from 'axios'
import config from '@/config'
import store from '@/store/index'

export default () => {
  return axios.create({
    baseURL: config.baseURL,
    timeout: config.requestTimeout,
    headers: {
      Authorization: `Bearer ${store.state.token}`,
      'X-CSRF-Token': `${store.state.sessionId}`
    }
  })
}
