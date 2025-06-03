<template>
  <div class="pipeline-status-container">
    <!-- 组件标题 -->
    <div class="component-header">
      <div class="header-decoration">
        <i class="corner-tl"></i>
        <i class="corner-tr"></i>
        <i class="corner-bl"></i>
        <i class="corner-br"></i>
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
            <span class="value" :class="getStatusClass(currentPipelineData.status)">
              {{ currentPipelineData.status }}
            </span>
          </div>
          <div class="info-item">
            <span class="label">阀位点数</span>
            <span class="value normal">{{ currentPipelineData.valvePoints }}</span>
          </div>
          <div class="info-item">
            <span class="label">停输时长</span>
            <span class="value normal">{{ currentPipelineData.stopDuration }}</span>
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
      width="60%" 
      custom-class="detail-dialog"
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
              <span class="item-value" :class="getStatusClass(currentPipelineData.status, true)">
                {{ currentPipelineData.status }}
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
      selectedPipeline: 'pipeline3',
      
      // 管段选项
      pipelineOptions: [
        { value: 'pipeline1', label: '黄埔 至 东莞' },
        { value: 'pipeline2', label: '阳江 至 恩平' },
        { value: 'pipeline3', label: '恩平 至 鹤山' }
      ],
      
      // 管段数据
      pipelineData: pipelineData,
      
      // 弹窗显示状态
      dialogVisible: false
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
    }
  },
  
  methods: {
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

<style scoped>
/* 主容器样式 */
.pipeline-status-container {
  width: 100%;
  height: 550px;
  position: relative;
  background: rgba(0, 21, 41, 0.8);
  border-radius: 8px;
  overflow: hidden;
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
}

.info-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 基本信息网格样式 */
.basic-info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
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
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
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

/* 弹窗样式 */
.detail-dialog ::v-deep .el-dialog {
  background: linear-gradient(135deg, #001529, #002140);
  border: 1px solid #1890ff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.detail-dialog ::v-deep .el-dialog__header {
  background: linear-gradient(135deg, #001529, #001f3f);
  padding: 25px;
  border-bottom: 1px solid rgba(24, 144, 255, 0.3);
}

.detail-dialog ::v-deep .el-dialog__title {
  color: #1890ff;
  font-size: 1.8rem;
  font-weight: 600;
  text-align: center;
}

.detail-dialog ::v-deep .el-dialog__body {
  padding: 30px;
  background: linear-gradient(135deg, #001529, #002140);
}

.dialog-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.detail-section {
  background: rgba(0, 21, 41, 0.6);
  border-radius: 10px;
  padding: 25px;
  border: 1px solid rgba(24, 144, 255, 0.2);
}

.section-title {
  color: #1890ff;
  margin-bottom: 20px;
  font-size: 1.4rem;
  font-weight: 600;
  border-bottom: 2px solid rgba(24, 144, 255, 0.3);
  padding-bottom: 10px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-label {
  color: rgba(255, 255, 255, 0.85);
  font-size: 1.1rem;
  min-width: 100px;
}

.item-value {
  color: #1890ff;
  font-size: 1.1rem;
  font-weight: 500;
}

.status-normal {
  color: #52c41a !important;
}

.status-warning {
  color: #faad14 !important;
}

.detail-dialog ::v-deep .el-dialog__footer {
  background: linear-gradient(135deg, #001529, #001f3f);
  padding: 20px 25px;
  border-top: 1px solid rgba(24, 144, 255, 0.3);
  text-align: center;
}

.detail-dialog ::v-deep .el-button {
  font-size: 1.1rem;
  padding: 12px 28px;
  border-radius: 6px;
  margin: 0 10px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .basic-info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .detail-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .basic-info-grid {
    grid-template-columns: 1fr;
  }
  
  .pressure-info-section {
    grid-template-columns: 1fr;
  }
  
  .detail-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style> 