<template>
    <div  style="width: 99.9%">
        <el-table 
            :header-cell-style="{
                backgroundColor: '#043a5c',
                color: '#ffffff',
                fontSize: '20px'
            }"
            :cell-style="{
                backgroundColor: '#043a5c',
                color: '#ffffff',
                fontSize: '16px'
            }"
            :data="tableData"
            border
            :height="height"
            style="width: 100%;height:50% ">
            <el-table-column
            prop="point"
            label="站场"
            align="center"
            >
            </el-table-column>
            <el-table-column
            prop="maop"
            label="MAOP(MPa)"
            align="center"
            >
            </el-table-column>
            <el-table-column
            prop="press"
            label="直接水击压力(MPa)"
            align="center"
            >
            </el-table-column>
            <el-table-column
            prop="flow"
            label="间接水击压力(MPa)"
            align="center"
            >
            </el-table-column>
            <el-table-column
            prop="time"
            label="关阀时间"
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
                height:0,
                tableData:[{
                    point:'茂名',
                    maop:'9',
                    press:'10',
                    flow:'8',
                    time:'≥360'
                },{
                    point:'阳江',
                    maop:'9',
                    press:'8',
                    flow:'6',
                    time:'≥120'
                },{
                    point:'恩平',
                    maop:'',
                    press:'',
                    flow:'',
                    time:''
                }]
			}
		},
		created(){
            this.elId = uuidv1() //获取随机id
            if(this.tableData.length>3){
                this.height=220
            }
            else{
                this.height=200
            }
  		},
		/*只要计算属性，这个function内部，所用到的任何data中的数据发送了变化，就会立即重新计算这个计算属性的值； */
		computed:{
		},
		mounted(){
		},
		watch:{
		},
		methods: {
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