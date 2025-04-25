<template>
    <div> 
        <!-- <el-button icon="el-icon-refresh" circle style="background-color: #013a7e" @click="getdata()"></el-button> -->
        <div :id="elid" :style="{width:'100%','height':chartHeight+'px'}">  
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

                chartWidth:400,
                chartHeight:200,

                data:[
                        { value: 0, name: '修改' },
                        { value: 0, name: '确认' },
                    ],
                elid:'',
            }
        },
        mounted(){
            //获取初始准确率
            this.getdata()
            const token = sessionStorage.getItem('token');
            eventBus.$on('mm_gk_zql_sure',gkdata=>{
                
                this.$axios({
                    mrthid:'get',
                    url:'/Popup/warn_zql_sure',
                    headers: {
                    Authorization: `Bearer ${token}`  // 在请求头中附加 JWT Token
                },
                    params:{
                        stationname:'茂名',
                        collectionname:'gkzql',
                        gkname:'全部'
                    }
                }).then(res=>{
                    console.log('返回准确率',res.data[0].edit_time)
                    this.data[0].value = res.data[0].edit_time
                    this.data[1].value = res.data[0].confirm_time
                    this.drawchart()
                })
            })
            eventBus.$on('mm_gk_zql_error',gkdata=>{
                
                this.$axios({
                    mrthid:'get',
                    url:'/Popup/warn_zql_error',
                    headers: {
                    Authorization: `Bearer ${token}`  // 在请求头中附加 JWT Token
                },
                    params:{
                        stationname:'茂名',
                        collectionname:'gkzql',
                        gkname:'全部'
                    }
                }).then(res=>{
                    console.log('返回准确率',res.data[0].edit_time)
                    this.data[0].value = res.data[0].edit_time
                    this.data[1].value = res.data[0].confirm_time
                    this.drawchart()
                })
            })
        },
        
        created(){
            this.elid = uuidv1() //获取随机id
        },
        methods: {
            getdata(){
                const token = sessionStorage.getItem('token');
                console.log('准确率请求')
                this.$axios({
                    mrthid:'get',
                    url:'/Popup/warn_zql',
                    headers: {
                    Authorization: `Bearer ${token}`  // 在请求头中附加 JWT Token
                },
                    params:{
                        stationname:'茂名',
                        collectionname:'gkzql',
                        gkname:'全部'
                    }
                }).then(res=>{
                    console.log('返回准确率',res.data[0].edit_time)
                    this.data[0].value = res.data[0].edit_time
                    this.data[1].value = res.data[0].confirm_time
                    this.drawchart()
                })
            },
            drawchart(){
                this.charts = echarts.init(document.getElementById(this.elid));
                this.charts.clear();
                this.charts.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    // legend: {
                    //     orient: 'vertical',
                    //     left: 'left'
                    // },
                    series: [
                        {
                        
                        type: 'pie',
                        radius: '90%',
                        data: this.data,
                        label:{
                            show:true,
                            textStyle: {
                                fontSize: 20,
                                color:"#f2f6fc",
                            },
                        },
                        emphasis: {
                            itemStyle: {
                            shadowBlur: 0,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 1.5)'
                            }
                        }
                        }
                    ]
                })
            }
            
        }
    }
</script>
