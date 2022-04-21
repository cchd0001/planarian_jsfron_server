<template>
  <div id="app">
    <div style="margin-left:0%;" align="left">
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
    <div style="margin-left:0%;background-color: rgb(238, 241, 246); border: 3px solid #eee;" >
      <p class="inline_item" > Please select the gene of your interest.</p>
      <el-select class="inline_item" v-model="curr_selected_gene0" filterable placeholder="" @change="selectGene0" >
        <el-option v-for="item in genes" :key="item.value" 
           :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select class="inline_item" v-model="curr_selected_gene1" filterable placeholder="" @change="selectGene1" >
        <el-option v-for="item in genes" :key="item.value" 
           :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select class="inline_item" v-model="curr_selected_gene2" filterable placeholder="" @change="selectGene2" >
        <el-option v-for="item in genes" :key="item.value" 
           :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <!-- switch symbol size start -->
      <div class="inline_item">
        <span class="inline_item" style="z-index:1;">Symbol size :</span>
        <el-slider class="inline_item" style="width:100px;z-index:1;" v-model="symbolSize"
           :step="1" :min="2" :max="6" @change="refresh" show-stops>
         </el-slider>
      </div>
      <!-- switch symbol size end -->
    </div>
    <div>
      <v-chart ref="myecharts"  :option="option" style="width:100%;height:700px;" />
    </div>
  </div>
</template>

