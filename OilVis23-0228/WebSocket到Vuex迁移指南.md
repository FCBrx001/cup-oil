# WebSocket到Vuex State迁移指南

## 概述

本指南详细说明了如何将现有的WebSocket数据流迁移到Vuex State管理，实现更统一、可控的数据流管理。

## 当前数据流分析

### 现有的WebSocket连接

| 端口 | 用途 | 数据流向 | 替代方案 |
|------|------|----------|----------|
| 3001 | 批次跟踪数据 | `oilDataChange` → Vuex | `batchTracking` State |
| 3011 | 实时配置数据 | `realtimeConfigData` → Vuex | `realtimeMonitoring` State |
| 3022 | 时间数据 | `timeData` → Vuex | `positions` State |
| 3091 | 参数数据 | `params` → Vuex | `paramsData` State |
| 3092 | 管段监测数据 | 直接使用 | `realtimeMonitoring` State |

### 数据流对比

#### 原有WebSocket方式
```javascript
// 组件中建立WebSocket连接
this.ws = new WebSocket('ws://127.0.0.1:3001')
this.ws.onmessage = (e) => {
  const data = JSON.parse(e.data)
  eventBus.$emit('oilDataChange', data)
}

// 其他组件监听事件
eventBus.$on('oilDataChange', (data) => {
  // 处理数据
})
```

#### 新的Vuex State方式
```javascript
// 使用DataService管理数据
this.dataService = new DataService(this.$store)
this.dataService.startBatchTrackingService()

// 组件通过computed获取数据
computed: {
  batchData() {
    return this.$store.getters.getBatchData
  }
}
```

## 迁移步骤

### 1. 更新Vuex Store

已完成的更新包括：

#### 新增State
```javascript
state: {
  // 预测数据相关状态
  predictionData: {
    singleStation: { temperature: [], pressure: [] },
    multiStation: new Map(),
    selectedStations: [],
    isPredictionMode: false
  },
  
  // 实时监测数据
  realtimeMonitoring: {
    pipelineData: null,
    connectionStatus: 'disconnected',
    lastUpdateTime: null
  },
  
  // 批次跟踪数据
  batchTracking: {
    batchData: [],
    currentBatchIndex: 0,
    batchStatus: 'idle'
  }
}
```

#### 新增Mutations
```javascript
mutations: {
  updatePredictionData(state, { stationName, dataType, data, isMultiStation }),
  setPredictionMode(state, isEnabled),
  setSelectedStations(state, stations),
  updatePipelineData(state, data),
  setConnectionStatus(state, status),
  updateBatchData(state, data),
  setBatchIndex(state, index),
  setBatchStatus(state, status)
}
```

#### 新增Actions
```javascript
actions: {
  async fetchPredictionData({ commit }, { stationName, dataType, isMultiStation }),
  async fetchPipelineData({ commit }),
  async fetchBatchData({ commit })
}
```

#### 新增Getters
```javascript
getters: {
  getPredictionData: (state) => (stationName, dataType),
  isPredictionModeActive: (state),
  getSelectedStations: (state),
  getPipelineData: (state),
  getConnectionStatus: (state),
  getBatchData: (state),
  getBatchStatus: (state)
}
```

### 2. 创建DataService

创建了统一的数据服务管理器 `src/utils/dataService.js`：

#### 主要功能
- **预测数据服务**: `startPredictionService()`, `stopPredictionService()`
- **实时监测服务**: `startRealtimeMonitoringService()`, `stopRealtimeMonitoringService()`
- **批次跟踪服务**: `startBatchTrackingService()`, `stopBatchTrackingService()`
- **统一管理**: `stopAllServices()`, `getServiceStatus()`

#### 使用示例
```javascript
// 初始化
this.dataService = new DataService(this.$store)

// 启动预测服务
this.dataService.startPredictionService('黄埔', false)

// 启动实时监测
this.dataService.startRealtimeMonitoringService()

// 启动批次跟踪
this.dataService.startBatchTrackingService()

// 停止所有服务
this.dataService.stopAllServices()
```

