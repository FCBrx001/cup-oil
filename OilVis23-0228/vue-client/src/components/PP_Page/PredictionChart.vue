<template>
  <div class="chart-container">
    <div class="chart-header" style="display: flex; justify-content: space-between; align-items: center; padding: 0 10px; margin-bottom: 5px;">
      <span class="wgrytj_bt" style="font-size:1.2rem;">
        {{ selectedValveInfo ? `${selectedValveInfo.valveName}参数预测` : '参数动态预测' }}
      </span>
      <div class="chart-controls">
        <el-tag v-if="selectedValveInfo" size="small" type="info" class="valve-tag" @click="resetValve">
          {{ selectedValveInfo.valveName }} <i class="el-icon-close"></i>
        </el-tag>
        <div class="chart-toggle">
          <el-switch
            v-model="showTemperature"
            active-text="温度"
            inactive-text="压力"
            active-color="#ff4949"
            inactive-color="#1890ff"
            @change="toggleChartData">
          </el-switch>
        </div>
      </div>
    </div>
    <div class="chart-body">
      <div id="prediction_chart"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'PredictionChart',
  props: {
    pipelineId: {
      type: String,
      default: 'pipeline1'
    },
    selectedValveInfo: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      showTemperature: true,
      prediction_chart: null,
      predictionTimer: null,
      actualData: [],
      predictionData: []
    }
  },
  mounted() {
    this.initChart();
  },
  beforeDestroy() {
    if (this.predictionTimer) {
      clearInterval(this.predictionTimer);
    }
    if (this.prediction_chart) {
      this.prediction_chart.dispose();
    }
  },
  methods: {
    initChart() {
      const chartDom = document.getElementById('prediction_chart');
      this.prediction_chart = echarts.init(chartDom);
      
      // 初始化数据
      this.generateInitialData();
      this.drawPredictionChart();
      
      // 设置自动更新
      this.startDataUpdates();
      
      // 处理窗口大小调整
      window.addEventListener('resize', this.handleResize);
    },
    handleResize() {
      if (this.prediction_chart) {
        this.prediction_chart.resize();
      }
    },
    generateInitialData() {
      // 基础时间和预测周期设置
      const baseTime = new Date();
      const futurePoints = 20; // 未来预测点数量
      
      // 根据选中的阀室确定数据基准值和波动范围
      let baseValue, fluctuationRange;
      
      if (this.selectedValveInfo) {
        const valveNumber = this.selectedValveInfo.valveIndex || parseInt(this.selectedValveInfo.valveName.replace(/[^0-9]/g, '')) || 0;
        
        // 根据阀室编号生成特定的数据特征
        if (this.showTemperature) {
          // 温度随阀门编号递增
          baseValue = 20 + (valveNumber * 0.8); // 20-28.8℃
          fluctuationRange = 2 + (valveNumber * 0.1); // 波动范围2-3℃
        } else {
          // 压力随阀门编号递减
          baseValue = 300 - (valveNumber * 5); // 300-245 MPa
          fluctuationRange = 20 + (valveNumber * 2); // 波动范围20-40 MPa
        }
      } else {
        // 默认数据
        baseValue = this.showTemperature ? 25 : 250;
        fluctuationRange = this.showTemperature ? 5 : 50;
      }
      
      // 生成历史数据
      this.actualData = [];
      for (let i = 30; i >= 1; i--) {
        const time = new Date(baseTime.getTime() - i * 1000);
        const randomFactor = Math.random() * fluctuationRange - (fluctuationRange / 2);
        const value = baseValue + randomFactor;
        
        this.actualData.push({
          name: time.toString(),
          value: [time.getTime(), value]
        });
      }
      
      // 生成预测数据
      this.predictionData = [];
      
      // 首先复制历史数据，添加轻微差异
      for (let i = 0; i < this.actualData.length; i++) {
        const variance = this.showTemperature ? (fluctuationRange * 0.2) : (fluctuationRange * 0.2);
        this.predictionData.push({
          name: this.actualData[i].name,
          value: [
            this.actualData[i].value[0],
            this.actualData[i].value[1] + (Math.random() * variance - variance/2)
          ]
        });
      }
      
      // 添加未来预测点
      const lastActualTime = this.actualData[this.actualData.length - 1].value[0];
      const lastActualValue = this.actualData[this.actualData.length - 1].value[1];
      
      // 选择阀门后，未来趋势会有特定变化
      let trendDirection = 0;
      if (this.selectedValveInfo) {
        const valveNumber = this.selectedValveInfo.valveIndex || parseInt(this.selectedValveInfo.valveName.replace(/[^0-9]/g, '')) || 0;
        
        // 根据阀门编号决定趋势（奇数上升，偶数下降）
        trendDirection = (valveNumber % 2 === 0) ? -1 : 1;
        
        // 特定阀门的特殊趋势
        if (valveNumber === 3 || valveNumber === 7) {
          trendDirection *= 2; // 更强的趋势
        }
      }
      
      for (let i = 0; i < futurePoints; i++) {
        const futureTime = lastActualTime + (i + 1) * 1000;
        let predictedValue;
        
        if (i === 0) {
          // 第一个未来点基于最后一个实际值
          const variance = this.showTemperature ? (fluctuationRange * 0.3) : (fluctuationRange * 0.3);
          predictedValue = lastActualValue + (Math.random() * variance - variance/2);
        } else {
          // 后续点基于前一个预测点，并添加趋势
          const prevValue = this.predictionData[this.predictionData.length - 1].value[1];
          const variance = this.showTemperature ? (fluctuationRange * 0.16) : (fluctuationRange * 0.16);
          const trendFactor = (i / futurePoints) * (this.showTemperature ? 0.5 : 5) * trendDirection;
          
          predictedValue = prevValue + (Math.random() * variance - variance/2) + trendFactor;
        }
        
        this.predictionData.push({
          name: new Date(futureTime).toString(),
          value: [futureTime, predictedValue]
        });
      }
    },
    drawPredictionChart() {
      // 设置图表标题和副标题
      let subtitleText = '';
      if (this.selectedValveInfo) {
        subtitleText = this.showTemperature ? 
          '预测温度变化趋势' : 
          '预测压力变化趋势';
      }
      
      const option = {
        backgroundColor: 'transparent',
        title: {
          text: this.selectedValveInfo ? 
            `${this.selectedValveInfo.valveName}${this.showTemperature ? '温度预测' : '压力预测'}` : 
            (this.showTemperature ? '温度预测' : '压力预测'),
          left: 'center',
          textStyle: {
            color: '#66dffb',
            fontSize: 16
          },
          subtext: subtitleText,
          subtextStyle: {
            color: 'rgba(255,255,255,0.5)',
            fontSize: 12
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            const date = new Date(params[0].value[0]);
            let result = date.toLocaleTimeString();
            for (let i = 0; i < params.length; i++) {
              const unit = this.showTemperature ? ' ℃' : ' MPa';
              result += '<br/>' + params[i].marker + params[i].seriesName + ': ' + params[i].value[1].toFixed(2) + unit;
            }
            return result;
          },
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#283b56'
            }
          }
        },
        legend: {
          data: ['实际' + (this.showTemperature ? '温度' : '压力'), '预测' + (this.showTemperature ? '温度' : '压力')],
          right: 20,
          top: 10,
          textStyle: {
            color: '#ffffff'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '20%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'time',
          boundaryGap: false,
          axisLine: { 
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.5)'
            }
          },
          axisLabel: {
            formatter: function(value) {
              const date = new Date(value);
              return date.getMinutes() + ':' + date.getSeconds().toString().padStart(2, '0');
            },
            textStyle: {
              color: 'rgba(255, 255, 255, 0.7)'
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255,255,255,0.1)'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: this.showTemperature ? '温度（℃）' : '压力（MPa）',
          nameTextStyle: {
            color: 'rgba(255, 255, 255, 0.7)'
          },
          axisLine: { 
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.5)'
            }
          },
          axisLabel: {
            textStyle: {
              color: 'rgba(255, 255, 255, 0.7)'
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255,255,255,0.1)'
            }
          }
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            // start: 50,  // 初始只显示后半段数据，即最新的数据
            // end: 100,
            height: 25,
            bottom: 30,
            borderColor: 'rgba(102, 223, 251, 0.2)',
            textStyle: {
              color: 'rgba(255, 255, 255, 0.7)'
            },
            handleSize: '80%',
            handleStyle: {
              color: '#66dffb',
              shadowBlur: 3,
              shadowColor: 'rgba(0, 0, 0, 0.6)',
              shadowOffsetX: 2,
              shadowOffsetY: 2
            },
            dataBackground: {
              areaStyle: {
                color: 'rgba(102, 223, 251, 0.2)'
              },
              lineStyle: {
                color: 'rgba(102, 223, 251, 0.4)'
              }
            },
            fillerColor: 'rgba(102, 223, 251, 0.1)',
            xAxisIndex: 0,
            rangeMode: ['value', 'fixed'] // 左端点可拖动，右端点固定
          },
          {
            type: 'inside',
            xAxisIndex: 0,
            start: 50,  // 初始只显示后半段数据，即最新的数据
            end: 100
          }
        ],
        series: [
          {
            name: '实际' + (this.showTemperature ? '温度' : '压力'),
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: this.actualData,
            smooth: true,
            lineStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                offset: 0,
                color: 'rgba(255, 255, 255, 0.8)'
              }, {
                offset: 1,
                color: 'rgba(255, 255, 255, 1)'
              }]),
              width: 3
            },
            emphasis: {
              focus: 'series'
            }
          },
          {
            name: '预测' + (this.showTemperature ? '温度' : '压力'),
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: this.predictionData,
            smooth: true,
            lineStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                offset: 0,
                color: 'rgba(78, 205, 196, 0.8)'
              }, {
                offset: 1,
                color: 'rgba(78, 205, 196, 1)'
              }]),
              width: 3
            },
            markArea: {
              silent: true,
              itemStyle: {
                opacity: 0.05,
                color: '#4ecdc4'
              },
              data: [
                [{
                  xAxis: this.actualData[this.actualData.length - 1].value[0]
                }, {
                  xAxis: this.predictionData[this.predictionData.length - 1].value[0]
                }]
              ]
            },
            emphasis: {
              focus: 'series'
            }
          }
        ]
      };
      
      this.prediction_chart.setOption(option);
    },
    startDataUpdates() {
      const updatePeriod = 5; // 每5秒更新一次
      
      // 清除现有的更新计时器
      if (this.predictionTimer) {
        clearInterval(this.predictionTimer);
      }
      
      this.predictionTimer = setInterval(() => {
        const now = new Date();
        
        // 根据选中的阀室确定数据基准值和波动范围
        let baseValue, fluctuationRange;
        
        if (this.selectedValveInfo) {
          const valveNumber = this.selectedValveInfo.valveIndex || parseInt(this.selectedValveInfo.valveName.replace(/[^0-9]/g, '')) || 0;
          
          if (this.showTemperature) {
            baseValue = 20 + (valveNumber * 0.8);
            fluctuationRange = 2 + (valveNumber * 0.1);
          } else {
            baseValue = 300 - (valveNumber * 5);
            fluctuationRange = 20 + (valveNumber * 2);
          }
        } else {
          baseValue = this.showTemperature ? 25 : 250;
          fluctuationRange = this.showTemperature ? 5 : 50;
        }
        
        // 更新实际数据 - 添加新的数据点
        const randomFactor = Math.random() * fluctuationRange - (fluctuationRange / 2);
        const newActualValue = baseValue + randomFactor;
          
        const newActual = {
          name: now.toString(),
          value: [now.getTime(), newActualValue]
        };
        
        this.actualData.push(newActual);
        if (this.actualData.length > 30) {
          this.actualData.shift(); // 只保留30个数据点
        }
        
        // 重新生成预测数据
        this.predictionData = [];
        
        // 复制历史数据
        for (let i = 0; i < this.actualData.length; i++) {
          const variance = this.showTemperature ? (fluctuationRange * 0.2) : (fluctuationRange * 0.2);
          this.predictionData.push({
            name: this.actualData[i].name,
            value: [
              this.actualData[i].value[0],
              this.actualData[i].value[1] + (Math.random() * variance - variance/2)
            ]
          });
        }
        
        // 添加未来预测点
        const futurePoints = 20;
        const lastActualValue = this.actualData[this.actualData.length - 1].value[1];
        
        // 选择阀门后，未来趋势会有特定变化
        let trendDirection = 0;
        if (this.selectedValveInfo) {
          const valveNumber = this.selectedValveInfo.valveIndex || parseInt(this.selectedValveInfo.valveName.replace(/[^0-9]/g, '')) || 0;
          
          // 根据阀门编号决定趋势（奇数上升，偶数下降）
          trendDirection = (valveNumber % 2 === 0) ? -1 : 1;
          
          // 特定阀门的特殊趋势
          if (valveNumber === 3 || valveNumber === 7) {
            trendDirection *= 2;
          }
        }
        
        for (let i = 0; i < futurePoints; i++) {
          const futureTime = now.getTime() + (i + 1) * 1000;
          let predictedValue;
          
          if (i === 0) {
            // 第一个预测点基于最后一个实际值
            const variance = this.showTemperature ? (fluctuationRange * 0.3) : (fluctuationRange * 0.3);
            predictedValue = lastActualValue + (Math.random() * variance - variance/2);
          } else {
            // 后续预测点基于前一个预测，添加趋势
            const prevValue = this.predictionData[this.predictionData.length - 1].value[1];
            const variance = this.showTemperature ? (fluctuationRange * 0.16) : (fluctuationRange * 0.16);
            const trendFactor = (i / futurePoints) * (this.showTemperature ? 0.5 : 5) * trendDirection;
            
            predictedValue = prevValue + (Math.random() * variance - variance/2) + trendFactor;
          }
          
          this.predictionData.push({
            name: new Date(futureTime).toString(),
            value: [futureTime, predictedValue]
          });
        }
        
        // 获取当前dataZoom设置以维持缩放级别
        const dataZoomOption = this.prediction_chart.getOption().dataZoom;
        const start = dataZoomOption[0].start;
        const end = dataZoomOption[0].end;
        
        // 使用新数据更新图表
        this.prediction_chart.setOption({
          title: {
            text: this.selectedValveInfo ? 
              `${this.selectedValveInfo.valveName}${this.showTemperature ? '温度预测' : '压力预测'}` : 
              (this.showTemperature ? '温度预测' : '压力预测')
          },
          legend: {
            data: ['实际' + (this.showTemperature ? '温度' : '压力'), '预测' + (this.showTemperature ? '温度' : '压力')]
          },
          yAxis: {
            name: this.showTemperature ? '温度（℃）' : '压力（MPa）'
          },
          grid: {
            bottom: '20%'  // 确保更新时也保持一致的底部空间
          },
          dataZoom: [{
            start: start,
            end: end,
            bottom: 0,  // 确保dataZoom位置保持一致
            rangeMode: ['value', 'fixed'] // 左端点可拖动，右端点固定
          }, {
            start: start,
            end: end
          }],
          series: [
            {
              name: '实际' + (this.showTemperature ? '温度' : '压力'),
              data: this.actualData
            },
            {
              name: '预测' + (this.showTemperature ? '温度' : '压力'),
              data: this.predictionData,
              markArea: {
                data: [
                  [{
                    xAxis: this.actualData[this.actualData.length - 1].value[0]
                  }, {
                    xAxis: this.predictionData[this.predictionData.length - 1].value[0]
                  }]
                ]
              }
            }
          ]
        });
      }, updatePeriod * 1000);
    },
    toggleChartData() {
      // 停止当前更新
      if (this.predictionTimer) {
        clearInterval(this.predictionTimer);
      }
      
      // 使用新参数类型重新生成数据
      this.generateInitialData();
      this.drawPredictionChart();
      
      // 重新启动更新
      this.startDataUpdates();
    },
    resetValve() {
      // 通知父组件重置选中的阀室
      this.$emit('valve-reset');
      
      // 重新生成数据和更新图表
      this.generateInitialData();
      this.drawPredictionChart();
      this.startDataUpdates();
    }
  },
  watch: {
    pipelineId() {
      // 管线变更时更新图表
      if (this.predictionTimer) {
        clearInterval(this.predictionTimer);
      }
      this.generateInitialData();
      this.drawPredictionChart();
      this.startDataUpdates();
    },
    selectedValveInfo: {
      handler(newVal) {
        if (newVal) {
          console.log('阀门选择已更新:', newVal);
          
          // 重新生成数据和更新图表
          this.generateInitialData();
          this.drawPredictionChart();
          
          // 重新启动数据更新
          if (this.predictionTimer) {
            clearInterval(this.predictionTimer);
          }
          this.startDataUpdates();
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-header {
  margin-bottom: 5px;
  flex: 0 0 auto;
}

.chart-body {
  flex: 1;
  position: relative;
}

#prediction_chart {
  width: 100%;
  height: 100%;
  position: absolute;
}

.chart-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.chart-toggle {
  display: flex;
  align-items: center;
}

.valve-tag {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  background-color: rgba(24, 144, 255, 0.2);
  color: #66dffb;
  border-color: #1890ff;
  transition: all 0.3s;
  padding: 2px 8px;
}

.valve-tag:hover {
  background-color: rgba(24, 144, 255, 0.3);
}

.valve-tag i {
  margin-left: 5px;
}

.wgrytj_bt {
  color: #66dffb;
}
</style> 