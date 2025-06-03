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
            <span class="parameter-label">土壤温度</span>
            <span class="parameter-value">16℃</span>
          </div>
          <div class="parameter-item">
            <span class="parameter-label">环境温度</span>
            <span class="parameter-value" :class="environmentTempStatus">{{ displayEnvironmentTemp }}</span>
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
        <span :class="connectionIndicatorClass">{{ connectionStatus === 'connected' ? '●' : '●' }}</span>
        <span class="connection-text">{{ connectionStatus === 'connected' ? '实时' : '离线' }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'PipelineVisualization',
  props: {
    pipelineId: {
      type: String,
      default: 'pipeline1'
    }
  },
  data() {
    return {
      pipe_section: null,
      
      // WebSocket连接
      ws: null,
      
      // 实时数据
      realtimeData: null,
      
      // 连接状态
      connectionStatus: 'disconnected',
      
      // 静态默认值
      defaultValues: {
        environmentTemp: 25,
        inletPressure: 2.6,
        inletTemp: 88,
        outletPressure: 0.8,
        outletTemp: 88
      }
    }
  },

  computed: {
    // 环境温度显示
    displayEnvironmentTemp() {
      // 这里可以根据实际需要计算环境温度，目前使用默认值
      return `${this.defaultValues.environmentTemp}℃`;
    },

    // 进站压力显示
    displayInletPressure() {
      if (this.realtimeData && this.realtimeData.STN11_00_PI001 !== undefined) {
        return `${Number(this.realtimeData.STN11_00_PI001).toFixed(2)}MPa`;
      }
      return `${this.defaultValues.inletPressure}MPa`;
    },

    // 进站温度显示
    displayInletTemp() {
      if (this.realtimeData && this.realtimeData.STN11_00_TI001 !== undefined) {
        return `${Number(this.realtimeData.STN11_00_TI001).toFixed(1)}℃`;
      }
      return `${this.defaultValues.inletTemp}℃`;
    },

    // 出站压力显示
    displayOutletPressure() {
      if (this.realtimeData && this.realtimeData.STN10_00_PI019A !== undefined) {
        return `${Number(this.realtimeData.STN10_00_PI019A).toFixed(2)}MPa`;
      }
      return `${this.defaultValues.outletPressure}MPa`;
    },

    // 出站温度显示
    displayOutletTemp() {
      if (this.realtimeData && this.realtimeData.STN10_00_TI002 !== undefined) {
        return `${Number(this.realtimeData.STN10_00_TI002).toFixed(1)}℃`;
      }
      return `${this.defaultValues.outletTemp}℃`;
    },

    // 数据状态样式类
    environmentTempStatus() {
      return this.connectionStatus === 'connected' ? 'realtime' : 'offline';
    },

    inletPressureStatus() {
      return this.connectionStatus === 'connected' && this.realtimeData && this.realtimeData.STN11_00_PI001 !== undefined ? 'realtime' : 'offline';
    },

    inletTempStatus() {
      return this.connectionStatus === 'connected' && this.realtimeData && this.realtimeData.STN11_00_TI001 !== undefined ? 'realtime' : 'offline';
    },

    outletPressureStatus() {
      return this.connectionStatus === 'connected' && this.realtimeData && this.realtimeData.STN10_00_PI019A !== undefined ? 'realtime' : 'offline';
    },

    outletTempStatus() {
      return this.connectionStatus === 'connected' && this.realtimeData && this.realtimeData.STN10_00_TI002 !== undefined ? 'realtime' : 'offline';
    },

    // 连接状态指示器样式
    connectionIndicatorClass() {
      return this.connectionStatus === 'connected' ? 'indicator-online' : 'indicator-offline';
    }
  },

  mounted() {
    this.initChart();
    this.connectWebSocket();
  },

  beforeDestroy() {
    this.closeWebSocket();
  },

  methods: {
    // 连接WebSocket
    connectWebSocket() {
      try {
        this.ws = new WebSocket('ws://127.0.0.1:3092');
        
        this.ws.onopen = () => {
          console.log('管段监测WebSocket连接成功');
          this.connectionStatus = 'connected';
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('收到管段监测数据:', data);
            
            // 更新实时数据
            this.realtimeData = data;
            
          } catch (error) {
            console.error('解析管段监测数据失败:', error);
          }
        };

        this.ws.onclose = () => {
          console.log('管段监测WebSocket连接关闭');
          this.connectionStatus = 'disconnected';
          // 5秒后尝试重连
          setTimeout(() => {
            if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
              this.connectWebSocket();
            }
          }, 5000);
        };

        this.ws.onerror = (error) => {
          console.error('管段监测WebSocket连接错误:', error);
          this.connectionStatus = 'disconnected';
        };

      } catch (error) {
        console.error('创建管段监测WebSocket连接失败:', error);
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
      }

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
      }, {
        name: "阀点#1",
        category: 0,
        active: false,
        symbolSize: 10,
        itemStyle: {
          color: '#d4ac0d',
        },
        value: [40, 650],
        label: {
          normal: {
            fontSize: '16',
            color: "white",
            offset: [0, 10]
          }
        },
      },
      {
        name: "阀点#2",
        category: 0,
        active: false,
        symbolSize: 10,
        itemStyle: {
          color: '#d4ac0d',
        },
        value: [80, 650],
        label: {
          normal: {
            fontSize: '16',
            color: "white",
            offset: [0, 10]
          }
        },
      }, {
        name: "阀点#3",
        category: 0,
        active: false,
        symbolSize: 10,
        itemStyle: {
          color: '#d4ac0d',
        },
        value: [120, 650],
        label: {
          normal: {
            fontSize: '16',
            color: "white",
            offset: [0, 10]
          }
        },
      }, {
        name: "阀点#4",
        category: 0,
        active: false,
        symbolSize: 10,
        itemStyle: {
          color: '#d4ac0d',
        },
        value: [160, 650],
        label: {
          normal: {
            fontSize: '16',
            color: "white",
            offset: [0, 10]
          }
        },
      }, {
        name: "阀点#5",
        category: 0,
        active: false,
        symbolSize: 10,
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
      }, {
        name: "阀点#6",
        category: 0,
        active: false,
        symbolSize: 10,
        itemStyle: {
          color: '#d4ac0d',
        },
        value: [240, 650],
        label: {
          normal: {
            fontSize: '16',
            color: "white",
            offset: [0, 10]
          }
        },
      }, {
        name: "阀点#7",
        category: 0,
        active: false,
        symbolSize: 10,
        itemStyle: {
          color: '#d4ac0d',
        },
        value: [280, 650],
        label: {
          normal: {
            fontSize: '16',
            color: "white",
            offset: [0, 10]
          }
        },
      }, {
        name: "阀点#8",
        category: 0,
        active: false,
        symbolSize: 10,
        itemStyle: {
          color: '#d4ac0d',
        },
        value: [320, 650],
        label: {
          normal: {
            fontSize: '16',
            color: "white",
            offset: [0, 10]
          }
        },
      }, {
        name: "阀点#9",
        category: 0,
        active: false,
        symbolSize: 10,
        itemStyle: {
          color: '#d4ac0d',
        },
        value: [360, 650],
        label: {
          normal: {
            fontSize: '16',
            color: "white",
            offset: [0, 10]
          }
        },
      }, {
        name: "阀点#10",
        category: 0,
        active: false,
        symbolSize: 10,
        itemStyle: {
          color: '#d4ac0d',
        },
        value: [400, 650],
        label: {
          normal: {
            fontSize: '16',
            color: "white",
            offset: [0, 10]
          }
        },
      }, {
        name: "阀点#11",
        category: 0,
        active: false,
        symbolSize: 10,
        itemStyle: {
          color: '#d4ac0d',
        },
        value: [440, 650],
        label: {
          normal: {
            fontSize: '16',
            color: "white",
            offset: [0, 10]
          }
        },
      }]

      const data = items.concat([item])

      items.forEach(function (el) {
        if (el.active) {
          linesData.push([{
            coord: el.value
          }, {
            coord: targetCoord
          }])
        }
      })

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
            [360, 550],  // Y坐标调小，确保在管道线上方
            [280, 550],  // Y坐标调小，确保在管道线上方
            [200, 550],  // Y坐标调小，确保在管道线上方
            [120, 550]   // Y坐标调小，确保在管道线上方
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
        // 检查点击的是否是阀门点
        if (params.seriesType === 'graph' && params.data.name && params.data.name.includes('阀点')) {
          console.log('阀门点被点击', params.data.name);
          this.$emit('valve-clicked', {
            valveName: params.data.name,
            valveIndex: parseInt(params.data.name.replace(/[^0-9]/g, '')) || 0
          });
        }
        
        // 检查是否点击了感叹号图标（警告图标）
        if (params.seriesName === 'Scatter') {
          console.log('警告图标被点击', params);

          // 根据点击位置获取对应的阀门点数据
          let valveIndex = -1;
          if (params.dataIndex === 0) valveIndex = 8;  // 对应阀点#9
          else if (params.dataIndex === 1) valveIndex = 6;  // 对应阀点#7
          else if (params.dataIndex === 2) valveIndex = 4;  // 对应阀点#5
          else if (params.dataIndex === 3) valveIndex = 2;  // 对应阀点#3

          if (valveIndex >= 0) {
            this.$emit('valve-clicked', {
              valveName: items[valveIndex].name,
              valveIndex: valveIndex
            });
          }
        }
      });
    },
    updateChart() {
      // 可以根据pipelineId更新图表
      this.drawPipeSection();
    }
  },
  watch: {
    pipelineId() {
      this.updateChart();
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
  flex-wrap: nowrap;
  width: 100%;
  height: 100%;
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
  color: #faad14;
  opacity: 0.8;
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
</style> 