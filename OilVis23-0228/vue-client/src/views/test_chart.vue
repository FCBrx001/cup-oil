<template>
  <div class='chartground' style='width:100%;height:350px'>
    <div :id='elId' style='width:100%;height:100%'></div>
    <el-dialog :visible.sync="dialogVisible" :title="`里程点 ${clickInfo.distance}km 压力变化趋势`" width="50%" style="height: 100%;top: 80px;" :modal="true"
      :modal-append-to-body="false" :append-to-body="true" :close-on-click-modal="true" :show-close="true"
      destroy-on-close custom-class="dark-dialog large-dialog">
      <div class="trend-container">
        <div class="time-selector">
          <div class="selector-group">
            <el-radio-group v-model="timeRange" @change="handleTimeRangeChange" size="small">
              <el-radio-button label="24h">24小时</el-radio-button>
              <el-radio-button label="7d">7天</el-radio-button>
              <el-radio-button label="30d">30天</el-radio-button>
            </el-radio-group>
            <el-date-picker v-model="selectedDate" type="date" placeholder="选择日期" format="yyyy-MM-dd"
              value-format="yyyy-MM-dd" @change="handleDateChange" size="small" style="margin-left: 20px;">
            </el-date-picker>
          </div>
        </div>
        <div id="trendChart" style="width:100%;height:450px;"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import uuidv1 from 'uuid/v1'
import * as echarts from 'echarts'

