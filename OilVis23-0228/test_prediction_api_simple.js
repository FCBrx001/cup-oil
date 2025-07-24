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

//     req.setTimeout(5000, () => {
//       console.log(`⏰ 请求超时`);
//       console.log('─'.repeat(60));
//       req.destroy();
//       reject(new Error('请求超时'));
//     });

//     req.end();
//   });
// }

// // 测试POST请求
// function testPOSTAPI(path, body, description) {
//   return new Promise((resolve, reject) => {
//     const postData = JSON.stringify(body);
    
//     const options = {
//       hostname: 'localhost',
//       port: 3000,
//       path: path,
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Content-Length': Buffer.byteLength(postData)
//       }
//     };

//     console.log(`📡 测试: ${description}`);
//     console.log(`🔗 URL: http://localhost:3000${path}`);
//     console.log(`📦 请求体:`, JSON.stringify(body, null, 2));

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

//     req.setTimeout(5000, () => {
//       console.log(`⏰ 请求超时`);
//       console.log('─'.repeat(60));
//       req.destroy();
//       reject(new Error('请求超时'));
//     });

//     req.write(postData);
//     req.end();
//   });
// }

// // 执行测试
// async function runTests() {
//   const tests = [
//     // 测试单站点预测数据接口
//     {
//       type: 'GET',
//       path: '/prediction/station/十字窖%231/current',
//       description: '十字窖当前预测数据'
//     },
//     {
//       type: 'GET', 
//       path: '/prediction/station/十字窖%232/current',
//       description: '站点2当前预测数据'
//     },
//     {
//       type: 'GET',
//       path: '/prediction/station/黄埔/current', 
//       description: '黄埔当前预测数据'
//     },
//     {
//       type: 'GET',
//       path: '/prediction/station/东莞/current',
//       description: '东莞当前预测数据'
//     },
    
//     // 测试批量预测数据接口
//     {
//       type: 'POST',
//       path: '/prediction/stations/batch',
//       body: {
//         stationNames: ['十字窖', '站点2'],
//         dataType: 'current'
//       },
//       description: '批量获取预测数据（十字窖、#2）'
//     },
    
//     // 测试序列预测数据接口
//     {
//       type: 'GET',
//       path: '/prediction/station/十字窖%232/sequence',
//       description: '站点2序列预测数据'
//     }
//   ];

//   console.log(`📋 总共${tests.length}个测试用例\n`);

//   for (let i = 0; i < tests.length; i++) {
//     const test = tests[i];
//     console.log(`🔸 测试 ${i + 1}/${tests.length}:`);
    
//     try {
//       if (test.type === 'GET') {
//         await testAPI(test.path, test.description);
//       } else if (test.type === 'POST') {
//         await testPOSTAPI(test.path, test.body, test.description);
//       }
      
//       // 等待1秒再执行下一个测试
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//     } catch (error) {
//       console.log(`🔸 测试 ${i + 1} 失败，继续下一个测试\n`);
//     }
//   }

//   console.log('🎉 所有测试完成！');
// }

// // 开始测试
// runTests().catch(error => {
//   console.error('❌ 测试运行出错:', error);
//   process.exit(1);
// }); 