<template>
  <div style="float:left;width:100%">
    <!-- 内容正文 -->
    <div class="zhenwen" style="display: flex;">
      <!-- 左侧图表展示 -->
      <div style="width: 23%;">
        <div style="width: 98%;height: 580px;" class="data-box1 left_tb fl">
          <!-- 管段状态信息 -->
          <div>
            <i class="topL"></i>
            <i class="topR"></i>
            <i class="bottomL"></i>
            <i class="bottomR"></i>
            <pipeline-status-info
              @pipeline-changed="changePipeline"
              @connection-status-changed="handleConnectionStatusChanged"
              ref="pipelineStatusInfo" />
          </div>
          <div class="data-box1 left_tb fl " style="height: 411px;margin-top: 15px;width: 100%;">
            <i class="topL"></i>
            <i class="topR"></i>
            <i class="bottomL"></i>
            <i class="bottomR"></i>
            <div class="data-title" style="width:13rem;">
              <b class="data-title-left fl">[</b>
              <span style="font-size:1.5rem;width:12rem;">物性计算</span>
              <b class="data-title-right fr">]</b>
            </div>
            <div style="width: 100%;height: 100%;">
              <Scatterplot></Scatterplot>
            </div>
          </div>
        </div>
      </div>
      
      <div style="width: 50%;margin-left: 10px;">
        <!-- 管段沿线监测 -->
        <pipeline-visualization
          :pipeline-id="selectedPipeline"
          :selected-valves="selectedValves"
          :websocket-connection-status="websocketConnectionStatus"
          @valve-clicked="handleValveClick"
          @prediction-mode-changed="handlePredictionModeChange"
          @real-time-data="handleRealTimeData"
          @monitor-info="handleMonitorInfoUpdate"
          ref="pipelineVisualization" />
          
        <div class="data-box1 left_tb box1-backlu fl" style="height: 750px;margin-top: 20px;">
          <i class="topL"></i>
          <i class="topR"></i>
          <i class="bottomL"></i>
          <i class="bottomR"></i>
          <div class="data-title" style="width:13rem;">
            <b class="data-title-left fl">[</b>
            <span style="font-size:1.5rem;width:12rem;">压降温降预测</span>
            <b class="data-title-right fr">]</b>
          </div>
          <div style="height: 100%">
            <!-- 参数动态预测 -->
            <div style="width: 100%;height: 60%;">
              <prediction-chart 
                :pipeline-id="selectedPipeline"
                :selected-valves="selectedValves"
                :prediction-mode="predictionMode"
                :real-time-data="currentRealTimeData"
                @remove-valve="handleRemoveValve"

                ref="predictionChart" />
            </div>
            <span class="wgrytj_bt" style="font-size:1.2rem;"></span>
            <div style="height: 45%;">
              <div class="data-title" style="width:13rem;"></div>
              <TestChart></TestChart>
            </div>
          </div>
        </div>
      </div>
      
      <div style="width: 27%;">
        <div class="data-box1 left_tb fl" style="height: 1020px;">
          <i class="topL"></i>
          <i class="topR"></i>
          <i class="bottomL"></i>
          <i class="bottomR"></i>
          <div class="data-title" style="width:13rem;">
            <b class="data-title-left fl">[</b>
            <span style="font-size:1.5rem;width:12rem;">停输压降预警</span>
            <b class="data-title-right fr">]</b>
          </div>
          
          <!-- 偷漏油监测 -->
          <div class="warning-block" style="height: 22%;">
            <div class="block-title">
              <span class="title-text">偷漏油监测</span>
              <div class="status-info">
                <span class="status-dot" :class="monitorInfo.statusClass || 'normal'"></span>
                <span class="status-text">{{ monitorInfo.status === '正常' ? '系统运行正常' : '系统存在警告' }}</span>
              </div>
            </div>
            <div class="block-content">
              <div class="monitor-grid">
                <div class="monitor-item">
                  <span class="label">监测点</span>
                  <span class="value">{{ monitorInfo.point }}</span>
                </div>
                <div class="monitor-item">
                  <span class="label">状态</span>
                  <span class="value" :class="monitorInfo.statusClass || 'normal'">{{ monitorInfo.status }}</span>
                </div>
                <div class="monitor-item">
                  <span class="label">压力变化</span>
                  <span class="value">{{ monitorInfo.pressureChange }}</span>
                </div>
                <div class="monitor-item">
                  <span class="label">温度变化</span>
                  <span class="value">{{ monitorInfo.tempChange }}</span>
                </div>
                <div class="monitor-item">
                  <span class="label">流量变化</span>
                  <span class="value">{{ monitorInfo.flowChange }}</span>
                </div>
                <div class="monitor-item">
                  <span class="label">检测时间</span>
                  <span class="value">{{ monitorInfo.time }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 高点汽化风险监测 -->
          <div class="warning-block" style="height: 24%; margin-bottom: 0px;">
            <div class="block-title">
              <span class="title-text">高点汽化风险监测</span>
              <div class="status-info">
                <span class="status-dot warning"></span>
                <span class="status-text">存在风险点</span>
              </div>
            </div>
            <div class="block-content" style="overflow: auto;">
              <vaporization-warning 
                ref="vaporizationWarning"
                @valve-selected="handleValveSelected" />
            </div>
          </div>
          
          <!-- 停输保压方案 -->
          <div class="warning-block" style="height: 20%;">
            <div class="block-title">
              <span class="title-text">停输管容量变化</span>
              <div class="status-info">
                <span class="status-dot normal"></span>
                <span class="status-text">容量波动正常</span>
              </div>
            </div>
            <div class="block-content">
              <!-- 管容量图表 -->
              <pipe-capacity-chart />
            </div>
          </div>
          <div class="warning-block" style="height: 29.5%;">
            <div class="block-title">
              <span class="title-text">停输保压方案</span>
              <div class="status-info">
                <select v-model="selectedStation"
                  style="margin: 0 10px; height: 26px; border-radius: 4px; border: 1px solid #1890ff; background: #001529; color: #66dffb; font-size: 15px;">
                  <option value="huangpu">黄埔</option>
                  <option value="shizijiao1">十字窖</option>
                  <option value="shizijiao2">站点2</option>
                  <option value="dongguan">东莞</option>
                </select>
                <span class="status-dot normal"></span>
                <span class="status-text">方案执行中</span>
              </div>
            </div>
            <div class="block-content">
              <pressure-maintenance-plan :station="selectedStation" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import Scatter_plot from '../PP_Page/HelloWorld.vue'
import TestChart from '../../views/test_chart.vue';

// Import modular components
import PipelineStatusInfo from './PipelineStatusInfo.vue';
import PipelineVisualization from './PipelineVisualization.vue';
import PredictionChart from './PredictionChart.vue';
import VaporizationWarning from './VaporizationWarning.vue';
import PressureMaintenancePlan from './PressureMaintenancePlan.vue';
import PipeCapacityChart from './PipeCapacityChart.vue';

export default {
  name: 'mmyj_Page',
  components: {
    'Scatterplot': Scatter_plot,
    'TestChart': TestChart,
    PipelineStatusInfo,
    PipelineVisualization,
    PredictionChart,
    VaporizationWarning,
    PressureMaintenancePlan,
    PipeCapacityChart
  },
  data() {
    return {
      selectedPipeline: 'pipeline1',
      selectedStation: 'dongguan',
      selectedValve: null,
      selectedValveInfo: null,
      selectedValves: [],
      maxValveSelection: 2,
      configDialogVisible: false,
      selectedPlan: 'plan1',
      predictionMode: {
        isEnabled: false,
        valveName: '',
        startTime: null
      },
      planParams: {
        initialPressure: 2.0,
        monitorInterval: 1,
        alarmThreshold: 0.05,
        pressureDropRate: 0.01,
        maxPressure: 2.5,
        minPressure: 1.5
      },
      executionSettings: {
        autoExecute: false,
        notifyPersonnel: false,
        logOperations: false
      },
      // 新增：当前的真实数据
      currentRealTimeData: null,
      // WebSocket连接状态
      websocketConnectionStatus: 'disconnected',
      monitorInfo: {
          point: '阀室#1',
          status: '正常',
          pressureChange: '-0.02 MPa',
          tempChange: '+0.5 ℃',
          flowChange: '-0.1 m³/h',
          time: '2024-02-28 14:30',
          statusClass: 'normal'
        }
    }
  },
  methods: {
    changePipeline(value) {
      this.selectedPipeline = value;
      // Update charts that depend on pipeline
    },

    // 处理WebSocket连接状态变化
    handleConnectionStatusChanged(status) {
      this.websocketConnectionStatus = status;
      console.log('WebSocket连接状态变化:', status);
    },
    handleValveClick(data) {
      // 构造点击的站点数据
      const newValve = {
        valveId: `${data.stationType}_${data.valveIndex || 0}`,
        valveName: data.valveName,
        valveIndex: data.valveIndex || 0,
        stationType: data.stationType || 'valve',
        stationData: data.stationData || {},
        x: data.x,
        y: data.y
      };

      // 构造黄埔站数据作为基准对比站点
      const huangpuValve = {
        valveId: 'startStation_0',
        valveName: '黄埔',
        valveIndex: 0,
        stationType: 'startStation',
        stationData: {
          environmentTemp: 26,
          inletPressure: 2.6,
          inletTemp: 88,
          outletPressure: 2.4,
          outletTemp: 87
        },
        x: 0,
        y: 650
      };

      // 构造东莞站数据
      const dongguanValve = {
        valveId: 'endStation_0',
        valveName: '东莞',
        valveIndex: 0,
        stationType: 'endStation',
        stationData: {
          environmentTemp: 24,
          inletPressure: 0.8,
          inletTemp: 85,
          outletPressure: 0.6,
          outletTemp: 84
        },
        x: 500,
        y: 650
      };

      if (this.selectedValves.length === 0) {
        // 第一次点击站点
        if (data.valveName === '黄埔') {
          // 点击黄埔：黄埔 vs 东莞
          this.selectedValves = [huangpuValve, dongguanValve];
          this.$message({
            type: 'success',
            message: '正在对比 黄埔站 与 东莞站'
          });
        } else {
          // 点击其他站点：黄埔 vs 选中站点
          this.selectedValves = [huangpuValve, newValve];
          this.$message({
            type: 'success',
            message: `正在对比 黄埔站 与 ${data.valveName}`
          });
        }
      } else if (this.selectedValves.length === 1) {
        // 只有一个站点时，点击另一个站点开始对比
        const existingStation = this.selectedValves[0];
        
        // 检查是否点击了相同的站点
        if (existingStation.valveName === data.valveName) {
          this.$message({
            type: 'warning',
            message: `${data.valveName} 已经在对比中，不能重复选择同一站点`
          });
          return;
        }
        
        // 添加第二个站点开始对比
        this.selectedValves.push(newValve);
        this.$message({
          type: 'success',
          message: `正在对比 ${existingStation.valveName} 与 ${data.valveName}`
        });
      } else if (this.selectedValves.length === 2) {
        // 检查是否点击了已经选中的站点
        const isAlreadySelected = this.selectedValves.some(valve => valve.valveName === data.valveName);
        
        if (isAlreadySelected) {
          // 如果点击的是已经选中的站点，显示警告信息
          this.$message({
            type: 'warning',
            message: `${data.valveName} 已经在对比中，不能重复选择同一站点`
          });
          return; // 直接返回，不进行任何操作
        }
        
        // 已有两个站点，点击第三个站点：保留第二个站点，替换为新选中站点
        const secondStation = this.selectedValves[1]; // 保留第二个站点
        this.selectedValves = [secondStation, newValve];
        this.$message({
          type: 'success',
          message: `正在对比 ${secondStation.valveName} 与 ${data.valveName}`
        });
      }
      
      console.log('当前选中的站点:', this.selectedValves);
    },
    handleValveSelected(valveData) {
      // Handle valve selection from vaporization warning component
      this.selectedValve = valveData;
    },
    showConfigDialog() {
      this.configDialogVisible = true;
    },
    applyConfig() {
      this.configDialogVisible = false;
      this.$message({
        type: 'success',
        message: '配置已应用'
      });
    },
    // 显示阀室详情
    showValveDetails(valveName) {
      // 更新选中的阀室，传递给预测图表组件
      this.selectedValve = {
        valveName: valveName,
        valveIndex: parseInt(valveName.replace(/[^0-9]/g, '')) || 0
      };
    },
    handleRemoveValve(valve) {
      // 支持传入valve对象或valveId
      const targetId = typeof valve === 'string' ? valve : valve.valveId;
      const index = this.selectedValves.findIndex(v => v.valveId === targetId);
      if (index !== -1) {
        const removedValve = this.selectedValves.splice(index, 1)[0];
        this.$message({
          type: 'info',
          message: `已移除 ${removedValve.valveName}`
        });
      }
    },

    handlePredictionModeChange(modeData) {
      this.predictionMode = {
        isEnabled: modeData.isEnabled,
        valveName: modeData.valveName,
        startTime: modeData.startTime
      };
      console.log('预测模式状态变化:', this.predictionMode);
    },
    
    handleMonitorInfoUpdate(newInfo) {
      this.monitorInfo = newInfo;
    },

    // 新增：处理来自管线图的真实数据
    handleRealTimeData(data) {
      console.log('mmyj_Page收到真实数据:', data);
      
      // 更新当前真实数据
      this.currentRealTimeData = {
        ...data,
        timestamp: new Date(),
        isSequentialData: true
      };
      
      console.log('准备传递给参数对比分析:', this.currentRealTimeData);
    },
  }
}
</script>

<style scoped>
/* Common styles */
.leakage-monitor {
  padding: 10px;
}

.monitor-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 10px;
}

