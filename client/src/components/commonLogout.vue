<template>
  <v-content>

  </v-content>
</template>
<script>

export default {
  methods: {

    async navigateTo (route) {
      this.$router.push(route)
    }
  },

  async mounted () {
    console.log('mounted Logout isUserLoggedIn: ', this.$store.state.isUserLoggedIn)
    this.$store.dispatch('setEmail', '')
    this.$store.dispatch('setToken', '')
    this.$store.dispatch('setSessionId', '')
    this.$store.dispatch('setTitleColor', 'blue darken-3')
    await this.navigateTo({ name: 'Home' }) 
  }
}
</script>
