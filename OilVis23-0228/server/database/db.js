let mongoose = require('mongoose');
//1、连接数据库
//修改数据连接不再需要改动其他内容，只需要改这个地方

//------>修改数据库连接<------//
const DB_NAME = 'test' 
const PORT = 27017
const IP = 'localhost'
//------>修改数据库连接<------//

//要想暴露一个函数，就把连接的所有内容放到一个function中
//db有了参数，所以db.js中的function connectMongo需要有内容接这个参数
//传回来的参数实际是一个回调函数，用callback去接，callback相当于一个函数即function(err）{}
function connectMongo(){
//1、连接数据库
    mongoose.connect(`mongodb://${IP}:${PORT}/${DB_NAME}`,{
    useNewUrlParser: true,//使用一个新的url解析器
    useUnifiedTopology:true//使用一个新的统一的拓扑结构
})
//2、绑定监听
mongoose.connection.on('open',function(err){
    if(err){
        console.log('数据库连接失败',err)
        //callback('connect failed')
    }else{
        console.log('数据库连接成功')
        //callback()
        //原本的操作数据库状态
    }
})
}
module.exports = connectMongo