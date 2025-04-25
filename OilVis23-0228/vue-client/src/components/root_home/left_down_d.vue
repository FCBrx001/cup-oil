<template>
    <div >
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
                xAxisData:  ['茂名', '阳江', '恩平', '鹤山', '江门', '高明', '三水', '花都'],

                seriesData: [
                    
                    {name: "进站压力", data: [65, 45, 24, 48, 65, 45, 24, 48], colors: ["rgba(214, 0, 1, 1)", "rgba(237, 0, 2, 0)"]},
                    {name: "出站压力", data: [18, 4, 60, 6, 18, 4, 60, 6], colors: ["rgba(0, 222, 193, 1)", "rgba(0, 241, 226, 0)"]},
                ],


                chartWidth:430,
                chartHeight:276,
                
            }
        },
        mounted(){
            this.drawchart()
        },
        created(){
            this.elid = uuidv1() //获取随机id
        },
        methods: { 
            getSeries(){   
            return this.seriesData.map(item => {
                return {
                    name: item.name,
                    type: 'bar',
                    data: item.data,
                    barWidth: 10,
                    barGap: 0.5, //柱间距离
                    itemStyle: {
                        normal: {
                            show: true,
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: item.colors[0],
                                },
                                {
                                    offset: 1,
                                    color: item.colors[1],
                                },
                            ]),
                            opacity: 0.8,
                            borderRadius: [5, 5, 0, 0],
                        },
                    },
                }
            })

            },
            drawchart(){
                this.charts = echarts.init(document.getElementById(this.elid));
                this.charts.clear();
			    this.charts.on("click", this.eConsole);
                this.charts.setOption({
                    tooltip: {
                    //提示框组件
                    trigger: 'axis',
                    backgroundColor: "#02090d",
                    // formatter: (params) => {
                    //     return params.value
                    // },
                    borderColor: "rgba(0, 243, 230, 0.4)", // 边框颜色
                    axisPointer: {
                        type: 'shadow',
                        label: {
                            backgroundColor: 'rgba(17, 27, 54, 1)',
                        },
                    },
                    textStyle: {
                        color: '#fff',
                        fontStyle: 'normal',
                        fontFamily: '微软雅黑',
                        fontSize: 14,
                    },
                },
                grid: {
                    left: '1%',
                    right: '5%',
                    bottom: '15%',
                    
                    //	padding:'0 0 10 0',
                    containLabel: true,
                },
                legend: {
                    //图例组件，颜色和名字
                    right: '10%',
                    
                    itemGap: 16,
                    itemWidth: 18,
                    itemHeight: 10,
                    selectedMode: false,
                    data: [ '进站压力', '出站压力'],
                    textStyle: {
                        color: '#08f1f8',
                        fontStyle: 'normal',
                        fontFamily: '微软雅黑',
                        fontSize: 12,
                    },
                },
                xAxis: [
                    {
                        type: 'category',
                        // 	boundaryGap: true,//坐标轴两边留白
                        data: this.xAxisData,
                        axisLabel: {
                            //坐标轴刻度标签的相关设置。
                            //		interval: 0,//设置为 1，表示『隔一个标签显示一个标签』
                            //	margin:15,
                            textStyle: {
                                color: '#9AAFC2',
                                fontStyle: 'normal',
                                fontFamily: '微软雅黑',
                                fontSize: 14,
                            },
                            rotate: 0,
                        },
                        axisTick: {
                            //坐标轴刻度相关设置。
                            show: false,
                        },
                        axisLine: {
                            //坐标轴轴线相关设置
                            lineStyle: {
                                color: '#506B98',
                            },
                        },
                        //splitLine: {
                        //         show: true,
                        //         lineStyle: {
                        //             color: 'rgba(255,255,255,0.2)',
                        //         }
                        //     },
                    },
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: "单位：人",
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
                series: this.getSeries(),

			  },true);
			    
            },

            
        },
        watch:{
            

        }
    }
</script>
