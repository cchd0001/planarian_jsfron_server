<template>
<div>
    <div  style="height=1px;">
      <el-dialog title="Custom CellTypes Panel" style="width:800px;" :visible.sync="drawer" direction="ltr" :before-close="OnDrawerClose">
          <div>
              <div v-draggable style='width:220px;height:400px;z-index:999;position:absolute;background:white;' v-if="isShowColorPalette">
                <sketch-picker align='center' v-model="color" @input="colorValueChange"></sketch-picker>
                <el-button align='right' style='width:50%;' @click='applyColor'>ChangeColor</el-button>
                <el-button align='right' style='width:50%;' @click='closeColor'>Close</el-button>
              </div>
              <!-- 1. cell table content -->
              <el-table class="table" ref="clusterTable" style="width:100%;" :show-header='false'
                :height='height' :row-key="getRowKey" :highlight-current-row='true'
                :data="tableDataClusters.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                @selection-change="handleSelectionChange" @row-click="getRowCelltype">
                  <el-table-column :reserve-selection="true" type="selection" ></el-table-column>
                  <el-table-column property="Celltype" label="Cell Type" > </el-table-column>
                  <el-table-column label="Display" >
                    <el-button @click="showColorPalette">color palette</el-button>
                    <!-- <template slot-scope="scope"> -->
                      <!-- <el-button size="mini" type="primary" plain @click ="changeColor">color</el-button> -->
                    <!-- </template> -->
                  </el-table-column>
              </el-table>
              <el-pagination layout="total,sizes, prev, jumper, next" 
                :total="this.tableDataClusters.length" :current-page="currentPage" 
                @current-change="handleCurrentChange" @size-change="handleSizeChange" 
                :page-sizes="[10,20]" :page-size="pageSize" :current-page.sync="currentPage">
              </el-pagination>
              <!-- 1. cell table content end-->
              <div>
                <el-button @click="applyStatus">Highlight selected </el-button>
                <el-button @click='clearSelect'>Clear selected</el-button>
                <hr>
              </div> <!-- end of buttons -->
              <div>
                <el-button class='inline_item' @click='resetSelect'>Reset all</el-button>
                <el-button class='inline_item' @click.native='closeCTC'>Close Panel</el-button>
                <hr>
              </div> <!-- end of top N buttons -->
          </div> <!-- end of top N buttons -->
      </el-dialog>
      <!-- start of color palette -->
      <!-- end of color palette -->
    </div>
    <el-row>
      <el-button  class="floatsetting" v-show="!display_setting" type="primary" icon="el-icon-setting"  @click="span_setting" >{{setting_title}}</el-button>
      <!-- ----------The setting grid begin --------------------------------------------------------------- -->
      <el-col :span="setting_w" style="height:100%">
          <div class="grid-content bg-purple">
              <el-button  type="primary" icon="el-icon-setting" width='100%' @click="span_setting" >{{setting_title}}</el-button>
              <!-- ----------The setting panel begin --------------------------------------------------------------- -->
              <transition name="el-zoom-in-center"  >
                <div v-show="display_setting" class="transition-box" align='center' style="margin:3px; border: 3px solid #ffffff;"> 
                     <div align="center"  style="margin:3px;  border: 3px solid #ccc;" > 
                         <!-- ----------Choose mode begin --------------------------------------------------------------- -->
                         <el-row style="margin-top:3px;margin-bottom:2px">
                             <el-col :span="8" >
                                <span  class='mspan'>Mode:</span>
                             </el-col>
                             <el-col :span="16" >
                                 <el-select  v-model="curr_mode" placeholder="curr_mode" @change="OnChangeMode">
                                   <el-option
                                     v-for="item in all_modes"
                                     :key="item"
                                     :label="item"
                                     :value="item">
                                   </el-option>
                                 </el-select>
                             </el-col>
                         </el-row>
                         <el-row style="margin-top:3px;margin-bottom:2px">
                             <el-col :span="8" >
                                <span  class='mspan'>Data:</span>
                             </el-col>
                             <el-col :span="16" >
                                 <el-select v-model="curr_sample" placeholder="curr_sample" @change="OnChangeSample">
                                   <el-option
                                     v-for="item in all_sample"
                                     :key="item"
                                     :label="item"
                                     :value="item">
                                   </el-option>
                                 </el-select>
                             </el-col>
                         </el-row>
                         <!-- ----------Choose mode end --------------------------------------------------------------- -->
                     </div>
                     <!-- ----------The Baisc settings end -------------------------------------------------------------- -->
                  <el-collapse v-model='collapseName'>
                     <!-- ----------The Baisc settings begin --------------------------------------------------------------- -->
                      <el-collapse-item :title="mode_title" name="1" >
                      <!-- ----------mode setting begin --------------------------------------------------------------- -->
                         <!-- ----------cell type mode begin--------------------------------------------------------------- -->
                         <div  align="center"  v-show="is_ct_mode" style="margin:3px;   border: 3px solid #ccc;">
                            <el-row style="margin-top:3px;margin-bottom:2px">
                                <el-col :span="8" >
                                   <span  class='mspan'>Annotation:</span>
                                </el-col>
                                <el-col :span="16" >
                                    <el-select  v-model="curr_anno" placeholder="curr_anno" @change="OnChangeAnno">
                                      <el-option
                                        v-for="item in anno_array"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                      </el-option>
                                    </el-select>
                                </el-col>
                            </el-row>
                            <el-row style="margin-top:3px;margin-bottom:2px">
                                <el-col :span="8" >
                                   <span  class='mspan'>Corrdinate:</span>
                                </el-col>
                                <el-col :span="16" >
                                    <el-select  v-model="curr_coord" placeholder="curr_coord" @change="OnChangeCoord">
                                      <el-option
                                        v-for="item in coord_array"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                      </el-option>
                                    </el-select>
                                </el-col>
                            </el-row>
                            <!-- ----------cell type selection table begin --------------------------------------------------------------- -->
                            <el-row style="margin-top:3px;margin-bottom:2px">
                                <el-col :span="23" >
                                  <el-button type='primary' @click.native="openCTC" >Custom CellTypes</el-button>
                                </el-col>
                            </el-row>
                            <!-- ----------cell type selection table end--------------------------------------------------------------- -->
                         </div>
                         <!-- ----------cell type mode end--------------------------------------------------------------- -->
                         <div  align="center"  v-show="is_ge_mode" style="margin:3px;   border: 1px solid #ccc;">
                            <h3>Gene Expression mode conf:</h3>
                            <hr class="dhr">
                         </div>
                         <div  align="center"  v-show="is_gc_mode" style="margin:3px;   border: 1px solid #ccc;">
                            <h3>Gene Colocalization mode conf:</h3>
                            <hr class="dhr">
                         </div>
                      <!-- ----------mode setting end --------------------------------------------------------------- -->
                      </el-collapse-item>
                      <el-collapse-item title="ROI details:" name="2">
                         <!-- ----------roi setting begin --------------------------------------------------------------- -->
                          <div align="center"   style="margin:3px;  border: 3px solid #ccc;">
                              <el-row style="margin-top:3px;margin-bottom:2px">
                                  <el-col :span="6" >
                                     <span  class='mspan'>Z scale:</span>
                                  </el-col>
                                  <el-col :span="8" >
                                      <el-input v-model="tmp_z_scale" placeholder="1"></el-input>
                                  </el-col>
                                  <el-col :span="10" >
                                      <el-button type="success" @click.native="changeZScale">Apply</el-button>
                                  </el-col>
                              </el-row>
                              <hr class="dhr">
                              <el-row style="margin-top:3px;margin-bottom:2px">
                                  <el-col :span="6" >
                                     <span  class='mspan'>X min:</span>
                                  </el-col>
                                  <el-col :span="8" >
                                      <el-input v-model="tmp_x_min" placeholder="0"></el-input>
                                  </el-col>
                                  <el-col :span="10" >
                                      <el-button type="success" @click.native="changeXMin">Apply</el-button>
                                  </el-col>
                              </el-row>
                              <el-row style="margin-top:3px;margin-bottom:2px">
                                  <el-col :span="6" >
                                     <span  class='mspan'>X max:</span>
                                  </el-col>
                                  <el-col :span="8" >
                                      <el-input v-model="tmp_x_max" placeholder="0"></el-input>
                                  </el-col>
                                  <el-col :span="10" >
                                      <el-button type="success" @click.native="changeXMax">Apply</el-button>
                                  </el-col>
                              </el-row>
                              <el-row style="margin-top:3px;margin-bottom:2px">
                                  <el-col :span="6" >
                                     <span  class='mspan'>Y min:</span>
                                  </el-col>
                                  <el-col :span="8" >
                                      <el-input v-model="tmp_y_min" placeholder="0"></el-input>
                                  </el-col>
                                  <el-col :span="10" >
                                      <el-button type="success" @click.native="changeYMin">Apply</el-button>
                                  </el-col>
                              </el-row>
                              <el-row style="margin-top:3px;margin-bottom:2px">
                                  <el-col :span="6" >
                                     <span  class='mspan'>Y max:</span>
                                  </el-col>
                                  <el-col :span="8" >
                                      <el-input v-model="tmp_y_max" placeholder="0"></el-input>
                                  </el-col>
                                  <el-col :span="10" >
                                      <el-button type="success" @click.native="changeYMax">Apply</el-button>
                                  </el-col>
                              </el-row>
                              <el-row style="margin-top:3px;margin-bottom:2px">
                                  <el-col :span="6" >
                                     <span  class='mspan'>Z min:</span>
                                  </el-col>
                                  <el-col :span="8" >
                                      <el-input v-model="tmp_z_min" placeholder="0"></el-input>
                                  </el-col>
                                  <el-col :span="10" >
                                      <el-button type="success" @click.native="changeZMin">Apply</el-button>
                                  </el-col>
                              </el-row>
                              <el-row style="margin-top:3px;margin-bottom:2px">
                                  <el-col :span="6" >
                                     <span  class='mspan'>Z max:</span>
                                  </el-col>
                                  <el-col :span="8" >
                                      <el-input v-model="tmp_z_max" placeholder="0"></el-input>
                                  </el-col>
                                  <el-col :span="10" >
                                      <el-button type="success" @click.native="changeZMax">Apply</el-button>
                                  </el-col>
                              </el-row>
                          </div>
                         <!-- ----------roi setting end--------------------------------------------------------------- -->
                      </el-collapse-item>
                      <el-collapse-item title="Display details:" name="3">
                          <!-- ----------display setting begin --------------------------------------------------------------- -->
                          <div  align="center"  style="margin:3px;  border: 3px solid #ccc;">
                              <!-- switch background start -->
                              <el-row style="margin:3px;">
                                  <el-switch  active-text="Black theme" inactive-text="White theme"
                                    v-model="black_background" @change="refresh" >
                                  </el-switch>
                              </el-row>
                              <!-- switch background end -->
                              <!-- Draw legend start -->
                              <el-row style="margin:3px;">
                                  <el-switch  active-text="Draw legends" inactive-text="Ignore legends"
                                    v-model="draw_legends" @change="refresh" >
                                  </el-switch>
                              </el-row>
                              <!-- Draw grid start -->
                              <el-row style="margin:3px;">
                                 <el-switch  active-text="Draw grids" inactive-text="Ignore grids"
                                   v-model="draw_grids" @change="refresh" >
                                 </el-switch>
                              </el-row>
                              <!-- Draw grid end -->
                              <!-- Draw box start -->
                              <el-row style="margin:3px;">
                                  <el-switch  align='center' active-text="Draw box" inactive-text="Ignore box"
                                    v-model="draw_box" @change="refresh" >
                                  </el-switch>
                              </el-row>
                              <!-- Draw box end -->
                              <!-- switch symbol size start-->
                              <el-row style="margin:3px;" >
                                  <el-col :span="8" >
                                     <span  class='mspan'>SymbolSize</span>
                                  </el-col>
                                  <el-col :span="16" >
                                      <el-slider  v-model="symbolSize"
                                         :step="1" :min="1" :max="5" @change="refresh" show-stops>
                                      </el-slider>
                                  </el-col>
                              </el-row>
                              <el-row style="margin:3px;">
                                  <el-col :span="8" >
                                     <span  class='mspan'>SymbolAlpha</span>
                                  </el-col>
                                  <el-col :span="16" >
                                      <el-slider  v-model="symbolAlpha"
                                        :step="0.1" :min="0.0" :max="1" @change="refresh" show-stops>
                                      </el-slider>
                                  </el-col>
                              </el-row>
                              <!-- switch symbol size end -->
                          </div>
                          <!-- ----------display setting end--------------------------------------------------------------- -->
                      </el-collapse-item>
                  </el-collapse>
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
          <v-chart v-show="model_only" class="chart" resizeable=true :width="chartWidth"  ref="myecharts_model" :option="option_mo" style="height:800px;" />
          <v-chart v-show="data_valid" class="chart" resizeable=true :width="chartWidth"  ref="myecharts" :option="option" style="height:800px;" />
        </div>
        <!-- end of the main window -->
      </el-col>
      <!-- ----------The 3D display grid end --------------------------------------------------------------- -->
    </el-row>
