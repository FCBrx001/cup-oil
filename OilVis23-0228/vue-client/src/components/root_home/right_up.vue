<template>
    
    <div  style="width:100%;height:100%">
        <div :id="elid" style="width:100%;height:100%">
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
                times:1,
                chartdata:[],
                chartWidth:500,
                chartHeight:340,
                elid:''
            }
        },
        mounted(){
            this.datainit()
            
        },
        created(){
            this.elid = uuidv1() //获取随机id
        },
        methods: { 
            datainit(){
                this.$axios({
                    mrthid:'get',
                    url:'/Popup/qxgk',
                    
                }).then(res=>{
                    console.log('工况',res)
                    this.chartdata = res.data
                    this.drawchart()
                })
            },
            drawchart(){
               if(this.times==1){
				   this.charts = echarts.init(document.getElementById(this.elid));
				   this.times++;
			    }
			    this.charts.clear();
			    this.charts.on("click", this.eConsole);
                this.charts.setOption({
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                        // Use axis to trigger tooltip
                        type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
                        }
                    },
                    legend: {
                        top:'2%',
                        textStyle:{
                            color:'white',
                            fontSize:20
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value'
                    },
                    yAxis: {
                        type: 'category',
                        data: ['茂名', '阳江','恩平', '鹤山','江门','高明','三水','花都','南海'],
                        axisLabel:{
                            fontSize:25,
                            color:'white'
                        }
                    },
                    series: [
                        {
                            name: '阀门内漏状态',
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: true,
                                fontSize:20
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            data: this.chartdata[0]
                        },
                        {
                            name: '阀门状态',
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: true,
                                fontSize:20
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            data: this.chartdata[1]
                        },
                        {
                            name: '主输泵状态',
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: true,
                                fontSize:20
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            data: this.chartdata[2]
                        },
                        {
                            name: '清管状态',
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: true,
                                fontSize:20
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            data: this.chartdata[3]
                        }
                        
                    ]
			    },true);
			    
            },

            
        },
        watch:{
            

        }
    }
</script>
