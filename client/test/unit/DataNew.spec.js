import Vue from 'vue';
import Vuetify from 'vuetify'

import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
import flushPromises from 'flush-promises'

import DataNew from '@/components/DataNew';
jest.mock('axios')
import store from '@/store/index'
Vue.use(Vuetify)

describe('DataNew tests', () => {
  const localVue = createLocalVue()
  localVue.use(Vuetify)
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })
  // Only snapshot
  it('DataNew snapshot', () => {
      const wrapper = mount(DataNew, {
        localVue,
        vuetify,
        store
      })
      expect(wrapper.html()).toMatchSnapshot()
  })
  // "mounted" func called and user login and check default values
  it('DataNew mounted called', () => {
    const mountedCall = jest.spyOn(DataNew, 'mounted')
    const wrapper = mount(DataNew, {
      localVue,
      vuetify,
      store
    })
    expect(mountedCall).toHaveBeenCalled()
    store.dispatch('setToken', 'Token from UnitTest to login user')
    console.log('isUserLoggedIn after: ', store.state.isUserLoggedIn)
    expect(store.state.isUserLoggedIn).toBe(true)  
    expect(wrapper.vm.newData.data.Counter1).toBe('10')
    expect(wrapper.vm.newData.data.Counter2).toBe('20')
  })
  // Click the button 'newDataCall'
  it('DataNew call newDataCall', async () => {
    // jest.useFakeTimers()
    // jest.advanceTimersByTime(10000)

    const wrapper = mount(DataNew, {
      localVue,
      vuetify,
      store
    })
    store.dispatch('setToken', 'Token from UnitTest to login user')
    console.log('isUserLoggedIn: ', store.state.isUserLoggedIn)
    expect(store.state.isUserLoggedIn).toBe(true)  

    // Click not implemented just check existence
    const button1 = wrapper.find('button.newDataCall')  
    expect(button1.exists()).toBe(true)
    const button2 = wrapper.find('button.Cancel')  
    expect(button2.exists()).toBe(true)

    // button.trigger('click')
    // await flushPromises()
  })
})

