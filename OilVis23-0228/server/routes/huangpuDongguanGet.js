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
        
        // 重写数据库设置，但不关闭原有连接
        this.dbName = '黄埔-东莞管段';
        this.collectionName = '2024年7月-8月';
        this.flag = 0;
        
        // 直接创建新的连接
        const MongoClient = require('mongodb').MongoClient;
        // 重新定义新URL
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
            console.log('成功连接到黄埔-东莞数据库');
        } catch (err) {
            console.error('连接黄埔-东莞数据库失败:', err.message);
            console.log('将使用模拟数据模式');
            this.newClient = null; // 设置为null表示连接失败
        }
    }
    
    // 覆盖父类的查询方法，使用我们自己的客户端
    vissl_findlastone() {
        return new Promise((resolve, reject) => {
            if (!this.newClient) {
                reject(new Error('数据库连接不可用'));
                return;
            }
            
            let db = this.newClient.db(this.dbName);
            db.collection(this.collectionName).find().sort('_id', -1).limit(1).toArray(function(err, result) {
                if (err) {
                    console.error("数据库查询错误：", err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

var hpDg_cube = new HuangpuDongguan_cube()

const ws = require("nodejs-websocket");
const server = ws.createServer(function(conn){
    console.log('new connection for 黄埔-东莞 data...')
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
        console.log("黄埔-东莞 Disconnected.");
    });

    conn.on("error",function(code,reason) {
        console.log("黄埔-东莞 get Error."+reason)
    });
}).listen(3092) // 使用不同的端口号

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

setInterval(() => {
    server.connections.forEach((conn) => {
        // 检查数据库连接是否可用
        if (!hpDg_cube.newClient) {
            // 如果数据库连接失败，发送模拟数据
            var mockData = {
                _id: "模拟数据ID",
                time: Math.floor(Date.now() / 1000),
                STN10_00_PI019A: 0.962,
                STN10_00_PI019: 0.9585,
                STN10_00_PI018A: 0.9496,
                STN10_00_PI018B: 0.953,
                STN11_00_PI001: 0.847,
                STN10_00_II001: 830.900024,
                STN10_00_II001B: 834.661072,
                STN10_00_II002: 831.700012,
                STN10_00_II002B: 835.624573,
                STN10_00_TI002: 27.272507,
                STN11_00_DI001A: 838.530029,
                STN11_00_PI001A: 0.842569,
                STN11_00_TI001: 25.180008,
                STN10_05_TI501: 27.884998,
                STN10_05_PI501: 1.04,
                STN10_05_PI502: 1.0424,
                STN10_05_TI502: 27.924999,
                STN11_00_FIQ004VOLUMEFLOW: 0,
                STN10_00_ZLC017: 'ON',
                STN10_00_ZLO017: 'OFF',
                STN11_00_ZLC011: 'ON',
                STN11_00_ZLO011: 'OFF',
                season_info: '霜降',
                state: 'Shutdown'
            };
            
            conn.sendText(JSON.stringify(mockData));
            return;
        }
        
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
                
                // 添加_id字段
                if(latestData._id) {
                    data._id = latestData._id
                }
                
                conn.sendText(JSON.stringify(data))
            } else {
                console.log('未获取到黄埔-东莞数据')
            }
        }).catch(err => {
            console.error('查询黄埔-东莞数据失败:', err.message)
            // 发送模拟数据作为备选
            var mockData = {
                _id: "错误备选数据",
                time: Math.floor(Date.now() / 1000),
                error: "数据库查询失败"
            };
            conn.sendText(JSON.stringify(mockData));
        })
    })
}, 5000) // 每5秒发送一次

console.log("黄埔-东莞 params server running on port 3092...");

//输出数据
hpDg_cube.vissl_findlastone()
  .then(result => {
    console.log("获取到的黄埔-东莞数据：");
    console.log(JSON.stringify(result, null, 2));
  })
  .catch(err => {
    console.error("获取黄埔-东莞数据出错:", err.message);
  });



module.exports = huangpuDongguanGet; 