<template>
  <div class="directory">
    <h1 class='title'>{{ list.name }}</h1>
    <section class="categories">
      <div
        class="category"
        v-for="(item, index) in categoryList"
        :key="item.name"
        @click="dig(index)">
        <p>{{item.name}}</p>
      </div>
    </section>
    <section>
      <h2>Files</h2>
      <p v-if="!fileList.length">no Files</p>
      <Video v-else v-for="video in fileList" :key="video.name" :video="video"/>
    </section>
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
    categoryList() {
      return this.list.children.filter(item => item.type == "folder")
    },
    fileList() {
      return this.list.children.filter(item => item.type == "file")
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
.categories {
  display: flex;
}
.category {
  flex: 1;
  text-transform: capitalize;
  font-size: 30px;
  padding: 30px 20px;
  border-radius: 10px;
  box-shadow: 1px 4px 5px 0px #d0e7fb;
  margin: 16px;
  cursor: pointer;
  background: linear-gradient(4deg, rgb(64 137 199 / 48%), transparent);
}
</style>
