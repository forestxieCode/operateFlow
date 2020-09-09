<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  width: 100%;
  height: calc(100vh);
}
*{
  margin: 0;
  padding: 0;
}
.text-overflow{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
} 
</style>
