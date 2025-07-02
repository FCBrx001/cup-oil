import axios from 'axios'

/**
 * 数据服务管理器
 * 用于统一管理数据获取和状态更新，替代WebSocket连接
 */
class DataService {
  constructor(store) {
    this.store = store
    this.timers = new Map()
    this.baseURL = 'http://localhost:3000'
    
    // 配置axios
    this.axios = axios.create({
      baseURL: this.baseURL,
      timeout: 10000
    })

    // 添加请求拦截器，自动添加token
    this.axios.interceptors.request.use(config => {
      const token = sessionStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    }, error => {
      return Promise.reject(error)
    })
  }

  /**
   * 启动预测数据服务
   * @param {string} stationName - 站点名称
   * @param {boolean} isMultiStation - 是否多站点模式
   */
  startPredictionService(stationName, isMultiStation = false) {
    console.log(`🚀 启动预测数据服务: ${stationName}, 多站点: ${isMultiStation}`)
    
    // 设置预测模式
    this.store.commit('setPredictionMode', true)
    this.store.commit('setSelectedStations', [stationName])
    
    // 立即获取初始数据
    this.fetchInitialPredictionData(stationName, isMultiStation)
    
    // 设置定时器，每5秒获取新数据
    const timerKey = `prediction_${stationName}`
    const timer = setInterval(() => {
      this.fetchNextPredictionData(stationName, isMultiStation)
    }, 5000)
    
    this.timers.set(timerKey, timer)
  }

  /**
   * 停止预测数据服务
   * @param {string} stationName - 站点名称
   */
  stopPredictionService(stationName) {
    console.log(`🛑 停止预测数据服务: ${stationName}`)
    
    const timerKey = `prediction_${stationName}`
    const timer = this.timers.get(timerKey)
    
    if (timer) {
      clearInterval(timer)
      this.timers.delete(timerKey)
    }
    
    // 清除预测模式
    this.store.commit('setPredictionMode', false)
    this.store.commit('setSelectedStations', [])
  }

  /**
   * 获取初始预测数据
   * @param {string} stationName - 站点名称
   * @param {boolean} isMultiStation - 是否多站点模式
   */
  async fetchInitialPredictionData(stationName, isMultiStation = false) {
    try {
      console.log(`🎯 获取初始预测数据: ${stationName}`)
      
      // 获取温度和压力数据
      const [tempResult, pressureResult] = await Promise.all([
        this.fetchPredictionDataByType(stationName, 'temperature', isMultiStation),
        this.fetchPredictionDataByType(stationName, 'pressure', isMultiStation)
      ])
      
      if (tempResult.success && pressureResult.success) {
        console.log(`✅ 初始预测数据获取成功: ${stationName}`)
      } else {
        console.warn(`⚠️ 初始预测数据获取失败: ${stationName}`)
      }
      
    } catch (error) {
      console.error(`❌ 获取初始预测数据失败: ${stationName}`, error)
    }
  }

  /**
   * 获取后续预测数据
   * @param {string} stationName - 站点名称
   * @param {boolean} isMultiStation - 是否多站点模式
   */
  async fetchNextPredictionData(stationName, isMultiStation = false) {
    try {
      console.log(`⏰ 获取后续预测数据: ${stationName}`)
      
      // 获取温度和压力数据
      const [tempResult, pressureResult] = await Promise.all([
        this.fetchPredictionDataByType(stationName, 'temperature', isMultiStation, true),
        this.fetchPredictionDataByType(stationName, 'pressure', isMultiStation, true)
      ])
      
      if (tempResult.success && pressureResult.success) {
        console.log(`✅ 后续预测数据获取成功: ${stationName}`)
      } else {
        console.warn(`⚠️ 后续预测数据获取失败: ${stationName}`)
        // 如果获取失败，停止服务
        this.stopPredictionService(stationName)
      }
      
    } catch (error) {
      console.error(`❌ 获取后续预测数据失败: ${stationName}`, error)
      this.stopPredictionService(stationName)
    }
  }

