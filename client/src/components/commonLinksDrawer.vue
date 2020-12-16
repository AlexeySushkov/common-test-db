<template>
  <v-navigation-drawer
    v-model="$store.state.drawer"
    :clipped="$vuetify.breakpoint.lgAndUp"
    width="300"
    app
  >
    <v-dialog
      v-model="aboutDialog"
      max-width="800"
      persistent 
      app
    >
    <v-card
      class="mx-auto"
      max-width="800"
      outlined
      elevation="3"
    >
      <v-toolbar flat dense :color = "configColor" dark>
        <v-toolbar-title>About</v-toolbar-title>
      </v-toolbar>
      <v-card-title>Common Test DB</v-card-title>     
      <v-card-subtitle class="pb-0">Copyright (c) {{ new Date().getFullYear() }} Alexey Sushkov</v-card-subtitle>
      <v-container>      
      </v-container>
      <v-card-actions>
        <v-btn
          rounded
          dark
          :color = "configColor"
          @click="aboutDialog=false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
    </v-dialog>     
    <v-list dense>
        <v-list-item
          v-if="$store.state.isUserLoggedIn"        
          :key="items[0].text"
          :to="items[0].link"
          link
        >
          <v-list-item-action>
            <v-icon>{{ items[0].icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ items[0].text }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>        
        <v-list-item
          v-if="$store.state.isUserLoggedIn"        
          :key="items[1].text"
          :to="items[1].link"
          link
        >
          <v-list-item-action>
            <v-icon>{{ items[1].icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ items[1].text }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-if="$store.state.isUserLoggedIn"        
          :key="items[2].text"
          :to="items[2].link"
          link
        >
          <v-list-item-action>
            <v-icon>{{ items[2].icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ items[2].text }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-if="$store.state.isUserLoggedIn"        
          :key="items[3].text"
          :to="items[3].link"
          link
        >
          <v-list-item-action>
            <v-icon>{{ items[3].icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ items[3].text }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          :key="items[4].text"
          :to="items[4].link"
          link
        >
          <v-list-item-action>
            <v-icon>{{ items[4].icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ items[4].text }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          :key="items[5].text"
          @click="aboutDialog=true"          
        >
          <v-list-item-action>
            <v-icon>{{ items[5].icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ items[5].text }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          :key="items[6].text"
          @click="Swagger"
        >
          <v-list-item-action>
            <v-icon>{{ items[6].icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ items[6].text }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import config from '../config'

export default {
  data: () => ({
    items: [
      { icon: 'mdi-home-outline', text: 'Home', link: '/' },
      { icon: 'mdi-database-export', text: 'Get Data', link: '/data' },
      { icon: 'mdi-plus-circle-outline', text: 'New Data', link: '/newData' },
      { icon: 'mdi-logout', text: 'Logout', link: '/logout' },
      { icon: 'mdi-login', text: 'Login/Register', link: '/login' },
      { icon: 'mdi-information-outline', text: 'About' },
      { icon: 'mdi-api', text: 'Swagger' }
    ],
    configColor: config.titleColor,
    aboutDialog: false
  }),
  methods: {
    async Swagger () {
      window.location = 'https://localhost/api-docs/#/'
    }
  }

}
</script>
<style scoped>
.v-btn {
  text-transform: none;
}
</style>
