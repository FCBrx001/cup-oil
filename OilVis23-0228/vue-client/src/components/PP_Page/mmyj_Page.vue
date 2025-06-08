<template>
  <div style="float:left;width:100%">
    <!-- 内容正文 -->
    <div class="zhenwen" style="display: flex;">
      <!-- 左侧图表展示 -->
      <div style="width: 23%;">
        <!-- 管段状态信息 -->
        <pipeline-status-info 
          @pipeline-changed="changePipeline" 
          ref="pipelineStatusInfo" />
          
        <div class="data-box1 left_tb fl " style="height: 450px;margin-top: 25px;">
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
      
      <div style="width: 50%;margin-left: 10px;">
        <!-- 管段沿线监测 -->
        <pipeline-visualization 
          :pipeline-id="selectedPipeline" 
          @valve-clicked="handleValveClick" />
          
        <div class="data-box1 left_tb box1-backlu fl" style="height: 745px;margin-top: 25px;">
          <i class="topL"></i>
          <i class="topR"></i>
          <i class="bottomL"></i>
          <i class="bottomR"></i>
          <div class="data-title" style="width:13rem;">
            <b class="data-title-left fl">[</b>
            <span style="font-size:1.5rem;width:12rem;">参数对比分析</span>
            <b class="data-title-right fr">]</b>
          </div>
          <div style="height: 100%">
            <!-- 参数动态预测 -->
            <div style="width: 100%;height: 55%;">
              <prediction-chart 
                :pipeline-id="selectedPipeline"
                :selected-valve-info="selectedValve"
                @valve-reset="selectedValve = null"
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
          <div class="box1-backlu" style="height: 22%;width: 100%;">
            <div class="leakage-monitor">
              <div class="monitor-grid">
                <div class="monitor-item">
                  <span class="label">监测点</span>
                  <span class="value">阀室#1</span>
                </div>
                <div class="monitor-item">
                  <span class="label">状态</span>
                  <span class="value normal">正常</span>
                </div>
                <div class="monitor-item">
                  <span class="label">压力变化</span>
                  <span class="value">-0.02 MPa</span>
                </div>
                <div class="monitor-item">
                  <span class="label">温度变化</span>
                  <span class="value">+0.5 ℃</span>
                </div>
                <div class="monitor-item">
                  <span class="label">流量变化</span>
                  <span class="value">-0.1 m³/h</span>
                </div>
                <div class="monitor-item">
                  <span class="label">检测时间</span>
                  <span class="value">2024-02-28 14:30</span>
                </div>
              </div>
              <div class="monitor-status" style="height: 30px;">
                <div class="status-indicator">
                  <span class="dot normal"></span>
                  <span class="text">系统运行正常</span>
                </div>
                <div class="status-time">
                  上次检测：2分钟前
                </div>
              </div>
            </div>
          </div>
          
          <div style="height: 22%;width: 100%;">
            <!-- 高点汽化风险监测 -->
            <vaporization-warning 
              ref="vaporizationWarning"
              @valve-selected="handleValveSelected" />
          </div>
          
          <div style="height: 56%;width: 100%;">
            <!-- 停输保压方案 -->
            <pressure-maintenance-plan />
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

export default {
  name: 'mmyj_Page',
  components: {
    'Scatterplot': Scatter_plot,
    'TestChart': TestChart,
    PipelineStatusInfo,
    PipelineVisualization,
    PredictionChart,
    VaporizationWarning,
    PressureMaintenancePlan
  },
  data() {
    return {
      selectedPipeline: 'pipeline1',
      selectedValve: null,
      selectedValveInfo: null,
      configDialogVisible: false,
      selectedPlan: 'plan1',
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
      }
    }
  },
  methods: {
    changePipeline(value) {
      this.selectedPipeline = value;
      // Update charts that depend on pipeline
    },
    handleValveClick(data) {
      // 更新当前选中的阀室信息
      this.selectedValveInfo = data;
      // 同时更新selectedValve，传递给PredictionChart组件
      this.selectedValve = data;
      
      console.log('阀室被点击：', data.valveName);
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
</style>