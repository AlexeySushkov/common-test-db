<template>
  <v-app id="inspire">
    <LinksDrawer/>
    <AppBar/>
    <main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </main>
    <AppFooter/>
  </v-app>
</template>

<script>
import LinksDrawer from './components/commonLinksDrawer'
import AppBar from './components/commonAppBar'
import AppFooter from './components/commonAppFooter'

export default {
  components: {
    LinksDrawer,
    AppBar,
    AppFooter
  }
}

</script>

<style>
.v-btn {
  text-transform: none;
}
</style>
