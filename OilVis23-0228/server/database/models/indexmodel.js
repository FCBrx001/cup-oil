let mongoose = require('mongoose');
let Schema = mongoose.Schema
// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://127.0.0.1:27017/index',{useNewUrlParser:true},function(err){
//     if(!err){
//         console.log('indexmodel-index connect success')
//     }
//     else{
//         console.log(err)
//     }
// })
let index = new Schema({
    database_kind:{
        type:String,//限制学号必须为字符串
        require:true,//限制学号必填项
        //unique:true,//限制学号唯一
    },
    database:{
        type:String,
        require:true,//限制姓名必填项
    },
    station:{
        type:String,
        require:true,//限制姓名必填项
    },
    collection:{
        type:String,
        require:true,//限制密码必填项
    },
    //info:Schema.Types.Mixed,//接收所有类型
    parameter:{
        type:Array,
        //require:true,//限制密码必填项
    },
    url:{
        type:String,
        require:true,//限制密码必填项

    },
    enable_flag:{
        type:String,
        default:'Y'
    }
})


//3、告诉保安我家的规则-----   创建模型对象
let indexmodel = mongoose.model('index1',index,'index1')//用于生成某个集合对应的模型对象
//模型对象是mongoose用来操作数据库的基本单位，相当于mongodb的集合名

//将usersmodel模型对象暴露
module.exports = indexmodel  