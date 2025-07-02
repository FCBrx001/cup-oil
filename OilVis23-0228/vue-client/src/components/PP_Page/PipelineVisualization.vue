<template>
  <div class="data-box1 left_tb box1-backlu fl" style="height: 250px;">
    <i class="topL"></i>
    <i class="topR"></i>
    <i class="bottomL"></i>
    <i class="bottomR"></i>
    <div class="data-title" style="width:13rem;">
      <b class="data-title-left fl">[</b>
      <span style="font-size:1.5rem;width:12rem;">管段沿线监测</span>
      <b class="data-title-right fr">]</b>
    </div>
    <div class="pipeline-container">
      <div id="pipe_section"></div>
      <div class="parameter-display">
        <div class="parameters-row">
          <div class="parameter-item">
            <span class="parameter-label">环境温度</span>
            <span class="parameter-value" :class="environmentTempStatus">{{ displayEnvironmentTemp }}</span>
          </div>
          <div class="parameter-item">
            <span class="parameter-label">十字窖1压力</span>
            <span class="parameter-value" :class="valve1PressureStatus">{{ displayValve1Pressure }}</span>
          </div>
          <div class="parameter-item">
            <span class="parameter-label">十字窖1温度</span>
            <span class="parameter-value" :class="valve1TempStatus">{{ displayValve1Temp }}</span>
          </div>
          <div class="parameter-item">
            <span class="parameter-label">十字窖2压力</span>
            <span class="parameter-value" :class="valve2PressureStatus">{{ displayValve2Pressure }}</span>
          </div>

          <div class="parameter-item">
            <span class="parameter-label">十字窖2温度</span>
            <span class="parameter-value" :class="valve2TempStatus">{{ displayValve2Temp }}</span>
          </div>
          
          <div class="parameter-item">
            <span class="parameter-label">进站油品压力</span>
            <span class="parameter-value" :class="inletPressureStatus">{{ displayInletPressure }}</span>
          </div>
          <div class="parameter-item">
            <span class="parameter-label">进站油品温度</span>
            <span class="parameter-value" :class="inletTempStatus">{{ displayInletTemp }}</span>
          </div>
          <div class="parameter-item">
            <span class="parameter-label">出站油品压力</span>
            <span class="parameter-value" :class="outletPressureStatus">{{ displayOutletPressure }}</span>
          </div>
          <div class="parameter-item">
            <span class="parameter-label">出站油品温度</span>
            <span class="parameter-value" :class="outletTempStatus">{{ displayOutletTemp }}</span>
          </div>
        </div>
      </div>
      
      <!-- 连接状态指示器 -->
      <div class="connection-indicator">
        <span :class="getConnectionIndicatorClass">{{ getConnectionIndicatorSymbol }}</span>
        <span class="connection-text" :class="getConnectionTextClass">{{ getConnectionStatusText }}</span>
        <!-- 测试按钮 -->
        <button @click="toggleOfflineMode" style="margin-left: 10px; padding: 2px 8px; font-size: 12px; background: rgba(255,255,255,0.2); border: 1px solid #fff; color: #fff; border-radius: 3px; cursor: pointer;">
          {{ manualOfflineMode ? '恢复在线' : '模拟离线' }}
        </button>
      </div>
      

    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { mapGetters } from 'vuex';

