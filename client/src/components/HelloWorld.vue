<template>
  <div class="hello">
    <h1>{{ message }}</h1>
  
    <Video v-for="video in filteredList" :key="video.name" :video="video"/>

  </div>
</template>

<script>
import axios from 'axios'
import Video from "@/components/Video"
export default {
  name: 'HelloWorld',
  components: { Video },
  data() {
    return {
      link: '',
      accessKey: '',
      list: {},
      message: ''
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      axios.get('/list').then(({data}) => {
        console.log(data)
        this.list = data
        this.message = data.name
      })
    },
  },
  computed: {
    filteredList() {
      return this.list.children.filter(video => video.type == "file")
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
