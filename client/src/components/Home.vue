<template>
  <v-content>

  </v-content>
</template>
<script>
import serverApi from '@/services/ApiCalls'

export default {
  async mounted () {
    console.log('mounted Home isUserLoggedIn: ', this.$store.state.isUserLoggedIn, 'localStorage.token: ', localStorage.token)
    // попытка автологина:
    if (!this.$store.state.isUserLoggedIn) {
      try {
        if (localStorage.token !== '') {
          this.$store.state.token = localStorage.token

          const response = await serverApi.updateValidToken()
          console.log('mounted Home response: ', response.data)
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
    }
  }
}
</script>
