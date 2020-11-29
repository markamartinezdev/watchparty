<template>
  <div class="home">
    <Directory :list="list" @dig="dig"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Directory from '@/components/Directory'
import axios from '@/axios'

export default {
  name: 'Home',
  components: {
    Directory
  },
  data() {
    return {
      list: {
        children: [],
        name: ""
      },
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    dig(index) {
      this.list = this.list.children[index]
    },
    getList() {
      axios.get('api/list').then(({data}) => {
        console.log(data)
        this.list = data
      })
    },
  },
}
</script>
