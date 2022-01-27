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
    <div>
      <p class="inline_item" > Please select a resolution : </p>
      <el-button class="inline_item" @click ="use_r0_1">r0.1</el-button>
      <el-button class="inline_item" @click ="use_r0_2">r0.2</el-button>
      <el-button class="inline_item" @click ="use_r0_3">r0.3</el-button>
      <el-button class="inline_item" @click ="use_r0_8">r0.8</el-button>
    </div>
    <!-- main window -->
    <div class='parent'>
      <!-- I. chart content -->
      <v-chart class="chart" :option="option" style="width:100%;height:800px;" />
        <div class='child' style='background-color:white;'>
          <div style="width:120px;">
            <el-button align='right' style='width:100%;' @click="isHidden = !isHidden">Cell/Gene</el-button>
          </div>
          <!-- II. configuration content -->
          <el-tabs style='width:300px;' v-model="activeName" v-if="!isHidden" @tab-click="handleClick">
            <el-tab-pane style='width:160;' label='Cell' name='first'>
              <!-- 1. cell table content -->
              <el-table
                id="cellTable"
                class="table"
                ref="clusterTable"
                style="width:160;"
                :show-header='false'
                :height='height'
                :row-key="getRowKey"
                :highlight-current-row='true'
                :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
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
                :total="this.tableDataGenes.length"
                :current-page="currentPage"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :page-sizes="[5,10,15]"
                :page-size="pageSize"
                :current-page.sync="currentPage">
              </el-pagination>
            </el-tab-pane>

            <el-tab-pane label='Gene' name='second'>
              <!-- 2. search content -->
              <el-select v-model="selectValue" @change="selectGene" filterable placeholder="Search Gene">
                <el-option
                  v-for="item in tableDataGenes"
                  :key="item.ID"
                  :label="item.Genes"
                  :value="item.Genes">
                </el-option>
              </el-select>
              <!-- 2. gene table content -->
              <el-table
                class="table"
                ref="multipleTable"
                style="width:160;"
                :data="tableDataGenes.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                :show-header='false'
                :height='height'
                @selection-change="handleGeneSelectionChange">
                <el-table-column
                    type="selection"
                    width="55">
                  </el-table-column>
                  <el-table-column
                    property="Genes"
                    label="Gene Name"
                    width="80">
                  </el-table-column>
                  <el-table-column label="Display" width="160">
                    <template slot-scope="scope">
                      <el-button size="mini" type="primary" plain @click.native="changeColor">color</el-button>
                    </template>
                  </el-table-column>
              </el-table>
              <el-pagination 
                layout="total, sizes, prev, pager, next, jumper" 
                :total="this.tableDataGenes.length"
                :current-page="currentPage"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :page-sizes="[5,10,15]"
                :page-size="pageSize"
                :current-page.sync="currentPage">
              </el-pagination>
              <el-button @click='applyGene'>get gene</el-button>
            </el-tab-pane>
            <div>
              <el-button @click="applyStatus">Apply</el-button>
              <el-button @click='clearSelect'>Clear</el-button>
              <el-button @click='resetSelect'>Reset</el-button>
            </div> 
          </el-tabs>
        </div> <!-- end of the main window -->
    </div>

  </div>
</template>

