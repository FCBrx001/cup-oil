<template>	
  <div class="chartground" >
	   <!--左上边框-->
        <div class="t_line_box">
            <i class="t_l_line"></i> 
            <i class="l_t_line"></i> 
        </div> 
        <!--右上边框-->
        <div class="t_line_box">
            <i class="t_r_line"></i> 
            <i class="r_t_line"></i> 
        </div> 
        <!--左下边框-->
        <div class="t_line_box">
            <i class="l_b_line"></i> 
            <i class="b_l_line"></i> 
        </div> 
            <!--右下边框-->
            <div class="t_line_box">
            <i class="r_b_line"></i> 
            <i class="b_r_line"></i> 
        </div> 
        <div class="main_title">{{titleText}}</div>
    <div :id="elId" :style="{'width':chartWidth+'px','height':chartHeight+'px'}">
        <el-table :style="{'width':chartWidth+'px','height':chartHeight+'px'}" border :data="tableData" :height="chartHeight">
            <el-table-column prop="column_name" label="站场名" ></el-table-column>
            <el-table-column prop="column_line" label="全年概览" >
                <template slot-scope="scope">
                    <div :id="'sparkline-index' + scope.$index" >{{ drawCharts(scope.row, scope.$index)}}</div>
                </template>
            </el-table-column>
            <el-table-column label="季度汇总" align="center">
                <el-table-column  prop="column_bar1" label="第一季度" width="100" align="center">
                    <template slot-scope="scope">
                        <div :id="'1-index' + scope.$index" >{{ drawBars(1,scope.row, scope.$index)}}</div>
                    </template>
                </el-table-column>
                <el-table-column  prop="column_bar2" label="第二季度" width="100" align="center">
                    <template slot-scope="scope">
                        <div :id="'2-index' + scope.$index" >{{ drawBars(2,scope.row, scope.$index)}}</div>
                    </template>
                </el-table-column>
                <el-table-column  prop="column_bar3" label="第三季度" width="100" align="center">
                    <template slot-scope="scope">
                        <div :id="'3-index' + scope.$index" >{{ drawBars(3,scope.row, scope.$index)}}</div>
                    </template>
                </el-table-column>
                <el-table-column  prop="column_bar4" label="第四季度" width="100" align="center">
                    <template slot-scope="scope">
                        <div :id="'4-index' + scope.$index" >{{ drawBars(4,scope.row, scope.$index)}}</div>
                    </template>
                </el-table-column>
            </el-table-column>
        </el-table>
        
    </div>
  </div>
</template>

<script>
"use strict"; 
  import uuidv1 from 'uuid/v1'
export default {
    name:'thumbnail',
    props: {
        chartWidth:{
            type: Number,
            default:500
        },
        chartHeight:{
            type: Number,
            default:500
        },
	},
    /**
     * table 为能耗数据全12个月
     * 
     */
    data() {
        return {
            elId:'',
            titleText:'全年能耗记录',
            tableData: [{
                column_name: '茂名',
                column_line:'15',
                column_bar:'11'
            },
            {
                column_name: '阳江',
                column_line:'30',
                column_bar:'11'
            },
            {
                column_name: '恩平',
                column_line:'20',
                column_bar:'11'
            },
            {
                column_name: '鹤山',
                column_line:'30',
                column_bar:'11'
            },
            {
                column_name: '江门',
                column_line:'20',
                column_bar:'11'
            },
            {
                column_name: '高明',
                column_line:'30',
                column_bar:'11'
            },
            {
                column_name: '三水',
                column_line:'30',
                column_bar:'11'
            }],
            
            table:[{
                kl:Array.from({
                    length: 12
                }, () => Math.floor(Math.random() * 12))
            },{
                kl:Array.from({
                    length: 12
                }, () => Math.floor(Math.random() * 12))
            },{
                kl:Array.from({
                    length: 12
                }, () => Math.floor(Math.random() * 12))
            },{
                kl:Array.from({
                    length: 12
                }, () => Math.floor(Math.random() * 12))
            },{
                kl:Array.from({
                    length: 12
                }, () => Math.floor(Math.random() * 12))
            },{
                kl:Array.from({
                    length: 12
                }, () => Math.floor(Math.random() * 12))
            },{
                kl:Array.from({
                    length: 12
                }, () => Math.floor(Math.random() * 12))
            }]
            // 配置
        }
    },
    created() {
        this.elId = uuidv1() //获取随机id
    },
    mounted() {
    },
    methods: {
        drawCharts: function(row, index) {
            var _this = this;
            var data = [];
            this.$nextTick(()=>{
            data=_this.table[index].kl;
            $("#sparkline-index" + index).sparkline(data, {
                type: 'line',
                width: '100%',
                height: '30px',
                lineColor: '#5096ff',
                spotColor: '',
                fillColor: ''
                });
            })
        },
    drawBars: function(name,row, index) {
      var _this = this;
      var data = [];
      this.$nextTick(()=>{
        var i=(name-1)*3
        for(var j=0;j<3;j++){
            data.push(_this.table[index].kl[i])
            i++
        }
        $("#"+name +"-index"+ index).sparkline(data, {
          type: 'bar',
          height: '30px',
          barWidth: 5,
          barSpacing: 5
        });
      })
    },
  },
  computed: {},
};
</script>
