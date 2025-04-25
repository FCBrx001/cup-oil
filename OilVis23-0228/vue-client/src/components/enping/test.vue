<template>
    <div> 
        <el-table
            :data="tableData"
            
            :cell-style="setCellColor"
            :row-class-name="tableRowClassName"
            :header-cell-style="tableHeaderColor"
            style="width: 100% height:100%">
            
            
            <el-table-column prop="station" label="站名" width="70"></el-table-column>
            <el-table-column prop="event_type" label="事件类型" width="75"></el-table-column>
            <el-table-column prop="warnId" label="警告ID" width="90"></el-table-column>
            <el-table-column prop="leak" label="流量" width="70"></el-table-column>
            <el-table-column prop="pressure" label="压力" width="80"></el-table-column>
            <el-table-column prop="temperature" label="温度" width="75"></el-table-column>
            <el-table-column prop="warn_type" label="事件名称" width="80"></el-table-column>
            <el-table-column prop="event_state" label="状态" width="70"></el-table-column>
            
            <el-table-column :render-header="renderHeader" width="195">
                
                <template slot-scope="scope">
                    <el-button type="danger" @click="changeevent(scope.row)">更改</el-button>
                    <el-button type="success" @click="eventsure(scope.row)">确认</el-button>
                </template>
            </el-table-column>
           
        </el-table>




        <!-- <div style="padding: 12px 0">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-sizes="[2, 5, 10, 20]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div> -->
        <epdialog ref="epdialog"/>
        <el-dialog title="历史工况表单" :visible.sync="tabledetailVisible" >
            <el-table
                :data="tabledetailData"
                
                :cell-style="setCellColor"
                :row-class-name="tableRowClassName"
                :header-cell-style="tableHeaderColor"
                style="width: 100% height:100%">
                
                
                <el-table-column prop="station" label="站名" width="70"></el-table-column>
                <el-table-column prop="event_type" label="事件类型" width="75"></el-table-column>
                <el-table-column prop="warnId" label="警告ID" width="90"></el-table-column>
                <el-table-column prop="leak" label="流量" width="70"></el-table-column>
                <el-table-column prop="pressure" label="压力" width="80"></el-table-column>
                <el-table-column prop="temperature" label="温度" width="75"></el-table-column>
                <el-table-column prop="warn_type" label="事件名称" width="80"></el-table-column>
                <el-table-column prop="event_state" label="状态" width="70"></el-table-column>
                
                <el-table-column label="操作" width="195">
                    
                    <template slot-scope="scope">
                        <el-button type="danger" @click="changeevent(scope.row)">更改</el-button>
                        <el-button type="success" @click="eventsure(scope.row)">确认</el-button>
                    </template>
                </el-table-column>
            
            </el-table>
            <el-pagination
                @current-change="handleCurrentChange"
                :current-page="pagenum"
                :page-size="pagesize"
                layout="total, prev, next, jumper"
                :total="total">
            </el-pagination>
            
        </el-dialog>
        
    </div>
</template>