<script>
  import $ from 'jquery';
  import * as echarts from 'echarts';
  import 'echarts-gl';
  import VChart, { THEME_KEY } from "vue-echarts";
  // the dateset url
  var CT_URL="http://49.232.213.84/celltype/"
  var GENE_URL="http://49.232.213.84/genes"
  var wt_genes_url = ''
  var COLOR_ALL = require('../confs/discret_color.js');
  // the loading chart before we cache the real dataset
  export default {
    name : "Planarian",
    components: {
        VChart
    },
    data(){
      return {
        //------------show clusters-----------
        show_gene_list:[],
        multipleSelection: [],
        saved_clusters:[],
        all_clusters:[0,1,2,3,4,5,6,7,8,9],
        showd_clusters:[1,1,1,1,1,1,1,1,1,1],
        selectValue: '',
        //------------show clusters-----------

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
        tableDataGenes: [{
            ID: '0',
            Genes: 'SMED30033583',
            label: "test",
          }, {
            ID: '1',
            Genes: 'SMED30036029',
            label: "absolute_vodka",
          }, {
            ID: '2',
            Genes: 'SMED30036028',
            label: "test233",
          }, {
            ID: '3',
            Genes: 'SMED30036026',
          }, {
            ID: '4',
            Genes: 'SMED30036025',
          }, {
            ID: '5',
            Genes: 'SMED30036024',
          }, {
            ID: '6',
            Genes: 'SMED30036022',
          }
        ],
        tableData:[{
            ID: '0',
            uid: '00',
            Celltype: 'Cluster0',
          }, {
            ID: '1',
            uid:'01',
            Celltype: 'Cluster1',
          }, {
            ID: '2',
            uid: '02',
            Celltype: 'Cluster2',
          }, {
            ID: '3',
            uid: '03',
            Celltype: 'Cluster3',
          }, {
            ID: '4',
            Celltype: 'Cluster4',
          }, {
            ID: '5',
            uid: '05',
            Celltype: 'Cluster5',
          }, {
            ID: '6',
            uid: '06',
            Celltype: 'Cluster6',
          }
        ],
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
        curr_data : null,
        curr_rs : null,
        jsondata : null,
      }; // end of data return
    },

    methods: {
      //-------------switching individual start -------------------//
      update_basic(used_url){
        // loading data and re-draw graph
        var self = this;
        $.getJSON(used_url,function(_data) {
          console.log("loaded");
          self.setJsonData(_data);
          self.option = self.getOption();
        });
      },
      use_r0_1(){
        if(this.curr_rs != "0.1"){
           // show loading first
           this.curr_rs = "0.1";
           console.log(this.curr_rs);
           var used_url = CT_URL+"/"+this.curr_name+"/"+this.curr_rs+".json";
           this.option = this.getOption();
           this.update_basic(used_url);
        }
      },
      use_r0_2(){
        if(this.curr_rs != "0.2"){
           // show loading first
           this.curr_rs = "0.2";
           var used_url = CT_URL+"/"+this.curr_name+"/"+this.curr_rs+".json";
           this.option = this.getOption();
           this.update_basic(used_url);
        }
      },
      use_r0_3(){
        if(this.curr_rs != "0.3"){
           // show loading first
           this.curr_rs = "0.3";
           var used_url = CT_URL+"/"+this.curr_name+"/"+this.curr_rs+".json";
           this.option = this.getOption();
           this.update_basic(used_url);
        }
      },
      use_r0_8(){
        if(this.curr_rs != "0.8"){
           // show loading first
           this.curr_rs = "0.8";
           var used_url = CT_URL+"/"+this.curr_name+"/"+this.curr_rs+".json";
           this.option = this.getOption();
           this.update_basic(used_url);
        }
      },
      resetIndividual(name){
          if ( this.curr_name != name ) {
            this.curr_name = name ;
            this.curr_data = null ;
            this.curr_rs = null ;
            this.option = this.getOption();
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
      handleGeneSelectionChange(val){
       this.multipleSelection = val;
       for ( var i = 0 ; i < val.length ; i++){
         console.log(val[i].Genes);
         this.show_gene_list[i]=val[i].Genes;
       }
      },
      applyGene(){
        for (var i = 0 ; i < this.show_gene_list.length ; i++){
          if(this.curr_name != null){
            var self = this;
            var item = this.show_gene_list[i];
            var self=this;
            var used_url = GENE_URL+"/"+this.curr_name+"/"+item+".json";
            console.log(used_url);
            $.getJSON(used_url,function(_data) {
              self.curr_gene = item;
              self.setGeneData(_data);
              self.option = self.getOption();
            });
          }
        }
      },
      changeColor(){
        console.log('change color');
      },
      selectGene(){
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
      resetSelect(){
        var self = this;
        this.showd_clusters=[1,1,1,1,1,1,1,1,1,1];
        self.option=self.getOption();
      },
      clearSelect () {
        var self = this;
        this.$refs.clusterTable.clearSelection();
        this.showd_clusters=[0,0,0,0,0,0,0,0,0,0];
        self.option=self.getOption();
    },
      getRowKey (row) {
        return row.uid
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
      handleClick(tab, event){
        this.activeName = tab.name;
      },
      applyStatus(){
        var self = this;
        console.log("change cluster showing option");
        this.showd_clusters=this.saved_clusters;
        self.option=self.getOption();
      },
      handleSelectionChange(val) {
        console.log('val is ');
        console.log(val);
        this.multipleSelection = val;
        var tmp_clusters=[0,0,0,0,0,0,0,0,0,0];
        for( var i = 0 ; i < val.length ; i++) {
            tmp_clusters[val[i].ID]=1;
          }
        this.saved_clusters=tmp_clusters;
      },

      handleSelect(key, keyPath) {
        // not in use
      },
      setJsonData(_data){
        console.log('knowing json loaded');
        var curr_draw_datas= [];
        for(var i = 0; i<=this.all_clusters.length; i++ )
        {
            curr_draw_datas.push([['x','y','z']]);
        }
        var left_index = this.all_clusters.length;
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
          var curr_draw_datas = this.jsondata;
          var series_list = [];
          var legend_list = [];
          var legend_color = [];
          var curr_color ;
          console.log('start series');
          for( var i = 0 ; i<this.showd_clusters.length; i++ )
          {
            var curr_cluster = this.all_clusters[i];
            legend_list.push("CellType"+curr_cluster);
            if(this.showd_clusters[i] == 1)
            {
              curr_color = COLOR_ALL[i];
            }
            else
            {
              curr_color = COLOR_ALL[COLOR_ALL.length-1];
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
            };
            series_list.push(one_series);
          } // end of for showd_clusters.length
          legend_list.push("others");
          curr_color = COLOR_ALL[COLOR_ALL.length-1];
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
    computed:{
      tables:function(){
        var search=this.search;
        if(search){
          return  this.tableData.filter(function(dataNews){
            return Object.keys(dataNews).some(function(key){
              return String(dataNews[key]).toLowerCase().indexOf(search) > -1
            })
          })
        }
        return this.tableData
      }
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
.parent {
  position: relative;
}
.child {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
