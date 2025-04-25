<template>
  <div class="pipe-shutdown-capacity">
    <div class="control-panel">
      <div class="panel-header">
        <span class="panel-title">参数设置</span>
      </div>
      <div class="input-groups">
        <div class="input-group">
          <label for="pipeLength">管道长度 (km)</label>
          <div class="custom-number-input">
            <button class="decrease-btn" @click="decreaseValue('pipeLength', 0.01, 0)">-</button>
            <input type="text" v-model="pipeLength" class="number-input" />
            <button class="increase-btn" @click="increaseValue('pipeLength', 0.01)">+</button>
          </div>
        </div>
        <div class="input-group">
          <label for="pipeDiameter">管道内径 (mm)</label>
          <div class="custom-number-input">
            <button class="decrease-btn" @click="decreaseValue('pipeDiameter', 0.1, 0)">-</button>
            <input type="text" v-model="pipeDiameter" class="number-input" />
            <button class="increase-btn" @click="increaseValue('pipeDiameter', 0.1)">+</button>
          </div>
        </div>
        <div class="input-group">
          <label for="density">油品密度 (kg/m³)</label>
          <div class="custom-number-input">
            <button class="decrease-btn" @click="decreaseValue('density', 0.1, 600)">-</button>
            <input type="text" v-model="density" class="number-input" />
            <button class="increase-btn" @click="increaseValue('density', 0.1, 1000)">+</button>
          </div>
        </div>
        <div class="input-group">
          <label for="temperature">油品温度 (℃)</label>
          <div class="custom-number-input">
            <button class="decrease-btn" @click="decreaseValue('temperature', 0.1, -20)">-</button>
            <input type="text" v-model="temperature" class="number-input" />
            <button class="increase-btn" @click="increaseValue('temperature', 0.1, 60)">+</button>
          </div>
        </div>
        <div class="input-group">
          <label for="pressureIn">进站压力 (MPa)</label>
          <div class="custom-number-input">
            <button class="decrease-btn" @click="decreaseValue('pressureIn', 0.01, 0)">-</button>
            <input type="text" v-model="pressureIn" class="number-input" />
            <button class="increase-btn" @click="increaseValue('pressureIn', 0.01, 10)">+</button>
          </div>
        </div>
        <div class="input-group">
          <label for="pressureOut">出站压力 (MPa)</label>
          <div class="custom-number-input">
            <button class="decrease-btn" @click="decreaseValue('pressureOut', 0.01, 0)">-</button>
            <input type="text" v-model="pressureOut" class="number-input" />
            <button class="increase-btn" @click="increaseValue('pressureOut', 0.01, 10)">+</button>
          </div>
        </div>
        <div class="input-group">
          <label for="shutdownTime">停输时间 (h)</label>
          <div class="custom-number-input">
            <button class="decrease-btn" @click="decreaseValue('shutdownTime', 0.1, 0)">-</button>
            <input type="text" v-model="shutdownTime" class="number-input" />
            <button class="increase-btn" @click="increaseValue('shutdownTime', 0.1, 72)">+</button>
          </div>
        </div>
        <div class="input-group">
          <label for="viscosity">油品粘度 (mPa·s)</label>
          <div class="custom-number-input">
            <button class="decrease-btn" @click="decreaseValue('viscosity', 0.01, 0)">-</button>
            <input type="text" v-model="viscosity" class="number-input" />
            <button class="increase-btn" @click="increaseValue('viscosity', 0.01)">+</button>
          </div>
        </div>
      </div>
      <el-button type="primary" @click="calculateCapacity" size="small" class="calculate-btn">
        <i class="el-icon-refresh"></i> 计算
      </el-button>
    </div>

    <div class="results-panel">
      <div class="panel-header">
        <span class="panel-title">计算结果</span>
      </div>
      <div class="result-cards">
        <div class="result-card">
          <div class="result-icon">
            <i class="el-icon-s-data"></i>
          </div>
          <div class="result-content">
            <div class="result-label">原始管容量</div>
            <div class="result-value">{{ initialCapacity.toFixed(2) }} <span class="unit">m³</span></div>
          </div>
        </div>
        <div class="result-card">
          <div class="result-icon">
            <i class="el-icon-data-line"></i>
          </div>
          <div class="result-content">
            <div class="result-label">停输后管容量</div>
            <div class="result-value">{{ currentCapacity.toFixed(2) }} <span class="unit">m³</span></div>
          </div>
        </div>
        <div class="result-card">
          <div class="result-icon">
            <i class="el-icon-remove-outline"></i>
          </div>
          <div class="result-content">
            <div class="result-label">容量变化</div>
            <div class="result-value">{{ capacityChange.toFixed(2) }} <span class="unit">m³</span></div>
          </div>
        </div>
        <div class="result-card">
          <div class="result-icon">
            <i class="el-icon-pie-chart"></i>
          </div>
          <div class="result-content">
            <div class="result-label">变化率</div>
            <div class="result-value">{{ capacityChangeRate.toFixed(2) }} <span class="unit">%</span></div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="chart-container" ref="capacityChart"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'PipeShutdownCapacity',
  data() {
    return {
      pipeLength: 11, // km
      pipeDiameter: 508, // mm
      density: 745, // kg/m³
      temperature: 35, // ℃
      pressureIn: 2.0, // MPa
      pressureOut: 1.8, // MPa
      shutdownTime: 16, // h
      viscosity: 4.5, // mPa·s
      initialCapacity: 0,
      currentCapacity: 0,
      capacityChange: 0,
      capacityChangeRate: 0,
      chart: null
    }
  },
  mounted() {
    this.initChart()
    this.calculateCapacity()
  },
  methods: {
    initChart() {
      const chartDom = this.$refs.capacityChart
      this.chart = echarts.init(chartDom)
    },
    calculateCapacity() {
      // 1. 计算管道截面积 (m²)
      const radius = this.pipeDiameter / 2000 // 转换为米
      const crossSectionArea = Math.PI * radius * radius
      
      // 2. 计算管道总容积 (m³)
      this.initialCapacity = crossSectionArea * this.pipeLength * 1000
      
      // 3. 基于温度和压力对油品进行修正
      // 温度膨胀系数 (近似值)
      const tempExpansionCoef = 0.001 // 每°C
      // 压力压缩系数 (近似值)
      const pressureCompressionCoef = 0.0001 // 每MPa
      
      // 计算平均压力
      const avgPressure = (this.pressureIn + this.pressureOut) / 2
      
      // 温度修正 (以20℃为基准)
      const tempCorrectionFactor = 1 + tempExpansionCoef * (this.temperature - 20)
      
      // 压力修正
      const pressureCorrectionFactor = 1 - pressureCompressionCoef * avgPressure
      
      // 4. 计算停输后的衰减
      // 模拟停输后的容量变化 (指数衰减模型)
      const decayRate = 0.02 // 衰减率 (根据实际情况调整)
      const timeFactor = Math.exp(-decayRate * this.shutdownTime)
      
      // 5. 停输后流体粘度影响 (停输时间越长，粘度影响越大)
      const viscosityFactor = 1 - (0.005 * this.viscosity * (1 - timeFactor))
      
      // 6. 计算最终容量
      this.currentCapacity = this.initialCapacity * tempCorrectionFactor * 
                            pressureCorrectionFactor * timeFactor * viscosityFactor
      
      this.capacityChange = this.initialCapacity - this.currentCapacity
      this.capacityChangeRate = (this.capacityChange / this.initialCapacity) * 100
      
      // 绘制图表
      this.$nextTick(() => {
        this.drawCapacityChart()
      })
    },
    calculateCapacityAtTime(time) {
      // 计算给定时间点的管容量
      const radius = this.pipeDiameter / 2000
      const crossSectionArea = Math.PI * radius * radius
      const initialCapacity = crossSectionArea * this.pipeLength * 1000
      
      const tempExpansionCoef = 0.001
      const pressureCompressionCoef = 0.0001
      const avgPressure = (this.pressureIn + this.pressureOut) / 2
      
      const tempCorrectionFactor = 1 + tempExpansionCoef * (this.temperature - 20)
      const pressureCorrectionFactor = 1 - pressureCompressionCoef * avgPressure
      
      const decayRate = 0.02
      const timeFactor = Math.exp(-decayRate * time)
      
      const viscosityFactor = 1 - (0.005 * this.viscosity * (1 - timeFactor))
      
      return initialCapacity * tempCorrectionFactor * 
             pressureCorrectionFactor * timeFactor * viscosityFactor
    },
    drawCapacityChart() {
      if (!this.$refs.capacityChart) return;
      
      // 销毁之前的图表实例
      if (this.chart) {
        this.chart.dispose();
      }
      
      // 创建新的图表实例
      this.chart = echarts.init(this.$refs.capacityChart);
      
      // 生成时间数据
      const timeArray = [];
      const capacityArray = [];
      
      // 最大展示时间为停输时间的2倍，或者72小时，取较大值
      const maxTime = Math.max(72, this.shutdownTime * 2);
      
      for (let t = 0; t <= maxTime; t += maxTime / 50) {
        timeArray.push(t.toFixed(1));
        const capacity = this.calculateCapacityAtTime(t);
        capacityArray.push(capacity.toFixed(2));
      }
      
      // 标记点
      const markPoints = [
        {
          name: '起始容量',
          coord: [0, capacityArray[0]],
          value: parseFloat(capacityArray[0]),
          itemStyle: {
            color: '#00ffaa'
          },
          symbolSize: 8
        },
        {
          name: '停输后容量',
          coord: [this.shutdownTime.toString(), this.currentCapacity.toFixed(2)],
          value: this.currentCapacity.toFixed(2),
          itemStyle: {
            color: '#ff6e76'
          },
          symbolSize: 8,
          symbol: 'circle'
        }
      ];
      
      // 图表配置选项
      const option = {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        title: {
          text: '停输管容量变化趋势',
          left: 'center',
          textStyle: {
            color: '#fff',
            fontSize: 18,
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          },
          formatter: function(params) {
            return `时间: ${params[0].axisValue}h<br>容量: ${params[0].data}m³`;
          },
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderColor: 'rgba(0, 102, 255, 0.7)',
          textStyle: {
            color: '#fff'
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '10%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: timeArray,
          name: '时间 (h)',
          nameLocation: 'middle',
          nameGap: 30,
          nameTextStyle: {
            color: '#eee',
            fontSize: 14
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            }
          },
          axisTick: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            }
          },
          axisLabel: {
            color: '#eee',
            formatter: '{value}'
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
          name: '容量 (m³)',
          nameLocation: 'middle',
          nameGap: 50,
          nameTextStyle: {
            color: '#eee',
            fontSize: 14
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            }
          },
          axisTick: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            }
          },
          axisLabel: {
            color: '#eee',
            formatter: '{value}'
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.1)',
              type: 'dashed'
            }
          }
        },
        series: [
          {
            name: '管容量',
            type: 'line',
            data: capacityArray,
            markPoint: {
              data: markPoints,
              label: {
                formatter: '{b}: {c}m³',
                position: 'top'
              }
            },
            markLine: {
              data: [
                {
                  xAxis: this.shutdownTime,
                  name: '停输时间',
                  lineStyle: {
                    color: '#ff6e76'
                  },
                  label: {
                    formatter: '停输时间: {c}h',
                    position: 'middle'
                  }
                }
              ]
            },
            lineStyle: {
              width: 3,
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#00ffaa' },
                { offset: 1, color: '#0066ff' }
              ]),
              shadowColor: 'rgba(0, 255, 170, 0.5)',
              shadowBlur: 10
            },
            itemStyle: {
              color: '#0066ff',
              borderWidth: 2,
              borderColor: '#fff'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(0, 255, 170, 0.5)' },
                { offset: 1, color: 'rgba(0, 102, 255, 0.1)' }
              ])
            },
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            emphasis: {
              scale: true,
              lineStyle: {
                width: 4
              }
            }
          }
        ],
        animationDuration: 2000,
        animationEasing: 'cubicInOut'
      };
      
      this.chart.setOption(option);
      
      // 窗口大小改变时，重新调整图表大小
      window.addEventListener('resize', () => {
        this.chart && this.chart.resize();
      });
    },
    increaseValue(prop, step, max) {
      let newValue = parseFloat(this[prop]) + step;
      newValue = parseFloat(newValue.toFixed(2));
      if (max !== undefined && newValue > max) {
        newValue = max;
      }
      this[prop] = newValue;
    },
    decreaseValue(prop, step, min) {
      let newValue = parseFloat(this[prop]) - step;
      newValue = parseFloat(newValue.toFixed(2));
      if (min !== undefined && newValue < min) {
        newValue = min;
      }
      this[prop] = newValue;
    }
  }
}
</script>

