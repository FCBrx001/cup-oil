let mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/pipeline',{useNewUrlParser:true},function(err){
    if(!err){
        console.log('connect success')
    }
    else{
        console.log(err)
    }
})
var contest = mongoose.Schema({
    name:{ type:String }, 
    age:{ type:Number }
})


//3、告诉保安我家的规则-----   创建模型对象
let contestmodel = mongoose.model('contest',contest,'contest')//用于生成某个集合对应的模型对象
//模型对象是mongoose用来操作数据库的基本单位，相当于mongodb的集合名

//将pressmodel模型对象暴露
module.exports = contestmodel