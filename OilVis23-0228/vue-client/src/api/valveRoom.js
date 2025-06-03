import { request } from '@/network/request'

// 阀室数据相关API
export const valveRoomApi = {
  // 获取所有阀室数据
  getAllValveRooms() {
    return request({
      url: '/api/valve-rooms',
      method: 'get'
    })
  },

  // 获取单个阀室详情
  getValveRoomDetail(valveId) {
    return request({
      url: `/api/valve-rooms/${valveId}`,
      method: 'get'
    })
  },

  // 获取阀室实时监测数据
  getValveRoomRealTimeData(valveId) {
    return request({
      url: `/api/valve-rooms/${valveId}/realtime`,
      method: 'get'
    })
  },

  // 获取阀室历史数据
  getValveRoomHistory(valveId, params) {
    return request({
      url: `/api/valve-rooms/${valveId}/history`,
      method: 'get',
      params: {
        startTime: params.startTime,
        endTime: params.endTime,
        pageSize: params.pageSize || 100,
        pageNum: params.pageNum || 1
      }
    })
  },

  // 设置警报
  setAlarm(valveId, alarmConfig) {
    return request({
      url: `/api/valve-rooms/${valveId}/alarms`,
      method: 'post',
      data: alarmConfig
    })
  },

  // 获取风险预警数据
  getRiskWarnings() {
    return request({
      url: '/api/valve-rooms/risk-warnings',
      method: 'get'
    })
  },

  // 更新阀室状态
  updateValveRoomStatus(valveId, status) {
    return request({
      url: `/api/valve-rooms/${valveId}/status`,
      method: 'put',
      data: { status }
    })
  }
} 