export default {
  name: 'PipelineVisualization',
  props: {
    pipelineId: {
      type: String,
      default: 'pipeline1'
    },
    selectedValves: {
      type: Array,
      default: () => []
    },
    // 接收WebSocket连接状态
    websocketConnectionStatus: {
      type: String,
      default: 'disconnected'
    }
  },
  data() {
    return {
      pipe_section: null,

      // 静态默认值
      defaultValues: {
        environmentTemp: 25,
        valve1Pressure: 2.2,
        valve1Temp: 87.5,
        valve2Pressure: 1.8,
        valve2Temp: 86.5,
        inletPressure: 2.6,
        inletTemp: 88,
        outletPressure: 0.8,
        outletTemp: 88
      },

      // 离线状态检测
      lastDataUpdateTime: null,
      connectionStatus: 'disconnected', // 默认为离线状态
      offlineCheckTimer: null,

      // 后端连接状态
      backendConnected: false,
      connectionCheckTimer: null,

      // 手动离线状态控制（用于测试）
      manualOfflineMode: false
    }
  },

  computed: {
    ...mapGetters([
      'getRealTimeStationData',
      'getAllRealTimeStationData',
      'getRealTimeUpdateFlag'
    ]),

    // 从store获取最新的实时数据
    latestRealTimeData() {
      const allData = this.getAllRealTimeStationData;
      const latestData = {};

      // 获取每个站点的最新数据点
      Object.keys(allData).forEach(stationName => {
        const stationData = allData[stationName];
        if (stationData.temperature.length > 0) {
          const latestTemp = stationData.temperature[stationData.temperature.length - 1];
          if (stationName === '十字窖#1') latestData.STN10_05_TI501 = latestTemp[1];
          if (stationName === '十字窖#2') latestData.STN10_05_TI502 = latestTemp[1];
          if (stationName === '黄埔') latestData.STN10_00_TI002 = latestTemp[1];
          if (stationName === '东莞') latestData.STN11_00_TI001 = latestTemp[1];
        }
        if (stationData.pressure.length > 0) {
          const latestPressure = stationData.pressure[stationData.pressure.length - 1];
          if (stationName === '十字窖#1') latestData.STN10_05_PI501 = latestPressure[1];
          if (stationName === '十字窖#2') latestData.STN10_05_PI502 = latestPressure[1];
          if (stationName === '黄埔') latestData.STN10_00_PI019A = latestPressure[1];
          if (stationName === '东莞') latestData.STN11_00_PI001 = latestPressure[1];
        }
      });

      return latestData;
    },

    // 检查系统是否离线
    isSystemOffline() {
      // 检查WebSocket连接状态
      if (this.connectionStatus === 'disconnected') {
        return true;
      }

      // 检查数据更新时间 - 如果超过2分钟没有更新，认为离线
      if (this.lastDataUpdateTime) {
        const timeDiff = Date.now() - this.lastDataUpdateTime;
        if (timeDiff > 120000) { // 2分钟
          return true;
        }
      }

      return false;
    },

    // 环境温度显示
    displayEnvironmentTemp() {
      // 如果store中有黄埔出站温度，基于它计算环境温度
      if (this.latestRealTimeData.STN10_00_TI002 !== undefined) {
        const envTemp = Number(this.latestRealTimeData.STN10_00_TI002) - 5;
        return `${envTemp.toFixed(1)}℃`;
      }
      // 使用默认值
      return `${this.defaultValues.environmentTemp}℃`;
    },

    // 十字窖1压力显示
    displayValve1Pressure() {
      // 使用store中的实时数据
      if (this.latestRealTimeData.STN10_05_PI501 !== undefined) {
        return `${this.latestRealTimeData.STN10_05_PI501.toFixed(2)}MPa`;
      }
      // 使用默认值
      return `${this.defaultValues.valve1Pressure}MPa`;
    },

    // 十字窖1温度显示
    displayValve1Temp() {
      // 使用store中的实时数据
      if (this.latestRealTimeData.STN10_05_TI501 !== undefined) {
        return `${this.latestRealTimeData.STN10_05_TI501.toFixed(1)}℃`;
      }
      // 使用默认值
      return `${this.defaultValues.valve1Temp}℃`;
    },

    // 十字窖2压力显示
    displayValve2Pressure() {
      if (this.latestRealTimeData.STN10_05_PI502 !== undefined) {
        return `${this.latestRealTimeData.STN10_05_PI502.toFixed(2)}MPa`;
      }
      return `${this.defaultValues.valve2Pressure}MPa`;
    },

    // 十字窖2温度显示
    displayValve2Temp() {
      if (this.latestRealTimeData.STN10_05_TI502 !== undefined) {
        return `${this.latestRealTimeData.STN10_05_TI502.toFixed(1)}℃`;
      }
      return `${this.defaultValues.valve2Temp}℃`;
    },

    // 进站压力显示（东莞）
    displayInletPressure() {
      if (this.latestRealTimeData.STN11_00_PI001 !== undefined) {
        return `${this.latestRealTimeData.STN11_00_PI001.toFixed(2)}MPa`;
      }
      return `${this.defaultValues.inletPressure}MPa`;
    },

    // 进站温度显示（东莞）
    displayInletTemp() {
      if (this.latestRealTimeData.STN11_00_TI001 !== undefined) {
        return `${this.latestRealTimeData.STN11_00_TI001.toFixed(1)}℃`;
      }
      return `${this.defaultValues.inletTemp}℃`;
    },

    // 出站压力显示（黄埔）
    displayOutletPressure() {
      if (this.latestRealTimeData.STN10_00_PI019A !== undefined) {
        return `${this.latestRealTimeData.STN10_00_PI019A.toFixed(2)}MPa`;
      }
      return `${this.defaultValues.outletPressure}MPa`;
    },

    // 出站温度显示（黄埔）
    displayOutletTemp() {
      if (this.latestRealTimeData.STN10_00_TI002 !== undefined) {
        return `${this.latestRealTimeData.STN10_00_TI002.toFixed(1)}℃`;
      }
      return `${this.defaultValues.outletTemp}℃`;
    },

    // 数据状态样式类
    environmentTempStatus() {
      // 环境温度始终显示为正常状态，不参与连接状态判断
      return 'realtime';
    },

    valve1PressureStatus() {
      if (this.manualOfflineMode) return 'offline';
      return this.latestRealTimeData.STN10_05_PI501 !== undefined ? 'realtime' : 'offline';
    },

    valve1TempStatus() {
      if (this.manualOfflineMode) return 'offline';
      return this.latestRealTimeData.STN10_05_TI501 !== undefined ? 'realtime' : 'offline';
    },

    valve2PressureStatus() {
      if (this.manualOfflineMode) return 'offline';
      return this.latestRealTimeData.STN10_05_PI502 !== undefined ? 'realtime' : 'offline';
    },

    valve2TempStatus() {
      if (this.manualOfflineMode) return 'offline';
      return this.latestRealTimeData.STN10_05_TI502 !== undefined ? 'realtime' : 'offline';
    },

    inletPressureStatus() {
      if (this.manualOfflineMode) return 'offline';
      return this.latestRealTimeData.STN11_00_PI001 !== undefined ? 'realtime' : 'offline';
    },

    inletTempStatus() {
      if (this.manualOfflineMode) return 'offline';
      return this.latestRealTimeData.STN11_00_TI001 !== undefined ? 'realtime' : 'offline';
    },

    outletPressureStatus() {
      if (this.manualOfflineMode) return 'offline';
      return this.latestRealTimeData.STN10_00_PI019A !== undefined ? 'realtime' : 'offline';
    },

    outletTempStatus() {
      if (this.manualOfflineMode) return 'offline';
      return this.latestRealTimeData.STN10_00_TI002 !== undefined ? 'realtime' : 'offline';
    },

    // 连接状态指示器样式
    connectionIndicatorClass() {
      // 如果是黄埔-东莞管段，优先使用WebSocket连接状态
      if (this.pipelineId === 'pipeline1') {
        return this.websocketConnectionStatus === 'connected' ? 'indicator-online' : 'indicator-offline';
      }
      // 其他管段检查是否有任何实时数据
      const hasData = Object.keys(this.latestRealTimeData).length > 0;
      return hasData ? 'indicator-online' : 'indicator-offline';
    },

    // 连接状态文本
    getConnectionStatusText() {
      // 手动离线模式
      if (this.manualOfflineMode) {
        return '离线 (手动)';
      }

      // 检查后端连接状态
      if (!this.backendConnected) {
        return '离线';
      }

      // 检查关键数据状态（排除环境温度，使用压力和其他温度数据）
      const hasKeyData = this.latestRealTimeData.STN10_05_PI501 !== undefined ||
                        this.latestRealTimeData.STN11_00_PI001 !== undefined ||
                        this.latestRealTimeData.STN10_00_PI019A !== undefined;
      if (!hasKeyData) {
        return '离线 (无数据)';
      }

      return '实时';
    },

    // 连接指示器符号
    getConnectionIndicatorSymbol() {
      if (this.manualOfflineMode || !this.backendConnected) {
        return '●';
      }
      const hasData = Object.keys(this.latestRealTimeData).length > 0;
      return hasData ? '●' : '●';
    },

    // 连接指示器样式类
    getConnectionIndicatorClass() {
      if (this.manualOfflineMode || !this.backendConnected) {
        return 'indicator-offline';
      }
      // 检查关键数据状态（排除环境温度）
      const hasKeyData = this.latestRealTimeData.STN10_05_PI501 !== undefined ||
                        this.latestRealTimeData.STN11_00_PI001 !== undefined ||
                        this.latestRealTimeData.STN10_00_PI019A !== undefined;
      return hasKeyData ? 'indicator-online' : 'indicator-offline';
    },

    // 连接文本样式类
    getConnectionTextClass() {
      if (this.manualOfflineMode || !this.backendConnected) {
        return 'text-offline';
      }
      // 检查关键数据状态（排除环境温度）
      const hasKeyData = this.latestRealTimeData.STN10_05_PI501 !== undefined ||
                        this.latestRealTimeData.STN11_00_PI001 !== undefined ||
                        this.latestRealTimeData.STN10_00_PI019A !== undefined;
      return hasKeyData ? 'text-online' : 'text-offline';
    },

    // 连接状态
    connectionStatus() {
      // 如果是黄埔-东莞管段，优先使用WebSocket连接状态
      if (this.pipelineId === 'pipeline1') {
        return this.websocketConnectionStatus;
      }
      // 其他管段检查是否有任何实时数据
      const hasData = Object.keys(this.latestRealTimeData).length > 0;
      return hasData ? 'connected' : 'disconnected';
    }
  },

  mounted() {
    this.initChart();
    this.startOfflineCheck();
    this.startBackendConnectionCheck();
    console.log('🔧 管段沿线监测组件已挂载，将从Vuex store读取实时数据');
    console.log('🔍 初始连接状态:', {
      backendConnected: this.backendConnected,
      connectionStatus: this.connectionStatus,
      statusText: this.getConnectionStatusText
    });
  },

  beforeDestroy() {
    // 清理定时器
    if (this.offlineCheckTimer) {
      clearInterval(this.offlineCheckTimer);
    }
    if (this.connectionCheckTimer) {
      clearInterval(this.connectionCheckTimer);
    }
    console.log('🔧 管段沿线监测组件即将销毁');
  },

  watch: {
    // 监听数据更新标记，更新最后数据更新时间
    getRealTimeUpdateFlag() {
      this.lastDataUpdateTime = Date.now();
      this.connectionStatus = 'connected';
    }
  },

  methods: {
    // 启动离线检测
    startOfflineCheck() {
      // 初始化最后更新时间
      this.lastDataUpdateTime = Date.now();

      // 每10秒检查一次连接状态
      this.offlineCheckTimer = setInterval(() => {
        const timeDiff = Date.now() - this.lastDataUpdateTime;

        if (timeDiff > 120000) { // 2分钟没有数据更新
          if (this.connectionStatus !== 'disconnected') {
            this.connectionStatus = 'disconnected';
            console.warn('🔴 管段沿线监测：检测到数据超时，标记为离线状态');
          }
        } else if (timeDiff > 60000) { // 1分钟没有数据更新，显示警告
          if (this.connectionStatus !== 'connecting') {
            this.connectionStatus = 'connecting';
            console.warn('🟡 管段沿线监测：数据更新延迟，可能存在连接问题');
          }
        } else {
          if (this.connectionStatus !== 'connected') {
            this.connectionStatus = 'connected';
            console.log('🟢 管段沿线监测：连接状态正常');
          }
        }
      }, 10000); // 每10秒检查一次
    },

    // 切换离线模式（用于测试）
    toggleOfflineMode() {
      this.manualOfflineMode = !this.manualOfflineMode;
      console.log(`🔄 手动切换离线模式: ${this.manualOfflineMode ? '离线' : '在线'}`);
    },

    // 启动后端连接检测
    startBackendConnectionCheck() {
      // 立即检测一次
      this.checkBackendConnection();

      // 每10秒检测一次后端连接
      this.connectionCheckTimer = setInterval(() => {
        this.checkBackendConnection();
      }, 10000);
    },

    // 检测后端连接
    async checkBackendConnection() {
      try {
        // 创建一个带超时的Promise
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('连接超时')), 5000);
        });

        const fetchPromise = fetch('/api/hpdg/realtime/latest', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
            // 不添加Authorization头，允许无token访问
          }
        });

        // 使用Promise.race来实现超时
        const response = await Promise.race([fetchPromise, timeoutPromise]);

        if (response.ok) {
          this.backendConnected = true;
          this.connectionStatus = 'connected';
          console.log('🟢 后端连接正常');
        } else {
          this.backendConnected = false;
          this.connectionStatus = 'disconnected';
          console.warn('🔴 后端连接失败 - HTTP错误:', response.status);
        }
      } catch (error) {
        this.backendConnected = false;
        this.connectionStatus = 'disconnected';
        console.warn('🔴 后端连接失败:', error.message);
      }
    },

    initChart() {
      const chartDom = document.getElementById('pipe_section');
      this.pipe_section = echarts.init(chartDom);
      this.drawPipeSection();
    },
    drawPipeSection() {
      const targetCoord = [500, 650]
      const curveness = 0
      const linesData = []
      const categories = [{
        name: '流入中',
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
              offset: 0,
              color: '#01acca'
            }, {
              offset: 1,
              color: '#5adbe7'
            }]),
          }
        },
        label: {
          normal: {
            fontSize: '14'
          }
        },
      }]

      // 东莞站配置
      const item = {
        name: "东莞",
        value: targetCoord,
        symbol: 'image://https://s2.loli.net/2024/09/14/53QbwinMOSI8Vxt.png',
        symbolSize: [100, 100],
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
              offset: 0,
              color: '#157eff'
            }, {
              offset: 1,
              color: '#35c2ff'
            }]),
          }
        },
        label: {
          normal: {
            fontSize: '20',
            color: "white",
            offset: [0, 10]
          }
        },
        // 添加站点数据配置
        stationType: 'endStation',
        stationData: {
          environmentTemp: 24,
          inletPressure: 0.8,
          inletTemp: 85,
          outletPressure: 0.6,
          outletTemp: 84
        }
      }

      // 黄埔站配置
      const items = [{
        name: "黄埔",
        category: 0,
        active: true,
        symbol: 'image://https://s2.loli.net/2024/09/14/53QbwinMOSI8Vxt.png',
        speed: '',
        symbolSize: [100, 100],
        value: [0, 650],
        label: {
          normal: {
            fontSize: '20',
            color: "white",
            offset: [0, 10]
          }
        },
        stationType: 'startStation',
        stationData: {
          environmentTemp: 26,
          inletPressure: 2.6,
          inletTemp: 88,
          outletPressure: 2.4,
          outletTemp: 87
        }
      }, {
        name: "十字窖#1",
        category: 0,
        active: false,
        symbolSize: 15,
        itemStyle: {
          color: '#d4ac0d',
        },
        value: [200, 650],
        label: {
          normal: {
            fontSize: '16',
            color: "white",
            offset: [0, 10]
          }
        },
        stationType: 'valve',
        valveIndex: 1,
        stationData: {
          environmentTemp: 25,
          inletPressure: 2.2,
          inletTemp: 87.5,
          outletPressure: 1.8,
          outletTemp: 86.5
        }
      }, {
        name: "十字窖#2",
        category: 0,
        active: false,
        symbolSize: 15,
        itemStyle: {
          color: '#d4ac0d',
        },
        value: [350, 650],
        label: {
          normal: {
            fontSize: '16',
            color: "white",
            offset: [0, 10]
          }
        },
        stationType: 'valve',
        valveIndex: 2,
        stationData: {
          environmentTemp: 24.5,
          inletPressure: 1.8,
          inletTemp: 86.5,
          outletPressure: 1.4,
          outletTemp: 85.5
        }
      }]

      const data = items.concat([item])

      // 根据选中状态更新站点和阀门点样式
      data.forEach((point, index) => {
        const isSelected = this.selectedValves.some(selectedValve =>
          selectedValve.valveName === point.name
        );

        // 更新样式
        if (isSelected) {
          if (point.stationType === 'valve') {
            point.symbolSize = 20;
            point.itemStyle = {
              color: '#52c41a',
              shadowColor: '#52c41a',
              shadowBlur: 15,
              borderColor: '#ffffff',
              borderWidth: 2
            };
          } else {
            // 站点选中时的样式 - 确保itemStyle存在
            if (!point.itemStyle) {
              point.itemStyle = {};
            }
            if (!point.itemStyle.normal) {
              point.itemStyle.normal = {};
            }
            point.itemStyle = {
              ...point.itemStyle,
              normal: {
                ...point.itemStyle.normal,
                shadowColor: '#52c41a',
                shadowBlur: 20,
                borderColor: '#ffffff',
                borderWidth: 3
              }
            };
          }
        } else {
          if (point.stationType === 'valve') {
            point.symbolSize = 15;
            point.itemStyle = {
              color: '#d4ac0d',
              opacity: 0.8
            };
          }
          // 站点保持原有样式
        }

        if (point.active) {
          linesData.push([{
            coord: point.value
          }, {
            coord: targetCoord
          }])
        }
      });

      const links = items.map((el) => {
        return {
          source: el.name,
          target: item.name,
          speed: el.speed,
          lineStyle: {
            normal: {
              color: '#12b5d0',
              curveness: curveness,
              width: 10
            }
          },
        }
      })

      var option = {
        grid: {
          top: 30,
          left: 80,
          right: 80
        },
        legend: [{
          show: false,
          formatter: function (name) {
            return echarts.format.truncateText(name, 100, '14px Microsoft Yahei', '…');
          },
          tooltip: {
            show: true
          },
          textStyle: {
            color: '#999'
          },
          selectedMode: false,
          right: 0,
          data: categories.map(function (el) {
            return el.name
          })
        }],
        xAxis: {
          show: false,
          type: 'value'
        },
        yAxis: {
          show: false,
          type: 'value'
        },
        series: [{
          type: 'graph',
          layout: 'none',
          coordinateSystem: 'cartesian2d',
          symbolSize: 60,
          z: 3,
          edgeLabel: {
            normal: {
              show: false,
              textStyle: {
                fontSize: 14
              },

            }
          },
          label: {
            normal: {
              show: true,
              position: 'bottom',
              color: '#fff'
            }
          },
          itemStyle: {
            normal: {
              shadowColor: 'none'
            },
            emphasis: {

            }
          },
          lineStyle: {
            normal: {
              width: 10,
              shadowColor: 'none'
            },
          },
          edgeSymbol: ['none', 'none'],
          edgeSymbolSize: 8,
          data: data,
          links: links,
          categories: categories
        }, {
          name: 'A',
          type: 'lines',
          coordinateSystem: 'cartesian2d',
          z: 1,
          effect: {
            show: true,
            smooth: false,
            trailLength: 0,
            symbol: "arrow",
            color: '#3498db',
            symbolSize: 21
          },
          lineStyle: {
            normal: {
              curveness: curveness,
              width: 18
            }
          },
          data: linesData
        }, {
          name: 'Scatter',
          type: 'scatter',
          symbol: 'image://https://s2.loli.net/2024/09/14/TJ3RGyusxcqm6lb.png',
          data: [
            [200, 550],  // 对应十字窖#1
            [350, 550]   // 对应十字窖#2
          ],
          label: {
            normal: {
              show: true,
              textStyle: {
                color: '#fff',
                fontSize: 20,
              },
              formatter: function (params) {
                return '' //✔
              },
            }
          },
          symbolSize: function (data) {
            return 30
          },
          itemStyle: {
            color: 'red'
          }
        }]
      };
      this.pipe_section.setOption(option);

      // 添加点击事件监听器
      this.pipe_section.off('click');
      this.pipe_section.on('click', (params) => {
        if (params.seriesType === 'graph' && params.data.name) {
          console.log('站点/阀门被点击:', params.data.name);
          
          // 构造点击数据
          const clickData = {
            valveName: params.data.name,
            valveIndex: params.data.valveIndex || 0,
            stationType: params.data.stationType || 'valve',
            stationData: params.data.stationData || {},
            x: params.data.value[0],
            y: params.data.value[1]
          };
          
          // 发送点击事件到父组件
          this.$emit('valve-clicked', clickData);
        }
        

        
        // 检查是否点击了感叹号图标（警告图标）
        if (params.seriesName === 'Scatter') {
          console.log('警告图标被点击', params);

          // 根据点击位置获取对应的阀门点数据
          let valveIndex = -1;
          if (params.dataIndex === 0) valveIndex = 1;  // 对应十字窖#1
          else if (params.dataIndex === 1) valveIndex = 2;  // 对应十字窖#2

          if (valveIndex >= 0) {
            const targetValve = items.find(item => item.valveIndex === valveIndex);
            if (targetValve) {
              this.$emit('valve-clicked', {
                valveName: targetValve.name,
                valveIndex: valveIndex,
                stationType: 'valve',
                stationData: targetValve.stationData,
                x: targetValve.value[0],
                y: targetValve.value[1]
              });
            }
          }
        }
      });
    },
    updateChart() {
      // 可以根据pipelineId更新图表
      this.drawPipeSection();
    },



    // 发送实时数据到父组件
    emitRealTimeData() {
      // 发送最新的实时数据到父组件（用于参数对比分析）
      this.$emit('real-time-data', this.latestRealTimeData);
    }
  },
  watch: {
    pipelineId() {
      this.updateChart();
    },
    selectedValves: {
      handler(newValves) {
        // 当选中阀室列表变化时，重新绘制图表以更新样式
        this.updateChart();
      },
      deep: true
    },

    // 监听store中的实时数据更新
    getRealTimeUpdateFlag() {
      console.log('📊 检测到store中实时数据更新，发送到父组件');
      this.emitRealTimeData();
    },

    // 监听最新实时数据变化
    latestRealTimeData: {
      handler(newData) {
        if (Object.keys(newData).length > 0) {
          console.log('📊 管段沿线监测数据更新:', newData);
          this.emitRealTimeData();
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.pipeline-container {
  height: calc(100% - 40px);
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

#pipe_section {
  height: 70%;
  width: 100%;
}

.parameter-display {
  height: 30%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: rgba(0, 21, 41, 0.3);
  border-top: 1px solid rgba(102, 223, 251, 0.3);
  padding: 0 10px;
}

.parameters-row {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  gap: 2px;
}

.parameter-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 5px;
  position: relative;
}

.parameter-item:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 25%;
  height: 50%;
  width: 1px;
  background-color: rgba(102, 223, 251, 0.2);
}

.parameter-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin-bottom: 8px;
}

.parameter-value {
  color: #66dffb;
  font-size: 18px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.parameter-value.realtime {
  color: #52c41a;
  text-shadow: 0 0 5px rgba(82, 196, 26, 0.5);
}

.parameter-value.offline {
  color: #ff4d4f;
  opacity: 0.7;
  animation: offline-blink 2s infinite;
  text-shadow: 0 0 5px rgba(255, 77, 79, 0.5);
}

@keyframes offline-blink {
  0%, 50% {
    opacity: 0.7;
  }
  25%, 75% {
    opacity: 0.4;
  }
}



.parameter-value.sequential {
  color: #40a9ff;
  text-shadow: 0 0 5px rgba(64, 169, 255, 0.5);
  animation: sequential-update 1s ease-in-out;
}



@keyframes sequential-update {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.connection-indicator {
  position: absolute;
  top: 120px;
  right: 5px;
  display: flex;
  align-items: center;
  z-index: 100;
  background: rgba(0, 21, 41, 0.8);
  border-radius: 12px;
  padding: 2px 6px;
  border: 1px solid rgba(102, 223, 251, 0.2);
}

.indicator-online {
  color: #00ff00;
  text-shadow: 0 0 3px rgba(0, 255, 0, 0.6);
  animation: pulse 2s infinite;
  font-size: 8px;
}



.indicator-offline {
  color: #ff6b6b;
  animation: blink 1s infinite;
  font-size: 8px;
}

.connection-text {
  margin-left: 3px;
  color: #999;
  font-size: 10px;
  font-weight: 500;
}

/* 动画效果 */
@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0.3;
  }
}

/* 连接状态指示器样式 */
.connection-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.indicator-online {
  color: #52c41a;
  text-shadow: 0 0 5px rgba(82, 196, 26, 0.8);
  animation: online-pulse 2s infinite;
}

.indicator-offline {
  color: #ff4d4f;
  text-shadow: 0 0 5px rgba(255, 77, 79, 0.8);
  animation: offline-blink 1.5s infinite;
}

.text-online {
  color: #52c41a;
  font-weight: 500;
}

.text-offline {
  color: #ff4d4f;
  font-weight: 500;
  animation: offline-text-blink 2s infinite;
}

@keyframes online-pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

@keyframes offline-blink {
  0%, 50% {
    opacity: 1;
  }
  25%, 75% {
    opacity: 0.3;
  }
}

@keyframes offline-text-blink {
  0%, 70% {
    opacity: 1;
  }
  85% {
    opacity: 0.5;
  }
}


</style>