export default {
  name: 'TestChart',
  data() {
    return {
      elId: '',
      charts: null,
      trendChart: null,
      times: 1,
      distance: 94.4, // 恩平到阳江的直线距离（公里）
      numPoints: 10,  // 数据点数量
      pressure: [],
      elevation: [],
      temperature: [],
      pressureColumns: [], // 存储所有压力液柱数据
      dialogVisible: false,
      timeRange: '24h',
      selectedDate: new Date().toISOString().split('T')[0],
      clickInfo: {
        distance: 0,
        elevation: 0,
        pressure: 0
      }
    }
  },
  created() {
    this.elId = uuidv1()
  },
  mounted() {
    this.generateRandomData()
    this.drawLine(this.elId)
  },
  methods: {
    generateRandomData() {
      // 生成带趋势的随机数据（用于高程）
      const generateTrend = (start, end, volatility = 0.05) => {
        const result = []
        const step = (end - start) / this.numPoints
        for (let i = 0; i <= this.numPoints; i++) {
          const baseValue = start + i * step
          const randomFluctuation = (Math.random() - 0.5) * volatility * baseValue
          result.push((baseValue + randomFluctuation).toFixed(2))
        }
        return result
      }

      // 生成更真实的压力数据
      const generatePressure = () => {
        const result = []
        const basePressure = 2.02 // 基础压力
        let currentPressure = basePressure

        for (let i = 0; i <= this.numPoints; i++) {
          // 模拟地形影响 - 增加波动幅度
          const terrainEffect = Math.sin(i / this.numPoints * Math.PI * 5) * 0.05 +
                              Math.cos(i / this.numPoints * Math.PI * 2) * 0.03

          // 模拟流量波动影响 - 增加随机性
          const flowEffect = (Math.random() - 0.5) * 0.03

          // 模拟管道摩擦损失 - 保持基本趋势
          const frictionEffect = -(i / this.numPoints) * 0.02

          // 添加周期性波动
          const periodicEffect = Math.sin(i / this.numPoints * Math.PI * 8) * 0.04

          // 组合所有影响因素
          currentPressure = basePressure + terrainEffect + flowEffect + frictionEffect + periodicEffect

          // 确保压力在合理范围内
          currentPressure = Math.max(1.95, Math.min(2.1, currentPressure))

          result.push(currentPressure.toFixed(3))
        }
        return result
      }

      // 生成更真实的温度数据
      const generateTemperature = () => {
        const result = []
        const baseTemp = 45 // 油品基础温度，一般在45度左右
        let currentTemp = baseTemp
        let trend = 0 // 用于生成温度趋势

        for (let i = 0; i <= this.numPoints; i++) {
          // 模拟管道保温效果下的缓慢热损失 - 增加波动
          const heatLoss = -(i / this.numPoints) * 5 + 
                          Math.sin(i / this.numPoints * Math.PI * 3) * 2

          // 模拟局部热交换影响 - 增加波动频率
          const localEffect = Math.sin(i / this.numPoints * Math.PI * 6) * 1.5 +
                            Math.cos(i / this.numPoints * Math.PI * 4) * 0.8

          // 模拟微小的随机波动 - 增加波动幅度
          const randomEffect = (Math.random() - 0.5) * 0.8

          // 添加周期性温度波动
          const periodicEffect = Math.sin(i / this.numPoints * Math.PI * 10) * 1.2

          // 添加缓慢的温度趋势变化
          trend += (Math.random() - 0.5) * 0.1
          trend = Math.max(-1.5, Math.min(1.5, trend))

          // 组合所有影响因素
          currentTemp = baseTemp + heatLoss + localEffect + randomEffect + trend + periodicEffect

          // 确保温度在合理范围内
          currentTemp = Math.max(38, Math.min(52, currentTemp))

          result.push(currentTemp.toFixed(2))
        }
        return result
      }

      // 生成所有点的压力液柱数据
      const generatePressureColumns = (elevationData, pressureData) => {
        const result = []
        const step = this.distance / this.numPoints
        const maxPressure = Math.max(...this.pressure) + 0.1
        const minPressure = Math.min(...this.pressure) - 0.1

        for (let i = 0; i <= this.numPoints; i++) {
          const position = i * step
          const baseHeight = parseFloat(elevationData[i])
          const pressure = parseFloat(this.pressure[i])
          const fixedHeight = 200
          const pressureRatio = (pressure - minPressure) / (maxPressure - minPressure)
          const dataHeight = fixedHeight * pressureRatio

          // 外框（背景柱）
          result.push({
            name: `压力外框${i}`,
            type: 'line',
            data: [[position, baseHeight], [position, baseHeight + fixedHeight]],
            symbol: 'none',
            lineStyle: {
              width: 20,
              color: '#0e2147',
              borderRadius: 4
            },
            emphasis: {
              lineStyle: {
                width: 20
              }
            },
            yAxisIndex: 3
          })

          // 内部液柱
          result.push({
            name: `压力液柱${i}`,
            type: 'line',
            data: [[position, baseHeight], [position, baseHeight + dataHeight]],
            symbol: 'none',
            lineStyle: {
              width: 14,
              color: '#1a9bfc',
              borderRadius: 4
            },
            emphasis: {
              lineStyle: {
                width: 14
              }
            },
            tooltip: {
              formatter: function (params) {
                return `距离: ${position.toFixed(1)} km
                          沿线压力: ${pressure.toFixed(3)} MPa
                          沿线高程: ${baseHeight} m
                          沿线温度: ${this.temperature[i]} ℃`
              }
            },
            yAxisIndex: 3
          })

          // 压力值文本显示
          // result.push({
          //   name: `压力值${i}`,
          //   type: 'scatter',
          //   data: [[position, baseHeight + dataHeight + 10]],
          //   symbol: 'none',
          //   label: {
          //     show: true,
          //     formatter: `${pressure.toFixed(2)}`,
          //     position: 'top',
          //     color: '#fff',
          //     fontSize: 12
          //   },
          //   yAxisIndex: 3
          // })
        }
        return result
      }

      this.elevation = generateTrend(60, 500, 2)   // 米
      this.pressure = generatePressure()  // MPa
      this.temperature = generateTemperature()    // ℃
      this.pressureColumns = generatePressureColumns(this.elevation, this.pressure)
    },

    handleTimeRangeChange(value) {
      console.log('Time range changed:', value)
      this.showPressureTrend()
    },

    handleDateChange(value) {
      console.log('Date changed:', value)
      this.showPressureTrend()
    },

    // 生成压力趋势数据
    generatePressureTrend(baseValue) {
      const data = []
      let points = 24
      let interval = '小时'

      switch (this.timeRange) {
        case '7d':
          points = 7 * 24
          interval = '天'
          break
        case '30d':
          points = 30 * 24
          interval = '天'
          break
        default:
          points = 24
          interval = '小时'
      }

      for (let i = 0; i < points; i++) {
        // 添加随机波动，但保持在合理范围内
        const randomFluctuation = (Math.random() - 0.5) * 0.05
        const value = baseValue + randomFluctuation

        let timeLabel
        if (interval === '小时') {
          timeLabel = `${(i % 24).toString().padStart(2, '0')}:00`
        } else {
          const date = new Date(this.selectedDate)
          date.setDate(date.getDate() + Math.floor(i / 24))
          timeLabel = `${date.getMonth() + 1}/${date.getDate()}`
        }

        data.push([
          timeLabel,
          parseFloat(value.toFixed(3))
        ])
      }

      // 如果是按天显示，则取每天的平均值
      if (interval === '天') {
        const dailyData = []
        for (let i = 0; i < data.length; i += 24) {
          const dayData = data.slice(i, i + 24)
          const avgValue = dayData.reduce((sum, item) => sum + item[1], 0) / dayData.length
          dailyData.push([dayData[0][0], parseFloat(avgValue.toFixed(3))])
        }
        return dailyData
      }

      return data
    },

    // 显示压力趋势图
    showPressureTrend() {
      this.$nextTick(() => {
        if (this.trendChart) {
          this.trendChart.dispose()
        }

        this.trendChart = echarts.init(document.getElementById('trendChart'))
        const trendData = this.generatePressureTrend(this.clickInfo.pressure)

        const trendOptions = {
          // backgroundColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          //   offset: 0,
          //   color: '#0f1c3c'
          // }, {
          //   offset: 1,
          //   color: '#0a1128'
          // }]),
          grid: {
            left: '5%',
            right: '5%',
            bottom: '10%',
            top: '10%',
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
            backgroundColor: 'rgba(0,0,0,0.7)',
            borderWidth: 0,
            textStyle: {
              color: '#fff'
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: trendData.map(item => item[0]),
            axisLabel: {
              color: 'rgba(255,255,255,0.8)',
              rotate: this.timeRange !== '24h' ? 45 : 0
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(255,255,255,0.3)'
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgba(255,255,255,0.1)',
                type: 'dashed'
              }
            }
          },
          yAxis: {
            type: 'value',
            name: '压力(MPa)',
            nameTextStyle: {
              color: 'rgba(255,255,255,0.8)'
            },
            min: function (value) {
              return (value.min - 0.05).toFixed(3)
            },
            max: function (value) {
              return (value.max + 0.05).toFixed(3)
            },
            axisLabel: {
              color: 'rgba(255,255,255,0.8)',
              formatter: '{value} MPa'
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(255,255,255,0.3)'
              }
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(255,255,255,0.1)'
              }
            }
          },
          series: [{
            name: '压力',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: this.timeRange === '24h' ? 8 : 6,
            data: trendData.map(item => item[1]),
            lineStyle: {
              width: 3,
              color: '#1a9bfc'
            },
            itemStyle: {
              color: '#1a9bfc',
              borderWidth: 2,
              borderColor: '#fff'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(26,155,252,0.3)'
                },
                {
                  offset: 1,
                  color: 'rgba(26,155,252,0.1)'
                }
              ])
            }
          }]
        }

        this.trendChart.setOption(trendOptions)
      })
    },

    drawLine(id) {
      if (this.times === 1) {
        this.charts = echarts.init(document.getElementById(id))
        // 添加点击事件监听
        this.charts.on('click', (params) => {
          console.log('Chart clicked:', params)
          console.log('Series name:', params.seriesName)
          console.log('Data:', params.data)

          if (params.seriesName === '沿线高程') {
            console.log('Elevation point clicked!')
            // 确保数据存在且为数字
            const distance = typeof params.data[0] === 'number' ? params.data[0] : parseFloat(params.data[0])
            const elevation = typeof params.data[1] === 'number' ? params.data[1] : parseFloat(params.data[1])
            const pressureIndex = Math.floor(distance / (this.distance / this.numPoints))
            const pressure = parseFloat(this.pressure[pressureIndex])

            this.clickInfo.distance = distance.toFixed(1)
            this.clickInfo.elevation = elevation.toFixed(2)
            this.clickInfo.pressure = pressure

            this.dialogVisible = true
            this.showPressureTrend()
          }
        })
        this.times++
      }
      const options = {
        // backgroundColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
        //   offset: 0,
        //   color: '#0f1c3c'
        // }, {
        //   offset: 1,
        //   color: '#0a1128'
        // }]),
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#2a2a2a',
              color: '#fff',
              fontSize: 12
            }
          },
          formatter: (params) => {
            const distance = params[0].data[0].toFixed(1)
            const mainData = params.filter(p =>
              ['沿线压力', '沿线高程', '沿线温度'].includes(p.seriesName)
            )
            return `
              <div style="padding:10px;background:rgba(0,0,0,0.8);border-radius:4px">
                <div style="color:white;margin-bottom:5px;font-weight:bold">距离: ${distance} km</div>
                ${mainData.map(p =>
              `<div style="color:${p.color};display:flex;justify-content:space-between;margin:3px 0">
                    ${p.seriesName}: ${p.data[1]} ${p.seriesName.includes('压力') ? 'MPa' : p.seriesName.includes('温度') ? '℃' : 'm'}
                  </div>`
            ).join('')}
              </div>
            `
          }
        },
        legend: [{
          x: 'left',
          top: '2%',
          left: '60%',
          selectedMode: 'multiple',
          icon: 'roundRect',
          itemHeight: 3,
          data: [
            { name: '沿线压力', itemStyle: { color: '#ff6b6b' } },
            { name: '沿线高程', itemStyle: { color: '#3399ff' } },
            { name: '沿线温度', itemStyle: { color: '#ffd166' } }
          ],
          textStyle: {
            color: 'white',
            fontSize: 14,
            fontWeight: 'bold'
          },
          inactiveColor: 'rgba(255,255,255,0.3)',
          selected: {
            '沿线压力': true,
            '沿线高程': true,
            '沿线温度': true
          }
        }],
        grid: {
          left: '10%',
          right: '3%',
          bottom: '10%',
          top: '8%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          name: '距离 (km)',
          nameTextStyle: {
            color: 'white',
            fontSize: 12,
            padding: [10, 0, 0, 0]
          },
          min: 0,
          max: this.distance,
          splitNumber: 5,
          axisLabel: {
            color: 'rgba(255,255,255,0.8)',
            fontSize: 12,
            formatter: '{value} km'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255,255,255,0.3)'
            }
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: 'rgba(255,255,255,0.3)'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255,255,255,0.1)',
              type: 'dashed'
            }
          }
        },
        yAxis: [
          {
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgba(255,255,255,0.1)',
                type: 'dashed'
              }
            },
            name: '(MPa)',
            nameTextStyle: {
              color: 'white',
              fontSize: 12,
              padding: [0, 0, 0, 20]
            },
            type: 'value',
            min: 1.5,
            max: 2.5,
            axisLabel: {
              color: 'rgba(255,255,255,0.8)',
              fontSize: 12
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: 'rgba(255,255,255,0.3)'
              }
            },
            axisTick: {
              show: true,
              lineStyle: {
                color: 'rgba(255,255,255,0.3)'
              }
            }
          },
          {
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgba(255,255,255,0.1)',
                type: 'dashed'
              }
            },
            name: '℃',
            nameTextStyle: {
              color: 'white',
              fontSize: 12,
              padding: [0, 0, 0, 20]
            },
            type: 'value',
            min: 0,
            max: 1000,
            axisLabel: {
              color: 'rgba(255,255,255,0.8)',
              fontSize: 12
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: 'rgba(255,255,255,0.3)'
              }
            },
            axisTick: {
              show: true,
              lineStyle: {
                color: 'rgba(255,255,255,0.3)'
              }
            }
          },
          {
            type: 'value',
            show: false,
            max: 300,
            min: -100,
            splitNumber: 11,
            splitLine: {
              show: false
            }
          },
          {
            type: 'value',
            show: false,
            max: 3000,
            min: -100,
            splitNumber: 11,
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '沿线压力',
            data: this.pressure.map((val, index) => [index * (this.distance / this.numPoints), val]),
            type: 'line',
            smooth: true,
            symbol: 'none',
            lineStyle: {
              color: '#ff6b6b',
              width: 1.5,
              shadowColor: 'rgba(255,107,107,0.3)',
              shadowBlur: 10,
              shadowOffsetY: 5
            },
            yAxisIndex: 0
          },
          {
            name: '沿线高程',
            data: this.elevation.map((val, index) => [index * (this.distance / this.numPoints), val]),
            type: 'line',
            z: 3,
            smooth: true,
            symbol: 'circle',    // 显示数据点
            symbolSize: 8,       // 数据点大小
            lineStyle: {
              width: 2,
              color: '#3399ff'
            },
            itemStyle: {         // 数据点样式
              color: '#3399ff',
              borderWidth: 2,
              borderColor: '#fff'
            },
            emphasis: {          // 鼠标悬停效果
              scale: true,
              itemStyle: {
                symbolSize: 10,
                borderWidth: 3
              }
            },
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(51,153,255,0.8)'
                },
                {
                  offset: 1,
                  color: 'rgba(51,153,255,0.8)'
                }
              ])
            },
            yAxisIndex: 3
          },
          {
            name: '沿线温度',
            data: this.temperature.map((val, index) => [index * (this.distance / this.numPoints), val]),
            type: 'line',
            smooth: true,
            lineStyle: {
              color: '#ffd166',
              width: 1.5,
              shadowColor: 'rgba(255,209,102,0.3)',
              shadowBlur: 10,
              shadowOffsetY: 5
            },
            symbol: 'none',
            yAxisIndex: 2,
          },
          ...this.pressureColumns // 添加所有压力液柱
        ]
      }
      if (this.charts) {
        this.charts.setOption(options)
      }
    }
  }
}
</script>

