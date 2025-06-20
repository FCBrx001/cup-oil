<template>
  <div class='chart-container' style='width:100%;height:350px'>
    <div :id='chartId' style='width:100%;height:100%'></div>
    
    <!-- 高点详情弹窗 -->
    <el-dialog
      title="高点详情"
      :visible.sync="highPointDetailVisible"
      width="50%"
      custom-class="valve-detail-dialog"
      :modal-append-to-body="false"
      :append-to-body="true"
      :close-on-click-modal="false"
      :modal="false"
      :lock-scroll="false"
    >
      <div class="valve-detail-content" v-if="selectedHighPoint">
        <div class="valve-detail-header">
          <div class="valve-detail-title">{{ selectedHighPoint.name }} 运行状态详情</div>
          <div class="valve-detail-status" :class="selectedHighPoint.riskLevel">
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
                    `当前压力接近临界压力，预计${sharedFormattedCountdowns[selectedHighPoint.name] ? sharedFormattedCountdowns[selectedHighPoint.name] : selectedHighPoint.timeToVaporization}后达到汽化条件，请立即采取措施！` : 
                    `压力下降速率较快，预计${sharedFormattedCountdowns[selectedHighPoint.name] ? sharedFormattedCountdowns[selectedHighPoint.name] : selectedHighPoint.timeToVaporization}后达到预警阈值，请密切关注！` }}
                  </div>
                </div>
              </div>
              
              <!-- 添加醒目的倒计时显示 -->
              <div class="countdown-container" v-if="selectedHighPoint.timeToVaporization !== '--'">
                <div class="countdown-title">{{ selectedHighPoint.riskLevel === 'high' ? '距离汽化还剩' : '距离临界还剩' }}</div>
                <div class="countdown-box" :class="selectedHighPoint.riskLevel">
                  <div class="countdown-display">
                    <span class="countdown">{{ sharedFormattedCountdowns[selectedHighPoint.name] ? sharedFormattedCountdowns[selectedHighPoint.name] : selectedHighPoint.timeToVaporization }}</span>
                  </div>
                </div>
                <!-- 倒计时控制按钮 -->
                <div class="countdown-controls" v-if="sharedCountdowns[selectedHighPoint.name]">
                                      <el-button 
                      size="mini" 
                      :type="sharedCountdowns[selectedHighPoint.name].isActive ? 'warning' : 'primary'"
                      @click="toggleCountdown(selectedHighPoint.name)"
                      icon="el-icon-video-pause"
                    >
                      {{ sharedCountdowns[selectedHighPoint.name].isActive ? '暂停' : '继续' }}
                    </el-button>
                  <el-button 
                    size="mini" 
                    type="info"
                    @click="resetCountdown(selectedHighPoint.name)"
                    icon="el-icon-refresh"
                  >
                    重置
                  </el-button>
                </div>
              </div>
            </div>
          </div>
          <div class="action-buttons">
            <el-button type="primary" icon="el-icon-view">查看历史</el-button>
            <el-button type="warning" icon="el-icon-bell">设置警报</el-button>
            <el-button v-if="selectedHighPoint.riskLevel === 'high'" type="danger" icon="el-icon-warning-outline">应急处置</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import uuidv1 from 'uuid/v1'
import * as echarts from 'echarts'
import countdownStore from '@/store/countdown'

