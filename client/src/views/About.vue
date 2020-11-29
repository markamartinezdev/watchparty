<template>
  <div class="about">
    <h1>{{name}}</h1>
    <video controls>
      <source :src="'/watch/'+this.id" type="video/mp4">
    </video>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  props: {
    id: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      name: "",
    }
  },
  mounted() {
    this.getStreamData()
  },
  methods: {
    getStreamData() {
      axios.get('/room/'+this.id).then(({ data }) => {
        console.log(data)
        this.name = data.fileName
      })
    },
  }
}
</script>
