// const { MongoClient } = require('mongodb');

// // 直接测试预测数据功能
// class TestPredictionData {
//   constructor() {
//     this.mongo_url = 'mongodb://root:examplepassword@10.1.16.50:9101';
//     this.db_name = "计算结果";
//     this.client = null;
//     this.db = null;
    
//     // 站点与数据库集合的映射关系
//     this.stationCollectionMap = {
//       '十字窖#1': '阀室1预测数据',
//       '十字窖#2': '阀室2预测数据', 
//       '黄埔': '黄埔预测数据',
//       '东莞': '东莞预测数据'
//     };
    
//     // 站点与数据字段的映射关系
//     this.stationFieldMap = {
//       '十字窖#1': {
//         pressure: '阀室1预测压力',
//         temperature: '阀室1预测温度'
//       },
//       '十字窖#2': {
//         pressure: '阀室2预测压力', 
//         temperature: '阀室2预测温度'
//       },
//       '黄埔': {
//         pressure: '黄埔站预测压力',
//         temperature: '黄埔站预测温度'
//       },
//       '东莞': {
//         pressure: '东莞站预测压力',
//         temperature: '东莞站预测温度'
//       }
//     };
//   }

//   // 连接到数据库
//   async connectToDatabase() {
//     try {
//       console.log('连接到预测数据库:', this.mongo_url);
//       this.client = new MongoClient(this.mongo_url, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         connectTimeoutMS: 5000,
//         serverSelectionTimeoutMS: 5000,
//       });
//       await this.client.connect();
      
//       this.db = this.client.db(this.db_name);
//       // console.log(`✅ 连接到预测数据库成功: ${this.db_name}`);
//       return this.db;
//     } catch (error) {
//       console.error('❌ 连接预测数据库失败:', error);
//       throw error;
//     }
//   }

//   // 获取指定站点的预测数据
//   async getStationPredictionData(stationName, dataIndex = 0) {
//     try {
//       const collectionName = this.stationCollectionMap[stationName];
//       const fieldMap = this.stationFieldMap[stationName];
      
//       if (!collectionName || !fieldMap) {
//         throw new Error(`不支持的站点: ${stationName}`);
//       }

//       console.log(`📊 获取 ${stationName} 预测数据，集合: ${collectionName}`);
      
//       // 确保数据库连接
//       if (!this.db) {
//         await this.connectToDatabase();
//       }
      
//       // 获取数据（按存储顺序，忽略time字段）
//       const collection = this.db.collection(collectionName);
//       const documents = await collection.find({}).sort({ _id: 1 }).limit(10).toArray();
      
//       if (!documents || documents.length === 0) {
//         throw new Error(`${stationName} 预测数据为空`);
//       }
      
//       console.log(`📦 获取到 ${documents.length} 条预测数据`);
      
//       // 如果指定了数据索引，返回对应的数据
//       if (dataIndex >= 0 && dataIndex < documents.length) {
//         const doc = documents[dataIndex];
//         const result = {
//           pressure: doc[fieldMap.pressure] || null,
//           temperature: doc[fieldMap.temperature] || null,
//           dataIndex: dataIndex + 1,
//           totalRecords: documents.length,
//           stationName: stationName,
//           collectionName: collectionName
//         };
        
//         console.log(`🎯 返回第${dataIndex + 1}条数据:`, result);
//         return result;
//       }
      
//       // 返回所有数据
//       return documents.map((doc, index) => ({
//         pressure: doc[fieldMap.pressure] || null,
//         temperature: doc[fieldMap.temperature] || null,
//         dataIndex: index + 1,
//         originalTime: doc.time,
//         stationName: stationName
//       }));
      
//     } catch (error) {
//       console.error(`❌ 获取 ${stationName} 预测数据失败:`, error);
//       throw error;
//     }
//   }

//   // 获取当前预测数据（第5条数据，代表当前时间+25秒的预测）
//   async getCurrentPrediction(stationName) {
//     return await this.getStationPredictionData(stationName, 4); // 第5条数据（索引4）= 当前时间+25秒
//   }

//   // 关闭连接
//   async close() {
//     if (this.client) {
//       await this.client.close();
//       console.log('🔒 数据库连接已关闭');
//     }
//   }
// }

// // 测试函数
// async function testPredictionAPI() {
//   console.log('🧪 开始测试预测数据API功能...\n');
  
//   const predictionData = new TestPredictionData();
  
//   try {
//     // 测试十字窖#2的预测数据
//     console.log('=== 测试十字窖#2预测数据 ===');
//     const result = await predictionData.getCurrentPrediction('十字窖#2');
//     console.log('✅ 测试成功！');
//     console.log('📊 预测数据:', JSON.stringify(result, null, 2));
    
//   } catch (error) {
//     console.error('❌ 测试失败:', error.message);
//   } finally {
//     await predictionData.close();
//   }
// }

// // 运行测试
// testPredictionAPI(); 