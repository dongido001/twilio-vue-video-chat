<template>
  <audio v-if="kind === 'audio'" ref="media" @canplay="$emit('ready')" />
  <div v-else class="media-container" style="border: 5px solid green;">
    <video ref="media" @canplay="$emit('ready')" />
  </div>
</template>

<script>
export default {
  name: 'Participant',
  props: {
    kind: {
      type: String
    },
    track: {
      type: Object,
      required: true
    }
  },
  mounted() {
    console.log(this.track)
    this.track.attach(this.$refs.media)
  },
  beforeDestroy() {
    console.log(this.track)
    this.track.detach(this.$refs.media)
  }
}
</script>

<style scoped>
.media-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 23px !important;
}
video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
