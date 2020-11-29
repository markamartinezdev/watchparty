<template>
  <div class="about">
    <h1 class="">{{name}}</h1>
    <video v-if="showVideo" controls>
      <source :src="'/api/watch/'+this.id" type="video/mp4">
    </video>
  </div>
</template>
<script>
import axios from '@/axios'
export default {
  props: {
    id: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      name: "joining the watch party",
      showVideo: false
    }
  },
  mounted() {
    this.getStreamData()
  },
  methods: {
    async getStreamData() {
      try {
        const { data } = await axios.get('/api/room/'+this.id)
        console.log(data)
        this.name = data.fileName
        this.showVideo = true
      }
      catch (err) {
        this.name = err.response.data.message
      }
    },
  }
}
</script>
