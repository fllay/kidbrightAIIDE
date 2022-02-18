<template>
  <div id="app">
    <Terminal msg="My terminal"/>
  </div>
</template>

<script>
import Terminal from './components/Terminal.vue'
import { useStore } from "vuex";

export default {
  name: 'App',
  components: {
    Terminal
  },

  mounted() {
    const store = useStore();
    console.log(`${location.protocol}//${location.hostname}:3000`)
    console.log(`${location.hostname}`)
    store.commit("insertHostIP", `${location.hostname}`);
  }

}




</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
