const {Router} = require('express')
// 创建一个Router示例
let huangpuDongguanGet = new Router()

//引入查询cube
const vis_cube = require('../database/dao/vis_cube')

// 黄埔-东莞数据访问类
class HuangpuDongguan_cube extends vis_cube{
    constructor() {
        // 先调用父类构造函数
        super('temp', 'temp', 0);
        
        // 更新数据库设置
        this.dbName = '黄埔-东莞管段';
        this.collectionName = '实时数据'; // <-- 修改为指定的集合
        this.flag = 0;
        
        // 直接创建新的连接
        const MongoClient = require('mongodb').MongoClient;
        // 重新定义新URL
        const newUrl = 'mongodb://localhost:27017/'; // <-- 修改为本地数据库
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
            console.log('成功连接到黄埔-东莞数据库 (localhost)');
        } catch (err) {
            console.error('连接黄埔-东莞数据库失败:', err.message);
            console.log('将使用模拟数据模式');
            this.newClient = null; // 设置为null表示连接失败
        }
    }
    
    // 覆盖父类的查询方法，获取最新的一条数据
    vissl_findlastone() {
        return new Promise((resolve, reject) => {
            if (!this.newClient || !this.newClient.topology || !this.newClient.topology.isConnected()) {
                console.warn('数据库连接不可用，将返回模拟数据');
                // 返回一个符合数据结构的模拟数据
                const mockData = {
                    STN10_05_TI501: 25.1, STN10_05_PI501: 3.5,
                    STN10_05_TI502: 25.2, STN10_05_PI502: 3.6,
                    STN10_00_TI002: 26.1, STN10_00_PI019A: 4.5,
                    STN11_00_TI001: 24.9, STN11_00_PI001: 2.5,
                    isMock: true
                };
                resolve([mockData]);
                return;
            }
            
            let db = this.newClient.db(this.dbName);
            // 按 _id 降序排列，获取最新的一条记录
            db.collection(this.collectionName).find().sort({_id: -1}).limit(1).toArray(function(err, result) {
                if (err) {
                    console.error("数据库查询错误：", err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    // 获取最近30条记录的特定字段数据
    getLast30Records(count = 30) {
        return new Promise((resolve, reject) => {
            if (!this.newClient || !this.newClient.topology || !this.newClient.topology.isConnected()) {
                console.warn('数据库连接不可用，将返回模拟历史数据');
                // 生成模拟历史数据
                const mockData = [];
                const now = Date.now();
                
                for (let i = 0; i < count; i++) {
                    // 生成从当前时间往前的数据点，每条间隔5秒
                    const time = new Date(now - (count - i - 1) * 5000);
                    const variation = Math.sin(i * 0.2) * 0.5; // 使用正弦函数生成波动
                    
                    mockData.push({
                        STN10_00_PI019A: 4.5 + variation * 0.2,  // 黄埔出站压力
                        STN11_00_PI001: 2.5 + variation * 0.15,   // 东莞进站压力
                        STN10_00_TI002: 26.0 + variation,   // 黄埔出站温度
                        STN11_00_TI001: 24.5 + variation,   // 东莞进站温度
                        STN10_05_PI501: 3.5 + variation * 0.1,   // 十字窖#1压力
                        STN10_05_TI501: 25.0 + variation,   // 十字窖#1温度
                        STN10_05_PI502: 3.6 + variation * 0.12,   // 十字窖#2压力
                        STN10_05_TI502: 25.2 + variation,   // 十字窖#2温度
                        time: time.toISOString(),
                        _id: `mock_${i}`,
                        isMock: true
                    });
                }
                
                resolve(mockData);
                return;
            }
            
            let db = this.newClient.db(this.dbName);
            const fields = {
                'STN10_00_PI019A': 1,  // 黄埔出站压力
                'STN11_00_PI001': 1,   // 东莞进站压力
                'STN10_00_TI002': 1,   // 黄埔出站温度
                'STN11_00_TI001': 1,   // 东莞进站温度
                'STN10_05_PI501': 1,   // 十字窖#1压力
                'STN10_05_TI501': 1,   // 十字窖#1温度
                'STN10_05_PI502': 1,   // 十字窖#2压力
                'STN10_05_TI502': 1,   // 十字窖#2温度
                'time': 1,
                '_id': 1
            };
            
            db.collection(this.collectionName)
                .find({}, { projection: fields })
                .sort({_id: -1})
                .limit(count)
                .toArray(function(err, result) {
                    if (err) {
                        console.error("获取历史数据错误：", err);
                        reject(err);
                    } else {
                        // 逆序排列，确保时间升序
                        result.reverse();
                        resolve(result);
                    }
                });
        });
    }

    // 新增方法：根据指定索引获取数据
    getDataByIndex(dataIndex) {
        return new Promise((resolve, reject) => {
            if (!this.newClient) {
                reject(new Error('数据库连接不可用'));
                return;
            }

            // console.log(`按索引获取数据 - 数据索引: ${dataIndex}`);

            let db = this.newClient.db(this.dbName);
            
            // 获取指定索引对应的数据
            const fields = {
                'STN10_00_PI019A': 1,  // 黄埔出站压力
                'STN11_00_PI001': 1,   // 东莞进站压力
                'STN10_00_TI002': 1,   // 黄埔出站温度
                'STN11_00_TI001': 1,   // 东莞进站温度
                'STN10_05_PI501': 1,   // 十字窖#1压力
                'STN10_05_TI501': 1,   // 十字窖#1温度
                'STN10_05_PI502': 1,   // 十字窖#2压力
                'STN10_05_TI502': 1,   // 十字窖#2温度
                'time': 1,
                '_id': 1
            };

            db.collection(this.collectionName)
                .find({}, { projection: fields })
                .skip(dataIndex) // 跳过前面的数据
                .limit(1) // 只取一条
                .toArray((err, result) => {
                    if (err) {
                        console.error("获取指定索引数据错误：", err);
                        reject(err);
                    } else if (result && result.length > 0) {
                        const data = result[0];
                        
                        // 添加环境温度（使用黄埔出站温度减5度作为环境温度）
                        const environmentTemp = data['STN10_00_TI002'] ? (Number(data['STN10_00_TI002']) - 5) : 25;
                        
                        const responseData = {
                            // 保持原有数据结构
                            STN10_00_PI019A: data['STN10_00_PI019A'],  // 黄埔出站压力
                            STN11_00_PI001: data['STN11_00_PI001'],   // 东莞进站压力
                            STN10_00_TI002: data['STN10_00_TI002'],   // 黄埔出站温度
                            STN11_00_TI001: data['STN11_00_TI001'],   // 东莞进站温度
                            STN10_05_PI501: data['STN10_05_PI501'],   // 十字窖#1压力
                            STN10_05_TI501: data['STN10_05_TI501'],   // 十字窖#1温度
                            STN10_05_PI502: data['STN10_05_PI502'],   // 十字窖#2压力
                            STN10_05_TI502: data['STN10_05_TI502'],   // 十字窖#2温度
                            
                            // 新增字段
                            environmentTemp: environmentTemp,  // 环境温度
                            dataIndex: dataIndex + 1, // 数据库位置（从1开始显示）
                            timestamp: new Date().toISOString(),
                            description: `第${dataIndex + 1}条数据`,
                            time: data.time,
                            _id: data._id,
                            isSequentialData: true // 标记为顺序数据
                        };
                        resolve(responseData);
                    } else {
                        reject(new Error(`没有找到索引为${dataIndex}的数据`));
                    }
                });
        });
    }
}

var hpDg_cube = new HuangpuDongguan_cube()

// 创建一个新的HTTP GET接口，用于获取最新的实时数据
huangpuDongguanGet.get('/realtime/latest', async (req, res) => {
        try {
        // 获取当前系统时间
        const timestamp = new Date();
        
        // 获取四个站点的最新数据
        const data = await hpDg_cube.vissl_findlastone();
        
        // 向响应中添加时间戳
        res.json({
            success: true,
            timestamp: timestamp.toISOString(), // 添加ISO格式的时间戳
            data: data[0]
        });
        } catch (error) {
        console.error('获取实时数据失败:', error);
        res.status(500).json({
            success: false,
            timestamp: new Date().toISOString(),
            message: '获取实时数据失败'
        });
    }
});

// 新增：获取最近N条实时数据，用于图表初始化
huangpuDongguanGet.get('/realtime/recent', async (req, res) => {
    try {
        // 获取请求中的count参数，默认为6
        const count = parseInt(req.query.count) || 6;
        console.log(`获取最近${count}条实时数据`);
        
        // 获取最近的实时数据
        const data = await hpDg_cube.getLast30Records(count);
        
        // 添加时间偏移标记，类似预测数据
        const now = Date.now();
        const processedData = data.map((item, index) => {
            // 计算相对当前时间的偏移量（秒）
            const itemTime = new Date(item.time || now);
            const timeOffset = Math.round((now - itemTime.getTime()) / 1000);
            
            return {
                ...item,
                timeOffset: timeOffset,
                displayTime: new Date(now - timeOffset * 1000).toISOString()
            };
        });
        
        res.json({
            success: true,
            timestamp: new Date().toISOString(),
            count: processedData.length,
            data: processedData
        });
    } catch (error) {
        console.error('获取历史实时数据失败:', error);
        res.status(500).json({
            success: false,
            timestamp: new Date().toISOString(),
            message: '获取历史实时数据失败'
        });
    }
});

// 需要发送的字段列表
var targetFields = [
    'time',
    'STN10_00_PI019A',
    'STN10_00_PI019',
    'STN10_00_PI018A',
    'STN10_00_PI018B',
    'STN11_00_PI001',
    'STN10_00_II001',
    'STN10_00_II001B',
    'STN10_00_II002',
    'STN10_00_II002B',
    'STN10_00_TI002',
    'STN11_00_DI001A',
    'STN11_00_PI001A',
    'STN11_00_TI001',
    'STN10_05_TI501',
    'STN10_05_PI501',
    'STN10_05_PI502',
    'STN10_05_TI502',
    'STN11_00_FIQ004VOLUMEFLOW',
    'STN10_00_ZLC017',
    'STN10_00_ZLO017',
    'STN11_00_ZLC011',
    'STN11_00_ZLO011',
    'season_info',
    'state'
]

// 创建WebSocket服务器用于管段状态推送
const ws = require("nodejs-websocket");
const server = ws.createServer(function(conn){
    console.log('new connection for 黄埔-东莞管段状态...')

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
        console.log("黄埔-东莞管段状态 Disconnected.");
    });

    conn.on("error",function(code,reason) {
        console.log("黄埔-东莞管段状态 Error."+reason)
    });
}).listen(3092);

console.log("黄埔-东莞 WebSocket server running on port 3092...");

// 定时推送管段状态数据
setInterval(() => {
    server.connections.forEach((conn) => {
        hpDg_cube.vissl_findlastone().then(result => {
            if(result && result.length > 0) {
                var data = {}
                var latestData = result[0]

                // 提取需要的字段
                targetFields.forEach(field => {
                    if(latestData.hasOwnProperty(field)) {
                        data[field] = latestData[field]
                    }
                })

                // 添加时间戳
                data.time = latestData.time || Math.floor(Date.now() / 1000)

                // 重要：获取真实的节气信息
                if (latestData.season_info) {
                    data.season_info = latestData.season_info;
                } else {
                    // 如果没有节气信息，使用默认值
                    data.season_info = '霜降';
                }

                // 确保有状态信息（基于数据是否有效判断）
                if (!data.state) {
                    // 如果有压力数据且大于0，认为是运行状态
                    const hasPressureData = data['STN10_00_PI019A'] > 0 || data['STN11_00_PI001A'] > 0;
                    data.state = hasPressureData ? 'Run' : 'Stop';
                }

                console.log('推送管段状态数据:', {
                    time: data.time,
                    season_info: data.season_info,
                    state: data.state,
                    pressure1: data['STN10_00_PI019A'],
                    pressure2: data['STN11_00_PI001A']
                });

                conn.sendText(JSON.stringify(data))
            } else {
                console.log('未获取到黄埔-东莞管段数据，发送模拟数据')
                // 发送模拟数据
                var mockData = {
                    time: Math.floor(Date.now() / 1000),
                    state: 'Run',
                    season_info: '霜降',
                    'STN10_00_PI019A': 1.332,
                    'STN11_00_PI001A': 1.754,
                    error: "使用模拟数据"
                };
                conn.sendText(JSON.stringify(mockData));
            }
        }).catch(err => {
            console.error('查询黄埔-东莞管段数据失败:', err.message)
            // 发送模拟数据作为备选
            var mockData = {
                time: Math.floor(Date.now() / 1000),
                state: 'Stop',
                season_info: '霜降',
                'STN10_00_PI019A': 0,
                'STN11_00_PI001A': 0,
                error: "数据库查询失败"
            };
            conn.sendText(JSON.stringify(mockData));
        })
    })
}, 5000) // 每5秒发送一次

//输出数据
hpDg_cube.vissl_findlastone()
  .then(result => {
    console.log("获取到的黄埔-东莞数据样例：");
    if (result && result.length > 0) {
        console.log("节气信息:", result[0].season_info);
        console.log("压力数据:", {
            'STN10_00_PI019A': result[0]['STN10_00_PI019A'],
            'STN11_00_PI001A': result[0]['STN11_00_PI001A']
        });
    }
  })
  .catch(err => {
    console.error("获取黄埔-东莞数据出错:", err.message);
  });

module.exports = huangpuDongguanGet; 