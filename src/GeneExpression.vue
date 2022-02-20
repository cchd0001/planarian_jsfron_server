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
      <!-- 3D umap start -->
      <div class='inline_item'>
          <el-button align='right' @click.native="openUMAP" style='width:100%;z-index:9999;'>3D UMAP Panel</el-button>
          <div class='parent' style='width:10px;'>
            <div id="umap_panel" class="child" style='width:700px;z-index:9999;background-color:white'  v-if="!isUMAPHidden">
              <div id="umap_panel_dragMe">
                <p> UMAP Panel : {{umap_enable_message}}</p>
              </div>
              <div style="border: 10px solid #eee;">
                <v-chart class="chart" ref="my_umap_echarts" :option="umap_option" style="width:660px;height:660px;" />
                <el-button class='inline_item' @click.native="closeCTC">Close 3D UMAP Panel</el-button>
              </div>
            </div> <!-- end of hidden panel -->
          </div> <!-- end of parent-->
      </div> <!--end of inline div-->
      <!-- 3D umap end -->

      <p class="inline_item" > Please select the gene of your interest.</p>
      <el-select class="inline_item" v-model="curr_selected_gene" filterable placeholder="" @change="selectGene" >
        <el-option v-for="item in genes" :key="item.value" 
           :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <!-- ROI configuration menu start ... -->
      <div class='inline_item' >
        <el-button align='right' style='width:100%;' @click.native="openROI">ROI Configuration</el-button>
        <div class='parent' style='width:10px; ' >
          <div class="child" style='width:500px;z-index:9999;background-color:white'  v-if="!isROIHidden">
              <hr>
              <p class='inline_item_tight'> Z gap scale : </p>
              <el-input class='inline_item_tight' style='width:80px;height:50px;' type='number' v-model="tmp_z_scale" placeholder="1"></el-input>
              <el-button class='inline_item' @click.native="changeZScale">Apply</el-button>
              <hr>
              <p class='inline_item_tight'> X min : </p>
              <el-input class='inline_item_tight' style='width:80px;height:50px;' type='number' v-model="tmp_x_min" placeholder="0"></el-input>
              <el-button class='inline_item_tight' @click.native="changeXMin">Apply</el-button>
              <p class='inline_item'> X max : </p>
              <el-input class='inline_item_tight' style='width:80px;height:50px;' type='number' v-model="tmp_x_max" placeholder="300"></el-input>
              <el-button class='inline_item_tight' @click.native="changeXMax">Apply</el-button>
              <hr>
              <p class='inline_item_tight'> Y min : </p>
              <el-input class='inline_item_tight' style='width:80px;height:50px;' type='number' v-model="tmp_y_min" placeholder="0"></el-input>
              <el-button class='inline_item_tight' @click.native="changeYMin">Apply</el-button>
              <p class='inline_item'> Y max : </p>
              <el-input class='inline_item_tight' style='width:80px;height:50px;' type='number' v-model="tmp_y_max" placeholder="300"></el-input>
              <el-button class='inline_item_tight' @click.native="changeYMax">Apply</el-button>
              <hr>
              <p class='inline_item_tight'> Z min : </p>
              <el-input class='inline_item_tight' style='width:80px;height:50px;' type='number' v-model="tmp_z_min" placeholder="0"></el-input>
              <el-button class='inline_item_tight' @click.native="changeZMin">Apply</el-button>
              <p class='inline_item'> Z max : </p>
              <el-input class='inline_item_tight' style='width:80px;height:50px;' type='number' v-model="tmp_z_max" placeholder="300"></el-input>
              <el-button class='inline_item_tight' @click.native="changeZMax">Apply</el-button>
              <hr>
              <el-button class='inline_item' @click.native="resetROI">Reset ROI</el-button>
              <el-button class='inline_item' @click.native="closeCTC">Close Configuration Panel</el-button>
              <hr>
          </div>
        </div>
      </div>
      <!-- ROI configuration menu end ... -->
      <!-- switch symbol size start -->
      <div class="inline_item">
        <span class="inline_item" style="z-index:1;">Symbol size :</span>
        <el-slider class="inline_item" style="width:200px;z-index:1;" v-model="symbolSize"
           :step="1" :min="2" :max="10" @change="refresh" show-stops>
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
  var GENE_UMAP_URL="http://49.235.68.146/gene_umap/";
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
        gene_xyz:null,
        gene_xyz_raw:null,
        // umap 3D data
        basic_umapdata: null,
        raw_umapdata:null,
        umapdata:null,
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
        curr_selected_gene:'',
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
      //-------------UMAP conf start---------------------//
      openUMAP(){
        this.isHidden = true;
        this.isROIHidden = true;
        this.isUMAPHidden = !this.isUMAPHidden;
        if( this.isUMAPHidden == false ){
          this.umap_enable_message = '';
          this.load_umap();
          var self = this;
          setTimeout(function(){
            var ud = document.getElementById('umap_panel_dragMe');
            var up = document.getElementById('umap_panel');
            self.DeclareDragable(ud,up);
            self.umap_enable_message = 'Drag Me';
          },1000);
        }
      },
      DeclareDragable(dragMe, moveMe){
        const mouseDownHandler = function (e) {
          // Get the current mouse position
          drag_x = e.clientX;
          drag_y = e.clientY;
          // Attach the listeners to `document`
          document.addEventListener('mousemove', mouseMoveHandler);
          document.addEventListener('mouseup', mouseUpHandler);
        };
        const mouseMoveHandler = function (e) {
          const dx = e.clientX - drag_x;
          const dy = e.clientY - drag_y;
          moveMe.style.top = (Number(moveMe.offsetTop)+dy)+'px';
          moveMe.style.left = (Number(moveMe.offsetLeft)+dx)+'px'
          drag_x = e.clientX;
          drag_y = e.clientY;
        };
        const mouseUpHandler = function () {
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        };
        dragMe.addEventListener('mousedown', mouseDownHandler);
      },
      load_umap(){
        console.log("load_umap");
        if( this.umapdata != null ||  this.curr_name == null )
          return;
        var background_url = CELL_UMAP_URL+"/"+this.curr_name+"/"+"0.8.json";
        var gene_url = GENE_UMAP_URL+"/"+this.curr_name+"/"+this.curr_gene+".json";
        this.umap_option = this.getUMAPOption();
        var self = this;
        $.getJSON(background_url,function(_data) {
            console.log("basic");
            self.setBasicUMAPJsonData(_data);
            self.umap_option = self.getUMAPOption();
           });
        $.getJSON(gene_url,function(_data) {
            console.log("gene");
            self.setUMAPJsonData(_data);
            self.umap_option = self.getUMAPOption();
        });
        //self.umap_option = self.getUMAPOption();
      },
      setBasicUMAPJsonData(_data) {
        console.log('set basic umap data');
        // load umap background
        var curr_draw_datas= [];
        curr_draw_datas.push( ['x','y','z'] );
        for(var j=0 ; j< _data.length; j++){
          var curr_item = _data[j];
          curr_draw_datas.push( [curr_item[0],curr_item[1],curr_item[2]]);
        }
        this.basic_umapdata = curr_draw_datas;
      },
      setUMAPJsonData(_data) {
        console.log("set umap gene data");
        // load selected gene umap data
        var curr_draw_datas= [];
        curr_draw_datas.push( ['x','y','z','e'] );
        for(var j=0 ; j< _data.length; j++){
          var curr_item = _data[j];
          curr_draw_datas.push( [curr_item[0],curr_item[1],curr_item[2],curr_item[3]]);
        }
        this.umapdata = curr_draw_datas;
      },
      getUMAPOption() {
        console.log("get umap option");
        if ( this.basic_umapdata == null ) {
          return {
             backgroundColor:'#000000',
             title :{
              text : 'Loading model now ...\nThis might take a while ...',
              left: "center",
              top: "center",
              textStyle: {
                 color: '#cccccc'
              },
            }
          };
        }
        else {
          var curr_draw_datas = this.basic_umapdata;
          console.log('draw background first');
          var bk_color = "#888888";
          var one_series = {
              name : this.curr_name,
              type : 'scatter3D',
              dimensions: [ 'x','y','z' ],
              data: this.basic_umapdata,
              //data: this.umapdata,
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
          if(this.umapdata != null ){
              var gene_color = "#ff1111"
              var one_series = {
                  name : this.curr_gene,
                  type : 'scatter3D',
                  dimensions: [ 'x','y','z' ,'e'],
                  data: this.umapdata,
                  symbolSize: this.symbolSize,
                  itemStyle: {
                    borderWidth: 0,
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
              type: 'value',
              min : -10,
              max : 10,
            },
            yAxis3D: {
              name: 'y',
              scale:1,
              type: 'value',
              min : -10,
              max : 10,
            },
            zAxis3D: {
              name: 'z',
              scale:1,
              type: 'value',
              min : -10,
              max : 10,
            },
            legend :{
              color :legend_color,
              data:legend_list,
              textStyle: {
                 color: '#cccccc'
              },
            },
            grid3D: {
              boxWidth:60,
              boxHeight:60,
              boxDepth:60,
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
          if( this.umapdata != null)
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
               },
               textStyle: {
                  color: '#cccccc'
               },
            }];
          }
          console.log('reset option');
          return opt;
        } // end of else.
      }, // end of function option.
      //-------------UMAP conf end-----------------------//

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
        this.isHidden = true;
        this.isROIHidden = !this.isROIHidden;
        //if(this.isROIHidden)
           //this.isROIHidden = false;
        //else 
            //this.isROIHidden = true;
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
          this.gene_xyz = null;
          this.gene_xyz_raw = null;
          this.curr_selected_gene = null;
          this.umapdata = null;
          this.basic_umapdata = null;
          this.isUMAPHidden = true;
          // show loading first
          this.$refs.myecharts.setOption(this.getOption(),true);
          var used_url = CP_URL+"/"+name+".json";
          // loading data and re-draw graph
          var self = this;
          $.getJSON(used_url,function(_data) {
            self.setBasicData(_data);
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
      selectGene(item){
        if(this.curr_name != null){
          if(this.curr_gene != item ){
            this.umapdata = null;
            var self=this;
            var used_url = GENE_NEW_URL+"/"+this.curr_name+"/"+item+".json";
            $.getJSON(used_url,function(_data) {
              self.curr_gene = item;
              self.setGeneData(_data);
              self.option = self.getOption();
            });
            // if umap panel is still open
            if (!this.isUMAPHidden){
              var used_url2 = GENE_UMAP_URL+"/"+this.curr_name+"/"+item+".json";
              $.getJSON(used_url2, function(_data){
                self.curr_gene = item;
                self.setUMAPJsonData(_data);
                self.umap_option = self.getUMAPOption();
              });
            }
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
        this.resetROIdata();
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
        this.gene_xyz_raw = gene_xyz ;
      },
      //-------------setting data end -------------------//
      //-------------refresh  -------------------//
      refresh(){
        this.option=this.getOption();
        this.umap_option=this.getUMAPOption();
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
      resetROI(){
        this.resetROIdata();
        this.gene_xyz= this.gene_xyz_raw;
        this.option=this.getOption();
      },
      updateJsonData(){
        var curr_draw_datas = [];
        curr_draw_datas.push(['x','y','z']);
        for(var j =1;j<this.gene_xyz_raw.length; j++){
          var info = this.gene_xyz_raw[j];
          if( info[0]<this.x_min) continue;
          if( info[1]<this.y_min) continue;
          if( info[2]<this.z_min) continue;
          if( info[0]>this.x_max) continue;
          if( info[1]>this.y_max) continue;
          if( info[2]>this.z_max) continue;
          curr_draw_datas.push(info)
        }
        this.gene_xyz= curr_draw_datas;
      },
      changeXMin(){
        if(this.x_min != this.tmp_x_min){
          if(this.tmp_x_min<0)                          this.x_min = 0;
          else if (this.tmp_x_min>this.x_max-1)         this.x_min = this.x_max-1;
          else if (this.tmp_x_min>this.getWidth()-1)    this.x_min = this.getWidth()-1;
          else                                          this.x_min = this.tmp_x_min;
          this.updateJsonData();
          this.option=this.getOption();
        }
      },
      changeXMax(){
        if(this.x_max != this.tmp_x_max){
          if(this.tmp_x_max<1)                          this.x_max = 1;
          else if (this.tmp_x_max<Number(this.x_min)+1) this.x_max = Number(this.x_min) +1;
          else if (this.tmp_x_max>this.getWidth())      this.x_max = this.getWidth();
          else                                          this.x_max = this.tmp_x_max;
          console.log(this.x_max);
          this.updateJsonData();
          this.option=this.getOption();
        }
      },
      changeYMin(){
        if(this.y_min != this.tmp_y_min){
          if(this.tmp_y_min<0)                          this.y_min = 0;
          else if (this.tmp_y_min>this.y_max-1)         this.y_min = this.y_max-1;
          else if (this.tmp_y_min>this.getHeight()-1)   this.y_min = this.getHeight()-1;
          else                                          this.y_min = this.tmp_y_min;
          console.log(this.y_min);
          this.updateJsonData();
          this.option=this.getOption();
        }
      },
      changeYMax(){
        if(this.y_max != this.tmp_y_max){
          if(this.tmp_y_max<1)                          this.y_max = 1;
          else if (this.tmp_y_max<Number(this.y_min)+1) this.y_max = Number(this.y_min) +1;
          else if (this.tmp_y_max>this.getHeight())     this.y_max = this.getHeight();
          else                                          this.y_max = this.tmp_y_max;
          console.log(this.y_max);
          this.updateJsonData();
          this.option=this.getOption();
        }
      },
      changeZMin(){
        if(this.z_min != this.tmp_z_min){
          if(this.tmp_z_min<0)                          this.z_min = 0;
          else if (this.tmp_z_min>this.z_max-1)         this.z_min = this.z_max-1;
          else if (this.tmp_z_min>this.getDepth()-1)    this.z_min = this.getDepth()-1;
          else                                          this.z_min = this.tmp_z_min;
          this.updateJsonData();
          this.option=this.getOption();
        }
      },
      changeZMax(){
        if(this.z_max != this.tmp_z_max){
          if(this.tmp_z_max<1)                          this.z_max = 1;
          else if (this.tmp_z_max<Number(this.z_min)+1) this.z_max = Number(this.z_min) +1;
          else if (this.tmp_z_max>this.getDepth())      this.z_max = this.getDepth();
          else                                          this.z_max = this.tmp_z_max;
          this.updateJsonData();
          this.option=this.getOption();
        }
      },
      //-------------configure ROI end -------------------//
      //-------------construct graph begin -------------------//
      changeZScale(){
        this.z_scale = this.tmp_z_scale;
        this.option = this.getOption();
      },
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
                  symbolSize: this.symbolSize,
                  itemStyle: {
                    borderWidth: 0,
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
            legend :{
              color :legend_color,
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
               },
               textStyle: {
                  color: '#cccccc'
               },
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
