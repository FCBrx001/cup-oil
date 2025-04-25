var MongoClient = require('mongodb').MongoClient //npm i mongodb 安装驱动
var url = "mongodb://localhost:27017" //端口后面的data是数据库表示进入data数据库

//只要访问这个JS文件，就直接打开数据库
MongoClient.connect(url,function(err,db){
     
    //更新数据  updateOne更新一条数据  updateMany更新多条数据
    var whereStr = {"user":"张飞"}  //表示更新条件
    var updateStr = {$set:{"password":"44444"}}  //表示新的值
    dbase.collection('userlist').updateOne(whereStr,updateStr,function(err,result){
        console.log('文档更新成功',result);
        res.end()
    })
})
   
 
 