<script>
    import uuidv1 from 'uuid/v1'
    import * as echarts from 'echarts'
    import { eventBus } from '../../main';
    import {MessageBox} from 'element-ui'
    //import queue from '../../utils/queue'
    const queue = require('../../utils/queue')
    import epdialog from './ep_dialog.vue'

    export default{
        name: "App",
        components: {
            'epdialog': epdialog
        },
        data(){
            return {
                tabledetailVisible:false,
                count: 0,//记录队列的数量
                lowestCount: 0,//记录当前队列顶部的位置

                tableData: [],
                tabledetailData:[],
                pagenum:1,
                pagesize:7,
                total:0,
                // tableData2: [{
                //     'station':'恩平站',
                //     'event_type': '工况报警',
                //     'warnId': '202002013',
                //     'leak':'0.654',
                //     'pressure':'187.8169',
                //     'temperature':'91.75074',
                //     'warn_type':'甩泵',
                //     'event_state':'未处理'
                // },{
                //     'station':'恩平站',
                //     'event_type': '工况报警',
                //     'warnId': '202002014',
                //     'leak':'0.654',
                //     'pressure':'187.8169',
                //     'temperature':'91.75074',
                //     'warn_type':'甩泵',
                //     'event_state':'未处理'
                // },{
                //     'station':'恩平站',
                //     'event_type': '阀门打开',
                //     'warnId': '202002015',
                //     'leak':'0.654',
                //     'pressure':'187.8169',
                //     'temperature':'91.75074',
                //     'warn_type':'阀门内漏',
                //     'event_state':'未处理'
                // },{
                //     'station':'恩平站',
                //     'event_type': '工况报警',
                //     'warnId': '202002016',
                //     'leak':'0.654',
                //     'pressure':'187.8169',
                //     'temperature':'91.75074',
                //     'warn_type':'阀门打开',
                //     'event_state':'未处理'
                // },{
                //     'station':'恩平站',
                //     'event_type': '工况报警',
                //     'warnId': '202002017',
                //     'leak':'0.654',
                //     'pressure':'187.8169',
                //     'temperature':'91.75074',
                //     'warn_type':'清管',
                //     'event_state':'未处理'
                // }],
                warn_kind:['','阀门内漏','清管','甩泵','阀门打开','阀门关闭','其他工况'],
                
                eventsure_times:0,
                eventerror_times:0,

                elid:'',
            }
        },
        mounted(){
            
            eventBus.$on('ep_warn',data=>{
                //data是一个集合
                console.log('ep_warn',data)
                data['station']='恩平站'
                data['event_type']='工况报警'
                data['event_state']='未处理'
                //this.datato_gkstatis(data)
                this.adddata(data)               
            })
            
        },
        
        created(){
            this.elid = uuidv1() //获取随机id
            
        },
        methods: {
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
            tableHeaderColor({row,column,rowIndex,columnIndex}){
                return 'background:#B9D9E9;color:#606266;font-wight:500;fontSize:20px;text-align:center'

            },
            setCellColor({row,column,rowIndex,columnIndex}) {

                if(columnIndex==7)
                {
                    console.log('Row:',row)
                    if(row.event_state=='未处理')
                    {
                        return 'color:rgb(243, 9, 9);text-align:center;'
                    } 
                    else{
                        return 'text-align:center;'
                    }
                     
                    //return rgb(3, 13, 73)
                }else{
                    return 'text-align:center;'
                }
                
            },

            adddata(data){
                console.log('tableData长度',this.tableData.length)
                data['warn_type'] = this.warn_kind[data.warn_type]
                // console.log('@@@转换事件',data['event_type'])
                if(this.tableData.length < 5)
                {                   
                    this.tableData.push(data)
                }else{
                    
                    this.tableData.push(data)
                    var table = []
                    for(let i=1;i<=5;i++)
                    {
                        table.push(this.tableData[i])
                    }
                    this.tableData = []
                    this.tableData = table
                    // console.log('@@@@tabledata',tableData)
                }
            },
            // datato_gkstatis(data)
            // {
            //     var gkdata = data.warn_type
            //     console.log('@@@gkdata',gkdata)
            //     eventBus.$emit('ep_gktype',gkdata)
            // },
            changeevent(row)
            {
                //连接ep_gk_zql组件
                this.eventerror_times++
                eventBus.$emit('ep_gk_zql_error',this.eventerror_times)
                //处理事件状态逻辑
                console.log('更改当前行',row)
                
                for(let i=0;i<5;i++)
                {
                    if(this.tableData[i].warnId==row.warnId)
                    {
                        this.tableData[i].event_state='已处理'
                        console.log('')
                        break;
                    }
                }
                this.tableData=this.tableData.splice(0)
                this.$refs.epdialog.openAdd().then(res=>{
					console.log(res)
				})
                //连接ep_dialog组件修改
                
            },
            eventsure(row){
                //连接ep_gk_zql组件
                this.eventsure_times++
                eventBus.$emit('ep_gk_zql_sure',this.eventsure_times)
                //处理事件状态逻辑
                console.log('更改当前行',row)
                for(let i=0;i<5;i++)
                {
                    if(this.tableData[i].warnId==row.warnId)
                    {
                        this.tableData[i].event_state='已处理'
                        break;
                    }
                }
                this.tableData=this.tableData.splice(0)
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
                    }
                }).then(res=>{
                    console.log('返回数据',res.data)
                    this.total = res.data[1]
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
<style >
.el-table .warning-row {
background: #E9F6F3;
}

.el-table .success-row {
background: #E9F6F3;
}
.el-table .warn-row {
background: #C1FFC1;
}
</style>
