<template>
  <div class="prediction-chart-container">
    <div class="chart-header">
      <h3>{{ chartTitle }}</h3>
      <div class="controls">
        <button @click="startPredictionMode" :disabled="isPredictionActive">
          启动预测模式
        </button>
        <button @click="stopPredictionMode" :disabled="!isPredictionActive">
          停止预测模式
        </button>
        <button @click="startRealtimeService" :disabled="isRealtimeActive">
          启动实时监测
        </button>
        <button @click="stopRealtimeService" :disabled="!isRealtimeActive">
          停止实时监测
        </button>
        <button @click="startBatchService" :disabled="isBatchActive">
          启动批次跟踪
        </button>
        <button @click="stopBatchService" :disabled="!isBatchActive">
          停止批次跟踪
        </button>
      </div>
    </div>
    
    <div class="status-panel">
      <div class="status-item">
        <span class="label">预测模式:</span>
        <span :class="['status', isPredictionActive ? 'active' : 'inactive']">
          {{ isPredictionActive ? '运行中' : '已停止' }}
        </span>
      </div>
      <div class="status-item">
        <span class="label">实时监测:</span>
        <span :class="['status', connectionStatus]">
          {{ getConnectionStatusText(connectionStatus) }}
        </span>
      </div>
      <div class="status-item">
        <span class="label">批次跟踪:</span>
        <span :class="['status', batchStatus]">
          {{ getBatchStatusText(batchStatus) }}
        </span>
      </div>
    </div>
    
    <div class="chart-content">
      <div id="prediction-chart" style="width: 100%; height: 400px;"></div>
    </div>
    
    <div class="data-panel">
      <h4>数据信息</h4>
      <div class="data-info">
        <p>预测数据点数量: {{ predictionDataCount }}</p>
        <p>实时数据更新时间: {{ lastUpdateTime }}</p>
        <p>批次数据状态: {{ batchDataStatus }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import DataService from '@/utils/dataService'

export default {
  name: 'PredictionChartWithState',
  props: {
    stationName: {
      type: String,
      default: '黄埔'
    }
  },
  data() {
    return {
      chart: null,
      dataService: null
    }
  },
  computed: {
    chartTitle() {
      return `${this.stationName} 参数预测分析 (Vuex State模式)`
    },
    
    // 从Vuex获取状态
    isPredictionActive() {
      return this.$store.getters.isPredictionModeActive
    },
    
    connectionStatus() {
      return this.$store.getters.getConnectionStatus
    },
    
    batchStatus() {
      return this.$store.getters.getBatchStatus
    },
    
    isRealtimeActive() {
      return this.connectionStatus === 'connected'
    },
    
    isBatchActive() {
      return this.batchStatus === 'success'
    },
    
    predictionDataCount() {
      const tempData = this.$store.getters.getPredictionData(this.stationName, 'temperature')
      const pressureData = this.$store.getters.getPredictionData(this.stationName, 'pressure')
      return {
        temperature: tempData.prediction.length,
        pressure: pressureData.prediction.length
      }
    },
    
    lastUpdateTime() {
      const pipelineData = this.$store.getters.getPipelineData
      return pipelineData ? new Date(pipelineData.lastUpdateTime).toLocaleString() : '无数据'
    },
    
    batchDataStatus() {
      const batchData = this.$store.getters.getBatchData
      return batchData && batchData.length > 0 ? `${batchData.length} 条批次数据` : '无批次数据'
    }
  },
  
  mounted() {
    this.initChart()
    this.initDataService()
  },
  
  beforeDestroy() {
    if (this.dataService) {
      this.dataService.stopAllServices()
    }
    if (this.chart) {
      this.chart.dispose()
    }
  },
  
  watch: {
    // 监听预测数据变化
    '$store.state.predictionData': {
      handler() {
        this.updateChart()
      },
      deep: true
    },
    
    // 监听实时数据变化
    '$store.state.realtimeMonitoring.pipelineData': {
      handler() {
        this.updateChart()
      },
      deep: true
    },
    
    // 监听批次数据变化
    '$store.state.batchTracking.batchData': {
      handler() {
        console.log('批次数据已更新:', this.$store.getters.getBatchData)
      },
      deep: true
    }
  },
  
  methods: {
    initChart() {
      const chartDom = document.getElementById('prediction-chart')
      this.chart = echarts.init(chartDom)
      this.updateChart()
    },
    
    initDataService() {
      this.dataService = new DataService(this.$store)
    },
    
    updateChart() {
      if (!this.chart) return
      
      const tempData = this.$store.getters.getPredictionData(this.stationName, 'temperature')
      const pressureData = this.$store.getters.getPredictionData(this.stationName, 'pressure')
      
      const option = {
        title: {
          text: this.chartTitle,
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['预测温度', '预测压力'],
          top: 30
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'time',
          boundaryGap: false
        },
        yAxis: [
          {
            type: 'value',
            name: '温度 (°C)',
            position: 'left',
            axisLabel: {
              formatter: '{value} °C'
            }
          },
          {
            type: 'value',
            name: '压力 (MPa)',
            position: 'right',
            axisLabel: {
              formatter: '{value} MPa'
            }
          }
        ],
        series: [
          {
            name: '预测温度',
            type: 'line',
            yAxisIndex: 0,
            data: tempData.prediction,
            itemStyle: {
              color: '#1890ff'
            },
            lineStyle: {
              type: 'dashed'
            }
          },
          {
            name: '预测压力',
            type: 'line',
            yAxisIndex: 1,
            data: pressureData.prediction,
            itemStyle: {
              color: '#52c41a'
            },
            lineStyle: {
              type: 'dashed'
            }
          }
        ]
      }
      
      this.chart.setOption(option)
    },
    
    startPredictionMode() {
      if (this.dataService) {
        this.dataService.startPredictionService(this.stationName, false)
      }
    },
    
    stopPredictionMode() {
      if (this.dataService) {
        this.dataService.stopPredictionService(this.stationName)
      }
    },
    
    startRealtimeService() {
      if (this.dataService) {
        this.dataService.startRealtimeMonitoringService()
      }
    },
    
    stopRealtimeService() {
      if (this.dataService) {
        this.dataService.stopRealtimeMonitoringService()
      }
    },
    
    startBatchService() {
      if (this.dataService) {
        this.dataService.startBatchTrackingService()
      }
    },
    
    stopBatchService() {
      if (this.dataService) {
        this.dataService.stopBatchTrackingService()
      }
    },
    
    getConnectionStatusText(status) {
      const statusMap = {
        'disconnected': '未连接',
        'connecting': '连接中',
        'connected': '已连接',
        'error': '连接错误'
      }
      return statusMap[status] || status
    },
    
    getBatchStatusText(status) {
      const statusMap = {
        'idle': '空闲',
        'success': '运行中',
        'error': '错误'
      }
      return statusMap[status] || status
    }
  }
}
</script>

<style scoped>
.prediction-chart-container {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h3 {
  margin: 0;
  color: #333;
}

.controls {
  display: flex;
  gap: 10px;
}

.controls button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #1890ff;
  color: white;
  cursor: pointer;
  font-size: 14px;
}

.controls button:hover:not(:disabled) {
  background: #40a9ff;
}

.controls button:disabled {
  background: #d9d9d9;
  cursor: not-allowed;
}

.status-panel {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label {
  font-weight: bold;
  color: #666;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.status.active {
  background: #f6ffed;
  color: #52c41a;
}

.status.inactive {
  background: #fff2e8;
  color: #fa8c16;
}

.status.connected {
  background: #f6ffed;
  color: #52c41a;
}

.status.connecting {
  background: #e6f7ff;
  color: #1890ff;
}

.status.disconnected {
  background: #fff2e8;
  color: #fa8c16;
}

.status.error {
  background: #fff1f0;
  color: #f5222d;
}

.status.success {
  background: #f6ffed;
  color: #52c41a;
}

.status.idle {
  background: #f5f5f5;
  color: #666;
}

.chart-content {
  background: white;
  border-radius: 6px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.data-panel {
  background: white;
  border-radius: 6px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.data-panel h4 {
  margin: 0 0 15px 0;
  color: #333;
}

.data-info p {
  margin: 8px 0;
  color: #666;
}
</style> 