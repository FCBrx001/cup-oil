<template>
  <div class="pipeline-status-container">
    <!-- 组件标题 -->
    <div class="component-header">
      <div class="header-decoration">
        <!-- <i class="corner-tl"></i>
        <i class="corner-tr"></i>
        <i class="corner-bl"></i>
        <i class="corner-br"></i> -->
      </div>
      <div class="title-wrapper">
        <span class="title-bracket left">[</span>
        <span class="title-text">管段状态信息</span>
        <span class="title-bracket right">]</span>
      </div>
    </div>

    <!-- 管段选择器 -->
    <div class="pipeline-selector">
      <div class="select-wrapper">
        <div class="select-container">
          <div class="select-display">
            {{ currentPipelineLabel || '请选择管段' }}
          </div>
          <el-select 
            v-model="selectedPipeline" 
            placeholder="请选择管段" 
            @change="handlePipelineChange" 
            class="hidden-select"
            popper-class="pipeline-dropdown">
            <el-option
              v-for="item in pipelineOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <div class="select-arrow">
            <i class="el-icon-arrow-down"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- 管段状态信息主体 -->
    <div class="status-info-content">
      <div class="info-wrapper">
        <!-- 基本状态信息网格 -->
        <div class="basic-info-grid">
          <div class="info-item">
            <span class="label">管段名称</span>
            <span class="value">{{ currentPipelineData.name }}</span>
          </div>
          <div class="info-item">
            <span class="label">输运状态</span>
            <span class="value" :class="getStatusClass(displayStatus)">
              {{ displayStatus }}
            </span>
          </div>
          <div class="info-item">
            <span class="label">阀位点数</span>
            <span class="value normal">{{ currentPipelineData.valvePoints }}</span>
          </div>
          <div class="info-item">
            <span class="label">停输时长</span>
            <span class="value normal">{{ displayStopDuration }}</span>
          </div>
          <div class="info-item">
            <span class="label">输运油品</span>
            <span class="value normal">{{ currentPipelineData.oilType }}</span>
          </div>
          <div class="info-item">
            <span class="label">油品密度</span>
            <span class="value normal">{{ currentPipelineData.oilDensity }}</span>
          </div>
          <div class="info-item">
            <span class="label">站间高差</span>
            <span class="value normal">{{ currentPipelineData.heightDiff }}</span>
          </div>
          <div class="info-item">
            <span class="label">输送方向</span>
            <span class="value normal">{{ currentPipelineData.direction }}</span>
          </div>
          <div class="info-item">
            <span class="label">所属管线</span>
            <span class="value normal">{{ currentPipelineData.line }}</span>
          </div>
        </div>

        <!-- 实时数据显示（仅黄埔-东莞管段） -->
        <div v-if="selectedPipeline === 'pipeline1' && realtimeData" class="realtime-section">
          <div class="section-title">实时数据状态</div>
          <div class="realtime-grid">
            <div class="realtime-item">
              <span class="label">数据时间</span>
              <span class="value">{{ formatTime(realtimeData.time) }}</span>
            </div>
            <div class="realtime-item">
              <span class="label">季节信息</span>
              <span class="value">{{ realtimeData.season_info }}</span>
            </div>
            <div class="realtime-item">
              <span class="label">连接状态</span>
              <span class="value" :class="connectionStatus === 'connected' ? 'normal' : 'warning'">
                {{ connectionStatus === 'connected' ? '已连接' : '断开连接' }}
              </span>
            </div>
          </div>
        </div>

        <!-- 压力信息网格 -->
        <div class="pressure-info-section">
          <div class="pressure-card">
            <div class="card-title">{{ currentPipelineData.startStation.name }}</div>
            <div class="pressure-items">
              <div class="info-item">
                <span class="label">最高进站压力</span>
                <span class="value">{{ currentPipelineData.startStation.maxPressure }}</span>
              </div>
              <div class="info-item">
                <span class="label">最低进站压力</span>
                <span class="value">{{ currentPipelineData.startStation.minPressure }}</span>
              </div>
            </div>
          </div>
          <div class="pressure-card">
            <div class="card-title">{{ currentPipelineData.endStation.name }}</div>
            <div class="pressure-items">
              <div class="info-item">
                <span class="label">最高进站压力</span>
                <span class="value">{{ currentPipelineData.endStation.maxPressure }}</span>
              </div>
              <div class="info-item">
                <span class="label">最低进站压力</span>
                <span class="value">{{ currentPipelineData.endStation.minPressure }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 更多信息按钮 -->
        <div class="action-section">
          <el-button 
            type="text" 
            class="detail-btn" 
            @click="showDetailDialog">
            查看更多信息 >>
          </el-button>
        </div>
      </div>
    </div>

    <!-- 详细信息弹窗 -->
    <el-dialog 
      title="管段详细信息" 
      :visible.sync="dialogVisible" 
      width="40%" 
      
      custom-class="info-dialog"
      :modal-append-to-body="false" 
      :append-to-body="true"
      :close-on-click-modal="false">
      <div class="dialog-content">
        <!-- 基本信息部分 -->
        <div class="detail-section">
          <h3 class="section-title">基本信息</h3>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="item-label">管道长度：</span>
              <span class="item-value">{{ currentPipelineData.details.length }}</span>
            </div>
            <div class="detail-item">
              <span class="item-label">最大年输量：</span>
              <span class="item-value">{{ currentPipelineData.details.maxYearThroughput }}</span>
            </div>
            <div class="detail-item">
              <span class="item-label">最小年输量：</span>
              <span class="item-value">{{ currentPipelineData.details.minYearThroughput }}</span>
            </div>
            <div class="detail-item">
              <span class="item-label">站场编号：</span>
              <span class="item-value">{{ currentPipelineData.details.stationCode }}</span>
            </div>
            <div class="detail-item">
              <span class="item-label">管道直径：</span>
              <span class="item-value">{{ currentPipelineData.details.diameter }}</span>
            </div>
            <div class="detail-item">
              <span class="item-label">壁厚：</span>
              <span class="item-value">{{ currentPipelineData.details.thickness }}</span>
            </div>
            <div class="detail-item">
              <span class="item-label">设计压力：</span>
              <span class="item-value">{{ currentPipelineData.details.designPressure }}</span>
            </div>
            <div class="detail-item">
              <span class="item-label">管道材质：</span>
              <span class="item-value">{{ currentPipelineData.details.material }}</span>
            </div>
          </div>
        </div>

        <!-- 运行参数部分 -->
        <div class="detail-section">
          <h3 class="section-title">运行参数</h3>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="item-label">运行方式：</span>
              <span class="item-value">{{ currentPipelineData.details.operationMode }}</span>
            </div>
            <div class="detail-item">
              <span class="item-label">最高进站压力：</span>
              <span class="item-value">{{ currentPipelineData.details.maxInPressure }}</span>
            </div>
            <div class="detail-item">
              <span class="item-label">最低进站压力：</span>
              <span class="item-value">{{ currentPipelineData.details.minInPressure }}</span>
            </div>
            <div class="detail-item">
              <span class="item-label">最高出站压力：</span>
              <span class="item-value">{{ currentPipelineData.details.maxOutPressure }}</span>
            </div>
            <div class="detail-item">
              <span class="item-label">环境温度：</span>
              <span class="item-value">{{ currentPipelineData.details.envTemp }}</span>
            </div>
            <div class="detail-item">
              <span class="item-label">介质温度：</span>
              <span class="item-value">{{ currentPipelineData.details.mediumTemp }}</span>
            </div>
            <div class="detail-item">
              <span class="item-label">流量：</span>
              <span class="item-value">{{ currentPipelineData.details.flow }}</span>
            </div>
            <div class="detail-item">
              <span class="item-label">运行状态：</span>
              <span class="item-value" :class="getStatusClass(displayStatus, true)">
                {{ displayStatus }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDetailDialog">关闭</el-button>
        <el-button type="primary" @click="closeDetailDialog">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { pipelineData } from '@/data/pipelineData'

export default {
  name: 'PipelineStatusComponent',
  data() {
    return {
      // 当前选中的管段
      selectedPipeline: 'pipeline1',
      
      // 管段选项
      pipelineOptions: [
        { value: 'pipeline1', label: '黄埔 至 东莞' },
        { value: 'pipeline2', label: '阳江 至 恩平' },
        { value: 'pipeline3', label: '恩平 至 鹤山' }
      ],
      
      // 管段数据
      pipelineData: pipelineData,
      
      // 弹窗显示状态
      dialogVisible: false,

      // WebSocket连接
      ws: null,
      
      // 实时数据
      realtimeData: null,
      
      // 连接状态
      connectionStatus: 'disconnected',
      
      // 停输开始时间（用于计算停输时长）
      stopStartTime: null,
      
      // 定时器
      durationTimer: null
    }
  },
  
  computed: {
    // 当前管段数据
    currentPipelineData() {
      return this.pipelineData[this.selectedPipeline];
    },
    
    // 当前管段标签
    currentPipelineLabel() {
      const option = this.pipelineOptions.find(item => item.value === this.selectedPipeline);
      return option ? option.label : '';
    },

    // 显示的输运状态
    displayStatus() {
      // 如果是黄埔-东莞管段且有实时数据，使用实时状态
      if (this.selectedPipeline === 'pipeline1' && this.realtimeData && this.realtimeData.state) {
        return this.realtimeData.state === 'Run' ? '运行中' : '停输中';
      }
      // 否则使用静态数据
      return this.currentPipelineData.status;
    },

    // 显示的停输时长
    displayStopDuration() {
      // 如果是黄埔-东莞管段且有实时数据
      if (this.selectedPipeline === 'pipeline1' && this.realtimeData) {
        if (this.realtimeData.state === 'Run') {
          return '0h';
        } else if (this.stopStartTime) {
          // 计算实际停输时长
          const now = new Date();
          const duration = Math.floor((now - this.stopStartTime) / (1000 * 60 * 60));
          return `${duration}h`;
        }
      }
      // 否则使用静态数据
      return this.currentPipelineData.stopDuration;
    }
  },

  mounted() {
    this.connectWebSocket();
  },

  beforeDestroy() {
    this.closeWebSocket();
    if (this.durationTimer) {
      clearInterval(this.durationTimer);
    }
  },
  
  methods: {
    // 连接WebSocket
    connectWebSocket() {
      try {
        this.ws = new WebSocket('ws://127.0.0.1:3092');
        
        this.ws.onopen = () => {
          console.log('管段状态WebSocket连接成功');
          this.connectionStatus = 'connected';
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            // console.log('收到管段状态数据:', data);
            
            // 保存之前的状态
            const previousState = this.realtimeData ? this.realtimeData.state : null;
            
            // 更新实时数据
            this.realtimeData = data;
            
            // 监控状态变化
            if (data.state && previousState !== data.state) {
              if (data.state !== 'Run' && previousState === 'Run') {
                // 从运行切换到停输，记录停输开始时间
                this.stopStartTime = new Date();
                console.log('管段开始停输');
              } else if (data.state === 'Run' && previousState !== 'Run') {
                // 从停输切换到运行，清除停输开始时间
                this.stopStartTime = null;
                console.log('管段恢复运行');
              }
            }
            
            // 如果当前状态是停输且没有停输开始时间，设置为当前时间
            if (data.state !== 'Run' && !this.stopStartTime) {
              this.stopStartTime = new Date();
            }
            
          } catch (error) {
            console.error('解析管段状态数据失败:', error);
          }
        };

        this.ws.onclose = () => {
          console.log('管段状态WebSocket连接关闭');
          this.connectionStatus = 'disconnected';
          // 5秒后尝试重连
          setTimeout(() => {
            if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
              this.connectWebSocket();
            }
          }, 5000);
        };

        this.ws.onerror = (error) => {
          console.error('管段状态WebSocket连接错误:', error);
          this.connectionStatus = 'disconnected';
        };

      } catch (error) {
        console.error('创建管段状态WebSocket连接失败:', error);
        this.connectionStatus = 'disconnected';
      }
    },

    // 关闭WebSocket连接
    closeWebSocket() {
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }
    },

    // 格式化时间戳
    formatTime(timestamp) {
      if (!timestamp) return '--';
      const date = new Date(timestamp * 1000);
      return date.toLocaleString('zh-CN');
    },

    // 处理管段选择变化
    handlePipelineChange(value) {
      this.selectedPipeline = value;
      this.$emit('pipeline-changed', value);
    },
    
    // 获取状态样式类
    getStatusClass(status, isDialog = false) {
      const isNormal = status === '运行中';
      if (isDialog) {
        return isNormal ? 'status-normal' : 'status-warning';
      }
      return isNormal ? 'normal' : 'warning';
    },
    
    // 显示详细信息弹窗
    showDetailDialog() {
      this.dialogVisible = true;
    },
    
    // 关闭详细信息弹窗
    closeDetailDialog() {
      this.dialogVisible = false;
    }
  }
}
</script>

