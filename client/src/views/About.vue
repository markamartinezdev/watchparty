<template>
  <div class="about">
    <h1 class="">{{name}}</h1>
    <VideoPlayer v-if="showVideo" :options="videoOptions"/>
  </div>
</template>
<script>
import axios from '@/axios'
import VideoPlayer from "@/components/VideoPlayer"

export default {
  components: { VideoPlayer },
  props: {
    id: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      name: "joining the watch party",
      showVideo: false,
      videoOptions: {}
    }
  },
  mounted() {
    this.getStreamData()
    this.videoOptions = {
      autoplay: true,
      controls: true,
      sources: [
        {
          src:"/api/watch/"+this.id,
          type: "video/mp4"
        }
      ],
      techOrder: ['flash', 'html5']
    }

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