.monitor-item {
  display: flex;
  flex-direction: column;
  background: rgba(0, 21, 41, 0.3);
  padding: 5px 10px;
  border-radius: 4px;
}

.monitor-item .label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin-bottom: 5px;
}

.monitor-item .value {
  color: #66dffb;
  font-size: 16px;
  font-weight: 500;
}

.monitor-item .value.normal {
  color: #52c41a;
}

.monitor-item .value.warning {
  color: #faad14;
}

.monitor-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  background: rgba(0, 21, 41, 0.2);
  border-radius: 4px;
}

.status-indicator {
  display: flex;
  align-items: center;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
}

.dot.normal {
  background-color: #52c41a;
  box-shadow: 0 0 5px #52c41a;
}

.status-indicator .text {
  color: #52c41a;
  font-size: 14px;
}

.status-time {
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
}

/* Chart styles */
.wgrytj_bt {
  color: #66dffb;
  display: block;
  margin-bottom: 10px;
}

.warning-block {
  background: rgba(0, 21, 41, 0.8);
  border: 1px solid rgba(24, 144, 255, 0.3);
  border-radius: 4px;
  margin: 5px;
  height: calc(100% - 10px);
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 1;
}

.warning-block:nth-child(3) {
  margin-bottom: 10px;
  z-index: 2;
}

