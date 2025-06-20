<template>
  <div class="oil-property-calculator">
    <div class="scrollable-content">
      <!-- <div class="header">
        <h2 class="title">油品物性计算</h2>
      </div> -->
      
      <div class="calculator-container">
        <!-- 输入参数区域 -->
        <div class="input-panel">
          <div class="input-section">
            <h3>输入参数</h3>
            
            <div class="input-group">
              <label>油品类型</label>
              <el-select v-model="oilType" placeholder="选择油品类型" @change="calculateProperties" size="small">
                <el-option v-for="item in oilTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
            
            <div class="input-group">
              <label>温度 (℃)</label>
              <div class="input-only">
                <input type="number" v-model.number="temperature" min="-20" max="100" step="1" @change="calculateProperties">
              </div>
            </div>
            
            <div class="input-group">
              <label>压力 (kPa)</label>
              <div class="input-only">
                <input type="number" v-model.number="pressure" min="80" max="300" step="5" @change="calculateProperties">
              </div>
            </div>
          </div>
          
          <!-- 显示当前选择的油品详细信息 -->
          <div class="oil-info-section">
            <h3>油品基础物性</h3>
            <div class="info-item">
              <span class="info-label">标准密度:</span>
              <span class="info-value">{{ getCurrentOilProperty('密度_标况') }} kg/m³</span>
            </div>
            <div class="info-item">
              <span class="info-label">标准黏度:</span>
              <span class="info-value">{{ getCurrentOilProperty('黏度_标况') }} mPa·s</span>
            </div>
            <div class="info-item">
              <span class="info-label">分子量:</span>
              <span class="info-value">{{ getCurrentOilProperty('分子量') }} g/mol</span>
            </div>
          </div>
        </div>
        
        <!-- 结果展示区域 -->
        <div class="results-panel">
          <div class="chart-container">
            <div class="modern-visualization">
              <h4>物性变化分析</h4>
              
              <!-- 密度变化显示 -->
              <div class="property-display">
                <div class="property-header">
                  <span class="property-name">密度变化</span>
                  <span class="property-percentage">{{ getDensityChangePercent() }}%</span>
                </div>
                <div class="progress-bar-container">
                  <div class="progress-bar">
                    <div class="progress-fill density-fill" :style="{ width: Math.abs(getDensityChangePercent()) * 10 + '%', backgroundColor: getDensityChangePercent() >= 0 ? '#ff6b6b' : '#4ecdc4' }"></div>
                  </div>
                  <div class="progress-labels">
                    <span>-10%</span>
                    <span>0%</span>
                    <span>+10%</span>
                  </div>
                </div>
              </div>
              
              <!-- 黏度变化显示 -->
              <div class="property-display">
                <div class="property-header">
                  <span class="property-name">黏度变化</span>
                  <span class="property-percentage">{{ getViscosityChangePercent() }}%</span>
                </div>
                <div class="progress-bar-container">
                  <div class="progress-bar">
                    <div class="progress-fill viscosity-fill" :style="{ width: Math.min(Math.abs(getViscosityChangePercent()), 100) + '%', backgroundColor: getViscosityChangePercent() >= 0 ? '#ff6b6b' : '#4ecdc4' }"></div>
                  </div>
                  <div class="progress-labels">
                    <span>-80%</span>
                    <span>0%</span>
                    <span>+200%</span>
                  </div>
                </div>
              </div>
              
              <!-- 数值对比卡片 -->
              <div class="comparison-cards">
                <div class="comparison-card">
                  <div class="card-header">密度对比</div>
                  <div class="value-comparison">
                    <div class="value-item">
                      <span class="value-label">标准</span>
                      <span class="value-number">{{ getCurrentOilProperty('密度_标况') }}</span>
                    </div>
                    <div class="arrow">→</div>
                    <div class="value-item">
                      <span class="value-label">当前</span>
                      <span class="value-number current">{{ density.toFixed(1) }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="comparison-card">
                  <div class="card-header">黏度对比</div>
                  <div class="value-comparison">
                    <div class="value-item">
                      <span class="value-label">标准</span>
                      <span class="value-number">{{ getCurrentOilProperty('黏度_标况') }}</span>
                    </div>
                    <div class="arrow">→</div>
                    <div class="value-item">
                      <span class="value-label">当前</span>
                      <span class="value-number current">{{ viscosity.toFixed(4) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 温度对物性影响预测部分 -->
      <!-- <div class="prediction-section">
        <h3>温度对物性影响预测</h3>
        <div class="tabs-container">
          <el-tabs v-model="activePredictionTab" @tab-click="handleTabClick">
            <el-tab-pane label="密度变化" name="density"></el-tab-pane>
            <el-tab-pane label="黏度变化" name="viscosity"></el-tab-pane>
          </el-tabs>
          <div id="predictionChart" ref="predictionChart" class="prediction-chart"></div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return {
      // 输入参数
      oilType: '0#柴油',
      temperature: 20,
      pressure: 101.325,
      
      // 计算结果
      density: 840.0,
      viscosity: 4.504,
      
      // 图表和选项
      predictionChart: null,
      activePredictionTab: 'density',
      
      // 标准条件
      T_std: 20.0, // °C
      P_std: 101.325, // kPa
      
      // 选项数据
      oilTypes: [
        { value: '0#柴油', label: '0#柴油' },
        { value: '92#汽油', label: '92#汽油' },
        { value: '95#汽油', label: '95#汽油' }
      ],
      
      // 油品物性数据库
      oilProperties: {
        '0#柴油': {
          '密度_标况': 840.0,
          '黏度_标况': 4.504,
          '分子量': 190.0,
          '临界温度': 720.0,
          '临界压力': 14.0,
          '偏心因子': 0.45,
          '膨胀系数_A': 0.000825,
          '膨胀系数_B': 2.9e-7,
          '压缩系数_C': 7.0e-7,
          '黏度温度系数_b': 1720,
          '黏度压力系数_c': 0.02
        },
        '92#汽油': {
          '密度_标况': 714.0,
          '黏度_标况': 0.5505,
          '分子量': 106.0,
          '临界温度': 480.0,
          '临界压力': 32.0,
          '偏心因子': 0.25,
          '膨胀系数_A': 0.00110,
          '膨胀系数_B': 3.5e-7,
          '压缩系数_C': 13.5e-7,
          '黏度温度系数_b': 800,
          '黏度压力系数_c': 0.04
        },
        '95#汽油': {
          '密度_标况': 732.1,
          '黏度_标况': 0.7,
          '分子量': 108.0,
          '临界温度': 490.0,
          '临界压力': 32.5,
          '偏心因子': 0.26,
          '膨胀系数_A': 0.00110,
          '膨胀系数_B': 3.5e-7,
          '压缩系数_C': 13.5e-7,
          '黏度温度系数_b': 820,
          '黏度压力系数_c': 0.04
        }
      },
      
      // 温度范围和预测数据
      temperatureRange: [-10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90],
      densityPrediction: [],
      viscosityPrediction: []
    };
  },
  mounted() {
    this.calculateProperties();
    this.$nextTick(() => {
      this.initCharts();
      // 窗口大小改变时重绘图表
      window.addEventListener('resize', this.resizeChart);
    });
  },
  beforeDestroy() {
    // 组件销毁前移除事件监听
    window.removeEventListener('resize', this.resizeChart);
  },
  methods: {
    getCurrentOilProperty(key) {
      return this.oilProperties[this.oilType][key];
    },
    
    calculateDensity(oilType, temperature, pressure) {
      try {
        const props = this.oilProperties[oilType];
        
        // 计算温度差
        const deltaT = temperature - this.T_std;
        
        // 温度修正
        const denominatorTemp = 1 + props['膨胀系数_A'] * deltaT + props['膨胀系数_B'] * deltaT * deltaT;
        
        if (Math.abs(denominatorTemp) < 1e-10) {
          throw new Error("温度修正项分母过小");
        }
        
        const densityT = props['密度_标况'] / denominatorTemp;
        
        // 压力修正
        const deltaP = pressure - this.P_std;
        const denominatorPressure = 1 - props['压缩系数_C'] * deltaP;
        
        if (Math.abs(denominatorPressure) < 1e-10) {
          throw new Error("压力修正项分母过小");
        }
        
        const density = densityT / denominatorPressure;
        
        return density;
      } catch (error) {
        console.error(`密度计算错误: ${error.message}`);
        return this.oilProperties[oilType]['密度_标况'];
      }
    },
    
    calculateViscosity(oilType, temperature, pressure) {
      try {
        const props = this.oilProperties[oilType];
        
        // 转换为绝对温度
        const TKStd = this.T_std + 273.15;
        const TK = temperature + 273.15;
        
        // 验证温度范围
        if (TK < 200 || TK > 600) {
          throw new Error(`温度超出范围 (200K-600K), 当前: ${TK}K`);
        }
        
        // 温度修正
        const viscosityTemp = props['黏度_标况'] * Math.exp(
          props['黏度温度系数_b'] * (1 / TK - 1 / TKStd)
        );
        
        // 压力修正
        const deltaP = pressure - this.P_std;
        const viscosity = viscosityTemp * Math.exp(props['黏度压力系数_c'] * deltaP / 1000);
        
        return viscosity;
      } catch (error) {
        console.error(`黏度计算错误: ${error.message}`);
        return this.oilProperties[oilType]['黏度_标况'];
      }
    },
    
    calculateProperties() {
      // 计算密度和黏度
      this.density = this.calculateDensity(this.oilType, this.temperature, this.pressure);
      this.viscosity = this.calculateViscosity(this.oilType, this.temperature, this.pressure);
      
      // 计算预测数据
      this.calculatePredictionData();
      
      // 更新图表
      this.updateCharts();
    },
    
    calculatePredictionData() {
      // 计算不同温度下的密度预测
      this.densityPrediction = this.temperatureRange.map(temp => {
        return this.calculateDensity(this.oilType, temp, this.pressure);
      });
      
      // 计算不同温度下的黏度预测
      this.viscosityPrediction = this.temperatureRange.map(temp => {
        return this.calculateViscosity(this.oilType, temp, this.pressure);
      });
    },
    
    initCharts() {
      // 初始化预测图表
      this.predictionChart = echarts.init(this.$refs.predictionChart);
      
      this.updateCharts();
    },
    
    updateCharts() {
      // 更新预测图表
      if (this.predictionChart) {
        const predictionOption = {
          tooltip: {
            trigger: 'axis',
            formatter: '{b}℃: {c}'
          },
          grid: {
            left: '8%',
            right: '5%',
            bottom: '10%',
            top: '10%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            name: '温度(℃)',
            data: this.temperatureRange,
            axisLine: {
              lineStyle: {
                color: '#999'
              }
            },
            axisLabel: {
              color: '#ccc',
              fontSize: 10
            }
          },
          yAxis: {
            type: 'value',
            name: this.activePredictionTab === 'density' ? '密度(kg/m³)' : '黏度(mPa·s)',
            axisLine: {
              lineStyle: {
                color: '#999'
              }
            },
            axisLabel: {
              color: '#ccc',
              fontSize: 10
            },
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: 'rgba(255, 255, 255, 0.1)'
              }
            }
          },
          series: [{
            name: this.activePredictionTab === 'density' ? '密度' : '黏度',
            type: 'line',
            data: this.activePredictionTab === 'density' ? this.densityPrediction : this.viscosityPrediction,
            smooth: true,
            lineStyle: {
              width: 3,
              color: this.activePredictionTab === 'density' ? '#3EACE5' : '#F02FC2'
            },
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              color: this.activePredictionTab === 'density' ? '#3EACE5' : '#F02FC2'
            },
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            }
          }]
        };
        
        this.predictionChart.setOption(predictionOption);
      }
    },
    
    handleTabClick() {
      this.$nextTick(() => {
        this.updateCharts();
      });
    },
    
    resizeChart() {
      if (this.predictionChart) {
        this.predictionChart.resize();
      }
    },
    
    getDensityChangePercent() {
      const stdDensity = this.getCurrentOilProperty('密度_标况');
      const currentDensity = this.density;
      const change = currentDensity - stdDensity;
      const percent = (change / stdDensity * 100).toFixed(1);
      return percent;
    },
    
    getViscosityChangePercent() {
      const stdViscosity = this.getCurrentOilProperty('黏度_标况');
      const currentViscosity = this.viscosity;
      const change = currentViscosity - stdViscosity;
      const percent = (change / stdViscosity * 100).toFixed(1);
      return percent;
    }
  },
  watch: {
    activePredictionTab() {
      this.updateCharts();
    }
  }
};
</script>

