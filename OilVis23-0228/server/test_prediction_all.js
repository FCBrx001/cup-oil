const axios = require('axios');

async function testPredictionAll() {
  console.log('🧪 测试获取所有预测数据功能...\n');
  
  try {
    // 测试获取十字窖#2的所有预测数据
    console.log('🌐 测试API: GET /prediction/station/十字窖#2/all');
    
    const response = await axios.get('http://localhost:3000/prediction/station/十字窖%232/all');
    
    if (response.data.success) {
      console.log('✅ API调用成功');
      console.log(`📊 获取到 ${response.data.count} 条预测数据:`);
      
      response.data.data.forEach((item, index) => {
        console.log(`预测数据${index + 1}:`);
        console.log(`  - 数据索引: ${item.dataIndex}`);
        console.log(`  - 温度: ${item.temperature}℃`);
        console.log(`  - 压力: ${item.pressure}MPa`);
        console.log(`  - 站点: ${item.stationName}`);
        console.log('');
      });
      
      console.log('💡 说明: 这些数据将在前端转换为时间序列，每5秒一个点');
      console.log('📈 前端将把这10条数据展示为未来50秒的预测曲线');
      
    } else {
      console.error('❌ API调用失败:', response.data.message);
    }
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ 连接被拒绝 - 请确保后端服务器已启动');
    } else {
      console.error('❌ API调用出错:', error.message);
    }
  }
}

// 启动测试
testPredictionAll(); 