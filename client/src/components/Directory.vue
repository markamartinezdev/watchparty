<template>
  <div class="hello">
    <h1>{{ list.name }}</h1>
  
    <p v-for="(item, index) in list.children" :key="item.name" @click="dig(index)">{{item.name}}</p>

    <div> 
      <h2>Files</h2>
      <p v-if="!filteredList.length">no Files</p>
      <Video v-else v-for="video in filteredList" :key="video.name" :video="video"/>
    </div>
  </div>
</template>

<script>
import Video from "@/components/Video"
export default {
  name: 'Directory',
  components: { Video },
  props: {
    list: {
      type: Object,
      default: () => ({
        children: [],
        name: ""
      })
    }
  },
  data() {
    return {
      link: '',
      accessKey: '',
      message: ''
    }
  },
  methods: {
    dig(index) {
      this.$emit('dig', index)
      console.log(index)
    }
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
