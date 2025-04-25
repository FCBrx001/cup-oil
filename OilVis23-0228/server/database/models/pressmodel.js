let mongoose = require('mongoose');

const connect = require('../mongodb/mongo')
connect('pipeline')


var press = mongoose.Schema({
    Timestamp:{ type:String },
    茂名出站压力:{ type:String },
    阳江进站压力:{ type:String },
    阳江出站压力:{ type:String },
    恩平进站压力:{ type:String },
    恩平出站压力:{ type:String },
    鹤山进站压力:{ type:String },
    鹤山出站压力:{ type:String },
    高明进站压力:{ type:String },
    高明出站压力:{ type:String },
    三水进站压力:{ type:String },
    三水至花都出站压力:{ type:String },
    花都进站压力:{ type:String }
})


//3、告诉保安我家的规则-----   创建模型对象
let pressmodel = mongoose.model('pressdata',press,'pressdata')//用于生成某个集合对应的模型对象
//模型对象是mongoose用来操作数据库的基本单位，相当于mongodb的集合名

//将pressmodel模型对象暴露
module.exports = pressmodel