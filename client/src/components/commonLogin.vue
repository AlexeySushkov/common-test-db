<template>
  <v-main>
    <v-col
      align="start"
      justify="start"    
    >              
    <v-card
      class="mx-auto"
      max-width="800"
      outlined
      elevation="3"
    >
      <v-progress-linear
        :active="showProgress"
        :indeterminate="showProgress"
        :color = "configColor"
        absolute
        bottom
      ></v-progress-linear>
      <v-toolbar flat dense :color = "configColor" dark>
        <v-toolbar-title>Login / Register User</v-toolbar-title>
      </v-toolbar>
      <v-container>
        <v-col>
          <v-text-field
            label="e-mail*"
            required
            v-model="register.email"
            type="e-mail"
            placeholder="e-mail"
            :rules="[rules.required, rules.email]"
          ></v-text-field>
          <v-text-field
            label="password*"
            required
            v-model="register.password"
            type="password"
            placeholder="password"
            :rules="[rules.required, rules.password]"
          ></v-text-field>
          <vue-recaptcha v-if=recaptchaSitekey
            ref="recaptcha"
            name="recaptcha"
            :sitekey="recaptchaSitekey"
            @verify="registerCaptcha"
            @expired="onCaptchaExpired"
          />          
        </v-col>
      </v-container>
      <v-card-actions>
        <v-col
          align="center"
        >              
          <v-btn
            rounded
            dark
            :color = "configColor"
            @click="registerUser">
            Register
          </v-btn>
          <v-btn
            rounded
            dark
            :color = "configColor"
            @click="loginUser">
            Login
          </v-btn>
          <v-btn
            rounded
            dark
            :color = "configColor"
            @click="loginUserWithGoogle">
            Login with Google
          </v-btn>
          <v-btn
            rounded
            dark
            :color = "configColor"
            @click="deleteUser">
            Delete User
          </v-btn>
          <v-btn
            rounded
            dark
            :color = "configColor"
            @click="navigateTo({name: 'Home'})">
            Home
          </v-btn>
        </v-col>        
      </v-card-actions>
    </v-card>
    </v-col>
  </v-main>
</template>

<script>
import VueRecaptcha from 'vue-recaptcha'
import serverApi from '@/services/ApiCalls'
import config from '../config'

export default {
  components: { 
    VueRecaptcha
  },
  data () {
    return {
      register: {
        email: '',
        password: '' 
      },
      captureValid: false,
      recaptchaSitekey: config.recaptchaSitekey,

      configColor: config.titleColor,
      showProgress: false,

      rules: {
        required: value => !!value || 'Required.',
        password: value => value.length >= 8 || 'Min 8 characters',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail'
        }
      },
      error: 'Status: '
    }
  },
  methods: {

    async navigateTo (route) {
      this.$router.push(route)
    },

    async deleteUser () {
      console.log('deleteUser')

      if ((this.register.email === '') ||
          (this.register.email === null)) {
        this.error = 'Please fill in all the required fields.'
        return
      }
      this.showProgress = true
      this.register.password = this.register.password.trim()
      console.log(this.register)

      try {
        const response = await serverApi.delete(this.register)
        this.error = 'Delete OK: ' + response.data.email + ' please login again'
        this.$store.dispatch('setToken', '')
        this.$store.dispatch('setSessionId', '')        
        this.$store.dispatch('setEmail', '')        
      } catch (error) {
        if ((error.response !== undefined) && (error.response.data.error !== undefined)) {
          this.error = error.response.status + ': ' + error.response.data.error
        } else {
          this.error = 'No connection to the server'
        }
      }
      this.showProgress = false
      alert(this.error)
    },

    async registerUser () {
      console.log('registerUser')

      if ((this.register.password === '') ||
          (this.register.email === '') ||
          (this.register.password === null) ||
          (this.register.email === null)) {
        this.error = 'Please fill in all the required fields.'
        alert(this.error)
        return
      }

      if (!this.captureValid) {
        alert('Please fill reCaptcha')
        return
      }

      this.showProgress = true
      this.register.password = this.register.password.trim()
      console.log(this.register)

      try {
        const response = await serverApi.register(this.register)
        this.error = 'OK: ' + response.data.email
        this.$store.dispatch('setToken', response.data.token)
        this.$store.dispatch('setSessionId', response.data.sessionId)        
        this.$store.dispatch('setEmail', response.data.email)      
      } catch (error) {
        if ((error.response !== undefined) && (error.response.data.error !== undefined)) {
          this.error = error.response.status + ': ' + error.response.data.error
        } else {
          this.error = 'No connection to the server'
        }
      }
      this.showProgress = false
      alert(this.error)
    },

    async loginUser () {
      console.log('loginUser')

      if ((this.register.password === '') ||
          (this.register.email === '') ||
          (this.register.password === null) ||
          (this.register.email === null)) {
        this.error = 'Please fill in all the required fields.'
        return
      }

      if (!this.captureValid) {
        alert('Please fill reCaptcha')
        return
      }

      this.showProgress = true
      this.register.password = this.register.password.trim()
      console.log(this.register)

      try {
        const response = await serverApi.login(this.register)
        console.log(response.data)
        this.error = 'Email: ' + response.data.email
        this.$store.dispatch('setToken', response.data.token)
        this.$store.dispatch('setSessionId', response.data.sessionId)
        this.$store.dispatch('setEmail', response.data.email)
      } catch (error) {
        if ((error.response !== undefined) && (error.response.data.error !== undefined)) {
          this.error = error.response.status + ': ' + error.response.data.error
        } else {
          this.error = 'No connection to the server'
        }
      }
      alert(this.error)
      this.showProgress = false
    },
    async loginUserWithGoogle () {
      console.log('loginUserWithGoogle')

      // Получаем sessionId
      let response = await serverApi.sessionId()
      this.$store.dispatch('setSessionId', response.data.SessionId)
      console.log('loginUserWithGoogle this.$store.state.SessionId: ', this.$store.state.sessionId)
      response = await serverApi.googleConfig()

      const queryString = response.data.googleAuth + '?' +
                   'response_type' + '=' + response.data.response_type + '&' +
                   'client_id' + '=' + response.data.client_id + '&' +
                   'scope' + '=' + response.data.scope + '&' +
                   'redirect_uri' + '=' + response.data.redirect_uri + '&' +
                   'access_type=offline&' +
                   'state' + '=' + this.$store.state.sessionId
      // like clik on link:
      window.location = queryString
    },

    registerCaptcha (recaptchaToken) {
      console.log('register: ', 'email:', this.register.email, 'this.password: ', this.register.password, 'recaptchaToken: ', recaptchaToken)
      this.captureValid = true
      console.log('register: this.captureValid: ', this.captureValid)
    },

    validate () {
      console.log('validate: this.captureValid: ', this.captureValid)
      // тут можно добавить проверку на валидацию
      // например, с помощью vee validate
      // если с валидацией наших полей все хорошо, запускаем каптчу
      // this.$refs.recaptcha.execute()
      if (this.captureValid === true) {
        alert('Functionality is under construction...')
      } else {
        alert('Plesse check the box!')
      }
    },

    onCaptchaExpired () {
      console.log('onCaptchaExpired')
      this.captureValid = false
      this.$refs.recaptcha.reset()
      console.log('onCaptchaExpired: this.captureValid: ', this.captureValid)
    }    
  },
  async mounted () {
    console.log('mounted Login isUserLoggedIn: ', this.$store.state.isUserLoggedIn)
    console.log('mounted Login recaptchaSitekey: ', config.recaptchaSitekey)
  }
}
</script>

<style scoped>
.v-btn {
  text-transform: none;
}
</style>
