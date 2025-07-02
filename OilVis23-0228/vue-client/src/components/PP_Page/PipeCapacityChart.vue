<template>
  <div class="pipe-capacity-chart-container">
    <div id="pressure_line_chart" class="pressure-line-chart"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'PipeCapacityChart',
  data() {
    return {
      pressure_line_chart: null,
    }
  },
  mounted() {
    this.initPressureLineChart();
  },
  methods: {
    initPressureLineChart() {
      const chartDom = document.getElementById('pressure_line_chart');
      if (chartDom) {
        this.pressure_line_chart = echarts.init(chartDom);
        this.drawPressureLineChart();
      }
    },
    drawPressureLineChart() {
      // 模拟停输后的时间数据（24小时）
      const hours = Array.from({ length: 24 }, (_, i) => i);
      
      // 模拟停输后的数据变化
      const volumeData = hours.map(hour => {
        // 停输后压力逐渐下降
        const pressure = hour === 0 ? 
          2.5 : // 初始压力
          2.5 * Math.exp(-0.02 * hour); // 指数衰减
        
        // 温度随时间缓慢升高（环境影响）
        const temperature = 25 + (hour * 0.1);
        
        // 管容量随压力下降而减小
        const volume = 2000 * (pressure / 2.5); // 假设初始容量2000m³

        return { pressure, temperature, volume };
      });

      const option = {
        backgroundColor: 'transparent',
        title: {
          text: '',
          left: 'center',
          textStyle: {
            color: '#66dffb',
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#283b56'
            }
          },
          formatter: function (params) {
            const data = volumeData[params[0].dataIndex];
            return `停输后 ${params[0].axisValue} 小时<br/>
                   压力: ${data.pressure.toFixed(2)} MPa<br/>
                   温度: ${data.temperature.toFixed(1)} ℃<br/>
                   管容量: ${data.volume.toFixed(0)} m³`;
          },
          backgroundColor: 'rgba(0,21,41,0.8)',
          borderColor: '#66dffb',
          borderWidth: 1,
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          data: ['管容量'],
          top: 25,
          left: 10,
          textStyle: {
            color: '#fff',
            fontSize: 12
          },
          itemWidth: 15,
          itemHeight: 10
        },
        grid: {
          left: '3%',
          right: '6%',
          bottom: '8%',
          top: '10px',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: hours,
          name: 't',
          nameTextStyle: {
            color: '#fff',
            padding: [5, 0, 0, 0]
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.5)'
            }
          },
          axisLabel: {
            color: 'rgba(255, 255, 255, 0.7)'
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.1)',
              type: 'dashed'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: '',
          nameTextStyle: {
            color: '#fff',
            padding: [0, 0, 5, 0]
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.5)'
            }
          },
          axisLabel: {
            color: 'rgba(255, 255, 255, 0.7)'
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.1)',
            }
          }
        },
        series: [
          {
            name: '',
            type: 'line',
            smooth: true,
            showSymbol: false,
            data: volumeData.map(item => item.volume),
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(39, 104, 224, 0.5)'
              }, {
                offset: 1,
                color: 'rgba(39, 104, 224, 0)'
              }])
            },
            lineStyle: {
              width: 2,
              color: '#2768e0'
            },
            itemStyle: {
              color: '#2768e0'
            },
            emphasis: {
              focus: 'series'
            }
          }
        ]
      };
      
      this.pressure_line_chart.setOption(option);
    }
  }
}
</script>

<style scoped>
.pipe-capacity-chart-container, .pressure-line-chart {
  width: 100%;
  height: 100%;
}
</style> 