<template>
  <div id="app">

    <div style="margin-left:40%;" align="center">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item index="1">14dpa1</el-menu-item>
          <el-menu-item index="2">14dpa2</el-menu-item>
          <el-menu-item index="3"@click.native="show_wt_label" >WT</el-menu-item>
        </el-menu>
    </div>

<el-container style="height: 800px; border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <p> Gene Expression </p>
      <el-tabs style='width:800px;height:200px;' @tab-click="handleClick">
        <el-tab-pane style='width:160;' label='Cell' name='first'>
          <el-table
            class="table"
            ref="multipleTable"
            style="width:160;"
            :data="tableData"
            :show-header='false'
            @selection-change="handleSelectionChange">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                show-header='false'
                property="Celltype"
                label="Celltype"
                width="80">
              </el-table-column>
          </el-table>
          <div style="margin-left:3%;width:20px">
            <el-button @click="applyStatus">Apply</el-button>
          </div>    
        </el-tab-pane>
        <el-tab-pane label='Gene' name='second'>
          <el-table
            class="table"
            ref="multipleTable"
            style="width:160;"
            :data="tableDataGenes"
            :show-header='false'
            @selection-change="handleSelectionChange">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                property="Genes"
                label="Genes"
                width="80">
              </el-table-column>
          </el-table>
          <div style="margin-left:3%;width:20px">
            <el-button @click="applyStatus">Apply</el-button>
          </div> 
        </el-tab-pane>
      </el-tabs>
      </el-aside>

      <el-main>
        <v-chart class="chart" :option="option" style="width:100%;height:800px;" />
      </el-main>
    </el-container>

  </div>
</template>

<script>
  import $ from 'jquery';
  import * as echarts from 'echarts';
  import 'echarts-gl';
  import VChart, { THEME_KEY } from "vue-echarts";
  // the dateset url
  var dpa2_14_r05_url = "https://cdn.jsdelivr.net/gh/cchd0001/temp_db@master/14dpa2_r0.5.json"
  var dpa2_14_r08_url = "https://cdn.jsdelivr.net/gh/cchd0001/temp_db@master/14dpa2_r0.8.json"
  var wt_r08_url = "https://cdn.jsdelivr.net/gh/cchd0001/temp_db@master/wt_r0.8.json"
  var wt_label_url = "https://cdn.jsdelivr.net/gh/cchd0001/temp_db@master/label.json"
  var bin50_url = 'https://cdn.jsdelivr.net/gh/cchd0001/temp_db@master/bin50.json'
  var bin20_url = 'https://cdn.jsdelivr.net/gh/cchd0001/temp_db@master/bin20.json'
  var bin14_r05_url = 'https://cdn.jsdelivr.net/gh/cchd0001/temp_db@master/bin14_r0.5.json'
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
        activeIndex: '1',
        pagesize: 10,
        currentPage:1,
        tableDataGenes: [{
          ID: '0',
          Genes: 'SMED30036034',
        }, {
          ID: '1',
          Genes: 'SMED30036029',
        }, {
          ID: '2',
          Genes: 'SMED30036028',
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
        name_id_map: {
           'cathe+-cells':0,
           'Epidermal':1,
           'Gut':2,
           'Muscle':3,
           'Neural':4,
           'Parenchymal':5,
           'Pharynx':6,
           'Protonephridia':7,
           'tgs1+-Neoblast':8
        },
        tableData:[
          {
             ID: '0',
            Celltype: 'cathe+-cells',
          }, {
            ID: '1',
            Celltype: 'Epidermal',
          }, {
            ID: '2',
            Celltype: 'Gut',
          }, {
            ID: '3',
            Celltype: 'Muscle',
          }, {
            ID: '4',
            Celltype: 'Neural',
          }, {
            ID: '5',
            Celltype: 'Parenchymal',
          }, {
            ID: '6',
            Celltype: 'Pharynx',
          }, {
            ID: '7',
            Celltype: 'Protonephridia',
          }, {
            ID: '8',
            Celltype: 'tgs1+-Neoblast',
          }
        ],
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
        all_clusters:[0,1,2,3,4,5,6,7,8],
        showd_clusters:[1,1,1,1,1,1,1,1,1]
      }; // end of data return
    },
    methods: {
      handleClick(tab, event){
        console.log(tab, event);
      },
      applyStatus(){
        var self = this;
        console.log("change cluster showing option");
        this.showd_clusters=this.saved_clusters;
        self.option=self.getOption();
      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
        var tmp_clusters=[0,0,0,0,0,0,0,0,0];
        for( var i = 0 ; i < val.length ; i++) {
          if ( i < 11){
            tmp_clusters[val[i].ID]=1;
          } else if (i==11){

          }
        }
        this.saved_clusters=tmp_clusters;
        console.log("saved clusters");
        console.log(this.saved_clusters);
      },

      handleSelect(key, keyPath) {
      },
      show_14_r05(){
        var self = this;
        $.getJSON(dpa2_14_r05_url,function(_data) {
        self.setJsonData(_data);
        console.log('14dpa2_r05 json loaded');
        self.option = self.getOption();});
    },
      show_14_r08(){
        var self = this;
        $.getJSON(dpa2_14_r08_url,function(_data) {
        self.setJsonData(_data);
        console.log('14dpa2_r08 json loaded');
        self.option = self.getOption();});
    },
      show_wt_label(){
        var self = this;
        $.getJSON(wt_label_url,function(_data) {
        self.setJsonData(_data);
        console.log('wt_r08 json loaded');
        self.option = self.getOption();});
    },
      setJsonData(_data){
        console.log('knowing json loaded');
        var curr_draw_datas= [];
        for(var i = 0; i<Object.keys(this.name_id_map).length ; i++ )
        {
            curr_draw_datas.push([['x','y','z']]);
        }
        //console.log(_data.length);
        for(var j=0 ; j< _data.length; j++)
        {
          var curr_item = _data[j];
          //console.log(curr_item);
          var type_name = curr_item[3];
          //console.log(type_name);
          var type_id = this.name_id_map[type_name];
          //console.log(type_id);
          //var curr_cluster = curr_draw_datas[type_id];
          //console.log('current cluster is '+ curr_cluster);
          //console.log(type_id);
          curr_draw_datas[type_id].push([curr_item[0],curr_item[1],curr_item[2]]);
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
          console.log('01');
          var curr_draw_datas = this.jsondata;
          var series_list = [];
          var legend_list = [];
          var legend_color = [];
          var curr_color ;
          console.log('start series');
          // set legend color
          for( var i = 0 ; i<this.showd_clusters.length; i++ )
          {
            var curr_cluster = this.all_clusters[i];
            var curr_legend = this.tableData[i].Celltype;
            legend_list.push(curr_legend);
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
            //console.log('the data length');
            console.log(the_data.length);
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
                //emphasis: {
                //  itemStyle: {
                //    color: this.COLOR_ALL[i]
                //  }
                //}
            };
            
            series_list.push(one_series);
          } // end of for showd_clusters.length
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
        $.getJSON(wt_label_url,function(_data) {
          self.setJsonData(_data);
          console.log('json loaded');
          //self.option = self.getOption();
        });
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
</style>
