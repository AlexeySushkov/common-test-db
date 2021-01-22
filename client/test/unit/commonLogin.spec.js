import Vue from 'vue';
import Vuetify from 'vuetify'

import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
import flushPromises from 'flush-promises'

import commonLogin from '@/components/commonLogin';
jest.mock('axios')
import store from '@/store/index'
Vue.use(Vuetify)

describe('commonLogin tests', () => {
  const localVue = createLocalVue()
  localVue.use(Vuetify)
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })
  // Only snapshot
  it('commonLogin snapshot', () => {
      const wrapper = mount(commonLogin, {
        localVue,
        vuetify,
        store
      })
      expect(wrapper.html()).toMatchSnapshot()
  })
  // "mounted" func called and user login
  it('commonLogin mounted called', () => {
    const mountedCall = jest.spyOn(commonLogin, 'mounted')
    const wrapper = mount(commonLogin, {
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

