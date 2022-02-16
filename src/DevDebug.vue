<template>
  <div id=app>
    <el-switch  active-text="Parametric surface" inactive-text="Mesh" 
      v-model="switch_cache" @change="incrMode" >
    </el-switch>
    <v-chart class="chart" :option="option" style="width:800px;height:600px" />
  </div>
</template>

<script>
  import * as echarts from 'echarts';
  import 'echarts-gl';
  import VChart from "vue-echarts";

  export default {
    name : "singlecell",
    components: {
        VChart,
    },
    data(){
      return {
        switch_cache :true,
        option: {
           backgroundColor:'#000000',
           title : {
               text : 'Debug with fun.',
               left: "center",
               top: "center",
               textStyle: {
                  color: '#cccccc'
               },
           }
        },
      }
    },
    methods :{
       incrMode : function() {
         if ( this.switch_cache ){
            var data = [
                [ 0,    0,   0],
                [ 0,  100,   0],
                [ 0,  100, 100],
                [100,   0,   0],
                [100, 100,   0],
                [100, 100, 100],
            ];
            var opt = {
              title : {
                  text : '',
              },
              xAxis3D: {
                type: 'value'
               },
              yAxis3D: {
                type: 'value'
              },
              zAxis3D: {
                type: 'value',
              },
              grid3D: {},
              series: [
                {
                  type: 'surface',
                  isMesh :false,
                  data: data,
                  dataShape:[2,3],//keep this line for mesh
                  indices : null,
                } 
              ],
            };
            this.option = opt;
         }else{
            var data = [
                [100, 100, 100],
                [  0,   0,   0],
                [200,   0,   0],
                [100, 200,   0],
            ];
            var indices = [
               [0,1,3],
               [0,3,2],
               [0,1,2],
               [1,2,3],
            ];
            var opt = {
              title : {
                  text : '',
              },
              xAxis3D: {
                type: 'value'
               },
              yAxis3D: {
                type: 'value'
              },
              zAxis3D: {
                type: 'value',
              },
              grid3D: {
                 boxWidth: 500 ,  
                 boxHeight: 30, 
                 boxDepth: 150,   
              },
              series: [
                {
                  type: 'surface',
                  data: data,
                  dataShape:[2,3],
                  isMesh :true,
                  indices : indices,
                  color: '#ff0000',
                  opacity:0.5,
                },
                {
                  type: 'scatter3D',
                  data: [[80,50,50],[100,100,120]],
                },
              ],
            };
            this.option = opt;
         }
       },
    },
  };
</script>
