<template>
<el-row>
  <el-button  class="floatsetting" v-show="!display_setting" type="primary" icon="el-icon-setting"  @click="span_setting" >{{setting_title}}</el-button>
  <!-- ----------The setting grid begin --------------------------------------------------------------- -->
  <el-col :span="setting_w" style="height:100%">
      <div class="grid-content bg-purple">
          <el-button  type="primary" icon="el-icon-setting" width='100%' @click="span_setting" >{{setting_title}}</el-button>
          <!-- ----------The setting panel begin --------------------------------------------------------------- -->
          <transition name="el-zoom-in-center"  >
            <div v-show="display_setting" class="transition-box" align='center' style="margin:3px; border: 3px solid #ffffff;"> 
              <el-collapse v-model='collapseName'>
                 <!-- ----------The Baisc settings begin --------------------------------------------------------------- -->
                  <el-collapse-item title="Baisc settings:" name="1">
                      <div align="center"  style="margin:3px;  border: 3px solid #ccc;" > 
                          <!-- ----------Choose mode begin --------------------------------------------------------------- -->
                          <h3>Display Mode : {{curr_mode}}</h3>
                            <el-select v-model="curr_mode" placeholder="curr_mode" @change="OnChangeMode">
                              <el-option
                                v-for="item in all_modes"
                                :key="item"
                                :label="item"
                                :value="item">
                              </el-option>
                            </el-select>
                          <hr class="dhr">
                          <h3>Display data: {{curr_sample}}</h3>
                            <el-select v-model="curr_sample" placeholder="curr_sample" @change="OnChangeSample">
                              <el-option
                                v-for="item in all_sample"
                                :key="item"
                                :label="item"
                                :value="item">
                              </el-option>
                            </el-select>
                          <!-- ----------Choose mode end --------------------------------------------------------------- -->
                          <hr class="dhr">
                      </div>
                  </el-collapse-item>
                 <!-- ----------The Baisc settings end -------------------------------------------------------------- -->
                  <el-collapse-item :title="mode_title" name="2" >
                     <!-- ----------mode setting begin --------------------------------------------------------------- -->
                     <div  align="center"  v-show="is_ct_mode" style="border: 1px solid #ccc;">
                        <h3>Cell type mode conf:</h3>
                        <hr class="dhr">
                     </div>
                     <div  align="center"  v-show="is_ge_mode" >
                        <h3>Gene Expression mode conf:</h3>
                        <hr class="dhr">
                     </div>
                     <div  align="center"  v-show="is_gc_mode" >
                        <h3>Gene Colocalization mode conf:</h3>
                        <hr class="dhr">
                     </div>
                     <!-- ----------mode setting end --------------------------------------------------------------- -->
                  </el-collapse-item>
                  <el-collapse-item title="ROI details:" name="3">
                     <!-- ----------roi setting begin --------------------------------------------------------------- -->
                      <div align="center"   style="margin:3px;  border: 3px solid #ccc;">
                          <p class='inline_item'>Z scale:</p>
                          <el-input class='inline_item' style='width:80px;height:50px;'  v-model="tmp_z_scale" placeholder="1"></el-input>
                          <el-button type="success" class='inline_item' @click.native="changeZScale">Apply</el-button>
                          <hr class="dhr">
                          <p class='inline_item'>X min:</p>
                          <el-input class='inline_item' style='width:80px;height:50px;'  v-model="tmp_x_min" placeholder="0"></el-input>
                          <el-button type="success" class='inline_item' @click.native="changeXMin">Apply</el-button>
                          <br>
                          <p class='inline_item'>Y min:</p>
                          <el-input class='inline_item' style='width:80px;height:50px;'  v-model="tmp_y_min" placeholder="0"></el-input>
                          <el-button type="success" class='inline_item' @click.native="changeYMin">Apply</el-button>
                          <br>
                          <p class='inline_item'>Z min:</p>
                          <el-input class='inline_item' style='width:80px;height:50px;'  v-model="tmp_z_min" placeholder="0"></el-input>
                          <el-button type="success" class='inline_item' @click.native="changeZMin">Apply</el-button>
                          <br>
                          <p class='inline_item'>X max:</p>
                          <el-input class='inline_item' style='width:80px;height:50px;'  v-model="tmp_x_max" placeholder="300"></el-input>
                          <el-button type="success" class='inline_item' @click.native="changeXMax">Apply</el-button>
                          <br>
                          <p class='inline_item'>Y max:</p>
                          <el-input class='inline_item' style='width:80px;height:50px;'  v-model="tmp_y_max" placeholder="300"></el-input>
                          <el-button type="success" class='inline_item' @click.native="changeYMax">Apply</el-button>
                          <br>
                          <p class='inline_item'>Z max:</p>
                          <el-input class='inline_item' style='width:80px;height:50px;'  v-model="tmp_z_max" placeholder="300"></el-input>
                          <el-button type="success" class='inline_item' @click.native="changeZMax">Apply</el-button>
                          <hr class="dhr">
                          <el-button type="warning" class='inline_item' @click.native="resetROI">Reset ROI</el-button>
                          <hr class="dhr">
                      </div>
                     <!-- ----------roi setting end--------------------------------------------------------------- -->
                  </el-collapse-item>
                  <el-collapse-item title="Display details:" name="4">
                      <!-- ----------display setting begin --------------------------------------------------------------- -->
                      <div  align="center"  style="margin:3px;  border: 3px solid #ccc;">
                          <!-- switch background start -->
                          <el-switch  active-text="Black theme" inactive-text="White theme"
                            v-model="black_background" @change="refresh" >
                          </el-switch>
                          <!-- switch background end -->
                          <!-- Posture select start -->
                          <hr class="dhr">
                          <el-switch  active-text="Adjusted posture" inactive-text="Original posture"
                            v-model="adjusted_posture" @change="update_coord" >
                          </el-switch>
                          <!-- Posture select end -->
                          <!-- Draw legend start -->
                          <hr class="dhr">
                          <el-switch  active-text="Draw legends" inactive-text="Ignore legends"
                            v-model="draw_legends" @change="refresh" >
                          </el-switch>
                          <!-- Draw grid start -->
                          <hr class="dhr">
                          <el-switch  active-text="Draw grids" inactive-text="Ignore grids"
                            v-model="draw_grids" @change="refresh" >
                          </el-switch>
                          <!-- Draw grid end -->
                          <!-- Draw box start -->
                          <hr class="dhr">
                          <el-switch  align='center' active-text="Draw box" inactive-text="Ignore box"
                            v-model="draw_box" @change="refresh" >
                          </el-switch>
                          <!-- Draw box end -->
                          <!-- switch symbol size start-->
                          <hr class="dhr">
                          <div>
                            <span class="demonstration" >SymbolSize:</span>
                            <el-slider  v-model="symbolSize"
                               :step="1" :min="2" :max="10" @change="refresh" show-stops>
                             </el-slider>
                          </div>
                          <hr class="dhr">
                          <div>
                            <span  class="demonstration">SymbolAlpha:</span>
                            <el-slider  v-model="symbolAlpha"
                               :step="0.03" :min="0.01" :max="1" @change="refresh" show-stops>
                             </el-slider>
                          </div>
                          <!-- switch symbol size end -->
                      </div>
                      <!-- ----------display setting end--------------------------------------------------------------- -->
                  </el-collapse-item>
              </el-collapse>
              <el-button type="success" @click.native="OnChangeSample">Apply</el-button>
            </div>
          </transition>
          <!-- ----------The setting panel end --------------------------------------------------------------- -->
      </div>
  </el-col>
  <!-- ----------The setting grid end --------------------------------------------------------------- -->
  <!-- ----------The 3D display grid begin --------------------------------------------------------------- -->
  <el-col :span="display_w"  style="height:100%">
    <!-- main window -->
    <div ref="main"  style="border: 3px solid #eee;">
      <!-- I. chart content -->
      <v-chart class="chart" resizeable=true :width="chartWidth"  ref="myecharts" :option="option" style="height:800px;" />
    </div>
    <!-- end of the main window -->
  </el-col>
  <!-- ----------The 3D display grid end --------------------------------------------------------------- -->
