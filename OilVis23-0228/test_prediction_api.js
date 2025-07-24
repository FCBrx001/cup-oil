// const axios = require('axios');

// const BASE_URL = 'http://localhost:3000';

// // 测试单个站点预测数据
// async function testSingleStationPrediction(stationName) {
//   try {
//     console.log(`\n=== 测试 ${stationName} 单站点预测数据 ===`);
    
//     const response = await axios.get(`${BASE_URL}/prediction/station/${encodeURIComponent(stationName)}/current`);
    
//     if (response.data.success) {
//       console.log('✅ API调用成功');
//       console.log('📊 预测数据:', {
//         站点: response.data.data.stationName,
//         集合: response.data.data.collectionName,
//         温度: response.data.data.temperature + '℃',
//         压力: response.data.data.pressure + 'MPa',
//         数据索引: response.data.data.dataIndex,
//         总记录数: response.data.data.totalRecords
//       });
//     } else {
//       console.log('❌ API调用失败:', response.data.message);
//     }
    
//   } catch (error) {
//     console.log('❌ 请求失败:', error.message);
//     if (error.response) {
//       console.log('📋 错误详情:', error.response.data);
//     }
//   }
// }

// // 测试批量站点预测数据
// async function testBatchStationPrediction(stationNames) {
//   try {
//     console.log(`\n=== 测试批量预测数据 ===`);
//     console.log('🎯 站点列表:', stationNames.join(', '));
    
//     const response = await axios.post(`${BASE_URL}/prediction/stations/batch`, {
//       stationNames: stationNames,
//       dataType: 'current'
//     });
    
//     if (response.data.success) {
//       console.log('✅ 批量API调用成功');
      
//       Object.keys(response.data.data).forEach(stationName => {
//         const stationData = response.data.data[stationName];
        
//         if (stationData.error) {
//           console.log(`❌ ${stationName}: ${stationData.error}`);
//         } else {
//           console.log(`📊 ${stationName}:`, {
//             温度: stationData.temperature + '℃',
//             压力: stationData.pressure + 'MPa',
//             数据索引: stationData.dataIndex
//           });
//         }
//       });
//     } else {
//       console.log('❌ 批量API调用失败:', response.data.message);
//     }
    
//   } catch (error) {
//     console.log('❌ 批量请求失败:', error.message);
//     if (error.response) {
//       console.log('📋 错误详情:', error.response.data);
//     }
//   }
// }

// // 测试预测数据序列
// async function testPredictionSequence(stationName, count = 5) {
//   try {
//     console.log(`\n=== 测试 ${stationName} 预测序列 ===`);
    
//     const response = await axios.get(`${BASE_URL}/prediction/station/${encodeURIComponent(stationName)}/sequence?count=${count}`);
    
//     if (response.data.success) {
//       console.log('✅ 序列API调用成功');
//       console.log(`📊 获取到 ${response.data.count} 条预测数据:`);
      
//       response.data.data.forEach((item, index) => {
//         console.log(`  ${index + 1}. 温度: ${item.temperature}℃, 压力: ${item.pressure}MPa, 时间偏移: +${item.timeOffset}秒`);
//       });
//     } else {
//       console.log('❌ 序列API调用失败:', response.data.message);
//     }
    
//   } catch (error) {
//     console.log('❌ 序列请求失败:', error.message);
//     if (error.response) {
//       console.log('📋 错误详情:', error.response.data);
//     }
//   }
// }

// // 运行所有测试
// async function runAllTests() {
//   console.log('🚀 开始测试多站点预测数据API...');
  
//   // 测试各个站点
//   const stations = ['十字窖', '站点2', '黄埔', '东莞'];
  
//   // 单站点测试
//   for (const station of stations) {
//     await testSingleStationPrediction(station);
//     await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒
//   }
  
//   // 批量测试
//   await testBatchStationPrediction(stations);
  
//   // 预测序列测试
//   await testPredictionSequence('站点2', 3);
  
//   console.log('\n🎉 所有测试完成!');
// }

// // 检查服务器连接
// async function checkServerConnection() {
//   try {
//     console.log('🔍 检查服务器连接...');
//     const response = await axios.get(`${BASE_URL}/prediction/station/站点2/current`);
//     console.log('✅ 服务器连接正常');
//     return true;
//   } catch (error) {
//     console.log('❌ 服务器连接失败:', error.message);
//     console.log('💡 请确保:');
//     console.log('   1. 后端服务运行在 localhost:3000');
//     console.log('   2. MongoDB数据库可访问');
//     console.log('   3. 预测数据集合已创建');
//     return false;
//   }
// }

// // 主函数
// async function main() {
//   const isConnected = await checkServerConnection();
  
//   if (isConnected) {
//     await runAllTests();
//   } else {
//     console.log('\n⚠️ 跳过测试，请修复服务器连接问题');
//   }
// }

// // 如果直接运行此脚本
// if (require.main === module) {
//   main().catch(console.error);
// }

// module.exports = {
//   testSingleStationPrediction,
//   testBatchStationPrediction,
//   testPredictionSequence,
//   checkServerConnection
// }; 