<template>
  <div id="app">
    <header>
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" active-text-color="#409eff" style="margin: 0px;">
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
      </el-menu>
      <div class="line"></div>
    </header>
    <article>
        <component v-bind:is="selected"></component>
    </article>
    <hr>
    <footer>
      <div class="line"></div>
      <p>Contact: guolidong@genomics.cn; liyao1@genomics.cn; </p>
      <p>Web server version v0.1. Powered by Element.js framework and Echarts.js library.</p>
    </footer>
  </div>
</template>

<script>

import Home from "./Home.vue";
import CellAtlas from "./CellAtlas.vue";
import GeneExpression from "./GeneExpression.vue";
import GeneCoExpression from "./GeneCoExpression.vue";
import SingleCell from "./SingleCell.vue";
import UserGuide from "./UserGuide.vue";
import DevDebug from "./DevDebug.vue";

export default {
  data() {
    return {
      activeIndex: '1',
      selected:"Home"
    }
  },
  components:{
     Home,
     CellAtlas,
     SingleCell,
     GeneExpression,
     UserGuide,
     DevDebug,
     GeneCoExpression,
  },
  methods: {
    handleSelect(key, keyPath) {
        if ( key == "2-1" )
        {
            this.selected = "CellAtlas";
        }
        else if (key == "2-2")
        {
            this.selected = 'GeneExpression';
        }
        else if (key == "2-3")
        {
            this.selected = 'SingleCell';
        }
        else if (key == "4")
        {
            this.selected = 'UserGuide';
        }
        else if ( key == "1")
        {
            this.selected = "Home";
        }
        else if ( key == "3-1")
        {
            this.selected = "GeneCoExpression";
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
  font-family: Helvetica, sans-serif;
  text-align: center;
  margin-top: -8px;
}
header{
    position: sticky;
    z-index: 999;
    top: 0;
    margin-bottom: 8px;
    }
</style>
