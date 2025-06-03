<template>
  <div class="pressure-plan-container">
    <span class="wgrytj_bt" style="font-size:1.2rem;">停输保压方案的制定
      <el-tag style="float: right;font-size: 1.2rem;border-radius: 25px;background-color: #283747;color: white">保压参数表</el-tag>
    </span>
    <div id="risk_chart" class="risk-chart"></div>
    <div id="pressure_line_chart" class="pressure-line-chart"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'PressureMaintenancePlan',
  data() {
    return {
      risk_chart: null,
      pressure_line_chart: null,
    }
  },
  mounted() {
    this.initRiskChart();
    this.initPressureLineChart();
  },
  methods: {
    initRiskChart() {
      const chartDom = document.getElementById('risk_chart');
      this.risk_chart = echarts.init(chartDom, null, {
        renderer: "svg"
      });
      this.drawRiskChart();
    },
    drawRiskChart() {
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0,0,0,0.75)',
          borderWidth: 0,
          textStyle: {
            color: '#fff',
            fontSize: 14
          },
          formatter: function(params) {
            if (params.data && params.data.desc) {
              return `<div style="padding: 8px">
                <div style="font-weight: bold; color: #fff; margin-bottom: 5px;">${params.name}</div>
                <div style="color: #ddd; line-height: 1.5">${params.data.desc}</div>
              </div>`;
            }
            return params.name;
          }
        },
        legend: {
          show: true,
          orient: 'horizontal',
          bottom: '5%',
          left: 'center',
          itemWidth: 15,
          itemHeight: 15,
          textStyle: {
            color: '#fff',
            fontSize: 14
          }
        },
        series: [
          {
            name: '保压方案',
            type: 'pie',
            radius: ['50%', '65%'],
            center: ['50%', '40%'],
            avoidLabelOverlap: true,
            itemStyle: {
              borderRadius: 10,
              borderColor: 'rgba(0, 0, 0, 0.1)',
              borderWidth: 2,
              shadowBlur: 20,
              shadowColor: 'rgba(0, 0, 0, 0.3)'
            },
            label: {
              show: true,
              position: 'outside',
              formatter: '{b}\n{c}%',
              fontSize: 14,
              fontWeight: 'bold',
              color: '#fff',
              backgroundColor: 'rgba(0,0,0,0.3)',
              padding: [4, 8],
              borderRadius: 4,
              distanceToLabelLine: 5
            },
            labelLine: {
              show: true,
              length: 20,
              length2: 30,
              smooth: true
            },
            labelLayout: {
              hideOverlap: true
            },
            emphasis: {
              label: {
                fontSize: 16,
                fontWeight: 'bold',
                color: '#fff'
              },
              itemStyle: {
                shadowBlur: 30,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            data: [
              {
                value: 45, 
                name: '恒压保持法',
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {offset: 0, color: '#1cb076'},
                    {offset: 1, color: '#36d39a'}
                  ])
                },
                desc: '适用于停输时间12-24小时，环境温度稳定的情况。特点：压力保持恒定，监控频率高，安全性最佳。'
              },
              { 
                value: 35, 
                name: '缓降调整法',
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {offset: 0, color: '#f2994a'},
                    {offset: 1, color: '#f2c94c'}
                  ])
                },
                desc: '适用于停输时间24-48小时，温度波动较大的情况。特点：允许压力缓慢下降，减少干预次数，节约能源。'
              },
              { 
                value: 20, 
                name: '区间控制法',
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {offset: 0, color: '#5e72e4'},
                    {offset: 1, color: '#825ee4'}
                  ])
                },
                desc: '适用于长时间停输(>48小时)的情况。特点：设置压力上下限范围，监测频率低，减少设备磨损，操作简便。'
              }
            ]
          }
        ]
      };
      
      this.risk_chart.setOption(option);
    },
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
          text: '停输管容量变化',
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
          right: '4%',
          bottom: '8%',
          top: '70px',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: hours,
          name: '停输时间(h)',
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
        yAxis: [
          {
            type: 'value',
            name: '管容量(m³)',
            nameTextStyle: {
              color: '#fff',
              padding: [0, 30, 0, 0]
            },
            min: 0,
            max: 2500,
            axisLine: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.5)'
              }
            },
            axisLabel: {
              color: 'rgba(255, 255, 255, 0.7)',
              formatter: '{value}'
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.1)',
                type: 'dashed'
              }
            }
          }
        ],
        series: [
          {
            name: '管容量',
            type: 'line',
            symbol: 'none',
            smooth: true,
            lineStyle: {
              width: 2,
              color: '#825ee4'
            },
            data: volumeData.map(item => item.volume),
            markLine: {
              silent: true,
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.3)',
                type: 'dashed',
                width: 1
              },
              data: [
                {
                  xAxis: 0,
                  label: {
                    formatter: '停\n输\n开\n始',
                    position: 'start',
                    color: '#66dffb',
                    fontSize: 13,
                    fontFamily: 'Microsoft YaHei',
                    padding: [5, 2],
                    backgroundColor: 'rgba(0,21,41,0.7)',
                    borderRadius: 2,
                    lineHeight: 18,
                    distance: 10,
                    offset: [0, 30]
                  }
                },
                {
                  yAxis: 1500,
                  label: {
                    formatter: '临界管容量',
                    position: 'insideEndTop',
                    color: '#66dffb',
                    fontSize: 13,
                    fontFamily: 'Microsoft YaHei',
                    padding: [2, 4],
                    backgroundColor: 'rgba(0,21,41,0.7)',
                    borderRadius: 2,
                    distance: 10
                  },
                  lineStyle: {
                    color: '#ff4d4f',
                    type: 'dashed',
                    width: 1
                  }
                }
              ]
            },
            markArea: {
              silent: true,
              itemStyle: {
                color: 'rgba(255, 77, 79, 0.05)'
              },
              data: [[{
                yAxis: 1500
              }, {
                yAxis: 2000
              }]]
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
.pressure-plan-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
  box-sizing: border-box;
}

.wgrytj_bt {
  color: #66dffb;
  display: block;
  margin-bottom: 10px;
  flex-shrink: 0;
}

.risk-chart {
  height: 45%;
  width: 100%;
  margin-bottom: 10px;
  flex-grow: 1;
}

.pressure-line-chart {
  height: 45%;
  width: 100%;
  flex-grow: 1;
}
</style> 