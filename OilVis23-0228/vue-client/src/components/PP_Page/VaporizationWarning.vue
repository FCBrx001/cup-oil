<template>
  <div>
    <div class="pipeline-monitoring">
      <!-- 阀室状态卡片 -->
      <div class="valve-cards" >
        <div 
          v-for="(point, index) in highestElevationPoints" 
          :key="point.id"
          class="valve-card" 
          :class="point.riskLevel === 'high' ? 'danger' : point.riskLevel === 'warning' ? 'warning' : 'normal'"
          @click="showValveDetails(point.name)"
        >
          <div class="valve-icon">
            <i :class="point.riskLevel === 'high' ? 'el-icon-warning' : point.riskLevel === 'warning' ? 'el-icon-warning-outline' : 'el-icon-success'"></i>
          </div>
          <div class="valve-info">
            <div class="valve-name">{{ point.name }}</div>
            <!-- <div class="valve-position">{{ point.position }}</div> -->
            <div class="valve-elevation">高程: {{ point.elevation.toFixed(1) }}m</div>
          </div>
          <div class="valve-status">
            <div class="status-label">{{ point.riskLevel === 'high' ? '高风险' : point.riskLevel === 'warning' ? '中风险' : '正常' }}</div>
            <div v-if="point.riskLevel !== 'normal'" class="countdown">{{ formattedCountdowns[point.name] }}</div>
            <!-- <div v-if="point.riskLevel !== 'normal'" class="countdown-label">{{ point.riskLevel === 'high' ? '预计汽化' : '预计临界' }}</div> -->
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
      <div class="valve-detail-content" v-if="selectedValve && selectedHighPoint">
        <div class="valve-detail-header">
          <div class="valve-detail-title">{{ selectedValve }} 运行状态详情</div>
          <div class="valve-detail-status" :class="selectedHighPoint.riskLevel === 'high' ? 'danger' : selectedHighPoint.riskLevel === 'warning' ? 'warning' : 'normal'">
            {{ selectedHighPoint.riskLevel === 'high' ? '高风险' : selectedHighPoint.riskLevel === 'warning' ? '中风险' : '正常' }}
          </div>
        </div>
        <div class="valve-detail-body">
          <div class="valve-detail-info">
            <div class="info-section">
              <h3>位置信息</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">公里标：</span>
                  <span class="value">{{ selectedHighPoint.position }}</span>
                </div>
                <div class="info-item">
                  <span class="label">高程：</span>
                  <span class="value">{{ selectedHighPoint.elevation.toFixed(1) }}m</span>
                </div>
                <div class="info-item">
                  <span class="label">里程：</span>
                  <span class="value">{{ selectedHighPoint.mileage.toFixed(3) }} km</span>
                </div>
                <div class="info-item">
                  <span class="label">地理位置：</span>
                  <span class="value">{{ selectedHighPoint.coordinates }}</span>
                </div>
              </div>
            </div>
            <div class="info-section">
              <h3>运行参数</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">当前压力：</span>
                  <span class="value">{{ selectedHighPoint.pressure }}</span>
                </div>
                <div class="info-item">
                  <span class="label">临界压力：</span>
                  <span class="value">1.75 MPa</span>
                </div>
                <div class="info-item">
                  <span class="label">当前温度：</span>
                  <span class="value">{{ selectedHighPoint.temperature }}</span>
                </div>
                <div class="info-item">
                  <span class="label">风险等级：</span>
                  <span class="value" :class="selectedHighPoint.riskLevel">
                    {{ selectedHighPoint.riskLevel === 'high' ? '高风险' : selectedHighPoint.riskLevel === 'warning' ? '中风险' : '正常' }}
                  </span>
                </div>
              </div>
            </div>
            <div class="info-section" v-if="selectedHighPoint.riskLevel === 'high' || selectedHighPoint.riskLevel === 'warning'">
              <h3>预警信息</h3>
              <div class="warning-info">
                <div class="warning-icon">
                  <i :class="selectedHighPoint.riskLevel === 'high' ? 'el-icon-error' : 'el-icon-warning'"></i>
                </div>
                <div class="warning-content">
                  <div class="warning-title">{{ selectedHighPoint.riskLevel === 'high' ? '高点汽化高风险预警' : '高点汽化中风险预警' }}</div>
                  <div class="warning-desc">
                    {{ selectedHighPoint.riskLevel === 'high' ? 
                    `当前压力接近临界压力，预计${selectedHighPoint.timeToVaporization}后达到汽化条件，请立即采取措施！` : 
                    `压力下降速率较快，预计${selectedHighPoint.timeToVaporization}后达到预警阈值，请密切关注！` }}
                  </div>
                </div>
              </div>
              
              <!-- 添加醒目的倒计时显示 -->
              <div class="countdown-container" v-if="selectedHighPoint.timeToVaporization !== '--'">
                <div class="countdown-title">{{ selectedHighPoint.riskLevel === 'high' ? '距离汽化还剩' : '距离临界还剩' }}</div>
                <div class="countdown-box" :class="selectedHighPoint.riskLevel">
                  <div class="countdown-display">
                    <span class="countdown">{{ selectedHighPoint.timeToVaporization }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="action-buttons">
            <el-button type="primary" icon="el-icon-view">查看历史</el-button>
            <el-button type="warning" icon="el-icon-bell" @click="showAlarmDialog">设置警报</el-button>
            <el-button v-if="selectedHighPoint.riskLevel === 'high'" type="danger" icon="el-icon-warning-outline">应急处置</el-button>
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
                  <span class="value">{{ selectedHighPoint ? `${selectedHighPoint.name} (${selectedHighPoint.position})` : '高点#1 (K125+600)' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">预警时间：</span>
                  <span class="value">{{ new Date().toLocaleString() }}</span>
                </div>
                <div class="info-item">
                  <span class="label">预计汽化时间：</span>
                  <span class="value danger">{{ selectedHighPoint ? selectedHighPoint.timeToVaporization : '15:30' }}</span>
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
import countdownStore from '@/store/countdown'

export default {
  name: 'VaporizationWarning',
  data() {
    return {
      valveDetailVisible: false,
      selectedValve: null,
      selectedHighPoint: null, // 选中的高点详情
      valveRooms: [], // 从数据库获取的阀室数据
      valveRoomDetails: {}, // 阀室详细信息缓存
      realTimeData: {}, // 实时数据
      
      // 高点数据 - 与test_chart.vue保持一致
      pipelineData: [], // 管线数据
      highestElevationPoints: [], // 高程最高的3个点
      maxMileage: 0,
      
      // 使用共享的倒计时状态
      sharedCountdowns: {},
      sharedFormattedCountdowns: {},
      dataUpdateTimer: null, // 数据更新定时器
      alarmDialogVisible: false,
      selectedAlarmLevel: 'low',
      notificationMethods: {
        sms: false,
        email: false,
        app: false,
        phone: false
      },
      loading: false,
      
      // 高点风险数据配置 - 与test_chart.vue保持一致
      highPointRiskData: {
        '高点#1': {
          riskLevel: 'high',
          timeToVaporization: '15:30',
          pressure: '1.82 MPa',
          temperature: '28 ℃'
        },
        '高点#2': {
          riskLevel: 'warning', 
          timeToVaporization: '42:15',
          pressure: '2.15 MPa',
          temperature: '26 ℃'
        },
        '高点#3': {
          riskLevel: 'normal',
          timeToVaporization: '--',
          pressure: '2.45 MPa',
          temperature: '25 ℃'
        }
      }
    }
  },
  computed: {
    formattedCountdowns() {
      // 使用共享的倒计时数据
      return this.sharedFormattedCountdowns
    }
  },
  async mounted() {
    this.initSharedCountdown(); // 初始化共享倒计时
    await this.loadPipelineData(); // 先加载管线数据
    await this.loadValveRoomData();
    this.startDataUpdate();
  },
  beforeDestroy() {
    // 移除倒计时监听
    countdownStore.$off('countdown-updated', this.onCountdownUpdated);
    
    if (this.dataUpdateTimer) {
      clearInterval(this.dataUpdateTimer);
    }
  },
  methods: {
    // 初始化共享倒计时
    initSharedCountdown() {
      // 获取初始倒计时数据
      const countdownData = countdownStore.getCountdownData();
      this.sharedCountdowns = countdownData.countdowns;
      this.sharedFormattedCountdowns = countdownData.formatted;
      
      // 监听倒计时更新事件
      countdownStore.$on('countdown-updated', this.onCountdownUpdated);
      
      console.log('📊 VaporizationWarning: 初始化共享倒计时', this.sharedFormattedCountdowns);
    },
    
    // 倒计时更新回调
    onCountdownUpdated(data) {
      this.sharedCountdowns = data.countdowns;
      this.sharedFormattedCountdowns = data.formatted;
    },
    
    // 重置倒计时
    resetCountdown(pointName) {
      countdownStore.resetCountdown(pointName);
    },
    
    // 暂停/继续倒计时
    toggleCountdown(pointName) {
      countdownStore.toggleCountdown(pointName);
    },

    // 加载管线数据 - 与test_chart.vue保持一致
    async loadPipelineData() {
      this.loading = true;
      try {
        console.log('🔍 VaporizationWarning: 开始获取管线数据...');
        const response = await this.$axios.get('/elevation/elevation-data');
        
        if (response.data.success && response.data.data && response.data.data.length > 0) {
          // 处理真实数据 - 里程单位转换：米 → 千米
          const allData = response.data.data.map(item => ({
            _id: item._id,
            里程: parseFloat(item.里程) / 1000, // 米转换为千米
            高程: parseFloat(item.高程)
          }));
          
          // 确保数据按里程排序
          allData.sort((a, b) => a.里程 - b.里程);
          
          // 数据抽样：每50个数据点显示一个值
          const samplingInterval = 50;
          this.pipelineData = [];
          for (let i = 0; i < allData.length; i += samplingInterval) {
            this.pipelineData.push(allData[i]);
          }
          
          // 确保包含最后一个数据点
          if (allData.length > 0 && this.pipelineData[this.pipelineData.length - 1] !== allData[allData.length - 1]) {
            this.pipelineData.push(allData[allData.length - 1]);
          }
          
          this.maxMileage = response.data.maxDistance ? response.data.maxDistance / 1000 : Math.max(...this.pipelineData.map(item => item.里程));
          
          console.log('✅ VaporizationWarning: 成功获取管线数据');
        } else {
          console.warn('⚠️ VaporizationWarning: 未获取到有效数据，使用模拟数据');
          this.generateMockPipelineData();
        }
        
        // 计算高程最高的三个点
        this.findHighestElevationPoints();
        
      } catch (error) {
        console.error('❌ VaporizationWarning: 获取管线数据失败:', error);
        this.generateMockPipelineData();
        this.findHighestElevationPoints();
      } finally {
        this.loading = false;
      }
    },

    // 生成模拟管线数据
    generateMockPipelineData() {
      this.maxMileage = 94.4;
      const allMockData = [];
      for (let i = 0; i < 500; i++) {
        const distance = (94.4 * i) / 499;
        let elevation = -20 + Math.random() * 520 + Math.sin(i / 499 * Math.PI * 3) * 150;
        
        if (i >= 100 && i <= 150) {
          elevation = -50 + Math.random() * 30;
        } else if (i >= 250 && i <= 300) {
          elevation = -30 + Math.random() * 40;
        }
        
        allMockData.push({
          _id: `mock_${i + 1}`,
          里程: parseFloat(distance.toFixed(3)),
          高程: parseFloat(elevation.toFixed(1))
        });
      }
      
      // 抽样
      const samplingInterval = 50;
      this.pipelineData = [];
      for (let i = 0; i < allMockData.length; i += samplingInterval) {
        this.pipelineData.push(allMockData[i]);
      }
      
      if (allMockData.length > 0 && this.pipelineData[this.pipelineData.length - 1] !== allMockData[allMockData.length - 1]) {
        this.pipelineData.push(allMockData[allMockData.length - 1]);
      }
    },

    // 计算高程最高的三个点 - 与test_chart.vue完全一致
    findHighestElevationPoints() {
      if (!this.pipelineData || this.pipelineData.length === 0) {
        console.warn('⚠️ VaporizationWarning: 没有管线数据，无法计算高点');
        return;
      }
      
      // 复制数据并按高程排序
      const sortedData = [...this.pipelineData].sort((a, b) => b.高程 - a.高程);
      
      // 取前3个最高点
      this.highestElevationPoints = sortedData.slice(0, 3).map((point, index) => ({
        id: `high_point_${index + 1}`,
        name: `高点#${index + 1}`,
        mileage: point.里程,
        elevation: point.高程,
        position: `K${(point.里程).toFixed(1)}+${((point.里程 % 1) * 1000).toFixed(0).padStart(3, '0')}`,
        coordinates: `东经${(119 + point.里程 * 0.01).toFixed(5)}°, 北纬${(39 + point.里程 * 0.005).toFixed(5)}°`,
        ...this.highPointRiskData[`高点#${index + 1}`]
      }));
      
      console.log('🏔️ VaporizationWarning: 高程最高的三个点:', this.highestElevationPoints);
      
      // 更新阀室数据以匹配高点数据
      this.updateValveRoomsFromHighPoints();
    },

    // 根据高点数据更新阀室信息
    updateValveRoomsFromHighPoints() {
      this.valveRooms = this.highestElevationPoints.map((point, index) => ({
        id: index + 1,
        name: point.name,
        position: point.position,
        elevation: point.elevation,
        mileage: point.mileage,
        coordinates: point.coordinates,
        status: point.riskLevel,
        pressure: point.pressure,
        temperature: point.temperature,
        timeToVaporization: point.timeToVaporization
      }));
      
      console.log('📋 VaporizationWarning: 更新后的阀室数据:', this.valveRooms);
    },

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
        { id: 1, name: '高点#1', position: 'K125+600', elevation: 13.7, status: 'danger' },
        { id: 2, name: '高点#2', position: 'K118+350', elevation: 10.2, status: 'warning' },
        { id: 3, name: '高点#3', position: 'K112+800', elevation: 9.5, status: 'normal' }
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
      
      // 查找对应的高点数据
      this.selectedHighPoint = this.highestElevationPoints.find(point => point.name === valveName);
      
      if (!this.selectedHighPoint) {
        console.error('未找到对应的高点数据:', valveName);
        return;
      }
      
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
  justify-content: center;
  padding: 10px 0;
  margin-bottom: 0;
  gap: 20px;
}

.valve-card {
  width: 200px;
  height: 120px;
  background: rgba(0, 21, 41, 0.7);
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