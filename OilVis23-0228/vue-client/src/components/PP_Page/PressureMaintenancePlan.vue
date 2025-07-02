<template>
  <div class="pressure-plan-container-flex">
    <!-- <div class="station-selector">
      <label>选择站点：</label>
      <select v-model="selectedStation">
        <option v-for="station in stationOptions" :key="station.value" :value="station.value">
          {{ station.label }}
        </option>
      </select>
    </div> -->
    <div class="pressure-bar-chart-wrapper">
      <div v-if="station === 'huangpu'" class="no-plan-tip">暂无方案</div>
      <div v-else id="pressure_bar_chart" class="pressure-bar-chart"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'PressureMaintenancePlan',
  props: {
    station: {
      type: String,
      default: 'huangpu'
    }
  },
  data() {
    return {
      pressure_bar_chart: null,
      selectedStation: 'huangpu',
      stationOptions: [
        { label: '黄埔', value: 'huangpu' },
        { label: '十字窖#1', value: 'shizijiao1' },
        { label: '十字窖#2', value: 'shizijiao2' },
        { label: '东莞', value: 'dongguan' }
      ],
      stationData: {
        huangpu:   Array.from({length: 12}, () => (Math.random() * 3.5 + 0.5).toFixed(2)),
        shizijiao1:Array.from({length: 12}, () => (Math.random() * 3.5 + 0.5).toFixed(2)),
        shizijiao2:Array.from({length: 12}, () => (Math.random() * 3.5 + 0.5).toFixed(2)),
        dongguan:  Array.from({length: 12}, () => (Math.random() * 3.5 + 0.5).toFixed(2))
      },
      times: [3,5,7,9,11,13,15,17,19,21,23,25]
    }
  },
  watch: {
    station() {
      if (this.station === 'huangpu') {
        if (this.pressure_bar_chart) {
          this.pressure_bar_chart.dispose();
          this.pressure_bar_chart = null;
        }
        const chartDom = document.getElementById('pressure_bar_chart');
        if (chartDom) {
          chartDom.innerHTML = '';
        }
      } else {
        this.$nextTick(() => {
          this.drawPressureBarChart();
        });
      }
    }
  },
  mounted() {
    if (this.station !== 'huangpu') {
      this.initPressureBarChart();
    }
  },
  methods: {
    initPressureBarChart() {
      const chartDom = document.getElementById('pressure_bar_chart');
      if (chartDom) {
        this.pressure_bar_chart = echarts.init(chartDom, null, {
          renderer: "svg"
        });
        this.drawPressureBarChart();
      }
    },
    drawPressureBarChart() {
      if (this.station === 'huangpu') {
        if (this.pressure_bar_chart) {
          this.pressure_bar_chart.dispose();
          this.pressure_bar_chart = null;
        }
        return;
      }
      const chartDom = document.getElementById('pressure_bar_chart');
      if (!chartDom) return;
      if (!this.pressure_bar_chart) {
        this.pressure_bar_chart = echarts.init(chartDom, null, {
          renderer: "svg"
        });
      }
      const pressures = this.stationData[this.station] || [];
      const option = {
        backgroundColor: 'transparent',
        title: {
          text: '停输时长----最小保压进站压力',
          show:true,
          left: 'center',
          textStyle: {
            color: '#66dffb',
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          backgroundColor: 'rgba(0,21,41,0.8)',
          borderColor: '#66dffb',
          borderWidth: 1,
          textStyle: {
            color: '#fff'
          },
          formatter: function(params) {
            const data = params[0];
            return `停输时长: ${data.name} h<br/>最小保压进站压力: ${data.value} MPa`;
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '20%',
          top: '31%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.times,
          name: 'h',
          nameTextStyle: {
            color: '#fff',
            fontSize: 18,
            padding: [5, 0, 0, 0]
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.5)'
            }
          },
          axisLabel: {
            color: 'rgba(255, 255, 255, 0.7)'
          }
        },
        yAxis: {
          type: 'value',
          name: 'MPa',
          nameTextStyle: {
            color: '#fff',
            fontSize: 16,
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
            name: '进站压力',
            type: 'bar',
            data: pressures,
            barWidth: '50%',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {offset: 0, color: '#1890ff'},
                {offset: 1, color: '#66dffb'}
              ])
            },
            label: {
              show: true,
              position: 'top',
              color: '#66dffb',
              fontSize: 14,
              // fontWeight: 'bold',
              formatter: function(params) {
                return params.value;
              }
            },
            emphasis: {
              itemStyle: {
                color: '#40a9ff'
              }
            }
          }
        ]
      };
      this.pressure_bar_chart.setOption(option);
    }
  }
}
</script>

<style scoped>
.pressure-plan-container-flex {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
}
.no-plan-tip {
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 22px;
  letter-spacing: 2px;
  background: rgba(0,21,41,0.7);
  border-radius: 8px;
  /* border: 1px dashed #66dffb; */
}
.station-selector {
  width: 160px;
  padding: 30px 10px 0 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: #66dffb;
  font-size: 16px;
}
.station-selector label {
  margin-bottom: 10px;
}
.station-selector select {
  width: 120px;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #1890ff;
  background: #001529;
  color: #66dffb;
  font-size: 15px;
}
.pressure-bar-chart-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pressure-bar-chart {
  width: 100%;
  height: 400px;
  min-width: 350px;
}
</style> 