  /**
   * 根据类型获取预测数据
   * @param {string} stationName - 站点名称
   * @param {string} dataType - 数据类型 (temperature/pressure)
   * @param {boolean} isMultiStation - 是否多站点模式
   * @param {boolean} isNext - 是否为后续数据
   */
  async fetchPredictionDataByType(stationName, dataType, isMultiStation = false, isNext = false) {
    try {
      let apiUrl
      
      if (isNext) {
        // 获取后续数据
        const currentData = this.store.getters.getPredictionData(stationName, dataType)
        const nextIndex = currentData.prediction.length
        apiUrl = `/prediction/station/${encodeURIComponent(stationName)}/indexed/${nextIndex}`
      } else {
        // 获取初始数据
        apiUrl = `/prediction/station/${encodeURIComponent(stationName)}/sequence?count=12`
      }
      
      const response = await this.axios.get(apiUrl)
      
      if (response.data.success) {
        let data
        const currentTime = Date.now()
        
        if (isNext) {
          // 后续数据：单条数据
          const point = response.data.data
          const lastData = this.store.getters.getPredictionData(stationName, dataType)
          const lastTime = lastData.prediction.length > 0 
            ? lastData.prediction[lastData.prediction.length - 1][0] 
            : new Date(currentTime)
          const nextTime = new Date(lastTime.getTime() + 5000)
          
          if (dataType === 'temperature') {
            data = [[nextTime, point.temperature]]
          } else if (dataType === 'pressure') {
            const adjustedPressure = point.pressure - 2
            data = [[nextTime, adjustedPressure]]
          }
        } else {
          // 初始数据：多条数据
          data = response.data.data.map((point, index) => {
            const displayTime = new Date(currentTime + index * 5000)
            
            if (dataType === 'temperature') {
              return [displayTime, point.temperature]
            } else if (dataType === 'pressure') {
              const adjustedPressure = point.pressure - 2
              return [displayTime, adjustedPressure]
            }
            return null
          }).filter(item => item !== null)
        }
        
        // 更新store
        this.store.commit('updatePredictionData', {
          stationName,
          dataType,
          data,
          isMultiStation
        })
        
        return { success: true, data }
      }
      
      return { success: false, message: response.data.message || 'API返回错误' }
      
    } catch (error) {
      console.error(`获取${dataType}预测数据失败:`, error)
      return { success: false, message: error.message }
    }
  }

  /**
   * 启动实时监测数据服务
   */
  startRealtimeMonitoringService() {
    console.log('🚀 启动实时监测数据服务')
    
    // 立即获取一次数据
    this.fetchPipelineData()
    
    // 设置定时器，每5秒获取一次数据
    const timer = setInterval(() => {
      this.fetchPipelineData()
    }, 5000)
    
    this.timers.set('realtime_monitoring', timer)
  }

  /**
   * 停止实时监测数据服务
   */
  stopRealtimeMonitoringService() {
    console.log('🛑 停止实时监测数据服务')
    
    const timer = this.timers.get('realtime_monitoring')
    if (timer) {
      clearInterval(timer)
      this.timers.delete('realtime_monitoring')
    }
  }

  /**
   * 获取管段数据
   */
  async fetchPipelineData() {
    try {
      this.store.commit('setConnectionStatus', 'connecting')
      
      const response = await this.axios.get('/pipeline/latest')
      
      if (response.data) {
        this.store.commit('updatePipelineData', response.data)
        this.store.commit('setConnectionStatus', 'connected')
        console.log('✅ 管段数据更新成功')
      } else {
        this.store.commit('setConnectionStatus', 'error')
        console.warn('⚠️ 管段数据为空')
      }
      
    } catch (error) {
      console.error('❌ 获取管段数据失败:', error)
      this.store.commit('setConnectionStatus', 'error')
    }
  }

  /**
   * 启动批次跟踪数据服务
   */
  startBatchTrackingService() {
    console.log('🚀 启动批次跟踪数据服务')
    
    // 立即获取一次数据
    this.fetchBatchData()
    
    // 设置定时器，每5秒获取一次数据
    const timer = setInterval(() => {
      this.fetchBatchData()
    }, 5000)
    
    this.timers.set('batch_tracking', timer)
  }

  /**
   * 停止批次跟踪数据服务
   */
  stopBatchTrackingService() {
    console.log('🛑 停止批次跟踪数据服务')
    
    const timer = this.timers.get('batch_tracking')
    if (timer) {
      clearInterval(timer)
      this.timers.delete('batch_tracking')
    }
  }

  /**
   * 获取批次数据
   */
  async fetchBatchData() {
    try {
      const response = await this.axios.get('/OilBT/test')
      
      if (response.data) {
        this.store.commit('updateBatchData', response.data)
        this.store.commit('setBatchStatus', 'success')
        console.log('✅ 批次数据更新成功')
      } else {
        this.store.commit('setBatchStatus', 'error')
        console.warn('⚠️ 批次数据为空')
      }
      
    } catch (error) {
      console.error('❌ 获取批次数据失败:', error)
      this.store.commit('setBatchStatus', 'error')
    }
  }

  /**
   * 停止所有服务
   */
  stopAllServices() {
    console.log('🛑 停止所有数据服务')
    
    // 清除所有定时器
    this.timers.forEach((timer, key) => {
      clearInterval(timer)
      console.log(`已停止服务: ${key}`)
    })
    
    this.timers.clear()
    
    // 重置状态
    this.store.commit('setPredictionMode', false)
    this.store.commit('setSelectedStations', [])
    this.store.commit('setConnectionStatus', 'disconnected')
    this.store.commit('setBatchStatus', 'idle')
  }

  /**
   * 获取服务状态
   */
  getServiceStatus() {
    const status = {
      prediction: this.store.getters.isPredictionModeActive,
      realtime: this.store.getters.getConnectionStatus,
      batch: this.store.getters.getBatchStatus,
      activeTimers: Array.from(this.timers.keys())
    }
    
    return status
  }
}

export default DataService 