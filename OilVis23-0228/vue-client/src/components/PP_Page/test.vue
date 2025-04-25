<template>
    <div>
        <div style="height: 300px; width: 100%;" ref="chartContainer"></div>
        <div>
            <label for="startDate">起始日期:</label>
            <input type="text" id="startDate" v-model="startDate" placeholder="YYYY-MM-DD">
            <label for="endDate">结束日期:</label>
            <input type="text" id="endDate" v-model="endDate" placeholder="YYYY-MM-DD">
            <button @click="updateMarkArea">更新标记区域</button>
        </div>
    </div>
</template>

<script src="https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js"></script>
<script>
import * as echarts from 'echarts';
import { Select, Option } from 'element-ui';

export default {
    data() {
        return {
            startDate: '',
            endDate: '',
            chartOptions: {
                title: {
                    text: '停输后温度对比',
                    left: 'center',
                    textStyle: {
                        color: 'lightskyblue',
                        fontSize: 30,
                        fontWeight: 'bold',
                    },
                },
                dataZoom: [
                    {
                        type: 'inside',
                        start: 0,
                        end: 30,
                    },
                    {
                        start: 0,
                        end: 10,
                        top: '85%',
                    },
                ],
                tooltip: {
                    trigger: 'axis',
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: [],
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} Mpa',
                    },
                    max: 15,
                },
                series: [
                    {
                        name: '当前压力',
                        type: 'line',
                        data: [],
                        connectNulls: true,
                        showSymbol: true,
                    },
                    // {
                    //     name: '平行于y轴的趋势线',
                    //     type: 'line',
                    //     markLine: {
                    //         name: 'aa',
                    //         data: [
                    //             [
                    //                 {
                    //                     coord: [null, 0],
                    //                 },
                    //                 {
                    //                     coord: [null, 15],
                    //                 },
                    //             ],
                    //             [
                    //                 {
                    //                     coord: [null, 0],
                    //                 },
                    //                 {
                    //                     coord: [null, 15],
                    //                 },
                    //             ],
                    //         ],
                    //     },
                    // },
                ],
                visualMap: {
                    color: ['lightskyblue'],
                    show: false,
                    dimension: 0,
                    pieces: []
                },
                markArea: {
                    data: [],
                },
            },
        };
    },
    methods: {
        generateRandomXAxisData() {
            const startYear = 2020;
            const endYear = 2025;
            const xAxisData = [];
            for (let year = startYear; year <= endYear; year++) {
                for (let month = 0; month < 5; month++) {
                    const daysInMonth = new Date(year, month + 1, 0).getDate();
                    for (let day = 1; day <= daysInMonth; day++) {
                        const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        xAxisData.push(formattedDate);
                    }
                }
            }
            return xAxisData;
        },
        generateRandomSeriesData(numDays) {
            const data = [];
            for (let j = 0; j < numDays; j++) {
                if (Math.random() < 0.2) {
                    data.push('-');
                } else {
                    data.push(Math.floor(Math.random() * 15));
                }
            }
            return data;
        },
        initChart() {
            const xAxisData = this.generateRandomXAxisData();
            const numDays = xAxisData.length;
            const seriesData = this.generateRandomSeriesData(numDays);

            this.chartOptions.xAxis.data = xAxisData;
            this.chartOptions.series[0].data = seriesData;

            const randomIndices = [];
            while (randomIndices.length < 2) {
                const randomIndex = Math.floor(Math.random() * numDays);
                if (!randomIndices.includes(randomIndex)) {
                    randomIndices.push(randomIndex);
                }
            }
            // this.chartOptions.series[1].markLine.data[0][0].coord[0] = xAxisData[randomIndices[0]];
            // this.chartOptions.series[1].markLine.data[0][1].coord[0] = xAxisData[randomIndices[0]];
            // this.chartOptions.series[1].markLine.data[1][0].coord[0] = xAxisData[randomIndices[1]];
            // this.chartOptions.series[1].markLine.data[1][1].coord[0] = xAxisData[randomIndices[1]];

            this.chart = echarts.init(this.$refs.chartContainer);
            this.chart.setOption(this.chartOptions);
        },
        updateMarkArea() {
            if (this.startDate && this.endDate) {
                const xAxisData = this.chartOptions.xAxis.data;
                const startIndex = xAxisData.indexOf(this.startDate);
                const endIndex = xAxisData.indexOf(this.endDate);

                if (startIndex!== -1 && endIndex!== -1) {
                    const pieces = [];
                    for (let i = 0; i < xAxisData.length; i++) {
                        if (i >= startIndex && i <= endIndex) {
                            pieces.push({
                                gt: i - 0.5,
                                lte: i + 0.5,
                                color: 'red'
                            });
                        } else {
                            pieces.push({
                                gt: i - 0.5,
                                lte: i + 0.5,
                                color: 'lightskyblue'
                            });
                        }
                    }
                    this.chartOptions.visualMap.pieces = pieces;

                    this.chartOptions.markArea.data = [
                        [
                            {
                                name: '选定区域',
                                xAxis: this.startDate,
                                itemStyle: {
                                    color: 'rgba(255, 0, 0)', // 半透明红色背景
                                    borderColor: 'red', // 边框颜色
                                    borderWidth: 1 // 边框宽度
                                }
                            },
                            {
                                xAxis: this.endDate
                            }
                        ]
                    ];
                    
                    this.chart.setOption(this.chartOptions, true);
                }
            }
            console.log(this.chartOptions.markArea.data);
        }
    },
    mounted() {
        this.initChart();
    }
};
</script>