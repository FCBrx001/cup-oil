const {Router} = require('express')
// 创建一个Router示例
let elevationDataGet = new Router()

//引入查询cube
const vis_cube = require('../database/dao/vis_cube')

// 高程数据访问类 - 完全仿照huangpuDongguanGet.js的成功模式
class ElevationData_cube extends vis_cube{
    constructor() {
        // 先调用父类构造函数
        super('temp', 'temp', 0);
        
        // 重写数据库设置，但不关闭原有连接
        this.dbName = '管段信息';
        this.collectionName = '黄埔-东莞管段';
        this.flag = 0;
        
        // 直接创建新的连接
        const MongoClient = require('mongodb').MongoClient;
        // 重新定义新URL - 与huangpuDongguanGet.js完全一致
        const newUrl = 'mongodb://root:examplepassword@10.1.16.50:9101/';
        // 创建新客户端
        this.newClient = new MongoClient(newUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 5000,
            serverSelectionTimeoutMS: 5000,
        });
        
        // 异步连接
        this.connectToDatabase();
    }
    
    async connectToDatabase() {
        try {
            await this.newClient.connect();
            console.log('✅ 成功连接到高程数据库');
        } catch (err) {
            console.error('❌ 连接高程数据库失败:', err.message);
            console.log('将使用模拟数据模式');
            this.newClient = null; // 设置为null表示连接失败
        }
    }
    
    // 完全按照huangpuDongguanGet.js模式的查询方法
    getAllElevationData() {
        return new Promise((resolve, reject) => {
            if (!this.newClient) {
                reject(new Error('数据库连接不可用'));
                return;
            }
            
            let db = this.newClient.db(this.dbName);
            db.collection(this.collectionName).find({
                '里程': { $exists: true },
                '高程': { $exists: true }
            }).sort({ '里程': 1 }).toArray(function(err, result) {
                if (err) {
                    console.error("高程数据查询错误：", err);
                    reject(err);
                } else {
                    console.log(`📊 数据库查询成功，获得 ${result ? result.length : 0} 条记录`);
                    if (result && result.length > 0) {
                        console.log('📋 前3条原始数据样本:', result.slice(0, 3));
                    }
                    resolve(result);
                }
            });
        });
    }

    // 调试查询方法
    getAllData() {
        return new Promise((resolve, reject) => {
            if (!this.newClient) {
                reject(new Error('数据库连接不可用'));
                return;
            }
            
            let db = this.newClient.db(this.dbName);
            db.collection(this.collectionName).find().limit(10).toArray(function(err, result) {
                if (err) {
                    console.error("数据查询错误：", err);
                    reject(err);
                } else {
                    console.log(`🔍 调试查询成功，获得 ${result ? result.length : 0} 条记录`);
                    if (result && result.length > 0) {
                        console.log('🔍 数据字段示例:', Object.keys(result[0]));
                    }
                    resolve(result);
                }
            });
        });
    }
}

var elevation_cube = new ElevationData_cube()

const ws = require("nodejs-websocket");
const server = ws.createServer(function(conn){
    console.log('new connection for elevation data...')
    conn.on("text",function(e){
        switch(e){
            case 'close':
                console.log("当前链接已断开")
                conn.close()
                break;
            default:
                break;
        }
    });

    conn.on("close",function(code,reason) {
        console.log("elevation data Disconnected.");
    });

    conn.on("error",function(code,reason) {
        console.log("elevation data get Error."+reason)
    });
}).listen(3093) // 使用端口3093

