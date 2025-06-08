// 测试新的高程数据获取
console.log('🔗 测试新版elevationDataGet.js...');

try {
    const elevationGet = require('./routes/elevationDataGet.js');
    console.log('✅ 模块加载成功');
    
    // 等待一点时间让数据库连接完成
    setTimeout(() => {
        console.log('🎉 测试完成，可以启动服务器了');
        process.exit(0);
    }, 3000);
    
} catch (error) {
    console.error('❌ 模块加载失败:', error.message);
    console.error('错误详情:', error);
    process.exit(1);
} 