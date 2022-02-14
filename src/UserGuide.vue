<template>
  <div id="app">
    <!-- <pdf ref="pdf" :src="url" style="width: 100%;" /> -->
    <a style='align:left;background_color:gray;' :href="url">Cell Atlas Tutorial (Chinese)</a>
    <a style='align:left;background_color:gray;' :href="url2">Cell Atlas Tutorial (English)</a>
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
      url2: "http://49.235.68.146/guide/cell_atlas_tutorial_eng.pptx",
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

