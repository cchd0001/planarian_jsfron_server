<template>
  <div id="app">

    <div style="margin-left:40%;" align="center">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-submenu index="1">
            <template slot="title">7dpa</template>
              <el-menu-item index="1-1" disabled>0.5</el-menu-item>
              <el-menu-item index="1-2" disabled>0.8</el-menu-item>
              <el-menu-item index="1-3" disabled>1.2</el-menu-item>
              <el-menu-item index="1-4" disabled>1.8</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">14dpa</template>
              <el-menu-item index="2-1" @click.native="show_14_r05">0.5</el-menu-item>
              <el-menu-item index="2-2" @click.native="show_14_r08">0.8</el-menu-item>
              <el-menu-item index="2-3" disabled>1.2</el-menu-item>
              <el-menu-item index="2-4" disabled>1.8</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">wt</template>
              <el-menu-item index="3-1" disabled>0.5</el-menu-item>
              <el-menu-item index="3-2" @click.native="show_wt_r08">0.8</el-menu-item>
              <el-menu-item index="3-3" disabled>1.2</el-menu-item>
              <el-menu-item index="3-4" disabled>1.8</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">0hpa</template>
              <el-menu-item index="4-1" disabled>0.5</el-menu-item>
              <el-menu-item index="4-2" disabled>0.8</el-menu-item>
              <el-menu-item index="4-3" disabled>1.2</el-menu-item>
              <el-menu-item index="4-4" disabled>1.8</el-menu-item>
          </el-submenu>
        </el-menu>
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
  var SC_URL="http://49.232.213.84/single_cell/"
  var GENE_URL="http://49.232.213.84/genes"

  var dpa2_14_r05_url = "https://cdn.jsdelivr.net/gh/cchd0001/temp_db@master/14dpa2_r0.5.json"
  var dpa2_14_r08_url = "https://cdn.jsdelivr.net/gh/cchd0001/temp_db@master/14dpa2_r0.8.json"
  var wt_r08_url = "https://cdn.jsdelivr.net/gh/cchd0001/temp_db@master/wt_r0.8.json"
  var bin50_url = 'https://cdn.jsdelivr.net/gh/cchd0001/temp_db@master/bin50.json'
  var bin20_url = 'https://cdn.jsdelivr.net/gh/cchd0001/temp_db@master/bin20.json'
  var bin14_r05_url = 'https://cdn.jsdelivr.net/gh/cchd0001/temp_db@master/bin14_r0.5.json'
  var wt_genes_url = ''
  // the loading chart before we cache the real dataset
  export default {
    name : "Planarian",
    components: {
        VChart
    },
    provide: {
      [THEME_KEY]: "dark"
    },
    data(){
      return {
        show_gene_list:[],
        curr_name : null,
        curr_data : null,
        selectValue: '',
        search: '',
        isHidden: true,
        height:'200px',
        activeIndex: '1',
        pageSize:5,
        currentPage:1,
        activeName: 'first',
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
        }],
        multipleSelection: [],
        saved_clusters:[],
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

        }],
        jsondata : null,
        COLOR_ALL : [
            '#604E97',
            '#F6A600',
            '#B3446C',
            '#DCD300',
            '#882D17',
            '#8DB600',
            '#654522',
            '#E25822',
            '#2B3D26',
            '#191970',
            '#000080',
            '#6495ED',
            '#1E90FF',
            '#00BFFF',
            '#00FFFF',
            '#FF1493',
            '#FF00FF',
            '#A020F0',
            '#63B8FF',
            '#008B8B',
            '#54FF9F',
            '#00FF00',
            '#76EE00',
            '#FFF68F',
            'Yellow1',
            'Gold1'  ,
            'DarkGoldenrod4',
            '#FF6A6A',
            '#FFFF00',
            '#1CE6FF',
            '#FF34FF',
            '#FF4A46',
            '#008941',
            '#006FA6',
            '#A30059',
            '#FFE4E1',
            '#0000A6',
            '#63FFAC',
            '#B79762',
            '#004D43',
            '#8FB0FF',
            '#997D87',
            '#5A0007',
            '#809693',
            '#1B4400',
            '#4FC601',
            '#3B5DFF',
            '#FF2F80',
            '#BA0900',
            '#6B7900',
            '#00C2A0',
            '#FFAA92',
            '#FF90C9',
            '#B903AA',
            '#DDEFFF',
            '#7B4F4B',
            '#A1C299',
            '#0AA6D8',
            '#00A087',
            '#4DBBD5',
            '#E64B35',
            '#3C5488',
            '#F38400',
            '#A1CAF1',
            '#C2B280',
            '#848482',
            '#E68FAC',
            '#0067A5',
            '#F99379',
            '#FF8247',
            '#FFA54F',
            '#FF7F24',
            '#FF3030',
            '#FFA500',
            '#FF7F00',
            '#FF7256',
            '#FF6347',
            '#FF4500',
            '#FF1493',
            '#FF6EB4',
            '#EE30A7',
            '#8B008B',
            '#888888',
       ],
        option: {
           tooltip: {
             formatter: '{a} <br/>{b} : {c}%'
           },
           series: [
             {
               name: 'Pressure',
               type: 'gauge',
               progress: {
                 show: true
               },
               detail: {
                 valueAnimation: true,
                 formatter: '{value}'
               },
               data: [
                 {
                   value: '100',
                   name: 'Loading\n Please waiting ...'
                 }
               ]
             }
           ]
        },
        all_clusters:[0,1,2,3,4,5,6,7,8,9],
        showd_clusters:[1,1,1,1,1,1,1,1,1,1]
      }; // end of data return
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

    methods: {
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
      update_basic(name){
        if( this.curr_name != name)
        {
          // set new name
          this.curr_name = name;
          //clean buffer
          this.curr_data = null;
          // show loading first
          this.option = this.getOption();
          var used_url = SC_URL+"/"+name+"/label.json";
          // loading data and re-draw graph
          var self = this;
          $.getJSON(used_url,function(_data) {
            //self.setSCData(_data);
            self.option = self.getOption();
          });
        }
      },
      show_14_r05(){
        var self = this;
        $.getJSON(dpa2_14_r05_url,function(_data) {
        self.setJsonData(_data);
        console.log('14dpa2_r05 json loaded');
        self.option = self.getOption();});
        this.update_basic('14dpa2');
    },
      show_14_r08(){
        var self = this;
        $.getJSON(dpa2_14_r08_url,function(_data) {
        self.setJsonData(_data);
        console.log('14dpa2_r08 json loaded');
        self.option = self.getOption();});
    },
      show_wt_r08(){
        //var self = this;
        //$.getJSON(wt_r08_url,function(_data) {
        //self.setJsonData(_data);
        //console.log('wt_r08 json loaded');
        //self.option = self.getOption();});
        this.update_basic("WT");
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
              curr_color = this.COLOR_ALL[i];
            }
            else
            {
              curr_color = this.COLOR_ALL[this.COLOR_ALL.length-1];
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
          curr_color = this.COLOR_ALL[this.COLOR_ALL.length-1];
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
    mounted: function(){
      // load the 3D basic dataset here
        var self = this;
        console.log('start json loading');
        $.getJSON(bin14_r05_url,function(_data) {
          self.setJsonData(_data);
          console.log('json loaded');
          //self.option = self.getOption();
        });
        //this.getAutoHeight();
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
</style>
