<template>
  <div>
    <span class="wgrytj_bt" style="font-size:1.2rem;padding: 0;">高点汽化风险监测</span>
    <div class="pipeline-monitoring">
      <!-- 阀室状态卡片 -->
      <div class="valve-cards" >
        <div class="valve-card danger" @click="showValveDetails('阀室#1')">
          <div class="valve-icon">
            <i class="el-icon-warning"></i>
          </div>
          <div class="valve-info">
            <div class="valve-name">阀室#1</div>
            <div class="valve-position">K125+600</div>
            <div class="valve-elevation">高程: 13.7m</div>
          </div>
          <div class="valve-status">
            <div class="status-label">高风险</div>
            <div class="countdown">{{ formattedCountdowns['阀室#1'] }}</div>
            <div class="countdown-label">预计汽化</div>
          </div>
        </div>
        
        <div class="valve-card warning" @click="showValveDetails('阀室#2')">
          <div class="valve-icon">
            <i class="el-icon-warning-outline"></i>
          </div>
          <div class="valve-info">
            <div class="valve-name">阀室#2</div>
            <div class="valve-position">K118+350</div>
            <div class="valve-elevation">高程: 10.2m</div>
          </div>
          <div class="valve-status">
            <div class="status-label">中风险</div>
            <div class="countdown">{{ formattedCountdowns['阀室#2'] }}</div>
            <div class="countdown-label">预计临界</div>
          </div>
        </div>
        
        <div class="valve-card normal" @click="showValveDetails('阀室#3')">
          <div class="valve-icon">
            <i class="el-icon-success"></i>
          </div>
          <div class="valve-info">
            <div class="valve-name">阀室#3</div>
            <div class="valve-position">K112+800</div>
            <div class="valve-elevation">高程: 9.5m</div>
          </div>
          <div class="valve-status">
            <div class="status-label">正常</div>
          </div>
        </div>
        
        <div class="valve-card normal" @click="showValveDetails('阀室#4')">
          <div class="valve-icon">
            <i class="el-icon-success"></i>
          </div>
          <div class="valve-info">
            <div class="valve-name">阀室#4</div>
            <div class="valve-position">K108+450</div>
            <div class="valve-elevation">高程: 8.3m</div>
          </div>
          <div class="valve-status">
            <div class="status-label">正常</div>
          </div>
        </div>
        
        <div class="valve-card normal" @click="showValveDetails('阀室#5')">
          <div class="valve-icon">
            <i class="el-icon-success"></i>
          </div>
          <div class="valve-info">
            <div class="valve-name">阀室#5</div>
            <div class="valve-position">K102+150</div>
            <div class="valve-elevation">高程: 7.8m</div>
          </div>
          <div class="valve-status">
            <div class="status-label">正常</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 阀室详情弹窗 -->
    <el-dialog
      title="阀室详情"
      :visible.sync="valveDetailVisible"
      width="50%"
      custom-class="valve-detail-dialog"
      :modal-append-to-body="false"
      :append-to-body="true"
      :close-on-click-modal="false"
      :modal="false"
      :lock-scroll="false"
    >
      <div class="valve-detail-content" v-if="selectedValve">
        <div class="valve-detail-header">
          <div class="valve-detail-title">{{ selectedValve }} 运行状态详情</div>
          <div class="valve-detail-status" :class="selectedValve === '阀室#1' ? 'danger' : selectedValve === '阀室#2' ? 'warning' : 'normal'">
            {{ selectedValve === '阀室#1' ? '高风险' : selectedValve === '阀室#2' ? '中风险' : '正常' }}
          </div>
        </div>
        <div class="valve-detail-body">
          <div class="valve-detail-info">
            <div class="info-section">
              <h3>位置信息</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">公里标：</span>
                  <span class="value">{{ selectedValve === '阀室#1' ? 'K125+600' : selectedValve === '阀室#2' ? 'K118+350' : 'K112+800' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">高程：</span>
                  <span class="value">{{ selectedValve === '阀室#1' ? '13.7m' : selectedValve === '阀室#2' ? '10.2m' : '9.5m' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">地理位置：</span>
                  <span class="value">{{ selectedValve === '阀室#1' ? '东经119°12′45″, 北纬39°08′22″' : selectedValve === '阀室#2' ? '东经119°10′38″, 北纬39°07′15″' : '东经119°08′12″, 北纬39°06′53″' }}</span>
                </div>
              </div>
            </div>
            <div class="info-section">
              <h3>运行参数</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">当前压力：</span>
                  <span class="value">{{ selectedValve === '阀室#1' ? '1.85 MPa' : selectedValve === '阀室#2' ? '2.05 MPa' : '2.35 MPa' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">临界压力：</span>
                  <span class="value">1.75 MPa</span>
                </div>
                <div class="info-item">
                  <span class="label">当前温度：</span>
                  <span class="value">{{ selectedValve === '阀室#1' ? '26 ℃' : selectedValve === '阀室#2' ? '25 ℃' : '24 ℃' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">压力变化：</span>
                  <span class="value" :class="selectedValve === '阀室#1' ? 'danger' : selectedValve === '阀室#2' ? 'warning' : 'normal'">
                    {{ selectedValve === '阀室#1' ? '-0.05 MPa/h' : selectedValve === '阀室#2' ? '-0.02 MPa/h' : '-0.01 MPa/h' }}
                  </span>
                </div>
              </div>
            </div>
            <div class="info-section" v-if="selectedValve === '阀室#1' || selectedValve === '阀室#2'">
              <h3>预警信息</h3>
              <div class="warning-info">
                <div class="warning-icon">
                  <i :class="selectedValve === '阀室#1' ? 'el-icon-error' : 'el-icon-warning'"></i>
                </div>
                <div class="warning-content">
                  <div class="warning-title">{{ selectedValve === '阀室#1' ? '高点汽化高风险预警' : '高点汽化中风险预警' }}</div>
                  <div class="warning-desc">
                    {{ selectedValve === '阀室#1' ? 
                    `当前压力接近临界压力，预计${formattedCountdowns['阀室#1']}后达到汽化条件，请立即采取措施！` : 
                    `压力下降速率较快，预计${formattedCountdowns['阀室#2']}后达到预警阈值，请密切关注！` }}
                  </div>
                </div>
              </div>
              
              <!-- 添加醒目的倒计时显示 -->
              <div class="countdown-container">
                <div class="countdown-title">{{ selectedValve === '阀室#1' ? '距离汽化还剩' : '距离临界还剩' }}</div>
                <div class="countdown-box" :class="selectedValve === '阀室#1' ? 'danger' : 'warning'">
                  <div class="countdown-display">
                    <span class="countdown">{{ selectedValve === '阀室#1' ? formattedCountdowns['阀室#1'] : formattedCountdowns['阀室#2'] }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="action-buttons">
            <el-button type="primary" icon="el-icon-view">查看历史</el-button>
            <el-button type="warning" icon="el-icon-bell" @click="showAlarmDialog">设置警报</el-button>
            <el-button v-if="selectedValve === '阀室#1'" type="danger" icon="el-icon-warning-outline">应急处置</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    
    <!-- 警报启动弹窗 -->
    <el-dialog
      title="启动警报"
      :visible.sync="alarmDialogVisible"
      width="45%"
      custom-class="alarm-detail-dialog"
      :modal-append-to-body="false"
      :append-to-body="true"
      :close-on-click-modal="false"
      :modal="false"
      :lock-scroll="false"
    >
      <div class="valve-detail-content">
        <div class="valve-detail-header">
          <div class="valve-detail-title">管段高点汽化风险警报</div>
          <div class="valve-detail-status danger">高风险</div>
        </div>
        <div class="valve-detail-body">
          <div class="valve-detail-info">
            <div class="info-section">
              <h3>警报详情</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">风险级别：</span>
                  <span class="value danger">高风险</span>
                </div>
                <div class="info-item">
                  <span class="label">风险点：</span>
                  <span class="value">阀室#1 (K125+600)</span>
                </div>
                <div class="info-item">
                  <span class="label">预警时间：</span>
                  <span class="value">{{ new Date().toLocaleString() }}</span>
                </div>
                <div class="info-item">
                  <span class="label">预计汽化时间：</span>
                  <span class="value danger">{{ formattedCountdowns['阀室#1'] }}</span>
                </div>
              </div>
            </div>

            <div class="info-section">
              <h3>警报等级设置</h3>
              <div class="alarm-level-grid">
                <div class="level-option" :class="{ active: selectedAlarmLevel === 'low' }" @click="selectedAlarmLevel = 'low'">
                  <div class="level-icon">
                    <div class="level-dot low"></div>
                  </div>
                  <div class="level-content">
                    <div class="level-title">低级警报</div>
                    <div class="level-desc">仅通知操作人员</div>
                  </div>
                </div>
                <div class="level-option" :class="{ active: selectedAlarmLevel === 'medium' }" @click="selectedAlarmLevel = 'medium'">
                  <div class="level-icon">
                    <div class="level-dot medium"></div>
                  </div>
                  <div class="level-content">
                    <div class="level-title">中级警报</div>
                    <div class="level-desc">通知操作人员和站长</div>
                  </div>
                </div>
                <div class="level-option" :class="{ active: selectedAlarmLevel === 'high' }" @click="selectedAlarmLevel = 'high'">
                  <div class="level-icon">
                    <div class="level-dot high"></div>
                  </div>
                  <div class="level-content">
                    <div class="level-title">高级警报</div>
                    <div class="level-desc">通知全站人员和应急小组</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="action-buttons">
            <el-button @click="alarmDialogVisible = false" icon="el-icon-close">取消</el-button>
            <el-button type="danger" @click="triggerAlarm" icon="el-icon-warning-outline">确认启动警报</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { valveRoomApi } from '@/api/valveRoom'

export default {
  name: 'VaporizationWarning',
  data() {
    return {
      valveDetailVisible: false,
      selectedValve: null,
      valveRooms: [], // 从数据库获取的阀室数据
      valveRoomDetails: {}, // 阀室详细信息缓存
      realTimeData: {}, // 实时数据
      countdowns: {
        '阀室#1': {
          minutes: 12,
          seconds: 30
        },
        '阀室#2': {
          minutes: 35,
          seconds: 45
        }
      },
      countdownTimer: null,
      dataUpdateTimer: null, // 数据更新定时器
      alarmDialogVisible: false,
      selectedAlarmLevel: 'low',
      notificationMethods: {
        sms: false,
        email: false,
        app: false,
        phone: false
      },
      loading: false
    }
  },
  computed: {
    formattedCountdowns() {
      return {
        '阀室#1': `${this.countdowns['阀室#1'].minutes.toString().padStart(2, '0')}:${this.countdowns['阀室#1'].seconds.toString().padStart(2, '0')}`,
        '阀室#2': `${this.countdowns['阀室#2'].minutes.toString().padStart(2, '0')}:${this.countdowns['阀室#2'].seconds.toString().padStart(2, '0')}`
      }
    }
  },
  async mounted() {
    this.startCountdown();
    await this.loadValveRoomData();
    this.startDataUpdate();
  },
  beforeDestroy() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
    if (this.dataUpdateTimer) {
      clearInterval(this.dataUpdateTimer);
    }
  },
  methods: {
    // 加载阀室数据
    async loadValveRoomData() {
      try {
        this.loading = true;
        // 获取所有阀室数据
        const response = await valveRoomApi.getAllValveRooms();
        this.valveRooms = response.data || [];
        
        // 获取风险预警数据
        const warningResponse = await valveRoomApi.getRiskWarnings();
        this.updateRiskStatus(warningResponse.data || []);
        
      } catch (error) {
        console.error('加载阀室数据失败:', error);
        this.$message.error('数据加载失败，使用模拟数据');
        // 使用模拟数据作为降级方案
        this.useSimulatedData();
      } finally {
        this.loading = false;
      }
    },

    // 更新风险状态
    updateRiskStatus(warnings) {
      warnings.forEach(warning => {
        if (warning.riskLevel === 'high') {
          this.countdowns[warning.valveRoomName] = {
            minutes: Math.floor(warning.timeToVaporization / 60),
            seconds: warning.timeToVaporization % 60
          };
        }
      });
    },

    // 使用模拟数据
    useSimulatedData() {
      this.valveRooms = [
        { id: 1, name: '阀室#1', position: 'K125+600', elevation: 13.7, status: 'danger' },
        { id: 2, name: '阀室#2', position: 'K118+350', elevation: 10.2, status: 'warning' },
        { id: 3, name: '阀室#3', position: 'K112+800', elevation: 9.5, status: 'normal' },
        { id: 4, name: '阀室#4', position: 'K108+450', elevation: 8.3, status: 'normal' },
        { id: 5, name: '阀室#5', position: 'K102+150', elevation: 7.8, status: 'normal' }
      ];
    },

    // 开始数据实时更新
    startDataUpdate() {
      this.dataUpdateTimer = setInterval(async () => {
        await this.updateRealTimeData();
      }, 30000); // 每30秒更新一次实时数据
    },

    // 更新实时数据
    async updateRealTimeData() {
      try {
        for (const valveRoom of this.valveRooms) {
          const realTimeData = await valveRoomApi.getValveRoomRealTimeData(valveRoom.id);
          this.$set(this.realTimeData, valveRoom.name, realTimeData.data);
        }
      } catch (error) {
        console.error('实时数据更新失败:', error);
      }
    },

    async showValveDetails(valveName) {
      this.selectedValve = valveName;
      
      // 获取阀室详细信息
      if (!this.valveRoomDetails[valveName]) {
        try {
          const valveRoom = this.valveRooms.find(v => v.name === valveName);
          if (valveRoom) {
            const response = await valveRoomApi.getValveRoomDetail(valveRoom.id);
            this.$set(this.valveRoomDetails, valveName, response.data);
          }
        } catch (error) {
          console.error('获取阀室详情失败:', error);
        }
      }
      
      this.$nextTick(() => {
        this.valveDetailVisible = true;
      });
    },
    startCountdown() {
      this.countdownTimer = setInterval(() => {
        // 更新阀室#1倒计时
        if (this.countdowns['阀室#1'].seconds > 0) {
          this.countdowns['阀室#1'].seconds--;
        } else if (this.countdowns['阀室#1'].minutes > 0) {
          this.countdowns['阀室#1'].minutes--;
          this.countdowns['阀室#1'].seconds = 59;
        }
        
        // 更新阀室#2倒计时
        if (this.countdowns['阀室#2'].seconds > 0) {
          this.countdowns['阀室#2'].seconds--;
        } else if (this.countdowns['阀室#2'].minutes > 0) {
          this.countdowns['阀室#2'].minutes--;
          this.countdowns['阀室#2'].seconds = 59;
        }
      }, 1000);
    },
    showAlarmDialog() {
      this.alarmDialogVisible = true;
      this.valveDetailVisible = false;
    },
    async triggerAlarm() {
      try {
        const valveRoom = this.valveRooms.find(v => v.name === this.selectedValve);
        if (valveRoom) {
          const alarmConfig = {
            level: this.selectedAlarmLevel,
            valveRoomId: valveRoom.id,
            notificationMethods: this.notificationMethods,
            timestamp: new Date().toISOString()
          };
          
          await valveRoomApi.setAlarm(valveRoom.id, alarmConfig);
          
          this.$message({
            message: `已启动${this.selectedAlarmLevel === 'low' ? '低' : this.selectedAlarmLevel === 'medium' ? '中' : '高'}级警报`,
            type: 'success'
          });
        }
      } catch (error) {
        console.error('设置警报失败:', error);
        this.$message.error('警报设置失败');
      } finally {
        this.alarmDialogVisible = false;
      }
    },

    // 查看历史数据
    async viewHistory() {
      try {
        const valveRoom = this.valveRooms.find(v => v.name === this.selectedValve);
        if (valveRoom) {
          const params = {
            startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7天前
            endTime: new Date().toISOString()
          };
          const response = await valveRoomApi.getValveRoomHistory(valveRoom.id, params);
          // 处理历史数据展示逻辑
          console.log('历史数据:', response.data);
        }
      } catch (error) {
        console.error('获取历史数据失败:', error);
        this.$message.error('历史数据获取失败');
      }
    }
  }
}
</script>

<style>
/* 管道可视化样式 */
.pipeline-monitoring {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 5px;
  position: relative;
  background: rgba(0, 21, 41, 0.3);
  border-radius: 4px;
}

/* 阀室卡片布局 */
.valve-cards {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  margin-bottom: 0;
}

.valve-card {
  flex: 1;
  height: 160px;
  background: rgba(0, 21, 41, 0.7);
  margin: 0 5px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 10px;
  position: relative;
  transition: all 0.3s;
  cursor: pointer;
}

.valve-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.valve-card:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.valve-card.danger:before {
  background: #ff4d4f;
  box-shadow: 0 0 10px rgba(255, 77, 79, 0.5);
}

.valve-card.warning:before {
  background: #faad14;
  box-shadow: 0 0 10px rgba(250, 173, 20, 0.5);
}

.valve-card.normal:before {
  background: #52c41a;
  box-shadow: 0 0 10px rgba(82, 196, 26, 0.5);
}

.valve-card.danger {
  box-shadow: 0 0 10px rgba(255, 77, 79, 0.3);
}

.valve-card.warning {
  box-shadow: 0 0 10px rgba(250, 173, 20, 0.3);
}

.valve-card.normal {
  box-shadow: 0 0 10px rgba(82, 196, 26, 0.3);
}

.valve-icon {
  margin-top: 0;
  margin-bottom: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.valve-icon i {
  font-size: 24px;
}

.danger .valve-icon i {
  color: #ff4d4f;
}

.warning .valve-icon i {
  color: #faad14;
}

.normal .valve-icon i {
  color: #52c41a;
}

.valve-info {
  width: 100%;
  text-align: center;
  margin-bottom: 5px;
}

.valve-name {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 2px;
}

.valve-position {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2px;
}

.valve-elevation {
  font-size: 12px;
  color: #1890ff;
  margin-bottom: 0;
}

.valve-status {
  margin-top: auto;
  text-align: center;
  padding-bottom: 5px;
}

.status-label {
  font-weight: bold;
}

.danger .status-label {
  color: #ff4d4f;
}

.warning .status-label {
  color: #faad14;
}

.normal .status-label {
  color: #52c41a;
}

.countdown {
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  margin: 3px 0;
  animation: blink 1s infinite;
}

.countdown-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 2px;
}

/* Dialog styles - 与ovl.vue保持一致 */
.valve-detail-dialog .el-dialog {
  background-color: rgba(0, 21, 41, 0.9) !important;
  border: 1px solid rgba(24, 144, 255, 0.3) !important;
  border-radius: 4px !important;
  box-shadow: 0 0 20px rgba(0, 150, 255, 0.3) !important;
}

.valve-detail-dialog .el-dialog__header {
  background: linear-gradient(to right, #001529, #002140) !important;
  padding: 15px 20px !important;
  border-bottom: 1px solid rgba(24, 144, 255, 0.3) !important;
}

.valve-detail-dialog .el-dialog__title {
  color: #1890ff !important;
  font-size: 16px !important;
  font-weight: bold !important;
}

.valve-detail-dialog .el-dialog__headerbtn .el-dialog__close {
  color: #1890ff !important;
}

.valve-detail-dialog .el-dialog__body {
  color: #fff !important;
  padding: 20px !important;
  background: rgba(0, 21, 41, 0.9) !important;
}

.valve-detail-dialog .el-dialog__footer {
  border-top: 1px solid rgba(24, 144, 255, 0.3) !important;
  padding: 10px 20px !important;
  background: rgba(0, 21, 41, 0.9) !important;
}

.valve-detail-content {
  padding: 0;
  background: transparent;
}

.valve-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 15px 0;
  border-bottom: 1px solid rgba(24, 144, 255, 0.2);
  margin-bottom: 20px;
}

.valve-detail-title {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
}

.valve-detail-status {
  padding: 5px 15px;
  border-radius: 20px;
  font-weight: bold;
}

.valve-detail-status.danger {
  background: rgba(255, 77, 79, 0.2);
  color: #ff4d4f;
}

.valve-detail-status.warning {
  background: rgba(250, 173, 20, 0.2);
  color: #faad14;
}

.valve-detail-status.normal {
  background: rgba(82, 196, 26, 0.2);
  color: #52c41a;
}

.valve-detail-body {
  padding: 0;
}

.valve-detail-info {
  margin-bottom: 20px;
}

.info-section {
  margin-bottom: 25px;
  background: rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 4px;
  border: 1px solid rgba(24, 144, 255, 0.1);
}

.info-section h3 {
  color: #1890ff;
  font-size: 16px;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(24, 144, 255, 0.2);
  font-weight: bold;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.info-item {
  display: flex;
  align-items: baseline;
}

.info-item .label {
  color: rgba(255, 255, 255, 0.8);
  min-width: 100px;
  font-size: 14px;
}

.info-item .value {
  color: #fff;
  font-weight: 500;
  font-size: 14px;
}

.info-item .value.danger {
  color: #ff4d4f;
}

.info-item .value.warning {
  color: #faad14;
}

.info-item .value.normal {
  color: #52c41a;
}

.warning-info {
  display: flex;
  align-items: center;
  background: rgba(255, 77, 79, 0.1);
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 15px;
  border: 1px solid rgba(255, 77, 79, 0.2);
}

.warning-icon {
  font-size: 24px;
  color: #ff4d4f;
  margin-right: 12px;
}

.warning-content {
  flex: 1;
}

.warning-title {
  font-size: 16px;
  font-weight: bold;
  color: #ff4d4f;
  margin-bottom: 5px;
}

.warning-desc {
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.5;
  font-size: 14px;
}

.countdown-container {
  text-align: center;
  margin-top: 15px;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 15px;
  border-radius: 8px;
}

.countdown-title {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 10px;
}

.countdown-box {
  display: inline-block;
  padding: 15px 30px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.2);
  margin: 10px auto;
  border: 2px solid;
}

.countdown-box.danger {
  border-color: #ff5252;
  box-shadow: 0 0 15px rgba(255, 82, 82, 0.4);
}

.countdown-box.warning {
  border-color: #ffa726;
  box-shadow: 0 0 15px rgba(255, 167, 38, 0.4);
}

.countdown-display .countdown {
  font-size: 36px;
  font-weight: bold;
  font-family: 'Digital', monospace;
  letter-spacing: 2px;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid rgba(24, 144, 255, 0.2);
}

/* 警报弹窗样式 - 与ovl.vue保持一致 */
.alarm-detail-dialog .el-dialog {
  background-color: rgba(0, 21, 41, 0.9) !important;
  border: 1px solid rgba(24, 144, 255, 0.3) !important;
  border-radius: 4px !important;
  box-shadow: 0 0 20px rgba(0, 150, 255, 0.3) !important;
}

.alarm-detail-dialog .el-dialog__header {
  background: linear-gradient(to right, #001529, #002140) !important;
  padding: 15px 20px !important;
  border-bottom: 1px solid rgba(24, 144, 255, 0.3) !important;
}

.alarm-detail-dialog .el-dialog__title {
  color: #1890ff !important;
  font-size: 16px !important;
  font-weight: bold !important;
}

.alarm-detail-dialog .el-dialog__headerbtn .el-dialog__close {
  color: #1890ff !important;
}

.alarm-detail-dialog .el-dialog__body {
  color: #fff !important;
  padding: 20px !important;
  background: rgba(0, 21, 41, 0.9) !important;
}

.alarm-detail-dialog .el-dialog__footer {
  border-top: 1px solid rgba(24, 144, 255, 0.3) !important;
  padding: 10px 20px !important;
  background: rgba(0, 21, 41, 0.9) !important;
}

.alarm-level-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-top: 15px;
}

.level-option {
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.level-option:hover {
  background: rgba(0, 0, 0, 0.3);
}

.level-option.active {
  box-shadow: 0 0 10px rgba(24, 144, 255, 0.5);
  border: 1px solid #1890ff;
  background: rgba(24, 144, 255, 0.1);
}

.level-icon {
  margin-right: 10px;
}

.level-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

.level-dot.low {
  background-color: #52c41a;
  box-shadow: 0 0 8px #52c41a;
}

.level-dot.medium {
  background-color: #faad14;
  box-shadow: 0 0 8px #faad14;
}

.level-dot.high {
  background-color: #ff4d4f;
  box-shadow: 0 0 8px #ff4d4f;
  animation: blink 1s infinite;
}

.level-content {
  flex: 1;
}

.level-title {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 5px;
}

.level-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
}

/* 全局弹窗蒙层样式 */
.el-dialog__wrapper {
  background-color: rgba(0, 0, 0, 0.2) !important;
}

.v-modal {
  opacity: 0.2 !important;
  background-color: #000 !important;
}

/* 按钮样式 */
.valve-detail-dialog .el-button,
.alarm-detail-dialog .el-button {
  background-color: transparent !important;
  border-color: #1890ff !important;
  color: #1890ff !important;
}

.valve-detail-dialog .el-button:hover,
.alarm-detail-dialog .el-button:hover {
  background-color: rgba(24, 144, 255, 0.1) !important;
  border-color: #40a9ff !important;
  color: #40a9ff !important;
}

.valve-detail-dialog .el-button--primary,
.alarm-detail-dialog .el-button--primary {
  background-color: #1890ff !important;
  border-color: #1890ff !important;
  color: #fff !important;
}

.valve-detail-dialog .el-button--primary:hover,
.alarm-detail-dialog .el-button--primary:hover {
  background-color: #40a9ff !important;
  border-color: #40a9ff !important;
}

.valve-detail-dialog .el-button--warning,
.alarm-detail-dialog .el-button--warning {
  background-color: #faad14 !important;
  border-color: #faad14 !important;
  color: #fff !important;
}

.valve-detail-dialog .el-button--warning:hover,
.alarm-detail-dialog .el-button--warning:hover {
  background-color: #ffc53d !important;
  border-color: #ffc53d !important;
}

.valve-detail-dialog .el-button--danger,
.alarm-detail-dialog .el-button--danger {
  background-color: #ff4d4f !important;
  border-color: #ff4d4f !important;
  color: #fff !important;
}

.valve-detail-dialog .el-button--danger:hover,
.alarm-detail-dialog .el-button--danger:hover {
  background-color: #ff7875 !important;
  border-color: #ff7875 !important;
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}
</style> 