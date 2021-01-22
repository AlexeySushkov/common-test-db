<template>
  <v-main>
    <v-card
      class="mx-auto"
      outlined
      elevation="3"
      max-width="800"
    >
      <v-progress-linear
        :active="showProgress"
        :indeterminate="showProgress"
        :color = "configColor"
        absolute
        bottom
      ></v-progress-linear>
      <v-toolbar flat dense :color = "configColor" dark>
        <v-toolbar-title>New Data</v-toolbar-title>
      </v-toolbar>
      <v-container>
        <v-col>
          <v-select
            :items="['10', '11', '12']"
            label="Counter 1"
            v-model="newData.data.Counter1"
          ></v-select> 
          <v-select
            :items="['20', '21', '22']"
            label="Counter 2"
            v-model="newData.data.Counter2"
          ></v-select> 
        </v-col>
      </v-container>
      <v-card-actions>
        <v-btn
          class="newDataCall"
          rounded
          dark
          :color = "configColor"
          @click="newDataCall">
          Create
        </v-btn>     
        <v-btn
          class="Cancel"
          rounded
          dark
          :color = "configColor"
          @click="navigateTo({name: 'Home'})">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-main>
</template>

<script>
import config from '../config'
import serverApi from '@/services/ApiCalls'

export default {
  data () {
    return {
      configColor: config.titleColor,
      showProgress: false,
      error: 'Status: ',

      newData: {
        data: {
          Counter1: '10',
          Counter2: '20'
        }
      }     
    }
  },

  methods: {
    async navigateTo (route) {
      this.$router.push(route)
    },
    async newDataCall () {
      console.log('newDataCall')

      this.showProgress = true

      try {
        const response = await serverApi.newData(this.newData)
        this.error = 'Status: ' + response.data.status
      } catch (error) {
        if ((error.response !== undefined) && (error.response.data.error !== undefined)) {
          this.error = error.response.status + ': ' + error.response.data.error
        } else {
          this.error = 'No connection to the server'
        }
      }
      this.showProgress = false
      alert(this.error)
    }
  },
  async mounted () {
    console.log('mounted newData isUserLoggedIn: ', this.$store.state.isUserLoggedIn)
    if (!this.$store.state.isUserLoggedIn) {
      this.navigateTo({ name: 'Home' }) 
    } 
  }

}
</script>

<style scoped>
.v-btn {
  text-transform: none;
}
</style>
