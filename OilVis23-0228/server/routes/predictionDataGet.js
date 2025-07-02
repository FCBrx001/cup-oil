const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

// 定义数据缓存和大小限制
const stationPredictionCache = new Map();
const MAX_PREDICTION_POINTS = 720; // 从 200 增加到 720

// 多站点预测数据处理类
class MultiStationPredictionData_cube {
  constructor() {
    // 远程预测数据库配置 (已弃用，保留以防回滚)
    this.mongo_url = 'mongodb://root:examplepassword@10.1.16.50:9101';
    this.db_name = "计算结果";
    this.client = null;
    this.db = null;

    // 本地预测数据库配置 (所有站点统一使用)
    this.local_mongo_url = 'mongodb://localhost:27017';
    this.local_db_name = "计算结果";
    this.local_client = null;
    this.local_db = null;
    
    this.stationCollectionMap = {
      '十字窖#1': '阀室1预测数据',
      '十字窖#2': '阀室2预测数据', 
      '黄埔': '黄埔站预测数据',
      '东莞': '东莞站预测数据'
    };
    
    this.stationFieldMap = {
      '十字窖#1': { pressure: '阀室1预测压力', temperature: '阀室1预测温度' },
      '十字窖#2': { pressure: '阀室2预测压力', temperature: '阀室2预测温度' },
      '黄埔': { pressure: '黄埔站预测压力', temperature: '黄埔站预测温度' },
      '东莞': { pressure: '东莞站预测压力', temperature: '东莞站预测温度' }
    };
  }

  // 连接到远程数据库
  async connectToRemoteDatabase() {
    if (this.client && this.client.topology && this.client.topology.isConnected()) {
      return this.db;
    }
    try {
      console.log('连接到远程预测数据库:', this.mongo_url);
      this.client = new MongoClient(this.mongo_url, {
        useNewUrlParser: true, useUnifiedTopology: true,
        connectTimeoutMS: 5000, serverSelectionTimeoutMS: 5000,
        });
        await this.client.connect();
      this.db = this.client.db(this.db_name);
      return this.db;
    } catch (error) {
      console.error('连接远程预测数据库失败:', error);
      throw error;
    }
  }

  // 连接到本地数据库 (所有站点统一使用)
  async connectToLocalDatabase() {
    if (this.local_client && this.local_client.topology && this.local_client.topology.isConnected()) {
      return this.local_db;
    }
    try {
      console.log('连接到本地预测数据库 (所有站点):', this.local_mongo_url);
      this.local_client = new MongoClient(this.local_mongo_url, {
        useNewUrlParser: true, useUnifiedTopology: true,
        connectTimeoutMS: 5000, serverSelectionTimeoutMS: 5000,
      });
      await this.local_client.connect();
      this.local_db = this.local_client.db(this.local_db_name);
      return this.local_db;
    } catch (error) {
      console.error('连接本地预测数据库失败:', error);
      throw error;
    }
  }

  // 重构：获取指定站点的预测数据
  async getStationPredictionData(stationName, dataIndex = null) {
    // 所有站点都使用本地数据库
    const isLocal = true;

    try {
      const db = isLocal
        ? await this.connectToLocalDatabase()
        : await this.connectToRemoteDatabase();
      
      const collectionName = this.stationCollectionMap[stationName];
      const fieldMap = this.stationFieldMap[stationName];
      
      if (!collectionName || !fieldMap) {
        throw new Error(`不支持的站点: ${stationName}`);
      }

      const collection = db.collection(collectionName);
      const documents = await collection.find({}).sort({ _id: -1 }).limit(MAX_PREDICTION_POINTS).toArray();
      documents.reverse(); // 因为是降序获取的，需要反转以保证时间上的升序
      
      if (!documents || documents.length === 0) {
        throw new Error(`${stationName} 预测数据为空`);
      }
      
      if (dataIndex !== null) {
        if (dataIndex >= 0 && dataIndex < documents.length) {
          const doc = documents[dataIndex];
          return {
            pressure: doc[fieldMap.pressure] || null,
            temperature: doc[fieldMap.temperature] || null,
            dataIndex: parseInt(dataIndex) + 1,
            totalRecords: documents.length,
            stationName: stationName,
            source: 'local'
          };
        } else {
          throw new Error(`请求的数据索引 ${dataIndex} 超出范围。可用数据: ${documents.length} 条`);
        }
      }
      
      return documents.map((doc, index) => ({
        pressure: doc[fieldMap.pressure] || null,
        temperature: doc[fieldMap.temperature] || null,
        dataIndex: index + 1,
        time: doc.time,
        stationName: stationName,
        source: 'local'
      }));
      
    } catch (error) {
      console.error(`获取 ${stationName} (本地) 预测数据失败:`, error);
      throw error;
    }
  }