<style>
/* 主容器样式 */
.pipeline-status-container {
  width: 100%;
  height: 550px;
  position: relative;
  background: rgba(0, 21, 41, 0.8);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 组件头部样式 */
.component-header {
  position: relative;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(102, 223, 251, 0.3);
}

.header-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.corner-tl, .corner-tr, .corner-bl, .corner-br {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid #66dffb;
}

.corner-tl {
  top: 5px;
  left: 5px;
  border-right: none;
  border-bottom: none;
}

.corner-tr {
  top: 5px;
  right: 5px;
  border-left: none;
  border-bottom: none;
}

.corner-bl {
  bottom: 5px;
  left: 5px;
  border-right: none;
  border-top: none;
}

.corner-br {
  bottom: 5px;
  right: 5px;
  border-left: none;
  border-top: none;
}

.title-wrapper {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.title-bracket {
  color: #66dffb;
  font-size: 1.5rem;
  font-weight: bold;
}

.title-text {
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 500;
  letter-spacing: 2px;
}

/* 管段选择器样式 */
.pipeline-selector {
  padding: 15px;
  display: flex;
  justify-content: center;
}

.select-wrapper {
  width: 95%;
  max-width: 400px;
}

.select-container {
  position: relative;
  background: rgba(2, 32, 71, 0.9);
  border: 1px solid #66dffb;
  border-radius: 6px;
  height: 40px;
  box-shadow: 0 0 15px rgba(102, 223, 251, 0.3);
  transition: all 0.3s ease;
}

.select-container:hover {
  box-shadow: 0 0 20px rgba(102, 223, 251, 0.5);
  border-color: #8eecff;
}

.select-display {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 15px;
  letter-spacing: 1px;
  pointer-events: none;
}

.hidden-select {
  width: 100%;
  height: 100%;
  opacity: 0;
}

.hidden-select ::v-deep .el-input__inner {
  opacity: 0;
}

.select-arrow {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #66dffb;
  pointer-events: none;
  transition: transform 0.3s ease;
}

.select-container:hover .select-arrow {
  transform: translateY(-50%) scale(1.1);
}

/* 状态信息内容样式 */
.status-info-content {
  flex: 1;
  padding: 10px 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.info-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-height: 0;
}

/* 基本信息网格样式 */
.basic-info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  flex-shrink: 0;
}

.info-item {
  display: flex;
  flex-direction: column;
  background: rgba(0, 21, 41, 0.4);
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid rgba(102, 223, 251, 0.1);
  transition: all 0.3s ease;
}

.info-item:hover {
  background: rgba(0, 21, 41, 0.6);
  border-color: rgba(102, 223, 251, 0.3);
  transform: translateY(-2px);
}

.info-item .label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  margin-bottom: 6px;
  font-weight: 400;
}

