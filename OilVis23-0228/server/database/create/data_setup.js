//引入日志系统
var handle = require('./handle')
var logger = require('../log/index')

// 添加format方法
Date.prototype.format = function (format) {
    if (!format) {
        format = 'yyyy-MM-dd HH:mm:ss';
    }
    // 用0补齐指定位数
    let padNum = function (value, digits) {
        return Array(digits - value.toString().length + 1).join('0') + value;
    };
    // 指定格式字符
    let cfg = {
        yyyy: this.getFullYear(), // 年
        MM: padNum(this.getMonth() + 1, 2), // 月
        dd: padNum(this.getDate(), 2), // 日
        HH: padNum(this.getHours(), 2), // 时
        mm: padNum(this.getMinutes(), 2), // 分
        ss: padNum(this.getSeconds(), 2), // 秒
        fff: padNum(this.getMilliseconds(), 3), // 毫秒
    };
    return format.replace(/([a-z]|[A-Z])(\1)*/ig, function (m) {
        return cfg[m];
    });
}

var lineReader = require('line-reader');
var readline = require('readline');
var MongoClient = require('mongodb').MongoClient;

//const MongoClient = require('mongodb').MongoClient;
const dbConnectionUrl = 'mongodb://192.168.1.103:27017';
const client = new MongoClient(dbConnectionUrl, {
  useUnifiedTopology: true,
});



const datajson = require('./data_json.js') 
var basename = '全线'
var min5 = `${basename}_5min`
var min10 = `${basename}_10min`
var min30 = `${basename}_30min`
var min60 = `${basename}_60min`


var docId
var event=0
client.connect(function(err, db) {
    
    if(!err)
    {
        console.log('connect successful')
        let time = new Date().format('yyyy-MM-dd HH:mm:ss.fff')
        logger.log(`[${time}] - pipeline connect successful`)

        var dbase = db.db("pipeline")

        //创建数据库的表
        dbase.createCollection(min5)
        coll_5min = dbase.collection(min5)
        
        logger.log(`[${time}] - ${min5} create successful`)

        dbase.createCollection(min10)
        coll_10min = dbase.collection(min10)
        
        logger.log(`[${time}] - ${min10} create successful`)

        dbase.createCollection(min30)
        coll_30min = dbase.collection(min30)
        
        logger.log(`[${time}] - ${min30} create successful`)

        dbase.createCollection(min60)
        coll_60min = dbase.collection(min60)
        
        logger.log(`[${time}] - ${min60} create successful`)
        
        dbase.createCollection(basename,function(err,collection){
            
            logger.log(`[${time}] - ${basename} create successful`)
            console.log('Collection create finished  !!!')

            
            //行数    
            var i=0;
            //文档号
            var doc_num=0;
            //按行读取csv文件

            lineReader.eachLine('../sys_data/final0-4.csv', function(line, last){       
                //console.log(typeof(line))
                var tag = i%60;
                
                    if(tag!=0){    
                        //调用datajson，返回list,然后插入文档
                        datajson(line,tag,doc_num,i,coll_5min,coll_10min,coll_30min,coll_60min).then(res=>{                     
                                collection.findOneAndUpdate({_id:docId},{$push:res})
                                collection.findOneAndUpdate({_id:docId},{$inc:{count:1}})                       
                                i++                      
                        })          
                    }
                    else{
                        datajson(line,tag,doc_num,i,coll_5min,coll_10min,coll_30min,coll_60min).then(res=>{
                            collection.insertOne(res)
                            docId = res._id
                            doc_num++
                            i++
                        })           
                    } 
            })                      
        })
    }
    else
    {
        console.log(err)
        let time = new Date().format('yyyy-MM-dd HH:mm:ss.fff');
        logger.error(`[${time}] - ${err}`)
    }
})