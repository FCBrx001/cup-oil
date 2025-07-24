<template>
  <div class="chart-container">
    <div class="chart-header" style="display: flex; justify-content: space-between; align-items: center; padding: 0 10px; margin-bottom: 5px;">
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
            <!-- 测试按钮 -->
            <!-- <button 
              class="toggle-btn"
              @click="testPredictionData"
              style="background: rgba(255, 193, 7, 0.1); border-color: rgba(255, 193, 7, 0.6);"
            >
              🧪 测试预测
            </button> -->
          </div>
        </div>
      </div>
    </div>
    
    <div class="chart-body">
      <!-- 双图表模式（多站点对比）-->
      <div v-if="shouldUseDualCharts" class="dual-chart-container">
        <div class="chart-section">
          <div class="chart-section-title">温度对比</div>
          <div id="temperature_chart" style="width:100%; height:300px;"></div>
        </div>
        <div class="chart-section">
          <div class="chart-section-title">压力对比</div>
          <div id="pressure_chart" style="width:100%; height:300px;"></div>
        </div>
      </div>
      
      <!-- 单图表模式（默认或单站点）-->
      <div v-else>
        <div id="prediction_chart" style="width:100%; height:350px;  margin-left: -50px;"></div>
      </div>
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
      temperature_chart: null,
      pressure_chart: null,
      
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
      drawChartsTimer: null
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
    shouldUseDualCharts() {
      return this.selectedValves && this.selectedValves.length === 2;
    },
    currentStationName() {
      return this.selectedValves.length > 0 
        ? this.selectedValves[0].valveName 
        : '黄埔';
    },
    chartTitle() {
      if (this.shouldUseDualCharts) {
        // return ` (${this.selectedValves.map(v => v.valveName).join(' vs ')})`;
      }
      return `${this.currentStationName} `;
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
            if (this.shouldUseDualCharts) {
              this.initDualCharts();
            } else {
              this.initSingleChart();
            }
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
          if (this.shouldUseDualCharts) {
            this.initDualCharts();
          } else {
            this.initSingleChart();
          }
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
        if (this.shouldUseDualCharts) {
          this.initDualCharts();
        } else {
          this.initSingleChart();
        }
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

    initDualCharts() {
      const tempChartDom = document.getElementById('temperature_chart');
      if (tempChartDom && tempChartDom.offsetWidth > 0 && tempChartDom.offsetHeight > 0) {
        this.temperature_chart = echarts.init(tempChartDom);
        console.log('温度图表初始化成功, 容器尺寸:', tempChartDom.offsetWidth, 'x', tempChartDom.offsetHeight);
      } else {
        console.warn('温度图表容器尺寸不正确或不存在:', tempChartDom ? tempChartDom.offsetWidth : undefined, 'x', tempChartDom ? tempChartDom.offsetHeight : undefined);
      }

      const pressChartDom = document.getElementById('pressure_chart');
      if (pressChartDom && pressChartDom.offsetWidth > 0 && pressChartDom.offsetHeight > 0) {
        this.pressure_chart = echarts.init(pressChartDom);
        console.log('压力图表初始化成功, 容器尺寸:', pressChartDom.offsetWidth, 'x', pressChartDom.offsetHeight);
      } else {
        console.warn('压力图表容器尺寸不正确或不存在:', pressChartDom ? pressChartDom.offsetWidth : undefined, 'x', pressChartDom ? pressChartDom.offsetHeight : undefined);
      }
    },

    disposeCharts() {
      try {
      if (this.prediction_chart) {
        this.prediction_chart.dispose();
        this.prediction_chart = null;
      }
      } catch (err) {
        console.error('销毁单图表失败:', err);
      }
      
      try {
      if (this.temperature_chart) {
        this.temperature_chart.dispose();
        this.temperature_chart = null;
      }
      } catch (err) {
        console.error('销毁温度图表失败:', err);
      }
      
      try {
      if (this.pressure_chart) {
        this.pressure_chart.dispose();
        this.pressure_chart = null;
        } 
      } catch (err) {
        console.error('销毁压力图表失败:', err);
      }
    },

    drawCharts() {
      // 清除之前的定时器，防止重复调用
      if (this.drawChartsTimer) {
        clearTimeout(this.drawChartsTimer);
      }

      this.drawChartsTimer = setTimeout(() => {
        try {
          // 添加数据状态检查
          if (this.shouldUseDualCharts) {
            const [station1, station2] = this.selectedValves.map(v => v.valveName);
            console.log(`🎯 双图表模式 - 站点: ${station1} vs ${station2}`);
            this.drawDualCharts();
          } else {
            console.log(`🎯 单图表模式 - 站点: ${this.currentStationName}`);
            this.drawPredictionChart();
          }
        } catch (error) {
          console.error('绘制图表时出错:', error);
        }
      }, 50); // 50ms防抖
    },

    drawPredictionChart() {
      if (!this.prediction_chart) return;
      const option = this.getBaseChartOption(this.currentStationName);

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

    drawDualCharts() {
      if (!this.shouldUseDualCharts) return;
      const [station1, station2] = this.selectedValves.map(v => v.valveName);

      // 左边图表显示两个站点的温度对比
      if (this.temperature_chart) {
        const temperatureOption = this.getDualTemperatureChartOption(station1, station2);

        // 获取当前的 dataZoom 状态
        const currentOption1 = this.temperature_chart.getOption();
        if (currentOption1 && currentOption1.dataZoom && currentOption1.dataZoom.length > 0) {
          temperatureOption.dataZoom = currentOption1.dataZoom;
          this.temperature_chart.setOption(temperatureOption, false);
        } else {
          this.temperature_chart.setOption(temperatureOption, true);
        }
      }

      // 右边图表显示两个站点的压力对比
      if (this.pressure_chart) {
        const pressureOption = this.getDualPressureChartOption(station1, station2);

        // 获取当前的 dataZoom 状态
        const currentOption2 = this.pressure_chart.getOption();
        if (currentOption2 && currentOption2.dataZoom && currentOption2.dataZoom.length > 0) {
          pressureOption.dataZoom = currentOption2.dataZoom;
          this.pressure_chart.setOption(pressureOption, false);
        } else {
          this.pressure_chart.setOption(pressureOption, true);
        }
      }
    },

    // 重置 dataZoom 到默认状态（在切换站点或参数时使用）
    resetDataZoom() {
      if (this.shouldUseDualCharts) {
        const [station1, station2] = this.selectedValves.map(v => v.valveName);
        if (this.temperature_chart) {
          const temperatureOption = this.getDualTemperatureChartOption(station1, station2);
          this.temperature_chart.setOption(temperatureOption, true);
        }
        if (this.pressure_chart) {
          const pressureOption = this.getDualPressureChartOption(station1, station2);
          this.pressure_chart.setOption(pressureOption, true);
        }
      } else {
        if (this.prediction_chart) {
          const option = this.getBaseChartOption(this.currentStationName);
          this.prediction_chart.setOption(option, true);
        }
      }
    },

    // 生成双站点温度对比图表配置
    getDualTemperatureChartOption(station1, station2) {
      const stationData1 = this.getCombinedStationData(station1);
      const stationData2 = this.getCombinedStationData(station2);

      console.log(`🌡️ 温度数据检查:`, {
        station1: station1,
        station1_actual_count: stationData1.temperature.actual.length,
        station1_prediction_count: stationData1.temperature.prediction.length,
        station2: station2,
        station2_actual_count: stationData2.temperature.actual.length,
        station2_prediction_count: stationData2.temperature.prediction.length
      });

      // 获取站点颜色
      const station1Colors = this.getStationColors(station1);
      const station2Colors = this.getStationColors(station2);

      // 计算温度数据的实际范围
      const tempRange = this.calculateDataRange([
        stationData1.temperature.actual,
        stationData1.temperature.prediction,
        stationData2.temperature.actual,
        stationData2.temperature.prediction
      ], '温度');

      const series = [
        { 
          name: `${station1}实际温度`, 
          type: 'line', 
          data: stationData1.temperature.actual, 
          ...this.getSeriesStyleWithColor('actual_temp', station1Colors.actual)
        },
        { 
          name: `${station1}预测温度`, 
          type: 'line', 
          data: stationData1.temperature.prediction, 
          ...this.getSeriesStyleWithColor('prediction_temp', station1Colors.prediction)
        },
        { 
          name: `${station2}实际温度`, 
          type: 'line', 
          data: stationData2.temperature.actual, 
          ...this.getSeriesStyleWithColor('actual_temp', station2Colors.actual)
        },
        { 
          name: `${station2}预测温度`, 
          type: 'line', 
          data: stationData2.temperature.prediction, 
          ...this.getSeriesStyleWithColor('prediction_temp', station2Colors.prediction)
        }
      ];

      return {
        backgroundColor: 'transparent',
        title: { 
          text: `${station1} vs ${station2}`, 
          left: 'center', 
          textStyle: { color: '#66dffb', fontSize: 14 } 
        },
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
          min: tempRange.min, max: tempRange.max, type: 'value', name: '温度 (℃)',
          position: 'left',
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
        }],
        dataZoom: this.getBaseDataZoom(),
        graphic: this.getDataZoomLabels(stationData1),
        series: series
      };
    },

    // 生成双站点压力对比图表配置
    getDualPressureChartOption(station1, station2) {
      const stationData1 = this.getCombinedStationData(station1);
      const stationData2 = this.getCombinedStationData(station2);

      console.log(`📊 压力数据检查:`, {
        station1: station1,
        station1_actual_count: stationData1.pressure.actual.length,
        station1_prediction_count: stationData1.pressure.prediction.length,
        station2: station2,
        station2_actual_count: stationData2.pressure.actual.length,
        station2_prediction_count: stationData2.pressure.prediction.length
      });

      // 获取站点颜色
      const station1Colors = this.getStationColors(station1);
      const station2Colors = this.getStationColors(station2);

      // 计算压力数据的实际范围
      const pressureRange = this.calculateDataRange([
        stationData1.pressure.actual,
        stationData1.pressure.prediction,
        stationData2.pressure.actual,
        stationData2.pressure.prediction
      ], '压力');

      const series = [
        { 
          name: `${station1}实际压力`, 
          type: 'line', 
          data: stationData1.pressure.actual, 
          ...this.getSeriesStyleWithColor('actual_pressure', station1Colors.actual)
        },
        { 
          name: `${station1}预测压力`, 
          type: 'line', 
          data: stationData1.pressure.prediction, 
          ...this.getSeriesStyleWithColor('prediction_pressure', station1Colors.prediction)
        },
        { 
          name: `${station2}实际压力`, 
          type: 'line', 
          data: stationData2.pressure.actual, 
          ...this.getSeriesStyleWithColor('actual_pressure', station2Colors.actual)
        },
        { 
          name: `${station2}预测压力`, 
          type: 'line', 
          data: stationData2.pressure.prediction, 
          ...this.getSeriesStyleWithColor('prediction_pressure', station2Colors.prediction)
        }
      ];

      return {
        backgroundColor: 'transparent',
        title: { 
          text: `${station1} vs ${station2}`, 
          left: 'center', 
          textStyle: { color: '#66dffb', fontSize: 14 } 
        },
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
          min: pressureRange.min, max: pressureRange.max, type: 'value', name: '压力 (MPa)',
          position: 'left',
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
        }],
        dataZoom: this.getBaseDataZoom(),
        graphic: this.getDataZoomLabels(stationData1),
        series: series
      };
    },

    // 统一的图表配置生成器
    getBaseChartOption(stationName) {
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
            series.push({ name: '实际温度', type: 'line', yAxisIndex: temperatureAxisIndex, data: stationData.temperature.actual, ...this.getSeriesStyle('actual_temp') });
            series.push({ name: '预测温度', type: 'line', yAxisIndex: temperatureAxisIndex, data: stationData.temperature.prediction, ...this.getSeriesStyle('prediction_temp') });
      }
      if (this.showPressure && pressureAxisIndex >= 0) {
            series.push({ name: '实际压力', type: 'line', yAxisIndex: pressureAxisIndex, data: stationData.pressure.actual, ...this.getSeriesStyle('actual_pressure') });
            series.push({ name: '预测压力', type: 'line', yAxisIndex: pressureAxisIndex, data: stationData.pressure.prediction, ...this.getSeriesStyle('prediction_pressure') });
      }

      return {
            backgroundColor: 'transparent',
            title: { text: this.shouldUseDualCharts ? stationName : null, left: 'center', textStyle: { color: '#66dffb', fontSize: 14 } },
        tooltip: { trigger: 'axis', ...this.getBaseTooltipStyle() },
        legend: {
          top: 25,
          textStyle: { color: '#66dffb', fontSize: 12 },
          itemWidth: 30, // 图例标记的宽度
          itemHeight: 4, // 图例标记的高度
          itemGap: 20, // 图例项之间的间距
          symbolKeepAspect: false // 不保持图标的长宽比
        },
            grid: { left: '12%', right: '8%', bottom: '18%', top: '30%', containLabel: true },
        xAxis: { type: 'time', ...this.getBaseAxisStyle() },
            yAxis: this.getYAxisConfig(),
        dataZoom: this.getBaseDataZoom(),
        graphic: this.getDataZoomLabels(stationData), // 添加dataZoom边界标签
          series: series
        };
    },

    // 辅助函数，提供基础样式配置
    getSeriesStyle(type) {
      const styles = {
        actual_temp: { color: '#ffd166', width: 1.5, type: 'solid' },
        prediction_temp: { color: '#ffd166', width: 1.5, type: 'dashed', dashArray: [8, 4] },
        actual_pressure: { color: '#ff6b6b', width: 1.5, type: 'solid' },
        prediction_pressure: { color: '#ff6b6b', width: 1.5, type: 'dashed', dashArray: [8, 4] }
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
      const colorSchemes = {
        '黄埔': {
          actual: '#FF6B35',      // 橙红色 - 黄埔实际
          prediction: '#FF8C42'   // 浅橙色 - 黄埔预测
        },
        '东莞': {
          actual: '#4ECDC4',      // 青绿色 - 东莞实际  
          prediction: '#45B7B8'   // 深青色 - 东莞预测
        },
        '十字窖': {
          actual: '#A8E6CF',      // 浅绿色 - 十字窖实际
          prediction: '#88D8A3'   // 中绿色 - 十字窖预测
        },
        '站点2': {
          actual: '#FFD93D',      // 金黄色 - 站点2实际
          prediction: '#FFC312'   // 深黄色 - 站点2预测
        }
      };
      
      return colorSchemes[stationName] || {
        actual: '#66dffb',
        prediction: '#52c41a'
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
        // 重新初始化图表以匹配单/双图表模式，并重置dataZoom
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

.chart-section-title {
  text-align: center;
  color: #66dffb;
  font-size: 14px;
  font-weight: bold;
  padding: 5px 0;
  border-bottom: 1px solid rgba(102, 223, 251, 0.3);
  margin-bottom: 5px;
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
</style> 