<style scoped>
.oil-property-calculator {
  width: 100%;
  height: 100%;
  background-color: #121212;
  color: #eee;
  position: relative;
  overflow: hidden;
}

.scrollable-content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 10px;
  box-sizing: border-box;
}

.header {
  text-align: center;
  margin-bottom: 10px;
}

.title {
  color: #eee;
  margin: 0;
  font-size: 18px;
  font-weight: normal;
}

.calculator-container {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.input-panel {
  width: 35%;
  background-color: #1e1e1e;
  border-radius: 4px;
  padding: 10px;
  border: 1px solid #333;
}

.input-section h3 {
  color: #09f;
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 16px;
  border-bottom: 1px solid #333;
  padding-bottom: 5px;
}

.input-group {
  margin-bottom: 12px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  color: #ccc;
  font-size: 13px;
}

.oil-info-section {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #333;
}

.oil-info-section h3 {
  color: #09f;
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 14px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 12px;
}

.info-label {
  color: #999;
}

.info-value {
  color: #ccc;
  font-weight: bold;
}

.results-panel {
  flex: 1;
  background-color: #1e1e1e;
  border-radius: 4px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  border: 1px solid #333;
}

.chart-container {
  flex: 1;
  position: relative;
  height: 200px;
  min-height: 150px;
}

.modern-visualization {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.property-display {
  margin-bottom: 10px;
}

.property-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.property-name {
  color: #999;
  font-size: 12px;
}

.property-percentage {
  color: #09f;
  font-size: 14px;
  font-weight: bold;
}

.progress-bar-container {
  height: 20px;
  background-color: #252525;
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #333;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 10px;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  padding: 0 5px;
  font-size: 10px;
  color: #999;
}

.comparison-cards {
  display: flex;
  justify-content: space-between;
}

.comparison-card {
  background-color: #252525;
  border-radius: 4px;
  padding: 12px;
  width: 48%;
  text-align: center;
}

.card-header {
  color: #999;
  font-size: 12px;
  margin-bottom: 2px;
}

.value-comparison {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.value-item {
  color: #ccc;
  font-size: 12px;
}

.value-label {
  color: #999;
  font-size: 10px;
}

.value-number {
  color: #09f;
  font-size: 14px;
  font-weight: bold;
}

.value-number.current {
  color: #ff6b6b;
}

.arrow {
  color: #999;
  font-size: 10px;
}

.prediction-section {
  background-color: #1e1e1e;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #333;
}

.prediction-section h3 {
  color: #09f;
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 16px;
  border-bottom: 1px solid #333;
  padding-bottom: 5px;
}

.tabs-container {
  height: 240px;
  position: relative;
}

.prediction-chart {
  height: 200px;
  width: 100%;
}

.input-only {
  width: 90%;
}

.input-only input {
  width: 100%;
  background-color: #252525;
  border: 1px solid #444;
  color: #fff;
  padding: 6px 8px;
  border-radius: 3px;
  text-align: center;
  font-size: 12px;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-input__inner) {
  background-color: #252525 !important;
  border-color: #444 !important;
  color: #fff !important;
}

:deep(.el-tabs__item) {
  color: #ccc;
  font-size: 14px;
  padding: 0 15px 0 0;
  height: 30px;
  line-height: 30px;
}

:deep(.el-tabs__item.is-active) {
  color: #09f;
}

:deep(.el-tabs__active-bar) {
  background-color: #09f;
}

:deep(.el-tabs__nav-wrap::after) {
  background-color: #333;
}
</style>