<template>
    <div> 
        

        <el-table
            :data="tableData"
            :cell-style="setCellColor"
            :row-class-name="tableRowClassName"
            :header-cell-style="tableHeaderColor"
            style="width: 100% height: 100%">
            
            <el-table-column prop="station" label="站名"></el-table-column>
            <!-- <el-table-column prop="uuid" v-if="false" label="警告Id" style='width: 7%'></el-table-column> -->
            <el-table-column prop="datetime" label="时间"></el-table-column>
            
            <el-table-column prop="valve_state" label="EVO011A阀门状态" :formatter="valve_stateFormat"></el-table-column>
            <el-table-column prop="valve_leakage" label="EVO011A阀门内漏状态" :formatter="valve_leakageFormat"></el-table-column>
            <el-table-column prop="pig_state" label="清管状态" :formatter="pig_stateFormat"></el-table-column>
            <el-table-column prop="pump_state" label="主输泵状态" :formatter="pump_stateFormat"></el-table-column>
            <el-table-column prop="state" label="处理状态"></el-table-column>
               
            <!-- <el-table-column :render-header="renderHeader" width="195"> -->
            <el-table-column label="操作">   
                <template slot-scope="scope">
                    <el-button type="danger" @click="change(scope.row)">更改</el-button>
                    <el-button type="success" @click="sure(scope.row)">确认</el-button>
                </template>
            </el-table-column>
        </el-table>
        
        
    </div>
</template>


