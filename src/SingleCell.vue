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

    <!-- Cell type color palette -->
    <div v-draggable style='width:300px;height:400px;background-color:white;z-index:999;position:absolute;bottom:300;left:300;' v-if="isShowColorPalette">
      <sketch-picker align='center' v-model="color" @input="colorValueChange"></sketch-picker>
      <el-button align='right' style='width:50%;' @click='applyColor'>ChangeColor</el-button>
      <el-button align='right' style='width:50%;' @click='closeColor'>Close</el-button>
    </div>
    <!-- end of color palette -->

    <!-- Configuration Bar starts -->
    <div style="margin-left:0%;background-color: rgb(238, 241, 246); border: 3px solid #eee;" >
      
      <!-- Cell type configuration menu start ... -->
      <div class='inline_item'>
        <el-button align='right' @click.native="openCTC" style='width:100%;z-index:9999;'>Cell Type Configuration</el-button>
        <div class='parent' style='width:10px;'>
          <div v-draggable class="child" style='width:500px;z-index:9999;background-color:white' v-if="!isHidden">
            <el-table class="table" ref="multipleTable" style="width:160;" :data="tableData"
              :show-header='false'
              @row-click="getRowCelltype"
              @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="25"> </el-table-column>
              <el-table-column show-header='false' property="Celltype" label="Celltype" width="125"></el-table-column>
              <el-table-column label="Display" width="160">
                <el-button @click="showColorPalette">color palette</el-button>
              </el-table-column>
            </el-table>
            <div style="margin-left:1%;width:25px">
              <el-button @click="applyStatus">Highlight selected types</el-button>
            </div>
            <div style="margin-left:1%;width:25px">
              <el-button @click="resetAll">Highlight all types</el-button>
            </div>
          </div> <!-- end of draggble div -->
        </div> <!-- end of parent -->
      </div>
      <!-- Cell type configuration menu end ... -->
      
      <!-- ROI configuration menu start ... -->
      <div class='inline_item' >
        <el-button align='right' style='width:100%;' @click.native="openROI">ROI Configuration</el-button>
        <div class='parent' style='width:10px; ' >
          <div v-draggable class="child" style='width:500px;z-index:9999;background-color:white'  v-if="!isROIHidden">
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
    <!-- Configuration Bar ends -->

    <div>
      <v-chart ref="myecharts"  class="chart" :option="option" style="width:100%;height:700px" />
    </div>
  </div>
</template>

