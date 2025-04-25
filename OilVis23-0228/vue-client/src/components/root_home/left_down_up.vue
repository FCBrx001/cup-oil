<template>
    <div class="root_chart_leftdown">
        <div :id="elid" :style="{'width':chartWidth+'px','height':chartHeight+'px'}"></div>  
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
                
                xData :['茂名', '阳江', '恩平', '鹤山', '江门', '高明', '三水', '花都'],
                yData :[22,52,55,12,35,44,16,48],
                yData1 :[32,42,50,22,30,40,35,42],
                chartWidth:430,
                chartHeight:240,
                
            }
        },
        mounted(){
            this.drawchart()
        },
        created(){
            this.elid = uuidv1() //获取随机id
            
        },
        methods: { 
            
            drawchart(){
                this.charts = echarts.init(document.getElementById(this.elid));
                this.charts.clear();
			    this.charts.on("click", this.eConsole);
                this.charts.setOption({
                    legend: {
                    data: ['进站温度', '出站温度'],
                    show:true,
                    right: '10%',
                        
                    itemGap: 16,
                    itemWidth: 18,
                    itemHeight: 10,
                    selectedMode: false,
                    
                    textStyle: {
                            color: '#9AAFC2',
                            fontStyle: 'normal',
                            fontFamily: '微软雅黑',
                            fontSize: 15,
                    },
                    
                    },
                    //backgroundColor: '#062544',
                    grid: {
                    top: '10%',
                    left: '5%',
                    bottom: '5%',
                    right: '5%',
                    containLabel: true,
                    },
                    tooltip: {
                    trigger: 'item',
                    },
                    animation: false,
                    xAxis: [
                    {
                        type: 'category',
                        data: this.xData,
                        axisTick: {
                        alignWithLabel: true,
                        },
                        axisLine: {
                        show: true,
                        },
                        axisLabel: {
                        textStyle: {
                            color: '#ddd',
                        },
                        margin: 30,
                        },
                        interval: 1,
                    },
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: "单位：摄氏度",
                            nameTextStyle: {
                                color: "#9AAFC2",
                                lineHeight: 20,
                                padding: [0, 0, 10, 0],
                            },
                            splitNumber: 5,
                            axisLabel: {
                                textStyle: {
                                    color: '#9AAFC2',
                                    fontStyle: 'normal',
                                    fontFamily: '微软雅黑',
                                    fontSize: 14,
                                },
                            },
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: '#506B98',
                                },
                            },
                            axisTick: {
                                show: false,
                            },
                            splitLine: {
                                show: false,
                                lineStyle: {
                                    color: ['#fff'],
                                    opacity: 0.06,
                                },
                            },
                        },
                    ],
                    series: [
                    
                    
                    {
                        name: '进站温度',
                        type: 'bar',
                        barWidth: '10',
                        barGap: '10%', // Make series be overlap
                        barCateGoryGap: '10%',
                        itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 0.7, [
                            {
                                offset: 0,
                                color: 'rgba(210,210,210,0.3)',
                            },
                            {
                                offset: 1,
                                color: '#E7AB47',
                            },
                            ]),
                            opacity: 0.8,
                        },
                        },
                        data: this.yData,
                    },
                    {
                        name: '出站温度',
                        type: 'bar',
                        barWidth: '10',
                        barGap: '10%', // Make series be overlap
                        barCateGoryGap: '10%',
                        itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 0.7, [
                            {
                                offset: 0,
                                color: 'rgba(210,210,210,0.3)',
                            },
                            {
                                offset: 1,
                                color: '#5BFCF4',
                            },
                            ]),
                            opacity: 0.8,
                        },
                        },
                        data: this.yData1,
                    },
                    ]

			    },true);
			    
            },

            
        },
        watch:{
            

        }
    }
</script>