</div>
</template>

<script>
//import packages ------------------------------------
import $ from 'jquery';
import * as echarts from 'echarts';
import 'echarts-gl';
import VChart, { THEME_KEY } from "vue-echarts";
import { Draggable } from 'draggable-vue-directive';
import vdr from 'vue-draggable-resizable-gorkys'
import { Sketch } from 'vue-color'
// the dateset url -----------------------------------
var CT_URL = "http://49.235.68.146/celltype/"
var CTU_URL = "http://49.235.68.146/celltype_umap/"
var CP_URL = "http://49.235.68.146/cell_center/"
// axis limitation conf --------------------------------
var idvd_conf_corrected = require('../confs/individual_corrected.js');
var idvd_conf_rotate = require('../confs/individual_rotated.js');
// cell type details conf --------------------------------
var CT_CONFS = require('../confs/individual_conf.js')
// cell type legend and the color conf --------------------------------
var COLOR_ALL = require('../confs/discret_color.js');
var celltype_legend = require('../confs/CellType.js');
var COLOR_default = COLOR_ALL.default_colors;
var COLOR_9 = COLOR_ALL.color_9;

export default {
components: {
  VChart,
  vdr,
  'sketch-picker': Sketch
},
directives: {
  Draggable,
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
      symbolSize:1,
      symbolAlpha:1.0,
      // drawing details conf end----------
      // echarts option begin -------------
      chartWidth:'100%',
      model_only:true,
      data_valid:false,
      option_mo: {
        backgroundColor:'#000000',
        title : {
            text : 'Loading data now ...',
            left: "center",
            top: "center",
            textStyle: {
               color: '#cccccc'
            },
        }
      },
      option: {
        backgroundColor:'#000000',
        title : {
            text : 'Loading data now ...',
            left: "center",
            top: "center",
            textStyle: {
               color: '#cccccc'
            },
        }
      },
      // main 3D data begin------------------------------------
      rawdata:null,
      jsondata : null,
      // main 3D data end--------------------------------------
      //------------data selection for cell type begin ------
      // curr selection
      curr_name : null,
      curr_rs : null,
      final_clusters: [],
      tmp_cluster_num: 0,
      all_clusters: 0,
      saved_clusters:[], // the selection cache
      selected_rs_index:"0",
      coord_array : CT_CONFS.label_WT.pos,
      anno_array : CT_CONFS.label_WT.anno,
      curr_anno : null,
      curr_coord : null,
      //------------data selection for cell type end ------
      //------------cell type selection begin ------
      isCTCHidden:true,
      tableDataClusters: [],
      height:'250px',
      pageSize:5,
      currentPage:1,
      min_cluster_number: 0,
      max_cluster_number: 100,
      drawer:false,
      //------------cell type selection end------
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
           this.$refs.myecharts_model.resize();
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

    //----------- color palette start -------------//
    showColorPalette(){
      if (this.isShowColorPalette){
        this.isShowColorPalette = false;
      }else{
        this.isShowColorPalette = true;
      }
    },
    colorValueChange (val) {
     this.color = val.hex;
     },
    applyColor(){
      // change color when click row
      // only apply changes when click button
      this.current_color_all[this.currentCellID] = this.color;
      this.option=this.getOption()  ;
    },
    closeColor(){
      this.isShowColorPalette = false;
    },
    //-------------color palette ends------------------//
    // ------------------ functions for cell type table begin -----------------
    OnDrawerClose(done){
        this.drawer= false;
        done();
    },
    openCTC(){
        this.isCTCHidden = !this.isCTCHidden;
        this.drawer = !this.drawer;
        console.log(this.drawer);
    },
    getRowCelltype(row){
      // 1. get row id when click on row (except for selection box)
      this.currentCellID = row.ID;
      console.log('getrow '+this.currentCellID);
      return row.ID;
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
    TopN(){
      var topn = 1;
      if(this.tmp_cluster_num < 1){
        topn  = 1;
      } else if( this.tmp_cluster_num > this.all_clusters) {
        topn  =  this.all_clusters;
      } else {
        topn = this.tmp_cluster_num;
      }
      this.final_clusters=new Array(this.all_clusters).fill(0);
      for(var i = 0; i<topn; i++){
          this.final_clusters[i] = 1;
      }
      this.option=this.getOption();
      this.isShowColorPalette = false;
    },
    resetSelect(){
      if (this.curr_rs == "SA_anno"){
          this.COLOR_ALL2=require('../confs/discret_color.js').color_9;
      }
      else {
          this.COLOR_ALL2=require('../confs/discret_color.js').default_colors;
      }
      this.final_clusters=new Array(this.all_clusters).fill(1);
      this.option=this.getOption();
    },
    clearSelect () {
      this.currentCellID = '';
      this.$refs.clusterTable.clearSelection();
    },
    applyStatus(){
      var self = this;
      this.final_clusters=this.saved_clusters;
      this.update_option();
      this.isShowColorPalette = false;
    },
    handleSelectionChange(val) {
      // change color when check box
      // 2. get row id when use click selection box
      if (val.length > 0){
        this.currentCellID = val[val.length -1].ID;
      }
      // save cluster highlight status in an array
      var tmp_clusters= new Array(this.all_clusters).fill(0);
      for( var i = 0 ; i < val.length ; i++) {
          tmp_clusters[val[i].ID]=1;
      }
      this.saved_clusters=tmp_clusters;
    },
    // ------------------ functions for cell type table end -----------------

    // ------------------ functions for update echarts begin -----------------
    update_option(){
        if( this.data_valid == true)
            this.option = this.getOption();
        else
            this.option_mo = this.getOption();
        this.resize_option();
    },
    update_option_deep(){
        if( this.data_valid == true)
            this.option = this.getOption();
        else
            this.option_mo = this.getOption();
        if( this.data_valid ){
            this.$refs.myecharts.clear();
            this.$refs.myecharts.setOption(this.getOption(),true,false);
        }else {
            this.$refs.myecharts_model.clear();
            this.$refs.myecharts_model.setOption(this.getOption(),true,false);
        }
        this.resize_option();
    },
    // ------------------ functions for update echarts end -----------------
    // ------------------ basic conf functions begin----------------------
    OnChangeMode(){
        this.mode_title = this.curr_mode+" setting";
        console.log(this.curr_mode)
        if( this.curr_mode == "CellTypes") {
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
    setCoordTag(){
        if(this.curr_coord == "Raw posture" || this.curr_coord == "Adjusted posture" ) {
            if (this.curr_coord == "Raw posture"){
                this.coord_tag = "raw";
            } else {
                this.coord_tag = "adjusted";
            }
        }
    },
    resetSampleConf(){
        this.resetCellTypeSampleConf();
        this.setCoordTag();
    },

    OnChangeSample(){
        this.curr_name = this.curr_sample;
        this.resetSampleConf();
        //deep clean buffer
        this.cleanMesh();
        this.cleanBuffer();
        this.update_option_deep();
        // reset mesh and ROI data
        this.resetROIdata();
        this.resetMesh();
        if(this.curr_mode == "CellTypes"){
            this.resetAnno();
        }
    },
    // ------------------ basic conf functions end----------------------
    // --------------cell type detail confs begin ----------------------------
    resetCellTypeSampleConf(){
        this.anno_array = CT_CONFS["label_"+this.curr_sample].anno;
        this.coord_array = CT_CONFS["label_"+this.curr_sample].pos;
        this.curr_anno = this.anno_array[0];
        this.curr_coord = this.coord_array[0];
    },
    OnChangeAnno(){
        this.cleanBuffer();
        this.resetAnno();
        this.update_option_deep();
    },
    OnChangeCoord(){
        //deep clean buffer
        this.cleanMesh();
        this.cleanBuffer();
        this.update_option_deep();
        // reset mesh and ROI data
        this.setCoordTag();
        this.resetROIdata();
        this.resetMesh();
        if(this.curr_mode == "CellTypes"){
            this.resetAnno();
        }
    },
    // --------------cell type detail confs end ----------------------------
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
    cleanMesh(){
      this.mesh_json = null;
    },
    resetMesh(){
      this.cleanMesh();
      // loading new mesh
      var self = this;
      var used_url = '';
      if( this.coord_tag == "raw" ) {
        used_url = CP_URL+"/"+this.curr_name+"_mesh.rotate.json";
      } else {
        used_url = CP_URL+"/"+this.curr_name+"_mesh.apdv.json";
      }
      console.log(used_url);
      $.getJSON(used_url,function(_data) {
        console.log("mesh loaded");
        self.setMeshData(_data);
        self.update_option_deep();
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
        if(_data.length>3){
            this.mesh_json['Pharynx'] = {}
            this.mesh_json['Pharynx']['xyz'] = _data[3][0];
            this.mesh_json['Pharynx']['ijk'] = _data[3][1];
        }
    },
    //-------------mesh managerment end -------------------//
    //-------------data managerment start -------------------//
    cleanBuffer(){
      this.jsondata = null ;
      this.rawdata = null;
    },
    
    resetAnno(){
      var used_url="";
      if(this.curr_anno == "Single Cell WT lineage" ){
          this.curr_rs = "SA_anno";
      } else if ( this.curr_anno == "Single Cell WT cluster"){
          this.curr_rs = "SA_cluster";
      } else if ( this.curr_anno == "Single Cell lineage"){
          this.curr_rs = "major_anno";
      } else if ( this.curr_anno == "Single Cell cluster"){
          this.curr_rs = "major_celltype";
      } else if ( this.curr_anno == "Single Cell sub cluster"){
          this.curr_rs = "sc_subcluster";
      } else if ( this.curr_anno == "SPC lineage"){
          this.curr_rs = "nc_cluster36";
      }
      if(this.curr_coord == "Raw posture" || this.curr_coord == "Adjusted posture" ) {
          used_url = CT_URL+"/"+this.curr_name+"/"+this.curr_rs+"."+this.coord_tag+".json";
      } else {

      }
      var data_tag = this.curr_rs;
      var self = this;
      $.getJSON(used_url,function(_data) {
        console.log("loaded");
        self.setAnnoData(_data,data_tag);
        self.update_option_deep();
      });
    },
    setAnnoData(_data,data_tag){
      console.log('json loaded');
      var curr_draw_datas= [];
      var total_cluster_number = celltype_legend[data_tag].LegendsNum;
      this.final_clusters = new Array(total_cluster_number).fill(0);
      this.all_clusters = total_cluster_number;
      // ---------- iterate through clusters setting (short)
      for(var i = 0; i<=total_cluster_number; i++ ){
          curr_draw_datas.push([]);
      }
      // --------- iterate through real data (long)
      for(var j=0 ; j< _data.length; j++){
        var curr_item = _data[j];
        //console.log(curr_item);
        curr_draw_datas[parseInt(curr_item[3])].push([curr_item[0],curr_item[1],curr_item[2]]);
      } // end of for _data
      // -------- mark empty group
      for (var i = 0; i < total_cluster_number; i++){
        if (curr_draw_datas[i].length == 0) {
          this.final_clusters[i] = 0;
        }else{
          this.final_clusters[i] = 1;
        }
      }
      var new_tableDataClusters = [];
      for (var i=0; i < this.all_clusters; i++){
          new_tableDataClusters.push({ID: i, Celltype:celltype_legend[data_tag].Legends[i] });
      }
      this.tableDataClusters = new_tableDataClusters;
      //console.log(this.tableDataClusters);
      this.rawdata = curr_draw_datas;
      this.jsondata = curr_draw_datas;
    },
    //-------------configure ROI start -------------------//
    changeZScale(){
      this.z_scale = this.tmp_z_scale;
      this.update_option();
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
      this.update_option();
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
        this.update_option();
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
        this.update_option();
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
        this.update_option();
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
        this.update_option();
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
        this.update_option()
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
        this.update_option();
      }
    },
    //-------------configure ROI end -------------------//
    //-------------configure display_setting begin -------------------//
    refresh(){
      this.update_option();
    },
    //-------------configure display_setting end-------------------//
    getLoadingOption(bk_color,ft_color){
        var curr_title = 'Loading data now ...';
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
          var legend_show = {};
          for(var i = 0; i<this.mesh_conf.names.length; i++){
            var curr_name = this.mesh_conf.names[i];
            var curr_legend_name = this.mesh_conf.legends[i];
            var curr_color = this.mesh_conf.colors[i];
            var curr_opacity = this.mesh_conf.opacity[i];
            if ( this.mesh_json[curr_name]['xyz'].length == 0 ) 
                continue;
            //console.log('curr_legend_name');
            legend_list.push(curr_legend_name);
            if ( i == 0 ){
                legend_show[curr_legend_name]=false;
            }else {
                legend_show[curr_legend_name]=true;
            }
            var one_series = {
                name : curr_legend_name,
                type : 'surface',
                data: this.mesh_json[curr_name]['xyz'],
                isMesh :true,
                //zlevel: -10,
                shading:'lambert',
                dataShape:[2,3],
                indices : this.mesh_json[curr_name]['ijk'],
                color: curr_color,
                borderWidth :1,
                opacity:curr_opacity,
                silent:true,
            };
            series_list.push(one_series);
          }
          var ret = {
              series_list: series_list,
              legend_list : legend_list,
              legend_show:legend_show,
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
          var the_data = curr_draw_datas[i];
          if(this.final_clusters[i] == 0 || the_data.length==0){
            legend_show[curr_legend_name] = false;
          } else {
            legend_show[curr_legend_name] = true;
          }
          legend_list.push(curr_legend_name);
          //curr_color = COLOR_ALL[i];
          curr_color = this.COLOR_ALL2[i];
          var one_series = {
              name : legend_list[i],
              type : 'scatter3D',
              data: the_data,
              symbol:'circle',
              //zlevel: -20,
              symbolSize: this.symbolSize,
              itemStyle: {
                //borderColor: curr_color,
                borderWidth: 0,
                color: curr_color,
                opacity: this.symbolAlpha,
              },
              //blendMode:'lighter',
              silent : true,
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
          this.data_valid = false;
          this.model_only = true;
          return this.getLoadingOption(bk_color,ft_color);
      }
      else {
        var series_list = [];
        var legend_list = [];
        var legend_show = {};
        //Draw scatters
        var tips = '';
        if( scatter_series != null ){
             for(var i = 0; i < scatter_series.series_list.length; i++){
                 series_list.push(scatter_series.series_list[i])
             }
             for(var i = 0; i < scatter_series.legend_list.length; i++){
                 legend_list.push(scatter_series.legend_list[i]);
             }
             legend_show = scatter_series.legend_show;
             this.data_valid = true;
             this.model_only = false;
        } else {
             this.data_valid = false;
             this.model_only = true;
             tips = 'Model done, still loading scatters ...';
        }
        console.log('end series');
        // Draw mesh
        if(mesh_serie != null){
            for(var i = 0;i< mesh_serie.series_list.length; i++){
                series_list.push(mesh_serie.series_list[i]);
            }
            for(var i = 0;i< mesh_serie.legend_list.length; i++){
                legend_list.push(mesh_serie.legend_list[i]);
                legend_show[mesh_serie.legend_list[i]] = mesh_serie.legend_show[mesh_serie.legend_list[i]];
            }
        }
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
            name: 'AP',
            scale:1,
            type: 'value',
            min: used_xmin,
            max: used_xmax,
          },
          yAxis3D: {
            name: 'ML',
            scale:1,
            type: 'value',
            min: used_ymin,
            max: used_ymax,
          },
          zAxis3D: {
            name: 'DV',
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
    this.OnChangeSample();
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
    border:1px dashed #888;
}
.mspan{
  display: inline-block;
  margin-top: 10px;
  vertical-align: middle;
  text-align:center;
}
.inline_item {
  display: inline-block;
  margin-left: 20px;
  vertical-align: middle;
}
.chart {
  height: 800px;
}
.parent {
  position: relative;
}
.child {
  position: absolute;
  z-index: 99999;
  top: 0;
  left: 0;
}
</style>
