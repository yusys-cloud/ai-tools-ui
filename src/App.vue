<template>
  <div id="app">
    <chaos-mgnt />
  </div>
</template>

<script>
import ChaosMgnt from './components/ChaosMgnt.vue';

export default {
  name: 'App',
  components: { ChaosMgnt }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}
</style>