.info-item .value {
  color: #66dffb;
  font-size: 15px;
  font-weight: 600;
}

.info-item .value.normal {
  color: #52c41a;
}

.info-item .value.warning {
  color: #faad14;
}

/* 压力信息部分样式 */
.pressure-info-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 10px;
  flex-shrink: 0;
}

.pressure-card {
  background: rgba(24, 144, 255, 0.08);
  border-radius: 8px;
  padding: 15px;
  border: 1px solid rgba(24, 144, 255, 0.2);
  transition: all 0.3s ease;
}

.pressure-card:hover {
  background: rgba(24, 144, 255, 0.12);
  border-color: rgba(24, 144, 255, 0.4);
  transform: translateY(-2px);
}

.card-title {
  color: #1890ff;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  text-align: center;
  border-bottom: 1px solid rgba(24, 144, 255, 0.3);
  padding-bottom: 8px;
}

.pressure-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 操作按钮部分样式 */
.action-section {
  text-align: center;
  margin-top: auto;
  padding: 15px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
  background: rgba(0, 21, 41, 0.2);
}

.detail-btn {
  color: #66dffb !important;
  font-size: 14px;
  text-decoration: underline;
  background: none !important;
  border: none !important;
  padding: 0 !important;
  transition: all 0.3s ease;
}

