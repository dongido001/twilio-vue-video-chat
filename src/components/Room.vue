<template>
  <v-row class="fill-height flex-column">
    <template v-if="room">
      <v-row
        class="grey lighten-5 flex-shrink-1 flex-grow-0"
        justify="center"
        no-gutters
        style="height: 30%"
      >
        <v-col
          v-for="(user, index) in videos"
          :key="index"
          class="ma-2 pa-2 video-wrap"
          cols="2"
        >
          <Participant
            v-for="(user, index) in videos"
            :key="index"
            :track="user.track"
            :kind="'video'"
          />
        </v-col>
      </v-row>
      <v-row class="grey lighten-5 flex-grow-1" justify="center" no-gutters>
        <v-spacer></v-spacer>
        <v-card
          class="d-flex ma-3 pa-6"
          tile
          width="50%"
          align="center"
          justify="center"
        >
          <Participant :track="host.track" :kind="'video'" v-if="host" />
        </v-card>
        <v-spacer></v-spacer>
      </v-row>
      <template>
        <!-- Render Audios -->
        <Participant
          v-for="(audio, index) in audios"
          :key="index"
          :track="audio.track"
          :kind="'audio'"
          :muted="'false'"
        />
      </template>
    </template>

    <template v-else>
      <v-row class="grey lighten-5 flex-grow-1" justify="center" no-gutters>
        <v-col col="12" class="d-flex justify-center align-self-center pa-5">
          Loading...
        </v-col>
      </v-row>
    </template>
  </v-row>
</template>

<script>
import Video from 'twilio-video'
import axios from 'axios'
import { mapActions } from 'vuex'
import Participant from '@/components/Participant'

const SERVER_URL = 'http://localhost:3000'

export default {
  name: 'Room',
  data() {
    return {
      errorMessage: null,
      stream: null,
      room: null
    }
  },

  components: {
    Participant
  },

  async created() {
    // ...
    const token = await this.getAccessToken()

    if (token) {
      await this.connectToRoom(token)
    }

    window.addEventListener('beforeunload', () => this.room.disconnect())
  },

  computed: {
    // ...
    userDetail() {
      return this.$store.state.userDetail
    },
    host() {
      return this.$store.state.allUsers.find(
        user => user.role === 'host' && user.kind === 'video'
      )
    },
    videos() {
      return this.$store.state.allUsers.filter(
        user =>
          user.identity !== (this.host && this.host.identity) &&
          user.kind === 'video'
      )
    },
    audios() {
      return this.$store.state.allUsers.filter(user => user.kind === 'audio')
    }
  },

  methods: {
    ...mapActions([
      'authenticate',
      'addParticipant',
      'removeParticipant',
      'addTrack',
      'removeTrack'
    ]),
    // TO DO : Define more functions here...
    async getAccessToken() {
      const { data, status } = await axios.get(
        `${SERVER_URL}/token?identity=${this.$store.state.userDetail.identity}`
      )
      if (status !== 200) {
        this.errorMessage = data.body
        return null
      }
      return data.token
    },
    async connectToRoom(accessToken) {
      const localTracks = await Video.createLocalTracks()
      const videoTrack = localTracks.find(track => track.kind === 'video')

      this.addTrack({ ...this.userDetail, kind: 'video', track: videoTrack })
      this.room = await Video.connect(accessToken, {
        name: this.roomName,
        tracks: localTracks
      })
      this.room.participants.forEach(this.participantConnected)
      this.room.on('participantConnected', this.participantConnected)
      this.room.on('participantDisconnected', this.removeParticipant)
      this.room.once('disconnected', () =>
        this.room.participants.forEach(this.removeParticipant)
      )
    },
    async participantConnected(participant) {
      // get more detail of that user from our API
      const { data } = await axios.get(
        `${SERVER_URL}/getUser?identity=${participant.identity}`
      )

      const participantPayload = {
        sid: participant.sid,
        identity: participant.identity,
        ...data.data
      }

      // If a user adds a track, we add that track to the store
      participant.on('trackSubscribed', track =>
        this.addTrack({ ...participantPayload, track })
      )

      // If a user removes a track, we remove the track from the store also
      participant.on('trackUnsubscribed', track =>
        this.removeTrack({ ...participantPayload, track })
      )

      // If we connect to a room with users already there,
      // add the tracks of those user to the store
      participant.tracks.forEach(publication => {
        if (publication.isSubscribed) {
          this.addTrack({ ...participantPayload, track: publication.track })
        }
      })
    }
  },

  props: {
    roomName: {
      required: true,
      type: String
    }
  }
}
</script>

<style lang="scss">
.video-wrap {
  display: inline-block;
  height: 0;
  padding-bottom: 50%;
  width: 50%;
  height: auto;
  width: auto;
  position: relative;
}
</style>
