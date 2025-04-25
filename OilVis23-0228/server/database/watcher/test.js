const MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017";
//引入日志系统
var tag = 0
var logger = require('../log/index')
// 添加format方法

 
const client = new MongoClient(url, { useNewUrlParser: true });
client.connect().then(db => {
    console.log("success")
    const changeStream = client.db("pipeline").collection("huadu").watch();
    changeStream.on("change", next => {
    
        
        //logger.log(next)
        // if(next.operationType == "insert"  || next.operationType == "update" )
        // {
        //     logger.log(next)
        // }

        if(next.operationType == "insert")
        {
            
            var doc = next.fullDocument
            console.log(doc['label标签'][0])
        }
        if(next.operationType == "update" )
        {
            tag++
            if(tag==60)
            {tag=1}
            //console.log(tag)
            var label = next.updateDescription.updatedFields
            //logger.log(label)
            console.log(`update${tag}:`+label[`label标签.${tag}`])
        }
    })
})
