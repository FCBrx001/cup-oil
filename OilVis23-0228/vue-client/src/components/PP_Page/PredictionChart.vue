<template>
  <div class="chart-container">
    <div class="chart-header" style="display: flex; justify-content: space-between; align-items: center; padding: 0 10px; margin-bottom: 5px;">
      <span class="wgrytj_bt" style="font-size:1.2rem;">
        {{ chartTitle }}
      </span>
      <div class="chart-controls">
        <!-- 选中站点标签显示 -->
        <div class="selected-valves" v-if="selectedValves && selectedValves.length > 0">
          <el-tag
            v-for="(valve, index) in selectedValves"
            :key="valve.valveName"
            size="small"
            :type="getTagType(index)"
            class="valve-tag"
            @click="removeValve(valve)"
          >
            {{ valve.valveName }} <i class="el-icon-close"></i>
          </el-tag>
          <el-button
            v-if="selectedValves.length > 1"
            type="text"
            size="mini"
            @click="clearAllValves"
            style="color: #f56c6c; margin-left: 5px;"
          >
            清空
          </el-button>
        </div>
        
        <!-- 显示选项切换按钮 -->
        <div class="chart-toggle">
          <div class="toggle-buttons">
            <button 
              class="toggle-btn"
              :class="{ active: showTemperature }"
              @click="toggleTemperature"
            >
              <i class="icon-temperature"></i>
              温度
            </button>
            <button 
              class="toggle-btn"
              :class="{ active: showPressure }"
              @click="togglePressure"
            >
              <i class="icon-pressure"></i>
              压力
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="chart-body">
      <!-- 双图表模式（多站点对比）-->
      <div v-if="shouldUseDualCharts" class="dual-chart-container">
        <div class="chart-section" v-if="showTemperature">
          <h4>温度对比分析</h4>
          <div id="temperature_chart"></div>
        </div>
        <div class="chart-section" v-if="showPressure">
          <h4>压力对比分析</h4>
          <div id="pressure_chart"></div>
        </div>
      </div>
      
      <!-- 单图表模式（默认或单站点）-->
      <div v-else>
        <div id="prediction_chart"></div>
      </div>
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
    selectedValves: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 图表实例
      prediction_chart: null,
      temperature_chart: null,
      pressure_chart: null,
      
      // 数据数组
      actualTemperatureData: [],
      actualPressureData: [],
      predictionTemperatureData: [],
      predictionPressureData: [],
      
      // 多站点数据存储
      multiStationData: new Map(),
      
      // 定时器
      predictionTimer: null,
      
      // 显示选项
      displayOptions: ['temperature', 'pressure'],
      
      // 颜色配置 - 科技蓝色主题
      stationColors: [
        '#66dffb', // 主蓝色
        '#52c41a', // 绿色
        '#1890ff', // 深蓝
        '#13c2c2', // 青色
        '#722ed1', // 紫色
        '#faad14', // 橙色
        '#eb2f96', // 粉色
        '#fa8c16'  // 橙红色
      ]
    }
  },
  
  computed: {
    showTemperature() {
      return this.displayOptions.includes('temperature');
    },
    showPressure() {
      return this.displayOptions.includes('pressure');
    },
    shouldUseDualCharts() {
      // 只有当选择了多个站点时才使用双图表模式
      return this.selectedValves && this.selectedValves.length > 1;
    },
    chartTitle() {
      if (this.selectedValves && this.selectedValves.length === 1) {
        return `${this.selectedValves[0].valveName}参数预测分析`;
      } else if (this.selectedValves && this.selectedValves.length > 1) {
        return `多站点参数对比分析 (${this.selectedValves.length}个站点)`;
      } else {
        return '管段参数动态预测 (黄埔站)';
      }
    }
  },

  mounted() {
    // 组件挂载时立即生成数据和绘制图表
    this.generateInitialData();
    this.$nextTick(() => {
      this.initChart();
    });
  },

  beforeDestroy() {
    // 清理定时器
    if (this.predictionTimer) {
      clearInterval(this.predictionTimer);
    }
    
    // 销毁图表实例
    this.disposeCharts();
  },

  methods: {
    initChart() {
      this.disposeCharts(); // 先清理现有图表
      
      this.$nextTick(() => {
        setTimeout(() => {
          // 重新生成初始数据
          this.generateInitialData();
          
          if (this.shouldUseDualCharts) {
            this.initDualCharts();
          } else {
            this.initSingleChart();
          }
          this.drawCharts();
          this.startDataUpdates();
        }, 100);
      });
    },

    initSingleChart() {
      const chartDom = document.getElementById('prediction_chart');
      if (chartDom && chartDom.offsetWidth > 0 && chartDom.offsetHeight > 0) {
        this.prediction_chart = echarts.init(chartDom);
        console.log('单图表初始化成功');
      }
    },

    initDualCharts() {
      if (this.showTemperature) {
        const tempChartDom = document.getElementById('temperature_chart');
        if (tempChartDom && tempChartDom.offsetWidth > 0 && tempChartDom.offsetHeight > 0) {
          this.temperature_chart = echarts.init(tempChartDom);
          console.log('温度图表初始化成功');
        }
      }

      if (this.showPressure) {
        const pressureChartDom = document.getElementById('pressure_chart');
        if (pressureChartDom && pressureChartDom.offsetWidth > 0 && pressureChartDom.offsetHeight > 0) {
          this.pressure_chart = echarts.init(pressureChartDom);
          console.log('压力图表初始化成功');
        }
      }
    },

    disposeCharts() {
      if (this.prediction_chart) {
        this.prediction_chart.dispose();
        this.prediction_chart = null;
      }
      if (this.temperature_chart) {
        this.temperature_chart.dispose();
        this.temperature_chart = null;
      }
      if (this.pressure_chart) {
        this.pressure_chart.dispose();
        this.pressure_chart = null;
      }
    },

    drawCharts() {
      try {
        if (this.shouldUseDualCharts) {
          this.drawDualCharts();
        } else {
          this.drawPredictionChart();
        }
      } catch (error) {
        console.error('绘制图表时出错:', error);
      }
    },

    drawPredictionChart() {
      if (!this.prediction_chart) return;

      try {
        const option = {
          backgroundColor: 'transparent',
          title: {
            left: 'center',
            textStyle: {
              color: '#66dffb',
              fontSize: 14,
              fontWeight: 'normal'
            }
          },
          tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 21, 41, 0.95)',
            borderColor: '#66dffb',
            borderWidth: 1,
            textStyle: {
              color: '#ffffff',
              fontSize: 12
            },
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: 'rgba(102, 223, 251, 0.6)'
              }
            }
          },
          legend: {
            orient: 'horizontal',
            top: 25,
            textStyle: {
              color: '#66dffb',
              fontSize: 12
            },
            itemGap: 20,
            itemWidth: 25,
            itemHeight: 14
          },
          grid: {
            left: '8%',
            right: '8%',
            bottom: '15%',
            top: '30%',
            containLabel: true,
            borderColor: 'rgba(102, 223, 251, 0.1)'
          },
          xAxis: {
            type: 'time',
            axisLine: {
              lineStyle: {
                color: 'rgba(102, 223, 251, 0.6)',
                width: 1
              }
            },
            axisLabel: {
              color: 'rgba(102, 223, 251, 0.8)',
              fontSize: 11,
              formatter: function (value) {
                const date = new Date(value);
                return date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            }
          },
          yAxis: this.getSingleChartYAxis(),
          dataZoom: [
            // X轴滑动条
            {
              type: 'slider',
              show: true,
              xAxisIndex: 0,
              height: 20,
              bottom: 0,
              borderColor: 'rgba(102, 223, 251, 0.3)',
              textStyle: {
                color: '#66dffb'
              },
              handleStyle: {
                color: '#66dffb'
              },
              dataBackground: {
                areaStyle: {
                  color: 'rgba(102, 223, 251, 0.2)'
                }
              },
              fillerColor: 'rgba(102, 223, 251, 0.3)',
              start: 0,
              end: 100
            },
            // X轴内部缩放
            {
              type: 'inside',
              xAxisIndex: 0
            },
            // Y轴滑动条
            {
              type: 'slider',
              show: true,
              yAxisIndex: 0,
              width: 20,
              left: 0,
              borderColor: 'rgba(102, 223, 251, 0.3)',
              textStyle: {
                color: '#66dffb'
              },
              handleStyle: {
                color: '#66dffb'
              },
              dataBackground: {
                areaStyle: {
                  color: 'rgba(102, 223, 251, 0.2)'
                }
              },
              fillerColor: 'rgba(102, 223, 251, 0.3)'
            },
            // Y轴内部缩放
            {
              type: 'inside',
              yAxisIndex: 0
            }
          ],
          series: this.getSingleChartSeries()
        };

        this.prediction_chart.setOption(option);
        console.log('单图表绘制完成');
      } catch (error) {
        console.error('绘制单图表时出错:', error);
      }
    },

    drawDualCharts() {
      this.drawTemperatureChart();
      this.drawPressureChart();
    },

    drawTemperatureChart() {
      if (!this.temperature_chart || !this.showTemperature) return;

      try {
        const series = [];
        
        this.selectedValves.forEach((valve, index) => {
          const color = this.stationColors[index % this.stationColors.length];
          const stationData = this.multiStationData.get(valve.valveName + '_temperature');
          
          if (stationData) {
            series.push({
              name: `${valve.valveName}实际`,
              type: 'line',
              data: stationData.actual,
              smooth: true,
              showSymbol: false,
              lineStyle: {
                color: color,
                width: 3,
                type: 'solid',
                shadowColor: `${color}40`,
                shadowBlur: 3
              },
              itemStyle: {
                color: color
              }
            });

            series.push({
              name: `${valve.valveName}预测`,
              type: 'line',
              data: stationData.prediction,
              smooth: true,
              showSymbol: false,
              lineStyle: {
                color: color,
                width: 2,
                type: 'dashed',
                dashArray: [8, 4],
                shadowColor: `${color}40`,
                shadowBlur: 3
              },
              itemStyle: {
                color: color
              }
            });
          }
        });

        const option = {
          backgroundColor: 'transparent',
          title: {
            left: 'center',
            textStyle: {
              color: '#66dffb',
              fontSize: 14,
              fontWeight: 'normal'
            }
          },
          tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 21, 41, 0.95)',
            borderColor: '#66dffb',
            borderWidth: 1,
            textStyle: {
              color: '#ffffff',
              fontSize: 12
            },
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: 'rgba(102, 223, 251, 0.6)'
              }
            }
          },
          legend: {
            orient: 'horizontal',
            top: 25,
            textStyle: {
              color: '#66dffb',
              fontSize: 11
            },
            itemGap: 15,
            itemWidth: 20,
            itemHeight: 12
          },
          grid: {
            left: '10%',
            right: '8%',
            bottom: '25%',
            top: '30%',
            containLabel: true,
            borderColor: 'rgba(102, 223, 251, 0.1)'
          },
          xAxis: {
            type: 'time',
            axisLine: {
              lineStyle: {
                color: 'rgba(102, 223, 251, 0.6)',
                width: 1
              }
            },
            axisLabel: {
              color: 'rgba(102, 223, 251, 0.8)',
              fontSize: 10,
              formatter: function (value) {
                const date = new Date(value);
                return date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            }
          },
          yAxis: {
            type: 'value',
            name: '温度 (℃)',
            nameTextStyle: {
              color: '#66dffb',
              fontSize: 11
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(102, 223, 251, 0.6)',
                width: 1
              }
            },
            axisLabel: {
              color: 'rgba(102, 223, 251, 0.8)',
              fontSize: 10
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(102, 223, 251, 0.15)',
                type: 'dashed'
              }
            },
            axisTick: {
              show: false
            }
          },
          dataZoom: [
            // X轴滑动条
            {
              type: 'slider',
              show: true,
              xAxisIndex: 0,
              height: 20,
              bottom: 0,
              borderColor: 'rgba(102, 223, 251, 0.3)',
              textStyle: {
                color: '#66dffb'
              },
              handleStyle: {
                color: '#66dffb'
              },
              dataBackground: {
                areaStyle: {
                  color: 'rgba(102, 223, 251, 0.2)'
                }
              },
              fillerColor: 'rgba(102, 223, 251, 0.3)',
              start: 0,
              end: 100
            },
            // X轴内部缩放
            {
              type: 'inside',
              xAxisIndex: 0
            },
            // Y轴滑动条
            {
              type: 'slider',
              show: true,
              yAxisIndex: 0,
              width: 20,
              left: 0,
              borderColor: 'rgba(102, 223, 251, 0.3)',
              textStyle: {
                color: '#66dffb'
              },
              handleStyle: {
                color: '#66dffb'
              },
              dataBackground: {
                areaStyle: {
                  color: 'rgba(102, 223, 251, 0.2)'
                }
              },
              fillerColor: 'rgba(102, 223, 251, 0.3)'
            },
            // Y轴内部缩放
            {
              type: 'inside',
              yAxisIndex: 0
            }
          ],
          series: series
        };

        this.temperature_chart.setOption(option);
        console.log('温度图表绘制完成');
      } catch (error) {
        console.error('绘制温度图表时出错:', error);
      }
    },

    drawPressureChart() {
      if (!this.pressure_chart || !this.showPressure) return;

      try {
        const series = [];
        
        this.selectedValves.forEach((valve, index) => {
          const color = this.stationColors[index % this.stationColors.length];
          const stationData = this.multiStationData.get(valve.valveName + '_pressure');
          
          if (stationData) {
            series.push({
              name: `${valve.valveName}实际`,
              type: 'line',
              data: stationData.actual,
              smooth: true,
              showSymbol: false,
              lineStyle: {
                color: color,
                width: 3,
                type: 'solid',
                shadowColor: `${color}40`,
                shadowBlur: 3
              },
              itemStyle: {
                color: color
              }
            });

            series.push({
              name: `${valve.valveName}预测`,
              type: 'line',
              data: stationData.prediction,
              smooth: true,
              showSymbol: false,
              lineStyle: {
                color: color,
                width: 2,
                type: 'dashed',
                dashArray: [8, 4],
                shadowColor: `${color}40`,
                shadowBlur: 3
              },
              itemStyle: {
                color: color
              }
            });
          }
        });

        const option = {
          backgroundColor: 'transparent',
          title: {
            left: 'center',
            textStyle: {
              color: '#52c41a',
              fontSize: 14,
              fontWeight: 'normal'
            }
          },
          tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 21, 41, 0.95)',
            borderColor: '#52c41a',
            borderWidth: 1,
            textStyle: {
              color: '#ffffff',
              fontSize: 12
            },
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: 'rgba(82, 196, 26, 0.6)'
              }
            }
          },
          legend: {
            orient: 'horizontal',
            top: 25,
            textStyle: {
              color: '#52c41a',
              fontSize: 11
            },
            itemGap: 15,
            itemWidth: 20,
            itemHeight: 12
          },
          grid: {
            left: '10%',
            right: '8%',
            bottom: '25%',
            top: '30%',
            containLabel: true,
            borderColor: 'rgba(82, 196, 26, 0.1)'
          },
          xAxis: {
            type: 'time',
            axisLine: {
              lineStyle: {
                color: 'rgba(82, 196, 26, 0.6)',
                width: 1
              }
            },
            axisLabel: {
              color: 'rgba(82, 196, 26, 0.8)',
              fontSize: 10,
              formatter: function (value) {
                const date = new Date(value);
                return date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            }
          },
          yAxis: {
            type: 'value',
            name: '压力 (MPa)',
            nameTextStyle: {
              color: '#52c41a',
              fontSize: 11
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(82, 196, 26, 0.6)',
                width: 1
              }
            },
            axisLabel: {
              color: 'rgba(82, 196, 26, 0.8)',
              fontSize: 10
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(82, 196, 26, 0.15)',
                type: 'dashed'
              }
            },
            axisTick: {
              show: false
            }
          },
          dataZoom: [
            // X轴滑动条
            {
              type: 'slider',
              show: true,
              xAxisIndex: 0,
              height: 20,
              bottom: 0,
              borderColor: 'rgba(82, 196, 26, 0.3)',
              textStyle: {
                color: '#52c41a'
              },
              handleStyle: {
                color: '#52c41a'
              },
              dataBackground: {
                areaStyle: {
                  color: 'rgba(82, 196, 26, 0.2)'
                }
              },
              fillerColor: 'rgba(82, 196, 26, 0.3)',
              start: 0,
              end: 100
            },
            // X轴内部缩放
            {
              type: 'inside',
              xAxisIndex: 0
            },
            // Y轴滑动条
            {
              type: 'slider',
              show: true,
              yAxisIndex: 0,
              width: 20,
              left: 0,
              borderColor: 'rgba(82, 196, 26, 0.3)',
              textStyle: {
                color: '#52c41a'
              },
              handleStyle: {
                color: '#52c41a'
              },
              dataBackground: {
                areaStyle: {
                  color: 'rgba(82, 196, 26, 0.2)'
                }
              },
              fillerColor: 'rgba(82, 196, 26, 0.3)'
            },
            // Y轴内部缩放
            {
              type: 'inside',
              yAxisIndex: 0
            }
          ],
          series: series
        };

        this.pressure_chart.setOption(option);
        console.log('压力图表绘制完成');
      } catch (error) {
        console.error('绘制压力图表时出错:', error);
      }
    },

    generateInitialData() {
      if (this.selectedValves.length > 1) {
        // 多站点模式
        this.generateMultiStationData();
      } else if (this.selectedValves.length === 1) {
        // 单站点模式，使用选中站点的数据
        this.generateSingleStationData();
      } else {
        // 默认模式，显示黄埔站数据
        this.generateDefaultStationData();
      }
    },
    
    generateDefaultStationData() {
      // 模拟黄埔站的默认数据
      const baseTime = new Date();
      const futurePoints = 10; // 未来预测点数量改为10，因为每次更新都会添加新的预测点
      const predictionStepInterval = 5000; // 5秒为一步
      const predictionStepsAhead = 10; // 预测领先10步
      const predictionTimeAhead = predictionStepInterval * predictionStepsAhead; // 50秒
      
      // 黄埔站的基准值
      const tempBaseValue = 88; // 88℃
      const pressureBaseValue = 2.6; // 2.6MPa
      const tempFluctuationRange = 2.0;
      const pressureFluctuationRange = 0.15;
      
      // 生成历史数据
      this.actualTemperatureData = [];
      this.actualPressureData = [];
      
      for (let i = 30; i >= 1; i--) {
        const time = new Date(baseTime.getTime() - i * predictionStepInterval); // 改用5秒间隔
        
        // 生成温度数据
        const tempRandomFactor = Math.random() * tempFluctuationRange - (tempFluctuationRange / 2);
        let tempValue = tempBaseValue + tempRandomFactor;
        tempValue = Math.max(80, Math.min(95, tempValue));
        
        this.actualTemperatureData.push({
          name: time.toString(),
          value: [time.getTime(), tempValue]
        });
        
        // 生成压力数据
        const pressureRandomFactor = Math.random() * pressureFluctuationRange - (pressureFluctuationRange / 2);
        let pressureValue = pressureBaseValue + pressureRandomFactor;
        pressureValue = Math.max(0.2, Math.min(3.5, pressureValue));
        
        this.actualPressureData.push({
          name: time.toString(),
          value: [time.getTime(), pressureValue]
        });
      }
      
      // 生成预测数据 - 基于真实数据，但时间领先50秒（10步）
      this.predictionTemperatureData = [];
      this.predictionPressureData = [];
      
      // 为每个历史真实数据点生成对应的预测数据点（时间领先50秒）
      for (let i = 0; i < this.actualTemperatureData.length; i++) {
        const actualTime = this.actualTemperatureData[i].value[0];
        const actualTempValue = this.actualTemperatureData[i].value[1];
        const actualPressureValue = this.actualPressureData[i].value[1];
        
        // 生成温度预测数据
        const tempPredictionTime = actualTime + predictionTimeAhead;
        const tempVariance = 0.3;
        const tempSystematicBias = 0.2;
        const tempRandomOffset = (Math.random() * tempVariance - tempVariance/2);
        const predictedTempValue = actualTempValue + tempSystematicBias + tempRandomOffset;
        
        this.predictionTemperatureData.push({
          name: new Date(tempPredictionTime).toString(),
          value: [
            tempPredictionTime,
            Math.max(80, Math.min(95, predictedTempValue))
          ]
        });
        
        // 生成压力预测数据
        const pressurePredictionTime = actualTime + predictionTimeAhead;
        const pressureVariance = 0.015;
        const pressureSystematicBias = -0.01;
        const pressureRandomOffset = (Math.random() * pressureVariance - pressureVariance/2);
        const predictedPressureValue = actualPressureValue + pressureSystematicBias + pressureRandomOffset;
        
        this.predictionPressureData.push({
          name: new Date(pressurePredictionTime).toString(),
          value: [
            pressurePredictionTime,
            Math.max(0.2, Math.min(3.5, predictedPressureValue))
          ]
        });
      }
      
      // 添加额外的未来预测点（基于最后的真实数据点）
      const lastActualTime = this.actualTemperatureData[this.actualTemperatureData.length - 1].value[0];
      const lastActualTempValue = this.actualTemperatureData[this.actualTemperatureData.length - 1].value[1];
      const lastActualPressureValue = this.actualPressureData[this.actualPressureData.length - 1].value[1];
      
      // 生成温度未来预测点
      for (let i = 1; i <= futurePoints; i++) {
        const futureActualTime = lastActualTime + i * predictionStepInterval;
        const futurePredictionTime = futureActualTime + predictionTimeAhead;
        
        let predictedValue;
        if (i === 1) {
          // 第一个未来点基于最后一个实际值
          const variance = 0.2;
          const systematicBias = 0.2;
          predictedValue = lastActualTempValue + systematicBias + (Math.random() * variance - variance/2);
        } else {
          // 后续点基于前一个预测点
          const prevValue = this.predictionTemperatureData[this.predictionTemperatureData.length - 1].value[1];
          const variance = 0.15;
          const trendFactor = (i / futurePoints) * 0.1; // 轻微上升趋势
          
          predictedValue = prevValue + (Math.random() * variance - variance/2) + trendFactor;
        }
        
        predictedValue = Math.max(80, Math.min(95, predictedValue));
        
        this.predictionTemperatureData.push({
          name: new Date(futurePredictionTime).toString(),
          value: [futurePredictionTime, predictedValue]
        });
      }
      
      // 生成压力未来预测点
      for (let i = 1; i <= futurePoints; i++) {
        const futureActualTime = lastActualTime + i * predictionStepInterval;
        const futurePredictionTime = futureActualTime + predictionTimeAhead;
        
        let predictedValue;
        if (i === 1) {
          // 第一个未来点基于最后一个实际值
          const variance = 0.01;
          const systematicBias = -0.01;
          predictedValue = lastActualPressureValue + systematicBias + (Math.random() * variance - variance/2);
        } else {
          // 后续点基于前一个预测点
          const prevValue = this.predictionPressureData[this.predictionPressureData.length - 1].value[1];
          const variance = 0.008;
          const trendFactor = (i / futurePoints) * -0.01; // 轻微下降趋势
          
          predictedValue = prevValue + (Math.random() * variance - variance/2) + trendFactor;
        }
        
        predictedValue = Math.max(0.2, Math.min(3.5, predictedValue));
        
        this.predictionPressureData.push({
          name: new Date(futurePredictionTime).toString(),
          value: [futurePredictionTime, predictedValue]
        });
      }
    },
    
    generateSingleStationData() {
      // 基础时间和预测周期设置
      const baseTime = new Date();
      const futurePoints = 10; // 未来预测点数量改为10
      const predictionStepInterval = 5000; // 5秒为一步
      const predictionStepsAhead = 10; // 预测领先10步
      const predictionTimeAhead = predictionStepInterval * predictionStepsAhead; // 50秒
      
      // 根据选中的站点确定数据基准值和波动范围
      let tempBaseValue = 87.8; // 基准温度87.8℃
      let tempFluctuationRange = 1.4; // 波动范围1.4℃ (86.4-89.2)
      let pressureBaseValue = 3.125; // 基准压力3.125 MPa
      let pressureFluctuationRange = 0.05; // 波动范围0.05 MPa (3.10-3.15)
      
      if (this.selectedValves.length > 0) {
        const valve = this.selectedValves[0];
        
        // 使用站点的实际数据如果可用
        if (valve.stationData) {
          tempBaseValue = valve.stationData.inletTemp || valve.stationData.outletTemp || 87.8;
          pressureBaseValue = valve.stationData.inletPressure || valve.stationData.outletPressure || 3.125;
        } else {
          const valveNumber = valve.valveIndex || parseInt(valve.valveName.replace(/[^0-9]/g, '')) || 0;
          // 根据阀门编号调整基准值
          tempBaseValue = 87.8 + (valveNumber * 0.05);
          pressureBaseValue = 3.125 + (valveNumber * 0.002);
        }
      }
      
      // 生成历史数据
      this.actualTemperatureData = [];
      this.actualPressureData = [];
      
      for (let i = 30; i >= 1; i--) {
        const time = new Date(baseTime.getTime() - i * predictionStepInterval); // 改用5秒间隔
        
        // 生成温度数据
        const tempRandomFactor = Math.random() * tempFluctuationRange - (tempFluctuationRange / 2);
        let tempValue = tempBaseValue + tempRandomFactor;
        tempValue = Math.max(80, Math.min(95, tempValue));
        
        this.actualTemperatureData.push({
          name: time.toString(),
          value: [time.getTime(), tempValue]
        });
        
        // 生成压力数据
        const pressureRandomFactor = Math.random() * pressureFluctuationRange - (pressureFluctuationRange / 2);
        let pressureValue = pressureBaseValue + pressureRandomFactor;
        pressureValue = Math.max(0.2, Math.min(3.5, pressureValue));
        
        this.actualPressureData.push({
          name: time.toString(),
          value: [time.getTime(), pressureValue]
        });
      }
      
      // 生成预测数据 - 基于真实数据，但时间领先50秒（10步）
      this.predictionTemperatureData = [];
      this.predictionPressureData = [];
      
      // 为每个历史真实数据点生成对应的预测数据点（时间领先50秒）
      for (let i = 0; i < this.actualTemperatureData.length; i++) {
        const actualTime = this.actualTemperatureData[i].value[0];
        const actualTempValue = this.actualTemperatureData[i].value[1];
        const actualPressureValue = this.actualPressureData[i].value[1];
        
        // 生成温度预测数据
        const tempPredictionTime = actualTime + predictionTimeAhead;
        const tempVariance = 0.3; // 温度预测数据的波动范围
        const tempSystematicBias = 0.2; // 预测值整体偏高
        const tempRandomOffset = (Math.random() * tempVariance - tempVariance/2);
        const predictedTempValue = actualTempValue + tempSystematicBias + tempRandomOffset;
        
        this.predictionTemperatureData.push({
          name: new Date(tempPredictionTime).toString(),
          value: [
            tempPredictionTime,
            Math.max(80, Math.min(95, predictedTempValue))
          ]
        });
        
        // 生成压力预测数据
        const pressurePredictionTime = actualTime + predictionTimeAhead;
        const pressureVariance = 0.015; // 压力预测数据的波动范围
        const pressureSystematicBias = -0.01; // 预测值整体偏低
        const pressureRandomOffset = (Math.random() * pressureVariance - pressureVariance/2);
        const predictedPressureValue = actualPressureValue + pressureSystematicBias + pressureRandomOffset;
        
        this.predictionPressureData.push({
          name: new Date(pressurePredictionTime).toString(),
          value: [
            pressurePredictionTime,
            Math.max(0.2, Math.min(3.5, predictedPressureValue))
          ]
        });
      }
      
      // 添加额外的未来预测点（基于最后的真实数据点）
      const lastActualTime = this.actualTemperatureData[this.actualTemperatureData.length - 1].value[0];
      const lastActualTempValue = this.actualTemperatureData[this.actualTemperatureData.length - 1].value[1];
      const lastActualPressureValue = this.actualPressureData[this.actualPressureData.length - 1].value[1];
      
      // 选择阀门后，未来趋势会有特定变化
      let trendDirection = 0;
      if (this.selectedValves.length > 0) {
        const valve = this.selectedValves[0];
        const valveNumber = valve.valveIndex || parseInt(valve.valveName.replace(/[^0-9]/g, '')) || 0;
        
        // 根据阀门编号决定趋势（奇数上升，偶数下降）
        trendDirection = (valveNumber % 2 === 0) ? -1 : 1;
        
        // 特定阀门的特殊趋势
        if (valveNumber === 3 || valveNumber === 7) {
          trendDirection *= 2; // 更强的趋势
        }
      }
      
      // 生成温度未来预测点
      for (let i = 1; i <= futurePoints; i++) {
        const futureActualTime = lastActualTime + i * predictionStepInterval;
        const futurePredictionTime = futureActualTime + predictionTimeAhead;
        
        let predictedValue;
        if (i === 1) {
          // 第一个未来点基于最后一个实际值，但添加明显的预测偏差
          const variance = 0.2;
          const systematicBias = 0.25; // 预测温度整体偏高
          predictedValue = lastActualTempValue + systematicBias + (Math.random() * variance - variance/2);
        } else {
          // 后续点基于前一个预测点，并添加趋势
          const prevValue = this.predictionTemperatureData[this.predictionTemperatureData.length - 1].value[1];
          const variance = 0.1;
          const trendFactor = (i / futurePoints) * 0.2 * trendDirection; // 增强趋势因子
          
          predictedValue = prevValue + (Math.random() * variance - variance/2) + trendFactor;
        }
        
        // 确保预测值在指定范围内
        predictedValue = Math.max(80, Math.min(95, predictedValue));
        
        this.predictionTemperatureData.push({
          name: new Date(futurePredictionTime).toString(),
          value: [futurePredictionTime, predictedValue]
        });
      }
      
      // 生成压力未来预测点
      for (let i = 1; i <= futurePoints; i++) {
        const futureActualTime = lastActualTime + i * predictionStepInterval;
        const futurePredictionTime = futureActualTime + predictionTimeAhead;
        
        let predictedValue;
        if (i === 1) {
          // 第一个未来点基于最后一个实际值，但添加明显的预测偏差
          const variance = 0.01;
          const systematicBias = -0.015; // 预测压力整体偏低
          predictedValue = lastActualPressureValue + systematicBias + (Math.random() * variance - variance/2);
        } else {
          // 后续点基于前一个预测点，并添加趋势
          const prevValue = this.predictionPressureData[this.predictionPressureData.length - 1].value[1];
          const variance = 0.008;
          const trendFactor = (i / futurePoints) * 0.02 * trendDirection; // 增强趋势因子
          
          predictedValue = prevValue + (Math.random() * variance - variance/2) + trendFactor;
        }
        
        // 确保预测值在指定范围内
        predictedValue = Math.max(0.2, Math.min(3.5, predictedValue));
        
        this.predictionPressureData.push({
          name: new Date(futurePredictionTime).toString(),
          value: [futurePredictionTime, predictedValue]
        });
      }
    },

    generateMultiStationData() {
      const baseTime = new Date();
      const historyPoints = 30;
      const futurePoints = 10; // 改为10个未来预测点
      const predictionStepInterval = 5000; // 5秒为一步
      const predictionStepsAhead = 10; // 预测领先10步
      const predictionTimeAhead = predictionStepInterval * predictionStepsAhead; // 50秒
      
      // 清空现有数据
      this.multiStationData.clear();
      
      this.selectedValves.forEach((valve, index) => {
        // 为每个站点设置不同的基准值，确保显著差异
        let tempBase = 88;  // 起始温度
        let pressureBase = 2.6;  // 起始压力
        
        // 根据站点类型和索引设置不同的基准值
        if (valve.stationType === 'startStation') {
          // 黄埔站
          tempBase = 88;
          pressureBase = 2.6;
        } else if (valve.stationType === 'endStation') {
          // 东莞站
          tempBase = 85;
          pressureBase = 0.8;
        } else if (valve.stationType === 'valve') {
          // 十字窖
          if (valve.valveIndex === 1) {
            tempBase = 87.5;
            pressureBase = 2.2;
          } else if (valve.valveIndex === 2) {
            tempBase = 86.5;
            pressureBase = 1.8;
          } else {
            tempBase = 86 + index * 0.8;
            pressureBase = 2.0 - index * 0.3;
          }
        } else {
          // 其他情况，给每个站点不同的基准值
          tempBase = 85 + index * 1.5;  // 85, 86.5, 88, 89.5...
          pressureBase = 2.8 - index * 0.4;  // 2.8, 2.4, 2.0, 1.6...
        }
        
        // 确保压力在合理范围内
        pressureBase = Math.max(0.5, Math.min(3.0, pressureBase));
        
        // 为温度和压力分别生成数据
        const temperatureData = {
          actual: [],
          prediction: []
        };
        
        const pressureData = {
          actual: [],
          prediction: []
        };
        
        // 生成历史数据
        for (let i = historyPoints; i >= 1; i--) {
          const time = baseTime.getTime() - i * predictionStepInterval; // 改用5秒间隔
          
          // 温度数据 - 增加变化幅度
          const tempVariation = (Math.random() - 0.5) * 4; // ±2度变化
          const cyclicalTemp = Math.sin((i / historyPoints) * Math.PI * 2) * 1.5; // 周期性变化
          const tempValue = tempBase + tempVariation + cyclicalTemp;
          
          temperatureData.actual.push({
            name: new Date(time).toString(),
            value: [time, Math.max(80, Math.min(95, tempValue))]
          });
          
          // 温度预测数据（基于真实值，时间领先50秒）
          const tempPredictionTime = time + predictionTimeAhead;
          const tempPredictBias = (Math.random() - 0.3) * 1.5; // 稍微偏高的预测
          const tempPrediction = tempValue + tempPredictBias;
          temperatureData.prediction.push({
            name: new Date(tempPredictionTime).toString(),
            value: [tempPredictionTime, Math.max(80, Math.min(95, tempPrediction))]
          });
          
          // 压力数据 - 增加变化幅度
          const pressureVariation = (Math.random() - 0.5) * 0.6; // ±0.3 MPa变化
          const cyclicalPressure = Math.cos((i / historyPoints) * Math.PI * 1.5) * 0.2; // 周期性变化
          const pressureValue = pressureBase + pressureVariation + cyclicalPressure;
          
          pressureData.actual.push({
            name: new Date(time).toString(),
            value: [time, Math.max(0.2, Math.min(3.5, pressureValue))]
          });
          
          // 压力预测数据（基于真实值，时间领先50秒）
          const pressurePredictionTime = time + predictionTimeAhead;
          const pressurePredictBias = (Math.random() - 0.4) * 0.2; // 稍微偏低的预测
          const pressurePrediction = pressureValue + pressurePredictBias;
          pressureData.prediction.push({
            name: new Date(pressurePredictionTime).toString(),
            value: [pressurePredictionTime, Math.max(0.2, Math.min(3.5, pressurePrediction))]
          });
        }
        
        // 生成未来预测数据
        const lastTempActual = temperatureData.actual[temperatureData.actual.length - 1].value[1];
        const lastPressureActual = pressureData.actual[pressureData.actual.length - 1].value[1];
        const lastActualTime = temperatureData.actual[temperatureData.actual.length - 1].value[0];
        
        for (let i = 1; i <= futurePoints; i++) {
          const futureActualTime = lastActualTime + i * predictionStepInterval;
          const futurePredictionTime = futureActualTime + predictionTimeAhead;
          
          // 温度未来预测 - 每个站点有不同的趋势
          const tempTrend = index % 3 === 0 ? -0.05 : (index % 3 === 1 ? 0.05 : 0.02); // 不同的趋势
          const tempNoise = (Math.random() - 0.5) * 1.2; // 增加噪声
          const tempFuture = lastTempActual + (tempTrend * i) + tempNoise;
          
          temperatureData.prediction.push({
            name: new Date(futurePredictionTime).toString(),
            value: [futurePredictionTime, Math.max(80, Math.min(95, tempFuture))]
          });
          
          // 压力未来预测 - 每个站点有不同的趋势
          const pressureTrend = index % 3 === 0 ? -0.01 : (index % 3 === 1 ? 0.008 : -0.005); // 不同的趋势
          const pressureNoise = (Math.random() - 0.5) * 0.15; // 增加噪声
          const pressureFuture = lastPressureActual + (pressureTrend * i) + pressureNoise;
          
          pressureData.prediction.push({
            name: new Date(futurePredictionTime).toString(),
            value: [futurePredictionTime, Math.max(0.2, Math.min(3.5, pressureFuture))]
          });
        }
        
        // 存储温度和压力数据
        this.multiStationData.set(valve.valveName + '_temperature', temperatureData);
        this.multiStationData.set(valve.valveName + '_pressure', pressureData);
        
        console.log(`${valve.valveName} - 温度基准: ${tempBase.toFixed(1)}℃, 压力基准: ${pressureBase.toFixed(2)}MPa`);
      });
    },

    startDataUpdates() {
      if (this.predictionTimer) {
        clearInterval(this.predictionTimer);
      }
      
      this.predictionTimer = setInterval(() => {
        this.updateRealtimeData();
      }, 5000);
    },

    updateRealtimeData() {
      const currentTime = Date.now();
      const predictionStepInterval = 5000; // 5秒为一步
      const predictionStepsAhead = 10; // 预测领先10步
      const predictionTimeAhead = predictionStepInterval * predictionStepsAhead; // 50秒
      
      if (this.shouldUseDualCharts) {
        // 多站点模式数据更新
        this.selectedValves.forEach((valve, index) => {
          const tempStationData = this.multiStationData.get(valve.valveName + '_temperature');
          const pressureStationData = this.multiStationData.get(valve.valveName + '_pressure');
          
          if (tempStationData) {
            // 添加新的温度实际数据点
            const lastTempActual = tempStationData.actual[tempStationData.actual.length - 1];
            const tempVariation = (Math.random() - 0.5) * 2.0;
            const tempCyclical = Math.sin((Date.now() + index * 10000) / 50000) * 1.2;
            const tempTrend = index % 3 === 0 ? -0.05 : (index % 3 === 1 ? 0.05 : 0);
            const tempSpike = (Math.random() < 0.08) ? (Math.random() - 0.5) * 1.5 : 0;
            const newTempValue = lastTempActual.value[1] + tempVariation + tempCyclical + tempTrend + tempSpike;
            
            tempStationData.actual.push({
              name: new Date(currentTime).toString(),
              value: [currentTime, Math.max(80, Math.min(95, newTempValue))]
            });
            
            // 同时生成新的预测数据点（领先10步/50秒）
            const predictionTime = currentTime + predictionTimeAhead;
            const tempPredictionVariance = 0.3;
            const tempSystematicBias = 0.2; // 预测系统性偏高
            const tempPredictionNoise = (Math.random() - 0.5) * tempPredictionVariance;
            // 基于当前真实值生成预测值，加入一些趋势预测
            const tempFutureTrend = tempTrend * 2; // 预测中的趋势可能更明显
            const predictedTempValue = newTempValue + tempSystematicBias + tempPredictionNoise + tempFutureTrend;
            
            tempStationData.prediction.push({
              name: new Date(predictionTime).toString(),
              value: [predictionTime, Math.max(80, Math.min(95, predictedTempValue))]
            });
            
            console.log(`${valve.valveName} - 实际温度: ${newTempValue.toFixed(2)}℃ (${new Date(currentTime).toLocaleTimeString()}) | 预测温度: ${predictedTempValue.toFixed(2)}℃ (${new Date(predictionTime).toLocaleTimeString()})`);
            
            // 移除旧的数据，保持数组长度
            if (tempStationData.actual.length > 60) {
              tempStationData.actual.shift();
            }
            if (tempStationData.prediction.length > 70) { // 预测数据稍多一些，因为包含未来点
              tempStationData.prediction.shift();
            }
          }
          
          if (pressureStationData) {
            // 添加新的压力实际数据点
            const lastPressureActual = pressureStationData.actual[pressureStationData.actual.length - 1];
            const pressureVariation = (Math.random() - 0.5) * 0.25;
            const pressureCyclical = Math.cos((Date.now() + index * 15000) / 70000) * 0.12;
            const pressureTrend = index % 3 === 0 ? -0.008 : (index % 3 === 1 ? 0.006 : -0.003);
            const pressureSpike = (Math.random() < 0.06) ? (Math.random() - 0.5) * 0.3 : 0;
            const newPressureValue = lastPressureActual.value[1] + pressureVariation + pressureCyclical + pressureTrend + pressureSpike;
            
            pressureStationData.actual.push({
              name: new Date(currentTime).toString(),
              value: [currentTime, Math.max(0.2, Math.min(3.5, newPressureValue))]
            });
            
            // 同时生成新的压力预测数据点（领先10步/50秒）
            const predictionTime = currentTime + predictionTimeAhead;
            const pressurePredictionVariance = 0.015;
            const pressureSystematicBias = -0.01; // 预测系统性偏低
            const pressurePredictionNoise = (Math.random() - 0.5) * pressurePredictionVariance;
            // 基于当前真实值生成预测值，加入一些趋势预测
            const pressureFutureTrend = pressureTrend * 1.5; // 预测中的趋势
            const predictedPressureValue = newPressureValue + pressureSystematicBias + pressurePredictionNoise + pressureFutureTrend;
            
            pressureStationData.prediction.push({
              name: new Date(predictionTime).toString(),
              value: [predictionTime, Math.max(0.2, Math.min(3.5, predictedPressureValue))]
            });
            
            console.log(`${valve.valveName} - 实际压力: ${newPressureValue.toFixed(3)}MPa (${new Date(currentTime).toLocaleTimeString()}) | 预测压力: ${predictedPressureValue.toFixed(3)}MPa (${new Date(predictionTime).toLocaleTimeString()})`);
            
            // 移除旧的数据
            if (pressureStationData.actual.length > 60) {
              pressureStationData.actual.shift();
            }
            if (pressureStationData.prediction.length > 70) {
              pressureStationData.prediction.shift();
            }
          }
        });
        this.drawDualCharts();
      } else {
        // 单站点/默认模式数据更新
        const lastTempActual = this.actualTemperatureData[this.actualTemperatureData.length - 1];
        const lastPressureActual = this.actualPressureData[this.actualPressureData.length - 1];
        
        // 添加新的温度实际数据
        const tempRandomFactor = (Math.random() - 0.5) * 1.5;
        const tempCyclical = Math.sin(Date.now() / 60000) * 0.8;
        const tempTrend = (Math.random() < 0.3) ? (Math.random() - 0.5) * 0.5 : 0;
        const newTempValue = lastTempActual.value[1] + tempRandomFactor + tempCyclical + tempTrend;
        
        this.actualTemperatureData.push({
          name: new Date(currentTime).toString(),
          value: [currentTime, Math.max(80, Math.min(95, newTempValue))]
        });
        
        // 同时生成新的温度预测数据点（领先10步/50秒）
        const tempPredictionTime = currentTime + predictionTimeAhead;
        const tempPredictionVariance = 0.3;
        const tempSystematicBias = 0.2; // 预测系统性偏高
        const tempPredictionNoise = (Math.random() - 0.5) * tempPredictionVariance;
        // 基于当前真实值生成预测值，可以加入一些智能预测逻辑
        const tempFutureTrend = tempTrend * 1.8; // 预测中放大趋势
        const predictedTempValue = newTempValue + tempSystematicBias + tempPredictionNoise + tempFutureTrend;
        
        this.predictionTemperatureData.push({
          name: new Date(tempPredictionTime).toString(),
          value: [tempPredictionTime, Math.max(80, Math.min(95, predictedTempValue))]
        });
        
        console.log(`数据更新 - 实际温度: ${newTempValue.toFixed(2)}℃ (${new Date(currentTime).toLocaleTimeString()}) | 预测温度: ${predictedTempValue.toFixed(2)}℃ (${new Date(tempPredictionTime).toLocaleTimeString()})`);
        
        // 添加新的压力实际数据
        const pressureRandomFactor = (Math.random() - 0.5) * 0.15;
        const pressureCyclical = Math.cos(Date.now() / 80000) * 0.08;
        const pressureTrend = (Math.random() < 0.25) ? (Math.random() - 0.5) * 0.06 : 0;
        const pressureSpike = (Math.random() < 0.05) ? (Math.random() - 0.5) * 0.2 : 0;
        const newPressureValue = lastPressureActual.value[1] + pressureRandomFactor + pressureCyclical + pressureTrend + pressureSpike;
        
        this.actualPressureData.push({
          name: new Date(currentTime).toString(),
          value: [currentTime, Math.max(0.2, Math.min(3.5, newPressureValue))]
        });
        
        // 同时生成新的压力预测数据点（领先10步/50秒）
        const pressurePredictionTime = currentTime + predictionTimeAhead;
        const pressurePredictionVariance = 0.015;
        const pressureSystematicBias = -0.01; // 预测系统性偏低
        const pressurePredictionNoise = (Math.random() - 0.5) * pressurePredictionVariance;
        // 基于当前真实值生成预测值
        const pressureFutureTrend = pressureTrend * 1.5; // 预测中的趋势
        const predictedPressureValue = newPressureValue + pressureSystematicBias + pressurePredictionNoise + pressureFutureTrend;
        
        this.predictionPressureData.push({
          name: new Date(pressurePredictionTime).toString(),
          value: [pressurePredictionTime, Math.max(0.2, Math.min(3.5, predictedPressureValue))]
        });
        
        console.log(`数据更新 - 实际压力: ${newPressureValue.toFixed(3)}MPa (${new Date(currentTime).toLocaleTimeString()}) | 预测压力: ${predictedPressureValue.toFixed(3)}MPa (${new Date(pressurePredictionTime).toLocaleTimeString()})`);
        
        // 移除旧数据，保持合理的数据量
        if (this.actualTemperatureData.length > 60) {
          this.actualTemperatureData.shift();
        }
        if (this.actualPressureData.length > 60) {
          this.actualPressureData.shift();
        }
        if (this.predictionTemperatureData.length > 70) { // 预测数据包含更多未来点
          this.predictionTemperatureData.shift();
        }
        if (this.predictionPressureData.length > 70) {
          this.predictionPressureData.shift();
        }
        
        this.drawPredictionChart();
      }
    },

    toggleChartData() {
      console.log('切换图表显示:', this.displayOptions);
      
      // 停止当前的数据更新
      if (this.predictionTimer) {
        clearInterval(this.predictionTimer);
      }
      
      // 重新初始化图表
      this.$nextTick(() => {
        this.initChart();
      });
    },

    handleResize() {
      if (this.shouldUseDualCharts) {
        if (this.temperature_chart) this.temperature_chart.resize();
        if (this.pressure_chart) this.pressure_chart.resize();
      } else {
        if (this.prediction_chart) this.prediction_chart.resize();
      }
    },

    getTagType(index) {
      const types = ['success', 'warning', 'info', 'danger'];
      return types[index % types.length];
    },

    removeValve(valve) {
      this.$emit('remove-valve', valve);
    },

    clearAllValves() {
      this.$emit('clear-all-valves');
    },

    toggleTemperature() {
      if (this.showTemperature) {
        // 如果当前显示温度，且同时也显示压力，则可以关闭温度
        // 如果只显示温度，则不允许关闭（至少保留一个选项）
        if (this.showPressure) {
          this.displayOptions = this.displayOptions.filter(option => option !== 'temperature');
        }
      } else {
        this.displayOptions.push('temperature');
      }
      this.toggleChartData();
    },

    togglePressure() {
      if (this.showPressure) {
        // 如果当前显示压力，且同时也显示温度，则可以关闭压力
        // 如果只显示压力，则不允许关闭（至少保留一个选项）
        if (this.showTemperature) {
          this.displayOptions = this.displayOptions.filter(option => option !== 'pressure');
        }
      } else {
        this.displayOptions.push('pressure');
      }
      this.toggleChartData();
    },

    getSingleChartSeries() {
      const series = [];
      const showBothTypes = this.showTemperature && this.showPressure;
      
      // 根据显示选项添加温度系列
      if (this.showTemperature) {
        series.push({
          name: '实际温度',
          type: 'line',
          yAxisIndex: 0,
          data: this.actualTemperatureData,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            color: '#66dffb',
            width: 3,
            type: 'solid',
            shadowColor: 'rgba(102, 223, 251, 0.3)',
            shadowBlur: 4
          },
          itemStyle: {
            color: '#66dffb'
          }
        });

        series.push({
          name: '预测温度',
          type: 'line',
          yAxisIndex: 0,
          data: this.predictionTemperatureData,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            color: '#1890ff',
            width: 2,
            type: 'dashed',
            dashArray: [8, 4],
            shadowColor: 'rgba(24, 144, 255, 0.3)',
            shadowBlur: 4
          },
          itemStyle: {
            color: '#1890ff'
          }
        });
      }
      
      // 根据显示选项添加压力系列
      if (this.showPressure) {
        const pressureYAxisIndex = showBothTypes ? 1 : 0; // 如果同时显示两种数据，压力用右轴；否则用左轴
        
        series.push({
          name: '实际压力',
          type: 'line',
          yAxisIndex: pressureYAxisIndex,
          data: this.actualPressureData,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            color: '#52c41a',
            width: 3,
            type: 'solid',
            shadowColor: 'rgba(82, 196, 26, 0.3)',
            shadowBlur: 4
          },
          itemStyle: {
            color: '#52c41a'
          }
        });

        series.push({
          name: '预测压力',
          type: 'line',
          yAxisIndex: pressureYAxisIndex,
          data: this.predictionPressureData,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            color: '#13c2c2',
            width: 2,
            type: 'dashed',
            dashArray: [8, 4],
            shadowColor: 'rgba(19, 194, 194, 0.3)',
            shadowBlur: 4
          },
          itemStyle: {
            color: '#13c2c2'
          }
        });
      }
      
      return series;
    },

    getSingleChartYAxis() {
      const yAxis = [];
      
      // 根据显示选项添加Y轴
      if (this.showTemperature && this.showPressure) {
        // 同时显示温度和压力时，使用双Y轴
        yAxis.push({
          type: 'value',
          name: '温度 (℃)',
          position: 'left',
          nameTextStyle: {
            color: '#66dffb',
            fontSize: 12
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(102, 223, 251, 0.6)',
              width: 1
            }
          },
          axisLabel: {
            color: 'rgba(102, 223, 251, 0.8)',
            fontSize: 11
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(102, 223, 251, 0.15)',
              type: 'dashed'
            }
          },
          axisTick: {
            show: false
          }
        });

        yAxis.push({
          type: 'value',
          name: '压力 (MPa)',
          position: 'right',
          nameTextStyle: {
            color: '#52c41a',
            fontSize: 12
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(82, 196, 26, 0.6)',
              width: 1
            }
          },
          axisLabel: {
            color: 'rgba(82, 196, 26, 0.8)',
            fontSize: 11
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        });
      } else if (this.showTemperature) {
        // 只显示温度
        yAxis.push({
          type: 'value',
          name: '温度 (℃)',
          position: 'left',
          nameTextStyle: {
            color: '#66dffb',
            fontSize: 12
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(102, 223, 251, 0.6)',
              width: 1
            }
          },
          axisLabel: {
            color: 'rgba(102, 223, 251, 0.8)',
            fontSize: 11
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(102, 223, 251, 0.15)',
              type: 'dashed'
            }
          },
          axisTick: {
            show: false
          }
        });
      } else if (this.showPressure) {
        // 只显示压力
        yAxis.push({
          type: 'value',
          name: '压力 (MPa)',
          position: 'left',
          nameTextStyle: {
            color: '#52c41a',
            fontSize: 12
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(82, 196, 26, 0.6)',
              width: 1
            }
          },
          axisLabel: {
            color: 'rgba(82, 196, 26, 0.8)',
            fontSize: 11
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(82, 196, 26, 0.15)',
              type: 'dashed'
            }
          },
          axisTick: {
            show: false
          }
        });
      }
      
      return yAxis;
    }
  },

  watch: {
    pipelineId() {
      // 管线变更时更新图表
      if (this.predictionTimer) {
        clearInterval(this.predictionTimer);
      }
      this.generateInitialData();
      this.drawCharts();
      this.startDataUpdates();
    },
    
    selectedValves: {
      handler(newVal, oldVal) {
        console.log('阀门选择已更新:', newVal);
        
        // 停止当前的数据更新
        if (this.predictionTimer) {
          clearInterval(this.predictionTimer);
        }
        
        // 检查是否需要切换图表模式
        const oldMode = oldVal && oldVal.length > 1;
        const newMode = newVal && newVal.length > 1;
        
        if (oldMode !== newMode) {
          // 需要重新初始化图表
          this.$nextTick(() => {
            this.initChart();
          });
        } else {
          // 只需要重新生成数据和绘制
          this.generateInitialData();
          this.$nextTick(() => {
            this.drawCharts();
            this.startDataUpdates();
          });
        }
      },
      deep: true
    },
    
    shouldUseDualCharts: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          // 图表模式变化，需要重新初始化
          this.$nextTick(() => {
            this.initChart();
          });
        }
      }
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