### 3. 组件迁移

#### 原有组件改造
```javascript
// 原有方式
export default {
  data() {
    return {
      ws: null,
      realtimeData: null
    }
  },
  mounted() {
    this.connectWebSocket()
  },
  methods: {
    connectWebSocket() {
      this.ws = new WebSocket('ws://127.0.0.1:3001')
      this.ws.onmessage = (e) => {
        this.realtimeData = JSON.parse(e.data)
      }
    }
  }
}
```

#### 新的Vuex方式
```javascript
// 新方式
export default {
  computed: {
    realtimeData() {
      return this.$store.getters.getPipelineData
    },
    connectionStatus() {
      return this.$store.getters.getConnectionStatus
    }
  },
  mounted() {
    this.dataService = new DataService(this.$store)
    this.dataService.startRealtimeMonitoringService()
  },
  beforeDestroy() {
    this.dataService.stopAllServices()
  }
}
```

### 4. 事件总线替换

#### 原有事件总线使用
```javascript
// 发送数据
eventBus.$emit('oilDataChange', data)

// 接收数据
eventBus.$on('oilDataChange', (data) => {
  // 处理数据
})
```

#### 新的Vuex方式
```javascript
// 更新数据
this.$store.commit('updateBatchData', data)

// 获取数据
computed: {
  batchData() {
    return this.$store.getters.getBatchData
  }
}
```

## 迁移检查清单

### 第一阶段：基础迁移
- [x] 更新Vuex Store结构
- [x] 创建DataService管理器
- [x] 创建示例组件 `PredictionChartWithState.vue`
- [x] 编写迁移指南文档

### 第二阶段：组件迁移
- [ ] 迁移 `PredictionChart.vue` 组件
- [ ] 迁移 `PipelineVisualization.vue` 组件
- [ ] 迁移 `StationHome.vue` 组件
- [ ] 迁移 `App.vue` 中的WebSocket连接

### 第三阶段：测试和优化
- [ ] 测试数据流完整性
- [ ] 验证性能表现
- [ ] 优化错误处理
- [ ] 添加数据缓存机制

### 第四阶段：清理
- [ ] 移除WebSocket相关代码
- [ ] 清理事件总线使用
- [ ] 更新文档
- [ ] 代码审查

## 优势对比

### Vuex State方式的优势

1. **统一状态管理**
   - 所有数据集中管理
   - 状态变化可追踪
   - 支持时间旅行调试

2. **更好的性能**
   - 减少重复的WebSocket连接
   - 数据缓存和复用
   - 按需更新组件

3. **更易维护**
   - 清晰的数据流向
   - 统一的错误处理
   - 更好的代码组织

4. **更强的可控性**
   - 精确控制数据更新频率
   - 支持数据过滤和转换
   - 更好的状态同步

### WebSocket方式的劣势

1. **连接管理复杂**
   - 多个WebSocket连接
   - 连接状态管理困难
   - 重连逻辑复杂

2. **数据流不清晰**
   - 事件总线传递数据
   - 数据流向难以追踪
   - 组件间耦合度高

3. **性能问题**
   - 重复的数据传输
   - 无数据缓存机制
   - 资源消耗较大

## 使用建议

### 1. 渐进式迁移
- 先迁移一个组件进行测试
- 确保数据流正常后再继续
- 保留原有WebSocket作为备选

### 2. 数据验证
- 对比迁移前后的数据一致性
- 验证实时性要求是否满足
- 测试异常情况处理

### 3. 性能监控
- 监控内存使用情况
- 检查定时器是否正常清理
- 验证数据更新频率

### 4. 错误处理
- 添加网络错误重试机制
- 实现数据降级策略
- 提供用户友好的错误提示

## 总结

通过将WebSocket数据流迁移到Vuex State管理，我们可以实现：

1. **更统一的数据管理**
2. **更好的性能表现**
3. **更易维护的代码结构**
4. **更强的可控性和可扩展性**

建议按照迁移检查清单逐步进行迁移，确保系统的稳定性和数据的完整性。 