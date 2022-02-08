<template>
  <div id="app">
    <div  style="margin-left:0%;" align="center">
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
      <el-menu  class="el-menu-demo" mode="horizontal" >
        <el-menu-item index="1"   @click.native ="use_r0_1">r0.1</el-menu-item>
        <el-menu-item index="2"   @click.native ="use_r0_2">r0.2</el-menu-item>
        <el-menu-item index="3"   @click.native ="use_r0_3">r0.3</el-menu-item>
        <el-menu-item index="4"   @click.native ="use_r0_5">r0.5</el-menu-item>
        <el-menu-item index="5"   @click.native ="use_r0_8">r0.8</el-menu-item>
        <el-menu-item index="6"   @click.native ="use_r1_2">r1.2</el-menu-item>
        <el-menu-item index="7"   @click.native ="use_r1_5">r1.5</el-menu-item>
        <el-menu-item index="8"   @click.native ="use_r2_0">r2.0</el-menu-item>
      </el-menu>
    </div>
    <div>
      <p class='inline_item'> Select number of clusters to display : </p>
      <el-input class='inline_item' style='width:200px;height:50px;' :min='min_cluster_number' 
              :max='max_cluster_number' type='number' v-model="tmp_cluster_num" placeholder="Cluster Number"></el-input>
      <el-button class='inline_item' @click.native="changeClusterNumber">Display</el-button>
      <!-- II. configuration content -->
      <div class='inline_item' >
        <el-button align='right' style='width:100%;' @click="isHidden = !isHidden">Cell Type Configuration</el-button>
        <div class='parent' style='width:10px; ' >
          <div class="child" style='width:500px;z-index:9999;background-color:white'  v-if="!isHidden">
            <!-- 1. cell table content -->
            <el-table
              class="table"
              ref="clusterTable"
              style="width:160;"
              :show-header='false'
              :height='height'
              :row-key="getRowKey"
              :highlight-current-row='true'
              :data="tableDataClusters.slice((currentPage-1)*pageSize,currentPage*pageSize)"
              @selection-change="handleSelectionChange">
                <el-table-column
                  :reserve-selection="true"
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  property="Celltype"
                  label="Cell Type"
                  width="80">
                </el-table-column>
                <el-table-column label="Display" width="160">
                  <template slot-scope="scope">
                    <el-button size="mini" type="primary" plain @click ="changeColor">color</el-button>
                  </template>
                </el-table-column>
            </el-table>
            <el-pagination 
              layout="total, sizes, prev, pager, next, jumper" 
              :total="this.tableDataClusters.length"
              :current-page="currentPage"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
              :page-sizes="[5,10,15]"
              :page-size="pageSize"
              :current-page.sync="currentPage">
            </el-pagination>
            <div>
              <el-button @click="applyStatus">Apply</el-button>
              <el-button @click='clearSelect'>Clear</el-button>
              <el-button @click='resetSelect'>Reset</el-button>
            </div> <!-- end of buttons -->
          </div> <!-- end of hiden panel -->
        </div> <!-- end of empty parent of hiden panel -->
      </div> <!-- end of cell type config -->
    </div> <!-- end of inline block -->

    <!-- main window -->
    <div class='parent'>
      <!-- I. chart content -->
      <v-chart class="chart" ref="myecharts" :option="option" style="width:100%;height:800px;" />
    </div>
    <!-- end of the main window -->
  </div>
</template>

