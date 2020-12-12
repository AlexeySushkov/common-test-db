<template>
   <v-content>   
    <v-dialog v-model="dialogConfirmDelete" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Are you shure?</v-card-title>
        <v-card-text>Delete the Data</v-card-text>
        <v-card-actions class="justify-center">
          <v-btn 
            rounded
            dark
            :color = "configColor"
            @click="DeleteData">Yes</v-btn>
          <v-btn 
            rounded
            dark
            :color = "configColor"
            @click="dialogConfirmDelete = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-container fluid>
      <v-row dense>
        <v-col
          v-for="card in dataList"
          :key="card.id"
          :cols="12"
        >
          <v-card 
            class="mx-auto"
            outlined
            elevation="1"       
            color="white"
            dark
          >
              <v-toolbar flat dense :color = "configColor">
                <v-toolbar-title>Data Card</v-toolbar-title>
              </v-toolbar>
              <v-progress-linear
                :active="card.showProgress"
                :indeterminate="card.showProgress"
                :color = "configColor"
                absolute
                bottom
              ></v-progress-linear>
              <!-- <v-card-title class="light-blue darken-4">Data ID: {{ card.id }}</v-card-title> -->
              <v-card-text>
                <div class="font-weight-bold blue--text text--darken-4">Data ID: {{ card.id }}</div>                
                <div class="font-weight-bold blue--text text--darken-4">Data UUID: {{ card.uuid }}</div>                
                <div class="font-weight-bold blue--text text--darken-4">Owner Data UUID: {{ card.ownerUuid }}</div>      
                <div class="font-weight-bold purple--text text--darken-2">Counter1: {{ card.counter1 }}</div>      
                <div class="font-weight-bold purple--text text--darken-2">Counter2: {{ card.counter2 }}</div>      
              </v-card-text>
            <v-card-actions >
              <v-col
                align="end"
              >              
                <v-btn rounded :color = "configColor" @click="DialogConfirmDelete(card)">Delete</v-btn>     
              </v-col>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
   </v-container>
  </v-content>
</template>

<script>
import config from '../config'
import serverApi from '@/services/ApiCalls'

export default {
  data () {
    return {
      error: 'Status: ',
      dataList: null,
      configColor: config.titleColor,
      showProgress: false,
      dialogConfirmDelete: false,
      cardToDelete: {}
    }
  },
  methods: {
    async navigateTo (route) {
      this.$router.push(route)
    },
    async DialogConfirmDelete (card) {
      console.log('DialogConfirmDelete')
      this.cardToDelete = card
      this.dialogConfirmDelete = true
    },

    async DeleteData () {
      console.log('DeleteData')
      this.dialogConfirmDelete = false
      const card = this.cardToDelete
      card.showProgress = true

      try {
        const response = await serverApi.deleteData(card.uuid)
        if (response.data.token !== undefined) {
          console.log('deleteData response: response.data.token - Ok')
          this.$store.dispatch('setToken', response.data.token)
        }
        if (response.data.sessionId !== undefined) {
          console.log('deleteData response: response.data.sessionId - Ok')
          this.$store.dispatch('setSessionId', response.data.sessionId)
        }
        this.error = 'Delete Data - Ok'
        alert(this.error)

        await this.getData()
      } catch (error) {
        if ((error.response !== undefined) && (error.response.data.error !== undefined)) {
          this.error = error.response.status + ': ' + error.response.data.error
        } else {
          this.error = 'No connection to the server'
        }
        alert(this.error)
      }
      card.showProgress = false
    },
    
    async getData () {
      console.log('getData')

      try {
        this.dataList = []
        this.dataList.splice(0)

        let response = {}
        response = await serverApi.getData()
        if (response.data) {
          for (var k in response.data[0]) {
            console.log('By one: ', k, response.data[0][k])
            const aaa = response.data[0][k]
            console.log('aaa: ', aaa.data)
            // пока хардкодим
            const dataParse = JSON.parse(aaa.data) // sqlihgt
            // const dataParse = aaa.data // postgres
            console.log('dataParse: ', dataParse)

            const pushObj = {
              id: response.data[0][k].id,
              uuid: response.data[0][k].uuid,
              ownerUuid: response.data[0][k].ownerUuid,
              // counter1: response.data[0][k].data.Counter1,
              // counter2: response.data[0][k].data.Counter2
              counter1: dataParse.data.Counter1,
              counter2: dataParse.data.Counter2
            }
            pushObj.showProgress = false
            this.dataList.push(pushObj)
            this.$set(this.dataList, this.dataList.indexOf(pushObj), pushObj)
          } // for
          this.error = 'Status: ' + this.dataList.length + ' data records found'
        } else {
          this.error = 'getData error'
          alert(this.error)
        }        
      } catch (error) {
        if ((error.response !== undefined) && (error.response.data.error !== undefined)) {
          this.error = error.response.status + ': ' + error.response.data.error
        } else {
          this.error = 'No connection to the server'
        }
        alert(this.error)
      }
    }    
  },
  async mounted () {
    console.log('mounted Data isUserLoggedIn: ', this.$store.state.isUserLoggedIn)
    if (!this.$store.state.isUserLoggedIn) {
      this.navigateTo({ name: 'Home' }) 
    } else {
      await this.getData()
    }
  }
}
</script>

<style scoped>
.v-btn {
  text-transform: none;
}
.flexcard .v-card {
  border-radius: 40px;
  position: absolute;
  left: 10px;
  width: 20px;  
}

</style>