.warning-block:nth-child(4) {
  z-index: 1;
}

.block-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 15px;
  background: rgba(0, 21, 41, 0.9);
  border-bottom: 1px solid rgba(24, 144, 255, 0.2);
}

.title-text {
  color: #66dffb;
  font-size: 1.2rem;
  font-weight: 500;
}

.status-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.normal {
  background-color: #52c41a;
  box-shadow: 0 0 5px #52c41a;
}

.status-dot.warning {
  background-color: #faad14;
  box-shadow: 0 0 5px #faad14;
}

.status-dot.danger {
  background-color: #ff4d4f;
  box-shadow: 0 0 5px #ff4d4f;
  animation: pulse 1.5s infinite;
}

.status-text {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.9rem;
}

.block-content {
  flex: 1;
  padding: 10px;
  overflow: hidden;
}

.monitor-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  height: 100%;
}

.monitor-item {
  background: rgba(24, 144, 255, 0.1);
  border-radius: 4px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.monitor-item:hover {
  background: rgba(24, 144, 255, 0.2);
  transform: translateY(-2px);
}

.monitor-item .label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.monitor-item .value {
  color: #1890ff;
  font-size: 1.1rem;
  font-weight: 500;
}

.monitor-item .value.normal {
  color: #52c41a;
}

.monitor-item .value.warning {
  color: #faad14;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 5px #ff4d4f;
  }
  50% {
    box-shadow: 0 0 15px #ff4d4f;
  }
  100% {
    box-shadow: 0 0 5px #ff4d4f;
  }
}
</style>