<!-- 物性数据分析板块 -->
<!-- <template>
<div>
<el-dropdown>
  <span class="el-dropdown-link">
    下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
  </span>
  <el-dropdown-menu slot="dropdown" @click="handleClick">
    <el-dropdown-item>黄金糕</el-dropdown-item>
    <el-dropdown-item>狮子头</el-dropdown-item>
    <el-dropdown-item>螺蛳粉</el-dropdown-item>
    <el-dropdown-item >双皮奶</el-dropdown-item>
    <el-dropdown-item >蚵仔煎</el-dropdown-item>
  </el-dropdown-menu>
</el-dropdown>
  <div id="chart" style="height: 800px;width: 800px;">
  </div>
  </div>
</template>
<style>
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>  
<script>

import * as echarts from 'echarts';
export default {
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    var chartDom = document.getElementById('chart');
    this.chart = echarts.init(chartDom);
    this.draw_chart();
  },
  methods: {
    draw_chart() {
      var option = {
  xAxis: {},
  yAxis: {},
  series: [
    {
      symbolSize: 20,
      data: [
        [10.0, 8.04],
        [8.07, 6.95],
        [13.0, 7.58],
        [9.05, 8.81],
        [11.0, 8.33],
        [14.0, 7.66],
        [13.4, 6.81],
        [10.0, 6.33],
        [14.0, 8.96],
        [12.5, 6.82],
        [9.15, 7.2],
        [11.5, 7.2],
        [3.03, 4.23],
        [12.2, 7.83],
        [2.02, 4.47],
        [1.05, 3.33],
        [4.05, 4.96],
        [6.03, 7.24],
        [12.0, 6.26],
        [12.0, 8.84],
        [7.08, 5.82],
        [5.02, 5.68]
      ],
      type: 'scatter'
    }
  ]
};
      this.chart.setOption(option);
    },
    handleClick(){}
  },
}
</script> -->

<!-- 散点图矩阵评估物理性质与压力变化之间的关系，增设下拉框选取不同的物理性质，如油品粘度、密度等 -->
<!-- <template>

  <div style="height: 100%;width: 100%">
    <span class="wgrytj_bt" style="font-size:1.2rem;">物性数据统计
      <el-select v-model="selectedView" @change="handleViewChange" placeholder="选择视图" size="mini"
        style="width: 120px;float: right;">
        <el-option v-for="view in views" :key="view.value" :label="view.label" :value="view.value" />
      </el-select>
    </span>
    <div ref="chartContainer" style="width: 100%; height: 100%;"></div>
  </div>
</template>
<script src="https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js"></script>
<script>
import * as echarts from 'echarts';
import { Select, Option } from 'element-ui';