<script>
  // libraray
  import $ from 'jquery';
  import * as echarts from 'echarts';
  import 'echarts-gl';
  import VChart from "vue-echarts";
  import { Draggable } from 'draggable-vue-directive';
  import { Sketch } from 'vue-color'

  // confs
  var CP_URL="http://49.235.68.146/cell_center/";
  var SC_URL="http://49.235.68.146/single_cell/";
  var COLOR_ALL = require('../confs/discret_color.js');
  var sc_conf = require('../confs/single_cell_transfered_type.js');
  var idvd_conf = require('../confs/individual.js');

  export default {
    name : "singlecell",
    components: {
      VChart,
      'sketch-picker': Sketch
    },
    directives: {
      Draggable,
    },
    data(){
      return {
        symbolSize:2,
        // configure panels
        isHidden: true,
        isROIHidden:true,
        isShowColorPalette: false,
        color: '',
        currentCellID: '',
        current_color_all: COLOR_ALL,
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
        rawdata: null,
        // mesh data
        mesh_json:null,
        mesh_conf : {
          names:    ['Body','Neural','Gut','Pharynx'],
          legends : ['Body_mesh','Neural_mesh','Gut_mesh','Pharynx_mesh'],
          colors :  ['#cc6600','#ffff00','#ff0000','#00ff00'],
          opacity:  [ 0.3, 0.4, 0.4, 0.4],
        },
      }; // end of data return
    },
    methods: {
      //-------------refresh  -------------------//
     refresh(){
       this.option=this.getOption();
     },
     //----------- color palette start -------------//
     showColorPalette(){
       if (this.isShowColorPalette){
         this.isShowColorPalette = false;
       }else{
         this.isShowColorPalette = true;
       }
     },
     getRowCelltype(row){
       // 1. get row id when click on row (except for selection box)
       this.currentCellID = row.ID;
       return row.ID;
     },
     colorValueChange (val) {
      this.color = val.hex;
      },
     applyColor(){
       // change color when click row
       // only apply changes when click button
       this.current_color_all[this.currentCellID] = this.color;
       this.option=this.getOption();
     },
     closeColor(){
       this.isShowColorPalette = false;
     },
      //-------------color palette ends------------------//
      //-------------conf panels-------------------------//
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
      closeCTC(){
        this.isHidden = true;
        this.isROIHidden = true;
        this.isUMAPHidden = true;
        this.isShowColorPalette = false;
      },
      //-------------conf panel ends------------------------//
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
        this.curr_data = this.rawdata;
        this.option=this.getOption();
      },
      updateJsonData(){
        console.log("update json data");
        var curr_draw_datas = [];
        for(var i =0;i<this.tableData.length;i++)
            curr_draw_datas.push([['x','y','z']]);
        for(var i =0;i<this.tableData.length;i++){
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
        this.curr_data = curr_draw_datas;
      },
      changeXMin(){
        console.log("change x min");
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
      changeZScale(){
        this.z_scale = this.tmp_z_scale;
        this.option = this.getOption();
      },
      //-------------configure ROI end -------------------//
      
      //-------------mesh start-------------------//
      resetMesh(){
        console.log("reset mesh");
        this.mesh_json = null;
        var self = this;
        var used_url = CP_URL+"/"+this.curr_name+"_mesh.json";
        console.log(used_url);
        $.getJSON(used_url,function(_data) {
          console.log("mesh loaded");
          self.setMeshData(_data);
          self.option = self.getOption();
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
        console.log("update basic");
        if( this.curr_name != name)
        {
          // set new name
          this.curr_name = name;
          //clean buffer
          this.curr_data = null;
          this.resetROIdata();
          this.resetMesh();
          // show loading first
          this.$refs.myecharts.setOption(this.getOption(),true);
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
        this.rawdata = curr_draw_datas;
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
          for( var i = 0 ; i<used_color_masks.length; i++ )
          {
            var curr_legend_name = this.tableData[i].Celltype;
            legend_list.push(curr_legend_name);
            curr_color = this.current_color_all[i];
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
                symbolSize: this.symbolSize,
                itemStyle: {
                  borderWidth: 0,
                  color: curr_color,
                  opacity: curr_alpha,
                }
            };
            series_list.push(one_series);
          } // end of for showd_clusters.length
          console.log('end series');
          if(this.mesh_json != null ){
            console.log('draw mesh');
            for(var i = 0; i<this.mesh_conf.names.length; i++){
              var curr_name = this.mesh_conf.names[i];
              var curr_legend_name = this.mesh_conf.legends[i];
              var curr_color = this.mesh_conf.colors[i];
              var curr_opacity = this.mesh_conf.opacity[i];
              //console.log('curr_legend_name');
              if( this.mesh_json[curr_name]['xyz'].length == 0 )
                  continue;
              legend_list.push(curr_legend_name);
              var one_series = {
                  name : curr_legend_name,
                  type : 'surface',
                  data: this.mesh_json[curr_name]['xyz'],
                  isMesh :true,
                  dataShape:[2,3],
                  indices : this.mesh_json[curr_name]['ijk'],
                  color: curr_color,
                  opacity:curr_opacity,
              };
              series_list.push(one_series);
            }
          }
          //console.log(legend_show);
          var used_xmin = 0;
          var used_xmax = this.getWidth();
          var used_ymin = 0;
          var used_ymax = this.getHeight();
          var used_zmin = 0;
          var used_zmax = this.getDepth();
          var boxWidth  = used_xmax;
          var boxHeight = used_zmax*this.z_scale;
          var boxDepth  = used_ymax;
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
            legend :{
              data: legend_list,
              selected : legend_show, //{'Gut' : false } ,
              textStyle: {
                 color: '#cccccc'
              },
            },
            grid3D: {
              boxWidth: boxWidth,
              boxHeight: boxHeight,
              boxDepth: boxDepth,
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