export default {
  name: 'TestChart',
  data() {
    return {
      chartId: '',
      chart: null,
      pipelineData: [],
      maxMileage: 0,
      isLoading: false,
      dataSource: '', // 数据源类型
      resizeHandler: null,
      samplingInterval: 50, // 数据抽样间隔，每50个数据点显示一个
      
      // 高程最高点相关数据
      highestElevationPoints: [], // 存储高程最高的3个点
      highPointDetailVisible: false, // 高点详情弹窗显示状态
      selectedHighPoint: null, // 选中的高点信息
      
      // 模拟高点的汽化风险数据
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
      },
      
      // 使用共享的倒计时状态
      sharedCountdowns: {},
      sharedFormattedCountdowns: {}
    }
  },
  computed: {
    // 格式化倒计时显示
    formattedCountdowns() {
      // 使用共享的倒计时数据
      return this.sharedFormattedCountdowns
    }
  },
  created() {
    this.chartId = uuidv1()
  },
  mounted() {
    this.initChart()
    this.fetchPipelineData()
    this.initSharedCountdown() // 初始化共享倒计时
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
    }
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler)
    }
    // 移除倒计时监听
    countdownStore.$off('countdown-updated', this.onCountdownUpdated)
  },
  methods: {
    // 初始化共享倒计时
    initSharedCountdown() {
      // 获取初始倒计时数据
      const countdownData = countdownStore.getCountdownData()
      this.sharedCountdowns = countdownData.countdowns
      this.sharedFormattedCountdowns = countdownData.formatted
      
      // 监听倒计时更新事件
      countdownStore.$on('countdown-updated', this.onCountdownUpdated)
      
      console.log('📊 TestChart: 初始化共享倒计时', this.sharedFormattedCountdowns)
    },
    
    // 倒计时更新回调
    onCountdownUpdated(data) {
      this.sharedCountdowns = data.countdowns
      this.sharedFormattedCountdowns = data.formatted
      
      // 更新高点数据，以便图表显示最新的倒计时
      this.findHighestElevationPoints()
    },

    initChart() {
      this.chart = echarts.init(document.getElementById(this.chartId))
      this.showLoadingChart()
    },

    showLoadingChart() {
      const loadingOption = {
        title: {
          text: '正在加载管线数据...',
          left: 'center',
          top: 'center',
          textStyle: {
            color: '#ffffff',
            fontSize: 16
          }
        },
        backgroundColor: 'transparent'
      }
      this.chart.setOption(loadingOption)
    },

    async fetchPipelineData() {
      this.isLoading = true
      try {
        console.log('🔍 开始获取管线数据...')
        const response = await this.$axios.get('/elevation/elevation-data')
        
        console.log('📡 API响应:', response.data)
        
        if (response.data.success && response.data.data && response.data.data.length > 0) {
          // 处理真实数据 - 里程单位转换：米 → 千米
          const allData = response.data.data.map(item => ({
            _id: item._id,
            里程: parseFloat(item.里程) / 1000, // 米转换为千米
            高程: parseFloat(item.高程)
          }))
          
          // 确保数据按里程排序
          allData.sort((a, b) => a.里程 - b.里程)
          
          // 数据抽样：每50个数据点显示一个值
          this.pipelineData = []
          for (let i = 0; i < allData.length; i += this.samplingInterval) {
            this.pipelineData.push(allData[i])
          }
          
          // 确保包含最后一个数据点
          if (allData.length > 0 && this.pipelineData[this.pipelineData.length - 1] !== allData[allData.length - 1]) {
            this.pipelineData.push(allData[allData.length - 1])
          }
          
          this.maxMileage = response.data.maxDistance ? response.data.maxDistance / 1000 : Math.max(...this.pipelineData.map(item => item.里程))
          
          console.log('✅ 成功获取管线数据:', {
            totalDataCount: allData.length,
            displayedDataCount: this.pipelineData.length,
            samplingRatio: `1:${Math.floor(allData.length / this.pipelineData.length)}`,
            maxMileage: this.maxMileage.toFixed(3) + ' km',
            minMileage: Math.min(...this.pipelineData.map(item => item.里程)).toFixed(3) + ' km',
            elevationRange: {
              min: Math.min(...this.pipelineData.map(item => item.高程)).toFixed(1) + ' m',
              max: Math.max(...this.pipelineData.map(item => item.高程)).toFixed(1) + ' m',
              hasNegativeValues: Math.min(...this.pipelineData.map(item => item.高程)) < 0
            },
            sampleData: this.pipelineData.slice(0, 3),
            message: response.data.message || '从数据库获取数据（里程已转换为千米，已抽样显示）'
          })
          
          this.dataSource = response.data.message ? 
            (response.data.message.includes('模拟') ? '模拟数据' : '数据库数据') : 
            '数据库数据'
          
          this.renderChart()
        } else {
          console.warn('⚠️ 未获取到有效数据，使用模拟数据')
          console.warn('API响应详情:', response.data)
          this.generateMockData()
          this.renderChart()
        }
      } catch (error) {
        console.error('❌ 获取管线数据失败:', error)
        console.error('错误详情:', error.response && error.response.data ? error.response.data : error.message)
        console.warn('🔄 回退到模拟数据')
        this.generateMockData()
        this.renderChart()
      } finally {
        this.isLoading = false
      }
    },

    generateMockData() {
      this.maxMileage = 94.4
      this.dataSource = '前端模拟数据'
      
      // 生成更多的模拟数据，然后进行抽样
      const allMockData = []
      for (let i = 0; i < 500; i++) { // 生成500个模拟数据点
        const distance = (94.4 * i) / 499 // 均匀分布在0到94.4公里
        // 修改高程生成逻辑，包含负值（如隧道、地下管段等）
        let elevation = -20 + Math.random() * 520 + Math.sin(i / 499 * Math.PI * 3) * 150 // 范围从-170到+500米
        
        // 在某些区段添加负值（模拟地下管段或隧道）
        if (i >= 100 && i <= 150) {
          elevation = -50 + Math.random() * 30 // -50到-20米的地下管段
        } else if (i >= 250 && i <= 300) {
          elevation = -30 + Math.random() * 40 // -30到+10米的低洼区段
        }
        
        allMockData.push({
          _id: `mock_${i + 1}`,
          里程: parseFloat(distance.toFixed(3)),
          高程: parseFloat(elevation.toFixed(1))
        })
      }
      
      // 应用相同的抽样策略：每50个显示一个
      this.pipelineData = []
      for (let i = 0; i < allMockData.length; i += this.samplingInterval) {
        this.pipelineData.push(allMockData[i])
      }
      
      // 确保包含最后一个数据点
      if (allMockData.length > 0 && this.pipelineData[this.pipelineData.length - 1] !== allMockData[allMockData.length - 1]) {
        this.pipelineData.push(allMockData[allMockData.length - 1])
      }
      
      console.log('📊 模拟数据生成:', {
        totalMockData: allMockData.length,
        displayedData: this.pipelineData.length,
        samplingRatio: `1:${Math.floor(allMockData.length / this.pipelineData.length)}`
      })
    },

    generatePressureData() {
      return this.pipelineData.map((item, index) => {
        const basePressure = 2.0
        const elevationEffect = -item.高程 * 0.0001
        const distanceEffect = -(item.里程 / this.maxMileage) * 0.05
        const randomVariation = (Math.random() - 0.5) * 0.02
        
        const pressure = basePressure + elevationEffect + distanceEffect + randomVariation
        return [item.里程, Math.max(1.95, Math.min(2.05, pressure)).toFixed(3)]
      })
    },

    generateTemperatureData() {
      return this.pipelineData.map((item, index) => {
        const baseTemp = 45
        const heatLoss = -(item.里程 / this.maxMileage) * 3
        const elevationEffect = -item.高程 * 0.002
        const randomVariation = (Math.random() - 0.5) * 1.0
        
        const temperature = baseTemp + heatLoss + elevationEffect + randomVariation
        return [item.里程, Math.max(40, Math.min(50, temperature)).toFixed(1)]
      })
    },

    generateElevationData() {
      return this.pipelineData.map(item => [item.里程, item.高程])
    },

    // 计算高程最高的三个点
    findHighestElevationPoints() {
      // 复制数据并按高程排序
      const sortedData = [...this.pipelineData].sort((a, b) => b.高程 - a.高程);
      
      // 取前3个最高点
      this.highestElevationPoints = sortedData.slice(0, 3).map((point, index) => {
        const pointName = `高点#${index + 1}`;
        const riskData = this.highPointRiskData[pointName];
        
        // 获取动态倒计时数据
        let timeToVaporization = riskData.timeToVaporization;
        if (this.sharedFormattedCountdowns[pointName]) {
          timeToVaporization = this.sharedFormattedCountdowns[pointName];
        }
        
        return {
          id: `high_point_${index + 1}`,
          name: pointName,
          mileage: point.里程,
          elevation: point.高程,
          position: `K${(point.里程).toFixed(1)}+${((point.里程 % 1) * 1000).toFixed(0).padStart(3, '0')}`,
          coordinates: `东经${(119 + point.里程 * 0.01).toFixed(5)}°, 北纬${(39 + point.里程 * 0.005).toFixed(5)}°`,
          ...riskData,
          timeToVaporization: timeToVaporization // 使用动态倒计时
        };
      });
      
      console.log('🏔️ 高程最高的三个点:', this.highestElevationPoints);
    },

    // 生成高点标记数据
    generateHighPointMarkers() {
      return this.highestElevationPoints.map((point, index) => ({
        name: point.name,
        coord: [point.mileage, point.elevation],
        value: point.elevation,
        itemStyle: {
          color: point.riskLevel === 'high' ? '#ff4d4f' : 
                 point.riskLevel === 'warning' ? '#faad14' : '#52c41a',
          borderColor: '#fff',
          borderWidth: 2,
          shadowBlur: 4,
          shadowColor: point.riskLevel === 'high' ? 'rgba(255, 77, 79, 0.6)' : 
                      point.riskLevel === 'warning' ? 'rgba(250, 173, 20, 0.6)' : 'rgba(82, 196, 26, 0.6)'
        },
        symbol: 'diamond', // 改为菱形，更有辨识度
        symbolSize: 10, // 进一步减小
        symbolOffset: [0, 0],
        label: {
          show: true,
          position: index % 2 === 0 ? 'top' : 'bottom', // 交替显示位置，避免重叠
          distance: 6,
          color: '#fff',
          fontSize: 9,
          fontWeight: 'bold',
          formatter: `{a|${point.name}}\n{b|${point.elevation.toFixed(1)}m}`, // 显示名称和高程
          rich: {
            a: {
              fontSize: 9,
              fontWeight: 'bold',
              color: '#fff'
            },
            b: {
              fontSize: 8,
              color: 'rgba(255,255,255,0.8)'
            }
          },
          backgroundColor: point.riskLevel === 'high' ? 'rgba(255, 77, 79, 0.9)' : 
                          point.riskLevel === 'warning' ? 'rgba(250, 173, 20, 0.9)' : 'rgba(82, 196, 26, 0.9)',
          padding: [2, 4],
          borderRadius: 2,
          borderColor: '#fff',
          borderWidth: 1
        },
        emphasis: {
          scale: 1.8,
          itemStyle: {
            shadowBlur: 10,
            shadowColor: point.riskLevel === 'high' ? '#ff4d4f' : 
                        point.riskLevel === 'warning' ? '#faad14' : '#52c41a'
          },
          label: {
            fontSize: 10,
            distance: 8,
            rich: {
              a: {
                fontSize: 10,
                fontWeight: 'bold'
              },
              b: {
                fontSize: 9
              }
            }
          }
        }
      }));
    },

    // 高点点击事件处理
    onHighPointClick(params) {
      if (params.componentType === 'markPoint') {
        const pointName = params.name;
        const point = this.highestElevationPoints.find(p => p.name === pointName);
        if (point) {
          this.selectedHighPoint = point;
          this.highPointDetailVisible = true;
        }
      }
    },

    // 重置倒计时
    resetCountdown(pointName) {
      countdownStore.resetCountdown(pointName);
    },

    // 暂停/继续倒计时
    toggleCountdown(pointName) {
      countdownStore.toggleCountdown(pointName);
    },

    renderChart() {
      if (!this.pipelineData || this.pipelineData.length === 0) {
        console.warn('⚠️ 没有数据可渲染')
        return
      }

      const pressureData = this.generatePressureData()
      const temperatureData = this.generateTemperatureData()
      const elevationData = this.generateElevationData()
      
      // 计算高程最高的三个点
      this.findHighestElevationPoints()

      // 计算高程的范围，用于更好的Y轴显示
      const elevations = elevationData.map(item => item[1])
      const minElevation = Math.min(...elevations)
      const maxElevation = Math.max(...elevations)
      const elevationRange = maxElevation - minElevation

      console.log('📊 图表数据统计:', {
        dataPoints: this.pipelineData.length,
        mileageRange: `0 - ${this.maxMileage.toFixed(3)} km`,
        elevationRange: `${minElevation.toFixed(1)} - ${maxElevation.toFixed(1)} m`,
        elevationSpan: `${elevationRange.toFixed(1)} m`,
        hasNegativeElevation: minElevation < 0,
        hasPositiveElevation: maxElevation > 0,
        pressureRange: `${Math.min(...pressureData.map(p => parseFloat(p[1]))).toFixed(3)} - ${Math.max(...pressureData.map(p => parseFloat(p[1]))).toFixed(3)} MPa`,
        temperatureRange: `${Math.min(...temperatureData.map(t => parseFloat(t[1]))).toFixed(1)} - ${Math.max(...temperatureData.map(t => parseFloat(t[1]))).toFixed(1)} ℃`
      })

      const option = {
        title: {
          text: `管线沿线参数分布图 (显示${this.pipelineData.length}个采样点)`,
          subtext: `里程: 0 - ${this.maxMileage.toFixed(3)} km | 高程: ${minElevation.toFixed(1)} - ${maxElevation.toFixed(1)} m | 数据源: ${this.dataSource} | 采样比例: 1:${this.samplingInterval}`,
          left: 'center',
          textStyle: {
            color: '#ffffff',
            fontSize: 16,
            fontWeight: 'bold'
          },
          subtextStyle: {
            color: this.dataSource.includes('数据库') ? '#4CAF50' : 
                   this.dataSource.includes('模拟') ? '#FF9800' : '#cccccc',
            fontSize: 12
          },
          top: 10
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          },
          backgroundColor: 'rgba(0,0,0,0.8)',
          borderColor: '#1a9bfc',
          borderWidth: 1,
          textStyle: {
            color: '#fff'
          },
          formatter: function(params) {
            const mileage = params[0].data[0]
            let html = `<div style="font-weight:bold;margin-bottom:5px;">里程: ${mileage.toFixed(3)} km</div>`
            
            params.forEach(param => {
              const value = param.data[1]
              const unit = param.seriesName.includes('压力') ? ' MPa' : 
                          param.seriesName.includes('温度') ? ' ℃' : ' m'
              
              // 为负值高程添加特殊样式
              let valueStyle = ''
              if (param.seriesName.includes('高程') && parseFloat(value) < 0) {
                valueStyle = 'color: #ff6b6b; font-weight: bold;'
              }
              
              html += `<div style="margin:3px 0;">
                        ${param.marker} ${param.seriesName}: 
                        <span style="font-weight:bold; ${valueStyle}">${value}${unit}</span>
                       </div>`
            })
            return html
          }
        },
        legend: {
          data: ['沿线压力', '沿线温度', '沿线高程', '高程最高点'],
          top: 50,
          textStyle: {
            color: '#ffffff',
            fontSize: 12
          },
          itemWidth: 20,
          itemHeight: 12
        },
        dataZoom: [
          // {
          //   type: 'slider',
          //   show: true,
          //   xAxisIndex: [0],
          //   start: 0,
          //   end: 100,
          //   bottom: 60,
          //   height: 20,
          //   handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23.1h6.6V24.4z M13.3,19.6H6.7v-1.2h6.6V19.6z',
          //   handleSize: '80%',
          //   handleStyle: {
          //     color: '#1a9bfc',
          //     shadowBlur: 3,
          //     shadowColor: 'rgba(0, 0, 0, 0.6)',
          //     shadowOffsetX: 2,
          //     shadowOffsetY: 2
          //   },
          //   textStyle: {
          //     color: '#ffffff',
          //     fontSize: 11
          //   },
          //   borderColor: 'rgba(26, 155, 252, 0.5)',
          //   fillerColor: 'rgba(26, 155, 252, 0.2)',
          //   backgroundColor: 'rgba(47, 69, 84, 0.8)'
          // },
          {
            type: 'inside',
            xAxisIndex: [0],
            start: 0,
            end: 100
          }
        ],
        grid: {
          left: '8%',
          right: '8%',
          bottom: '20%',
          top: '25%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          name: '里程 (km)',
          nameLocation: 'middle',
          nameGap: 30,
          nameTextStyle: {
            color: '#ffffff',
            fontSize: 12
          },
          min: 0,
          max: this.maxMileage,
          axisLabel: {
            color: '#ffffff',
            fontSize: 11,
            formatter: '{value} km'
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(255,255,255,0.3)'
            }
          },
          axisTick: {
            lineStyle: {
              color: 'rgba(255,255,255,0.3)'
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255,255,255,0.1)',
              type: 'dashed'
            }
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '压力 (MPa)',
            nameTextStyle: {
              color: '#ff6b6b',
              fontSize: 11
            },
            position: 'left',
            axisLabel: {
              color: '#ff6b6b',
              fontSize: 10,
              formatter: '{value}'
            },
            axisLine: {
              lineStyle: {
                color: '#ff6b6b'
              }
            },
            axisTick: {
              lineStyle: {
                color: '#ff6b6b'
              }
            },
            splitLine: {
              show: false
            }
          },
          {
            type: 'value',
            name: '温度 (℃)',
            nameTextStyle: {
              color: '#ffd166',
              fontSize: 11
            },
            position: 'right',
            offset: 0,
            axisLabel: {
              color: '#ffd166',
              fontSize: 10,
              formatter: '{value}'
            },
            axisLine: {
              lineStyle: {
                color: '#ffd166'
              }
            },
            axisTick: {
              lineStyle: {
                color: '#ffd166'
              }
            },
            splitLine: {
              show: false
            }
          },
          {
            type: 'value',
            name: '高程 (m)',
            nameTextStyle: {
              color: '#3399ff',
              fontSize: 11
            },
            position: 'right',
            offset: 60,
            min: function(value) {
              // 动态计算最小值，确保负值也能正确显示
              return Math.floor(value.min - Math.abs(value.min) * 0.1)
            },
            max: function(value) {
              // 动态计算最大值，添加适当的上边距
              return Math.ceil(value.max + Math.abs(value.max) * 0.1)
            },
            axisLabel: {
              color: '#3399ff',
              fontSize: 10,
              formatter: '{value} m'
            },
            axisLine: {
              lineStyle: {
                color: '#3399ff'
              }
            },
            axisTick: {
              lineStyle: {
                color: '#3399ff'
              }
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(51,153,255,0.2)',
                type: 'dashed'
              }
            }
          }
        ],
        series: [
          {
            name: '沿线压力',
            type: 'line',
            yAxisIndex: 0,
            data: pressureData,
            symbol: 'none',
            symbolSize: 0,
            lineStyle: {
              color: '#ff6b6b',
              width: 2
            },
            itemStyle: {
              color: '#ff6b6b',
              borderWidth: 1,
              borderColor: '#fff'
            },
            smooth: true,
            emphasis: {
              focus: 'series',
              itemStyle: {
                symbolSize: 6
              }
            }
          },
          {
            name: '沿线温度',
            type: 'line',
            yAxisIndex: 1,
            data: temperatureData,
            symbol: 'none',
            symbolSize: 0,
            lineStyle: {
              color: '#ffd166',
              width: 2
            },
            itemStyle: {
              color: '#ffd166',
              borderWidth: 1,
              borderColor: '#fff'
            },
            smooth: true,
            emphasis: {
              focus: 'series',
              itemStyle: {
                symbolSize: 6
              }
            }
          },
          {
            name: '沿线高程',
            type: 'line',
            yAxisIndex: 2,
            data: elevationData,
            symbol: 'none',
            symbolSize: 0,
            lineStyle: {
              color: '#3399ff',
              width: 3
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(51,153,255,0.7)' },
                { offset: 1, color: 'rgba(51,153,255,0.1)' }
              ])
            },
            itemStyle: {
              color: '#3399ff',
              borderWidth: 1,
              borderColor: '#fff'
            },
            smooth: true,
            emphasis: {
              focus: 'series',
              itemStyle: {
                symbolSize: 6
              }
            },
            // 添加高程最高点标记
            markPoint: {
              data: this.generateHighPointMarkers(),
              silent: false // 允许交互
            }
          }
        ],
        backgroundColor: 'transparent'
      }

      this.chart.setOption(option, true)
      
      // 添加高点标记点击事件
      this.chart.off('click'); // 先移除之前的事件监听
      this.chart.on('click', this.onHighPointClick);
      
      // 响应式调整
      if (!this.resizeHandler) {
        this.resizeHandler = () => {
          if (this.chart) {
            this.chart.resize()
          }
        }
        window.addEventListener('resize', this.resizeHandler)
      }
    },

    refreshData() {
      this.fetchPipelineData()
    },

    // 动态调整抽样间隔
    setSamplingInterval(interval) {
      if (interval > 0) {
        this.samplingInterval = interval
        console.log(`📊 抽样间隔已调整为: 1:${interval}`)
        this.refreshData() // 重新获取和处理数据
      }
    }
  }
}
</script>

