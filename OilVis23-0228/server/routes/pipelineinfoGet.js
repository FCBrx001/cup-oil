const {Router} = require('express')
const cors = require('cors')
// 创建一个Router示例
let pipelineInfoGet = new Router()

// 配置CORS，允许所有来源
pipelineInfoGet.use(cors({
    origin: '*', // 允许所有来源
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

//引入查询cube
const vis_cube = require('../database/dao/vis_cube')

// 管段信息数据访问类
class PipelineInfo_cube extends vis_cube{
    constructor() {
        // 先调用父类构造函数
        super('temp', 'temp', 0);
        
        // 重写数据库设置，但不关闭原有连接
        this.dbName = '管段信息';
        this.collectionName = '黄埔-东莞管段';
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
            console.log('成功连接到管段信息数据库');
        } catch (err) {
            console.error('连接管段信息数据库失败:', err.message);
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
    
    // 获取所有管段信息数据
    getAllPipelineData() {
        return new Promise((resolve, reject) => {
            if (!this.newClient) {
                reject(new Error('数据库连接不可用'));
                return;
            }
            
            let db = this.newClient.db(this.dbName);
            db.collection(this.collectionName).find({}, {projection: {_id: 1, '里程': 1, '高程': 1}}).toArray(function(err, result) {
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

var pipelineInfo_cube = new PipelineInfo_cube()

const ws = require("nodejs-websocket");
const server = ws.createServer(function(conn){
    console.log('new connection for 管段信息 data...')
    
    // 设置CORS头部
    conn.headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With'
    };
    
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
        console.log("管段信息 Disconnected.");
    });

    conn.on("error",function(code,reason) {
        console.log("管段信息 get Error."+reason)
    });
}).listen(3094) // 使用3094端口

// 需要发送的字段列表
var targetFields = [
    '里程',
    '高程'
]

setInterval(() => {
    server.connections.forEach((conn) => {
        // 检查数据库连接是否可用
        if (!pipelineInfo_cube.newClient) {
            // 如果数据库连接失败，发送模拟数据
            var mockData = {
                _id: "模拟数据ID",
                '里程': 30.92,
                '高程': 13.624
            };
            
            conn.sendText(JSON.stringify(mockData));
            return;
        }
        
        pipelineInfo_cube.vissl_findlastone().then(result => {
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
                console.log('未获取到管段信息数据')
            }
        }).catch(err => {
            console.error('查询管段信息数据失败:', err.message)
            // 发送模拟数据作为备选
            var mockData = {
                _id: "错误备选数据",
                '里程': 30.92,
                '高程': 13.624,
                error: "数据库查询失败"
            };
            conn.sendText(JSON.stringify(mockData));
        })
    })
}, 5000) // 每5秒发送一次

// 添加HTTP路由，用于获取最新数据
pipelineInfoGet.get('/latest', (req, res) => {
  pipelineInfo_cube.vissl_findlastone()
    .then(result => {
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
        
        res.json(data)
      } else {
        res.status(404).json({ error: '未找到数据' })
      }
    })
    .catch(err => {
      res.status(500).json({ error: err.message })
    });
});

// 添加HTTP路由，用于获取所有管段数据
pipelineInfoGet.get('/all', (req, res) => {
  pipelineInfo_cube.getAllPipelineData()
    .then(result => {
      if(result && result.length > 0) {
        res.json(result)
      } else {
        res.status(404).json({ error: '未找到数据' })
      }
    })
    .catch(err => {
      res.status(500).json({ error: err.message })
    });
});

// 添加一个页面路由，用于显示数据
pipelineInfoGet.get('/view', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>管段信息数据</title>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        .data-container { border: 1px solid #ddd; padding: 15px; border-radius: 5px; margin: 10px 0; }
        table { width: 100%; border-collapse: collapse; }
        table, th, td { border: 1px solid #ddd; }
        th, td { padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .refresh-btn { margin: 10px 0; padding: 8px 16px; background-color: #4CAF50; color: white; border: none; cursor: pointer; border-radius: 4px; }
        .refresh-btn:hover { background-color: #45a049; }
        .timestamp { margin-top: 10px; color: #666; }
        .latest-data { background-color: #e8f5e8; }
        .all-data { background-color: #f0f8ff; }
      </style>
    </head>
    <body>
      <h1>黄埔到东莞管段信息实时显示</h1>
      
      <h2>最新数据</h2>
      <button class="refresh-btn" onclick="fetchLatestData()">刷新最新数据</button>
      <div class="timestamp">最后更新时间: <span id="update-time"></span></div>
      <div class="data-container latest-data">
        <table id="latest-table">
          <thead>
            <tr>
              <th>参数名</th>
              <th>数值</th>
            </tr>
          </thead>
          <tbody id="latest-body">
            <tr>
              <td colspan="2">加载中...</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <h2>所有管段数据</h2>
      <button class="refresh-btn" onclick="fetchAllData()">刷新所有数据</button>
      <div class="data-container all-data">
        <table id="all-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>里程</th>
              <th>高程</th>
            </tr>
          </thead>
          <tbody id="all-body">
            <tr>
              <td colspan="3">加载中...</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <script>
        // 页面加载完成后获取数据
        document.addEventListener('DOMContentLoaded', function() {
          fetchLatestData();
          fetchAllData();
        });
        
        // WebSocket连接
        let ws = null;
        function connectWebSocket() {
          ws = new WebSocket('ws://' + window.location.hostname + ':3094');
          
          ws.onopen = function() {
            console.log('管段信息WebSocket连接成功');
          };
          
          ws.onmessage = function(event) {
            const data = JSON.parse(event.data);
            updateLatestTable(data);
          };
          
          ws.onclose = function() {
            console.log('管段信息WebSocket连接关闭，5秒后重连');
            setTimeout(connectWebSocket, 5000);
          };
          
          ws.onerror = function() {
            console.error('管段信息WebSocket连接错误');
            ws.close();
          };
        }
        
        // 连接WebSocket
        connectWebSocket();
        
        // 获取最新数据
        function fetchLatestData() {
          fetch('/pipeline/latest')
            .then(response => response.json())
            .then(data => {
              updateLatestTable(data);
            })
            .catch(error => {
              console.error('获取最新数据失败:', error);
              document.getElementById('latest-body').innerHTML = 
                '<tr><td colspan="2" style="color: red;">获取数据失败</td></tr>';
            });
        }
        
        // 获取所有数据
        function fetchAllData() {
          fetch('/pipeline/all')
            .then(response => response.json())
            .then(data => {
              updateAllTable(data);
            })
            .catch(error => {
              console.error('获取所有数据失败:', error);
              document.getElementById('all-body').innerHTML = 
                '<tr><td colspan="3" style="color: red;">获取数据失败</td></tr>';
            });
        }
        
        // 更新最新数据表格
        function updateLatestTable(data) {
          const tableBody = document.getElementById('latest-body');
          let html = '';
          
          // 更新时间戳
          document.getElementById('update-time').textContent = new Date().toLocaleString();
          
          // 遍历数据生成表格行
          for (const key in data) {
            if (key !== '_id') {  // 不显示_id字段
              html += '<tr>';
              html += '<td>' + key + '</td>';
              html += '<td>' + data[key] + '</td>';
              html += '</tr>';
            }
          }
          
          tableBody.innerHTML = html;
        }
        
        // 更新所有数据表格
        function updateAllTable(data) {
          const tableBody = document.getElementById('all-body');
          let html = '';
          
          if (Array.isArray(data)) {
            data.forEach(item => {
              html += '<tr>';
              html += '<td>' + (item._id || 'N/A') + '</td>';
              html += '<td>' + (item['里程'] || 'N/A') + '</td>';
              html += '<td>' + (item['高程'] || 'N/A') + '</td>';
              html += '</tr>';
            });
          } else {
            html = '<tr><td colspan="3">无数据</td></tr>';
          }
          
          tableBody.innerHTML = html;
        }
        
        // 每30秒自动刷新一次最新数据
        setInterval(fetchLatestData, 30000);
      </script>
    </body>
    </html>
  `);
});

console.log("管段信息 params server running on port 3094...");

//输出数据
pipelineInfo_cube.vissl_findlastone()
  .then(result => {
    console.log("获取到的管段信息数据：");
    console.log(JSON.stringify(result, null, 2));
  })
  .catch(err => {
    console.error("获取管段信息数据出错:", err.message);
  });

module.exports = pipelineInfoGet;