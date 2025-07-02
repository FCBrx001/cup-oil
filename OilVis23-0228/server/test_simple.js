const http = require('http');

console.log('开始测试...');

const stationName = encodeURIComponent('十字窖#2');
const options = {
  hostname: 'localhost',
  port: 3000,
  path: `/prediction/station/${stationName}/current`,
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  console.log(`响应头:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('响应体:', data);
  });
});

req.on('error', (e) => {
  console.error(`请求遇到问题: ${e.message}`);
});

console.log('发送请求到:', `http://localhost:3000${options.path}`);

setTimeout(() => {
  console.log('5秒后强制退出测试');
  process.exit(0);
}, 5000);

req.end(); 