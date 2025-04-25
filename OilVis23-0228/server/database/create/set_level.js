//设置块大小，传入每一行的数据，达到块的上限值，插入到另一个数据库中
//不同的块大小用同一个文件，根据时间段来计算值然后保存创建collection即可
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

function set_level(list2,sum,coll_5min,coll_10min,coll_30min,coll_60min){
    
    if(sum%300==0){
        coll_5min.insertOne(list2)
        let time = new Date().format('yyyy-MM-dd HH:mm:ss.fff')
        longer.log(`[${time}] - 5min--${sum/300}号:文档创建---${sum/300}号`)
    }
    if(sum%600==0){                
        coll_10min.insertOne(list2)
        let time = new Date().format('yyyy-MM-dd HH:mm:ss.fff')
        longer.log(`[${time}] - 10min--${sum/600}号:文档创建---${sum/600}号`)
    }
    if(sum%1800==0)
    {
        coll_30min.insertOne(list2)
        let time = new Date().format('yyyy-MM-dd HH:mm:ss.fff')
        longer.log(`[${time}] - 30min--${sum/1800}号:文档创建---${sum/1800}号`) 
    }
    if(sum%3600==0)
    {
        coll_60min.insertOne(list2)
        let time = new Date().format('yyyy-MM-dd HH:mm:ss.fff')
        console.log(`[${time}] - 60min--${sum/3600}号:文档创建---${sum/3600}号`)
        longer.log(`[${time}] - 60min--${sum/3600}号:文档创建---${sum/3600}号`)
    }
}

module.exports = set_level