<template>
  <div class="chart-container">
    <div class="chart-header" style="display: flex; justify-content: space-between; align-items: center; padding: 0 10px; margin-bottom: 5px; position: relative;">
      <span class="wgrytj_bt" style="font-size:1.2rem;">
        <!-- {{ chartTitle }} -->
      </span>
      <div class="chart-controls">
        <!-- 选中站点标签显示 -->
        <div class="selected-valves">
          <!-- 真实选中的站点标签 -->
          <el-tag
            v-for="(valve, index) in selectedValves"
            :key="valve.valveName"
            size="small"
            :type="getTagType(index)"
            class="valve-tag"
            @click="removeValve(valve)"
            closable
            @close="removeValve(valve)"
            style="fontSize: 14px;"
          >
            {{ valve.valveName }}
          </el-tag>
          
          <!-- 默认黄埔站标签（当没有选中站点时显示） -->
          <el-tag
            v-if="selectedValves.length === 0"
            size="small"
            type="success"
            class="valve-tag default-tag"
          >
            黄埔
          </el-tag>
        </div>
        
        <!-- 显示选项切换按钮 -->
        <div class="chart-toggle">
          <div class="toggle-buttons">
            <!-- 单站点模式下的温度/压力切换按钮 -->
            <template v-if="!shouldUseDualMode">
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
            </template>
            
            <!-- 双站点模式下的温度/压力切换开关 -->
            <div v-if="shouldUseDualMode" class="dual-mode-toggle">
              <label class="checkbox-item">
                <span class="label-left">压力</span>
                <div class="single-checkbox-switch">
                  <input 
                    type="checkbox" 
                    :checked="dualModeType === 'temperature'"
                    @change="switchDualMode(dualModeType === 'pressure' ? 'temperature' : 'pressure')"
                  />
                  <span class="checkbox-custom"></span>
                </div>
                <span class="label-right">温度</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="chart-body">
      <!-- 统一使用单图表模式 -->
      <div id="prediction_chart" style="width:100%; height:350px; margin-left: -50px;"></div>
    </div>
    
    <!-- 数据状态显示 -->
    <div class="data-status" style="margin-top: 10px; padding: 8px; background: rgba(0, 21, 41, 0.4); border-radius: 4px; font-size: 12px; color: #66dffb;">
      <span>当前站点: {{ currentStationName }}</span> | 
      <span>真实数据: 温度{{ realDataCount.temperature }}条 / 压力{{ realDataCount.pressure }}条</span> | 
      <span>预测数据: 温度{{ predictionDataCount.temperature }}条 / 压力{{ predictionDataCount.pressure }}条</span>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'PredictionChart',
  props: {
    selectedValves: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 图表实例
      prediction_chart: null,
      
      // 默认显示的站点名称
      defaultStationName: '站点2',
      
      // 定时器
      predictionTimer: null,
      realTimeTimer: null,
      resizeTimer: null,
      
      // 显示选项
      displayOptions: ['temperature', 'pressure'],
      
      // 颜色配置
      stationColors: [
        '#66dffb', '#52c41a', '#1890ff', '#13c2c2', 
        '#722ed1', '#faad14', '#eb2f96', '#fa8c16'
      ],
      dataInitialized: false,
      drawChartsTimer: null,

      // 双站点模式相关
      dualModeType: 'pressure', // 'pressure' 或 'temperature'
      dualModeOptions: { // 双站点模式下的图表选项
        pressure: {
          title: '压力',
          yAxisName: '压力 (MPa)',
          yAxisColor: '#ff6b6b',
          yAxisLabelFormatter: '{value}MPa'
        },
        temperature: {
          title: '温度',
          yAxisName: '温度 (℃)',
          yAxisColor: '#ffd166',
          yAxisLabelFormatter: '{value}℃'
        }
      }
    }
  },
  
  computed: {
    ...mapGetters([
      'getCombinedStationData',
      'getRealTimeUpdateFlag',
      'getPredictionUpdateFlag',
      'getRealTimeDataCount',
      'getPredictionDataCount'
    ]),
    
    showTemperature() {
      return this.displayOptions.includes('temperature');
    },
    showPressure() {
      return this.displayOptions.includes('pressure');
    },
    shouldUseDualMode() {
      return this.selectedValves && this.selectedValves.length === 2;
    },
    currentStationName() {
      return this.selectedValves.length > 0 
        ? this.selectedValves[0].valveName 
        : '黄埔';
    },
    chartTitle() {
      if (this.shouldUseDualMode) {
        const modeInfo = this.dualModeOptions[this.dualModeType];
        return `${this.selectedValves.map(v => v.valveName).join(' vs ')} - ${modeInfo.title}`;
      }
      return `${this.currentStationName}`;
    },
    realDataCount() {
      const count = this.getRealTimeDataCount(this.currentStationName);
      return count || { temperature: 0, pressure: 0 };
    },
    predictionDataCount() {
      const count = this.getPredictionDataCount(this.currentStationName);
      return count || { temperature: 0, pressure: 0 };
    }
  },

  mounted() {
    // 添加窗口resize监听
    window.addEventListener('resize', this.handleResize);
    
    // 适当延迟初始化确保DOM已渲染
    setTimeout(() => {
      this.initChart();
      this.$nextTick(() => {
        // 启动数据获取
        this.startDataFetching();
    });
    }, 300);
  },

  beforeDestroy() {
    // 移除窗口resize监听
    window.removeEventListener('resize', this.handleResize);
    this.stopDataFetching();

    // 清理定时器
    if (this.drawChartsTimer) {
      clearTimeout(this.drawChartsTimer);
    }

    // 销毁所有图表实例
    this.disposeCharts();
  },

  methods: {
    ...mapActions([
      'fetchPredictionData',
      'fetchNextPredictionData'
    ]),

    // 处理窗口大小变化
    handleResize() {
      if (this.resizeTimer) {
        clearTimeout(this.resizeTimer);
      }
      this.resizeTimer = setTimeout(() => {
        // 仅重新初始化图表，不重新获取数据
        this.initChartOnly();
      }, 200);
    },

    // 初始化图表而不重置数据
    initChartOnly() {
      this.disposeCharts();
      
      this.$nextTick(() => {
        setTimeout(() => {
          try {
            this.initSingleChart();
            this.drawCharts();
          } catch (error) {
            console.error('初始化图表失败:', error);
            // 再次尝试初始化，有时DOM可能未完全准备好
            setTimeout(() => this.retryInitChart(), 500);
          }
        }, 100);
      });
    },

    initChart() {
      this.disposeCharts();
      
      this.$nextTick(() => {
        setTimeout(() => {
          try {
            this.initSingleChart();
            this.drawCharts();
            
            // 只有在首次加载时才启动数据获取
            if (!this.dataInitialized) {
              this.startDataFetching();
              this.dataInitialized = true;
            }
          } catch (error) {
            console.error('初始化图表失败:', error);
            // 再次尝试初始化，有时DOM可能未完全准备好
            setTimeout(() => this.retryInitChart(), 500);
          }
        }, 100);
      });
    },
    
    // 新增：重试初始化图表的方法
    retryInitChart() {
      try {
        console.log('重试初始化图表...');
        this.initSingleChart();
        this.drawCharts();
      } catch (error) {
        console.error('重试初始化图表失败:', error);
      }
    },

    initSingleChart() {
      const chartDom = document.getElementById('prediction_chart');
      if (chartDom && chartDom.offsetWidth > 0 && chartDom.offsetHeight > 0) {
        this.prediction_chart = echarts.init(chartDom);
        console.log('单图表模式初始化成功, 容器尺寸:', chartDom.offsetWidth, 'x', chartDom.offsetHeight);
      } else {
        console.warn('单图表容器尺寸不正确或不存在:', chartDom ? chartDom.offsetWidth : undefined, 'x', chartDom ? chartDom.offsetHeight : undefined);
      }
    },



    disposeCharts() {
      try {
        if (this.prediction_chart) {
          this.prediction_chart.dispose();
          this.prediction_chart = null;
        }
      } catch (err) {
        console.error('销毁图表失败:', err);
      }
    },

    drawCharts() {
      // 清除之前的定时器，防止重复调用
      if (this.drawChartsTimer) {
        clearTimeout(this.drawChartsTimer);
      }

      this.drawChartsTimer = setTimeout(() => {
        try {
          // 统一使用单图表模式
          if (this.shouldUseDualMode) {
            const [station1, station2] = this.selectedValves.map(v => v.valveName);
            console.log(`🎯 双站点模式 - 站点: ${station1} vs ${station2}, 模式: ${this.dualModeType}`);
            this.drawDualModeChart();
          } else {
            console.log(`🎯 单站点模式 - 站点: ${this.currentStationName}`);
            this.drawSingleModeChart();
          }
        } catch (error) {
          console.error('绘制图表时出错:', error);
        }
      }, 50); // 50ms防抖
    },

    drawSingleModeChart() {
      if (!this.prediction_chart) return;
      const option = this.getSingleModeChartOption();

      // 获取当前的 dataZoom 状态
      const currentOption = this.prediction_chart.getOption();
      if (currentOption && currentOption.dataZoom && currentOption.dataZoom.length > 0) {
        // 保持当前的 dataZoom 状态，只更新数据
        option.dataZoom = currentOption.dataZoom;
        this.prediction_chart.setOption(option, false); // 使用 false 进行增量更新
      } else {
        // 首次加载或需要重置时使用完整更新
        this.prediction_chart.setOption(option, true);
      }
    },

    drawDualModeChart() {
      if (!this.prediction_chart) return;
      const option = this.getDualModeChartOption();

      // 获取当前的 dataZoom 状态
      const currentOption = this.prediction_chart.getOption();
      if (currentOption && currentOption.dataZoom && currentOption.dataZoom.length > 0) {
        // 保持当前的 dataZoom 状态，只更新数据
        option.dataZoom = currentOption.dataZoom;
        this.prediction_chart.setOption(option, false); // 使用 false 进行增量更新
      } else {
        // 首次加载或需要重置时使用完整更新
        this.prediction_chart.setOption(option, true);
      }
    },



    // 重置 dataZoom 到默认状态（在切换站点或参数时使用）
    resetDataZoom() {
      if (this.prediction_chart) {
        if (this.shouldUseDualMode) {
          const option = this.getDualModeChartOption();
          this.prediction_chart.setOption(option, true);
        } else {
          const option = this.getSingleModeChartOption();
          this.prediction_chart.setOption(option, true);
        }
      }
    },

    // 生成单站点模式图表配置
    getSingleModeChartOption() {
      const stationName = this.currentStationName;
      const stationData = this.getCombinedStationData(stationName);
      const series = [];

      // 动态计算Y轴索引
      let pressureAxisIndex = -1;
      let temperatureAxisIndex = -1;

      if (this.showPressure) {
        pressureAxisIndex = 0;
        temperatureAxisIndex = this.showTemperature ? 1 : -1;
      } else if (this.showTemperature) {
        temperatureAxisIndex = 0;
      }

      if (this.showTemperature && temperatureAxisIndex >= 0) {
        series.push({ 
          name: '实际温度', 
          type: 'line', 
          yAxisIndex: temperatureAxisIndex, 
          data: stationData.temperature.actual, 
          ...this.getSeriesStyle('actual_temp') 
        });
        series.push({ 
          name: '预测温度', 
          type: 'line', 
          yAxisIndex: temperatureAxisIndex, 
          data: stationData.temperature.prediction, 
          ...this.getSeriesStyle('prediction_temp') 
        });
      }
      if (this.showPressure && pressureAxisIndex >= 0) {
        series.push({ 
          name: '实际压力', 
          type: 'line', 
          yAxisIndex: pressureAxisIndex, 
          data: stationData.pressure.actual, 
          ...this.getSeriesStyle('actual_pressure') 
        });
        series.push({ 
          name: '预测压力', 
          type: 'line', 
          yAxisIndex: pressureAxisIndex, 
          data: stationData.pressure.prediction, 
          ...this.getSeriesStyle('prediction_pressure') 
        });
      }

      return {
        backgroundColor: 'transparent',
        title: { 
          text: stationName, 
          left: 'center', 
          textStyle: { color: '#66dffb', fontSize: 14 } 
        },
        tooltip: { trigger: 'axis', ...this.getBaseTooltipStyle() },
        legend: {
          top: 25,
          textStyle: { color: '#66dffb', fontSize: 12 },
          itemWidth: 30,
          itemHeight: 4,
          itemGap: 20,
          symbolKeepAspect: false
        },
        grid: { left: '12%', right: '8%', bottom: '18%', top: '30%', containLabel: true },
        xAxis: { type: 'time', ...this.getBaseAxisStyle() },
        yAxis: this.getYAxisConfig(),
        dataZoom: this.getBaseDataZoom(),
        graphic: this.getDataZoomLabels(stationData),
        series: series
      };
    },

    // 生成双站点模式图表配置
    getDualModeChartOption() {
      const [station1, station2] = this.selectedValves.map(v => v.valveName);
      const stationData1 = this.getCombinedStationData(station1);
      const stationData2 = this.getCombinedStationData(station2);
      const modeInfo = this.dualModeOptions[this.dualModeType];

      console.log(`📊 ${modeInfo.title}数据检查:`, {
        station1: station1,
        station1_actual_count: stationData1[this.dualModeType].actual.length,
        station1_prediction_count: stationData1[this.dualModeType].prediction.length,
        station2: station2,
        station2_actual_count: stationData2[this.dualModeType].actual.length,
        station2_prediction_count: stationData2[this.dualModeType].prediction.length
      });

      // 为每个站点分配不同的颜色
      const stationColors = this.getStationColorsForDualMode(station1, station2, this.dualModeType);

      // 计算数据范围
      const dataRange = this.calculateDataRange([
        stationData1[this.dualModeType].actual,
        stationData1[this.dualModeType].prediction,
        stationData2[this.dualModeType].actual,
        stationData2[this.dualModeType].prediction
      ], modeInfo.title);

      const series = [
        { 
          name: `${station1}实际${modeInfo.title}`, 
          type: 'line', 
          data: stationData1[this.dualModeType].actual, 
          ...this.getSeriesStyleWithColor(`actual_${this.dualModeType}`, stationColors.station1)
        },
        { 
          name: `${station1}预测${modeInfo.title}`, 
          type: 'line', 
          data: stationData1[this.dualModeType].prediction, 
          ...this.getSeriesStyleWithColor(`prediction_${this.dualModeType}`, stationColors.station1)
        },
        { 
          name: `${station2}实际${modeInfo.title}`, 
          type: 'line', 
          data: stationData2[this.dualModeType].actual, 
          ...this.getSeriesStyleWithColor(`actual_${this.dualModeType}`, stationColors.station2)
        },
        { 
          name: `${station2}预测${modeInfo.title}`, 
          type: 'line', 
          data: stationData2[this.dualModeType].prediction, 
          ...this.getSeriesStyleWithColor(`prediction_${this.dualModeType}`, stationColors.station2)
        }
      ];

      return {
        backgroundColor: 'transparent',
        title: { 
          left: 'center', 
          textStyle: { color: '#66dffb', fontSize: 14 } 
        },
        tooltip: { trigger: 'axis', ...this.getBaseTooltipStyle() },
        legend: {
          top: 25,
          textStyle: { color: '#66dffb', fontSize: 12 },
          itemWidth: 30,
          itemHeight: 4,
          itemGap: 20,
          symbolKeepAspect: false
        },
        grid: { left: '12%', right: '8%', bottom: '18%', top: '30%', containLabel: true },
        xAxis: { type: 'time', ...this.getBaseAxisStyle() },
        yAxis: [{
          min: dataRange.min, 
          max: dataRange.max, 
          type: 'value', 
          name: modeInfo.yAxisName,
          position: 'left',
          nameTextStyle: { color: '#66dffb', fontSize: 12 }, // 使用统一的标题颜色
          axisLine: { show: true, lineStyle: { color: '#66dffb', width: 2 } }, // 使用统一的轴线颜色
          axisLabel: { color: '#66dffb', fontSize: 11, formatter: modeInfo.yAxisLabelFormatter }, // 使用统一的标签颜色
          splitLine: { show: false },
          axisTick: {
            show: true,
            lineStyle: { color: '#66dffb', width: 1 },
            length: 6,
            inside: false
          }
        }],
        dataZoom: this.getBaseDataZoom(),
        graphic: this.getDataZoomLabels(stationData1),
        series: series
      };
    },



    // 辅助函数，提供基础样式配置
    getSeriesStyle(type) {
      const styles = {
        actual_temp: { color: '#ffd166', width: 2, type: 'solid' },
        prediction_temp: { color: '#ffd166', width: 2, type: 'dashed', dashArray: [8, 4] },
        actual_pressure: { color: '#ff6b6b', width: 2, type: 'solid' },
        prediction_pressure: { color: '#ff6b6b', width: 2, type: 'dashed', dashArray: [8, 4] }
      };
      const s = styles[type];
      
      // 优化折线图的视觉效果
      const commonOptions = {
        smooth: true,
        showSymbol: false, // 所有线条都不显示数据点
        triggerLineEvent: true, // 确保无符号的线也能触发事件
        symbolSize: 0, // 确保所有数据点大小为0
        lineStyle: {
          color: s.color,
          width: s.width,
          type: s.type,
          dashArray: s.dashArray, // 自定义虚线样式
          shadowColor: `${s.color}40`,
          shadowBlur: 3
        },
        itemStyle: { 
          color: s.color,
          borderWidth: 0, // 不显示边框
          borderColor: '#fff',
          shadowBlur: 0 // 不显示阴影
        },
        emphasis: {
          scale: true,
          itemStyle: {
            borderWidth: 2
          }
        },
        // 增强采样密度，确保曲线更平滑
        sampling: 'average'
      };
      
      return commonOptions;
    },

    // 带颜色的样式配置
    getSeriesStyleWithColor(type, color) {
      const lineType = type.includes('prediction') ? 'dashed' : 'solid';
      const dashArray = type.includes('prediction') ? [8, 4] : null;
      
      return {
        smooth: true,
        showSymbol: false,
        triggerLineEvent: true,
        symbolSize: 0,
        lineStyle: {
          color: color,
          width: 2,
          type: lineType,
          dashArray: dashArray,
          shadowColor: `${color}40`,
          shadowBlur: 3
        },
        itemStyle: { 
          color: color,
          borderWidth: 0,
          borderColor: '#fff',
          shadowBlur: 0
        },
        emphasis: {
          scale: true,
          itemStyle: {
            borderWidth: 2
          }
        },
        sampling: 'average'
      };
    },

    // 获取站点颜色配置
    getStationColors(stationName) {
      // 使用与里程高程图表一致的颜色方案
      const colorSchemes = {
        '黄埔': {
          actual: '#ff6b6b',      // 红色 - 与里程高程图表一致
          prediction: '#ff6b6b'   // 红色 - 与里程高程图表一致
        },
        '东莞': {
          actual: '#ffd166',      // 黄色 - 与里程高程图表一致
          prediction: '#ffd166'   // 黄色 - 与里程高程图表一致
        },
        '十字窖': {
          actual: '#ff6b6b',      // 红色 - 与里程高程图表一致
          prediction: '#ff6b6b'   // 红色 - 与里程高程图表一致
        },
        '站点2': {
          actual: '#ffd166',      // 黄色 - 与里程高程图表一致
          prediction: '#ffd166'   // 黄色 - 与里程高程图表一致
        }
      };
      
      return colorSchemes[stationName] || {
        actual: '#ff6b6b',
        prediction: '#ffd166'
      };
    },

    // 为双站点模式获取不同站点的颜色
    getStationColorsForDualMode(station1, station2, modeType) {
      // 定义站点颜色映射 - 为每个站点分配独特的颜色
      const stationColorMap = {
        '黄埔': '#ff6b6b',      // 红色
        '东莞': '#ffd166',      // 黄色
        '十字窖': '#52c41a',    // 绿色
        '站点2': '#1890ff',     // 蓝色
        '南沙': '#722ed1',      // 紫色
        '番禺': '#faad14',      // 橙色
        '高明': '#13c2c2',      // 青色
        '顺德': '#eb2f96',      // 粉色
        '南海': '#fa8c16',      // 深橙色
        '三水': '#a0d911',      // 青绿色
        '江门': '#f5222d',      // 深红色
        '阳江': '#2f54eb',      // 深蓝色
        '茂名': '#fa541c',      // 红橙色
        '鹤山': '#531dab',      // 深紫色
        '恩平': '#08979c'       // 深青色
      };

      // 获取站点颜色，如果站点不存在则使用默认颜色
      const color1 = stationColorMap[station1] || '#ff6b6b';
      const color2 = stationColorMap[station2] || '#ffd166';

      // 如果两个站点颜色相同，为第二个站点分配一个不同的颜色
      let finalColor2 = color2;
      if (color1 === color2) {
        // 从颜色映射中选择一个不同的颜色
        const availableColors = Object.values(stationColorMap).filter(color => color !== color1);
        finalColor2 = availableColors[0] || '#1890ff'; // 默认使用蓝色
      }

      console.log(`🎨 双站点颜色分配: ${station1}(${color1}) vs ${station2}(${finalColor2})`);

      return {
        station1: color1,
        station2: finalColor2
      };
    },

    // 计算数据范围，让数据在Y轴中间显示
    calculateDataRange(dataArrays, dataType = 'unknown') {
      let allValues = [];
      
      // 提取所有数据值
      dataArrays.forEach(dataArray => {
        if (Array.isArray(dataArray)) {
          dataArray.forEach(item => {
            if (Array.isArray(item) && item.length >= 2 && typeof item[1] === 'number') {
              allValues.push(item[1]);
            }
          });
        }
      });
      
      // 如果没有数据，返回合理的默认范围
      if (allValues.length === 0) {
        console.log(`⚠️ 没有找到有效的${dataType}数据，使用默认范围`);
        // 根据数据类型返回不同的默认范围
        if (dataType.includes('温度') || dataType.includes('temperature')) {
          return { min: 15, max: 35 }; // 温度默认范围
        } else if (dataType.includes('压力') || dataType.includes('pressure')) {
          return { min: 0, max: 5 }; // 压力默认范围
        }
        return { min: 0, max: 10 }; // 通用默认范围
      }
      
      const minValue = Math.min(...allValues);
      const maxValue = Math.max(...allValues);
      const range = maxValue - minValue;
      
      console.log(`📊 数据范围分析: 最小值=${minValue}, 最大值=${maxValue}, 范围=${range}`);
      
      // 如果数据范围太小，设置最小范围
      const minRange = Math.max(1, range * 0.1); // 至少是数据范围的10%，最小为1
      const actualRange = Math.max(range, minRange);
      
      // 在数据范围基础上增加合理的边距
      let padding;
      if (range < 1) {
        padding = 0.5; // 小范围数据用固定边距
      } else {
        padding = actualRange * 0.15; // 大范围数据用15%边距
      }
      
      const adjustedMin = minValue - padding;
      const adjustedMax = maxValue + padding;
      
      const result = {
        min: Math.max(0, Math.floor(adjustedMin * 10) / 10), // 最小值不小于0
        max: Math.ceil(adjustedMax * 10) / 10
      };
      
      console.log(`📊 计算结果: min=${result.min}, max=${result.max}`);
      return result;
    },

    getYAxisConfig() {
      const yAxis = [];
      const stationData = this.getCombinedStationData(this.currentStationName);

      // 按顺序添加Y轴：先压力(索引0)，后温度(索引1)
      if (this.showPressure) {
        // 计算压力数据范围
        const pressureRange = this.calculateDataRange([
          stationData.pressure.actual,
          stationData.pressure.prediction
        ], '压力');
        
        yAxis.push({
          min: pressureRange.min, max: pressureRange.max, type: 'value', name: '压力 (MPa)', position: 'left',
          nameTextStyle: { color: '#ff6b6b', fontSize: 12 },
          axisLine: { show: true, lineStyle: { color: '#ff6b6b', width: 2 } },
          axisLabel: { color: '#ff6b6b', fontSize: 11, formatter: '{value}MPa' },
          splitLine: { show: false },
          axisTick: {
            show: true,
            lineStyle: { color: '#ff6b6b', width: 1 },
            length: 6,
            inside: false
          }
        });
      }

      if (this.showTemperature) {
        // 计算温度数据范围
        const tempRange = this.calculateDataRange([
          stationData.temperature.actual,
          stationData.temperature.prediction
        ], '温度');
        
        yAxis.push({
          min: tempRange.min, max: tempRange.max, type: 'value', name: '温度 (℃)',
          position: this.showPressure ? 'right' : 'left', // 如果只有温度，放在左边
          nameTextStyle: { color: '#ffd166', fontSize: 12 },
          axisLine: { show: true, lineStyle: { color: '#ffd166', width: 2 } },
          axisLabel: { color: '#ffd166', fontSize: 11, formatter: '{value}℃' },
          splitLine: { show: false },
          axisTick: {
            show: true,
            lineStyle: { color: '#ffd166', width: 1 },
            length: 6,
            inside: false
          }
        });
      }

      // 确保至少有一个Y轴
      if (yAxis.length === 0) {
        yAxis.push({
          type: 'value', show: false
        });
      }

      return yAxis;
    },

    getBaseTooltipStyle() {
      return {
        backgroundColor: 'rgba(0, 21, 41, 0.95)', borderColor: '#66dffb', borderWidth: 1,
        textStyle: { color: '#ffffff', fontSize: 12 },
        formatter: (params) => {
            const paramArray = Array.isArray(params) ? params : [params];
            if (paramArray.length === 0) return '';

            let result = '';
            // 使用第一个数据点的时间作为标题
            const timeValue = paramArray[0].value[0];
            const time = new Date(timeValue);
            
            result += `<div style="margin-bottom: 5px; font-weight: bold;">${time.toLocaleTimeString()}</div>`;

            paramArray.forEach(param => {
                const color = param.color;
                const unit = param.seriesName.includes('温度') ? '℃' : 'MPa';
                const value = param.value[1];

                result += `<div style="display: flex; align-items: center; margin: 2px 0;">
                  <span style="display: inline-block; width: 10px; height: 10px; background-color: ${color}; border-radius: 50%;"></span>
                  <span style="flex: 1; margin-left: 8px;">${param.seriesName}: </span>
                  <span style="font-weight: bold; color: ${color};">${value.toFixed(3)} ${unit}</span>
                </div>`;
            });
            return result;
        }
      };
    },

    getBaseAxisStyle() {
      return {
        axisLine: { lineStyle: { color: 'rgba(102, 223, 251, 0.6)', width: 1 } },
        axisLabel: { 
            color: 'rgba(102, 223, 251, 0.8)', 
            fontSize: 11, 
            formatter: function(value) {
                const date = new Date(value);
        
                // Format date to HH:MM:SS
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                const seconds = date.getSeconds().toString().padStart(2, '0');
                
                return `${hours}:${minutes}:${seconds}`;
            }
        },
        axisTick: {
          show: true,
          lineStyle: { color: 'rgba(102, 223, 251, 0.6)', width: 1 },
          length: 6,
          inside: false
        },
        splitLine: { show: false },
        min: 'dataMin',
        max: 'dataMax'
      };
    },

    getBaseDataZoom() {
      const dataZoom = [
        // X轴缩放
        { 
          type: 'slider', 
          show: true, 
          xAxisIndex: 0, 
          height: 20, // 增加高度以容纳文字
          bottom: 20,
          showDetail: false, // 关闭默认的悬停显示
          showDataShadow: true, // 显示数据阴影
          realtime: true, // 实时更新
          start: 0, // 默认开始位置
          end: 100, // 默认结束位置
          labelFormatter: function(value) {
            // 格式化时间显示，始终显示
            const date = new Date(value);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
          },
          ...this.getDataZoomStyle() 
        },
        { type: 'inside', xAxisIndex: 0 }
      ];

      // 只有当有Y轴时才添加Y轴缩放
      // if (this.showPressure || this.showTemperature) {
      //   dataZoom.push(
      //     { 
      //       type: 'slider', 
      //       show: true, 
      //       yAxisIndex: 0, 
      //       width: 25, // 增加宽度以容纳文字
      //       right: 20,
      //       showDetail: false, // 关闭默认的悬停显示
      //       showDataShadow: true, // 显示数据阴影
      //       realtime: true, // 实时更新
      //       start: 0, // 默认开始位置
      //       end: 100, // 默认结束位置
      //       labelFormatter: function(value) {
      //         // 格式化数值显示，保留2位小数，始终显示
      //         return parseFloat(value).toFixed(2);
      //       },
      //       ...this.getDataZoomStyle() 
      //     },
      //     { type: 'inside', yAxisIndex: 0 }
      //   );
      // }

      return dataZoom;
    },
    
    getDataZoomStyle() {
        return {
            borderColor: 'rgba(102, 223, 251, 0.5)', 
            backgroundColor: 'rgba(0, 21, 41, 0.8)', // 添加背景色
            textStyle: { 
              color: '#66dffb', 
              fontSize: 10,
              fontWeight: 'bold'
            },
            handleStyle: { 
              color: '#66dffb',
              borderColor: '#66dffb',
              borderWidth: 2,
              shadowBlur: 3,
              shadowColor: 'rgba(102, 223, 251, 0.5)'
            }, 
            dataBackground: { 
              areaStyle: { color: 'rgba(102, 223, 251, 0.2)' },
              lineStyle: { color: 'rgba(102, 223, 251, 0.4)' }
            },
            fillerColor: 'rgba(102, 223, 251, 0.3)',
            emphasis: {
              handleStyle: {
                color: '#8eecff',
                borderColor: '#8eecff'
              }
            },
            moveHandleSize: 8, // 移动手柄大小
            handleSize: '100%' // 手柄大小
        }
    },

    getTagType(index) {
      return ['success', 'warning', 'info', 'danger'][index % 4];
    },

    // 添加dataZoom边界标签
    getDataZoomLabels(stationData) {
      const graphics = [];
      
      // 获取数据的时间范围
      let minTime = null, maxTime = null;
      
      // 从所有数据中找到最小和最大时间
      const allData = [
        ...((stationData.temperature && stationData.temperature.actual) || []),
        ...((stationData.temperature && stationData.temperature.prediction) || []),
        ...((stationData.pressure && stationData.pressure.actual) || []),
        ...((stationData.pressure && stationData.pressure.prediction) || [])
      ];
      
      if (allData.length > 0) {
        const times = allData.map(item => new Date(item[0]).getTime()).filter(time => !isNaN(time));
        if (times.length > 0) {
          minTime = new Date(Math.min(...times));
          maxTime = new Date(Math.max(...times));
        }
      }
      
      if (minTime && maxTime) {
        // 格式化完整时间显示
        const formatFullTime = (date) => {
          const year = date.getFullYear();
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const day = date.getDate().toString().padStart(2, '0');
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          const seconds = date.getSeconds().toString().padStart(2, '0');
          return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        };
        
        // 左侧完整时间标签
        graphics.push({
          type: 'text',
          left: '12%', // 对应grid的left
          bottom: 0, // 往下移动，避免与dataZoom重叠
          style: {
            text: formatFullTime(minTime),
            fill: '#66dffb',
            fontSize: 10,
            fontWeight: 'bold',
            textAlign: 'left'
          }
        });
        
        // 右侧完整时间标签  
        graphics.push({
          type: 'text',
          right: '8%', // 对应grid的right
          bottom: 0, // 往下移动，避免与dataZoom重叠
          style: {
            text: formatFullTime(maxTime),
            fill: '#66dffb',
            fontSize: 10,
            fontWeight: 'bold',
            textAlign: 'right'
          }
        });
      }
      
      return graphics;
    },

    removeValve(valve) {
      this.$emit('remove-valve', valve);
    },

    toggleTemperature() {
      console.log('点击温度按钮');
      console.log('当前显示选项:', this.displayOptions);
      console.log('showTemperature:', this.showTemperature);
      console.log('showPressure:', this.showPressure);

      // 如果温度已选中且压力未选中，则不能取消温度（至少保留一个）
      if (this.showTemperature && !this.showPressure) {
        console.log('不能取消温度显示，至少需要保留一个选项');
        return;
      }

      // 切换温度显示状态
      this.displayOptions = this.showTemperature
        ? this.displayOptions.filter(o => o !== 'temperature')
        : [...this.displayOptions, 'temperature'];

      console.log('温度切换后的显示选项:', this.displayOptions);
      this.drawCharts();
    },

    togglePressure() {
      console.log('点击压力按钮');
      console.log('当前显示选项:', this.displayOptions);
      console.log('showPressure:', this.showPressure);
      console.log('showTemperature:', this.showTemperature);

      // 如果压力已选中且温度未选中，则不能取消压力（至少保留一个）
      if (this.showPressure && !this.showTemperature) {
        console.log('不能取消压力显示，至少需要保留一个选项');
        return;
      }

      // 切换压力显示状态
      this.displayOptions = this.showPressure
        ? this.displayOptions.filter(o => o !== 'pressure')
        : [...this.displayOptions, 'pressure'];

      console.log('压力切换后的显示选项:', this.displayOptions);
      this.drawCharts();
    },

    testPredictionData() {
        // 始终为所有站点测试预测数据，不依赖于选中状态
        const stationsToTest = ['十字窖', '站点2', '黄埔', '东莞'];

        console.log(`🧪 为所有站点 ${stationsToTest.join(', ')} 手动触发下一次预测数据获取...`);
        
        stationsToTest.forEach(stationName => {
            this.fetchNextPredictionData({ 
                stationName,
                timeOffset: 10 * 60 * 1000 // 10分钟的毫秒数，确保预测数据比真实数据晚
            });
        });
    },

    startDataFetching() {
      this.stopDataFetching(); // 先停止所有定时器
      
      // 清空所有旧数据
      this.$store.commit('clearAllStationData');
        
      // 启动真实数据轮询
      this.startRealTimePolling();
      
      // 启动预测数据获取
      this.startPredictionFetching();
    },
    
    // 停止数据获取
    stopDataFetching() {
      if (this.realTimeTimer) {
        clearInterval(this.realTimeTimer);
        this.realTimeTimer = null;
      }
      if (this.predictionTimer) { 
        clearInterval(this.predictionTimer);
        this.predictionTimer = null;
      }
    },

    // 启动真实数据轮询
    startRealTimePolling() {
      console.log('⏰ 启动真实数据轮询...');
      this.fetchInitialRealTimeData(48); // 1. 先获取48条历史数据
      
      // 2. 然后每5秒获取最新的一条数据
      this.realTimeTimer = setInterval(() => {
        this.fetchLatestRealTimeData();
      }, 5000);
    },

    // 获取初始的48条实时数据
    async fetchInitialRealTimeData(count) {
      try {
        console.log(`📊 正在获取最近 ${count} 条实时数据...`);
        // 使用fetch API直接请求，跳过token验证
        console.log('📊 获取历史数据 - 跳过token验证');

        const fetchResponse = await fetch(`/api/hpdg/realtime/recent?count=${count}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
            // 不添加Authorization头，允许无token访问
          }
        });

        console.log('历史数据响应状态:', fetchResponse.status);

        if (!fetchResponse.ok) {
          const errorText = await fetchResponse.text();
          console.error('历史数据API请求失败:', fetchResponse.status, errorText);
          throw new Error(`HTTP ${fetchResponse.status}: ${errorText}`);
        }

        const response = { data: await fetchResponse.json() };

        if (response.data.success && Array.isArray(response.data.data)) {
          console.log(`✓ 获取到 ${response.data.data.length} 条历史实时数据`);
          // 始终为所有站点获取数据，不依赖于选中状态
          const stations = ['十字窖', '站点2', '黄埔', '东莞'];

          stations.forEach(stationName => {
            const tempData = [];
            const pressureData = [];
            
            response.data.data.forEach(item => {
              const time = this.parseItemTime(item);
              if (!time) return; // 如果时间无效，则跳过

              const temp = this.getTemperatureFromData(item, stationName);
              const pressure = this.getPressureFromData(item, stationName);
              
              if (temp !== null) tempData.push([time, temp]);
              if (pressure !== null) pressureData.push([time, pressure]);
            });
            
            if (tempData.length > 0) {
              this.$store.commit('updateRealTimeDataBatch', { stationName, dataType: 'temperature', dataArray: tempData });
            }
            if (pressureData.length > 0) {
              this.$store.commit('updateRealTimeDataBatch', { stationName, dataType: 'pressure', dataArray: pressureData });
            }
            console.log(`站点 ${stationName} 批量更新: ${tempData.length} 条温度数据, ${pressureData.length} 条压力数据`);
          });
        }
      } catch (error) {
        console.error('获取历史实时数据失败:', error);
      }
    },

    // 获取最新的真实数据
    async fetchLatestRealTimeData() {
      try {
        // 使用fetch API直接请求，跳过token验证
        console.log('📊 获取最新实时数据 - 跳过token验证');

        const fetchResponse = await fetch('/api/hpdg/realtime/latest', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
            // 不添加Authorization头，允许无token访问
          }
        });

        console.log('响应状态:', fetchResponse.status);

        if (!fetchResponse.ok) {
          const errorText = await fetchResponse.text();
          console.error('API请求失败:', fetchResponse.status, errorText);
          throw new Error(`HTTP ${fetchResponse.status}: ${errorText}`);
        }

        const response = { data: await fetchResponse.json() };
        if (response.data.success && response.data.data) {
          // 始终为所有站点更新数据，不依赖于选中状态
          const stations = ['十字窖', '站点2', '黄埔', '东莞'];
          const latestData = response.data.data;
          
          const time = this.parseItemTime(latestData);
          if (!time) {
              console.warn('获取到无效的最新实时数据时间戳:', latestData);
              return;
        }

          stations.forEach(stationName => {
            const temp = this.getTemperatureFromData(latestData, stationName);
            const pressure = this.getPressureFromData(latestData, stationName);
              
            if (temp !== null) {
              this.$store.commit('updateRealTimeData', { stationName, dataType: 'temperature', time, value: temp });
              }
            if (pressure !== null) {
              this.$store.commit('updateRealTimeData', { stationName, dataType: 'pressure', time, value: pressure });
              }
            });
          }
      } catch (error) {
        console.error('获取最新实时数据失败:', error);
      }
    },

    // 新增：健壮的时间解析函数
    parseItemTime(item) {
        let timeValue = item.time || item.timestamp || item.displayTime;
        if (!timeValue) {
            console.warn('数据点缺少有效的时间字段 (time, timestamp, displayTime)，跳过:', item);
            return null;
        }

        let time = new Date(timeValue);

        // 检查是否为秒级时间戳 (小于10^12)
        if (typeof timeValue === 'number' && timeValue < 1000000000000) {
            time = new Date(timeValue * 1000);
        }

        if (isNaN(time.getTime())) {
            console.warn('解析到一个无效的时间值，跳过该数据点:', timeValue);
            return null;
        }
        
        return time;
    },

    // 启动预测数据获取
    startPredictionFetching() {
        // 始终为所有站点获取预测数据，不依赖于选中状态
        const stationsToFetch = ['十字窖', '站点2', '黄埔', '东莞'];

        console.log(`🚀 为所有站点 ${stationsToFetch.join(', ')} 启动预测模式...`);

        // 1. 为每个需要的站点获取初始60条数据
        stationsToFetch.forEach(stationName => {
            this.$store.dispatch('fetchPredictionData', { 
                stationName, 
                count: 60,
                timeOffset: 0
            });
        });
        
        // 2. 设置定时器，每分钟获取最新的12条数据并追加
      if (this.predictionTimer) {
        clearInterval(this.predictionTimer);
      }
        
        this.predictionTimer = setInterval(() => {
            // 始终为所有站点获取预测数据，不依赖于选中状态
            const currentStations = ['十字窖', '站点2', '黄埔', '东莞'];

            console.log(`⏱️ 1分钟到达，为所有站点 ${currentStations.join(',')} 获取最新的12条预测数据...`);
            currentStations.forEach(stationName => {
                // 调用 fetchPredictionData 来获取并追加12条新数据
                this.$store.dispatch('fetchPredictionData', { 
                    stationName, 
                    count: 12
                });
            });
        }, 60000); // 1分钟
    },
    
    // 从真实数据中提取温度值
    getTemperatureFromData(data, valveName) {
      const temperatureFields = {
        '十字窖': 'STN10_05_TI501', '站点2': 'STN10_05_TI502',
        '黄埔': 'STN10_00_TI002', '东莞': 'STN11_00_TI001'
      };
      return data[temperatureFields[valveName]] || null;
    },
    
    // 从真实数据中提取压力值
    getPressureFromData(data, valveName) {
      const pressureFields = {
        '十字窖': 'STN10_05_PI501', '站点2': 'STN10_05_PI502',
        '黄埔': 'STN10_00_PI019A', '东莞': 'STN11_00_PI001'
      };
      return data[pressureFields[valveName]] || null;
    },

    fetchRecentRealTimeData(count) {
      // Implementation of fetchRecentRealTimeData method
    },

    // 双站点模式切换
    switchDualMode(type) {
      this.dualModeType = type;
      this.drawCharts();
    }
  },

  watch: {
    // 监听数据更新标记，自动重绘图表
    getRealTimeUpdateFlag() {
      this.$nextTick(() => this.drawCharts());
    },
    getPredictionUpdateFlag() {
      this.$nextTick(() => this.drawCharts());
    },
    
    selectedValves: {
      handler() {
        console.log('监听到阀门选择变化，重新初始化图表并重置dataZoom...');
        
        // 如果是双站点模式，确保默认显示压力对比
        if (this.shouldUseDualMode && this.dualModeType !== 'pressure') {
          this.dualModeType = 'pressure';
        }
        
        // 重新初始化图表以匹配单/双站点模式，并重置dataZoom
        this.initChartOnly();
        // 延迟重置dataZoom，确保图表已经初始化完成
        this.$nextTick(() => {
          setTimeout(() => {
            this.resetDataZoom();
          }, 100);
        });
      },
      deep: true
    },

    // 监听温度/压力按钮变化，在参数切换时重置dataZoom
    showTemperature() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.resetDataZoom();
        }, 100);
      });
    },

    showPressure() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.resetDataZoom();
        }, 100);
      });
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
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
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
  font-size: 16px;
  width: 70px;
  height: 35px; /* 固定高度 */
  line-height: 32px; /* 垂直居中 */
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

/* 隐藏图例中的圆点，只保留线条 */
::v-deep .echarts .echarts-legend .echarts-legend-item .echarts-legend-symbol circle {
  display: none !important;
}

/* 优化图例线条显示 */
::v-deep .echarts .echarts-legend .echarts-legend-item .echarts-legend-symbol path {
  stroke-width: 4 !important;
}

/* 隐藏图例中的点标记 */
::v-deep .echarts .echarts-legend .echarts-legend-item .echarts-legend-symbol .echarts-legend-symbol-point {
  display: none !important;
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
  background: linear-gradient(135deg, rgba(102, 223, 251, 0.3), rgba(82, 196, 26, 0.2));
  color: #66dffb;
  box-shadow: 0 0 15px rgba(102, 223, 251, 0.5);
  font-weight: bold;
  transform: scale(1.05);
}

.icon-temperature:before {
  content: "🌡️";
  font-size: 14px;
}

.icon-pressure:before {
  content: "📊";
  font-size: 14px;
}

/* 双站点模式切换按钮样式 */
.dual-mode-toggle {
  display: flex;
  align-items: center;
  margin-right: 0px;
  /* margin-left: 0px;  */
}

.checkbox-item {
  margin-left: 0px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.label-left,
.label-right {
  color: #66dffb;
  font-size: 18px;
  font-weight: normal;
  transition: all 0.3s ease;
}

/* 单个checkbox开关样式 */
.single-checkbox-switch {
  display: flex;
  align-items: center;
}

.checkbox-item input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkbox-custom {
  position: relative;
  height: 24px;
  width: 50px;
  background: rgba(0, 21, 41, 0.8);
  border: 2px solid rgba(102, 223, 251, 0.3);
  border-radius: 24px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox-custom:before {
  content: '';
  position: absolute;
  height: 16px;
  width: 16px;
  left: 4px;
  background: rgba(102, 223, 251, 0.8);
  border-radius: 50%;
  transition: all 0.3s ease;
  transform: translateX(0);
  z-index: 2;
}

.checkbox-item input[type="checkbox"]:checked + .checkbox-custom {
  background: linear-gradient(135deg, rgba(102, 223, 251, 0.3), rgba(82, 196, 26, 0.2));
  border-color: #66dffb;
  box-shadow: 0 0 10px rgba(102, 223, 251, 0.4);
}

.checkbox-item input[type="checkbox"]:checked + .checkbox-custom:before {
  background: #66dffb;
  transform: translateX(26px);
  box-shadow: 0 0 8px rgba(102, 223, 251, 0.8);
}

.checkbox-item:hover .checkbox-custom {
  border-color: rgba(102, 223, 251, 0.6);
  box-shadow: 0 0 8px rgba(102, 223, 251, 0.3);
}

.checkbox-item:hover input[type="checkbox"]:checked + .checkbox-custom {
  box-shadow: 0 0 15px rgba(102, 223, 251, 0.6);
}

/* 外部标签状态切换 */
.checkbox-item input[type="checkbox"]:not(:checked) ~ .label-left {
  color: #ffffff;
  font-weight: bold;
}

.checkbox-item input[type="checkbox"]:checked ~ .label-right {
  color: #ffffff;
  font-weight: bold;
}

.checkbox-item input[type="checkbox"]:not(:checked) ~ .label-right {
  color: rgba(255, 255, 255, 0.6);
  font-weight: normal;
}

.checkbox-item input[type="checkbox"]:checked ~ .label-left {
  color: rgba(255, 255, 255, 0.6);
  font-weight: normal;
}
</style> 