<style>
.dark-dialog {
  background-color: #0f1c3c !important;
  border-radius: 8px !important;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5) !important;
}

.large-dialog {
  min-width: 1200px;
}

.large-dialog .el-dialog__body {
  padding: 30px 40px;
}

.large-dialog .el-dialog__header {
  padding: 20px 40px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.dark-dialog .el-dialog__title {
  color: #fff !important;
  font-size: 20px !important;
  font-weight: 600 !important;
}

.dark-dialog .el-dialog__body {
  color: #fff !important;
}

.dark-dialog .el-dialog__headerbtn {
  top: 23px;
  right: 40px;
}

.dark-dialog .el-dialog__headerbtn .el-dialog__close {
  color: rgba(255, 255, 255, 0.8) !important;
  font-size: 20px !important;
  transition: all 0.3s ease;
}

.dark-dialog .el-dialog__headerbtn .el-dialog__close:hover {
  color: #fff !important;
  transform: scale(1.1);
}

.trend-container {
  padding: 0;
}

.time-selector {
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.15);
  padding: 20px;
  border-radius: 6px;
}

.selector-group {
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  padding: 10px 20px;
  border-radius: 4px;
}

.el-radio-button__inner {
  background-color: rgba(26, 155, 252, 0.1) !important;
  border-color: rgba(26, 155, 252, 0.2) !important;
  color: #fff !important;
  transition: all 0.3s ease !important;
}

.el-radio-button__orig-radio:checked+.el-radio-button__inner {
  background-color: #1a9bfc !important;
  border-color: #1a9bfc !important;
  box-shadow: -1px 0 0 0 #1a9bfc !important;
}

.el-radio-button__inner:hover {
  background-color: rgba(26, 155, 252, 0.2) !important;
}

.el-date-editor {
  background-color: rgba(0, 0, 0, 0.2) !important;
  border-radius: 4px;
}

.el-input__inner {
  background-color: transparent !important;
  border-color: rgba(26, 155, 252, 0.2) !important;
  color: #fff !important;
  transition: all 0.3s ease;
}

.el-input__inner:hover,
.el-input__inner:focus {
  border-color: #1a9bfc !important;
}

.el-date-editor .el-input__icon {
  color: rgba(255, 255, 255, 0.8) !important;
}
</style>