<script>
    import uuidv1 from 'uuid/v1'
    import * as echarts from 'echarts'
    import { eventBus } from '../../main.js';
    import {MessageBox} from 'element-ui'
    import epdialog from './ep_dialog.vue'

    export default{
        name: "App",
        components: {
            'epdialog': epdialog
        },
        data(){
            return {

                // loginType:'username',
                lastonedata:{},
                tabledetailVisible:false,
                pagenum:1,
                pagesize:7,
                total:0,
                tabledetailData:[],


                count: 0,//记录队列的数量
                lowestCount: 0,//记录当前队列顶部的位置
                

                tableData: [],
                warn_kind:['','阀门内漏','清管','甩泵','阀门打开','阀门关闭','其他工况'],
                
                eventsure_times:0,
                eventerror_times:0,

                elid:'',
            }
        },
        mounted(){
            
            eventBus.$on('mm_datawarn',data=>{
                if(data['valve_leakage'] === 'leakage' || data['pig_state'] ==='JMZpig' || data['pump_state'] ==='pump2_stop_working'){
                    data['datetime'] = this.datetrans(data['datetime'])
                
                    this.adddatanew(data) 
                }     
            })
        },
        
        created(){
            this.elid = uuidv1() //获取随机id  
            
        },
        methods: {
            
            datetrans(timespan){
                let date = new Date(timespan)
                    
                const Y = date.getFullYear()+'-';
                const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)+'-';
                const D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate());
                const h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours())+':';
                const min = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())+':'
                const s = (date.getSeconds() < 10 ? '0' +date.getSeconds() : date.getSeconds()); // 秒
                let datetime = Y+M+D+' '+h+min+s
                console.log('date',date)
                console.log('datetime',datetime)

                return datetime
            },
            valve_stateFormat(row, column) {
                if (row.valve_state === 'open') {
                    return '打开'
                } else if(row.valve_state === 'close')  {
                    return '关闭'
                } else{
                    return '---'
                }
            },
            valve_leakageFormat(row,column){
                if (row.valve_leakage === 'normal') {
                    return '正常'
                } else if(row.valve_leakage === 'leakage') {
                    return '疑似内漏'
                } else {
                    return '---'
                }
            },
            pig_stateFormat(row,column){
                if (row.pig_state === 'normal') {
                    return '正常'
                } else if(row.pig_state === 'JMZpig'){
                    return '清管'
                } else{
                    return '---'
                }
            },
            pump_stateFormat(row,column){
                if (row.pump_state === 'normal') {
                    return '正常'
                } else  if(row.pump_state === 'pump2_stop_working'){
                    return '泵压力异常'
                } else{
                    return '---'
                }
            },
            closeDialog(){
                this.loadpage()
            },

            tableHeaderColor({row,column,rowIndex,columnIndex}){
                return 'background:#001b50;color:#00f0ff;font-wight:500;fontSize:18px;text-align:center'

            },
            renderHeader(h) {
                return(
                    <el-button round icon="el-icon-edit" onClick={()=>this.tabledetail()}>全部操作</el-button>
                )
            },
            tableRowClassName({row, rowIndex}) {
                if (rowIndex === 1||rowIndex === 3) {
                return 'warning-row';
                } 
                return '';
            },
            //设置表头行的样式
            setCellColor2({row,column,rowIndex,columnIndex}) {

                if(columnIndex==6)
                {
                    console.log('Row:',row)
                    if(row.state=='未处理')
                    {
                        return 'color:#fc8452;text-align:center;font-wight:500;fontSize:20px;background-color: #000c3b;'
                    } 
                    else{
                        return 'text-align:center;background-color: #000c3b; color:#ecedf1;fontSize:16px'
                    }
                     
                    //return rgb(3, 13, 73)
                }else{
                    return 'text-align:center;background-color: #000c3b; color:#ecedf1;fontSize:16px'
                }
                
            },
            setCellColor({row,column,rowIndex,columnIndex}) {

                if(columnIndex==6)
                {
                    console.log('Row:',row)
                    if(row.state=='未处理')
                    {
                        return 'color:#fc8452;text-align:center;font-wight:500;fontSize:20px;background-color: #000c3b;'
                    } 
                    else{
                        return 'text-align:center;background-color: #000c3b; color:#38b2ff;fontSize:16px'
                    }
                     
                    //return rgb(3, 13, 73)
                }else{
                    return 'text-align:center;background-color: #000c3b; color:#38b2ff;fontSize:16px'
                }
                
            },
            adddatanew(data){
                //判断上一时刻的值和当前时刻是否相同
                console.log()
                var check = 0
                for(let i in data)
                {
                    if(this.lastonedata[i]!=data[i])
                    {                       
                        check++
                    }
                }
                console.log('不同值个数：',check)
                if(check>2){
                    this.lastonedata = data
                    this.adddata(data)
                }
            },
            adddata(data){
                this.$message.success(`${data.station}工况警告！`)
                //暂时禁用
                // this.$axios({
                //     mrthid:'get',
                //     url:'/Popup/warn_inserone',
                //     params:{
                //         uuid:data.uuid,
                //         stationname:'茂名',
                //         collectionname:'label_one',
                //         valve_state:data.valve_state,
                //         valve_leakage:data.valve_leakage,
                //         pig_state:data.pig_state,
                //         pump_state:data.pump_state,
                //         station:data.station,
                //         state:'未处理'
                //     }
                // }).then(res=>{
                //     if(res.data == 'success')
                //     {
                //         console.log('返回结果：')
                //     }
                // })
                //放入tableData
                if(this.tableData.length<2)
                {
                    this.tableData.push(data)
                }else{
                    var newtabledata = []
                    for(var i=1;i<1;i++)
                    {
                        newtabledata[i-1] = this.tableData[i] 
                    }
                    newtabledata.push(data)
                    this.tableData = newtabledata
                }
            },
            // changeeventdia(row){
            //     //连接ep_gk_zql组件
            //     eventerror_times++
            //     eventBus.$emit('mm_gk_zql_error',this.eventerror_times)
            //     //处理事件状态逻辑
            //     console.log('更改当前行',row)
                
            //     for(let i=0;i<5;i++)
            //     {
            //         if(this.tabledetailData[i].uuid==row.uuid)
            //         {
            //             this.tabledetailData[i].state='已处理'
            //             console.log('')
            //             break;
            //         }
            //     }
            //     this.tabledetailData=this.tabledetailData.splice(0)
            //     this.$refs.epdialog.openAdd(row).then(res=>{
			// 		console.log(res)
			// 	})
            //     //连接ep_dialog组件修改
            // },
            change(row){
                
                if(row.state=="已处理"){
                    alert('当前行已完成处理！')
                }else{
                    this.changeeventdia(row) 
                }
            },
            sure(row){
                if(row.state=="已处理"){
                    alert('当前行已完成处理！')
                }else{
                    this.eventsuredia(row) 
                }
            },
            changeeventdia(row)
            {
                //连接ep_gk_zql组件
                this.eventerror_times++
                eventBus.$emit('mm_gk_zql_error',this.eventerror_times)
                //处理事件状态逻辑
                console.log('更改当前行',row)
                
                for(let i=0;i<5;i++)
                {
                    if(this.tableData[i].uuid==row.uuid)
                    {
                        this.tableData[i].state='已处理'
                        console.log('')
                        break;
                    }
                }
                this.tableData=this.tableData.splice(0)
                this.$refs.epdialog.openAdd(row).then(res=>{
					console.log(res)
				})
                //连接ep_dialog组件修改
            },
            // eventsuredia(row){
            //     this.eventsure_times++
            //     eventBus.$emit('mm_gk_zql_sure',this.eventsure_times)
            //     //处理事件状态逻辑
            //     console.log('更改当前行',row)
            //     for(let i=0;i<5;i++)
            //     {
            //         if(this.tabledetailData[i].uuid==row.uuid)
            //         {
            //             this.tabledetailData[i].state='已处理'
            //             break;
            //         }
            //     }
            //     this.tabledetailData=this.tabledetailData.splice(0)
            //     this.$message.success('确认成功')
            //     //访问数据库更改状态值为已处理
            //     this.$axios({
            //         mrthid:'get',
            //         url:'/Popup/warn_sure',
            //         params:{
            //             stationname:'茂名',
            //             collectionname:'label',
            //             uuid:row.uuid,
            //         }
            //     }).then(res=>{
            //         if(res.data == 'success')
            //         {
            //             console.log('返回结果：',)
            //         }
            //     })
            //     this.loadpage()
            // },
            eventsuredia(row){
                //连接ep_gk_zql组件
                this.eventsure_times++
                eventBus.$emit('mm_gk_zql_sure',this.eventsure_times)
                //处理事件状态逻辑
                // console.log('更改当前行',row)
                for(let i=0;i<5;i++)
                {
                    if(this.tableData[i].uuid==row.uuid)
                    {
                        this.tableData[i].state='已处理'
                        break;
                    }
                }
                this.tableData=this.tableData.splice(0)
                this.$message.success('确认成功')
                //访问数据库更改状态值为已处理
                this.$axios({
                    mrthid:'get',
                    url:'/Popup/warn_sure',
                    params:{
                        stationname:'茂名',
                        collectionname:'label',
                        uuid:row.uuid,
                        valve_state:row.valve_state,
                        valve_leakage:row.valve_leakage,
                        pig_state:row.pig_state,
                        pump_state:row.pump_state
                    }
                }).then(res=>{
                    if(res.data == 'success')
                    {
                        console.log('返回结果：',)
                    }
                })
                this.loadpage()

                
            },
            tabledetail(){
                this.tabledetailVisible=true;
                this.loadpage()
            },
            loadpage(){
                let pagenum = this.pagenum
                let pagesize = this.pagesize
                const token = sessionStorage.getItem('token');
                this.$axios({
                    mrthid:'get',
                    url:'/Popup/warn_page',
                    headers: {
                    Authorization: `Bearer ${token}`  // 在请求头中附加 JWT Token
                },
                    params:{
                        pagenum:pagenum,
                        pagesize:pagesize,
                        stationname:'茂名',
                        collectionname:'label'
                    }
                }).then(res=>{
                    console.log('返回数据',res.data)
                    this.total = res.data[1]
                    for(let i in res.data[0]){
                        res.data[0][i]['datetime'] = this.datetrans(res.data[0][i]['datetime'])
                    }
                    this.tabledetailData = res.data[0]
                })
            },
            handleCurrentChange(pagenum){
                console.log('pagenum',pagenum)
                this.pagenum = pagenum
                this.loadpage()
            }  
        }
    }
</script>