// 测试真实数据连接
const vis_cube = require('./database/dao/vis_cube');

// 高程数据cube结构
class elevation_cube extends vis_cube{
    constructor(dbname, collectionname) {
        super(`${dbname}`, `${collectionname}`, 0)
    }
}

// 创建高程数据cube实例
var hpDg_elevation_cube = new elevation_cube('管段信息', '黄埔-东莞管段');

console.log('🔗 测试真实数据库连接...');
console.log('数据库: 管段信息');
console.log('集合: 黄埔-东莞管段');
console.log('========================\n');

async function testRealData() {
    try {
        console.log('📡 开始查询数据...');
        const result = await hpDg_elevation_cube.vis_newoilfind();
        
        if (result && result.length > 0) {
            console.log(`✅ 成功获取数据！总数量: ${result.length}`);
            
            // 过滤有效数据
            const validData = result.filter(item => item.里程 !== undefined && item.高程 !== undefined);
            console.log(`📊 有效数据数量: ${validData.length}`);
            
            if (validData.length > 0) {
                console.log('\n📋 前5个数据样本:');
                validData.slice(0, 5).forEach((item, index) => {
                    console.log(`${index + 1}. _id: ${item._id}, 里程: ${item.里程}, 高程: ${item.高程}`);
                });
                
                // 计算最大里程
                const maxDistance = Math.max(...validData.map(item => item.里程));
                const minDistance = Math.min(...validData.map(item => item.里程));
                console.log(`\n📏 里程范围: ${minDistance.toFixed(3)} - ${maxDistance.toFixed(3)} km`);
                
                // 计算高程范围
                const maxElevation = Math.max(...validData.map(item => item.高程));
                const minElevation = Math.min(...validData.map(item => item.高程));
                console.log(`📈 高程范围: ${minElevation.toFixed(3)} - ${maxElevation.toFixed(3)} m`);
                
                console.log('\n✅ 数据格式验证通过！');
                console.log('🎯 前端图表将显示:');
                console.log(`   - 横坐标: 里程 0 到 ${maxDistance.toFixed(1)} km`);
                console.log(`   - 数据点数量: ${validData.length} 个`);
                console.log(`   - 高程数据: ${minElevation.toFixed(1)} 到 ${maxElevation.toFixed(1)} m`);
                
            } else {
                console.log('⚠️  没有找到包含里程和高程字段的有效数据');
            }
        } else {
            console.log('❌ 未获取到任何数据');
            console.log('💡 可能的原因:');
            console.log('   - 数据库连接问题');
            console.log('   - 集合名称不正确');
            console.log('   - 数据库权限问题');
        }
        
    } catch (error) {
        console.error('❌ 查询失败:', error.message);
        console.log('\n🔧 调试信息:');
        console.log('请检查:');
        console.log('1. 数据库服务是否运行');
        console.log('2. vis_cube 类是否正常工作');
        console.log('3. 数据库连接配置是否正确');
    }
}

// 运行测试
testRealData().then(() => {
    console.log('\n🎉 测试完成！');
    process.exit(0);
}).catch(error => {
    console.error('测试出错:', error);
    process.exit(1);
}); 