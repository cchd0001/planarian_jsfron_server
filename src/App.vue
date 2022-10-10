<template>
  <div id="app">
    <header>
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" active-text-color="#409eff" style="margin: 0px;">
<<<<<<< HEAD
        <el-menu-item index="1">Home</el-menu-item>
        <el-submenu index="2" active-text-color="#409eff">
          <template slot="title">3D Atlas Visuliazationabc</template>
            <el-menu-item index="2-1">Cell Type Atlas</el-menu-item>
            <el-menu-item index="2-2">Gene Expression Atlas</el-menu-item>
            <el-menu-item index="2-3">Single-cell-label-transfered Cell Atlas</el-menu-item>
        </el-submenu>
        <el-menu-item index="3" disabled></el-menu-item>
        <el-submenu index="3" active-text-color="#409eff">
          <template slot="title">Data Analysis</template>
            <el-menu-item index="3-1">Multi-gene-pattern</el-menu-item>
        </el-submenu>
        <el-menu-item index="4">User Guide</a></el-menu-item>
        <el-menu-item index="5" disabled>About Us</a></el-menu-item>
=======
        <el-menu-item index="1">Planarian atlas 3D viewer</el-menu-item>
        <el-menu-item index="2">Planarian atlas home</el-menu-item>
        <el-menu-item index="3" disabled >About us</el-menu-item>
>>>>>>> 549d3c3dc3ae5d97283e3b076ed0c1faf6544ce8
      </el-menu>
    </header>
    <article>
        <component v-bind:is="selected"></component>
    </article>
    <footer>
      <hr>
      <p>Any page issue or bug resport, please contact: guolidong@genomics.cn; liyao1@genomics.cn; wangrui2@genomics.cn </p>
      <p>Web server version v0.1. Powered by Element.js framework and Echarts.js library.</p>
    </footer>
  </div>
</template>

<script>
import Vue from 'vue'
import Element from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
Vue.use(Element, { locale })
import 'element-theme-dark';

import Home from "./Home.vue";
import Viewer from "./Viewer.vue"

export default {
  data() {
    return {
      activeIndex: '1',
      selected:"Viewer"
    }
  },
  components:{
     Home,
     Viewer,
  },
  methods: {
    handleSelect(key, keyPath) {
        this.activeIndex = key;
        if ( key == "1")
        {
            this.selected = "Viewer";
        }
        else if ( key == "2")
        {
            this.selected = "Home";
        }
        else
        {
            this.selected = "Home";
        }
    }
  },
}
</script>

<style>
#app {
  font-family: Arial;
  text-align: center;
  margin-top: -8px;
<<<<<<< HEAD
=======
}
hr{
    border:2px solid #ccc;
}
header{
    position: sticky;
    z-index: 999;
    top: 0;
    margin-bottom: 8px;
>>>>>>> 549d3c3dc3ae5d97283e3b076ed0c1faf6544ce8
}
header{
    position: sticky;
    z-index: 999;
    top: 0;
    margin-bottom: 8px;
    }
</style>
