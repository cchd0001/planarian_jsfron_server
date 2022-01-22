<template>
  <div id="app">
    <div>
      <el-button @click="show_5">Show top 5 cell Type</el-button>
      <el-button @click="show_8">Show top 8 cell Type</el-button>
      <el-button @click="show_10">Show top 10 cell Type</el-button>
    </div>
    <v-chart class="chart" :option="option" style="width:1600px;height:600px" />
  </div>
</template>

<script>
  import $ from 'jquery';
  import * as echarts from 'echarts';
  import 'echarts-gl';
  import VChart, { THEME_KEY } from "vue-echarts";
  // the dateset url
  var bin50_url = 'https://cdn.jsdelivr.net/gh/cchd0001/temp_db@master/bin50.json'
  var bin20_url = 'https://cdn.jsdelivr.net/gh/cchd0001/temp_db@master/bin20.json'
  var bin14_r05_url = 'https://cdn.jsdelivr.net/gh/cchd0001/temp_db@master/bin14_r0.5.json'
  // the loading chart before we cache the real dataset
  export default {
    name : "Planarian",
    components: {
        VChart
    },
    provide: {
      [THEME_KEY]: "dark"
    },
    data(){
      return {
        jsondata : null,
        COLOR_ALL : [
          '#37A2DA',
          '#e06343',
          '#37a354',
          '#b55dba',
          '#b5bd48',
          '#8378EA',
          '#96BFFF',
          '#555555',
        ],
        option: {
           tooltip: {
             formatter: '{a} <br/>{b} : {c}%'
           },
           series: [
             {
               name: 'Pressure',
               type: 'gauge',
               progress: {
                 show: true
               },
               detail: {
                 valueAnimation: true,
                 formatter: '{value}'
               },
               data: [
                 {
                   value: '100',
                   name: 'Loading\n Please waiting ...'
                 }
               ]
             }
           ]
        },
        all_clusters:[0,1,2,3,4,5,6,7,8,9],
        showd_clusters:[1,1,1,1,1,0,0,0,0,0]
      }; // end of data return
    },
    methods: {
      show_5() {
        this.showd_clusters=[1,1,1,1,1,0,0,0,0,0]
        this.option = this.getOption();
      },
      show_8() {
        this.showd_clusters=[1,1,1,1,1,1,1,1,0,0];
        this.option = this.getOption();
      },
      show_10() {
        this.showd_clusters=[1,1,1,1,1,1,1,1,1,1];
        this.option = this.getOption();
      },
      setJsonData(_data){
        console.log('knowing json loaded');
        var curr_draw_datas= [];
        for(var i = 0; i<=this.all_clusters.length; i++ )
        {
            curr_draw_datas.push([['x','y','z']]);
        }
        var left_index = this.all_clusters.length;
        console.log(_data.length);
        for(var j=0 ; j< _data.length; j++)
        {
          var curr_item = _data[j];
          var found=0;
          for(var i = 0; i< this.all_clusters.length; i++ )
          {
            var curr_cluster = this.all_clusters[i];
            if( curr_item[3] == curr_cluster )
            {
                curr_draw_datas[i].push([curr_item[0],curr_item[1],curr_item[2]]);
                found=1;
                break;
            }
          }
          if( found == 0 )
          {
            curr_draw_datas[left_index].push([curr_item[0],curr_item[1],curr_item[2]]);
          }
        } // end of for _data
        this.jsondata = curr_draw_datas;
      },
      getOption() {
        if ( this.jsondata == null ) {
          console.log('still draw loading');
          return this.loading_option;
        }
        else {
          console.log('knowing json loaded');
          console.log('01');
          var curr_draw_datas = this.jsondata;
          var series_list = [];
          var legend_list = [];
          var legend_color = [];
          var curr_color ;
          console.log('start series');
          for( var i = 0 ; i<this.showd_clusters.length; i++ )
          {
            var curr_cluster = this.all_clusters[i];
            legend_list.push("celltype_"+curr_cluster);
            if(this.showd_clusters[i] == 1)
            {
              curr_color = this.COLOR_ALL[i];
            }
            else
            {
              curr_color = this.COLOR_ALL[7];
            }
            legend_color.push(curr_color);
            var the_data = curr_draw_datas[i];
            var one_series = {
                name : legend_list[i],
                type : 'scatter3D',
                dimensions: [ 'x','y','z' ],
                data: the_data,
                symbolSize: 2,
                itemStyle: {
                  borderWidth: 1,
                  borderColor: curr_color,
                  color: curr_color
                },
                //emphasis: {
                //  itemStyle: {
                //    color: this.COLOR_ALL[i]
                //  }
                //}
            };
            series_list.push(one_series);
          } // end of for showd_clusters.length
          legend_list.push("others");
          curr_color = this.COLOR_ALL[7];
          legend_color.push(curr_color);
          var left_index = this.showd_clusters.length;
          var left_data =  curr_draw_datas[left_index];
          var left_series = {
            name : legend_list[left_index],
            type : 'scatter3D',
            dimensions: [ 'x','y','z' ],
            data: left_data,
            symbolSize: 2,
            itemStyle: {
              borderWidth: 1,
              borderColor: curr_color,
              color: curr_color
            },
            //itemStyle: {
            //  borderWidth: 1,
            //  borderColor: 'rgba(255,255,255,1)'
            //},
            //emphasis: {
            //  itemStyle: {
            //    color: this.COLOR_ALL[7]
            //  }
            //}
          };
          series_list.push(left_series);
          console.log('end series');
          var opt={
            tooltip: {},
            xAxis3D: {
              name: 'x',
              scale:1,
              type: 'value'
            },
            yAxis3D: {
              name: 'y',
              scale:1,
              type: 'value'
            },
            zAxis3D: {
              name: 'z',
              scale:1,
              type: 'value'
            },
            legend :{
              color :legend_color,
              data:legend_list
            },
            grid3D: {
              boxWidth:800,
              boxHeight:50,
              boxDepth:250,
              axisLine: {
                lineStyle: {
                  color: '#fff'
                }
              },
              axisPointer: {
                lineStyle: {
                  color: '#ffbd67'
                }
              },
              viewControl: {
                // autoRotate: true
                //projection: 'orthographic'
              }
            },
            series: series_list
          }; // end of var opt
          console.log('reset option');
          return opt;
        } // end of else.
      } // end of function option.
    },
    mounted: function(){
      // load the 3D basic dataset here
        var self = this;
        console.log('start json loading');
        $.getJSON(bin14_r05_url,function(_data) {
          self.setJsonData(_data);
          console.log('json loaded');
          //self.option = self.getOption();
        });
    }
  }; // end of export defaul.
</script>

<style>
#app {
  font-family: Helvetica, sans-serif;
  text-align: center;
}
.chart {
  width: 800px;
  height: 600px;
}
</style>