<script>
  import $ from 'jquery';
  import * as echarts from 'echarts';
  import 'echarts-gl';
  //import VChart, { THEME_KEY } from "vue-echarts";
  import VChart from "vue-echarts";
  // the dateset url
  var GENE_UMAP_UR="http://49.235.68.146/gene_umap/";
  var CELL_UMAP_URL="http://49.235.68.146/cell_umap/";
  var SC_URL="http://49.235.68.146/single_cell/"
  var GENE_URL="http://49.235.68.146/genes/";
  var CP_URL="http://49.235.68.146/cell_center/"
  var GENE_NEW_URL="http://49.235.68.146/newgenes/";
  let conf_gens = require('../confs/genes.js');
  var idvd_conf = require('../confs/individual.js');
  var drag_x = 0;
  var drag_y = 0;

  export default {
    name : "GeneExpression",
    components: {
        VChart
    },
    data(){
      return {
        genes : conf_gens,
        curr_name: "",
        curr_gene: "",
        basic_xyz: null,
        // there genes to display
        gene0_xyz:null,
        gene1_xyz:null,
        gene2_xyz:null,
        gene0_xyz_raw:null,
        gene1_xyz_raw:null,
        gene2_xyz_raw:null,
        // umap 3D data
        basic_umapdata: null,
        gene_umap_xyz:null,

        option: {
           backgroundColor:'#000000',
           title :{
               text : 'Please select a specific individual to show.',
               left: "center",
               top: "center",
               textStyle: {
                  color: '#cccccc'
               },
           }
        },
        umap_option: {
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
        curr_selected_gene0:'',
        curr_selected_gene1:'',
        curr_selected_gene2:'',
        // drawing theme
        black_background:true,
        symbolSize:2,
        umap_enable_message : '',
        //------------roi confs start ------
        isROIHidden:true,
        isUMAPHidden:true,
        z_scale:1,
        tmp_z_scale:1,
        // roi
        tmp_x_min:0,
        tmp_y_min:0,
        tmp_z_min:0,
        tmp_x_max:300,
        tmp_y_max:300,
        tmp_z_max:300,
        x_min:0,
        y_min:0,
        z_min:0,
        x_max:300,
        y_max:300,
        z_max:300,
        //------------roi confs end------
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
      //-------------roi panel start-------------------//
      openROI(){
        //console.log("open roi");
        this.isHidden = true;
        if(this.isROIHidden)
           this.isROIHidden = false;
        else 
            this.isROIHidden = true;
      },
      closeCTC(){
        //this.isHidden = true;
        this.isROIHidden = true;
        this.isUMAPHidden = true;
      },
      //-------------roi panel end-------------------//
      //-------------switching individual start -------------------//
      update_basic(name){
        if( this.curr_name != name)
        {
          // set new name
          this.curr_name = name;
          //clean buffer 
          this.curr_gene = null;
          this.basic_xyz = null;
          this.gene0_xyz = null;
          this.gene1_xyz = null;
          this.gene2_xyz = null;
          this.gene_xyz_raw = null;
          this.curr_selected_gene0='';
          this.curr_selected_gene1='';
          this.curr_selected_gene2='';
          this.basic_umapdata = null;
          // show loading first
          this.$refs.myecharts.setOption(this.getOption(),true);
          //this.option = this.getOption();
          //var used_url = SC_URL+"/"+name+"/label.json";
          var used_url = CP_URL+"/"+name+".json";
          // loading data and re-draw graph
          var self = this;
          $.getJSON(used_url,function(_data) {
            self.setBasicData(_data);
            //self.option = self.getOption();
            self.$refs.myecharts.setOption(self.getOption(),true);
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

      //-------------switching gene start -------------------//
      selectGene0(item){
        console.log(item);
        if(this.curr_name != null){
          if(this.curr_gene0 != item ){
            var self=this;
            var used_url = GENE_NEW_URL+"/"+this.curr_name+"/"+item+".json";
            $.getJSON(used_url,function(_data) {
              self.curr_gene0 = item;
              self.setGene0Data(_data);
              self.option = self.getOption();
            });
          }
        }
      },
      selectGene1(item){
        console.log(item);
        if(this.curr_name != null){
          if(this.curr_gene != item ){
            var self=this;
            var used_url = GENE_NEW_URL+"/"+this.curr_name+"/"+item+".json";
            //var used_url = GENE_NEW_URL+"/"+this.curr_name+"/SMED30032613.json";
            $.getJSON(used_url,function(_data) {
              self.curr_gene1 = item;
              self.setGene1Data(_data);
              self.option = self.getOption();
            });
          }
        }
      },
      selectGene2(item){
        console.log(item);
        if(this.curr_name != null){
          if(this.curr_gene != item ){
            var self=this;
            var used_url = GENE_NEW_URL+"/"+this.curr_name+"/"+item+".json";
            //var used_url = GENE_NEW_URL+"/"+this.curr_name+"/SMED30032613.json";
            $.getJSON(used_url,function(_data) {
              self.curr_gene2 = item;
              self.setGene2Data(_data);
              self.option = self.getOption();
            });
          }
        }
      },
      //-------------switching gene end -------------------//

      //-------------setting data start -------------------//
      setBasicData(_data){
        console.log('get basic json data');
        var basic_xyz = [];
        basic_xyz.push( ['x','y','z'] );
        for(var j=0 ; j< _data.length; j++)
        {
            var curr_item = _data[j];
            basic_xyz.push( [curr_item[0],curr_item[1],curr_item[2]]);
        }
        console.log(_data[1]);
        this.basic_xyz = basic_xyz;
        //console.log('basic xyz');
        //console.log(this.basic_xyz);
        this.resetROIdata();
      },
      setGene0Data(_data){
        console.log('get gene json loaded');
        var gene_xyz= [];
        gene_xyz.push( ['x','y','z'] );
        for(var j=0 ; j< _data.length; j++)
        {
            var curr_item = _data[j];
            gene_xyz.push( [curr_item[0],curr_item[1],curr_item[2]]);
        }
        this.gene0_xyz = gene_xyz;
        this.gene0_xyz_raw = gene_xyz ;
      },
      setGene1Data(_data){
        console.log('get gene json loaded');
        var gene_xyz= [];
        gene_xyz.push( ['x','y','z'] );
        for(var j=0 ; j< _data.length; j++)
        {
            var curr_item = _data[j];
            gene_xyz.push( [curr_item[0],curr_item[1],curr_item[2]]);
        }
        this.gene1_xyz = gene_xyz;
        this.gene1_xyz_raw = gene_xyz ;
      },
      setGene2Data(_data){
        console.log('get gene json loaded');
        var gene_xyz= [];
        gene_xyz.push( ['x','y','z'] );
        for(var j=0 ; j< _data.length; j++)
        {
            var curr_item = _data[j];
            gene_xyz.push( [curr_item[0],curr_item[1],curr_item[2]]);
        }
        this.gene2_xyz = gene_xyz;
        this.gene2_xyz_raw = gene_xyz ;
      },
      //-------------setting data end -------------------//
      //-------------refresh  -------------------//
      refresh(){
        this.option=this.getOption();
      },
      //-------------refresh  -------------------//

      //-------------configure ROI start -------------------//
      resetROIdata(){
        // reset-roi
        this.z_scale = 1;this.tmp_z_scale=1;
        this.x_min = 0;this.y_min = 0;this.z_min = 0;this.tmp_x_min=0;this.tmp_y_min=0;this.tmp_z_min=0;
        this.x_max = this.getWidth();this.y_max = this.getHeight(); this.z_max = this.getDepth();
        this.tmp_x_max = this.x_max; this.tmp_y_max = this.y_max; this.tmp_z_max = this.z_max;
      },
      //-------------construct graph begin -------------------//
      getOption() {
        if ( this.basic_xyz == null ) {
          return {
             backgroundColor:'#000000',
             title :{
              text : 'Loading model now ...',
              left: "center",
              top: "center",
              textStyle: {
                 color: '#cccccc'
              },
            }
          };
        }
        else {
          //console.log('knowing json loaded');
          //console.log('01');
          var curr_draw_datas = this.basic_xyz;
          console.log('draw background first');
          var bk_color = "#888888";
          var one_series = {
              name : this.curr_name,
              type : 'scatter3D',
              dimensions: [ 'x','y','z' ],
              data: this.basic_xyz,
              symbolSize: 2,
              itemStyle: {
                borderWidth: 1,
                borderColor: bk_color,
                color : bk_color,
                opacity: 0.3,
              },
          };
          var series_list = [];
          var legend_list = [this.curr_name];
          series_list.push(one_series);
          if(this.gene0_xyz != null ){
              legend_list.push(this.curr_gene0);
              var gene_color = "#11ff11"
              var one_series = {
                  name : this.curr_gene0,
                  type : 'scatter3D',
                  dimensions: [ 'x','y','z' ],
                  data: this.gene0_xyz,
                  symbolSize: this.symbolSize,
                  itemStyle: {
                    borderWidth: 0,
                    borderColor: gene_color,
                    color : gene_color,
                    opacity: 0.5,
                  },
              };
              series_list.push(one_series);
          }
          if(this.gene1_xyz != null ){
              legend_list.push(this.curr_gene1);
              var gene_color = "#ffff11"
              var one_series = {
                  name : this.curr_gene1,
                  type : 'scatter3D',
                  dimensions: [ 'x','y','z' ],
                  data: this.gene1_xyz,
                  symbolSize: this.symbolSize,
                  itemStyle: {
                    borderWidth: 0,
                    borderColor: gene_color,
                    color : gene_color,
                    opacity: 0.5,
                  },
              };
              series_list.push(one_series);
          }
          if(this.gene2_xyz != null ){
              legend_list.push(this.curr_gene2);
              var gene_color = "#ff11ff"
              var one_series = {
                  name : this.curr_gene2,
                  type : 'scatter3D',
                  dimensions: [ 'x','y','z' ,'e'],
                  data: this.gene2_xyz,
                  symbolSize: this.symbolSize,
                  itemStyle: {
                    borderWidth: 0,
                    borderColor: gene_color,
                    color : gene_color,
                    opacity: 0.5,
                  },
              };
              series_list.push(one_series);
          }
          console.log(series_list.length);
          console.log(legend_list.length);
          var opt= {
            backgroundColor:'#000000',
            title :{
              text : '',
              left: "center",
              top : "top"
            },
            tooltip: {},
            xAxis3D: {
              name: 'x',
              scale:1,
              type: 'value',
              min : 0,
              max : this.getWidth(),
            },
            yAxis3D: {
              name: 'y',
              scale:1,
              type: 'value',
              min : 0,
              max : this.getHeight(),
            },
            zAxis3D: {
              name: 'z',
              scale:1,
              type: 'value',
              min : 0,
              max : this.getDepth(),
            },
            toolbox: {
              show: true,
              feature: {
                saveAsImage: {},
              }
            },
            legend :{
              data:legend_list,
              textStyle: {
                 color: '#cccccc'
              },
            },
            grid3D: {
              boxWidth:this.getWidth(),
              boxHeight:this.getDepth() * Number(this.z_scale),
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
                //autoRotate: true
                //projection: 'orthographic'
              }
            },
            series: series_list
          }; // end of var opt
          console.log('reset option');
          return opt;
        } // end of else.
      } // end of function option.
      //-------------construct graph end -------------------//
    }
  }; // end of export defaul.
</script>

<style>
#app {
  font-family: Helvetica, sans-serif;
  text-align: center;
}
.parent {
  position: relative;
}
.child {
  position: absolute;
  top: 0;
  left: 0;
}
.inline_item_tight {
  display: inline-block;
  margin-left: 3px;
  vertical-align: middle;
}
.inline_item {
  display: inline-block;
  margin-left: 20px;
  vertical-align: middle;
}
</style>
