//引入日志系统
var handle = require('./handle')
var logger = require('../log/index')
const datajson = require('./144data_json.js') 
const data_span10 = require('./144data_span10.js')
const datatrans = require('./datatrans')
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
const dbConnectionUrl = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(dbConnectionUrl, {
  useUnifiedTopology: true,
});


var basename = '全线'
var min5 = `${basename}_5min`
var min10 = `${basename}_10min`
var min30 = `${basename}_30min`
var min60 = `${basename}_60min`
var span10 = `${basename}_span10`


var docId

//定义一个空的二维数组span用来算均值
var span=Array(110);
var spancheck = 0; //span状态判断值
for(var j=0;j<span.length;j++){
    span[j]=Array(10);
}

client.connect(function(err, db) {
    
    if(!err)
    {
        console.log('connect successful')
        let time = new Date().format('yyyy-MM-dd HH:mm:ss.fff')
        logger.log(`[${time}] - pipeline connect successful`)

        var dbase = db.db("mongo")

        // //创建数据库的表
        // //创建5min抽取表
        // dbase.createCollection(min5)
        // coll_5min = dbase.collection(min5)
        // logger.log(`[${time}] - ${min5} create successful`)
        // //创建10min抽取表
        // dbase.createCollection(min10)
        // coll_10min = dbase.collection(min10)   
        // logger.log(`[${time}] - ${min10} create successful`)
        // //创建30min抽取表
        // dbase.createCollection(min30)
        // coll_30min = dbase.collection(min30)
        // logger.log(`[${time}] - ${min30} create successful`)
        // //创建60min抽取表
        // dbase.createCollection(min60)
        // coll_60min = dbase.collection(min60)
        // logger.log(`[${time}] - ${min60} create successful`)
        
        //创建派生库
        //创建144个表
        dbase.createCollection(span10)
        coll_144s = dbase.collection(span10)
        logger.log(`[${time}] - ${span10} create successful`)

        //创建源表
        dbase.createCollection(basename,function(err,collection){
            
            logger.log(`[${time}] - ${basename} create successful`)
            console.log('Collection create finished  !!!')     
            //行数    
            var i = 0;
            //文档号
            var tag_spandoc = -2
            var doc_num=0;
            //按行读取csv文件
            lineReader.eachLine('../sys_data/final8-12.csv', function(line, last){       
                //console.log(typeof(line))
                //生成源库
                // var tag = i%60;               
                // if(tag!=0){    
                //     //调用datajson，返回list,然后插入文档
                //     datajson(line,tag,doc_num,i,coll_5min,coll_10min,coll_30min,coll_60min).then(res=>{                     
                //             collection.findOneAndUpdate({_id:docId},{$push:res})
                //             collection.findOneAndUpdate({_id:docId},{$inc:{count:1}})                       
                //             i++                      
                //     })          
                // }
                // else{
                //     datajson(line,tag,doc_num,i,coll_5min,coll_10min,coll_30min,coll_60min).then(res=>{
                //         collection.insertOne(res)
                //         docId = res._id
                //         doc_num++
                //         i++
                //     })           
                // }
                //生成源库结束

                //生成派生库
                var tag_span = i%10
                if(tag_span==0)
                {tag_spandoc++}
                
                //每个10s的开头
                if(tag_span==0)
                {
                    //判断span是否为空，为空则存入第1秒到数据，不为空则先计算均值传给144data_span
                    if(spancheck)//span不为空
                    {
                        data_span10(tag_spandoc,coll_144s,span,110,line).then(res=>{
                            if(res==1)
                            {
                                //清空span
                                for(var i=0;i<span.length;i++){
                                    span[i].splice(0,span[i].length)
                                }
                            }
                        })
                        //console.log('调用datatrans前')
                        datatrans(3,line,110,'arr').then(res=>{
                            //console.log('datatrans返回数据：',res)
                            for(var k=0;k<span.length;k++)
                            {
                                span[k][0]=res[k]
                            }
                        })
                        spancheck=1
                    }
                    //span为空
                    else         
                    {
                        datatrans(3,line,110,'arr').then(res=>{
                            for(var k=0;k<span.length;k++)
                            {
                                span[k][0]=res[k]
                            }
                        })
                        spancheck=1
                    }
                    i++
                }
                //其他9s,将每一秒的数据放入span数组
                else{
                    //console.log('调用datatrans前')
                    datatrans(3,line,110,'arr').then(res=>{
                        //console.log('datatrans返回数据：',res)
                        var t = i%10
                        //console.log('t的值：',t)
                        for(var k=0;k<span.length;k++)
                        {
                            span[k][t]=res[k]
                            //console.log(`span[${k}][${t}]的值：`,span[k][t])
                        }
                        //span[i%10]=res
                    })
                    i++
                }
                //生成派生库结束
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