export default {
  components: {
    [Select.name]: Select,
    [Option.name]: Option,
  },
  data() {
    return {
      selectedView: 'view1',
      views: [
        { label: '油品粘度', value: 'view1' },
        { label: '密度', value: 'view2' },
        { label: '温度', value: 'view3' },
        // 更多视图选项...
      ],
      chart: null,
    };
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chartContainer);
      this.updateChart();
    },
    updateChart() {
      const viewData = this.getViewData(this.selectedView);
      const option = {
        grid: {
          top: 40,
          bottom: 100,
          left: 30,
          right: 30
        },
        //用于定义图标的提示框
        tooltip: {
          // 表示提示框会在悬停或者点击时触发
          trigger: 'item',
          //用于定义坐标轴指示器（axis pointer），它会在用户悬停时显示。
          axisPointer: {
            //指示器的类型是交叉线。
            type: 'cross',
            crossStyle: {
              //交叉线的颜色。
              color: '#999',
            },
          },
        },
        xAxis: {
          //x轴的类型是类别轴，通常用于离散的标签。
          type: 'category',
          //x轴的数据，来自 viewData 对象中的 categories 属性。
          data: viewData.categories,
          name: viewData.xname,
          nameTextStyle: {
              color: '#fff',
              fontSize: 18,
          },
          nameGap: 30,
          nameLocation: 'center',
          splitLine: {
              show: false // 隐藏y轴的背景线
          },
          axisLabel: {
              color: 'white',
              fontSize: 16,
          },
        },
        yAxis: {
          //y轴的类型是值轴，通常用于连续的数据。
          type: 'value',
          name:viewData.yname,
          axisLine: {
            show: true // 隐藏 Y 轴的刻度线
          },
          splitLine: {
            show: false // 隐藏 Y 轴的分割线
          },
          axisTick: {
            alignWithLabel: true
          },
          nameTextStyle: {
              color: '#fff',
              fontSize: 18,
          },
          nameGap: 20,
          splitLine: {
              show: false // 隐藏y轴的背景线
          },
          axisLabel: {
              color: 'white',
              fontSize: 16
          },
        },
        series: [
        ],
      };
      if(this.selectedView === 'view1'){
        option.series.push({
            //来自 viewData 对象中的 data 属性。这里使用 map 方法将数据转换为 [x, y] 格式的数组，这是散点图需要的数据格式。
            data: viewData.data.map(item => [item[0], item[1]]),
            type: 'scatter', // 散点图,系列的类型是散点图。
            symbolSize: 12,
            itemStyle: {
              color: '#5dade2'
            }
          })
      }
      else{
        option.series.push({
            //来自 viewData 对象中的 data 属性。这里使用 map 方法将数据转换为 [x, y] 格式的数组，这是散点图需要的数据格式。
            data: viewData.data.map(item => [item[0], item[1]]),
            type: 'scatter', // 散点图,系列的类型是散点图。
            symbolSize: 12,
            itemStyle: {
              color: '#28b463'
            }
          })
      }
      this.chart.setOption(option, true);
    },
    handleViewChange() {
      this.updateChart();
    },
    getViewData(view) {
      function generateSimilarData() {
        let data = [];
        for (let i = 0; i < 50; i++) { // 生成5组数据
            let x = Math.floor(Math.random() * 51) + 10; // 生成10到60之间的随机数
            let y = Math.floor(Math.random() * 51) + 20; // 生成20到70之间的随机数
            data.push([x, y]);
        }
        return data;
      }
      var testdata1 = generateSimilarData();
      var testdata2 = generateSimilarData();
      // 根据视图返回不同的数据
      if (view === 'view1') {
        return {
          xname:'油品粘度',
          yname:'压力',
          nameLocation: 'left', // 坐标轴名称位置
            nameTextStyle: { // 坐标轴名称样式
            color: '#000',
            fontSize: 16,
            fontWeight: 'bold'
        },
          //categories: ['A', 'B', 'C', 'D', 'E'],
          data: testdata1
        };
      } else if (view === 'view2') {
        return {
          xname:'密度',
          yname:'压力',
          nameLocation: 'left', // 坐标轴名称位置
            nameTextStyle: { // 坐标轴名称样式
            color: '#000',
            fontSize: 16,
            fontWeight: 'bold'
        },
          //categories: ['W1', 'W2', 'W3', 'W4'],
          data: testdata2
        };
      }
      // 默认数据
      return {
        categories: ['A', 'B', 'C', 'D'],
        data: [
          [5, 5],
          [15, 15],
          [25, 25],
          [35, 35],
        ],
      };
    },
  },
  mounted() {
    //特别用于在组件被挂载到DOM后执行代码。这意味着所有的模板和DOM都已经渲染完毕，此时可以执行DOM操作或者执行依赖于DOM的操作。
    this.initChart();
  },
};
</script> -->



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
              <div class="slider-with-input">
                <div class="custom-input">
                  <input type="number" v-model.number="temperature" min="0" max="100" step="5" @change="calculateProperties">
                </div>
                <el-slider v-model="temperature" :min="0" :max="100" :step="5" @change="calculateProperties" class="compact-slider"></el-slider>
              </div>
            </div>
            
            <div class="input-group">
              <label>压力 (MPa)</label>
              <div class="slider-with-input">
                <div class="custom-input">
                  <input type="number" v-model.number="pressure" min="0" max="20" step="0.5" @change="calculateProperties">
                </div>
                <el-slider v-model="pressure" :min="0" :max="20" :step="0.5" @change="calculateProperties" class="compact-slider"></el-slider>
              </div>
            </div>
            
            <div class="input-group">
              <label>API重度</label>
              <el-input-number v-model="apiGravity" :min="10" :max="50" :step="0.5" @change="calculateProperties" size="small" class="compact-input"></el-input-number>
            </div>
          </div>
        </div>
        
        <!-- 结果展示区域 -->
        <div class="results-panel">
          <div class="property-cards">
            <div class="property-card">
              <div class="card-title">密度</div>
              <div class="card-value">{{ density.toFixed(2) }}</div>
              <div class="card-unit">kg/m³</div>
            </div>
            
            <div class="property-card">
              <div class="card-title">粘度</div>
              <div class="card-value">{{ viscosity.toFixed(2) }}</div>
              <div class="card-unit">mPa·s</div>
            </div>
            
            <div class="property-card">
              <div class="card-title">表面张力</div>
              <div class="card-value">{{ surfaceTension.toFixed(2) }}</div>
              <div class="card-unit">mN/m</div>
            </div>
            
            <div class="property-card">
              <div class="card-title">闪点</div>
              <div class="card-value">{{ flashPoint.toFixed(2) }}</div>
              <div class="card-unit">℃</div>
            </div>
          </div>
          
          <div class="chart-container">
            <div id="chartContainer" ref="chartContainer"></div>
          </div>
        </div>
      </div>
      
      <!-- 温度对物性影响预测部分 -->
      <div class="prediction-section">
        <h3>温度对物性影响预测</h3>
        <div class="tabs-container">
          <el-tabs v-model="activePredictionTab" @tab-click="handleTabClick">
            <el-tab-pane label="密度变化" name="density"></el-tab-pane>
            <el-tab-pane label="粘度变化" name="viscosity"></el-tab-pane>
          </el-tabs>
          <div id="predictionChart" ref="predictionChart" class="prediction-chart"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return {
      // 输入参数
      oilType: 'gasoline',
      temperature: 65,
      pressure: 5,
      apiGravity: 35,
      
      // 计算结果
      density: 724.0,
      viscosity: 0.28,
      surfaceTension: 18.0,
      flashPoint: -40.0,
      
      // 图表和选项
      mainChart: null,
      predictionChart: null,
      activePredictionTab: 'density',
      
      // 选项数据
      oilTypes: [
        { value: 'crude', label: '原油' },
        { value: 'diesel', label: '柴油' },
        { value: 'gasoline', label: '汽油' },
        { value: 'heavy', label: '重油' }
      ],
      
      // 温度范围和预测数据
      temperatureRange: [10, 20, 30, 40, 50, 60, 70, 80, 90],
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
    calculateProperties() {
      // 计算密度 (根据油品类型、温度、压力和API重度)
      let baseDensity = 870 - (this.apiGravity - 30) * 1.8;
      let tempEffect = (this.temperature - 25) * 0.7;
      let pressureEffect = (this.pressure - 1) * 0.5;
      
      if (this.oilType === 'gasoline') {
        baseDensity = 750;
        this.flashPoint = -40.0;
      } else if (this.oilType === 'diesel') {
        baseDensity = 830;
        this.flashPoint = 55.0;
      } else if (this.oilType === 'heavy') {
        baseDensity = 950;
        this.flashPoint = 90.0;
      } else {
        // 原油
        this.flashPoint = 60.0 + (this.apiGravity - 30) * 0.8;
      }
      
      this.density = baseDensity - tempEffect + pressureEffect;
      
      // 计算粘度
      let baseViscosity = 15;
      if (this.oilType === 'gasoline') baseViscosity = 0.5;
      if (this.oilType === 'diesel') baseViscosity = 3.0;
      if (this.oilType === 'heavy') baseViscosity = 50.0;
      
      // 粘度随温度变化的指数下降
      this.viscosity = baseViscosity * Math.exp(-0.02 * (this.temperature - 25)) * (1 + 0.05 * this.pressure);
      
      // 计算表面张力
      let baseTension = 30;
      if (this.oilType === 'gasoline') baseTension = 22;
      if (this.oilType === 'diesel') baseTension = 28;
      if (this.oilType === 'heavy') baseTension = 35;
      
      this.surfaceTension = baseTension - 0.1 * (this.temperature - 25);
      
      // 计算预测数据
      this.calculatePredictionData();
      
      // 更新图表
      this.updateCharts();
    },
    
    calculatePredictionData() {
      // 计算不同温度下的密度预测
      this.densityPrediction = this.temperatureRange.map(temp => {
        let baseDensity = 870 - (this.apiGravity - 30) * 1.8;
        let tempEffect = (temp - 25) * 0.7;
        let pressureEffect = (this.pressure - 1) * 0.5;
        
        if (this.oilType === 'gasoline') baseDensity = 750;
        else if (this.oilType === 'diesel') baseDensity = 830;
        else if (this.oilType === 'heavy') baseDensity = 950;
        
        return baseDensity - tempEffect + pressureEffect;
      });
      
      // 计算不同温度下的粘度预测
      this.viscosityPrediction = this.temperatureRange.map(temp => {
        let baseViscosity = 15;
        if (this.oilType === 'gasoline') baseViscosity = 0.5;
        if (this.oilType === 'diesel') baseViscosity = 3.0;
        if (this.oilType === 'heavy') baseViscosity = 50.0;
        
        return baseViscosity * Math.exp(-0.02 * (temp - 25)) * (1 + 0.05 * this.pressure);
      });
    },
    
    initCharts() {
      // 初始化雷达图
      this.mainChart = echarts.init(this.$refs.chartContainer);
      
      // 初始化预测图表
      this.predictionChart = echarts.init(this.$refs.predictionChart);
      
      this.updateCharts();
    },
    
    updateCharts() {
      // 更新雷达图
      if (this.mainChart) {
        // 计算归一化的值用于雷达图显示
        const normalizedDensity = this.density / 10; // 密度除以10使其在图表上更合理显示
        const normalizedViscosity = Math.min(100, this.viscosity * 2); // 粘度乘以2放大显示效果
        const normalizedTension = this.surfaceTension * 2; // 表面张力乘以2放大显示效果
        const normalizedFlashPoint = this.flashPoint < 0 ? 0 : Math.min(100, this.flashPoint); // 闪点最大显示100
        
        const option = {
          radar: {
            indicator: [
              { name: '密度', max: 100, axisLabel: {show: true} },
              { name: '粘度', max: 100, axisLabel: {show: true} },
              { name: '表面张力', max: 100, axisLabel: {show: true} },
              { name: '闪点', max: 100, axisLabel: {show: true} }
            ],
            radius: '70%',
            center: ['50%', '50%'],
            name: {
              textStyle: {
                color: '#fff',
                fontSize: 12
              }
            },
            splitArea: {
              areaStyle: {
                color: ['rgba(0, 65, 102, 0.1)', 'rgba(0, 65, 102, 0.2)']
              }
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(138, 138, 138, 0.3)'
              }
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(138, 138, 138, 0.3)'
              }
            }
          },
          series: [{
            name: '油品物性分析',
            type: 'radar',
            data: [{
              value: [
                normalizedDensity,
                normalizedViscosity,
                normalizedTension,
                normalizedFlashPoint
              ],
              name: '物性参数',
              areaStyle: {
                color: 'rgba(0, 153, 255, 0.5)'
              },
              lineStyle: {
                width: 2,
                color: 'rgba(0, 153, 255, 0.8)'
              },
              symbolSize: 6,
              itemStyle: {
                color: '#0099ff'
              }
            }]
          }]
        };
        
        this.mainChart.setOption(option);
      }
      
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
            name: this.activePredictionTab === 'density' ? '密度(kg/m³)' : '粘度(mPa·s)',
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
            name: this.activePredictionTab === 'density' ? '密度' : '粘度',
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
      if (this.mainChart) {
        this.mainChart.resize();
      }
      if (this.predictionChart) {
        this.predictionChart.resize();
      }
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