  // 获取当前预测数据（第1条数据，代表当前时间+25秒的预测）
  async getCurrentPrediction(stationName) {
    return await this.getStationPredictionData(stationName, 4); // 第5条数据（索引4）= 当前时间+25秒
  }

  // 获取预测数据序列（获取最新的几条预测数据）
  async getPredictionSequence(stationName, count = 5) {
    try {
      // 确保调用时不传dataIndex参数，这样会返回数组
      const allData = await this.getStationPredictionData(stationName);
      
      // 确保allData是数组
      if (!Array.isArray(allData)) {
        throw new Error(`预测数据格式错误: 期望数组，实际得到 ${typeof allData}`);
      }
      
      // 取最新的count条数据
      let sequence = allData.slice(-count);
      
      console.log(`获取 ${stationName} 最新预测数据: ${sequence.length}条，原始数据总量: ${allData.length}条`);
      
      return sequence;
    } catch (error) {
      console.error(`获取 ${stationName} 预测序列失败:`, error);
      throw error;
    }
  }
}

// 创建预测数据处理实例
const predictionData = new MultiStationPredictionData_cube();

// API路由定义

// 获取指定站点的当前预测数据
router.get('/station/:stationName/current', async (req, res) => {
  try {
    const { stationName } = req.params;
    // console.log(`API请求: 获取 ${stationName} 当前预测数据`);
    
    const data = await predictionData.getCurrentPrediction(decodeURIComponent(stationName));
    
    res.json({
      success: true,
      message: `成功获取 ${stationName} 当前预测数据`,
      data: data,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('获取当前预测数据失败:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// 获取指定站点的预测数据序列
router.get('/station/:stationName/sequence', async (req, res) => {
  try {
    const { stationName } = req.params;
    const { count = 5 } = req.query;
    
    // console.log(`API请求: 获取 ${stationName} 预测序列，数量: ${count}`);
    
    const data = await predictionData.getPredictionSequence(
      decodeURIComponent(stationName), 
      parseInt(count)
    );
    
    res.json({
      success: true,
      message: `成功获取 ${stationName} 预测序列`,
      data: data,
      count: data.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('获取预测序列失败:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// 新增：获取指定站点的单个索引的预测数据
router.get('/station/:stationName/indexed/:dataIndex', async (req, res) => {
  try {
    const { stationName, dataIndex } = req.params;
    // console.log(`API请求: 获取 ${stationName} 索引为 ${dataIndex} 的预测数据`);

    const data = await predictionData.getStationPredictionData(
      decodeURIComponent(stationName),
      parseInt(dataIndex)
    );

    res.json({
      success: true,
      message: `成功获取 ${stationName} 索引为 ${dataIndex} 的预测数据`,
      data: data,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('获取索引预测数据失败:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// 获取指定站点的所有预测数据
router.get('/station/:stationName/all', async (req, res) => {
  try {
    const { stationName } = req.params;
    // console.log(`API请求: 获取 ${stationName} 所有预测数据`);
    
    const data = await predictionData.getStationPredictionData(decodeURIComponent(stationName));
    
    res.json({
      success: true,
      message: `成功获取 ${stationName} 所有预测数据`,
      data: data,
      count: data.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('获取所有预测数据失败:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// 批量获取多个站点的预测数据
router.post('/stations/batch', async (req, res) => {
  try {
    const { stationNames, dataType = 'current' } = req.body;
    
    if (!stationNames || !Array.isArray(stationNames)) {
      return res.status(400).json({
        success: false,
        message: '请提供有效的站点名称数组'
      });
    }
    
    // console.log(`API请求: 批量获取预测数据，站点: ${stationNames.join(', ')}, 类型: ${dataType}`);
    
    const results = {};
    
    for (const stationName of stationNames) {
      try {
        if (dataType === 'sequence') {
          results[stationName] = await predictionData.getPredictionSequence(stationName);
        } else {
          results[stationName] = await predictionData.getCurrentPrediction(stationName);
        }
      } catch (error) {
        console.error(`获取 ${stationName} 数据失败:`, error);
        results[stationName] = { error: error.message };
      }
    }
    
    res.json({
      success: true,
      message: '批量获取预测数据完成',
      data: results,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    // console.error('批量获取预测数据失败:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
