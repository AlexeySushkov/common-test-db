<template>
  <v-content>

  </v-content>
</template>
<script>
import serverApi from '@/services/ApiCalls'

export default {
  methods: {

    async navigateTo (route) {
      this.$router.push(route)
    }
  },

  async mounted () {
    console.log('mounted GoogleLogin sessionId: ', sessionStorage.sessionId)
    // По sessionId получаем юзера
    try {
      if (sessionStorage.sessionId != null) {
        const response = await serverApi.userBySessionId(sessionStorage.sessionId)
        console.log('mounted Logout response: ', response.data)
        this.$store.dispatch('setToken', response.data.token)
        this.$store.dispatch('setSessionId', response.data.sessionId)
        this.$store.dispatch('setEmail', response.data.email)
      }
    } catch (error) {
      if ((error.response !== undefined) && (error.response.data.error !== undefined)) {
        console.log('error.response.data.error: ', error.response.data.error)
      } else {
        console.log('Error: ', 'No connection to the server')
      }
    }
    await this.navigateTo({ name: 'Home' }) 
  }
}
</script>
