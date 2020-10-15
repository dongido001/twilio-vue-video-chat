<template>
  <v-app>
    <v-container pa-0 fluid fill-height>
      <template v-if="!isAuthenticated">
        <Login />
      </template>
      <template v-else>
        <Room :roomName="roomName" />
      </template>
    </v-container>
  </v-app>
</template>

<script>
import Login from '@/components/Login'
import Room from '@/components/Room'

export default {
  name: 'App',

  components: {
    Login,
    Room
  },

  computed: {
    isAuthenticated() {
      return this.$store.state.authenticated
    },
    roomName() {
      return this.$store.state.userDetail.room
    }
  }
}
</script>
