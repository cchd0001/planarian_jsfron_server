<template>
  <div id="app">
    <div style="margin-left:0%;" align="center">
      <el-menu  class="el-menu-demo" mode="horizontal" >
        <el-menu-item index="1"  @click.native="show_WT"      >WT     </el-menu-item>
        <el-menu-item index="2"  @click.native="show_0hpa1"   >0hpa1  </el-menu-item>
        <el-menu-item index="3"  @click.native="show_0hpa2"   >0hpa2  </el-menu-item>
        <el-menu-item index="4"  @click.native="show_12hpa1"  >12hpa1 </el-menu-item>
        <el-menu-item index="5"  @click.native="show_12hpa2"  >12hpa2 </el-menu-item>
        <el-menu-item index="6"  @click.native="show_36hpa1"  >36hpa1 </el-menu-item>
        <el-menu-item index="7"  @click.native="show_36hpa2"  >36hpa2 </el-menu-item>
        <el-menu-item index="8"  @click.native="show_3dpa1"   >3dpa1  </el-menu-item>
        <el-menu-item index="9"  @click.native="show_3dpa2"   >3dpa2  </el-menu-item>
        <el-menu-item index="10" @click.native="show_5dpa1"   >5dpa1  </el-menu-item>
        <el-menu-item index="11" @click.native="show_5dpa2"   >5dpa2  </el-menu-item>
        <el-menu-item index="12" @click.native="show_7dpa1"   >7dpa1  </el-menu-item>
        <el-menu-item index="13" @click.native="show_7dpa2"   >7dpa2  </el-menu-item>
        <el-menu-item index="14" @click.native="show_10dpa1"  >10dpa1 </el-menu-item>
        <el-menu-item index="15" @click.native="show_10dpa2"  >10dpa2 </el-menu-item>
        <el-menu-item index="16" @click.native="show_14dpa1"  >14dpa1 </el-menu-item>
        <el-menu-item index="17" @click.native="show_14dpa2"  >14dpa2 </el-menu-item>
      </el-menu>
    </div>
    <el-container style="height: 750px; border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <p> Color Configuration </p>
        <el-table class="table" ref="multipleTable" style="width:160;" :data="tableData"
          :show-header='false'
          @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="25"> </el-table-column>
            <el-table-column show-header='false' property="Celltype" label="Celltype" width="125">
            </el-table-column>
        </el-table>
        <div style="margin-left:1%;width:25px">
          <el-button @click="applyStatus">Highlight selected types</el-button>
        </div>
        <div style="margin-left:1%;width:25px">
          <el-button @click="resetAll">Highlight all types</el-button>
        </div>
      </el-aside>
      <el-main>
        <v-chart ref="myecharts"  class="chart" :option="option" style="width:100%;height:700px" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
  // libraray
  import $ from 'jquery';
  import * as echarts from 'echarts';
  import 'echarts-gl';
  import VChart from "vue-echarts";
  // confs
  var SC_URL="http://49.235.68.146/single_cell/"
  var COLOR_ALL = require('../confs/discret_color.js');
  var sc_conf = require('../confs/single_cell_transfered_type.js');
  var idvd_conf = require('../confs/individual.js');

  export default {
    name : "singlecell",
    components: {
        VChart
    },
    data(){
      return {
        // empty charts
        option: {
           backgroundColor:'#000000',
           title : {
               text : 'Please select a specific individual to show.',
               left: "center",
               top: "center",
               textStyle: {
                  color: '#cccccc'
               },
           }
        },
        // conf table and configure cache
        tableData: sc_conf.tableData,
        name_id_map:sc_conf.name_id_map,
        select_cache:[],
        colored_cache :[],
        // drawing cache
        curr_name : null,
        curr_data : null,
      }; // end of data return
    },
    methods: {
      //-------------3d box conf start-------------------//
      getWidth(){
        return idvd_conf['label_'+this.curr_name].x ;
      },
      getDepth() {
        return idvd_conf['label_'+this.curr_name].z ;
      },
      getHeight() {
        return idvd_conf['label_'+this.curr_name].y ;
      },
      //-------------3d box conf end-------------------//

      //-------------color configure start -------------------//
      applyStatus(){
        var self = this;
        console.log("change cluster showing option");
        this.colored_cache =this.select_cache;
        self.option=self.getOption();
      },
      resetAll(){
         this.colored_cache = [];
         this.option = this.getOption();
      },
      handleSelectionChange(val) {
        var show = [];
        for( var i=0; i<this.tableData.length; i++ ) {
            show.push(0);
        }
        for( var i = 0 ; i < val.length ; i++) {
            show[val[i].ID]=1;
        }
        this.select_cache=show;
        console.log("saved clusters");
      },
      //-------------color configure end -------------------//

      //-------------switching individual start -------------------//
      update_basic(name){
        if( this.curr_name != name)
        {
          // set new name
          this.curr_name = name;
          //clean buffer
          this.curr_data = null;
          // show loading first
          this.$refs.myecharts.setOption(this.getOption(),true);
          //this.option = this.getOption();
          var used_url = SC_URL+"/"+name+"/label.json";
          // loading data and re-draw graph
          var self = this;
          $.getJSON(used_url,function(_data) {
            self.setSCData(_data);
            self.option = self.getOption();
          });
        }
      },
      show_WT()     {  this.update_basic("WT");     },
      show_0hpa1()  {  this.update_basic("0hpa1");  },
      show_0hpa2()  {  this.update_basic("0hpa2");  },
      show_12hpa1() {  this.update_basic("12hpa1"); },
      show_12hpa2() {  this.update_basic("12hpa2"); },
      show_36hpa1() {  this.update_basic("36hpa1"); },
      show_36hpa2() {  this.update_basic("36hpa2"); },
      show_3dpa1()  {  this.update_basic("3dpa1");  },
      show_3dpa2()  {  this.update_basic("3dpa2");  },
      show_5dpa1()  {  this.update_basic("5dpa1");  },
      show_5dpa2()  {  this.update_basic("5dpa2");  },
      show_7dpa1()  {  this.update_basic("7dpa1");  },
      show_7dpa2()  {  this.update_basic("7dpa2");  },
      show_10dpa1() {  this.update_basic("10dpa1"); },
      show_10dpa2() {  this.update_basic("10dpa2"); },
      show_14dpa1() {  this.update_basic("14dpa1"); },
      show_14dpa2() {  this.update_basic("14dpa2"); },
      //-------------switching individual end-------------------//

      setSCData(_data){
        console.log('knowing json loaded');
        var curr_draw_datas= [];
        for(var i = 0; i<Object.keys(this.name_id_map).length ; i++ )
        {
            curr_draw_datas.push([['x','y','z']]);
        }
        for(var j=0 ; j< _data.length; j++)
        {
          var curr_item = _data[j];
          var type_name = curr_item[3];
          var type_id = this.name_id_map[type_name];
          curr_draw_datas[type_id].push([curr_item[0],curr_item[1],curr_item[2]]);
        } // end of for _data
        this.curr_data = curr_draw_datas;
      },
      getOption() {
        if ( this.curr_data == null ) {
          return {
             backgroundColor:'#000000',
             title : {
               text : 'Start loading data ...',
               left: "center",
               top: "center",
               textStyle: {
                  color: '#cccccc'
               },
             }
          };
        }
        else {
          console.log('knowing json loaded');

          var series_list = [];
          var legend_list = [];
          var legend_show = {};
          var curr_color ;
          var curr_alpha;
          var used_color_masks ;
          if ( this.colored_cache.length == 0 ) {
             // default show all types
             var show_all = [];
             for( var i=0; i<this.tableData.length; i++ ){
                 show_all.push(1);
             }
             used_color_masks = show_all;;
          }
          else {
             used_color_masks = this.colored_cache;
          }
          console.log('start series');
          console.log(used_color_masks);
          for( var i = 0 ; i<used_color_masks.length; i++ )
          {
            var curr_legend_name = this.tableData[i].Celltype;
            console.log(curr_legend_name);
            legend_list.push(curr_legend_name);
            curr_color = COLOR_ALL[i];
            curr_alpha = 0.75;
            // console.log('2');
            if(used_color_masks[i] == 0){
              legend_show[curr_legend_name] = false;
            } else {
              legend_show[curr_legend_name] = true;
            }
            var the_data = this.curr_data[i];
            var one_series = {
                name : curr_legend_name,
                type : 'scatter3D',
                dimensions: [ 'x','y','z' ],
                data: the_data,
                symbolSize: 2,
                itemStyle: {
                  borderWidth: 0,
                  color: curr_color,
                  opacity: curr_alpha,
                }
            };
            series_list.push(one_series);
          } // end of for showd_clusters.length
          console.log('end series');
          console.log(legend_show);
          var xmax = this.getWidth();
          var ymax = this.getHeight();
          var zmax = this.getDepth();
          var opt={
            backgroundColor:'#000000',
            title : {
                text : '',
                left: "center",
                top: "top"
            },
            tooltip: {},
            xAxis3D: {
              name: 'x',
              scale:1,
              type: 'value',
              min:0,
              max:xmax,
            },
            yAxis3D: {
              name: 'y',
              scale:1,
              type: 'value',
              min:0,
              max:ymax,
            },
            zAxis3D: {
              name: 'z',
              scale:1,
              type: 'value',
              min:0,
              max:zmax,
            },
            legend :{
              data: legend_list,
              selected : legend_show, //{'Gut' : false } ,
              textStyle: {
                 color: '#cccccc'
              },
            },
            grid3D: {
              boxWidth: xmax,
              boxHeight: zmax,
              boxDepth: ymax,
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
    }
  }; // end of export defaul.
</script>

<style>
#app {
  font-family: Helvetica, sans-serif;
  text-align: center;
}
.chart {
  width: 100%;
  height: 800px;
}
</style>