// 添加Express路由来获取高程数据
elevationDataGet.get('/elevation-data', async (req, res) => {
    try {
        console.log('🔍 开始查询高程数据...');
        console.log('数据库: 管段信息, 集合: 黄埔-东莞管段');
        
        // 使用自定义的查询方法获取数据
        const elevationData = await elevation_cube.getAllElevationData();
        
        console.log(`📊 查询结果: ${elevationData ? elevationData.length : 0} 条记录`);
        
        if (elevationData && elevationData.length > 0) {
            console.log('📋 前3条原始数据:', elevationData.slice(0, 3));
            
            // 处理数据格式，确保里程和高程字段存在
            const processedData = elevationData
                .filter(item => {
                    const hasFields = item.里程 !== undefined && item.高程 !== undefined;
                    if (!hasFields) {
                        console.log('⚠️ 跳过无效数据:', {
                            _id: item._id,
                            hasDistance: item.里程 !== undefined,
                            hasElevation: item.高程 !== undefined,
                            availableFields: Object.keys(item)
                        });
                    }
                    return hasFields;
                })
                .map(item => ({
                    _id: item._id,
                    里程: parseFloat(item.里程),
                    高程: parseFloat(item.高程)
                }))
                .sort((a, b) => a.里程 - b.里程); // 按里程排序
            
            console.log(`✅ 有效数据数量: ${processedData.length}`);
            
            if (processedData.length > 0) {
                const maxDistance = Math.max(...processedData.map(item => item.里程));
                const minDistance = Math.min(...processedData.map(item => item.里程));
                
                console.log(`📏 里程范围: ${minDistance.toFixed(3)} - ${maxDistance.toFixed(3)} m (原始数据)`);
                console.log(`📏 里程范围: ${(minDistance/1000).toFixed(3)} - ${(maxDistance/1000).toFixed(3)} km (转换后)`);
                
                res.json({
                    success: true,
                    data: processedData,
                    maxDistance: maxDistance, // 保持原始米单位，前端会转换
                    minDistance: minDistance,
                    count: processedData.length
                });
            } else {
                console.log('⚠️ 没有有效的里程和高程数据，使用模拟数据');
                // 如果没有有效数据，提供模拟数据
                const mockData = generateMockElevationData();
                res.json({
                    success: true,
                    data: mockData,
                    maxDistance: Math.max(...mockData.map(item => item.里程)),
                    count: mockData.length,
                    message: '数据库无有效高程数据，使用模拟数据'
                });
            }
        } else {
            console.log('❌ 数据库查询无结果，使用模拟数据');
            // 如果数据库没有数据，提供模拟数据
            const mockData = generateMockElevationData();
            res.json({
                success: true,
                data: mockData,
                maxDistance: Math.max(...mockData.map(item => item.里程)),
                count: mockData.length,
                message: '数据库无数据，使用模拟数据'
            });
        }
    } catch (error) {
        console.error('❌ 获取高程数据失败:', error.message);
        console.error('错误堆栈:', error.stack);
        
        // 即使出错也提供模拟数据
        const mockData = generateMockElevationData();
        res.json({
            success: true,
            data: mockData,
            maxDistance: Math.max(...mockData.map(item => item.里程)),
            count: mockData.length,
            message: '数据库连接失败，使用模拟数据',
            error: error.message
        });
    }
});

// 添加调试端点
elevationDataGet.get('/debug-data', async (req, res) => {
    try {
        console.log('🔍 调试查询所有数据...');
        const allData = await elevation_cube.getAllData();
        
        res.json({
            success: true,
            message: '调试数据查询',
            totalCount: allData ? allData.length : 0,
            sampleData: allData ? allData.slice(0, 5) : [],
            fields: allData && allData.length > 0 ? Object.keys(allData[0]) : []
        });
    } catch (error) {
        res.json({
            success: false,
            message: '调试查询失败',
            error: error.message
        });
    }
});

// 生成模拟高程数据的函数
function generateMockElevationData() {
    return [
        { _id: '1', 里程: 0, 高程: 65.2 },
        { _id: '2', 里程: 5.5, 高程: 78.1 },
        { _id: '3', 里程: 12.3, 高程: 92.4 },
        { _id: '4', 里程: 18.7, 高程: 156.8 },
        { _id: '5', 里程: 25.1, 高程: 234.5 },
        { _id: '6', 里程: 32.9, 高程: 312.7 },
        { _id: '7', 里程: 40.2, 高程: 278.3 },
        { _id: '8', 里程: 47.8, 高程: 345.9 },
        { _id: '9', 里程: 55.6, 高程: 398.2 },
        { _id: '10', 里程: 63.4, 高程: 421.6 },
        { _id: '11', 里程: 71.2, 高程: 386.4 },
        { _id: '12', 里程: 78.9, 高程: 452.8 },
        { _id: '13', 里程: 86.7, 高程: 467.3 },
        { _id: '14', 里程: 94.4, 高程: 489.1 }
    ];
}

