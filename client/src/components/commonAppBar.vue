<template>
  <v-main>
  <v-app-bar
    :clipped-left="$vuetify.breakpoint.lgAndUp"
    app
    :color = "configColor"
    dark
  >
    <v-app-bar-nav-icon @click.stop="$store.state.drawer = !$store.state.drawer" />
    <v-toolbar-title
      style="width: 1200px"
      class="ml-0 pl-4"
    >
    <span 
    v-if="!$store.state.isUserLoggedIn"
    style="color:white"
    >Not logged in
    </span>
    <span 
    v-if="$store.state.isUserLoggedIn"
    style="color:white"
    >Logged in e-mail:
    </span>
    <span 
    v-if="$store.state.isUserLoggedIn"
    style="color:white"
    >{{ $store.state.email }}
    </span>
    </v-toolbar-title>
    <v-spacer />     
  </v-app-bar>
  </v-main>
</template>

<script>
import config from '../config'

export default {
  data () {
    return {
      configColor: config.titleColor
    }
  },

  methods: {
    async navigateTo (route) {
      this.$router.push(route)
    }
  },
  async mounted () {
    console.log('mounted AppBar isUserLoggedIn: ', this.$store.state.isUserLoggedIn)
  },
  async updated () {
    console.log('updated AppBar isUserLoggedIn: ', this.$store.state.isUserLoggedIn)
  }
}
</script>
<style scoped>
.v-btn {
  text-transform: none;
}
</style>
