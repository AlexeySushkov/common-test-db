import axios from 'axios'
import config from '@/config'
import store from '@/store/index'

export default () => {
  return axios.create({
    baseURL: config.baseURL_HTTPS,
    timeout: config.requestTimeout, // in ms.
    headers: {
      Authorization: `Bearer ${store.state.token}`,
      'X-CSRF-Token': `${store.state.sessionId}`
    }
  })
}
