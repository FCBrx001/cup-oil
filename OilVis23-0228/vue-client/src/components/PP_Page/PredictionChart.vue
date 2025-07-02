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
            <!-- 测试按钮 -->
            <button 
              class="toggle-btn"
              @click="testPredictionData"
              style="background: rgba(255, 193, 7, 0.1); border-color: rgba(255, 193, 7, 0.6);"
            >
              🧪 测试预测
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="chart-body">
      <!-- 双图表模式（多站点对比）-->
      <div v-if="shouldUseDualCharts" class="dual-chart-container">
        <div class="chart-section" v-if="showTemperature">
          <div id="temperature_chart" style="width:100%; height:300px;"></div>
        </div>
        <div class="chart-section" v-if="showPressure">
          <div id="pressure_chart" style="width:100%; height:300px;"></div>
        </div>
      </div>
      
      <!-- 单图表模式（默认或单站点）-->
      <div v-else>
        <div id="prediction_chart" style="width:100%; height:300px;"></div>
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
      defaultStationName: '十字窖#2',
      
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
      dataInitialized: false
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
        : this.defaultStationName;
    },
    chartTitle() {
      if (this.shouldUseDualCharts) {
        return `多站点参数对比分析 (${this.selectedValves.map(v => v.valveName).join(' vs ')})`;
      }
      return `${this.currentStationName} 参数预测分析`;
    },
    realDataCount() {
      return this.getRealTimeDataCount(this.currentStationName);
    },
    predictionDataCount() {
      return this.getPredictionDataCount(this.currentStationName);
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
      const option = this.getBaseChartOption(this.currentStationName);
        this.prediction_chart.setOption(option, true);
    },

    drawDualCharts() {
      if (!this.shouldUseDualCharts) return;
      const [station1, station2] = this.selectedValves.map(v => v.valveName);

      if (this.temperature_chart) {
        const option1 = this.getBaseChartOption(station1);
        this.temperature_chart.setOption(option1, true);
      }
      
      if (this.pressure_chart) {
        const option2 = this.getBaseChartOption(station2);
        this.pressure_chart.setOption(option2, true);
      }
    },

    // 统一的图表配置生成器
    getBaseChartOption(stationName) {
        const stationData = this.getCombinedStationData(stationName);
        const series = [];

      if (this.showTemperature) {
            series.push({ name: '实际温度', type: 'line', yAxisIndex: 1, data: stationData.temperature.actual, ...this.getSeriesStyle('actual_temp') });
            series.push({ name: '预测温度', type: 'line', yAxisIndex: 1, data: stationData.temperature.prediction, ...this.getSeriesStyle('prediction_temp') });
      }
      if (this.showPressure) {
            series.push({ name: '实际压力', type: 'line', yAxisIndex: 0, data: stationData.pressure.actual, ...this.getSeriesStyle('actual_pressure') });
            series.push({ name: '预测压力', type: 'line', yAxisIndex: 0, data: stationData.pressure.prediction, ...this.getSeriesStyle('prediction_pressure') });
      }

      return {
            backgroundColor: 'transparent',
            title: { text: this.shouldUseDualCharts ? stationName : null, left: 'center', textStyle: { color: '#66dffb', fontSize: 14 } },
        tooltip: { trigger: 'axis', ...this.getBaseTooltipStyle() },
        legend: { top: 25, textStyle: { color: '#66dffb' } },
            grid: { left: '15%', right: '8%', bottom: '15%', top: '30%', containLabel: true },
        xAxis: { type: 'time', ...this.getBaseAxisStyle() },
            yAxis: this.getYAxisConfig(),
        dataZoom: this.getBaseDataZoom(),
          series: series
        };
    },

    // 辅助函数，提供基础样式配置
    getSeriesStyle(type) {
      const styles = {
        actual_temp: { color: '#ffd166', width: 3, type: 'solid' },
        prediction_temp: { color: '#ffd166', width: 2, type: 'dashed' },
        actual_pressure: { color: '#ff6b6b', width: 3, type: 'solid' },
        prediction_pressure: { color: '#ff6b6b', width: 2, type: 'dashed' }
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

    getYAxisConfig() {
      const yAxis = [];
        if (this.showPressure) {
        yAxis.push({
                min: 0, max: 10, type: 'value', name: '压力 (MPa)', position: 'left',
          nameTextStyle: { color: '#ff6b6b', fontSize: 12 },
          axisLine: { show: true, lineStyle: { color: '#ff6b6b', width: 2 } },
          axisLabel: { color: '#ff6b6b', fontSize: 11, formatter: '{value}MPa' },
                splitLine: { show: false }, axisTick: { show: false }
        });
        }
        if (this.showTemperature) {
        yAxis.push({
                min: -20, max: 40, type: 'value', name: '温度 (℃)', position: 'right',
          nameTextStyle: { color: '#ffd166', fontSize: 12 },
          axisLine: { show: true, lineStyle: { color: '#ffd166', width: 2 } },
          axisLabel: { color: '#ffd166', fontSize: 11, formatter: '{value}℃' },
                splitLine: { show: false }, axisTick: { show: false }
        });
      }
      return yAxis;
    },

    getBaseTooltipStyle() {
      return {
        backgroundColor: 'rgba(0, 21, 41, 0.95)', borderColor: '#66dffb', borderWidth: 1,
        textStyle: { color: '#ffffff', fontSize: 12 },
        formatter: (params) => {
            // 'params' 现在可能是一个对象或数组，需要统一处理
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
        axisTick: { show: false }, 
        splitLine: { show: false },
        min: 'dataMin',
        max: 'dataMax'
      };
    },

    getBaseDataZoom() {
      return [
        // X轴缩放
        { type: 'slider', show: true, xAxisIndex: 0, height: 20, bottom: 0, ...this.getDataZoomStyle() },
        { type: 'inside', xAxisIndex: 0 },
        // Y轴缩放
        { type: 'slider', show: true, yAxisIndex: 0, width: 20, right: 0, ...this.getDataZoomStyle() },
        { type: 'inside', yAxisIndex: 0 }
      ];
    },
    
    getDataZoomStyle() {
        return {
            borderColor: 'rgba(102, 223, 251, 0.3)', textStyle: { color: '#66dffb' },
            handleStyle: { color: '#66dffb' }, dataBackground: { areaStyle: { color: 'rgba(102, 223, 251, 0.2)' } },
            fillerColor: 'rgba(102, 223, 251, 0.3)'
        }
    },

    getTagType(index) {
      return ['success', 'warning', 'info', 'danger'][index % 4];
    },

    removeValve(valve) {
      this.$emit('remove-valve', valve);
    },

    clearAllValves() {
      this.$emit('clear-all-valves');
    },

    toggleTemperature() {
      if (this.showTemperature && !this.showPressure) return; // 至少保留一个
      this.displayOptions = this.showTemperature 
        ? this.displayOptions.filter(o => o !== 'temperature') 
        : [...this.displayOptions, 'temperature'];
          this.drawCharts();
    },

    togglePressure() {
      if (this.showPressure && !this.showTemperature) return; // 至少保留一个
      this.displayOptions = this.showPressure 
        ? this.displayOptions.filter(o => o !== 'pressure') 
        : [...this.displayOptions, 'pressure'];
      this.drawCharts();
    },

    testPredictionData() {
        // 始终为所有站点测试预测数据，不依赖于选中状态
        const stationsToTest = ['十字窖#1', '十字窖#2', '黄埔', '东莞'];

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

        const fetchResponse = await fetch(`http://localhost:3000/hpdg/realtime/recent?count=${count}`, {
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
          const stations = ['十字窖#1', '十字窖#2', '黄埔', '东莞'];

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

        const fetchResponse = await fetch('http://localhost:3000/hpdg/realtime/latest', {
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
          const stations = ['十字窖#1', '十字窖#2', '黄埔', '东莞'];
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
        const stationsToFetch = ['十字窖#1', '十字窖#2', '黄埔', '东莞'];

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
            const currentStations = ['十字窖#1', '十字窖#2', '黄埔', '东莞'];

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
        '十字窖#1': 'STN10_05_TI501', '十字窖#2': 'STN10_05_TI502',
        '黄埔': 'STN10_00_TI002', '东莞': 'STN11_00_TI001'
      };
      return data[temperatureFields[valveName]] || null;
    },
    
    // 从真实数据中提取压力值
    getPressureFromData(data, valveName) {
      const pressureFields = {
        '十字窖#1': 'STN10_05_PI501', '十字窖#2': 'STN10_05_PI502',
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
        console.log('监听到阀门选择变化，只重新初始化图表显示...');
        // 只重新初始化图表以匹配单/双图表模式，数据获取保持独立运行
        this.initChartOnly();
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

.icon-temperature:before {
  content: "🌡️";
  font-size: 14px;
}

.icon-pressure:before {
  content: "📊";
  font-size: 14px;
}
</style> 