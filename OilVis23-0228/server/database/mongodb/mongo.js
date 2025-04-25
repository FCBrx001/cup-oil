let mongoose = require('mongoose');
//mongoose.Promise = global.Promise;
//mongoose.set('debug', true);
//1、连接数据库
//修改数据连接不再需要改动其他内容，只需要改这个地方

//------>修改数据库连接<------//
 
const PORT = 27017
const IP = '127.0.0.1'
const options = {
    //autoReconnect: true,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 10000,
    useNewUrlParser: true,//使用一个新的url解析器
    useUnifiedTopology:true//使用一个新的统一的拓扑结构
    //reconnectTries: Number.MAX_VALUE
};
//------>修改数据库连接<------//
//要想暴露一个函数，就把连接的所有内容放到一个function中

//db有了参数，所以db.js中的function connectMongo需要有内容接这个参数
//传回来的参数实际是一个回调函数，用callback去接，callback相当于一个函数即function(err）{}
function connectMongo(DB_NAME){
    //连接库1
    mongoose.connect(`mongodb://${IP}:${PORT}/${DB_NAME}`,{useNewUrlParser:true},function(err){
        if(err){
            console.log(`数据库${DB_NAME}连接失败`,err)
            //callback('connect failed')
        }else{
            console.log(`数据库${DB_NAME}连接成功`)
            //callback('connect success')
            //原本的操作数据库状态
        }
    }) 
}
// function openDatabase(databaseName){
//     var  mongoClient=require('mongodb').MongoClient;
//     var DB_STR="mongodb://localhost:27017/"+databaseName;
//     mongoClient.connect(DB_STR,function(err,db){
//         if(err) throw err;
//         console.log("数据库连接成功！");
        
//     })
// }
// module.exports=openDatabase;

//著需要传入要连接的库名
module.exports = connectMongo



// function connectMongo(DB_NAME1,DB_NAME2,PORT,IP,callback){
//     //连接数据库1
//     let db1  = mongoose.createConnection(`mongodb://${IP}:${PORT}/${DB_NAME1}`, options);
//     db1.on('open',function(err){
//         if(err){
//             console.log(`数据库${DB_NAME1}连接失败`,err)
//             callback('connect failed')
//         }else{
//             console.log(`数据库${DB_NAME1}连接成功`)
//             callback()
//             //原本的操作数据库状态
//         }
//     })
//     //连接数据库2
//     let db2  = mongoose.createConnection(`mongodb://${IP}:${PORT}/${DB_NAME2}`, options);
//     db2.on('open',function(err){
//         if(err){
//             console.log(`数据库${DB_NAME2}连接失败`,err)
//             callback('connect failed')
//         }else{
//             console.log(`数据库${DB_NAME2}连接成功`)
//             callback()
//             //原本的操作数据库状态
//         }
//     })
// }