<template>
  <div id="app">
    <header>
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">Home</el-menu-item>
        <el-submenu index="2">
          <template slot="title">3D Atlas Visuliazation</template>
            <el-menu-item index="2-1">Cell Type Atlas</el-menu-item>
            <el-menu-item index="2-2">Gene Expression Atlas</el-menu-item>
            <el-menu-item index="2-3">Single-cell Transfer Cell Atlas</el-menu-item>
        </el-submenu>
        <el-menu-item index="3" disabled>Data analysis</el-menu-item>
        <el-menu-item index="4"><a href="https://en.wikipedia.org/wiki/Planarian" target="_blank">Planarian wiki</a></el-menu-item>
        <el-menu-item index="5" disabled>About us</a></el-menu-item>
      </el-menu>
      <div class="line"></div>
    </header>
    <article>
      <keep-alive>
        <component v-bind:is="selected"></component>
      </keep-alive>
    </article>
    <hr>
    <footer>
      <div class="line"></div>
      <p>Power by Element.UI framework and Echarts library.</p>
      <p>Contact: guolidong@genomics.cn; liyao1@genomics.cn; </p>
    </footer>
  </div>
</template>

<script>

import Home from "./Home.vue";
import CellAtlas from "./CellAtlas.vue";
import GeneExpression from "./GeneExpression.vue";
import SingleCell from "./SingleCell.vue";

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
     GeneExpression
  },
  methods: {
    handleSelect(key, keyPath) {
        console.log(key);
        console.log(keyPath);
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
        else if ( key == "1")
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
  font-family: Helvetica, sans-serif;
  text-align: center;
}
</style>
