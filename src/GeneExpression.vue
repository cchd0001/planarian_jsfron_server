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
      <el-select class="inline_item" v-model="curr_selected_gene" filterable placeholder="" @change="selectGene" >
        <el-option v-for="item in genes" :key="item.value" 
           :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div>
      <v-chart :option="option" style="width:1600px;height:700px;" />
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
  var SC_URL="http://49.232.213.84/single_cell/"
  var GENE_URL="http://49.232.213.84/genes/";
  let conf_gens = require('../confs/genes.js');
  var idvd_conf = require('../confs/individual.js');

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
        gene_xyz:null,
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
        curr_selected_gene:'',
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
      //-------------switching individual start -------------------//
      update_basic(name){
        if( this.curr_name != name)
        {
          // set new name
          this.curr_name = name;
          //clean buffer 
          this.curr_gene = null;
          this.basic_xyz = null;
          this.gene_xyz = null;
          this.curr_selected_gene = null;
          // show loading first
          this.option = this.getOption();
          var used_url = SC_URL+"/"+name+"/label.json";
          // loading data and re-draw graph
          var self = this;
          $.getJSON(used_url,function(_data) {
            self.setBasicData(_data);
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

      //-------------switching gene start -------------------//
      selectGene(item){
        console.log(item);
        if(this.curr_name != null){
          if(this.curr_gene != item ){
            var self=this;
            var used_url = GENE_URL+"/"+this.curr_name+"/"+item+".json";
            $.getJSON(used_url,function(_data) {
              self.curr_gene = item;
              self.setGeneData(_data);
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
        this.basic_xyz = basic_xyz;
      },
      setGeneData(_data){
        console.log('get gene json loaded');
        var gene_xyz= [];
        gene_xyz.push( ['x','y','z','e'] );
        for(var j=0 ; j< _data.length; j++)
        {
            var curr_item = _data[j];
            gene_xyz.push( [curr_item[0],curr_item[1],curr_item[2],curr_item[3]]);
        }
        this.gene_xyz = gene_xyz;
      },
      //-------------setting data end -------------------//

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
                opacity: 0.5,
              },
          };
          var series_list = [];
          var legend_list = [this.curr_name];
          var legend_color = [bk_color];
          series_list.push(one_series);
          if(this.gene_xyz != null ){
              var gene_color = "#ff1111"
              var one_series = {
                  name : this.curr_gene,
                  type : 'scatter3D',
                  dimensions: [ 'x','y','z' ,'e'],
                  data: this.gene_xyz,
                  symbolSize: 2,
                  itemStyle: {
                    borderWidth: 1,
                    //borderColor: gene_color,
                    //color : gene_color,
                  },
              };
              series_list.push(one_series);
          }
          else{
              console.log('no gene data');
              var gene_color = "#ff1111"
              var one_series = {
                  name : this.curr_gene,
                  type : 'scatter3D',
                  dimensions: [ 'x','y','z' ,'e'],
                  data: [],
                  symbolSize: 2,
                  itemStyle: {
                    borderWidth: 1,
                    //borderColor: gene_color,
                    //color : gene_color,
                  },
              };
              series_list.push(one_series);
          }
          // end of for showd_clusters.length
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
                //autoRotate: true
                //projection: 'orthographic'
              }
            },
            series: series_list
          }; // end of var opt
          if( this.gene_xyz != null)
          {
            opt.visualMap= [
            {
               type: 'continuous',
               min: 1,
               max: 5,
               dimension: 3, // the fourth dimension of series.data (i.e. value[3]) is mapped
               seriesIndex: 1, // The fourth series is mapped.
               inRange: {
                  // The ädvisual configuration in the selected range
                  //color: ['blue', '#121122', 'red'], // A list of colors that defines the graph color mapping
                  color: ['blue', 'yellow', 'red'], // A list of colors that defines the graph color mapping
               }
            }];
          }
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
.inline_item {
  display: inline-block;
  margin-left: 20px;
}
</style>
