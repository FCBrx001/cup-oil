//--------引入日志系统---------//
var longer = require('../log/index')
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
//--------引入日志系统---------//


//引入转换数据转换格式
const datatrans2 = require('./datatrans2')
//求平均值函数
// function util(){
//     //将字段求平均
//     this.avg = function (o, field) {
//         if (o.constructor == Array) {
//             var count = o.length;
//             if (count != 0) {
//                 if (field) {
//                     var obj = this.sum(o, field);
//                     for (var key in obj) {
//                         obj[key] = obj[key] / count;
//                     }
//                     return obj;
//                 } else {
//                     return (this.sum(o) / count);
//                 }
//             } else {
//                 return null;
//             }
//         }
//     };
// }
// var ave= new util();

var doc_num = 0  //文档号字段值
var docId //文档ID

function data_span10(tag_spandoc,collection,span,length,line){
    var finish =0
    //console.log('10秒数据传入后：span',span)
    return new Promise((resolve,reject)=>{
        if(tag_spandoc%144==0){
            //创建文档
            //console.log('-----创建文档')
            let time = new Date().format('yyyy-MM-dd HH:mm:ss.fff')
            console.log(`[${time}] - 24min--${doc_num}号:文档创建---${doc_num}号`)
            datatrans2(span,length,doc_num,0).then(data=>{
                
                //console.log('【---创建----数组】',data)
                collection.insertOne(data)
                docId = data._id
                doc_num++
                finish=1
                resolve(finish)
            })  
        }else
        {
            //更新文档
                datatrans2(span,length,doc_num,1).then(data=>{
                    //update
                    //console.log('【---更新----数组】',data)
                    collection.findOneAndUpdate({_id:docId},{$push:data})
                    finish=1
                    resolve(finish)
                })
        }
    })
    
}


module.exports = data_span10