.results-panel {
  flex: 1;
  background-color: #1e1e1e;
  border-radius: 4px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  border: 1px solid #333;
}

.property-cards {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.property-card {
  background-color: #252525;
  border-radius: 4px;
  padding: 8px;
  width: 23%;
  text-align: center;
}

.card-title {
  color: #999;
  font-size: 12px;
  margin-bottom: 2px;
}

.card-value {
  color: #09f;
  font-size: 18px;
  font-weight: bold;
}

.card-unit {
  color: #666;
  font-size: 11px;
  margin-top: 2px;
}

.chart-container {
  flex: 1;
  position: relative;
  height: 200px;
  min-height: 150px;
}

#chartContainer {
  width: 100%;
  height: 100%;
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

.slider-with-input {
  display: flex;
  align-items: center;
}

.custom-input {
  width: 50px;
  margin-right: 10px;
}

.custom-input input {
  width: 100%;
  background-color: #252525;
  border: 1px solid #444;
  color: #fff;
  padding: 5px;
  border-radius: 2px;
  text-align: center;
}

.compact-slider {
  flex: 1;
}

.compact-input {
  width: 100% !important;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-input__inner) {
  background-color: #252525 !important;
  border-color: #444 !important;
  color: #fff !important;
}

:deep(.el-slider__runway) {
  margin: 8px 0;
  height: 4px;
  background-color: #333;
}

:deep(.el-slider__bar) {
  background-color: #09f;
  height: 4px;
}

:deep(.el-slider__button) {
  width: 12px;
  height: 12px;
  border: 2px solid #09f;
}

:deep(.el-input-number__decrease),
:deep(.el-input-number__increase) {
  background-color: #252525 !important;
  color: #fff !important;
  border-color: #444 !important;
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