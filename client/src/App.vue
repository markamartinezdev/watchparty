<template>
  <div id="app">
    <div id="nav">
      <router-link v-if="isAutherized" to="/">Home</router-link> |
      <router-link to="/watch-party">Screen room</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
export default {
  computed: {
    ...mapState(["userName","token"]),
    ...mapGetters(["isAutherized"])
  },

}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.btn {
    padding: 10px 16px;
    font-size: 16px;
    font-weight: bold;
    border-radius: 5px;
    color: black;
    border: none;
    background-color: #6aff83;
    text-transform: capitalize;
}
.title {
  font-size: 30px;
  text-transform: uppercase;
}
</style>
