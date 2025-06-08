const axios = require('axios');

async function testElevationAPI() {
    try {
        console.log('测试高程数据API...');
        const response = await axios.get('http://localhost:3000/elevation/elevation-data');
        
        console.log('API响应状态:', response.status);
        console.log('API响应数据:', response.data);
        
        if (response.data.success) {
            console.log('✅ API成功返回数据');
            console.log('数据点数量:', response.data.data.length);
            console.log('最大距离:', response.data.maxDistance);
        } else {
            console.log('⚠️ API返回失败状态:', response.data.message);
            console.log('这是正常的，因为数据库连接可能失败或无数据');
        }
    } catch (error) {
        console.error('❌ API测试失败:', error.message);
    }
}

// 运行测试
testElevationAPI(); 