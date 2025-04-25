<template>
    <div  style="width: 100%">
        <el-table 
            :header-cell-style="tableHeaderColor"
            :cell-style="{
                backgroundColor: '#000c3b',
                color: '#38b2ff',
                fontSize: '23px'
            }"
            :data="tableData"
            
            
            style="width: 100%;height:100% ">
                <el-table-column
                width="120px"
                prop="name"
                label="油品种类"
                align="center"
                >
                </el-table-column>
                <el-table-column
                prop="location"
                label="实时位置(km)"
                align="center"
                >
                </el-table-column>
                <el-table-column
                width="300px"
                prop="time"
                label="预计到站时间"
                align="center"
                >
                </el-table-column>
                <el-table-column
                prop="Vpc"
                label="注入体积(m³)"
                align="center"
                >
                </el-table-column>
                <el-table-column
                prop="Lpc"
                :label="'混油长度(m)'"
                align="center"
                >
                </el-table-column>
                <el-table-column
                prop="Hpc"
                :label="'混油量(m³)'"
                align="center"
                >
                </el-table-column>
        </el-table>
    </div>
</template>

<script>
"use strict"; 
import uuidv1 from 'uuid/v1'
import * as echarts from 'echarts'
import { eventBus } from '../../main';
  export default {
		name:'batchtrackingdetail',
		data(){
			return{
				/*子组件向父组件传递数据 */
				 elId: '',
                 position:['阳江','恩平','鹤山','江门','高明','三水','花都','南海','顺德','南沙'],
                 tableid:'',
				 charts:null,
				 times:1,
                 time:'',
				 titleText:'',
                 oilname:[],
				 oildistance:[],
                 series:[],
                 data1:[],
                 data92:[],
                 flag:'',
                 data0:[],
                 datamm:[],
                 datayj:[],
                 dataep:[],
                 datahs:[],
                 datagm:[],
                 colorFlag:'#a1ffff',
                 tableData:[{
                    name:'',
                    location:'',
                    time:'',
                    Vpc:'',
                    Lpc:'',
                    Hpc:''
                }]
			}
		},
		created(){
            this.elId = uuidv1() //获取随机id
            this.tableid= uuidv1()
            this.titleText="茂名->阳江"
            this.flag='茂名'
  		},
		/*只要计算属性，这个function内部，所用到的任何data中的数据发送了变化，就会立即重新计算这个计算属性的值； */
		computed:{
		},
		mounted(){
            eventBus.$on('stationChoose',(start,finish)=>{
                this.titleText=start+'->'+finish
                this.flag=start
                this.series[0]=''
                this.series[1]=''
                this.tableData=[{
                    name:'',
                    location:'',
                    time:'',
                    Vpc:'',
                    Lpc:'',
                    Hpc:''
                }]

            })
            
            eventBus.$on('oilDataChange', (result) =>{
                // console.log(this.$route.params.station)
                this.tableData=[]
                var index=this.position.indexOf(this.$route.params.station)
                // console.log(result[index])
                // console.log("station",this.$route.params.station)
                this.DataChane(result[index])
            })
		},
		watch:{
		},
		methods: {
            tableHeaderColor({row,column,rowIndex,columnIndex}){
               
                return 'backgroundColor:#001b50;color:#00f0ff;font-wight:500;fontSize:20px;text-align:center'
                // return 'background:#aaaaaa;color:#ecedf1;font-wight:500;fontSize:20px;text-align:center'
                // return 'background:#000c3b;color:#00f0ff;fontSize:25px;text-align:center'
            },
            DataChane(information){
                 var data ={
                    name:'',
                    location:'',
                    time:'',
                    Vpc:'',
                    Lpc:'',
                    Hpc:'',
                    index:0
                }
                for(let i=0;i<information.name.length;i++){
                    if(information.pretime[i]!='0'){
                        var T_pos = information.pretime[i].indexOf('T');
                        var Z_pos = information.pretime[i].indexOf('Z');
                        var year_month_day = information.pretime[i].substr(0,T_pos);
                        var hour_minute_second = information.pretime[i].substr(T_pos+1,Z_pos-T_pos-5);
                        var new_datetime = year_month_day+" "+hour_minute_second; // 2017-03-31 08:02:06

                        // 处理成为时间戳
                        timestamp = new Date(Date.parse(new_datetime));
                        timestamp = timestamp.getTime();
                        timestamp = timestamp/1000;

                        // 增加8个小时，北京时间比utc时间多八个时区
                        var timestamp = timestamp+8*60*60;

                        // 时间戳转为时间
                        var beijing_datetime = new Date(parseInt(timestamp) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
                    // if(information.data.length>1){\
                        
                        data.name=information.name[i]
                        data.location=(information.data[i]/1000).toFixed(1)
                        data.time=new_datetime
                        data.index=i
                        data.Vpc=parseFloat(information.batch_v[i]).toFixed(2)
                        // data.Lpc=parseFloat(information.mix_l[i]).toFixed(2)
                        data.Hpc=parseFloat(information.hy_v[i]).toFixed(2)
                        let objCopy = JSON.parse(JSON.stringify(data));
                        // console.log(data)
                        this.tableData.push(objCopy)
                        // this.tableData[i].Vpc=information.data[0] ? (information.data[0]/1000).toFixed(1) : ''
                        // this.tableData[i].Hpc=information.data[0] ? (information.data[0]/1000).toFixed(1) : ''
                        // this.tableData[i].Lpc=information.data[0] ? (information.data[0]/1000).toFixed(1) : ''
                        // }else{
                        //     this.tableData[0].name='',
                        //     this.tableData[0].location=''
                        //     this.tableData[0].time=''
                        //     this.tableData[0].Vpc=''
                        //     this.tableData[0].Hpc=''
                        //     this.tableData[0].Lpc=''
                        // }
                    }
                }
            }
		}
	}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.el-table--border, .el-table--group {
    border: 0px;
}
.el-table--border th.el-table__cell.gutter:last-of-type {
    background: #001b50;
}
.el-table--border, .el-table--group {
    border:0px;
}
.el-table td,.el-table th.is-leaf {
    border-bottom: 1px solid rgb(255, 255, 255);
}
.el-table--border th,.el-table--border th.gutter:last-of-type {
    border-bottom: 1px solid rgb(255, 255, 255);
}
</style>