<style scoped>
.chart-container {
  position: relative;
  background: transparent;
}
</style>

<style>
/* Dialog styles - 与VaporizationWarning.vue保持一致 */
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

.valve-detail-status.high {
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

.info-item .value.high {
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

.countdown-box.high {
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

/* 全局弹窗蒙层样式 */
.el-dialog__wrapper {
  background-color: rgba(0, 0, 0, 0.2) !important;
}

.v-modal {
  opacity: 0.2 !important;
  background-color: #000 !important;
}

/* 按钮样式 */
.valve-detail-dialog .el-button {
  background-color: transparent !important;
  border-color: #1890ff !important;
  color: #1890ff !important;
}

.valve-detail-dialog .el-button:hover {
  background-color: rgba(24, 144, 255, 0.1) !important;
  border-color: #40a9ff !important;
  color: #40a9ff !important;
}

.valve-detail-dialog .el-button--primary {
  background-color: #1890ff !important;
  border-color: #1890ff !important;
  color: #fff !important;
}

.valve-detail-dialog .el-button--primary:hover {
  background-color: #40a9ff !important;
  border-color: #40a9ff !important;
}

.valve-detail-dialog .el-button--warning {
  background-color: #faad14 !important;
  border-color: #faad14 !important;
  color: #fff !important;
}

.valve-detail-dialog .el-button--warning:hover {
  background-color: #ffc53d !important;
  border-color: #ffc53d !important;
}

.valve-detail-dialog .el-button--danger {
  background-color: #ff4d4f !important;
  border-color: #ff4d4f !important;
  color: #fff !important;
}

.valve-detail-dialog .el-button--danger:hover {
  background-color: #ff7875 !important;
  border-color: #ff7875 !important;
}

/* 倒计时控制按钮样式 */
.countdown-controls {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.countdown-controls .el-button {
  background-color: transparent !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
  color: rgba(255, 255, 255, 0.8) !important;
  font-size: 12px !important;
}

.countdown-controls .el-button:hover {
  border-color: #1890ff !important;
  color: #1890ff !important;
}

.countdown-controls .el-button--primary {
  border-color: #1890ff !important;
  color: #1890ff !important;
}

.countdown-controls .el-button--primary:hover {
  background-color: rgba(24, 144, 255, 0.1) !important;
}

.countdown-controls .el-button--warning {
  border-color: #faad14 !important;
  color: #faad14 !important;
}

.countdown-controls .el-button--warning:hover {
  background-color: rgba(250, 173, 20, 0.1) !important;
}

.countdown-controls .el-button--info {
  border-color: #909399 !important;
  color: #909399 !important;
}

.countdown-controls .el-button--info:hover {
  background-color: rgba(144, 147, 153, 0.1) !important;
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
