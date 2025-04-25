<template>
    <div> 
        <el-button icon="el-icon-refresh" circle style="background-color: #013a7e" @click="getdata()"></el-button>
        <div :id="elid" :style="{width:'100%','height':chartHeight+'px'}">  
        </div>
    </div>
</template>


<script>
    import uuidv1 from 'uuid/v1'
    import * as echarts from 'echarts'
    import { eventBus } from '../../main'

    export default{
        name: "App",
        data(){
            return {
                chartWidth:400,
                chartHeight:200,
                data:[
                        { value: 0, name: '阀门内漏' },
                        { value: 0, name: '开关阀' },
                        { value: 0, name: '甩泵' },
                        { value: 0, name: '清管' },    
                    ],
                elid:'',
            }
        },
        mounted(){
            this.getdata()
            
        },
        
        created(){
            this.elid = uuidv1() //获取随机id
        },
        methods: {
            getdata(){
                const token = sessionStorage.getItem('token');
                this.$axios({
                    mrthid:'get',
                    url:'/Popup/warn_gkstatis',
                    headers: {
                    Authorization: `Bearer ${token}`  // 在请求头中附加 JWT Token
                },
                    params:{
                        stationname:'高明',
                        collectionname:'gkzql',
                    },
                }).then(res=>{
                    console.log('工况统计返回：',res.data[1].confirm_time)

                    this.data[0].value = res.data[1].confirm_time
                    this.data[1].value = res.data[2].confirm_time
                    this.data[2].value = res.data[3].confirm_time
                    this.data[3].value = res.data[4].confirm_time
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
                        radius: ['30%', '90%'],
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
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                        }
                    ]
                })
            }
            
        }
    }
</script>
