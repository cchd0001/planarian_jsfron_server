<template>
  <div id="app">
    <!-- individual and resolution selecting menu start ... -->
    <div  style="margin-left:0%;" align="center">
      <el-menu  class="el-menu-demo" mode="horizontal" active-text-color="#409eff">
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
      <el-menu  class="el-menu-demo" mode="horizontal" active-text-color="#409eff">
        <el-menu-item index="1"  @click.native ="use_r0_1">r0.1</el-menu-item>
        <el-menu-item index="2"  @click.native ="use_r0_2">r0.2</el-menu-item>
        <el-menu-item index="3"  @click.native ="use_r0_3">r0.3</el-menu-item>
        <el-menu-item index="4"  @click.native ="use_r0_5">r0.5</el-menu-item>
        <el-menu-item index="5"  @click.native ="use_r0_8">r0.8</el-menu-item>
        <el-menu-item index="6"  @click.native ="use_r1_2">r1.2</el-menu-item>
        <el-menu-item index="7"  @click.native ="use_r1_5">r1.5</el-menu-item>
        <el-menu-item index="8"  @click.native ="use_r2_0">r2.0</el-menu-item>
      </el-menu>
    </div>

    <!-- Cell type color palette -->
    <div v-draggable style='width:200px;height:400px;z-index:999;position: absolute; bottom: 300; left: 300;' v-if="isShowColorPalette">
      <p style='padding:0;background-color:white;height:20px;' align='center'>Color Palette</p>
      <sketch-picker v-model="color" @input="colorValueChange"></sketch-picker>
      <el-button style='align:right;width:100%;' @click='applyColor'>ChangeColor</el-button>
    </div>
    <!-- end of color palette -->

    <!-- individual and resolution selecting menu end ... -->
    <!-- Configuration menu start ... -->
    <div class="block" style="margin-left:0%;background-color: rgb(238, 241, 246); border: 3px solid #eee;">
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

      <!-- switch background start -->
      <el-switch class='inline_item' active-text="Black theme" inactive-text="White theme" 
        v-model="black_background" @change="refresh" >
      </el-switch>
      <!-- switch background end -->
      
      <!-- Cell type configuration menu start ... -->
      <div class='inline_item'>
          <el-button align='right' @click.native="openCTC" style='width:100%;z-index:9999;'>Cell Type Configuration</el-button>
          <div class='parent' style='width:10px;'>
            <div v-draggable class="child" style='width:500px;z-index:9999;background-color:white' v-if="!isHidden">
              <hr>
              <!-- 1. cell table content -->
              <el-table class="table" ref="clusterTable" style="width:130;" :show-header='false'
                :height='height' :row-key="getRowKey" :highlight-current-row='true'
                :data="tableDataClusters.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                @selection-change="handleSelectionChange" @row-click="getRowCelltype">
                  <el-table-column :reserve-selection="true" type="selection" width="55"></el-table-column>
                  <el-table-column property="Celltype" label="Cell Type" width="80"> </el-table-column>
                  <el-table-column label="Display" width="160">
                    <el-button @click="showColorPalette">color palette</el-button>
                    <!-- <template slot-scope="scope"> -->
                      <!-- <el-button size="mini" type="primary" plain @click ="changeColor">color</el-button> -->
                    <!-- </template> -->
                  </el-table-column>
              </el-table>
              <el-pagination layout="total,sizes, prev, jumper, next" 
                :total="this.tableDataClusters.length" :current-page="currentPage" 
                @current-change="handleCurrentChange" @size-change="handleSizeChange" 
                :page-sizes="[5,10,15]" :page-size="pageSize" :current-page.sync="currentPage">
              </el-pagination>
              <!-- 1. cell table content end-->
              <div>
                <el-button @click="applyStatus">Highlight selected </el-button>
                <el-button @click='clearSelect'>Clear selected</el-button>
                <hr>
              </div> <!-- end of buttons -->
              <div>
                <p class='inline_item_tight'> Highlight top </p>
                <el-input class='inline_item_tight' style='width:80px;height:50px;' :min='min_cluster_number' 
                        :max='max_cluster_number' type='number' v-model="tmp_cluster_num" placeholder="5"></el-input>
                <p class='inline_item_tight'> clusters.</p>
                <el-button class='inline_item' @click.native="TopN">Apply</el-button>
                <hr>
                <el-button class='inline_item' @click='resetSelect'>Reset all</el-button>
                <el-button class='inline_item' @click.native="closeCTC">Close Configuration Panel</el-button>
                <hr>
              </div> <!-- end of top N buttons -->
            </div> <!-- end of hiden panel -->
          </div>  <!-- end of empty parent of hiden panel -->
      </div> <!-- end of cell type config -->
      <!-- Cell type configuration menu end ... -->

      <!-- ROI configuration menu start ... -->
      <div class='inline_item' >
        <el-button align='right' style='width:100%;' @click.native="openROI">ROI Configuration</el-button>
        <div class='parent' style='width:10px; ' >
          <div class="child" v-draggable style='width:500px;z-index:9999;background-color:white'  v-if="!isROIHidden">
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
    </div> <!-- end of inline block -->

    <!-- main window -->
    <div>
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
  import { Draggable } from 'draggable-vue-directive';
  import vdr from 'vue-draggable-resizable-gorkys'
  //import 'vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css'
  import { Sketch } from 'vue-color'

  // the dateset url
  var CT_URL="http://49.235.68.146/celltype/"
  var CTU_URL="http://49.235.68.146/celltype_umap/"
  var COLOR_ALL = require('../confs/discret_color.js');
  var idvd_conf = require('../confs/individual.js');
  var drag_x = 0;
  var drag_y = 0;
  // the loading chart before we cache the real dataset
  export default {
    name : "Planarian",
    components: {
      VChart,
      vdr,
      'sketch-picker': Sketch
    },
    directives: {
      Draggable,
    },
    data(){
      return {
        // test color
        
        current_color_all: COLOR_ALL,
        currentCellID: '',
        isShowColorPalette: false,
        color: '',
        // test drag
        show: true,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        //------------ui configurations-----------
        // number input
        min_cluster_number: 0,
        max_cluster_number: 100,
        // conf panel
        isHidden: true,
        isROIHidden:true,
        isUMAPHidden:true,
        // conf table
        tableDataClusters: [],
        height:'250px',
        pageSize:5,
        currentPage:1,
        // drawing theme
        black_background:true,
        symbolSize:2,
        umap_enable_message : '',
        //------------show clusters-----------
        tmp_cluster_num: 0,
        all_clusters: 0,
        saved_clusters:[], // the selection cache
        final_clusters: [],
        //------------roi confs------
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
        umap_option: {
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
        // curr selection
        curr_name : null,
        curr_rs : null,
        // main 3D data
        rawdata:null,
        jsondata : null,
        // umap 3D data
        raw_umapdata:null,
        umapdata:null,
      }; // end of data return
    },
    methods: { 
     //----------- color palette start -------------//
     showColorPalette(){
       if (this.isShowColorPalette){
         this.isShowColorPalette = false;
       //}else if (this.lastCelltype != this.currentCelltype){
         //this.isShowColorPalette = false;
       }else{
         this.isShowColorPalette = true;
       }
     },
     getRowCelltype(row){
       this.currentCellID = row.ID;
       console.log('getrow '+this.currentCellID);
       return row.ID;
     },
     colorValueChange (val) {
      this.color = val.hex;
      //this.current_color_all[this.currentCellID] = this.color;
      //this.option=this.getOption();
      //this.isShowColorPalette = false;
      },
     applyColor(){
       // change color when click row
       // only apply changes when click button
       this.current_color_all[this.currentCellID] = this.color;
       this.option=this.getOption();
       this.isShowColorPalette = false;
     },
      //-------------color palette ends------------------//

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
      //-------------3d box conf end -------------------//

      //-------------switching individual and resolution start -------------------//
      load_umap(){
        if( this.umapdata != null ||  this.curr_name == null || this.curr_rs == null )
          return;
        var used_url = CTU_URL+"/"+this.curr_name+"/"+this.curr_rs+".json";
        this.umap_option = this.getUMAPOption();
        var self = this;
        $.getJSON(used_url,function(_data) {
            console.log('...');
            self.setUMAPJsonData(_data);
            self.umap_option = self.getUMAPOption();
        });
      },
      update_basic(r){
        if (this.curr_rs != r){
          // loading data and re-draw graph
          var self = this;
          this.curr_rs = r;
          var used_url = CT_URL+"/"+this.curr_name+"/"+this.curr_rs+".json";
          this.cleanBuffer();
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
            this.cleanBuffer(); 
            this.curr_rs = null ;
            this.resetROIdata();
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
      //-------------switching individual and resolution end-------------------//

      //-------------switch configuration panel start-------------------------------//
      openCTC(){
        this.isROIHidden = true;
        this.isUMAPHidden = true;
        this.isHidden = ! this.isHidden;
        if (this.isShowColorPalette){
          this.isShowColorPalette = false;
        }
      },
      openROI(){
        this.isHidden = true;
        this.isUMAPHidden = true;
        this.isROIHidden = ! this.isROIHidden;
      },
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
      closeCTC(){
        this.isHidden = true;
        this.isROIHidden = true;
        this.isUMAPHidden = true;
        this.isShowColorPalette = false;
      },
      //-------------switch configuration panel end-------------------------------//
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
          moveMe.style.top =  (Number(moveMe.offsetTop)+dy)+'px';
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
      //-------------table like configuration panel start-------------------------------//
      getRowKey (row) {
        return row.Celltype
      },
      handleSizeChange (size) {
        this.pageSize = size;
      },
      handleCurrentChange (currentpage){
        this.currentPage = currentpage;
      },
      //-------------table like configuration panel end-------------------------------//

      //-------------refresh  -------------------//
      refresh(){
        this.option=this.getOption();
      },
      //-------------refresh  -------------------//

      //-------------configure cell type start -------------------//
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
        // to do: should reset color here?
        COLOR_ALL=require('../confs/discret_color.js');
        this.final_clusters=new Array(this.all_clusters).fill(1);
        this.option=this.getOption();
      },
      clearSelect () {
        this.$refs.clusterTable.clearSelection();
      },
      applyStatus(){
        var self = this;
        this.final_clusters=this.saved_clusters;
        self.option=self.getOption();
        //this.option=this.getOption();
        this.isShowColorPalette = false;
        //this.$refs.myecharts.setOption(this.getOption(),true);
      },
      handleSelectionChange(val) {
        // change color when check box
        //if (val.length > 0){
          //this.currentCellID = val[val.length -1].ID;
        //}
        //console.log('handle '+this.currentCellID);
        var tmp_clusters= new Array(this.all_clusters).fill(0);
        for( var i = 0 ; i < val.length ; i++) {
            tmp_clusters[val[i].ID]=1;
          }
        this.saved_clusters=tmp_clusters;
      },
      //-------------configure cell type end -------------------//

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


      //-------------data manager start-------------------//
      cleanBuffer(){
        this.jsondata = null ;
        this.rawdata = null;
        this.raw_umapdata = null;
        this.umapdata = null;
      },
      setUMAPJsonData(_data){
        var curr_draw_datas= [];
        for(var i = 0; i<=300; i++ ){
            curr_draw_datas.push([['x','y','z']]);
        }
        // --------- iterate through real data (long)
        var left_index = 300;
        for(var j=0 ; j< _data.length; j++){
          var curr_item = _data[j];
          for(var i = 0; i< 300; i++ ){
            if( curr_item[3] == i ){
                curr_draw_datas[i].push([curr_item[0],curr_item[1],curr_item[2]]);
                break;
            }
          }
        } // end of for _data
        this.umapdata = curr_draw_datas;
      },
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
        console.log('before create tabledata, all_clsuters length is ');
        console.log(this.all_clusters);
        var new_tableDataClusters = [];
        for (var i=0; i < this.all_clusters; i++){
            new_tableDataClusters.push({ID: i, Celltype: 'Cluster'+i});
        }
        this.tableDataClusters = new_tableDataClusters;
        //console.log(this.tableDataClusters);
        this.rawdata = curr_draw_datas;
        this.jsondata = curr_draw_datas;
      },
      //-------------data manager end -------------------//

      //-------------drawing function start -------------------//
      changeZScale(){
        this.z_scale = this.tmp_z_scale;
        this.option = this.getOption();
      },
      getUMAPOption(){
        return this.getDrawOption(this.umapdata,true);
      },
      getOption() {
        return this.getDrawOption(this.jsondata,false);
      },
      getDrawOption(curr_draw_datas,max10){
        var bk_color = '#000000';
        var ft_color = '#cccccc';
        if ( this.black_background == false ) {
          bk_color = '#FFFFFF';
          ft_color = '#333333';
        }
        if ( curr_draw_datas == null ) {
          var curr_title = 'Loading data now ...';
          if( this.curr_rs == null ) {
            curr_title = 'Please select a resolution ...';
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
        }
        else {
          console.log('knowing json loaded');
          //var curr_draw_datas = this.jsondata;
          var series_list = [];
          var legend_list = [];
          var legend_show = {};
          var curr_color ;
          console.log('start series');
          for( var i = 0 ; i<this.all_clusters; i++ )
          {
            var curr_legend_name = "CellType"+i;
            if(this.final_clusters[i] == 0){
              legend_show[curr_legend_name] = false;
            } else {
              legend_show[curr_legend_name] = true;
            }
            legend_list.push(curr_legend_name);
            curr_color = COLOR_ALL[i];
            //if (this.color == ""){
              //curr_color = COLOR_ALL[i];
              //console.log('this.color is'+this.color);
              //console.log('curr_color '+curr_color);
            //}else {
              //console.log(this.color);
              //curr_color = this.color;
            //}
            var the_data = curr_draw_datas[i];
            var one_series = {
                name : legend_list[i],
                type : 'scatter3D',
                dimensions: [ 'x','y','z' ],
                data: the_data,
                symbolSize: this.symbolSize,
                itemStyle: {
                  borderWidth: 1,
                  borderColor: curr_color,
                  color: curr_color
                },
            };
            series_list.push(one_series);
          } // end of for final_clusters.length
          console.log('end series');
          //console.log(legend_show);
          //console.log(legend_list);
          var used_xmin = 0;
          var used_xmax = this.getWidth();
          var used_ymin = 0;
          var used_ymax = this.getHeight();
          var used_zmin = 0;
          var used_zmax = this.getDepth();
          var boxWidth  = used_xmax;
          var boxHeight = used_zmax*this.z_scale;
          var boxDepth  = used_ymax;
          if( max10 == true ){
            used_xmin = -10; used_xmax = 10; 
            used_ymin = -10; used_ymax = 10; 
            used_zmin = -10; used_zmax = 10; 
            boxWidth = 60; boxHeight = 60; boxDepth = 60;
          }
          var opt={
            backgroundColor:bk_color,
            title :{
              text : '',
              left: "center",
              top : "top",
              textStyle: {
                 color: ft_color
              },
            },
            legend :{
              data:legend_list,
              selected: legend_show,
              textStyle: {
                color:ft_color,
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
              boxWidth: boxWidth,
              boxHeight: boxHeight , //this.getDepth() *this.z_scale,
              boxDepth: boxDepth ,     //this.getHeight(),
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
