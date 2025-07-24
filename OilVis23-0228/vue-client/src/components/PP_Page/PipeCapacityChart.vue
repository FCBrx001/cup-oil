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
          backgroundColor: 'rgba(0,21,41,0.9)',
          borderColor: '#66dffb',
          borderWidth: 1,
          textStyle: {
            color: '#fff',
            fontSize: 12
          },
          padding: [8, 12],
          extraCssText: 'box-shadow: 0 0 10px rgba(0,0,0,0.5); border-radius: 4px;',
          confine: true, // 限制在图表区域内
          position: function (point, params, dom, rect, size) {
            // 智能定位，避免遮挡
            const chartWidth = size.viewSize[0];
            const chartHeight = size.viewSize[1];
            const tooltipWidth = size.contentSize[0];
            const tooltipHeight = size.contentSize[1];
            
            let x = point[0] + 10; // 默认在鼠标右侧
            let y = point[1] - tooltipHeight / 2; // 垂直居中
            
            // 如果右侧空间不够，显示在左侧
            if (x + tooltipWidth > chartWidth) {
              x = point[0] - tooltipWidth - 10;
            }
            
            // 如果上方空间不够，调整到下方
            if (y < 0) {
              y = 10;
            }
            
            // 如果下方空间不够，调整到上方
            if (y + tooltipHeight > chartHeight) {
              y = chartHeight - tooltipHeight - 10;
            }
            
            return [x, y];
          },
          formatter: function (params) {
            const data = volumeData[params[0].dataIndex];
            return `<div style="font-weight:bold;margin-bottom:8px;color:#66dffb;border-bottom:1px solid rgba(102,223,251,0.3);padding-bottom:5px;">停输后 ${params[0].axisValue} 小时</div>
                    <div style="margin:5px 0;display:flex;align-items:center;justify-content:space-between;">
                      <span>压力:</span>
                      <span style="font-weight:bold;margin-left:10px;color:#ff6b6b;">${data.pressure.toFixed(2)} MPa</span>
                    </div>
                    <div style="margin:5px 0;display:flex;align-items:center;justify-content:space-between;">
                      <span>温度:</span>
                      <span style="font-weight:bold;margin-left:10px;color:#ffd166;">${data.temperature.toFixed(1)} ℃</span>
                    </div>
                    <div style="margin:5px 0;display:flex;align-items:center;justify-content:space-between;">
                      <span>管容量:</span>
                      <span style="font-weight:bold;margin-left:10px;color:#00ffaa;">${data.volume.toFixed(0)} m³</span>
                    </div>`;
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