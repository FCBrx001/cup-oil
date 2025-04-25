let mongoose = require('mongoose');
let Schema = mongoose.Schema

let flow = new Schema({
    
})


//3、告诉保安我家的规则-----   创建模型对象
let flowmodel = mongoose.model('200s_flow',flow,'200s_flow')//用于生成某个集合对应的模型对象
//模型对象是mongoose用来操作数据库的基本单位，相当于mongodb的集合名

//将pressmodel模型对象暴露
module.exports = flowmodel  