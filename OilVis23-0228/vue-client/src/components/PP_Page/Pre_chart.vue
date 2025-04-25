<template>
    <div>
        <div style="height: 300px; width: 100%;" ref="chartContainer"></div>
    </div>
</template>
<script src="https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js"></script>
<script>
import * as echarts from 'echarts';
import { Select, Option } from 'element-ui';

export default {
    data() {
        return {
            chartOptions: {
                legend: {
                    icon: "circle",
    top: "5%",
    right: "5%",
    itemWidth: 6,
    itemGap: 20,
    textStyle: {
      color: "#556677",
    },
                },
                backgroundColor: "#080b30",
                title: {
                    text: "停输前后温度对比",
                    textStyle: {
                        align: "center",
                        color: "#fff",
                        fontSize: 20,
                    },
                    top: "5%",
                    left: "center",
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        lineStyle: {
                            color: {
                                type: "linear",
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: "rgba(0, 255, 233,0)",
                                    },
                                    {
                                        offset: 0.5,
                                        color: "rgba(255, 255, 255,1)",
                                    },
                                    {
                                        offset: 1,
                                        color: "rgba(0, 255, 233,0)",
                                    },
                                ],
                                global: false,
                            },
                        },
                    },
                },
                grid: {
                    top: "15%",
                    left: "5%",
                    right: "5%",
                    bottom: "15%",
                    // containLabel: true
                },
                xAxis: [
                    {
                        type: "category",
                        axisLine: {
                            show: true,
                        },
                        splitArea: {
                            // show: true,
                            color: "#f00",
                            lineStyle: {
                                color: "#f00",
                            },
                        },
                        axisLabel: {
                            color: "#fff",
                        },
                        splitLine: {
                            show: false,
                        },
                        boundaryGap: false,
                        data: ["1月", "2月", "3月", "4月", "5月", "6月"],
                    },
                ],

                yAxis: [
                    {
                        type: "value",
                        min: 0,
                        // max: 140,
                        splitNumber: 4,
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: "rgba(255,255,255,0.1)",
                            },
                        },
                        axisLine: {
                            show: false,
                        },
                        axisLabel: {
                            show: false,
                            margin: 20,
                            textStyle: {
                                color: "#d1e6eb",
                            },
                        },
                        axisTick: {
                            show: false,
                        },
                    },
                ],
                series: [
                    {
                        markArea:{ 
                            data: [
                                [{
                                    name: '',
                                    xAxis: '1月'
                                }, {
                                    xAxis: '2月'
                                }],
                                [{
                                    name: '',
                                    xAxis: '3月'
                                }, {
                                    xAxis: '4月'
                                }]
                            ]
                        },
                        name: "停输后温度",
                        type: "line",
                        // smooth: true, //是否平滑
                        showAllSymbol: true,
                        // symbol: 'image://./static/images/guang-circle.png',
                        symbol: "circle",
                        symbolSize: 25,
                        lineStyle: {
                            normal: {
                                color: "#6c50f3",
                                shadowColor: "rgba(0, 0, 0, .3)",
                                shadowBlur: 0,
                                shadowOffsetY: 5,
                                shadowOffsetX: 5,
                            },
                        },
                        label: {
                            show: true,
                            position: "top",
                            textStyle: {
                                color: "#6c50f3",
                            },
                        },
                        itemStyle: {
                            color: "#6c50f3",
                            borderColor: "#fff",
                            borderWidth: 3,
                            shadowColor: "rgba(0, 0, 0, .3)",
                            shadowBlur: 0,
                            shadowOffsetY: 2,
                            shadowOffsetX: 2,
                        },
                        tooltip: {
                            show: false,
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(
                                    0,
                                    0,
                                    0,
                                    1,
                                    [
                                        {
                                            offset: 0,
                                            color: "rgba(108,80,243,0.3)",
                                        },
                                        {
                                            offset: 1,
                                            color: "rgba(108,80,243,0)",
                                        },
                                    ],
                                    false
                                ),
                                shadowColor: "rgba(108,80,243, 0.9)",
                                shadowBlur: 20,
                            },
                        },
                        data: [502.84, 205.97, 332.79, 281.55, 398.35, 214.02],
                    },
                    {
                        name: "停输前温度",
                        type: "line",
                        // smooth: true, //是否平滑
                        showAllSymbol: true,
                        // symbol: 'image://./static/images/guang-circle.png',
                        symbol: "circle",
                        symbolSize: 25,
                        lineStyle: {
                            normal: {
                                color: "#00ca95",
                                shadowColor: "rgba(0, 0, 0, .3)",
                                shadowBlur: 0,
                                shadowOffsetY: 5,
                                shadowOffsetX: 5,
                            },
                        },
                        label: {
                            show: true,
                            position: "top",
                            textStyle: {
                                color: "#00ca95",
                            },
                        },

                        itemStyle: {
                            color: "#00ca95",
                            borderColor: "#fff",
                            borderWidth: 3,
                            shadowColor: "rgba(0, 0, 0, .3)",
                            shadowBlur: 0,
                            shadowOffsetY: 2,
                            shadowOffsetX: 2,
                        },
                        tooltip: {
                            show: false,
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(
                                    0,
                                    0,
                                    0,
                                    1,
                                    [
                                        {
                                            offset: 0,
                                            color: "rgba(0,202,149,0.3)",
                                        },
                                        {
                                            offset: 1,
                                            color: "rgba(0,202,149,0)",
                                        },
                                    ],
                                    false
                                ),
                                shadowColor: "rgba(0,202,149, 0.9)",
                                shadowBlur: 20,
                            },
                        },
                        data: [281.55, 398.35, 214.02, 179.55, 289.57, 356.14],
                    },
                ],
            }
        }
    },
    methods: {
        initChart() {
            this.chart = echarts.init(this.$refs.chartContainer);
            this.chart.setOption(this.chartOptions);
        }
    },
    mounted() {
        this.initChart();
    }
}
</script>