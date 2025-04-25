<template>
    <div  style="width: 99.9%">
        <el-table 
            :header-cell-style="{
                backgroundColor: '#043a5c',
                color: '#ffffff',
                fontWeight: '800',
                fontSize: '20px'
            }"
            :cell-style="{
                backgroundColor: '#043a5c',
                color: '#ffffff',
                fontWeight: '600',
                fontSize: '16px'
            }"
            :data="tableData"
            border
            
            style="width: 100%;height:100% ">
            <el-table-column
            prop="name"
            label="站场"
            align="center"
            >
            </el-table-column>
            <el-table-column
            prop="type"
            label="MOAP(MPa)"
            align="center"
            >
            </el-table-column>
            <el-table-column
            prop="location"
            label="直接水击压力(MPa)"
            align="center"
            >
            </el-table-column>
            <el-table-column
            prop="time"
            label="间接水击压力(MPa)"
            align="center"
            >
            </el-table-column>
             <el-table-column
            prop="time"
            label="关阀时间(s)"
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
                    name:'茂名-阳江',
                    type:'',
                    location:'',
                    time:''
                },{
                    name:'阳江-恩平',
                    type:'',
                    location:'',
                    time:''
                },{
                    name:'恩平-鹤山',
                    type:'',
                    location:'',
                    time:''
                },{
                    name:'鹤山-江门',
                    type:'',
                    location:'',
                    time:''
                }]
			}
		},
		created(){
            this.elId = uuidv1() //获取随机id
            this.tableid= uuidv1()
  		},
		/*只要计算属性，这个function内部，所用到的任何data中的数据发送了变化，就会立即重新计算这个计算属性的值； */
		computed:{
		},
		mounted(){
            eventBus.$on('oilDistanceChange', (datamm,datayj,dataep,datahs,datagm) =>{
                this.datamm=datamm
                this.datayj=datayj
                this.dataep=dataep
                this.datahs=datahs
                this.datagm=datagm
                this.DataChane()
            })
		},
		watch:{
		},
		methods: {
            DataChane(){
                if(this.datamm.data.length>1){
                    this.tableData[0].type='0#柴油'
                    this.tableData[0].location=(this.datamm.data[0]/1000).toFixed(1)+' km'
                    this.tableData[0].time=this.datamm.pretime
                }else{
                    this.tableData[0].type=''
                    this.tableData[0].location=''
                    this.tableData[0].time=''
                }

                if(this.datayj.data.length>1){
                    this.tableData[1].type='0#柴油'
                    this.tableData[1].location=(this.datayj.data[0]/1000).toFixed(1)+' km'
                    this.tableData[1].time=this.datayj.pretime
                }else{
                    this.tableData[1].type=''
                    this.tableData[1].location=''
                    this.tableData[1].time=''
                }

                if(this.dataep.data.length>1){
                    this.tableData[2].type='0#柴油'
                    this.tableData[2].location=(this.dataep.data[0]/1000).toFixed(1)+' km'
                    this.tableData[2].time=this.dataep.pretime
                }else{
                    this.tableData[2].type=''
                    this.tableData[2].location=''
                    this.tableData[2].time=''
                }

                if(this.datahs.data.length>1){
                    this.tableData[3].type='0#柴油'
                    this.tableData[3].location=(this.datahs.data[0]/1000).toFixed(1)+' km'
                    this.tableData[3].time=this.datahs.pretime
                }else{
                    this.tableData[3].type=''
                    this.tableData[3].location=''
                    this.tableData[3].time=''
                }
            }
		}
	}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.el-table--border:after,.el-table--group:after,.el-table:before {
    background-color: rgb(255, 255, 255);
}
.el-table--border,.el-table--group {
    border-color: rgb(255, 255, 255);
}
.el-table td,.el-table th.is-leaf {
    border-bottom: 1px solid rgb(255, 255, 255);
}
.el-table--border th,.el-table--border th.gutter:last-of-type {
    border-bottom: 1px solid rgb(255, 255, 255);
}
.el-table--border td,.el-table--border th {
    border-right: 1px solid rgb(255, 255, 255);
}
</style>