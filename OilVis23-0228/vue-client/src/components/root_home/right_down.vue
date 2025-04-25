<template>

        <div :id="elid" :style="{'width':chartWidth+'px','height':chartHeight+'px'}"></div>  
  

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

                dataMM:[[267, 216, 280, 4.8, 108, 64, 9],],
                dataEP:[[185, 127, 216, 2.52, 61, 27, 10],],
                dataYJ:[[109, 68, 87, 0.996, 74, 29, 15],],
                dataYJ:[[109, 68, 87, 0.996, 74, 29, 15],],
                dataYJ:[[109, 68, 87, 0.996, 74, 29, 15],],
                dataYJ:[[109, 68, 87, 0.996, 74, 29, 15],],
                dataYJ:[[109, 68, 87, 0.996, 74, 29, 15],],
                dataYJ:[[109, 68, 87, 0.996, 74, 29, 15],],
                lineStyledata :{
                    width: 2,
                    opacity: 1
                },

                chartWidth:510,
                chartHeight:350,
                
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
                    backgroundColor: '#161627',
                    // title: {
                    //     text: 'AQI - Radar',
                    //     left: 'center',
                    //     textStyle: {
                    //     color: '#eee'
                    //     }
                    // },
                    legend: {
                        left: 1,
                        top:3,
                        data: ['茂名', '阳江','恩平', '鹤山','江门','高明','三水','花都'],
                        itemGap: 5,
                        textStyle: {
                        color: '#fff',
                        fontSize: 14
                        },
                        selectedMode: 'single'
                    },
                    radar: {
                        indicator: [
                        { name: '阀门内漏', max: 300 },
                        { name: '清管', max: 300 },
                        { name: '甩泵', max: 300 },
                        { name: '阀门打开', max: 300 },
                        { name: '阀门关闭', max: 300 },
                        { name: '其他工况', max: 300 }
                        ],
                        shape: 'circle',
                        splitNumber: 6,
                        axisName: {
                        color: 'rgb(238, 197, 102)'
                        },
                        splitLine: {
                        lineStyle: {
                            color: [
                            'rgba(238, 197, 102, 0.1)',
                            'rgba(238, 197, 102, 0.2)',
                            'rgba(238, 197, 102, 0.4)',
                            'rgba(238, 197, 102, 0.6)',
                            'rgba(238, 197, 102, 0.8)',
                            'rgba(238, 197, 102, 1)'
                            ].reverse()
                        }
                        },
                        splitArea: {
                        show: false
                        },
                        axisLine: {
                        lineStyle: {
                            color: 'rgba(238, 197, 102, 0.5)'
                        }
                        }
                    },
                    series: [
                        {
                        name: '茂名',
                        type: 'radar',
                        lineStyle: this.lineStyledata,
                        data: this.dataMM,
                        symbol: 'none',
                        itemStyle: {
                            color: '#F9713C'
                        },
                        areaStyle: {
                            opacity: 0.1
                        }
                        },
                        {
                        name: '阳江',
                        type: 'radar',
                        lineStyle: this.lineStyledata,
                        data: this.dataYJ,
                        symbol: 'none',
                        itemStyle: {
                            color: 'rgb(238, 197, 102)'
                        },
                        areaStyle: {
                            opacity: 0.05
                        }
                        },
                        {
                        name: '恩平',
                        type: 'radar',
                        lineStyle: this.lineStyledata,
                        data: this.dataEP,
                        symbol: 'none',
                        itemStyle: {
                            color: '#B3E4A1'
                        },
                        areaStyle: {
                            opacity: 0.05
                        }
                        },
                        
                        {
                        name: '鹤山',
                            type: 'radar',
                            lineStyle: this.lineStyledata,
                            data: this.dataYJ,
                            symbol: 'none',
                            itemStyle: {
                                color: 'rgb(238, 197, 102)'
                            },
                            areaStyle: {
                                opacity: 0.05
                            }
                        },
                        {
                        name: '江门',
                            type: 'radar',
                            lineStyle: this.lineStyledata,
                            data: this.dataYJ,
                            symbol: 'none',
                            itemStyle: {
                                color: 'rgb(238, 197, 102)'
                            },
                            areaStyle: {
                                opacity: 0.05
                            }
                        },
                        {
                        name: '高明',
                            type: 'radar',
                            lineStyle: this.lineStyledata,
                            data: this.dataYJ,
                            symbol: 'none',
                            itemStyle: {
                                color: 'rgb(238, 197, 102)'
                            },
                            areaStyle: {
                                opacity: 0.05
                            }
                        },
                        {
                        name: '三水',
                            type: 'radar',
                            lineStyle: this.lineStyledata,
                            data: this.dataYJ,
                            symbol: 'none',
                            itemStyle: {
                                color: 'rgb(238, 197, 102)'
                            },
                            areaStyle: {
                                opacity: 0.05
                            }
                        },
                        {
                        name: '花都',
                            type: 'radar',
                            lineStyle: this.lineStyledata,
                            data: this.dataYJ,
                            symbol: 'none',
                            itemStyle: {
                                color: 'rgb(238, 197, 102)'
                            },
                            areaStyle: {
                                opacity: 0.05
                            }
                        }
                    ]
			    },true);
			    
            },

            
        },
        watch:{
            

        }
    }
</script>
