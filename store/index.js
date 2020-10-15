import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    authenticated: null, // Boalean to check if user is authenticated
    userDetail: {}, // The current logged user detail
    allUsers: [] // All participant videos/audios in the room
  },
  mutations: {
    UPDATE_AUTHENTICATION(state, payload) {
      state.authenticated = true
      state.userDetail = payload
    },
    ADD_TRACK(state, userData) {
      const index = state.allUsers.findIndex(
        ({ identity, kind }) =>
          identity === userData.identity && kind === userData.kind
      )
      if (index === -1) {
        state.allUsers.push(userData)
      } else {
        state.allUsers[index] = userData
      }
    },
    REMOVE_TRACK(state, { identity, kind }) {
      state.allUsers = state.allUsers.filter(
        user => !(user.identity === identity && user.kind === kind)
      )
    }
  },
  actions: {
    authenticate({ commit }, payload) {
      commit('UPDATE_AUTHENTICATION', payload)
    },
    addParticipant({ commit }, participant) {
      const identity = participant.identity
      participant.tracks.forEach(track => {
        commit('ADD_TRACK', {
          identity,
          track: track,
          kind: track.kind
        })
      })
    },
    removeParticipant({ commit }, participant) {
      const identity = participant.identity
      participant.tracks.forEach(track => {
        commit('REMOVE_TRACK', { identity, kind: track.kind })
      })
    },
    addTrack({ commit }, payload) {
      const identity = payload.identity
      const kind = payload.track.kind
      commit('ADD_TRACK', {
        identity,
        role: payload.role,
        track: payload.track,
        kind
      })
    },
    removeTrack({ commit }, payload) {
      const identity = payload.identity
      const kind = payload.track.kind
      commit('REMOVE_TRACK', { identity, kind })
    }
  }
})

export default store
