let mongoose = require('mongoose');
var enping = mongoose.Schema({
    文档号:{
        type:String,//限制学号必须为字符串
        //require:true,//限制学号必填项    
    }
})


//3、告诉保安我家的规则-----   创建模型对象
let epmodel = mongoose.model('enping',enping,'enping')//用于生成某个集合对应的模型对象
//模型对象是mongoose用来操作数据库的基本单位，相当于mongodb的集合名

//将pressmodel模型对象暴露
module.exports = epmodel