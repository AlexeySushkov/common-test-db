import Vue from 'vue';
import Vuetify from 'vuetify'

import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
import flushPromises from 'flush-promises'

import Data from '@/components/Data';
jest.mock('axios')
import store from '@/store/index'
Vue.use(Vuetify)

describe('Data tests', () => {
  const localVue = createLocalVue()
  localVue.use(Vuetify)
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })
  // Only snapshot
  it('Data snapshot', () => {
      const wrapper = mount(Data, {
        localVue,
        vuetify,
        store
      })
      expect(wrapper.html()).toMatchSnapshot()
  })
  // "mounted" func called and user login
  it('Data mounted called', () => {
    const mountedCall = jest.spyOn(Data, 'mounted')
    const wrapper = mount(Data, {
      localVue,
      vuetify,
      store
    })
    expect(mountedCall).toHaveBeenCalled()
    store.dispatch('setToken', 'Token from UnitTest to login user')
    console.log('isUserLoggedIn after: ', store.state.isUserLoggedIn)
    expect(store.state.isUserLoggedIn).toBe(true)  
  })
})

