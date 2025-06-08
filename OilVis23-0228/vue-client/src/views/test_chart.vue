<template>
  <div class='chart-container' style='width:100%;height:350px'>
    <div :id='chartId' style='width:100%;height:100%'></div>
  </div>
</template>

<script>
import uuidv1 from 'uuid/v1'
import * as echarts from 'echarts'

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
      samplingInterval: 50 // 数据抽样间隔，每50个数据点显示一个
    }
  },
  created() {
    this.chartId = uuidv1()
  },
  mounted() {
    this.initChart()
    this.fetchPipelineData()
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
    }
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler)
    }
  },
  methods: {
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

    renderChart() {
      if (!this.pipelineData || this.pipelineData.length === 0) {
        console.warn('⚠️ 没有数据可渲染')
        return
      }

      const pressureData = this.generatePressureData()
      const temperatureData = this.generateTemperatureData()
      const elevationData = this.generateElevationData()

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
          data: ['沿线压力', '沿线温度', '沿线高程'],
          top: 50,
          textStyle: {
            color: '#ffffff',
            fontSize: 12
          },
          itemWidth: 20,
          itemHeight: 12
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            start: 0,
            end: 100,
            bottom: 60,
            height: 20,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23.1h6.6V24.4z M13.3,19.6H6.7v-1.2h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
              color: '#1a9bfc',
              shadowBlur: 3,
              shadowColor: 'rgba(0, 0, 0, 0.6)',
              shadowOffsetX: 2,
              shadowOffsetY: 2
            },
            textStyle: {
              color: '#ffffff',
              fontSize: 11
            },
            borderColor: 'rgba(26, 155, 252, 0.5)',
            fillerColor: 'rgba(26, 155, 252, 0.2)',
            backgroundColor: 'rgba(47, 69, 84, 0.8)'
          },
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
            symbol: 'circle',
            symbolSize: 4,
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
            symbol: 'triangle',
            symbolSize: 4,
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
            symbol: 'diamond',
            symbolSize: 4,
            lineStyle: {
              color: '#3399ff',
              width: 3
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
            }
          }
        ],
        backgroundColor: 'transparent'
      }

      this.chart.setOption(option, true)
      
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
