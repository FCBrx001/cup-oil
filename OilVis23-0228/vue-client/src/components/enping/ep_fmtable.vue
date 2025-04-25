<template>
    <div> 
        <div>
            <el-table
        
            :data="tableData"
            :cell-style="setCellColor"
            :row-class-name="tableRowClassName"
            :header-cell-style="tableHeaderColor"
            style="width: 100% height: 100%">
            <!-- <el-table-column width="40"></el-table-column> -->
            <el-table-column prop="start_time" label="开始时间" style="width:40%"></el-table-column>
            <el-table-column prop="end_time" label="结束时间" style="width:40%"></el-table-column>
            <el-table-column prop="activity_stop" label="压力变化状态" style="width:30%"></el-table-column>
            
        </el-table>
        </div>
        <div style="margin-top: 7px ;float:right">
            <el-pagination
                @current-change="handleCurrentChange"
                :current-page="pagenum"
                :page-size="pagesize"
                layout="total, prev, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        
    </div>
</template>


<script>
    import uuidv1 from 'uuid/v1'
    import * as echarts from 'echarts'
    import { eventBus } from '../../main';
    import {MessageBox} from 'element-ui'

    export default{
        name: "App",
        data(){
            return {

                pagenum:1,
                pagesize:7,
                total:0,

                tableData: [],
                
                elid:'',
            }
        },
        mounted(){
            this.loadpage()        
        },
        
        created(){
            this.elid = uuidv1() //获取随机id
            
            
        },
        methods: {
            tableRowClassName({row, rowIndex}) {
                if (rowIndex === 1||rowIndex === 3) {
                return 'warning-row';
                } 
                return '';
            },
            setCellColor({row,column,rowIndex,columnIndex}) {
      
                return 'text-align:center;background-color: #003b5c; color:#ecedf1;height:60px'
            },
            tableHeaderColor({row,column,rowIndex,columnIndex}){
                return 'background:#aaaaaa;color:#ecedf1;font-wight:500;fontSize:20px;text-align:center'

            },
            loadpage(){
                let pagenum = this.pagenum
                let pagesize = this.pagesize
                this.$axios({
                    mrthid:'get',
                    url:'/ep/fm',
                    params:{
                        pagenum:pagenum,
                        pagesize:pagesize,
                    }
                }).then(res=>{
                    console.log('返回fmtable数据',res.data)
                    this.total = res.data[0]
                    this.tableData = res.data[1]
                    for(let i=0;i<5;i++){
                        var obj={}
                        this.tableData.push(obj)
                    }
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