.dual-chart-container {
  display: flex;
  height: 100%;
  gap: 10px;
}

.chart-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chart-section h4 {
  color: #66dffb;
  margin: 0 0 10px 0;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  text-shadow: 0 0 5px rgba(102, 223, 251, 0.3);
  padding: 5px 0;
  border-bottom: 1px solid rgba(102, 223, 251, 0.2);
}

#temperature_chart,
#pressure_chart {
  flex: 1;
  width: 100%;
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

.selected-valves {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
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

.custom-checkbox {
  margin-right: 15px;
}

.custom-checkbox:last-child {
  margin-right: 0;
}

.el-checkbox-group {
  display: flex;
  align-items: center;
}

.el-checkbox__label {
  color: #ffffff !important;
  font-size: 12px;
}

.el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #1890ff;
  border-color: #1890ff;
}

.el-checkbox__inner {
  border-color: #66dffb;
}

.el-checkbox__inner:hover {
  border-color: #1890ff;
}

/* 切换按钮样式 */
.toggle-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid rgba(102, 223, 251, 0.3);
  background: rgba(0, 21, 41, 0.6);
  color: rgba(102, 223, 251, 0.8);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 12px;
  outline: none;
  position: relative;
  overflow: hidden;
}

.toggle-btn:before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(102, 223, 251, 0.1), transparent);
  transition: left 0.5s;
}

.toggle-btn:hover:before {
  left: 100%;
}

.toggle-btn:hover {
  border-color: rgba(102, 223, 251, 0.6);
  color: #66dffb;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(102, 223, 251, 0.2);
}

.toggle-btn.active {
  border-color: #66dffb;
  background: linear-gradient(135deg, rgba(102, 223, 251, 0.2), rgba(82, 196, 26, 0.1));
  color: #66dffb;
  box-shadow: 0 0 10px rgba(102, 223, 251, 0.3);
}

.toggle-btn.active:hover {
  box-shadow: 0 0 15px rgba(102, 223, 251, 0.4);
}

.icon-temperature:before {
  content: "🌡️";
  font-size: 14px;
}

.icon-pressure:before {
  content: "📊";
  font-size: 14px;
}
</style> 