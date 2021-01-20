import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify'

import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
import DataNew from '@/components/DataNew';
import store from '@/store/index'
const VueWithVuex = createLocalVue()
VueWithVuex.use(Vuex)
Vue.use(Vuetify)

describe('DataNew', () => {
  const localVue = createLocalVue()
  localVue.use(Vuetify)
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('DataNew wrapper', () => {
      const wrapper = mount(DataNew, {
        localVue,
        vuetify,
        store
      })
      expect(wrapper.html()).toMatchSnapshot()
  })
//   test('DataNew mount', () => {
//     jest.useFakeTimers()
//     const mountedCall = jest.spyOn(DataNew, 'mounted')
//     const wrapper = mount(DataNew, {
//       localVue: VueWithVuex,
//       store
//     })
//     console.log('this.error: ', wrapper.vm.error)
//     expect(mountedCall).toHaveBeenCalled()
//   })
//   test('DataNew store', () => {
//     const wrapper = mount(DataNew, {
//       localVue: VueWithVuex,
//       store
//     })
//     // this.$store.state.isUserLoggedIn
//     console.log('isUserLoggedIn before: ', store.state.isUserLoggedIn)
//     // this.$store.dispatch('setToken', response.data.token)
//     store.dispatch('setToken', 'Token from UnitTest')
//     console.log('isUserLoggedIn after: ', store.state.isUserLoggedIn)
// })
})

