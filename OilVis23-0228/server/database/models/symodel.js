let mongoose = require('mongoose');
let Schema = mongoose.Schema

let indexdata = new Schema({
    database_kind:{
        type:String,//限制学号必须为字符串
        //require:true,//限制学号必填项
        //unique:true,//限制学号唯一
    },
    database:{
        type:String,
        //require:true,//限制姓名必填项
    },
    station:{
        type:String,
        //require:true,//限制密码必填项
    },
    //info:Schema.Types.Mixed,//接收所有类型
    collec_name:{
        type:String,
        //require:true,//限制密码必填项
    },
    parameter:{
        type:String,
        //require:true,//限制密码必填项
    },
    url:{
        type:String,
        //require:true,//限制密码必填项
        //unique:true
    },
    date:{
        type:Date,
        default:Date.now()
    },
    enable_flag:{
        type:String,
        default:'Y'
    }
})


//3、告诉保安我家的规则-----   创建模型对象
let symodel = mongoose.model('indexdata',indexdata,'indexdata')//用于生成某个集合对应的模型对象
//模型对象是mongoose用来操作数据库的基本单位，相当于mongodb的集合名

//将usersmodel模型对象暴露
module.exports = symodel  