<template>
    <div  style="width: 99.9%">
        <el-table 
            :header-cell-style="tableHeaderColor"
            :cell-style="{
                backgroundColor: '#000c3b',
                color: '#38b2ff',
                fontSize: '23px'
            }"
            :data="tableData"
            height="20rem"
            style="width: 100%;height:50% ">
            <el-table-column
            prop="point"
            label="沿线危险点"
            align="center"
            >
            </el-table-column>
            <el-table-column
            prop="location"
            :label="'位置(km)'"
            align="center"
            >
            </el-table-column>
            <el-table-column
            prop="maop"
            :label="'MAOP(MPa)'"
            align="center"
            >
            </el-table-column>
            <el-table-column
            prop="press"
            :label="'压力(MPa)'"
            align="center"
            >
            </el-table-column>
            <el-table-column
            prop="flow"
            :label="'流量(m³/h)'"
            align="center"
            >
            </el-table-column>
            <el-table-column
            width="270px"
            prop="time"
            label="时刻"
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
                tableData:[],
                stationname:['阳江','恩平','鹤山','江门','高明','三水','花都','南海','顺德','南沙'],
                stationdis:[0,116800,211200,251100,299700,364500,396600,442300,35800,55100]
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
            // this.data1=this.$store.state.paramsData
            eventBus.$on('MAOP_Changed',data=>{
                if(this.$route.params.station !== '顺德'|| this.$route.params.station !== '南沙'){

                
                    let test_data=data[this.$route.params.station]
                    console.log('test',test_data)
                    let index = this.stationname.indexOf(this.$route.params.station)
                    var flag=0
                    var result=[]
                    for(let i=0;i<test_data['时刻'].length;i++){
                        var x={}
                        //console.log(data[name])
                        let maop =test_data['MAOP（MPa）'][i]
                        let press=test_data['监测压力（MPa）'][i]
                        x['point']=flag+'号'
                        x['location']=((parseFloat(test_data['位置（km）'][i])-this.stationdis[index])/1000) .toFixed(2)
                        x['maop']=maop
                        x['flow']=parseFloat(test_data['流量（m3/h）'][i]).toFixed(2)
                        x['press']=parseFloat(press).toFixed(2)
                        x['time']=test_data['时刻'][i]
                        result.push(x)
                    }
                    this.tableData=result
                }
            })
		},
		watch:{
            // "$store.state.paramsData":{
            //     deep:true,//深度监听设置为 true
            //     handler:function(newVal,oldVal){
            //         let p_out=['STN02_00_PI012','STN03_00_PI008','STN04_00_PI007','STN06_00_PI007A','STN19_00_PI027A']
            //         // console.log("数据发生变化啦"); //修改数据时，能看到输出结果
            //         // console.log(newVal,oldVal);
            //         let p =0
            //         let position = [0,116.8,94.4,39.9,48.6,35.8,55.1,40.5,52.8]
            //         let time = new Date();
            //         let location = 2.5
            //         for(let i=0;i<5;i++){
            //             p+=i*5
            //             this.tableData[i].location=p.toString()
            //             this.tableData[i].maop= 10
            //             this.tableData[i].flow=0
            //             this.tableData[i].press=this.data1[p_out[i]].toFixed(2)
            //             this.tableData[i].time=time.toLocaleString()
            //         }
            //     }
            // }
		},
		methods: {
            tableHeaderColor({row,column,rowIndex,columnIndex}){
                if(columnIndex>=1 && columnIndex<=3){
                    return 'backgroundColor:#001b50;color:#00f0ff;font-wight:500;fontSize:19px;text-align:center'
                }
                return 'backgroundColor:#001b50;color:#00f0ff;font-wight:500;fontSize:20px;text-align:center'

            },
		}
	}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
