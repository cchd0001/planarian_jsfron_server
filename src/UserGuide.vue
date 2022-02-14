<template>
  <div id="app">
    <!-- <pdf ref="pdf" :src="url" style="width: 100%;" /> -->
    <a :href="url">Cell Atlas Tutorial</a>
  </div>
</template>

<script>
//import pdf from 'vue-pdf'

export default {
 // components:{
   // pdf
  //},
  data() {
    return {
      url: "http://49.235.68.146/guide/cell_atlas_tutorial.pptx",
    }
  },
}
</script>

<style>
#app {
  font-family: Helvetica, sans-serif;
  text-align: center;
}
</style>