.detail-btn:hover {
  color: #8eecff !important;
  transform: translateY(-2px);
}

/* 通用按钮样式 */
.el-button {
  background-color: #093e79;
  border-color: #66dffb;
  color: #66dffb;
  transition: all 0.3s ease;
}

.el-button:hover {
  background-color: #0d4b8f;
  border-color: #8eecff;
  color: #8eecff;
}

.el-button--primary {
  background-color: #1890ff;
  border-color: #1890ff;
  color: white;
}

.el-button--primary:hover {
  background-color: #40a9ff;
  border-color: #40a9ff;
}

/* 弹窗样式 - 与ovl.vue保持一致 */
.info-dialog .el-dialog {
  background-color: rgba(0, 21, 41, 0.9) !important;
  border: 1px solid rgba(24, 144, 255, 0.3) !important;
  border-radius: 4px !important;
  box-shadow: 0 0 20px rgba(0, 150, 255, 0.3) !important;
}

.info-dialog .el-dialog__header {
  background: linear-gradient(to right, #001529, #002140) !important;
  padding: 15px 20px !important;
  border-bottom: 1px solid rgba(24, 144, 255, 0.3) !important;
}

.info-dialog .el-dialog__title {
  color: #1890ff !important;
  font-size: 16px !important;
  font-weight: bold !important;
}

.info-dialog .el-dialog__headerbtn .el-dialog__close {
  color: #1890ff !important;
}

.info-dialog .el-dialog__body {
  color: #fff !important;
  padding: 20px !important;
  background: rgba(0, 21, 41, 0.9) !important;
}

.dialog-content {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.detail-section {
  background: rgba(0, 21, 41, 0.6);
  border-radius: 8px;
  padding: 20px;
  border: 1px solid rgba(24, 144, 255, 0.2);
}

.section-title {
  color: #1890ff;
  margin-bottom: 20px;
  font-size: 1.4rem;
  font-weight: 500;
  border-bottom: 1px solid rgba(24, 144, 255, 0.2);
  padding-bottom: 10px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: rgba(0, 21, 41, 0.4);
  border: 1px solid rgba(24, 144, 255, 0.1);
  border-radius: 4px;
}

.item-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.item-value {
  color: #1890ff;
  font-size: 0.9rem;
  font-weight: 500;
}

.status-normal {
  color: #52c41a !important;
}

.status-warning {
  color: #faad14 !important;
}

/* 实时数据部分样式 */
.realtime-section {
  background: rgba(24, 144, 255, 0.08);
  border-radius: 8px;
  padding: 15px;
  border: 1px solid rgba(24, 144, 255, 0.2);
  margin-top: 15px;
}

.realtime-section .section-title {
  color: #1890ff;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  text-align: center;
  border-bottom: 1px solid rgba(24, 144, 255, 0.3);
  padding-bottom: 8px;
}

.realtime-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.realtime-item {
  display: flex;
  flex-direction: column;
  background: rgba(0, 21, 41, 0.4);
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid rgba(24, 144, 255, 0.2);
  transition: all 0.3s ease;
}

.realtime-item:hover {
  background: rgba(0, 21, 41, 0.6);
  border-color: rgba(24, 144, 255, 0.4);
  transform: translateY(-2px);
}

.realtime-item .label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  margin-bottom: 6px;
  font-weight: 400;
}

.realtime-item .value {
  color: #1890ff;
  font-size: 15px;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .basic-info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .realtime-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .basic-info-grid {
    grid-template-columns: 1fr;
  }
  
  .realtime-grid {
    grid-template-columns: 1fr;
  }
  
  .pressure-info-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .pipeline-selector {
    padding: 10px;
  }
}

.info-dialog .el-dialog__footer {
  background: rgba(0, 21, 41, 0.9) !important;
  padding: 10px 20px !important;
  border-top: 1px solid rgba(24, 144, 255, 0.3) !important;
}

/* 按钮样式 */
.info-dialog .el-button {
  background-color: transparent !important;
  border-color: #1890ff !important;
  color: #1890ff !important;
  font-size: 1.1rem !important;
  padding: 10px 24px !important;
  border-radius: 4px !important;
}

.info-dialog .el-button:hover {
  background-color: rgba(24, 144, 255, 0.1) !important;
  border-color: #40a9ff !important;
  color: #40a9ff !important;
}

.info-dialog .el-button--primary {
  background-color: #1890ff !important;
  border-color: #1890ff !important;
  color: #fff !important;
}

.info-dialog .el-button--primary:hover {
  background-color: #40a9ff !important;
  border-color: #40a9ff !important;
}

/* 全局弹窗蒙层样式 */
.el-dialog__wrapper {
  background-color: rgba(0, 0, 0, 0.2) !important;
}

.v-modal {
  opacity: 0.2 !important;
  background-color: #000 !important;
}

</style> 