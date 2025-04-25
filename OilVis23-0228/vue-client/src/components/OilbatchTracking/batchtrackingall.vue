<template>
    <div  style="width: 99.9%">
        <div style="width:100%">
            <changedialog ref="changedialog" />
        </div>
        <el-table 
            :header-cell-style="tableHeaderColor"
            :cell-style="{
                backgroundColor: ' #000c3b',
                color: '#38b2ff',
                fontSize: '23px'
            }"
            :data="tableData"
            height="270px"
            style="width: 100%;height:50% ">
            <el-table-column
            prop="name"
            :label="'管段'"
            align="center"
            width="180px"
            >
            </el-table-column>
            <el-table-column
            prop="pre_type"
            :label="'前行油品'"
            align="center"
            width="180px"
            >
            </el-table-column>
            <el-table-column
            prop="fol_type"
            :label="'后行油品'"
            align="center"
            width="180px"
            >
            </el-table-column>
            <el-table-column
            prop="location"
            :label="'批次到站位置(km)'"
            width="240px"
            align="center"
            >
            </el-table-column>
            <el-table-column
            prop="time"
            :label="'预计到站时间'"
            align="center"
            >
            </el-table-column>
            <el-table-column label="操作"  align="center">
                <template slot-scope="scope">
                    <el-button type="danger" @click="changeevent(scope.row)">修改</el-button>
                </template>
            </el-table-column> 
        </el-table>
        <changedialog ref="changedialog"/>
    </div>
</template>

<script>
"use strict"; 
import uuidv1 from 'uuid/v1'
import * as echarts from 'echarts'
import { eventBus } from '../../main'
import changedialog from './input_dialog.vue'
  export default {
		name:'batchtrackingdetail',
        components:{
            'changedialog':changedialog
        },
		data(){
			return{
				/*子组件向父组件传递数据 */
				 elId: '',
                 tableid:'',
				 charts:null,
                 rowindex:0,
				 times:1,
                 time:'',
				 titleText:'',
                 oilname:[],
				 oildistance:[],
                 stationdis:[116800,94400,39900,48600,48600,48600,48600],
                 series:[],
                 data1:[],
                 data92:[],
                 flag:'',
                 data0:[],
                 datamm:[],
                 datayj:[],
                 dataep:[],
                 datahs:[],
                 datajm:[],
                 datagm:[],
                 colorFlag:'#a1ffff',
                 pipenames:['茂名-阳江','阳江-恩平','恩平-鹤山','鹤山-江门','江门-高明','高明-三水','三水-花都','三水-南海','顺德-江门','南沙-顺德'],
                 
                 tableData:[ ],
                 flag:[]
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
            eventBus.$on('oilDataChange', data =>{
                this.tableData=[]
                let data1=this.$store.state.paramsData
                let D_s = [data1.STN03_00_DI001A,data1.STN04_00_DI001A,data1.STN05_00_DI001A,data1.STN06_00_DI001A,data1.STN19_00_DI001A,data1.STN20_00_DI001A,data1.STN22_00_DI001A,data1.STN21_00_DI001A,,data1.STN06_00_DI303,data1.STN07_00_DI001A]
                for(let i = 0; i < data.length; i++){
                    this.DataChane(i,data[i],D_s[i])
                }
                
            })
           
		},
		watch:{
		},
		methods: {
            tableHeaderColor({row,column,rowIndex,columnIndex}){
                return 'backgroundColor:#001b50;color:#00f0ff;font-wight:500;fontSize:20px;text-align:center'

            },
            inputfile(e){
                this.tableData=this.tableData.splice(0)
                var that = this
                //连接ep_dialog组件修改
                try{
                    
                    const file = e.target.files[0]
                    const name = file.name
                    const size = file.size
                    // FileReader对象，h5提供的异步api，可以读取文件中的数据。
                    const reader = new FileReader()
                    reader.readAsText(file)
                    reader.onload = function (e) {
                        var daa=e.target.result.split('\n')
                        var pcname = daa[0].split(',')
                        var pcdata =[];
                        for(var i=1;i<daa.length;i++){
                            var data=daa[i].split(',')
                            pcdata.push(data)
                        }
                        var pcdata1=[]
                        var length=pcdata[0].length
                        for(var i=0;i<length;i++){
                            pcdata1[i]=new Array()
                        }
                        var time=[]
                        for(var j=2;j<length;j++){
                            pcdata1[j-2].push(pcdata[0][j])
                        }
                        for(var i=1;i<pcdata.length;i++){
                            time.push(pcdata[i][1])
                            for(var j=2;j<length;j++){
                                pcdata1[j-2].push(pcdata[i][j])
                            }
                        }
                        var nname=[]
                        for(var i=2;i<pcname.length;i++){
                            var x={
                                value:pcname[i],
                                label:pcname[i]
                            }
                            nname.push(x)
                        }
                        var pushdata={
                            index:that.rowindex,
                            name:nname,
                            value:pcdata1,
                            time:time
                        }
                        that.$refs.changedialog.openAdd(pushdata).then(res=>{
                            // console.log(res)
                        })
                    }
                }catch(err){
                    console.log(err)
                }
            },
            changeevent(row)
            {
                this.$refs.changedialog.openAdd(row).then(res=>{
					// console.log(res)
				})
                
            },
            eventsure(row,index){
                let table=this.table[index]
                this.$axios({
                    mrthid:'get',
                    url:'/OilBT/delete',
                    params:{
                        table:table,
                        name:row.name,
                        type:row.fol_type,
                        data:e.target.result
                    }
                }).then(res=>{

                })
            }, 
            DataChane(index,information,D_e){
                
                var data ={
                    name:this.pipenames[index],
                    pre_type:'',
                    fol_type:'',
                    location:'',
                    time:'',
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
                        // var timestamp = timestamp+8*60*60;
                        var timestamp = timestamp;
                        // 时间戳转为时间
                        var beijing_datetime = new Date(parseInt(timestamp) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
                    // if(information.data.length>1){\
                        data.fol_type=information.name[i]
                        if(i!=0){
                            data.pre_type=information.name[i-1]
                        }else{
                            if(D_e > 780){
                                data.pre_type = '0#柴油'
                            }else if(data.name[0] == '0#柴油'){
                                data.pre_type = '92#汽油'
                                
                            }else{
                                if(D_e > 745){
                                    data.pre_type = '95#汽油'
                                }else{
                                    data.pre_type = '92#汽油'
                                }
                            }
                        }
                        
                        data.location=(information.data[i]/1000).toFixed(1)
                        // data.time=beijing_datetime
                        data.time = new_datetime
                        data.index=i
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
.el-table--fit .el-table__cell.gutter {
    background: #001b50;
    border-right-width: 1px;
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
    border-right: 0px solid rgb(255, 255, 255);
}
.el-table--border .el-table__cell, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
    border-right: 0px solid #EBEEF5;
}
</style>