</el-row>
</template>

<script>
//import packages ------------------------------------
import $ from 'jquery';
import * as echarts from 'echarts';
import 'echarts-gl';
import VChart, { THEME_KEY } from "vue-echarts";
// the dateset url -----------------------------------
var CT_URL = "http://49.235.68.146/celltype/"
var CTU_URL = "http://49.235.68.146/celltype_umap/"
var CP_URL = "http://49.235.68.146/cell_center/"
// legend and the color conf --------------------------------
var COLOR_ALL = require('../confs/discret_color.js');
var COLOR_default = COLOR_ALL.default_colors;
var COLOR_9 = COLOR_ALL.color_9;
var celltype_legend = require('../confs/CellType.js');
// axis limitation conf --------------------------------
var idvd_conf_corrected = require('../confs/individual_corrected.js');
var idvd_conf_rotate = require('../confs/individual_rotated.js');


export default {
components: {
  VChart,
},
data() {
    return {
      // setting basics --------------------------------------
      display_setting: true,
      setting_title :'Hide settings',
      setting_w: 4,
      display_w: 20,
      // collapse details   
      collapseName: '1',
      // valid mode:
      all_modes: [
          'CellTypes',
          'GeneExpression',
          'GeneColocalization',
      ],
      curr_mode : 'CellTypes',
      // mode tags
      is_ct_mode: true,
      is_ge_mode: false,
      is_gc_mode: false,
      // valid samples:
      all_sample: [
           'All17Sample',
           'WT',
           '0hpa1',
           '0hpa2',
           '12hpa1',
           '12hpa2',
           '36hpa1',
           '36hpa2',
           '3dpa1',
           '3dpa2',
           '5dpa1',
           '5dpa2',
           '7dpa1',
           '7dpa2',
           '10dpa1',
           '10dpa2',
           '14dpa1',
           '14dpa2',
      ],
      curr_sample: 'WT',
      mode_title:'CellType setting',
      //------------body posture confs begin------
      // coordinate tag
      coord_tag : 'adjusted',
      //------------body posture confs end ------
      
      //------------color legends confs begin------
      // test color 
      current_color_all: COLOR_default,
      COLOR_ALL2: COLOR_default,
      currentCellID: '',
      isShowColorPalette: false,
      color: '',
      //------------color legends confs end------
      //------------drag element confs begin------
      // test drag
      show: true,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      //------------drag element confs end------
      //------------roi confs begin------
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
      // drawing details conf start ----------
      black_background:true,
      draw_legends:true,
      draw_grids:false,
      draw_box :true,
      adjusted_posture:true,
      symbolSize:2,
      symbolAlpha:1.0,
      // drawing details conf end----------
      // echarts option
      chartWidth:'100%',
      option: {
        backgroundColor:'#000000',
        title : {
            text : 'Please select a specific individual and atlas type to show.',
            left: "center",
            top: "center",
            textStyle: {
               color: '#cccccc'
            },
        }
      },
      //------------data selection for cell type begin ------
      // curr selection
      curr_name : null,
      curr_rs : null,
      selected_rs_index:"0",
      // main 3D data
      rawdata:null,
      jsondata : null,
      //------------data selection for cell type end ------
      //------------model data : mesh begin ------
      mesh_json:null,
      mesh_conf : { 
        names:    ['Body','Neural','Gut','Pharynx'],
        legends : ['Body_mesh','Neural_mesh','Gut_mesh','Pharynx_mesh'],
        //colors :  ['#cc6600','#ffff00','#ff0000','#00ff00'],
        colors :  ['#7d6a43','#b6b6b6','#a871a7','#609148'],
        opacity:  [ 0.3, 0.55, 0.55, 0.55],
      },
      //------------model data : mesh begin ------
    }
  },
  methods: {
    // ------------------ resize page begin ----------------------
    resize_option(){
       this.$nextTick(() => {
           this.$refs.myecharts.resize();
       });
    },
    span_setting(){
        if( this.display_setting == true ) {
            this.display_setting = false;
            this.setting_w = 0;
            this.display_w = 24 ;
            this.setting_title = '';
            this.resize_option()
        } else {
            this.display_setting = true;
            this.setting_w = 4;
            this.display_w = 20 ;
            this.setting_title = 'Hide Settings'
            this.resize_option()
        }
    },
    // ------------------ resize page end----------------------
    // ------------------ basic conf functions begin----------------------
    OnChangeMode(){
        this.mode_title = this.curr_mode+" setting";
        console.log(this.curr_mode)
        if( this.curr_mode == "CellType") {
            this.is_ct_mode = true;
            this.is_gc_mode = false;
            this.is_ge_mode = false;
        }else if ( this.curr_mode == "GeneExpression" ) {
            this.is_ct_mode = false;
            this.is_gc_mode = false;
            this.is_ge_mode = true;
        } else {
            this.is_ct_mode = false;
            this.is_gc_mode = true;
            this.is_ge_mode = false;
        }
    },
    OnChangeSample(){
      this.curr_name = this.curr_sample;
      //deep clean buffer
      this.cleanBuffer();
      //this.$refs.myecharts.setOption(this.getOption(),true);
      // reset mesh and ROI data
      this.resetROIdata();
      this.resetMesh();
    },
    // ------------------ basic conf functions end----------------------

    //-------------3d box conf start-------------------//
    getXMin(){
      if( this.coord_tag == "raw" ) 
          return idvd_conf_rotate['label_'+this.curr_name].xmin/10;
      else 
          return idvd_conf_corrected['label_'+this.curr_name].xmin/10;
    },
    getXMax(){
      if( this.coord_tag == "raw" ) 
          return idvd_conf_rotate['label_'+this.curr_name].xmax/10;
      else 
          return idvd_conf_corrected['label_'+this.curr_name].xmax/10;
    },
    getYMin(){
      if( this.coord_tag == "raw" ) 
          return idvd_conf_rotate['label_'+this.curr_name].ymin/10;
      else 
          return idvd_conf_corrected['label_'+this.curr_name].ymin/10;
    },
    getYMax(){
      if( this.coord_tag == "raw" ) 
          return idvd_conf_rotate['label_'+this.curr_name].ymax/10;
      else 
          return idvd_conf_corrected['label_'+this.curr_name].ymax/10;
    },
    getZMin(){
      if( this.coord_tag == "raw" ) 
          return idvd_conf_rotate['label_'+this.curr_name].zmin/10;
      else 
          return idvd_conf_corrected['label_'+this.curr_name].zmin/10;
    },
    getZMax(){
      if( this.coord_tag == "raw" ) 
          return idvd_conf_rotate['label_'+this.curr_name].zmax/10;
      else 
          return idvd_conf_corrected['label_'+this.curr_name].zmax/10;
    },
    getWidth(){
      return this.getXMax()-this.getXMin()+2;
    },
    getDepth() {
      return this.getZMax()-this.getZMin()+2;
    },
    getHeight() {
      return this.getYMax()-this.getYMin()+2;
    },
    //-------------3d box conf end -------------------//
    //-------------mesh managerment start -------------------//
    resetMesh(){
      this.mesh_json = null;
      var self = this;
      var used_url = '';
      if( this.coord_tag == 'raw' ) {
        used_url = CP_URL+"/"+this.curr_name+"_mesh.rotate.json";
      } else {
        used_url = CP_URL+"/"+this.curr_name+"_mesh.apdv.json";
      }
      console.log(used_url);
      $.getJSON(used_url,function(_data) {
        console.log("mesh loaded");
        self.setMeshData(_data);
        //self.$nextTick(() => {
        self.option = self.getOption();
        //});
      });
    },
    setMeshData(_data) {
        this.mesh_json = {};
        this.mesh_json['Body'] = {}
        this.mesh_json['Body']['xyz'] = _data[0][0];
        this.mesh_json['Body']['ijk'] = _data[0][1];
        this.mesh_json['Neural'] = {}
        this.mesh_json['Neural']['xyz'] = _data[1][0];
        this.mesh_json['Neural']['ijk'] = _data[1][1];
        this.mesh_json['Gut'] = {}
        this.mesh_json['Gut']['xyz'] = _data[2][0];
        this.mesh_json['Gut']['ijk'] = _data[2][1];
        this.mesh_json['Pharynx'] = {}
        this.mesh_json['Pharynx']['xyz'] = _data[3][0];
        this.mesh_json['Pharynx']['ijk'] = _data[3][1];
    },
    //-------------mesh managerment end -------------------//
    //-------------data managerment start -------------------//
    cleanBuffer(){
      this.jsondata = null ;
      this.rawdata = null;
    },
    
    update_basic() {
      //deep clean buffer
      this.cleanBuffer();
      this.$refs.myecharts.clear();
      //this.$refs.myecharts.setOption(this.getOption(),true);
      // reset mesh and ROI data
      this.resetROIdata();
      this.resetMesh();
      // download main data
      var used_url = CT_URL+"/"+this.curr_name+"/"+this.curr_rs+"."+this.coord_tag+".json";
      var data_tag = this.curr_rs;
      var self = this;
      $.getJSON(used_url,function(_data) {
        console.log("loaded");
        self.setJsonData(_data,data_tag);
        self.option = self.getOption();
      });
    },

    //-------------configure ROI start -------------------//
    changeZScale(){
      this.z_scale = this.tmp_z_scale;
      this.option = this.getOption();
    },
    resetROIdata(){
      // reset-roi
      this.z_scale = 1;this.tmp_z_scale=1;
      this.x_min = this.getXMin();
      this.y_min = this.getYMin();
      this.z_min = this.getZMin();
      this.tmp_x_min=this.x_min;
      this.tmp_y_min=this.y_min;
      this.tmp_z_min=this.z_min;
      this.x_max = this.getXMax();
      this.y_max = this.getYMax();
      this.z_max = this.getZMax();
      this.tmp_x_max = this.x_max; 
      this.tmp_y_max = this.y_max;
      this.tmp_z_max = this.z_max;
    },
    resetROI(){
      this.resetROIdata();
      this.jsondata = this.rawdata;
      this.option=this.getOption();
    },
    updateJsonData(){
      var curr_draw_datas = [];
      for(var i =0;i<this.all_clusters;i++)
          curr_draw_datas.push([['x','y','z']]);
      for(var i =0;i<this.all_clusters;i++){
        for(var j =1;j<this.rawdata[i].length; j++){
           var info = this.rawdata[i][j];
           if( info[0]<this.x_min) continue;
           if( info[1]<this.y_min) continue;
           if( info[2]<this.z_min) continue;
           if( info[0]>this.x_max) continue;
           if( info[1]>this.y_max) continue;
           if( info[2]>this.z_max) continue;
           curr_draw_datas[i].push(info)
        }
      }
      this.jsondata = curr_draw_datas;
    },
    changeXMin(){
      var txmin = Number(this.tmp_x_min);
      if(this.x_min != txmin){
        if(txmin<this.getXMin())                      this.x_min = this.getXMin();
        else if (txmin>this.x_max-1)                  this.x_min = this.x_max-1;
        else if (txmin>this.getXMax()-1)              this.x_min = this.getXMax()-1;
        else                                          this.x_min = txmin;
        this.updateJsonData();
        this.option=this.getOption();
      }
    },
    changeXMax(){
      var txmax = Number(this.tmp_x_max);
      if(this.x_max != txmax){
        if(txmax<this.getXMin()+1)                    this.x_max = this.getXMin()+1;
        else if (txmax<Number(this.x_min)+1)          this.x_max = Number(this.x_min) +1;
        else if (txmax>this.getXMax())                this.x_max = this.getXMax();
        else                                          this.x_max = txmax;
        console.log(this.x_max);
        this.updateJsonData();
        this.option=this.getOption();
      }
    },
    changeYMin(){
      var tymin = Number(this.tmp_y_min);
      if(this.y_min != tymin){
        if(tymin<this.getYMin())                      this.y_min = this.getYMin();
        else if (tymin>this.y_max-1)                  this.y_min = this.y_max-1;
        else if (tymin>this.getYMax()-1)              this.y_min = this.getYMax()-1;
        else                                          this.y_min = tymin;
        console.log(this.y_min);
        this.updateJsonData();
        this.option=this.getOption();
      }
    },
    changeYMax(){
      var tymax = Number(this.tmp_y_max);
      if(this.y_max != tymax) {
        if(tymax<this.getYMin()+1)                    this.y_max = this.getYMin()+1;
        else if (tymax<Number(this.y_min)+1)          this.y_max = Number(this.y_min) +1;
        else if (tymax>this.getYMax())                this.y_max = this.getYMax();
        else                                          this.y_max = tymax;
        console.log(this.y_max);
        this.updateJsonData();
        this.option=this.getOption();
      }
    },
    changeZMin(){
      var tzmin = Number(this.tmp_z_min);
      if(this.z_min != tzmin){
        if(tzmin<this.getZMin())                      this.z_min = this.getZMin();
        else if (tzmin>this.z_max-1)                  this.z_min = this.z_max-1;
        else if (tzmin>this.getZMax()-1)              this.z_min = this.getZMax()-1;
        else                                          this.z_min = tzmin;
        this.updateJsonData();
        this.option=this.getOption();
      }
    },
    changeZMax(){
      var tzmax = Number(this.tmp_z_max);
      if(this.z_max != tzmax){
        if(tzmax<this.getZMin()+1)                    this.z_max = this.getZMin()+1;
        else if (tzmax<Number(this.z_min)+1)          this.z_max = Number(this.z_min) +1;
        else if (tzmax>this.getZMax())                this.z_max = this.getZMax();
        else                                          this.z_max = tzmax;
        this.updateJsonData();
        this.option=this.getOption();
      }
    },
    //-------------configure ROI end -------------------//
    //-------------configure display_setting begin -------------------//
    update_coord() {
      if( this.adjusted_posture ){
          this.coord_tag = "adjusted";
          this.update_basic();
      } else {
          this.coord_tag = "raw";
          this.update_basic();
      }
    },
    refresh(){
      this.option=this.getOption();
    },
    //-------------configure display_setting end-------------------//
    getLoadingOption(bk_color,ft_color){
        var curr_title = 'Loading data now ...';
        if( this.curr_rs == null ) {
          curr_title = 'Please select a type ...';
        }
        return {
          backgroundColor:bk_color,
           title :{
            text : curr_title,
            left: "center",
            top: "center",
            textStyle: {
               color: ft_color
            },
          }
        };
    },
    getMeshSerie(){
        if( this.mesh_json != null ){
          console.log('draw mesh');
          var legend_list = [];
          var series_list = [];
          for(var i = 0; i<this.mesh_conf.names.length; i++){
            var curr_name = this.mesh_conf.names[i];
            var curr_legend_name = this.mesh_conf.legends[i];
            var curr_color = this.mesh_conf.colors[i];
            var curr_opacity = this.mesh_conf.opacity[i];
            if ( this.mesh_json[curr_name]['xyz'].length == 0 ) 
                continue;
            //console.log('curr_legend_name');
            legend_list.push(curr_legend_name);
            var one_series = {
                name : curr_legend_name,
                type : 'surface',
                data: this.mesh_json[curr_name]['xyz'],
                isMesh :true,
                dataShape:[2,3],
                indices : this.mesh_json[curr_name]['ijk'],
                color: curr_color,
                borderWidth :1,
                opacity:curr_opacity,
            };
            series_list.push(one_series);
          }
          var ret = {
              series_list: series_list,
              legend_list : legend_list,
          };
          return ret ;
        } else {
          return null;
        }
    },
    getScatterSeries(){
        if(this.jsondata == null)
            return null;
        var curr_draw_datas = this.jsondata;
        console.log('knowing json loaded');
        var series_list = [];
        var legend_list = [];
        var legend_show = {};
        var curr_color ;
        console.log('start series');
        for( var i = 0 ; i<this.all_clusters; i++ )
        {
          var curr_legend_name = celltype_legend[this.curr_rs].Legends[i];
          if(this.final_clusters[i] == 0){
            legend_show[curr_legend_name] = false;
          } else {
            legend_show[curr_legend_name] = true;
          }
          legend_list.push(curr_legend_name);
          //curr_color = COLOR_ALL[i];
          curr_color = this.COLOR_ALL2[i];
          var the_data = curr_draw_datas[i];
          var one_series = {
              name : legend_list[i],
              type : 'scatter3D',
              dimensions: [ 'x','y','z' ],
              data: the_data,
              symbol:'circle',
              symbolSize: this.symbolSize,
              itemStyle: {
                //borderColor: curr_color,
                borderWidth: 0,
                color: curr_color,
                opacity: this.symbolAlpha,
              },
          };
          series_list.push(one_series);
        } // end of for final_clusters.length
        var ret = {
            series_list : series_list,
            legend_list : legend_list,
            legend_show : legend_show,
        };
        return ret;
    },
    getBoxSeries(used_xmin,used_ymin,used_zmin,used_xmax,used_ymax,used_zmax){
        if ( this.draw_box == true) {
            var box_series = {
                type: 'line3D',
                lineStyle: {
                    width: 3,
                    color: '#aaaaaa',
                },
                data: [
                    [used_xmin, used_ymin, used_zmin],
                    [used_xmax, used_ymin, used_zmin],
                    [used_xmax, used_ymax, used_zmin],
                    [used_xmin, used_ymax, used_zmin],
                    [used_xmin, used_ymin, used_zmin], // rect01
                    [used_xmin, used_ymin, used_zmax],
                    [used_xmax, used_ymin, used_zmax],
                    [used_xmax, used_ymin, used_zmin],
                    [used_xmin, used_ymin, used_zmin], // rect02
                    [used_xmax, used_ymin, used_zmin],
                    [used_xmax, used_ymax, used_zmin],
                    [used_xmax, used_ymax, used_zmax], 
                    [used_xmax, used_ymin, used_zmax],// rect 03
                    [used_xmin, used_ymin, used_zmax],
                    [used_xmin, used_ymax, used_zmax],
                    [used_xmax, used_ymax, used_zmax],// rect 04
                    [used_xmax, used_ymax, used_zmin],
                    [used_xmin, used_ymax, used_zmin],
                    [used_xmin, used_ymax, used_zmax],
                ]
            };
            return box_series;
        } else {
            return null;
        }
    },
    getOption(){
      // set colors 
      var bk_color = '#000000';
      var ft_color = '#cccccc';
      if ( this.black_background == false ) {
        bk_color = '#FFFFFF';
        ft_color = '#333333';
      }
      var mesh_serie = null;
      var scatter_series = null ;
      mesh_serie = this.getMeshSerie();
      scatter_series = this.getScatterSeries();
      // Draw loading if necessary
      if ( mesh_serie == null && scatter_series ==null ) {
          return this.getLoadingOption(bk_color,ft_color);
      }
      else {
        // Draw mesh
        var series_list = [];
        var legend_list = [];
        var legend_show = {};
        //Draw scatters
        var tips = '';
        if(scatter_series != null){
             for(var i = 0; i< scatter_series.series_list.length; i++){
                 series_list.append(scatter_series.series_list[i])
             }
             legend_list = series_list.legend_list;
             for(var i = 0; i< scatter_series.legend_list.length; i++){
                 legend_list.push(scatter_series.legend_list[i]);
             }
             legend_show = series_list.legend_show;
        } else {
             tips = 'Model done, still loading scatters ...';
        }
        console.log('end series');
        // set 3D space 
        var used_xmin = this.getXMin();
        var used_xmax = this.getXMax();
        var used_ymin = this.getYMin();
        var used_ymax = this.getYMax();
        var used_zmin = this.getZMin();
        var used_zmax = this.getZMax();
        var boxWidth  = this.getWidth();
        var boxHeight = this.getDepth()*this.z_scale;
        var boxDepth  = this.getHeight();
        
        var box_series = this.getBoxSeries(used_xmin,
                                      used_ymin,
                                      used_zmin,
                                      used_xmax,
                                      used_ymax,
                                      used_zmax);
        if(box_series!= null){
            series_list.push(box_series)
        }
        if(mesh_serie != null){
            for(var i = 0;i< mesh_serie.series_list.length; i++){
                series_list.push(mesh_serie.series_list[i]);
            }
            for(var i = 0;i< mesh_serie.legend_list.length; i++){
                legend_list.push(mesh_serie.legend_list[i]);
            }
        }
        //if( max10 == true ){
        //  used_xmin = -10; used_xmax = 10; 
        //  used_ymin = -10; used_ymax = 10; 
        //  used_zmin = -10; used_zmax = 10; 
        //  boxWidth = 60; boxHeight = 60; boxDepth = 60;
        //}
        var opt={
          backgroundColor:bk_color,
          title :{
            text : tips,
            left: "center",
            top : "bottom",
            textStyle: {
               color: ft_color
            },
          },
          legend :{
            show: this.draw_legends,
            data:legend_list,
            selected: legend_show,
            textStyle: {
              color:ft_color,
            }
          },
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {},
            }
          },
          tooltip: {},
          xAxis3D: {
            name: 'x',
            scale:1,
            type: 'value',
            min: used_xmin,
            max: used_xmax,
          },
          yAxis3D: {
            name: 'y',
            scale:1,
            type: 'value',
            min: used_ymin,
            max: used_ymax,
          },
          zAxis3D: {
            name: 'z',
            scale:1,
            type: 'value',
            min: used_zmin,
            max: used_zmax,
          },
          grid3D: {
            show: this.draw_grids,
            boxWidth: boxWidth,
            boxHeight: boxHeight ,
            boxDepth: boxDepth , 
            light: {
              main: {
                 shadow: false,
                 intensity: 3,
                 quality: 'high'
              },
              ambientCubemap: {
                 exposure: 0,
                 diffuseIntensity: 10
              },
            },
            axisLine: {
              lineStyle: {
                color:ft_color,
              }
            },
            axisPointer: {
              lineStyle: {
                color: ft_color
              }
            },
          viewControl: {
              // autoRotate: true,
              //projection: 'orthographic'
              projection: 'perspective'
            }
          },
          series: series_list
        }; // end of var opt
        console.log('reset option');
        return opt;
      } // end of else.
    } // end of function option.
  },
  mounted() {
    window.addEventListener("resize", this.resize_option,true);
    //this.OnChangeSample();
  },
};
</script>

<style>
.floatsetting{
    position: fixed;
    z-index: 999;
    left: 0;
    top: 70;
}
.dhr{
    border:1px dashed #ccc;
}
.inline_item {
  display: inline-block;
  margin-left: 20px;
  vertical-align: middle;
}
.chart {
  height: 800px;
}
</style>