// 添加测试端点，可以返回不同数量的数据点
elevationDataGet.get('/test-elevation/:count', async (req, res) => {
    const count = parseInt(req.params.count) || 10;
    
    // 生成指定数量的测试数据
    const mockData = [];
    for (let i = 0; i < count; i++) {
        const distance = (94.4 * i) / (count - 1); // 均匀分布在0到94.4公里
        const elevation = 60 + Math.random() * 400 + Math.sin(i / count * Math.PI * 3) * 100; // 模拟地形变化
        
        mockData.push({
            _id: `test_${i + 1}`,
            里程: parseFloat(distance.toFixed(1)),
            高程: parseFloat(elevation.toFixed(1))
        });
    }
    
    res.json({
        success: true,
        data: mockData,
        maxDistance: 94.4,
        count: mockData.length,
        message: `测试数据：${count}个数据点`
    });
});

// WebSocket定时发送数据
setInterval(() => {
    server.connections.forEach((conn) => {
        // 检查数据库连接是否可用
        if (!elevation_cube.newClient) {
            // 如果数据库连接失败，发送模拟数据
            const mockData = generateMockElevationData();
            const failureResponse = {
                success: true,
                data: mockData,
                maxDistance: Math.max(...mockData.map(item => item.里程)),
                count: mockData.length,
                message: "数据库连接失败，使用模拟数据",
                timestamp: new Date().toISOString()
            };
            
            conn.sendText(JSON.stringify(failureResponse));
            return;
        }
        
        elevation_cube.getAllElevationData().then(result => {
            if (result && result.length > 0) {
                // 处理数据格式
                const processedData = result
                    .filter(item => item.里程 !== undefined && item.高程 !== undefined)
                    .map(item => ({
                        _id: item._id,
                        里程: parseFloat(item.里程),
                        高程: parseFloat(item.高程)
                    }))
                    .sort((a, b) => a.里程 - b.里程);
                
                const responseData = {
                    success: true,
                    data: processedData,
                    maxDistance: processedData.length > 0 ? Math.max(...processedData.map(item => item.里程)) : 94.4,
                    count: processedData.length,
                    timestamp: new Date().toISOString()
                };
                
                conn.sendText(JSON.stringify(responseData));
            } else {
                console.log('未获取到高程数据，发送模拟数据')
                const mockData = generateMockElevationData();
                const noDataResponse = {
                    success: true,
                    data: mockData,
                    maxDistance: Math.max(...mockData.map(item => item.里程)),
                    count: mockData.length,
                    message: "数据库无数据，使用模拟数据",
                    timestamp: new Date().toISOString()
                };
                conn.sendText(JSON.stringify(noDataResponse));
            }
        }).catch(err => {
            console.error('查询高程数据失败:', err.message)
            // 发送错误数据作为备选
            const mockData = generateMockElevationData();
            const errorData = {
                success: true,
                data: mockData,
                maxDistance: Math.max(...mockData.map(item => item.里程)),
                count: mockData.length,
                message: "数据库查询失败，使用模拟数据",
                error: err.message,
                timestamp: new Date().toISOString()
            };
            conn.sendText(JSON.stringify(errorData));
        })
    })
}, 5000) // 每5秒发送一次

console.log("elevation data server running on port 3093...");

//输出数据用于调试
elevation_cube.getAllElevationData()
  .then(result => {
    console.log("获取到的高程数据数量：", result ? result.length : 0);
    if (result && result.length > 0) {
        const validData = result.filter(item => item.里程 !== undefined && item.高程 !== undefined);
        // console.log("有效高程数据数量：", validData.length);
        if (validData.length > 0) {
            // console.log("示例数据：", validData.slice(0, 3));
        }
    }
  })
  .catch(err => {
    // console.error("获取高程数据出错:", err.message);
  });

module.exports = elevationDataGet; 