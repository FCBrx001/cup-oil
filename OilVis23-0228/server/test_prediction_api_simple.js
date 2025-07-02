// const http = require('http');

// console.log('🧪 开始测试预测数据API接口...\n');

// // 测试函数
// function testAPI(path, description) {
//   return new Promise((resolve, reject) => {
//     const options = {
//       hostname: 'localhost',
//       port: 3000,
//       path: path,
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     };

//     console.log(`📡 测试: ${description}`);
//     console.log(`🔗 URL: http://localhost:3000${path}`);

//     const req = http.request(options, (res) => {
//       let data = '';

//       res.on('data', (chunk) => {
//         data += chunk;
//       });

//       res.on('end', () => {
//         try {
//           const response = JSON.parse(data);
//           console.log(`✅ 状态码: ${res.statusCode}`);
//           console.log(`📄 响应:`, JSON.stringify(response, null, 2));
//           console.log('─'.repeat(60));
//           resolve(response);
//         } catch (error) {
//           console.log(`❌ JSON解析错误:`, error.message);
//           console.log(`📄 原始响应:`, data);
//           console.log('─'.repeat(60));
//           reject(error);
//         }
//       });
//     });

//     req.on('error', (error) => {
//       console.log(`❌ 请求错误:`, error.message);
//       console.log('─'.repeat(60));
//       reject(error);
//     });

//     req.setTimeout(10000, () => {
//       console.log(`⏰ 请求超时`);
//       console.log('─'.repeat(60));
//       req.destroy();
//       reject(new Error('请求超时'));
//     });

//     console.log('发送请求...');
//     req.end();
//   });
// }

// // 执行测试
// async function runTests() {
//   const tests = [
//     // 测试单站点预测数据接口
//     {
//       path: '/prediction/station/十字窖%232/current',
//       description: '十字窖#2当前预测数据'
//     }
//   ];

//   console.log(`📋 开始测试预测数据接口\n`);

//   for (let i = 0; i < tests.length; i++) {
//     const test = tests[i];
//     console.log(`🔸 测试 ${i + 1}/${tests.length}:`);
    
//     try {
//       await testAPI(test.path, test.description);
      
//     } catch (error) {
//       console.log(`🔸 测试 ${i + 1} 失败: ${error.message}\n`);
//     }
//   }

//   console.log('🎉 测试完成！');
// }

// // 开始测试
// runTests().catch(error => {
//   console.error('❌ 测试运行出错:', error);
//   process.exit(1);
// }); 