const http = require('http');

const testPredictionAPI = () => {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/prediction/station/' + encodeURIComponent('十字窖#2') + '/sequence?count=2',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`状态码: ${res.statusCode}`);
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        console.log('API响应:', JSON.stringify(jsonData, null, 2));
      } catch (e) {
        console.log('原始响应:', data);
      }
    });
  });

  req.on('error', (e) => {
    console.error('请求错误:', e.message);
  });

  req.end();
};

console.log('测试预测API...');
testPredictionAPI(); 