<style scoped>
.pipe-shutdown-capacity {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  color: #fff;
  padding: 15px;
}

.panel-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.panel-title {
  font-size: 18px;
  font-weight: 500;
  position: relative;
  padding-left: 12px;
}

.panel-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 18px;
  background: linear-gradient(to bottom, #00ffaa, #0066ff);
  border-radius: 2px;
}

.control-panel {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.input-groups {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  position: relative;
}

.input-group label {
  margin-bottom: 8px;
  font-size: 14px;
  color: #eeeeee;
  opacity: 0.9;
}

.calculate-btn {
  padding: 10px 25px;
  font-size: 15px;
  background: linear-gradient(45deg, #00ffaa, #0066ff);
  border: none;
  transition: all 0.3s;
}

.calculate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
}

.calculate-btn:active {
  transform: translateY(0);
}

.results-panel {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.result-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.result-card {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 15px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
}

.result-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 255, 170, 0.2);
}

.result-icon {
  margin-right: 15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(45deg, rgba(0, 255, 170, 0.2), rgba(0, 102, 255, 0.2));
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-icon i {
  font-size: 20px;
  color: #00ffaa;
}

.result-content {
  flex: 1;
}

.result-label {
  font-size: 14px;
  color: #eeeeee;
  margin-bottom: 5px;
  opacity: 0.8;
}

.result-value {
  font-size: 22px;
  font-weight: bold;
  color: #00ffaa;
  text-shadow: 0 0 10px rgba(0, 255, 170, 0.3);
}

.unit {
  font-size: 14px;
  opacity: 0.8;
}

.chart-container {
  flex-grow: 1;
  min-height: 400px;
  height: 400px; /* 固定高度 */
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 10px;
  margin-top: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 下面是自定义控件样式 */
.input-group {
  position: relative;
}

/* 修改数字输入框的输入区域样式 */
:deep(.el-input-number .el-input__inner) {
  color: #ffffff;
  font-weight: bold;
}

/* 加减按钮样式覆盖 */
:deep(.el-input-number__decrease),
:deep(.el-input-number__increase) {
  background-color: #00b894 !important; 
  border-color: #00b894 !important;
  color: #000 !important;
  font-size: 20px !important;
  font-weight: bold !important;
}

:deep(.el-input-number__decrease:hover),
:deep(.el-input-number__increase:hover) {
  background-color: #00d1a0 !important;
}

:deep(.el-input-number__decrease span),
:deep(.el-input-number__increase span) {
  transform: scale(1.2);
  display: inline-block;
}

/* 自定义数字输入框样式 */
.custom-number-input {
  display: flex;
  width: 100%;
  height: 36px;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.2);
}

.custom-number-input .number-input {
  flex: 1;
  height: 100%;
  background-color: transparent;
  color: #ffffff;
  text-align: center;
  border: none;
  font-weight: bold;
  font-size: 16px;
  padding: 0 5px;
}

.custom-number-input .decrease-btn,
.custom-number-input .increase-btn {
  width: 36px;
  height: 36px;
  background-color: #00b894;
  color: #000000;
  font-size: 20px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.custom-number-input .decrease-btn:hover,
.custom-number-input .increase-btn:hover {
  background-color: #00e6a0;
}

.custom-number-input .decrease-btn:active,
.custom-number-input .increase-btn:active {
  background-color: #008f76;
}

.custom-number-input .decrease-btn {
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.custom-number-input .increase-btn {
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}
</style>

<!-- 使用全局样式覆盖默认样式 -->
<style>
/* 输入框全局样式 */
.el-input-number__decrease,
.el-input-number__increase {
  background-color: #00b894 !important;
  border: 1px solid #00b894 !important;
  color: #000000 !important;
  font-weight: bold !important;
  font-size: 30px !important;
  line-height: 30px !important;
  height: 30px !important;
}

.el-input-number__decrease i,
.el-input-number__increase i {
  color: #000000 !important;
  font-weight: bold !important;
  font-size: 18px !important;
  line-height: 26px !important;
}

.el-input-number .el-input__inner {
  color: #ffffff !important;
  background-color: #1a1e30 !important;
  font-weight: bold !important;
}

.el-input-number__decrease:hover,
.el-input-number__increase:hover {
  background-color: #00e6a0 !important;
  color: #000000 !important;
}

/* 添加自定义简单的加减按钮样式 */
.el-input-number {
  position: relative !important;
}

.el-input-number__increase {
  border-left: 1px solid #00b894 !important;
}

.el-input-number__decrease {
  border-right: 1px solid #00b894 !important;
}
</style> 