<script>
  import $ from 'jquery';
  import * as echarts from 'echarts';
  import 'echarts-gl';
  import VChart, { THEME_KEY } from "vue-echarts";
  // the dateset url
  var CT_URL="http://49.232.213.84/celltype/"
  var COLOR_ALL = require('../confs/discret_color.js');
  var idvd_conf = require('../confs/individual.js');

  // the loading chart before we cache the real dataset
  export default {
    name : "Planarian",
    components: {
        VChart
    },
    data(){
      return {
        //------------ui configurations-----------
        min_cluster_number: 0,
        max_cluster_number: 100,
        tableDataClusters: [],
        //------------show clusters-----------
        saved_clusters:[], // the selection cache
        tmp_cluster_num: 0,
        max_showd_clusters: 100,
        all_clusters: 0,
        final_clusters: [],
        //------------gene selection------
        search: '',
        //------------ui selection------
        isHidden: true,
        height:'200px',
        activeIndex: '1',
        pageSize:5,
        currentPage:1,
        activeName: 'first',
        //------------confs------
        // -- tip graph
        option: {
          backgroundColor:'#000000',
          title : {
              text : 'Please select a specific individual and resolution to show.',
              left: "center",
              top: "center",
              textStyle: {
                 color: '#cccccc'
              },
          }
        },
        //------------data selection------
        curr_name : null,
        curr_rs : null,
        jsondata : null,
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
      //-------------switching individual start -------------------//
      update_basic(r){
        if (this.curr_rs != r){
          // loading data and re-draw graph
          var self = this;
          this.curr_rs = r;
          var used_url = CT_URL+"/"+this.curr_name+"/"+this.curr_rs+".json";
          this.option = this.getOption();
          $.getJSON(used_url,function(_data) {
            console.log("loaded");
            self.setJsonData(_data);
            self.option = self.getOption();
          });
        }
      },
      use_r0_1(){this.update_basic('0.1');}, 
      use_r0_2(){this.update_basic('0.2');},
      use_r0_3(){this.update_basic('0.3');},
      use_r0_5(){this.update_basic('0.5');},
      use_r0_8(){this.update_basic('0.8');},
      use_r1_2(){this.update_basic('1.2');},
      use_r1_5(){this.update_basic('1.5');},
      use_r2_0(){this.update_basic('2.0');},

      resetIndividual(name){
          if ( this.curr_name != name ) {
            this.curr_name = name ;
            this.jsondata = null ;
            this.curr_rs = null ;
            this.$refs.myecharts.setOption(this.getOption(),true);
            //this.option = this.getOption();
          }
      },
      show_WT()     {  this.resetIndividual("WT");     },
      show_0hpa1()  {  this.resetIndividual("0hpa1");  },
      show_0hpa2()  {  this.resetIndividual("0hpa2");  },
      show_12hpa1() {  this.resetIndividual("12hpa1"); },
      show_12hpa2() {  this.resetIndividual("12hpa2"); },
      show_36hpa1() {  this.resetIndividual("36hpa1"); },
      show_36hpa2() {  this.resetIndividual("36hpa2"); },
      show_3dpa1()  {  this.resetIndividual("3dpa1");  },
      show_3dpa2()  {  this.resetIndividual("3dpa2");  },
      show_5dpa1()  {  this.resetIndividual("5dpa1");  },
      show_5dpa2()  {  this.resetIndividual("5dpa2");  },
      show_7dpa1()  {  this.resetIndividual("7dpa1");  },
      show_7dpa2()  {  this.resetIndividual("7dpa2");  },
      show_10dpa1() {  this.resetIndividual("10dpa1"); },
      show_10dpa2() {  this.resetIndividual("10dpa2"); },
      show_14dpa1() {  this.resetIndividual("14dpa1"); },
      show_14dpa2() {  this.resetIndividual("14dpa2"); },
      //-------------switching individual end-------------------//
      //-------------configure cell type start -------------------//
      changeClusterNumber(){
        if(this.tmp_cluster_num < 1){
          this.max_showd_clusters = 1;
        } else if( this.tmp_cluster_num > this.all_clusters) {
          this.max_showd_clusters =  this.all_clusters;
        } else {
          this.max_showd_clusters = this.tmp_cluster_num;
        }
        this.$refs.myecharts.setOption(this.getOption(),true);
      },
      resetSelect(){
        var self = this;
        this.final_clusters=new Array(this.all_clusters).fill(1);
        self.option=self.getOption();
      },
      clearSelect () {
        var self = this;
        this.$refs.clusterTable.clearSelection();
      },
      getRowKey (row) {
        return row.Celltype
      },
      handleSizeChange (size) {
        this.pageSize = size;
      },
      handleCurrentChange (currentpage){
        this.currentPage = currentpage;
      },
      getAutoHeight() {
        let el = document.querySelector("#table"),
        elParent = el.parentNode,
        pt = this.getStyle(elParent, "paddingTop"),
        pb = this.getStyle(elParent, "paddingBottom");
        // 一定要使用 nextTick 来改变height 不然不会起作用
        this.$nextTick(() => {
          this.height = elParent.clientHeight - (pt + pb) + "px";
        });
      },
      applyStatus(){
        var self = this;
        console.log("change cluster showing option");
        this.final_clusters=this.saved_clusters;
        //self.option=self.getOption();
        this.$refs.myecharts.setOption(this.getOption(),true);
      },
      handleSelectionChange(val) {
        console.log('val is ');
        console.log(val);
        var tmp_clusters= new Array(this.all_clusters).fill(0);
        for( var i = 0 ; i < val.length ; i++) {
            tmp_clusters[val[i].ID]=1;
          }
        console.log(tmp_clusters);
        this.saved_clusters=tmp_clusters;
      },

      handleSelect(key, keyPath) {
        // not in use
      },
      //-------------configure cell type end-------------------//
      changeColor(){
        console.log('change color');
      },
      //-------------data manager start-------------------//
      setJsonData(_data){
        console.log('knowing json loaded');
        var curr_draw_datas= [];
        this.final_clusters = new Array(301).fill(0);
        this.all_clusters = 301;
        // ---------- iterate through clusters setting (short)
        for(var i = 0; i<=300; i++ ){
            curr_draw_datas.push([['x','y','z']]);
        }
        // --------- iterate through real data (long)
        var left_index = 300;
        for(var j=0 ; j< _data.length; j++){
          var curr_item = _data[j];
          var found=0;
          for(var i = 0; i< 300; i++ ){
            if( curr_item[3] == i ){
                curr_draw_datas[i].push([curr_item[0],curr_item[1],curr_item[2]]);
                found=1;
                break;
            }
          }
          if( found == 0 ){
            curr_draw_datas[left_index].push([curr_item[0],curr_item[1],curr_item[2]]);
          }
        } // end of for _data

        // --------- check if any cluster has only one element aka the header
        console.log(curr_draw_datas.length);
        for (var i = 0; i < curr_draw_datas.length; i++){
          if (curr_draw_datas[i].length == 1) {
            this.all_clusters = this.all_clusters-1;
          }else{
            this.final_clusters[i] = 1;
          }
        }
        if (this.all_clusters != this.max_showd_clusters){
          this.max_showd_clusters = this.all_clusters;
        }
        console.log('before create tabledata, all_clsuters length is ');
        console.log(this.all_clusters);
        var new_tableDataClusters = [];
        for (var i=0; i < this.all_clusters; i++){
            new_tableDataClusters.push({ID: i, Celltype: 'Cluster'+i});
        }
        this.tableDataClusters = new_tableDataClusters;
        //console.log(this.tableDataClusters);
        this.jsondata = curr_draw_datas;
      },
      //-------------data manager end -------------------//
      //-------------drawing function start -------------------//
      getOption() {
        if ( this.jsondata == null ) {
          var curr_title = 'Loading data now ...';
          if( this.curr_rs == null ) {
            curr_title = 'Please select a resolution ...';
          }
          return {
            backgroundColor:'#000000',
             title :{
              text : curr_title,
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
          var curr_draw_datas = this.jsondata;
          var series_list = [];
          var legend_list = [];
          var legend_color = [];
          var curr_color ;
          console.log('start series');
          for( var i = 0 ; i<this.max_showd_clusters; i++ )
          {
            if(this.final_clusters[i] == 0){
              continue;
            }
            legend_list.push("CellType"+i);
            curr_color = COLOR_ALL[i];
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
            };
            series_list.push(one_series);
          } // end of for final_clusters.length
          console.log('end series');
          var opt={
            backgroundColor:'#000000',
            title :{
              text : '',
              left: "center",
              top : "top"
            },
            legend :{
              color :legend_color,
              data:legend_list,
              textStyle: {
                color: '#cccccc'
              }
            },
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
              data:legend_list,
              textStyle: {
                 color: '#cccccc'
              },
            },
            grid3D: {
              boxWidth:this.getWidth(),
              boxHeight:this.getDepth(),
              boxDepth:this.getHeight(),
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
      //-------------drawing function end-------------------//
    },
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
.headmenu {
  position: fixed;
}
.parent {
  position: relative;
}
.child {
  position: absolute;
  top: 0;
  left: 0;
}
.inline_item {
  display: inline-block;
  margin-left: 20px;
}
</style>
