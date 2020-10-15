<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <v-card class="elevation-12">
        <v-toolbar color="orange" dark flat>
          <v-toolbar-title>Login form </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-select
              :items="rooms"
              label="Select Room"
              outlined
              v-model="room"
              required
            ></v-select>
            <v-text-field
              label="identity"
              name="login"
              type="text"
              v-model="identity"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="orange" dark @click="authenticate">Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios'
const SERVER_URL = 'http://localhost:3000'

export default {
  name: 'Login',

  data() {
    return {
      rooms: ['General', 'Room ledger', 'Make it happen'],
      room: null,
      identity: null
    }
  },

  methods: {
    async authenticate() {
      if (this.identity && this.room) {
        const { data, status } = await axios.get(
          `${SERVER_URL}/getUser?identity=${this.identity}`
        )
        if (status === 200) {
          const payload = {
            room: this.room,
            ...data.data
          }
          this.$store.dispatch('authenticate', payload)
        }
      }
    }
  }
}
</script>
